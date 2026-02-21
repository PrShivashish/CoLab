import React, { useRef, useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Loader2, Zap, MessageSquare, Settings as SettingsIcon, Wand2 } from 'lucide-react';
import { initSocket } from '../socket';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { cn } from '../utils/cn';
import axios from 'axios';
import LanguageSelector from './LanguageSelector';
import OutputPanel from './OutputPanel';
import EditorSidebar from './EditorSidebar';
import { SpotlightButton } from './ui/SpotlightButton';
import { JoinNotification } from './ui/JoinNotification';
import ShareMenu from './ShareMenu';
import ThemeToggle from './ThemeToggle';
import { getCurrentTheme } from '../theme/themeConfig';

// AI imports
import AIToggle from './AIToggle';
import AIChat from './AIChat';
import AISettings from './AISettings';
import CodeAnalysis from './CodeAnalysis';
import DebugSuggestions from './DebugSuggestions';
import CodeGenerator from './CodeGenerator';
import { useAIAutocomplete } from '../hooks/useAIAutocomplete';
import aiSettings from '../utils/aiStorage';
import aiService from '../services/aiService';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

// All known starter codes — used to detect if user has modified code
const STARTER_CODES = {
  javascript: '// Welcome to CoLab!\n// Start coding instantly.\n\nconsole.log("Hello, World!");',
  python: '# Welcome to CoLab!\n# Start coding instantly.\n\nprint("Hello, World!")',
  java: '// Welcome to CoLab!\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
  cpp: '// Welcome to CoLab!\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}',
  c: '// Welcome to CoLab!\n#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}',
  go: '// Welcome to CoLab!\npackage main\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}',
  typescript: '// Welcome to CoLab!\n// Start coding instantly.\n\nconsole.log("Hello, World!");',
  rust: '// Welcome to CoLab!\nfn main() {\n    println!("Hello, World!");\n}',
  ruby: '# Welcome to CoLab!\n# Start coding instantly.\n\nputs "Hello, World!"',
  php: '<?php\n// Welcome to CoLab!\n// Start coding instantly.\n\necho "Hello, World!";\n?>',
  kotlin: '// Welcome to CoLab!\nfun main() {\n    println("Hello, World!")\n}',
  swift: '// Welcome to CoLab!\nimport Foundation\n\nprint("Hello, World!")',
  csharp: '// Welcome to CoLab!\nusing System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello, World!");\n    }\n}',
};

const getStarterCode = (language) => STARTER_CODES[language] || `// Welcome to CoLab!\n// Start coding in ${language}.`;

// Check if the current code is unmodified (matches any known starter or is empty)
const isStarterCode = (code) => {
  if (!code || code.trim() === '') return true;
  return Object.values(STARTER_CODES).some(starter => code.trim() === starter.trim());
};

export default function MonacoCodeEditor() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const socketRef = useRef(null);
  const codeRef = useRef('');
  const isRemoteUpdate = useRef(false);

  const [users, setUsers] = useState([]);
  const [code, setCode] = useState(getStarterCode('javascript'));
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);

  // AI state
  const [aiEnabled, setAiEnabled] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [showChat, setShowChat] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);
  const [codeAnalysis, setCodeAnalysis] = useState(null);
  const [debugHelp, setDebugHelp] = useState(null);

  // AI autocomplete hook
  const { suggestion, acceptSuggestion, dismissSuggestion } = useAIAutocomplete(
    code,
    cursorPosition,
    language,
    aiEnabled
  );

  // Load AI enabled state on mount
  useEffect(() => {
    setAiEnabled(aiSettings.get('autocomplete'));
  }, []);

  // --- Theme Definition & Sync ---
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Define Themes
    monaco.editor.defineTheme('glass-void', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6272a4', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'ff79c6' },
        { token: 'string', foreground: 'f1fa8c' },
        { token: 'identifier', foreground: '8be9fd' },
      ],
      colors: {
        'editor.background': '#18181b', // sleek-bg
        'editor.foreground': '#f8f8f2',
        'editor.lineHighlightBackground': '#27272a',
        'editorCursor.foreground': '#a1a1aa',
        'editor.selectionBackground': '#3b82f640',
        'editor.inactiveSelectionBackground': '#3b82f620',
      },
    });

    monaco.editor.defineTheme('clean-light', {
      base: 'vs',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#ffffff',
        'editor.lineHighlightBackground': '#f4f4f5',
        'editor.selectionBackground': '#6366f130',
      },
    });

    monaco.editor.defineTheme('adrenaline', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '7000FF', fontStyle: 'italic bold' }, // Purple
        { token: 'keyword', foreground: 'FF0099', fontStyle: 'bold' }, // Magenta
        { token: 'string', foreground: 'CCFF00' }, // Lime
        { token: 'function', foreground: '00F0FF' }, // Cyan
        { token: 'type', foreground: '00F0FF', fontStyle: 'underline' },
        { token: 'number', foreground: 'FFCC00' }, // Yellow
      ],
      colors: {
        'editor.background': '#050505',
        'editor.foreground': '#00F0FF',
        'editor.lineHighlightBackground': '#101010',
        'editorCursor.foreground': '#CCFF00',
        'editor.selectionBackground': '#FF009940',
        'editor.lineHighlightBorder': '#00F0FF40',
      },
    });

    // Set Initial Theme
    updateMonacoTheme(getCurrentTheme());

    // Add keyboard listeners for AI features
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK, () => {
      setShowChat(prev => !prev);
    });

    //Track cursor position for autocomplete
    editor.onDidChangeCursorPosition((e) => {
      const position = editor.getModel().getOffsetAt(e.position);
      setCursorPosition(position);
    });

    // Accept suggestion with Tab
    editor.addCommand(monaco.KeyCode.Tab, () => {
      if (suggestion) {
        const accepted = acceptSuggestion();
        if (accepted) {
          const position = editor.getPosition();
          editor.executeEdits('', [{
            range: new monaco.Range(
              position.lineNumber,
              position.column,
              position.lineNumber,
              position.column
            ),
            text: accepted,
          }]);
          return;
        }
      }
      // Default Tab behavior
      editor.trigger('keyboard', 'type', { text: '\t' });
    }, '!suggestWidgetVisible');
  };

  const updateMonacoTheme = (themeName) => {
    if (!monacoRef.current) return;

    switch (themeName) {
      case 'light':
        monacoRef.current.editor.setTheme('clean-light');
        break;
      case 'adrenaline':
        monacoRef.current.editor.setTheme('adrenaline');
        break;
      case 'sleek':
      default:
        monacoRef.current.editor.setTheme('glass-void');
        break;
    }
  };

  useEffect(() => {
    const handleThemeChange = (e) => {
      updateMonacoTheme(e.detail.theme);
    };

    window.addEventListener('themeChange', handleThemeChange);
    return () => window.removeEventListener('themeChange', handleThemeChange);
  }, []);


  // --- Socket Logic ---
  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on('connect_error', (err) => {
        toast.error('Connection failed');
        navigate('/');
      });

      socketRef.current.on('connect', () => {
        const username = sessionStorage.getItem('username') || 'Anonymous'; // Note: In real app, pass this via navigation state or context
        socketRef.current.emit('join', { roomId, username });
      });

      socketRef.current.on('joined', ({ clients, username, socketId }) => {
        // Show beautiful toast notification when someone joins
        if (socketRef.current.id !== socketId) {
          toast.custom(
            (t) => <JoinNotification username={username} />,
            {
              duration: 4000,
              position: 'top-right',
            }
          );
        }
        setUsers(clients);

        if (socketRef.current.id !== socketId && codeRef.current) {
          socketRef.current.emit('sync-code', { code: codeRef.current, socketId });
        }

        if (socketRef.current.id !== socketId) {
          socketRef.current.emit('sync-language', { language, socketId });
        }
      });

      socketRef.current.on('disconnected', ({ clients }) => {
        setUsers(clients);
      });

      socketRef.current.on('code-changed', ({ code: newCode }) => {
        if (newCode !== null && newCode !== codeRef.current) {
          isRemoteUpdate.current = true;
          codeRef.current = newCode;
          setCode(newCode);
        }
      });

      socketRef.current.on('language-changed', ({ language: newLanguage }) => {
        if (newLanguage) setLanguage(newLanguage);
      });
    };

    init();
    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [roomId, navigate]);

  const handleEditorChange = (value) => {
    if (isRemoteUpdate.current) {
      isRemoteUpdate.current = false;
      return;
    }
    codeRef.current = value;
    setCode(value);
    if (socketRef.current) {
      socketRef.current.emit('code-change', { roomId, code: value });
    }
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    if (socketRef.current) {
      socketRef.current.emit('language-change', { roomId, language: newLanguage });
    }

    // Update editor content if current code is unmodified (any starter or empty)
    if (isStarterCode(code)) {
      const newCode = getStarterCode(newLanguage);
      setCode(newCode);
      codeRef.current = newCode;
      if (editorRef.current) {
        editorRef.current.setValue(newCode);
      }
      if (socketRef.current) socketRef.current.emit('code-change', { roomId, code: newCode });
    }
  };

  const handleRunCode = async () => {
    if (!code || code.trim() === '') {
      toast.error('Code is empty!');
      return;
    }
    setIsExecuting(true);
    setOutput('');
    setDebugHelp(null); // Clear previous debug help

    try {
      const response = await axios.post(`${BACKEND_URL}/api/execute`, {
        code: codeRef.current,
        language,
        stdin: '',
      });
      if (response.data.success) {
        setOutput(response.data.output || 'No output');
        toast.success(`Executed in ${response.data.time || '0'}s`, {
          icon: '⚡',
          style: {
            background: 'var(--color-backgroundSecondary)',
            color: 'var(--color-foreground)',
            border: '1px solid var(--color-border)',
            fontWeight: 500,
          }
        });
      } else {
        setOutput(`Error:\n${response.data.error}`);

        // Show AI debug help if enabled and available
        if (aiSettings.get('debugAssist') && response.data.aiDebugHelp) {
          setDebugHelp(response.data.aiDebugHelp);
        }

        toast.error('Execution failed', {
          style: {
            background: 'var(--color-backgroundSecondary)',
            color: 'var(--color-foreground)',
            border: '1px solid var(--color-border)'
          }
        });
      }
    } catch (error) {
      setOutput(`Error: ${error.response?.data?.error || error.message}`);
    } finally {
      setIsExecuting(false);
    }
  };

  // AI: Analyze code
  const handleAnalyzeCode = async () => {
    try {
      toast.loading('Analyzing code...');
      const result = await aiService.analyzeCode(code, language);
      setCodeAnalysis(result.analysis);
      toast.dismiss();
      toast.success('Analysis complete!');
    } catch (error) {
      toast.dismiss();
      toast.error(error.message || 'Failed to analyze code');
    }
  };

  // AI: Insert code at cursor
  const handleInsertCode = (codeToInsert) => {
    if (!editorRef.current) return;
    const editor = editorRef.current;
    const position = editor.getPosition();
    editor.executeEdits('', [{
      range: new monacoRef.current.Range(
        position.lineNumber,
        position.column,
        position.lineNumber,
        position.column
      ),
      text: codeToInsert,
    }]);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+Shift+A: Toggle AI
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        const newState = aiSettings.toggle('autocomplete');
        setAiEnabled(newState);
        toast.success(`AI Autocomplete ${newState ? 'ON' : 'OFF'}`);
      }
      // Alt+S: Settings
      if (e.altKey && e.key === 's') {
        e.preventDefault();
        setShowSettings(prev => !prev);
      }
      // Ctrl+Shift+L: Analyze
      if (e.ctrlKey && e.shiftKey && e.key === 'L') {
        e.preventDefault();
        handleAnalyzeCode();
      }
      // Ctrl+/: Generator
      if (e.ctrlKey && e.key === '/') {
        e.preventDefault();
        setShowGenerator(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [code, language]);

  // --- Render ---
  return (
    <div className="flex h-screen w-full bg-[var(--color-background)] text-[var(--color-foreground)] overflow-hidden font-sans transition-colors duration-300">

      {/* Sidebar */}
      <EditorSidebar
        users={users}
        roomId={roomId}
        onCopy={() => navigator.clipboard.writeText(roomId)}
        onLeave={() => navigate('/')}
      />

      {/* Main Area */}
      <div className="flex-1 flex flex-col relative z-10 w-0"> {/* w-0 fix for flex overflow */}

        {/* Glass Header */}
        <div className="h-14 bg-[var(--color-backgroundSecondary)] border-b border-[var(--color-border)] flex items-center justify-between px-4 transition-colors duration-300">
          <div className="flex items-center gap-4">
            <LanguageSelector value={language} onChange={handleLanguageChange} />
            <div className="h-4 w-[1px] bg-[var(--color-border)]" />
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Zap className="w-3 h-3 text-[var(--color-accent)]" />
              <span>Instant Execution Environment</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* AI Controls */}
            <AIToggle />
            <button
              onClick={() => setShowChat(prev => !prev)}
              className="p-2 hover:bg-[var(--color-background)] rounded-lg transition-colors"
              title="AI Chat (Ctrl+K)"
            >
              <MessageSquare size={18} />
            </button>
            <button
              onClick={() => setShowGenerator(prev => !prev)}
              className="p-2 hover:bg-[var(--color-background)] rounded-lg transition-colors"
              title="Code Generator (Ctrl+/)"
            >
              <Wand2 size={18} />
            </button>
            <button
              onClick={() => setShowSettings(prev => !prev)}
              className="p-2 hover:bg-[var(--color-background)] rounded-lg transition-colors"
              title="AI Settings (Alt+S)"
            >
              <SettingsIcon size={18} />
            </button>

            <div className="h-4 w-[1px] bg-[var(--color-border)]" />
            <ThemeToggle />
            <div className="h-4 w-[1px] bg-[var(--color-border)]" />
            <ShareMenu code={code} language={language} editorRef={editorRef} />

            <SpotlightButton
              onClick={handleRunCode}
              variant="primary"
              className="!h-9 !px-4 text-xs !rounded-lg"
              disabled={isExecuting}
            >
              {isExecuting ? (
                <><Loader2 className="w-3.5 h-3.5 animate-spin mr-2" /> Running</>
              ) : (
                <><Play className="w-3.5 h-3.5 mr-2 fill-current" /> Run Code</>
              )}
            </SpotlightButton>
          </div>
        </div>

        {/* Editor & Output Split */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">

          {/* Editor Area */}
          <div className="flex-1 relative bg-[var(--editor-background)] transition-colors duration-300">
            <div className="absolute inset-0">
              <Editor
                height="100%"
                language={language}
                value={code}
                onChange={handleEditorChange}
                onMount={handleEditorDidMount}
                options={{
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                  fontSize: 14,
                  minimap: { enabled: false }, // Cleaner look
                  scrollBeyondLastLine: false,
                  smoothScrolling: true,
                  cursorBlinking: "smooth",
                  cursorSmoothCaretAnimation: "on",
                  padding: { top: 20 },
                  fontLigatures: true,
                }}
              />
            </div>
          </div>

          {/* Output Panel (Fixed width on desktop, flexible on mobile) */}
          <div className="h-1/3 lg:h-full lg:w-[400px] border-t lg:border-t-0 lg:border-l border-[var(--color-border)] bg-[var(--color-backgroundSecondary)] z-20 transition-colors duration-300">
            <OutputPanel
              output={output}
              isExecuting={isExecuting}
              collaborators={[]} // Sidebar handles this now, but kept for future flexbility
            />
          </div>

        </div>

      </div>

      {/* AI Panels */}
      <AIChat
        isOpen={showChat}
        onClose={() => setShowChat(false)}
        language={language}
        code={code}
        onInsertCode={handleInsertCode}
      />
      <AISettings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
      <CodeGenerator
        isOpen={showGenerator}
        onClose={() => setShowGenerator(false)}
        language={language}
        onInsertCode={handleInsertCode}
      />
      {codeAnalysis && (
        <CodeAnalysis
          analysis={codeAnalysis}
          onClose={() => setCodeAnalysis(null)}
        />
      )}
      {debugHelp && (
        <DebugSuggestions
          debugHelp={debugHelp}
          onClose={() => setDebugHelp(null)}
        />
      )}
    </div>
  );
}
