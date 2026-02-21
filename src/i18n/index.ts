import enLocale from './locales/en.json';
import jaLocale from './locales/ja.json';
import koLocale from './locales/ko.json';
import zhLocale from './locales/zh.json';

export const SUPPORTED_LOCALES = ['ko', 'en', 'ja', 'zh'] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'ko';
export const FALLBACK_LOCALE: Locale = 'en';

export const APP_LANG_ENV_KEY = 'VITE_APP_LANG';
export const APP_LANG_STORAGE_KEY = 'svg2tsx-lang';

const koMessages = koLocale;
const enMessages: typeof koMessages = enLocale;
const jaMessages: typeof koMessages = jaLocale;
const zhMessages: typeof koMessages = zhLocale;

const messages = {
  ko: koMessages,
  en: enMessages,
  ja: jaMessages,
  zh: zhMessages,
} as const;

export type MessageKey = keyof typeof koMessages;
export type TranslationParams = Record<string, string | number>;

function normalizeLocale(lang: string | null | undefined): Locale | null {
  if (!lang) return null;

  const normalized = lang.trim().toLowerCase();
  if (normalized.startsWith('ko')) return 'ko';
  if (normalized.startsWith('en')) return 'en';
  if (normalized.startsWith('ja')) return 'ja';
  if (normalized.startsWith('zh')) return 'zh';

  return null;
}

function getBrowserLanguage(): string | null {
  if (typeof navigator === 'undefined') return null;
  return navigator.language;
}

function getQueryLanguage(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const lang = new window.URLSearchParams(window.location.search).get('lang');
    return lang && lang.trim().length > 0 ? lang : null;
  } catch {
    return null;
  }
}

function getStoredLanguage(): string | null {
  if (typeof localStorage === 'undefined') return null;
  try {
    return localStorage.getItem(APP_LANG_STORAGE_KEY);
  } catch {
    return null;
  }
}

function getEnvLanguage(): string | null {
  const envValue = import.meta.env[APP_LANG_ENV_KEY];
  return typeof envValue === 'string' ? envValue : null;
}

export interface ResolveLocaleOptions {
  lang?: string | null;
  queryLang?: string | null;
  envLang?: string | null;
  storedLang?: string | null;
  browserLang?: string | null;
}

export function resolveLocale(options: ResolveLocaleOptions = {}): Locale {
  return (
    normalizeLocale(options.lang) ??
    normalizeLocale(options.queryLang) ??
    normalizeLocale(options.envLang) ??
    normalizeLocale(options.storedLang) ??
    normalizeLocale(options.browserLang) ??
    DEFAULT_LOCALE
  );
}

let currentLocale: Locale = resolveLocale({
  queryLang: getQueryLanguage(),
  envLang: getEnvLanguage(),
  storedLang: getStoredLanguage(),
  browserLang: getBrowserLanguage(),
});

export function getCurrentLocale(): Locale {
  return currentLocale;
}

export function setCurrentLocale(lang: string): Locale {
  const nextLocale = normalizeLocale(lang);
  if (nextLocale) {
    currentLocale = nextLocale;

    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(APP_LANG_STORAGE_KEY, nextLocale);
      } catch {
        // Ignore storage write errors (e.g. privacy mode) and keep runtime locale.
      }
    }
  }

  return currentLocale;
}

function interpolate(message: string, params?: TranslationParams): string {
  if (!params) {
    return message;
  }

  return message.replace(/\{(\w+)\}/g, (_placeholder, key: string) => {
    const value = params[key];
    return value === undefined ? `{${key}}` : String(value);
  });
}

function getMessage(locale: Locale, key: MessageKey): string {
  const localeMessage = messages[locale][key];
  if (localeMessage) {
    return localeMessage;
  }

  return messages[FALLBACK_LOCALE][key] ?? String(key);
}

export function t(key: MessageKey, params?: TranslationParams): string {
  return interpolate(getMessage(currentLocale, key), params);
}

export function translate(locale: Locale, key: MessageKey, params?: TranslationParams): string {
  return interpolate(getMessage(locale, key), params);
}
