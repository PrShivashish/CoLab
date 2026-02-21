import React, { useState, useEffect } from 'react';
import { Moon, Sun, Zap } from 'lucide-react';
import { applyTheme, getCurrentTheme } from '../theme/themeConfig';
import { cn } from '../utils/cn';

export default function ThemeToggle() {
    const [theme, setTheme] = useState(getCurrentTheme());

    useEffect(() => {
        applyTheme(theme);
    }, [theme]);

    const toggleTheme = () => {
        const themes = ['sleek', 'light', 'adrenaline'];
        const currentIndex = themes.indexOf(theme);
        const nextTheme = themes[(currentIndex + 1) % themes.length];
        setTheme(nextTheme);
    };

    return (
        <button
            onClick={toggleTheme}
            className={cn(
                "relative p-2 rounded-lg transition-all duration-300",
                "hover:bg-[var(--color-backgroundSecondary)]",
                "border border-[var(--color-border)]",
                theme === 'adrenaline' && "neon-glow",
                theme === 'light' && "shadow-sm bg-white"
            )}
            title={`Current theme: ${theme.charAt(0).toUpperCase() + theme.slice(1)}`}
        >
            <div className="relative w-6 h-6 flex items-center justify-center">
                {theme === 'sleek' && (
                    <Moon className="w-5 h-5 text-[var(--color-accent)]" />
                )}
                {theme === 'light' && (
                    <Sun className="w-5 h-5 text-amber-500" />
                )}
                {theme === 'adrenaline' && (
                    <Zap className="w-5 h-5 text-[var(--color-accent)] glow-text" />
                )}
            </div>
        </button>
    );
}
