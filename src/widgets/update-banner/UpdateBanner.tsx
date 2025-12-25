import { useState } from 'react';
import { useAutoUpdate } from '@/app/hooks/useAutoUpdate';

export function UpdateBanner() {
  const { update, downloading, progress, installUpdate, error } = useAutoUpdate();
  const [dismissed, setDismissed] = useState(false);

  // 업데이트가 없거나 사용자가 닫았으면 렌더링 안 함
  if (!update || dismissed) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 rounded-lg bg-blue-600 p-4 text-white shadow-lg dark:bg-blue-700">
      <div className="font-medium">새 버전 사용 가능</div>
      <div className="mt-1 text-sm opacity-90">v{update.version} 버전이 준비되었습니다.</div>

      {error && (
        <div className="mt-2 rounded bg-red-500/20 px-2 py-1 text-xs text-red-100">{error}</div>
      )}

      {downloading ? (
        <div className="mt-3">
          <div className="h-2 overflow-hidden rounded-full bg-blue-400">
            <div
              className="h-full bg-white transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-1 text-xs">{Math.round(progress)}% 다운로드 중...</div>
        </div>
      ) : (
        <div className="mt-3 flex gap-2">
          <button
            onClick={installUpdate}
            className="rounded bg-white px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50"
          >
            지금 업데이트
          </button>
          <button
            onClick={() => handleDismiss(update.version, setDismissed)}
            className="px-3 py-1.5 text-sm text-white/80 hover:text-white"
          >
            나중에
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * TODO: dismiss 전략을 구현해주세요!
 *
 * 현재는 세션 동안만 숨깁니다.
 * 다음 중 하나를 선택해서 구현할 수 있습니다:
 *
 * 1. 세션 동안만 숨기기 (현재)
 *    - 앱을 재시작하면 다시 표시
 *
 * 2. 특정 버전 무시하기
 *    - localStorage에 무시할 버전 저장
 *    - 새 버전이 나오면 다시 표시
 *
 * 3. 일정 시간 후 다시 표시
 *    - localStorage에 마지막 dismiss 시간 저장
 *    - 예: 24시간 후 다시 표시
 *
 * @param version - 현재 업데이트 버전
 * @param setDismissed - dismissed 상태 setter
 */
function handleDismiss(_version: string, setDismissed: (v: boolean) => void) {
  // 현재: 세션 동안만 숨김
  setDismissed(true);

  // 예시: 특정 버전 무시하기
  // localStorage.setItem('ignoredUpdateVersion', _version);

  // 예시: 24시간 후 다시 표시
  // localStorage.setItem('dismissedUpdateAt', Date.now().toString());
}
