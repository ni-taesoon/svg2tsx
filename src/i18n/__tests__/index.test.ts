import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  APP_LANG_STORAGE_KEY,
  DEFAULT_LOCALE,
  getCurrentLocale,
  resolveLocale,
  setCurrentLocale,
  t,
  translate,
} from '../index';

describe('i18n', () => {
  beforeEach(() => {
    localStorage.removeItem(APP_LANG_STORAGE_KEY);
    setCurrentLocale(DEFAULT_LOCALE);
  });

  describe('resolveLocale', () => {
    it('supports locale strings with region suffix', () => {
      expect(resolveLocale({ lang: 'ko-KR' })).toBe('ko');
      expect(resolveLocale({ lang: 'en-US' })).toBe('en');
      expect(resolveLocale({ lang: 'ja-JP' })).toBe('ja');
    });

    it('applies locale source priority in order', () => {
      expect(
        resolveLocale({
          lang: null,
          queryLang: 'en',
          envLang: 'ko',
          storedLang: 'ko',
          browserLang: 'ko',
        })
      ).toBe('en');

      expect(
        resolveLocale({
          queryLang: null,
          envLang: 'en',
          storedLang: 'ko',
          browserLang: 'ko',
        })
      ).toBe('en');
    });

    it('falls back to default locale for unsupported values', () => {
      expect(resolveLocale({ lang: 'jp' })).toBe(DEFAULT_LOCALE);
      expect(resolveLocale()).toBe(DEFAULT_LOCALE);
    });
  });

  describe('translate', () => {
    it('returns translated string for target locale', () => {
      expect(translate('ko', 'main.header.input')).toBe('입력');
      expect(translate('en', 'main.header.input')).toBe('Input');
      expect(translate('ja', 'main.header.input')).toBe('入力');
    });

    it('replaces interpolation placeholders', () => {
      expect(translate('en', 'toast.fileLoaded', { fileName: 'icon.svg' })).toBe(
        'icon.svg file loaded'
      );
      expect(translate('ko', 'error.svgParse', { message: 'invalid tag' })).toBe(
        'SVG 파싱 에러: invalid tag'
      );
      expect(translate('ja', 'error.svgParse', { message: 'invalid tag' })).toBe(
        'SVG解析エラー: invalid tag'
      );
    });
  });

  describe('setCurrentLocale', () => {
    it('updates and persists locale', () => {
      setCurrentLocale('ja');
      expect(getCurrentLocale()).toBe('ja');
      expect(localStorage.getItem(APP_LANG_STORAGE_KEY)).toBe('ja');
    });

    it('keeps current locale for unsupported input', () => {
      setCurrentLocale('ja');
      setCurrentLocale('jp');
      expect(getCurrentLocale()).toBe('ja');
    });

    it('uses active locale when calling t()', () => {
      setCurrentLocale('en');
      expect(t('toast.copied')).toBe('Copied to clipboard');

      setCurrentLocale('ja');
      expect(t('toast.copied')).toBe('クリップボードにコピーしました');

      setCurrentLocale('ko');
      expect(t('toast.copied')).toBe('클립보드에 복사되었습니다');
    });

    it('keeps runtime locale when localStorage write fails', () => {
      const setItemSpy = vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
        throw new Error('storage unavailable');
      });

      expect(() => setCurrentLocale('en')).not.toThrow();
      expect(getCurrentLocale()).toBe('en');

      setItemSpy.mockRestore();
    });
  });
});
