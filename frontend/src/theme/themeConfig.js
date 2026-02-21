export const themes = {
    sleek: {
        name: 'sleek-modern',
        displayName: 'Sleek Modern',
        colors: {
            background: '#18181b', // Zinc-900
            backgroundSecondary: '#27272a', // Zinc-800
            backgroundTertiary: '#3f3f46', // Zinc-700
            foreground: '#ffffff',
            foregroundSecondary: '#a1a1aa', // Zinc-400
            foregroundMuted: '#71717a', // Zinc-500
            accent: '#8b5cf6', // Violet-500
            accentHover: '#7c3aed', // Violet-600
            accentLight: '#a78bfa', // Violet-400
            border: '#3f3f46', // Zinc-700
            borderLight: '#52525b', // Zinc-600
            success: '#10b981', // Emerald-500
            error: '#ef4444', // Red-500
            warning: '#f59e0b', // Amber-500
            info: '#3b82f6', // Blue-500
            glassBorder: 'rgba(255, 255, 255, 0.1)',
            glassBg: 'rgba(24, 24, 27, 0.6)',
        },
        editor: {
            background: '#18181b',
            lineHighlight: '#27272a',
            selection: '#3b82f640',
            selectionHighlight: '#3b82f620',
            cursor: '#a1a1aa',
            lineNumber: '#71717a',
            lineNumberActive: '#ffffff',
        },
    },
    light: {
        name: 'clean-light',
        displayName: 'Clean Light',
        colors: {
            background: '#ffffff',
            backgroundSecondary: '#f4f4f5', // Zinc-100
            backgroundTertiary: '#e4e4e7', // Zinc-200
            foreground: '#18181b', // Zinc-900
            foregroundSecondary: '#52525b', // Zinc-600
            foregroundMuted: '#71717a', // Zinc-500 (Darkened from Zinc-400 for better contrast)
            accent: '#6366f1', // Indigo-500
            accentHover: '#4f46e5', // Indigo-600
            accentLight: '#818cf8', // Indigo-400
            border: '#e4e4e7', // Zinc-200
            borderLight: '#a1a1aa', // Zinc-400 (Darkened for better definition)
            success: '#059669', // Emerald-600
            error: '#dc2626', // Red-600
            warning: '#d97706', // Amber-600
            info: '#2563eb', // Blue-600
            glassBorder: 'rgba(0, 0, 0, 0.08)', // Slightly stronger
            glassBg: 'rgba(255, 255, 255, 0.7)',
        },
        editor: {
            background: '#ffffff',
            lineHighlight: '#f4f4f5',
            selection: '#6366f120',
            selectionHighlight: '#6366f110',
            cursor: '#18181b',
            lineNumber: '#a1a1aa',
            lineNumberActive: '#18181b',
        },
    },
    adrenaline: {
        name: 'adrenaline-tech',
        displayName: 'Adrenaline',
        colors: {
            background: '#050505', // Almost Black
            backgroundSecondary: '#0a0a0a',
            backgroundTertiary: '#121212',
            foreground: '#00F0FF', // Cyan
            foregroundSecondary: '#FF0099', // Magenta
            foregroundMuted: '#7000FF', // Purple
            accent: '#CCFF00', // Lime
            accentHover: '#AAFF00',
            accentLight: '#FFFF00',
            border: '#333333',
            borderLight: '#444444',
            success: '#00FF66', // Green
            error: '#FF0055', // Red
            warning: '#FFCC00', // Yellow
            info: '#00F0FF', // Cyan
            glassBorder: 'rgba(0, 240, 255, 0.2)',
            glassBg: 'rgba(5, 5, 5, 0.8)',
        },
        editor: {
            background: '#050505',
            lineHighlight: '#101010',
            selection: '#FF009940',
            selectionHighlight: '#FF009920',
            cursor: '#CCFF00',
            lineNumber: '#00F0FF50',
            lineNumberActive: '#CCFF00',
        },
    },
};

export const getTheme = (themeName) => {
    return themes[themeName] || themes.sleek;
};

export const applyTheme = (themeName) => {
    const theme = getTheme(themeName);
    const root = document.documentElement;

    // Apply CSS custom properties
    Object.entries(theme.colors).forEach(([key, value]) => {
        root.style.setProperty(`--color-${key}`, value);
    });

    Object.entries(theme.editor).forEach(([key, value]) => {
        root.style.setProperty(`--editor-${key}`, value);
    });

    // Store preference
    localStorage.setItem('colab-theme', themeName);

    // Apply theme class
    root.classList.remove('theme-sleek', 'theme-light', 'theme-adrenaline');
    root.classList.add(`theme-${themeName}`);

    // Dispatch event for components to react (e.g., Monaco Editor)
    window.dispatchEvent(new CustomEvent('themeChange', { detail: { theme: themeName } }));

    return theme;
};

export const getCurrentTheme = () => {
    return localStorage.getItem('colab-theme') || 'sleek';
};
