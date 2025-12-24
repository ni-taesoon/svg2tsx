import { useState, useEffect, useCallback, useRef } from "react";
import { invoke } from "@tauri-apps/api/core";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { getCurrentWindow } from "@tauri-apps/api/window";

type Theme = "system" | "light" | "dark";

const THEME_KEY = "svg2tsx-theme";

// RGB 색상값
const THEME_COLORS = {
  light: { r: 246, g: 246, b: 246 }, // #f6f6f6
  dark: { r: 47, g: 47, b: 47 }, // #2f2f2f
} as const;

function getStoredTheme(): Theme {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === "light" || stored === "dark" || stored === "system") {
    return stored;
  }
  return "system";
}

function getSystemTheme(): "light" | "dark" {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

async function applyTheme(theme: Theme) {
  const effectiveTheme = theme === "system" ? getSystemTheme() : theme;

  // 1. CSS data-theme 속성 설정
  document.documentElement.setAttribute("data-theme", effectiveTheme);

  // 2. Rust 커맨드로 macOS NSWindow 배경색 직접 설정 (핵심!)
  const color = THEME_COLORS[effectiveTheme];
  try {
    await invoke("set_theme_color", { r: color.r, g: color.g, b: color.b });
  } catch (e) {
    console.warn("Failed to set native background color:", e);
  }

  const isWindows =
    typeof navigator !== "undefined" && /Win/.test(navigator.platform);
  if (isWindows) {
    try {
      await getCurrentWebviewWindow().setBackgroundColor([
        color.r,
        color.g,
        color.b,
        255,
      ]);
    } catch (e) {
      console.warn("Failed to set webview background color:", e);
    }
  }
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(getStoredTheme);
  const hasShownWindow = useRef(false);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(THEME_KEY, newTheme);
    applyTheme(newTheme);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const applyAndShow = async () => {
      // 초기 로드 시 테마 적용
      await applyTheme(theme);
      if (!cancelled && !hasShownWindow.current) {
        try {
          await getCurrentWindow().show();
          hasShownWindow.current = true;
        } catch (e) {
          console.warn("Failed to show window:", e);
        }
      }
    };
    applyAndShow();

    // 시스템 테마 변경 감지
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (theme === "system") {
        applyTheme("system");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => {
      cancelled = true;
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [theme]);

  return { theme, setTheme };
}
