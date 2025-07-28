import { useState, useEffect } from 'react';

export interface UseThemeReturn {
    theme: 'dark' | 'light';
    toggleTheme: () => void;
    setTheme: (theme: 'dark' | 'light') => void;
}

export const useTheme = (): UseThemeReturn => {
    // SymbIA is primarily a dark theme application, but we keep the hook for future flexibility
    const [theme, setThemeState] = useState<'dark' | 'light'>('dark');

    useEffect(() => {
        // Get theme from localStorage or default to dark
        const savedTheme = localStorage.getItem('symbia-theme') as 'dark' | 'light' | null;
        if (savedTheme) {
            setThemeState(savedTheme);
        }
    }, []);

    useEffect(() => {
        // Apply theme to document
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('symbia-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setThemeState(prev => prev === 'dark' ? 'light' : 'dark');
    };

    const setTheme = (newTheme: 'dark' | 'light') => {
        setThemeState(newTheme);
    };

    return {
        theme,
        toggleTheme,
        setTheme,
    };
};
