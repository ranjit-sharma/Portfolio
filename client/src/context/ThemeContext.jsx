import { useEffect, useState } from 'react';
import { ThemeContext } from './theme-context';

const COLOR_THEMES = [
  { id: 'emerald', name: 'Emerald', preview: '#00D6A0' },
  { id: 'cyan', name: 'Cyan', preview: '#00D2FF' },
  { id: 'green', name: 'Green', preview: '#22C55E' },
  { id: 'amber', name: 'Amber', preview: '#FBBF24' },
  { id: 'red', name: 'Red', preview: '#EF4444' },
  { id: 'lime', name: 'Lime', preview: '#C5F467' },
];

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('portfolio-theme');
      if (saved === 'dark' || saved === 'light') return saved;
    }
    return 'dark'; // Default dark theme for first-time visitors
  });

  const [colorTheme, setColorTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('portfolio-color');
      if (saved === 'rose') return 'red';
      if (saved === 'violet') return 'green';
      if (COLOR_THEMES.some((c) => c.id === saved)) return saved;
    }
    return 'emerald'; // Default accent color
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-color', colorTheme);
    localStorage.setItem('portfolio-color', colorTheme);
  }, [colorTheme]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        isDark: theme === 'dark',
        colorTheme,
        setColorTheme,
        availableColors: COLOR_THEMES,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
