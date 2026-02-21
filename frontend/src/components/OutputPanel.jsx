import React, { useState } from 'react';
import { Terminal, FileText, Users, X, Activity, Maximize2, Minimize2 } from 'lucide-react';
import { cn } from '../utils/cn';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from './ui/GlassCard';

const TABS = [
    { id: 'output', label: 'Output', icon: Terminal },
    { id: 'collaborators', label: 'Team', icon: Users },
];

export default function OutputPanel({ output, isExecuting, collaborators = [] }) {
    const [activeTab, setActiveTab] = useState('output');
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <div className="h-full flex flex-col">
            {/* Header / Tabs */}
            <div className="flex items-center justify-between px-2 pt-2">
                <div className="flex bg-[var(--color-backgroundSecondary)] rounded-lg p-1 border border-[var(--color-border)]">
                    {TABS.map(tab => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all relative",
                                    isActive ? "text-[var(--color-foreground)]" : "text-[var(--color-foregroundMuted)] hover:text-[var(--color-foreground)]"
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-[var(--color-foreground)]/10 rounded-md"
                                    />
                                )}
                                <span className="relative z-10 flex items-center gap-2">
                                    <Icon className="w-3.5 h-3.5" />
                                    {tab.label}
                                    {tab.id === 'collaborators' && collaborators.length > 0 && (
                                        <span className="bg-[var(--color-accent)] text-white text-[10px] px-1.5 rounded-full">{collaborators.length}</span>
                                    )}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-2 overflow-hidden relative">
                <AnimatePresence mode="wait">
                    {activeTab === 'output' && (
                        <motion.div
                            key="output"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            transition={{ duration: 0.2 }}
                            className="h-full"
                        >
                            <GlassCard className="h-full overflow-hidden flex flex-col bg-[var(--color-background)]/50 !border-[var(--color-border)]">
                                {isExecuting ? (
                                    <div className="flex-1 flex items-center justify-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-12 h-12 relative">
                                                <div className="absolute inset-0 border-t-2 border-[var(--color-accent)] rounded-full animate-spin"></div>
                                                <div className="absolute inset-2 border-r-2 border-[#DB2777] rounded-full animate-spin-reverse"></div>
                                            </div>
                                            <div className="text-xs text-[var(--color-foregroundMuted)] font-mono animate-pulse">Running Code...</div>
                                        </div>
                                    </div>
                                ) : (
                                    !output ? (
                                        <div className="flex-1 flex flex-col items-center justify-center text-[var(--color-foregroundMuted)] opacity-50">
                                            <Terminal className="w-12 h-12 mb-4 stroke-[1]" />
                                            <p className="text-xs font-mono">Run code to see output</p>
                                        </div>
                                    ) : (
                                        <div className="flex-1 overflow-auto p-4 font-mono text-sm">
                                            <div className="text-[#06B6D4] mb-2 text-xs opacity-50">$ node index.js</div>
                                            <pre className="whitespace-pre-wrap text-[var(--color-foreground)]">{output}</pre>
                                        </div>
                                    )
                                )}
                            </GlassCard>
                        </motion.div>
                    )}

                    {activeTab === 'collaborators' && (
                        <motion.div
                            key="collaborators"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                            className="h-full"
                        >
                            <GlassCard className="h-full overflow-y-auto p-2 bg-[var(--color-background)]/50 !border-[var(--color-border)] space-y-2">
                                {collaborators.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-[var(--color-foregroundMuted)] opacity-50">
                                        <Users className="w-12 h-12 mb-4 stroke-[1]" />
                                        <p className="text-xs">No active peers</p>
                                    </div>
                                ) : (
                                    collaborators.map((user, i) => (
                                        <motion.div
                                            key={user.socketId}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="flex items-center gap-3 p-3 rounded-lg bg-[var(--color-foreground)]/5 hover:bg-[var(--color-foreground)]/10 transition-colors border border-[var(--color-border)]"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[var(--color-accent)] to-[#DB2777] flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-purple-500/20">
                                                {user.username.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-[var(--color-foreground)]">{user.username}</div>
                                                <div className="text-[10px] text-[var(--color-foregroundMuted)] flex items-center gap-1">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                    Online
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </GlassCard>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
