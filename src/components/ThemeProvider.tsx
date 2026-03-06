'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: 'light',
    toggleTheme: () => { },
});

export function useTheme() {
    return useContext(ThemeContext);
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>('light');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('vybe-theme') as Theme;
        const initial = stored || 'light'; // Facebook-style: light by default
        setTheme(initial);
        document.documentElement.setAttribute('data-theme', initial);
        setMounted(true);
    }, []);

    function toggleTheme() {
        const next = theme === 'light' ? 'dark' : 'light';
        setTheme(next);
        localStorage.setItem('vybe-theme', next);
        document.documentElement.setAttribute('data-theme', next);
    }

    if (!mounted) {
        return (
            <script
                dangerouslySetInnerHTML={{
                    __html: `
            (function() {
              var t = localStorage.getItem('vybe-theme') || 'light';
              document.documentElement.setAttribute('data-theme', t);
            })();
          `,
                }}
            />
        );
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}
