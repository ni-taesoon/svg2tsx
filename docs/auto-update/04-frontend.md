# Phase 4: 프론트엔드 UI

## 4.1 업데이트 확인 방식 선택

### 옵션 A: 앱 시작 시 자동 확인 (권장)

```typescript
// src/app/hooks/useAutoUpdate.ts
import { useEffect, useState } from 'react';
import { check, Update } from '@tauri-apps/plugin-updater';
import { relaunch } from '@tauri-apps/plugin-process';

export function useAutoUpdate() {
  const [update, setUpdate] = useState<Update | null>(null);
  const [checking, setChecking] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    checkForUpdates();
  }, []);

  async function checkForUpdates() {
    setChecking(true);
    try {
      const available = await check();
      setUpdate(available);
    } catch (error) {
      console.error('업데이트 확인 실패:', error);
    } finally {
      setChecking(false);
    }
  }

  async function installUpdate() {
    if (!update) return;

    setDownloading(true);
    try {
      let downloaded = 0;
      let contentLength = 0;

      await update.downloadAndInstall((event) => {
        switch (event.event) {
          case 'Started':
            contentLength = event.data.contentLength ?? 0;
            break;
          case 'Progress':
            downloaded += event.data.chunkLength;
            setProgress(contentLength ? (downloaded / contentLength) * 100 : 0);
            break;
          case 'Finished':
            setProgress(100);
            break;
        }
      });

      await relaunch();
    } catch (error) {
      console.error('업데이트 설치 실패:', error);
      setDownloading(false);
    }
  }

  return {
    update,
    checking,
    downloading,
    progress,
    checkForUpdates,
    installUpdate,
  };
}
```

### 옵션 B: 사용자 수동 확인

메뉴나 설정에서 "업데이트 확인" 버튼 제공.

## 4.2 업데이트 알림 UI

### 간단한 토스트/배너 방식

```typescript
// src/widgets/update-banner/UpdateBanner.tsx
import { useAutoUpdate } from '@/app/hooks/useAutoUpdate';

export function UpdateBanner() {
  const { update, downloading, progress, installUpdate } = useAutoUpdate();

  if (!update) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg max-w-sm">
      <div className="font-medium">새 버전 사용 가능</div>
      <div className="text-sm opacity-90 mt-1">
        {update.version} 버전이 준비되었습니다.
      </div>

      {downloading ? (
        <div className="mt-3">
          <div className="h-2 bg-blue-400 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-xs mt-1">{Math.round(progress)}% 다운로드 중...</div>
        </div>
      ) : (
        <div className="flex gap-2 mt-3">
          <button
            onClick={installUpdate}
            className="px-3 py-1.5 bg-white text-blue-600 rounded text-sm font-medium hover:bg-blue-50"
          >
            지금 업데이트
          </button>
          <button
            onClick={() => {/* dismiss */}}
            className="px-3 py-1.5 text-white/80 hover:text-white text-sm"
          >
            나중에
          </button>
        </div>
      )}
    </div>
  );
}
```

### 다이얼로그 방식

```typescript
// Tauri dialog 플러그인 활용
import { ask } from '@tauri-apps/plugin-dialog';

async function promptUpdate(update: Update) {
  const confirmed = await ask(
    `새 버전 ${update.version}이 사용 가능합니다.\n\n${update.body ?? ''}\n\n지금 업데이트하시겠습니까?`,
    { title: '업데이트 사용 가능', kind: 'info' }
  );

  if (confirmed) {
    await update.downloadAndInstall();
    await relaunch();
  }
}
```

## 4.3 App.tsx에 통합

```typescript
// src/app/App.tsx
import { UpdateBanner } from '@/widgets/update-banner/UpdateBanner';

export function App() {
  return (
    <>
      {/* 기존 앱 컨텐츠 */}
      <MainContent />

      {/* 업데이트 배너 (조건부 렌더링됨) */}
      <UpdateBanner />
    </>
  );
}
```

## 4.4 릴리스 노트 표시 (선택)

```typescript
// update.body에 릴리스 노트가 포함됨
if (update) {
  console.log('버전:', update.version);
  console.log('릴리스 날짜:', update.date);
  console.log('릴리스 노트:', update.body);
}
```

## 4.5 에러 처리

```typescript
import { check } from '@tauri-apps/plugin-updater';

async function safeCheckUpdate() {
  try {
    return await check();
  } catch (error) {
    // 네트워크 오류, 서버 다운 등
    if (error instanceof Error) {
      if (error.message.includes('network')) {
        console.log('네트워크 연결을 확인하세요');
      } else if (error.message.includes('404')) {
        console.log('업데이트 서버를 찾을 수 없습니다');
      }
    }
    return null;
  }
}
```

## 완료 체크리스트

- [ ] `useAutoUpdate` 훅 구현
- [ ] 업데이트 알림 UI 구현 (배너 or 다이얼로그)
- [ ] App.tsx에 통합
- [ ] 에러 처리 추가
- [ ] 로컬에서 테스트 (개발 모드에서는 작동 안 함, 빌드 필요)

## 테스트 방법

1. v0.1.6으로 앱 빌드 및 설치
2. 버전을 v0.2.0으로 올리고 릴리스
3. 설치된 v0.1.6 앱 실행
4. 업데이트 알림 확인
5. 업데이트 설치 및 재시작 확인
