import { useEffect, useState, useCallback } from 'react';
import { ThemeContext } from './theme-context';
import api from '../services/api';

const COLOR_THEMES = [
  { id: 'emerald', name: 'Emerald', preview: '#00D6A0' },
  { id: 'cyan', name: 'Cyan', preview: '#00D2FF' },
  { id: 'green', name: 'Green', preview: '#22C55E' },
  { id: 'amber', name: 'Amber', preview: '#FBBF24' },
  { id: 'red', name: 'Red', preview: '#EF4444' },
  { id: 'lime', name: 'Lime', preview: '#C5F467' },
];

export function ThemeProvider({ children }) {
  const serverTheme = typeof window !== 'undefined' ? window.__INITIAL_THEME__ : null;

  // Initial state reads server-injected theme first, then localStorage cache
  const [theme, setTheme] = useState(() => {
    if (serverTheme?.themeMode === 'dark' || serverTheme?.themeMode === 'light') {
      return serverTheme.themeMode;
    }
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('portfolio-theme');
      if (saved === 'dark' || saved === 'light') return saved;
    }
    return 'dark'; // Default dark theme
  });

  const [colorTheme, setColorTheme] = useState(() => {
    if (serverTheme?.accentColor && COLOR_THEMES.some((c) => c.id === serverTheme.accentColor)) {
      return serverTheme.accentColor;
    }
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('portfolio-color');
      if (saved === 'rose') return 'red';
      if (saved === 'violet') return 'green';
      if (COLOR_THEMES.some((c) => c.id === saved)) return saved;
    }
    return 'emerald'; // Default accent color
  });

  // Apply DOM attributes & update localStorage cache whenever theme or colorTheme changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('portfolio-theme', theme);
    } catch {}
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-color', colorTheme);
    try {
      localStorage.setItem('portfolio-color', colorTheme);
    } catch {}
  }, [colorTheme]);

  // Fetch admin-configured global theme from backend on load.
  // Every new visitor and viewer receives and stays on the admin's theme.
  useEffect(() => {
    let isMounted = true;
    api
      .get('/profile')
      .then((res) => {
        if (!isMounted) return;
        const profile = res.data?.data;
        if (profile) {
          if (profile.themeMode && (profile.themeMode === 'dark' || profile.themeMode === 'light')) {
            setTheme(profile.themeMode);
            document.documentElement.setAttribute('data-theme', profile.themeMode);
            try {
              localStorage.setItem('portfolio-theme', profile.themeMode);
            } catch {}
          }
          if (profile.accentColor && COLOR_THEMES.some((c) => c.id === profile.accentColor)) {
            setColorTheme(profile.accentColor);
            document.documentElement.setAttribute('data-color', profile.accentColor);
            try {
              localStorage.setItem('portfolio-color', profile.accentColor);
            } catch {}
          }
        }
      })
      .catch(() => {
        // Fallback to cache/defaults if offline
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Persist theme changes to backend if the admin changes it
  const persistTheme = useCallback(async (newTheme, newColor) => {
    try {
      await api.put('/admin/profile', {
        themeMode: newTheme,
        accentColor: newColor,
      });
    } catch {
      // Ignored if unauthenticated or temporary network hiccup
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      persistTheme(next, colorTheme);
      return next;
    });
  }, [colorTheme, persistTheme]);

  const setThemeMode = useCallback(
    (mode) => {
      if (mode === 'dark' || mode === 'light') {
        setTheme(mode);
        persistTheme(mode, colorTheme);
      }
    },
    [colorTheme, persistTheme]
  );

  const handleSetColorTheme = useCallback(
    (colorId) => {
      if (COLOR_THEMES.some((c) => c.id === colorId)) {
        setColorTheme(colorId);
        persistTheme(theme, colorId);
      }
    },
    [theme, persistTheme]
  );

  const setGlobalTheme = useCallback(
    async (mode, colorId) => {
      const targetMode = mode === 'dark' || mode === 'light' ? mode : theme;
      const targetColor = COLOR_THEMES.some((c) => c.id === colorId) ? colorId : colorTheme;
      setTheme(targetMode);
      setColorTheme(targetColor);
      await persistTheme(targetMode, targetColor);
    },
    [theme, colorTheme, persistTheme]
  );

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        setThemeMode,
        isDark: theme === 'dark',
        colorTheme,
        setColorTheme: handleSetColorTheme,
        setGlobalTheme,
        availableColors: COLOR_THEMES,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
