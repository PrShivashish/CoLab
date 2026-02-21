import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    Copy,
    LogOut,
    Settings,
    ChevronLeft,
    ChevronRight,
    Command,
    Check
} from 'lucide-react';
import { cn } from '../utils/cn';
import { GlassCard } from './ui/GlassCard';

export default function EditorSidebar({ users, roomId, onCopy, onLeave }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        onCopy();
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div
            animate={{ width: isCollapsed ? 64 : 260 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="h-full border-r border-[var(--color-border)] bg-[var(--color-backgroundSecondary)] flex flex-col relative z-20 transition-colors duration-300"
        >
            {/* Brand / Toggle */}
            <div className="h-14 flex items-center justify-between px-3 border-b border-[var(--color-border)]">
                {!isCollapsed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2 font-bold text-[var(--color-foreground)] tracking-tight"
                    >
                        <div className="w-5 h-5 rounded bg-[var(--color-accent)] flex items-center justify-center">
                            <Command className="w-3 h-3 text-[var(--color-background)]" />
                        </div>
                        CoLab
                    </motion.div>
                )}

                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-1.5 rounded-md hover:bg-[var(--color-foreground)]/5 text-[var(--color-foregroundMuted)] hover:text-[var(--color-foreground)] transition-colors ml-auto"
                >
                    {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>
            </div>

            {/* Room Info */}
            <div className="p-3">
                {!isCollapsed ? (
                    <GlassCard className="p-3 !bg-[var(--color-background)]/50 !border-[var(--color-border)] space-y-3">
                        <div className="text-xs font-medium text-[var(--color-foregroundMuted)] uppercase tracking-wider">Session ID</div>
                        <button
                            onClick={handleCopy}
                            className="w-full flex items-center justify-between gap-2 p-2 rounded bg-[var(--color-background)] border border-[var(--color-border)] hover:border-[var(--color-accent)]/50 transition-all group"
                        >
                            <code className="text-xs text-[var(--color-accent)] truncate ml-1">{roomId}</code>
                            {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 text-[var(--color-foregroundMuted)] group-hover:text-[var(--color-foreground)]" />}
                        </button>
                    </GlassCard>
                ) : (
                    <button
                        onClick={handleCopy}
                        className="w-10 h-10 rounded-xl bg-[var(--color-background)]/50 flex items-center justify-center hover:bg-[var(--color-accent)]/20 hover:text-[var(--color-accent)] transition-colors mx-auto border border-[var(--color-border)]"
                        title="Copy Room ID"
                    >
                        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-[var(--color-foregroundMuted)]" />}
                    </button>
                )}
            </div>

            {/* Users List */}
            <div className="flex-1 overflow-y-auto p-3">
                {!isCollapsed && <div className="text-xs font-medium text-[var(--color-foregroundMuted)] uppercase tracking-wider mb-3 px-1">Active Peers ({users.length})</div>}

                <div className="space-y-2">
                    {users.map((user, i) => (
                        <motion.div
                            key={user.socketId || i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={cn(
                                "flex items-center gap-3 p-2 rounded-lg transition-colors",
                                isCollapsed ? "justify-center" : "hover:bg-[var(--color-background)]"
                            )}
                            title={user.username}
                        >
                            <div className="relative">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accentHover)] flex items-center justify-center text-xs font-bold text-white shadow-lg">
                                    {user.username.charAt(0).toUpperCase()}
                                </div>
                                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[var(--color-backgroundSecondary)] rounded-full flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 bg-[var(--color-success)] rounded-full animate-pulse" />
                                </div>
                            </div>

                            {!isCollapsed && (
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-[var(--color-foreground)] truncate">{user.username}</div>
                                    <div className="text-[10px] text-[var(--color-foregroundMuted)] truncate">Connected</div>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Footer Actions */}
            <div className="p-3 border-t border-[var(--color-border)] space-y-2">
                <button
                    onClick={onLeave}
                    className={cn(
                        "w-full flex items-center gap-3 p-2 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors",
                        isCollapsed && "justify-center"
                    )}
                    title="Leave Room"
                >
                    <LogOut className="w-4 h-4" />
                    {!isCollapsed && <span className="text-sm font-medium">Leave Room</span>}
                </button>
            </div>

        </motion.div>
    );
}
