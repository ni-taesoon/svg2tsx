import enLocale from './locales/en.json';
import koLocale from './locales/ko.json';

export const SUPPORTED_LOCALES = ['ko', 'en'] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'ko';
export const FALLBACK_LOCALE: Locale = 'en';

export const APP_LANG_ENV_KEY = 'VITE_APP_LANG';
export const APP_LANG_STORAGE_KEY = 'svg2tsx-lang';

const koMessages = koLocale;
const enMessages: typeof koMessages = enLocale;

const messages = {
  ko: koMessages,
  en: enMessages,
} as const;

export type MessageKey = keyof typeof koMessages;
export type TranslationParams = Record<string, string | number>;

function normalizeLocale(lang: string | null | undefined): Locale | null {
  if (!lang) return null;

  const normalized = lang.trim().toLowerCase();
  if (normalized.startsWith('ko')) return 'ko';
  if (normalized.startsWith('en')) return 'en';

  return null;
}

function getBrowserLanguage(): string | null {
  if (typeof navigator === 'undefined') return null;
  return navigator.language;
}

function getQueryLanguage(): string | null {
  if (typeof window === 'undefined') return null;

  const query = window.location.search.startsWith('?')
    ? window.location.search.slice(1)
    : window.location.search;

  if (!query) return null;

  const langEntry = query.split('&').find((entry) => entry.startsWith('lang='));
  if (!langEntry) return null;

  const encodedLang = langEntry.slice('lang='.length);
  return encodedLang ? decodeURIComponent(encodedLang) : null;
}

function getStoredLanguage(): string | null {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem(APP_LANG_STORAGE_KEY);
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
      localStorage.setItem(APP_LANG_STORAGE_KEY, nextLocale);
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
