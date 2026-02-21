import { useState, useMemo } from 'react';
import { Wand2, X, Loader, Copy, Check, Code2 } from 'lucide-react';
import aiService from '../services/aiService';

// Language display metadata — used for labels and context-aware placeholder examples
const LANGUAGE_META = {
    javascript: {
        label: 'JavaScript',
        icon: '📜',
        examples: [
            'Create a debounce function with configurable delay',
            'Write a binary search tree with insert and search methods',
            'Build a Promise-based retry mechanism with exponential backoff',
            'Create a polymorphism example using ES6 classes',
        ],
    },
    python: {
        label: 'Python',
        icon: '🐍',
        examples: [
            'Create a decorator that logs function call duration',
            'Write a class hierarchy demonstrating polymorphism',
            'Build a context manager for database connections',
            'Implement a generator function for Fibonacci sequence',
        ],
    },
    java: {
        label: 'Java',
        icon: '☕',
        examples: [
            'Create an interface with polymorphic implementations',
            'Write a generic Stack class with push/pop/peek',
            'Build a singleton pattern with thread safety',
            'Implement a builder pattern for a User object',
        ],
    },
    cpp: {
        label: 'C++',
        icon: '⚙️',
        examples: [
            'Create a virtual function hierarchy for shapes',
            'Write a template class for a type-safe queue',
            'Build a smart pointer with reference counting',
            'Implement move semantics for a resource holder class',
        ],
    },
    c: {
        label: 'C',
        icon: '🔧',
        examples: [
            'Create a linked list with insert, delete, and search',
            'Write a function to reverse a string in-place',
            'Build a simple stack using arrays',
            'Implement a binary search on a sorted array',
        ],
    },
    typescript: {
        label: 'TypeScript',
        icon: '📘',
        examples: [
            'Create a generic Repository interface with CRUD operations',
            'Write a discriminated union type for API responses',
            'Build a typed event emitter class',
            'Implement a decorator pattern with TypeScript decorators',
        ],
    },
    go: {
        label: 'Go',
        icon: '🔷',
        examples: [
            'Create an interface with multiple struct implementations',
            'Write a goroutine-based concurrent worker pool',
            'Build an HTTP middleware chain',
            'Implement a rate limiter using a token bucket',
        ],
    },
    rust: {
        label: 'Rust',
        icon: '🦀',
        examples: [
            'Create a trait with multiple struct implementations',
            'Write a thread-safe shared state with Arc and Mutex',
            'Build a custom Iterator over a binary tree',
            'Implement a Result-based error handling chain',
        ],
    },
    ruby: {
        label: 'Ruby',
        icon: '💎',
        examples: [
            'Create a module mixin for polymorphic behaviour',
            'Write a class hierarchy with method overriding',
            'Build a DSL-style builder using method chaining',
            'Implement an Enumerable-compatible custom collection',
        ],
    },
    php: {
        label: 'PHP',
        icon: '🐘',
        examples: [
            'Create an abstract class with concrete implementations',
            'Write a PSR-4 autoloading class hierarchy',
            'Build a simple dependency injection container',
            'Implement a repository pattern for database access',
        ],
    },
    kotlin: {
        label: 'Kotlin',
        icon: '🅺',
        examples: [
            'Create a sealed class hierarchy for UI states',
            'Write extension functions for a data class',
            'Build a coroutine-based network request handler',
            'Implement a functional pipeline with map/filter/fold',
        ],
    },
    swift: {
        label: 'Swift',
        icon: '🦅',
        examples: [
            'Create a protocol with default method implementations',
            'Write a generic linked list with Swift generics',
            'Build an async/await network request wrapper',
            'Implement a Combine publisher/subscriber pipeline',
        ],
    },
    csharp: {
        label: 'C#',
        icon: '#️⃣',
        examples: [
            'Create an abstract class hierarchy with polymorphism',
            'Write a generic repository pattern with LINQ',
            'Build a dependency injection service registration',
            'Implement an async pipeline with Task chaining',
        ],
    },
};

// Fallback for unlisted languages
const getFallbackMeta = (language) => ({
    label: language.charAt(0).toUpperCase() + language.slice(1),
    icon: '🖥️',
    examples: [
        `Create a function that demonstrates polymorphism in ${language}`,
        `Write a data structure implementation in ${language}`,
        `Build a utility module with common helper functions in ${language}`,
        `Implement a design pattern example in ${language}`,
    ],
});

function getLanguageMeta(language) {
    return LANGUAGE_META[language] ?? getFallbackMeta(language);
}

/**
 * CodeGenerator — Generates code in the currently selected editor language.
 *
 * Props:
 *   isOpen    {boolean}   — controls panel visibility
 *   onClose   {function}  — called when user closes the panel
 *   language  {string}    — the CURRENT editor language (from Editor.jsx state)
 *   onInsertCode {function} — inserts generated code into Monaco editor at cursor
 */
export default function CodeGenerator({ isOpen, onClose, language, onInsertCode }) {
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [generatedCode, setGeneratedCode] = useState('');
    const [copied, setCopied] = useState(false);

    // Derive language metadata once per language change
    const langMeta = useMemo(() => getLanguageMeta(language), [language]);

    // Pick a rotating placeholder example based on description length (feels dynamic)
    const placeholderExample = useMemo(() => {
        const idx = description.length % langMeta.examples.length;
        return langMeta.examples[idx];
    }, [langMeta, description.length]);

    const handleGenerate = async () => {
        if (!description.trim() || loading) return;

        setLoading(true);
        setGeneratedCode('');

        try {
            // Language is always sourced from the editor prop — never from user input
            const result = await aiService.generateCode(description.trim(), language);
            setGeneratedCode(result.code || `// No code returned for: ${description}`);
        } catch (error) {
            setGeneratedCode(`// ⚠️ Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        // Ctrl+Enter or Cmd+Enter to generate
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            handleGenerate();
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleInsert = () => {
        if (onInsertCode && generatedCode) {
            onInsertCode(generatedCode);
            handleClose();
        }
    };

    const handleClose = () => {
        setDescription('');
        setGeneratedCode('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="code-generator-panel">
            {/* ── Header ─────────────────────────────── */}
            <div className="generator-header">
                <div className="title">
                    <Wand2 size={18} />
                    <span>Code Generator</span>

                    {/* Active language badge — always visible */}
                    <span className="language-badge">
                        <span className="language-badge-icon">{langMeta.icon}</span>
                        <span>{langMeta.label}</span>
                    </span>
                </div>
                <button onClick={handleClose} className="close-btn" aria-label="Close generator">
                    <X size={18} />
                </button>
            </div>

            {/* ── Body ───────────────────────────────── */}
            <div className="generator-content">

                {/* Language context notice */}
                <div className="language-notice">
                    <Code2 size={14} />
                    <span>
                        Generating <strong>{langMeta.label}</strong> code — switch language in the toolbar to change
                    </span>
                </div>

                {/* Description input */}
                <div className="description-input">
                    <label htmlFor="codeDescription">
                        Describe what you want to create:
                    </label>
                    <textarea
                        id="codeDescription"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={`e.g. "${placeholderExample}"`}
                        rows={4}
                        disabled={loading}
                        autoFocus
                    />
                    <span className="input-hint">Tip: Press Ctrl+Enter to generate</span>
                </div>

                {/* Generate button */}
                <div className="generator-actions">
                    <button
                        onClick={handleGenerate}
                        disabled={!description.trim() || loading}
                        className="generate-btn"
                    >
                        {loading ? (
                            <>
                                <Loader className="spinner" size={16} />
                                Generating {langMeta.label} code…
                            </>
                        ) : (
                            <>
                                <Wand2 size={16} />
                                Generate {langMeta.label} Code
                            </>
                        )}
                    </button>
                </div>

                {/* Generated code output */}
                {generatedCode && (
                    <div className="generated-code">
                        <div className="code-header">
                            <span>
                                {langMeta.icon} Generated {langMeta.label} Code
                            </span>
                            <div className="code-actions">
                                <button onClick={handleCopy} className="icon-btn" title="Copy to clipboard">
                                    {copied ? <Check size={15} /> : <Copy size={15} />}
                                </button>
                            </div>
                        </div>
                        <pre><code>{generatedCode}</code></pre>
                        <button onClick={handleInsert} className="insert-btn">
                            ↩ Insert into Editor
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
