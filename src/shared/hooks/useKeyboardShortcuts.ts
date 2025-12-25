/**
 * 키보드 단축키 훅
 */

import { useEffect, useCallback } from 'react';

export interface ShortcutHandlers {
  onSwitchToInput?: () => void;
  onSwitchToPreview?: () => void;
  onSwitchToOptions?: () => void;
  onSave?: () => void;
  onCopy?: () => void;
  onShowHelp?: () => void;
}

function isMac(): boolean {
  return typeof navigator !== 'undefined' && /Mac/.test(navigator.platform);
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const modifier = isMac() ? e.metaKey : e.ctrlKey;

      // 탭 전환: Cmd/Ctrl + 1/2/3
      if (modifier && !e.shiftKey) {
        if (e.key === '1') {
          e.preventDefault();
          handlers.onSwitchToInput?.();
          return;
        }
        if (e.key === '2') {
          e.preventDefault();
          handlers.onSwitchToPreview?.();
          return;
        }
        if (e.key === '3') {
          e.preventDefault();
          handlers.onSwitchToOptions?.();
          return;
        }
      }

      // 저장: Cmd/Ctrl + S
      if (modifier && e.key.toLowerCase() === 's' && !e.shiftKey) {
        e.preventDefault();
        handlers.onSave?.();
        return;
      }

      // 복사: Cmd/Ctrl + Shift + C (기본 Cmd+C와 충돌 방지)
      if (modifier && e.shiftKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        handlers.onCopy?.();
        return;
      }

      // 도움말: ?
      if (e.key === '?' && !modifier && !e.altKey) {
        e.preventDefault();
        handlers.onShowHelp?.();
        return;
      }
    },
    [handlers]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
