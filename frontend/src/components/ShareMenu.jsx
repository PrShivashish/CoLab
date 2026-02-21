import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Copy, Camera, Check, FileDown } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';
import toast from 'react-hot-toast';
import html2canvas from 'html2canvas';
import { generateSmartFilename, analyzeCodePurpose } from '../utils/codeAnalyzer';

export default function ShareMenu({ code, language, editorRef }) {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const copyCode = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);

            toast.success('Code copied to clipboard!', {
                style: {
                    background: '#18181b',
                    color: '#fff',
                    border: '1px solid #27272a'
                },
                iconTheme: {
                    primary: '#7c3aed',
                    secondary: '#fff',
                },
            });

            setIsOpen(false);
        } catch (error) {
            toast.error('Failed to copy code');
        }
    };

    const downloadCodeFile = () => {
        try {
            if (!code || code.trim() === '') {
                toast.error('No code to download');
                return;
            }

            // Generate smart filename
            const filename = generateSmartFilename(code, language);

            // Create blob and download
            const blob = new Blob([code], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.click();

            // Cleanup
            URL.revokeObjectURL(url);

            toast.success(`Downloaded as ${filename}`, {
                style: {
                    background: '#18181b',
                    color: '#fff',
                    border: '1px solid #27272a'
                },
                iconTheme: {
                    primary: '#7c3aed',
                    secondary: '#fff',
                },
            });

            setIsOpen(false);
        } catch (error) {
            console.error('Download error:', error);
            toast.error('Failed to download file');
        }
    };

    const shareSnapshot = async () => {
        try {
            // Find the Monaco editor container
            const editorContainer = document.querySelector('.monaco-editor');

            if (!editorContainer) {
                toast.error('Editor not found');
                return;
            }

            toast.loading('Generating snapshot...', { id: 'snapshot' });

            // Capture the editor
            const canvas = await html2canvas(editorContainer, {
                backgroundColor: '#030303',
                scale: 2, // Higher quality
                logging: false,
            });

            // Convert to blob
            canvas.toBlob((blob) => {
                // Use smart naming for screenshot
                const baseName = analyzeCodePurpose(code, language);
                const filename = `${baseName}.png`;

                // Create download link
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = filename;
                link.click();

                // Cleanup
                URL.revokeObjectURL(url);

                toast.success(`Snapshot saved as ${filename}`, {
                    id: 'snapshot',
                    style: {
                        background: '#18181b',
                        color: '#fff',
                        border: '1px solid #27272a'
                    },
                    iconTheme: {
                        primary: '#7c3aed',
                        secondary: '#fff',
                    },
                });

                setIsOpen(false);
            });
        } catch (error) {
            console.error('Snapshot error:', error);
            toast.error('Failed to generate snapshot', { id: 'snapshot' });
        }
    };

    return (
        <div className="relative">
            {/* Share Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
          flex items-center gap-2 px-4 py-2 rounded-lg
          bg-[var(--color-foreground)]/5 border border-[var(--color-border)] hover:border-[var(--color-accent)]/50
          text-[var(--color-foregroundMuted)] hover:text-[var(--color-foreground)]
          transition-all duration-200
          ${isOpen ? 'bg-[var(--color-accent)]/20 border-[var(--color-accent)]' : ''}
        `}
            >
                <Share2 className="w-4 h-4" />
                <span className="text-sm font-medium">Share</span>
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full right-0 mt-2 w-56 origin-top-right z-50"
                    >
                        <GlassCard className="overflow-hidden !bg-[var(--color-background)]/90 !border-[var(--color-border)]">
                            <div className="p-2 space-y-1">
                                {/* Copy Code */}
                                <button
                                    onClick={copyCode}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--color-foreground)]/5 text-left transition-colors group"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-[var(--color-accent)]/10 flex items-center justify-center group-hover:bg-[var(--color-accent)]/20 transition-colors">
                                        {copied ? (
                                            <Check className="w-4 h-4 text-green-500" />
                                        ) : (
                                            <Copy className="w-4 h-4 text-[var(--color-accent)]" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm font-medium text-[var(--color-foreground)]">Copy Code</div>
                                        <div className="text-xs text-[var(--color-foregroundMuted)]">Copy to clipboard</div>
                                    </div>
                                </button>

                                {/* Download Code File */}
                                <button
                                    onClick={downloadCodeFile}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--color-foreground)]/5 text-left transition-colors group"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                                        <FileDown className="w-4 h-4 text-emerald-500" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm font-medium text-[var(--color-foreground)]">Download File</div>
                                        <div className="text-xs text-[var(--color-foregroundMuted)]">Save as .{language} file</div>
                                    </div>
                                </button>

                                {/* Share Snapshot */}
                                <button
                                    onClick={shareSnapshot}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--color-foreground)]/5 text-left transition-colors group"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center group-hover:bg-pink-500/20 transition-colors">
                                        <Camera className="w-4 h-4 text-pink-500" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm font-medium text-[var(--color-foreground)]">Share Snapshot</div>
                                        <div className="text-xs text-[var(--color-foregroundMuted)]">Download as PNG</div>
                                    </div>
                                </button>
                            </div>
                        </GlassCard>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Click outside to close */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
}
