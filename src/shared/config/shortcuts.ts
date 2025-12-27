/**
 * 키보드 단축키 정의
 */

export interface Shortcut {
  key: string;
  modifiers: readonly ('ctrl' | 'meta' | 'alt' | 'shift')[];
  description: string;
}

export const SHORTCUTS = {
  SWITCH_TO_INPUT: {
    key: '1',
    modifiers: ['ctrl', 'meta'] as const,
    description: '파일 선택창 열기',
  },
  SWITCH_TO_PREVIEW: {
    key: '2',
    modifiers: ['ctrl', 'meta'] as const,
    description: 'Preview 탭으로 이동',
  },
  SWITCH_TO_OPTIONS: {
    key: '3',
    modifiers: ['ctrl', 'meta'] as const,
    description: 'Options 탭으로 이동',
  },
  SAVE_FILE: {
    key: 's',
    modifiers: ['ctrl', 'meta'] as const,
    description: 'TSX 파일 저장',
  },
  COPY_CODE: {
    key: 'c',
    modifiers: ['ctrl', 'meta', 'shift'] as const,
    description: '코드 복사 (Shift 필요)',
  },
  SHOW_HELP: {
    key: '?',
    modifiers: [] as const,
    description: '단축키 도움말 표시',
  },
} as const;

export type ShortcutKey = keyof typeof SHORTCUTS;

export function getShortcutLabel(shortcut: Shortcut): string {
  const isMac = typeof navigator !== 'undefined' && /Mac/.test(navigator.platform);

  const modifierLabels: Record<string, string> = isMac
    ? { ctrl: '⌃', meta: '⌘', alt: '⌥', shift: '⇧' }
    : { ctrl: 'Ctrl', meta: 'Ctrl', alt: 'Alt', shift: 'Shift' };

  const parts = shortcut.modifiers
    .filter((mod) => (isMac ? true : mod !== 'meta'))
    .map((mod) => modifierLabels[mod]);

  const keyLabel = shortcut.key.length === 1 ? shortcut.key.toUpperCase() : shortcut.key;

  return [...parts, keyLabel].join(isMac ? '' : '+');
}
