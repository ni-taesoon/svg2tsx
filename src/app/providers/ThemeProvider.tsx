import { useState, useEffect, useCallback, useRef, createContext, useContext } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';
import { getCurrentWindow } from '@tauri-apps/api/window';

type Theme = 'system' | 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const THEME_KEY = 'svg2tsx-theme';

const THEME_COLORS = {
  light: { r: 246, g: 246, b: 246 },
  dark: { r: 47, g: 47, b: 47 },
} as const;

function getStoredTheme(): Theme {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    return stored;
  }
  return 'system';
}

function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

async function applyTheme(theme: Theme) {
  const effectiveTheme = theme === 'system' ? getSystemTheme() : theme;

  document.documentElement.setAttribute('data-theme', effectiveTheme);
  document.documentElement.classList.remove('light', 'dark');
  document.documentElement.classList.add(effectiveTheme);

  const color = THEME_COLORS[effectiveTheme];
  try {
    await invoke('set_theme_color', { r: color.r, g: color.g, b: color.b });
  } catch (e) {
    console.warn('Failed to set native background color:', e);
  }

  const isWindows = typeof navigator !== 'undefined' && /Win/.test(navigator.platform);
  if (isWindows) {
    try {
      await getCurrentWebviewWindow().setBackgroundColor([color.r, color.g, color.b, 255]);
    } catch (e) {
      console.warn('Failed to set webview background color:', e);
    }
  }
}

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
}

export function ThemeProvider({ children, defaultTheme = 'system' }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = getStoredTheme();
    return stored !== 'system' ? stored : defaultTheme;
  });
  const hasShownWindow = useRef(false);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(THEME_KEY, newTheme);
    applyTheme(newTheme);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const applyAndShow = async () => {
      await applyTheme(theme);
      if (!cancelled && !hasShownWindow.current) {
        try {
          await getCurrentWindow().show();
          hasShownWindow.current = true;
        } catch (e) {
          console.warn('Failed to show window:', e);
        }
      }
    };
    applyAndShow();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => {
      cancelled = true;
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [theme]);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
