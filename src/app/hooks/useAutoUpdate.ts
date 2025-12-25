import { useEffect, useState, useCallback } from 'react';
import { check, Update } from '@tauri-apps/plugin-updater';
import { relaunch } from '@tauri-apps/plugin-process';

export interface UpdateState {
  update: Update | null;
  checking: boolean;
  downloading: boolean;
  progress: number;
  error: string | null;
}

export function useAutoUpdate() {
  const [state, setState] = useState<UpdateState>({
    update: null,
    checking: false,
    downloading: false,
    progress: 0,
    error: null,
  });

  const checkForUpdates = useCallback(async () => {
    setState((prev) => ({ ...prev, checking: true, error: null }));
    try {
      const available = await check();
      setState((prev) => ({ ...prev, update: available, checking: false }));
      return available;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : '업데이트 확인 실패';
      setState((prev) => ({ ...prev, error: message, checking: false }));
      console.error('업데이트 확인 실패:', error);
      return null;
    }
  }, []);

  const installUpdate = useCallback(async () => {
    if (!state.update) return;

    setState((prev) => ({ ...prev, downloading: true, error: null }));
    try {
      let downloaded = 0;
      let contentLength = 0;

      await state.update.downloadAndInstall((event) => {
        switch (event.event) {
          case 'Started':
            contentLength = event.data.contentLength ?? 0;
            break;
          case 'Progress':
            downloaded += event.data.chunkLength;
            setState((prev) => ({
              ...prev,
              progress: contentLength ? (downloaded / contentLength) * 100 : 0,
            }));
            break;
          case 'Finished':
            setState((prev) => ({ ...prev, progress: 100 }));
            break;
        }
      });

      await relaunch();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : '업데이트 설치 실패';
      setState((prev) => ({
        ...prev,
        error: message,
        downloading: false,
      }));
      console.error('업데이트 설치 실패:', error);
    }
  }, [state.update]);

  // 앱 시작 시 자동으로 업데이트 확인
  useEffect(() => {
    checkForUpdates();
  }, [checkForUpdates]);

  return {
    ...state,
    checkForUpdates,
    installUpdate,
  };
}
