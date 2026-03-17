'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  toggle: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [overrideTheme, setOverrideTheme] = useState<Theme | null>(null);

  const getSystemTheme = (): Theme =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

  const applyTheme = (next: Theme) => {
    setTheme(next);
    document.documentElement.classList.toggle('dark', next === 'dark');
  };

  // Initialize from localStorage / system preference
  useEffect(() => {
    const storedOverride = localStorage.getItem('ek-theme-override') as Theme | null;

    // Backward compatibility for older keys.
    const storedMode = localStorage.getItem('ek-theme-mode');
    const legacy = localStorage.getItem('ek-theme') as Theme | null;

    const resolvedLegacy: Theme | null =
      storedOverride ??
      (storedMode === 'light' || storedMode === 'dark' ? storedMode : null) ??
      legacy;

    setOverrideTheme(resolvedLegacy);
    applyTheme(resolvedLegacy ?? getSystemTheme());

    localStorage.removeItem('ek-theme-mode');
    localStorage.removeItem('ek-theme');
  }, []);

  // Follow device changes when no user override is active.
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      if (overrideTheme) return;
      applyTheme(media.matches ? 'dark' : 'light');
    };

    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [overrideTheme]);

  const toggle = () => {
    const systemTheme = getSystemTheme();
    const current = overrideTheme ?? theme;
    const next: Theme = current === 'dark' ? 'light' : 'dark';

    // If next theme equals system, clear override so app follows device again.
    if (next === systemTheme) {
      setOverrideTheme(null);
      localStorage.removeItem('ek-theme-override');
    } else {
      setOverrideTheme(next);
      localStorage.setItem('ek-theme-override', next);
    }

    applyTheme(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}
