import React, { useState, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { cn } from '../utils/cn';
import { GlassCard } from './ui/GlassCard';
import { AnimatePresence, motion } from 'framer-motion';

const LANGUAGES = [
    { id: 'javascript', name: 'JavaScript', icon: '📜', popular: true },
    { id: 'python', name: 'Python', icon: '🐍', popular: true },
    { id: 'java', name: 'Java', icon: '☕', popular: true },
    { id: 'cpp', name: 'C++', icon: '⚙️', popular: true },
    { id: 'c', name: 'C', icon: '🔧', popular: false },
    { id: 'go', name: 'Go', icon: '🔷', popular: true },
    { id: 'typescript', name: 'TypeScript', icon: '📘', popular: true },
    { id: 'rust', name: 'Rust', icon: '🦀', popular: false },
    { id: 'ruby', name: 'Ruby', icon: '💎', popular: false },
    { id: 'php', name: 'PHP', icon: '🐘', popular: false },
    { id: 'kotlin', name: 'Kotlin', icon: '🅺', popular: false },
    { id: 'swift', name: 'Swift', icon: '🦅', popular: false },
    { id: 'csharp', name: 'C#', icon: '#️⃣', popular: false },
];

export default function LanguageSelector({ value, onChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');

    const selectedLang = LANGUAGES.find(l => l.id === value) || LANGUAGES[0];

    const filteredLanguages = LANGUAGES.filter(lang =>
        lang.name.toLowerCase().includes(search.toLowerCase()) ||
        lang.id.toLowerCase().includes(search.toLowerCase())
    );

    const popularLanguages = filteredLanguages.filter(l => l.popular);
    const otherLanguages = filteredLanguages.filter(l => !l.popular);

    const selectLanguage = (langId) => {
        onChange(langId);
        setIsOpen(false);
        setSearch('');
    };

    useEffect(() => {
        if (isOpen) {
            const handleClickOutside = (e) => {
                if (!e.target.closest('.language-selector')) {
                    setIsOpen(false);
                }
            };
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [isOpen]);

    return (
        <div className="relative language-selector z-50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all border",
                    isOpen
                        ? "bg-[var(--color-foreground)]/10 border-[var(--color-foreground)]/20 text-[var(--color-foreground)]"
                        : "bg-transparent border-transparent text-[var(--color-foregroundMuted)] hover:bg-[var(--color-foreground)]/5 hover:text-[var(--color-foreground)]"
                )}
            >
                <span className="text-lg">{selectedLang.icon}</span>
                <span className="text-sm font-medium">{selectedLang.name}</span>
                <ChevronDown className={cn(
                    "w-4 h-4 transition-transform opacity-50",
                    isOpen && "rotate-180"
                )} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.1 }}
                        className="absolute top-full left-0 mt-2 w-64 origin-top-left"
                    >
                        <GlassCard className="overflow-hidden">
                            {/* Search */}
                            <div className="p-3 border-b border-[var(--color-border)] relative">
                                <Search className="w-4 h-4 absolute left-6 top-1/2 -translate-y-1/2 text-[var(--color-foregroundMuted)]" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full bg-[var(--color-background)]/20 border border-[var(--color-border)] rounded-md py-1.5 pl-9 pr-3 text-sm text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-accent)]/50 transition-colors placeholder:text-[var(--color-foregroundMuted)]"
                                    autoFocus
                                />
                            </div>

                            {/* List */}
                            <div className="overflow-y-auto p-1 max-h-[320px] scrollbar-thin scrollbar-thumb-[var(--color-foreground)]/10 scrollbar-track-transparent hover:scrollbar-thumb-[var(--color-foreground)]/20">
                                {popularLanguages.length > 0 && (
                                    <>
                                        <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--color-foregroundMuted)]">Popular</div>
                                        {popularLanguages.map(lang => (
                                            <LanguageOption
                                                key={lang.id}
                                                lang={lang}
                                                isSelected={value === lang.id}
                                                onClick={() => selectLanguage(lang.id)}
                                            />
                                        ))}
                                    </>
                                )}

                                {otherLanguages.length > 0 && (
                                    <>
                                        <div className="px-2 py-1.5 mt-2 text-[10px] font-bold uppercase tracking-wider text-[var(--color-foregroundMuted)] border-t border-[var(--color-border)]">Other</div>
                                        {otherLanguages.map(lang => (
                                            <LanguageOption
                                                key={lang.id}
                                                lang={lang}
                                                isSelected={value === lang.id}
                                                onClick={() => selectLanguage(lang.id)}
                                            />
                                        ))}
                                    </>
                                )}

                                {filteredLanguages.length === 0 && (
                                    <div className="p-4 text-center text-sm text-[var(--color-foregroundMuted)]">
                                        No languages found
                                    </div>
                                )}
                            </div>
                        </GlassCard>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

const LanguageOption = ({ lang, isSelected, onClick }) => (
    <button
        onClick={onClick}
        className={cn(
            "w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all text-sm",
            isSelected
                ? "bg-[var(--color-accent)]/20 text-[var(--color-accent)]"
                : "text-[var(--color-foregroundMuted)] hover:bg-[var(--color-foreground)]/5 hover:text-[var(--color-foreground)]"
        )}
    >
        <span className="text-base">{lang.icon}</span>
        <span>{lang.name}</span>
        {isSelected && <motion.div layoutId="activeLang" className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />}
    </button>
);
