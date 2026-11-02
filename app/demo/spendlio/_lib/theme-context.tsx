'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Scoped version of Spendlio's theme: instead of toggling `.dark` on <html>
// (which would also flip the portfolio), it toggles `.sp-dark` on the demo wrapper.

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const STORAGE_KEY = 'spendlio_demo_theme';
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Runs before React hydrates, so there is no flash of the wrong theme
const noFlashScript = `try{var t=localStorage.getItem('${STORAGE_KEY}')||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.getElementById('spendlio-root').classList.toggle('sp-dark',t==='dark')}catch(e){}`;

export function ThemeProvider({ className = '', children }: { className?: string; children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    let initial: Theme = 'dark';
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
      initial = stored ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    } catch {}
    setTheme(initial);
  }, []);

  function toggleTheme() {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {}
      return next;
    });
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div
        id="spendlio-root"
        className={`spendlio ${theme === 'dark' ? 'sp-dark' : ''} ${className}`}
        suppressHydrationWarning
      >
        <script dangerouslySetInnerHTML={{ __html: noFlashScript }} />
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme musí byť použité vnútri ThemeProvider');
  return ctx;
}
