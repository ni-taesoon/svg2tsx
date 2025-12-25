/**
 * Tauri 외부 파일 Drag & Drop 훅
 *
 * Finder/Explorer에서 파일을 드래그하여 앱에 드롭할 때 처리
 */

import { useEffect, useState } from 'react';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { readTextFile } from '@tauri-apps/plugin-fs';

export interface UseTauriDragDropOptions {
  /** 허용할 파일 확장자 (예: ['.svg']) */
  allowedExtensions?: string[];
  /** 파일이 드롭되었을 때 호출 */
  onFileDrop?: (content: string, fileName: string) => void;
  /** 에러 발생 시 호출 */
  onError?: (error: Error) => void;
}

export interface UseTauriDragDropResult {
  /** 현재 드래그 중인지 여부 */
  isDragging: boolean;
}

export const useTauriDragDrop = (
  options: UseTauriDragDropOptions = {}
): UseTauriDragDropResult => {
  const { allowedExtensions = ['.svg'], onFileDrop, onError } = options;
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const setupDragDrop = async () => {
      const window = getCurrentWindow();

      const unlisten = await window.onDragDropEvent(async (event) => {
        if (event.payload.type === 'enter' || event.payload.type === 'over') {
          setIsDragging(true);
        } else if (event.payload.type === 'leave') {
          setIsDragging(false);
        } else if (event.payload.type === 'drop') {
          setIsDragging(false);

          const paths = event.payload.paths;
          if (!paths || paths.length === 0) return;

          // 첫 번째 유효한 파일 찾기
          const validPath = paths.find((path) =>
            allowedExtensions.some((ext) => path.toLowerCase().endsWith(ext))
          );

          if (!validPath) {
            onError?.(new Error('지원하지 않는 파일 형식입니다. SVG 파일만 허용됩니다.'));
            return;
          }

          try {
            const content = await readTextFile(validPath);
            const fileName = validPath.split('/').pop() || 'unknown.svg';
            onFileDrop?.(content, fileName);
          } catch (err) {
            onError?.(err instanceof Error ? err : new Error('파일 읽기 실패'));
          }
        }
      });

      return unlisten;
    };

    const unlistenPromise = setupDragDrop();

    return () => {
      unlistenPromise.then((unlisten) => unlisten());
    };
  }, [allowedExtensions, onFileDrop, onError]);

  return { isDragging };
};
