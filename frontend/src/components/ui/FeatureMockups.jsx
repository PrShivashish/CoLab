import React from 'react';
import { motion } from 'framer-motion';

// Realistic Code Editor Mockup with Multi-Cursor Collaboration
export function CollabEditorMockup() {
    const codeLines = [
        { code: 'function calculateTotal(items) {', indent: 0 },
        { code: '  return items.reduce((sum, item) => {', indent: 2 },
        { code: '    return sum + item.price;', indent: 4 },
        { code: '  }, 0);', indent: 2 },
        { code: '}', indent: 0 },
    ];

    const cursors = [
        { name: 'Alex', color: '#00F0FF', line: 2, position: 28 },
        { name: 'Jordan', color: '#FF0099', line: 3, position: 15 },
        { name: 'Sam', color: '#CCFF00', line: 1, position: 18 },
    ];

    return (
        <div className="relative w-full max-w-2xl h-80 bg-[#1e1e1e] rounded-xl border border-white/10 shadow-2xl overflow-hidden font-mono text-sm">
            {/* Editor Header */}
            <div className="flex items-center gap-2 px-4 py-3 bg-[#2d2d2d] border-b border-white/5">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="ml-4 text-[var(--color-foregroundMuted)] text-xs">main.js</span>
            </div>

            {/* Code Content */}
            <div className="relative p-6 space-y-3">
                {codeLines.map((line, idx) => (
                    <div key={idx} className="flex items-center gap-4 relative">
                        <span className="text-[var(--color-foregroundMuted)]/30 w-6 text-right select-none">{idx + 1}</span>
                        <div className="relative flex-1">
                            <code style={{ paddingLeft: `${line.indent * 8}px` }} className="text-[#d4d4d4]">
                                {line.code}
                            </code>

                            {/* Render cursors on this line */}
                            {cursors.filter(c => c.line === idx).map((cursor, cidx) => (
                                <motion.div
                                    key={cidx}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: cidx * 0.3 + 0.5 }}
                                    className="absolute top-0"
                                    style={{
                                        left: `${line.indent * 8 + cursor.position * 8}px`,
                                    }}
                                >
                                    {/* Cursor Line */}
                                    <motion.div
                                        animate={{ opacity: [1, 0, 1] }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                        className="w-0.5 h-5"
                                        style={{ backgroundColor: cursor.color }}
                                    />
                                    {/* Name Tag */}
                                    <motion.div
                                        initial={{ y: -5, opacity: 0 }}
                                        animate={{ y: -25, opacity: 1 }}
                                        transition={{ delay: cidx * 0.3 + 0.7 }}
                                        className="absolute -top-6 left-0 px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap shadow-lg"
                                        style={{
                                            backgroundColor: cursor.color,
                                            color: '#000',
                                        }}
                                    >
                                        {cursor.name}
                                    </motion.div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Active Users Indicator */}
            <div className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full border border-white/10">
                <div className="flex -space-x-2">
                    {cursors.map((cursor, idx) => (
                        <div
                            key={idx}
                            className="w-6 h-6 rounded-full ring-2 ring-black flex items-center justify-center text-[10px] font-bold"
                            style={{ backgroundColor: cursor.color, color: '#000' }}
                        >
                            {cursor.name[0]}
                        </div>
                    ))}
                </div>
                <span className="text-xs text-white/60">3 online</span>
            </div>
        </div>
    );
}

// Terminal Mockup with Colorful Output
export function SmartTerminalMockup() {
    const outputs = [
        { type: 'prompt', text: '$ npm install colab-cli' },
        { type: 'info', text: '📦 Installing dependencies...' },
        { type: 'success', text: '✓ colab-cli@2.0.0' },
        { type: 'success', text: '✓ 42 packages installed' },
        { type: 'prompt', text: '$ colab start' },
        { type: 'success', text: '🚀 Server running on http://localhost:3000' },
    ];

    return (
        <div className="relative w-full max-w-2xl h-80 bg-[#0a0a0a] rounded-xl border border-emerald-500/20 shadow-2xl overflow-hidden font-mono text-sm">
            {/* Terminal Header */}
            <div className="flex items-center gap-2 px-4 py-3 bg-[#1a1a1a] border-b border-emerald-500/20">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="ml-4 text-emerald-400 text-xs">terminal — bash</span>
            </div>

            {/* Terminal Content */}
            <div className="p-6 space-y-2">
                {outputs.map((output, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.4 + 0.3 }}
                        className={`
                            ${output.type === 'prompt' ? 'text-[#00F0FF] font-bold' : ''}
                            ${output.type === 'info' ? 'text-blue-400' : ''}
                            ${output.type === 'success' ? 'text-emerald-400' : ''}
                            ${output.type === 'error' ? 'text-red-400' : ''}
                        `}
                    >
                        {output.text}
                        {output.type === 'prompt' && (
                            <motion.span
                                animate={{ opacity: [1, 0, 1] }}
                                transition={{ duration: 1, repeat: Infinity, delay: idx * 0.4 + 0.8 }}
                                className="inline-block w-2 h-4 ml-1 bg-[#00F0FF]"
                            />
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

// Share Link Mockup with Animation
export function ShareLinkMockup() {
    return (
        <div className="relative w-full max-w-lg h-64 flex items-center justify-center">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="relative w-full bg-gradient-to-br from-[var(--color-backgroundSecondary)]/80 to-[var(--color-backgroundTertiary)]/80 backdrop-blur-xl rounded-2xl border border-[var(--color-border)] shadow-2xl p-8"
            >
                <div className="text-center space-y-6">
                    <div className="text-4xl">🔗</div>
                    <h3 className="text-xl font-bold text-[var(--color-foreground)]">Instant Collaboration</h3>

                    {/* Link Display */}
                    <motion.div
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="relative flex items-center gap-2 px-4 py-3 bg-[var(--color-background)]/50 rounded-xl border border-[var(--color-accent)]/30"
                    >
                        <span className="flex-1 text-sm text-[var(--color-accent)] font-mono">
                            colab.dev/join/abc123xyz
                        </span>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-3 py-1.5 bg-[var(--color-accent)] text-white rounded-lg text-xs font-bold flex items-center gap-1"
                        >
                            <span>Copy</span>
                            <motion.span
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                ✓
                            </motion.span>
                        </motion.button>
                    </motion.div>

                    {/* Floating Share Icons */}
                    <div className="flex justify-center gap-4 opacity-50">
                        {['📧', '💬', '🔗'].map((icon, idx) => (
                            <motion.div
                                key={idx}
                                animate={{ y: [0, -5, 0] }}
                                transition={{ duration: 2, delay: idx * 0.2, repeat: Infinity }}
                                className="text-2xl"
                            >
                                {icon}
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Particles */}
                {[...Array(6)].map((_, idx) => (
                    <motion.div
                        key={idx}
                        className="absolute w-1 h-1 bg-[var(--color-accent)] rounded-full"
                        style={{
                            left: `${20 + idx * 15}%`,
                            top: `${30 + (idx % 3) * 20}%`,
                        }}
                        animate={{
                            scale: [0, 1, 0],
                            opacity: [0, 1, 0],
                        }}
                        transition={{
                            duration: 2,
                            delay: idx * 0.3,
                            repeat: Infinity,
                        }}
                    />
                ))}
            </motion.div>
        </div>
    );
}

// Multi-Language Code Switcher
export function MultiLanguageMockup() {
    const [activeLang, setActiveLang] = React.useState(0);

    const languages = [
        { name: 'Python', icon: '🐍', code: 'def hello():\n    print("Hello, CoLab!")' },
        { name: 'JavaScript', icon: '⚡', code: 'function hello() {\n  console.log("Hello, CoLab!");\n}' },
        { name: 'Rust', icon: '🦀', code: 'fn hello() {\n    println!("Hello, CoLab!");\n}' },
    ];

    React.useEffect(() => {
        const interval = setInterval(() => {
            setActiveLang((prev) => (prev + 1) % languages.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full max-w-2xl h-80">
            {/* Language Tabs */}
            <div className="flex gap-2 mb-4">
                {languages.map((lang, idx) => (
                    <motion.button
                        key={idx}
                        animate={{
                            backgroundColor: activeLang === idx ? 'var(--color-accent)' : 'var(--color-backgroundSecondary)',
                            color: activeLang === idx ? '#fff' : 'var(--color-foregroundMuted)',
                        }}
                        className="px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2"
                    >
                        <span>{lang.icon}</span>
                        <span>{lang.name}</span>
                    </motion.button>
                ))}
            </div>

            {/* Code Editor */}
            <div className="relative w-full h-64 bg-[#1e1e1e] rounded-xl border border-white/10 shadow-2xl overflow-hidden">
                <div className="p-6">
                    <motion.pre
                        key={activeLang}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                        className="text-[#d4d4d4] font-mono text-base"
                    >
                        {languages[activeLang].code}
                    </motion.pre>
                </div>

                {/* Typing Cursor */}
                <motion.div
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="absolute bottom-24 left-32 w-0.5 h-5 bg-[var(--color-accent)]"
                />
            </div>
        </div>
    );
}
