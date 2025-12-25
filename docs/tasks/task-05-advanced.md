# Task 05: 고급 기능 및 UX 개선

**담당 영역**: 테마 시스템, 단축키, 히스토리, 에러 핸들링, E2E 테스트
**우선순위**: P2 (개선)
**예상 기간**: 4일
**선행 작업**: Task 01~04 완료

---

## 우선순위 분류

### P1 (필수)
- 변환 옵션 UI 및 저장
- 에러 핸들링 및 Toast
- 기본 테마 시스템

### P2 (선택)
- 히스토리 기능
- 단축키 시스템
- E2E 테스트

---

## 1. 변환 옵션 UI (P1)

### 1.1 Options 탭 구현

```typescript
// src/widgets/options-panel/ui/OptionsPanel.tsx
export const OptionsPanel: React.FC = () => {
  const { options, setOptions } = useOptionsStore();

  return (
    <div className="p-4 space-y-6">
      <div className="space-y-4">
        <h3 className="font-medium">SVG 최적화</h3>

        <OptionToggle
          id="removeComments"
          label="주석 제거"
          checked={options.removeComments}
          onCheckedChange={(v) => setOptions({ removeComments: v })}
        />

        <OptionToggle
          id="removeEmptyGroups"
          label="빈 그룹 제거"
          checked={options.removeEmptyGroups}
          onCheckedChange={(v) => setOptions({ removeEmptyGroups: v })}
        />
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">TSX 변환</h3>

        <OptionToggle
          id="useMemo"
          label="React.memo"
          checked={options.useMemo}
          onCheckedChange={(v) => setOptions({ useMemo: v })}
        />

        <OptionToggle
          id="useForwardRef"
          label="forwardRef"
          checked={options.useForwardRef}
          onCheckedChange={(v) => setOptions({ useForwardRef: v })}
        />
      </div>
    </div>
  );
};
```

**체크리스트**:
- [ ] SVG 최적화 옵션 UI
- [ ] TSX 변환 옵션 UI
- [ ] Zustand 상태 연동

### 1.2 localStorage 저장

```typescript
// src/entities/options/store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useOptionsStore = create(
  persist(
    (set) => ({
      options: DEFAULT_OPTIONS,
      setOptions: (newOptions) =>
        set((state) => ({
          options: { ...state.options, ...newOptions },
        })),
      reset: () => set({ options: DEFAULT_OPTIONS }),
    }),
    {
      name: 'svg2tsx-options',
    }
  )
);
```

**체크리스트**:
- [ ] `zustand/middleware` persist 적용
- [ ] 옵션 자동 저장
- [ ] 앱 재시작 시 복원

---

## 2. 테마 시스템 (P1)

### 2.1 ThemeProvider 구현

```typescript
// src/app/providers/ThemeProvider.tsx
type Theme = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('theme') as Theme) || 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }

    localStorage.setItem('theme', theme);
  }, [theme]);

  const isDark = theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

### 2.2 테마 토글 버튼

```typescript
// src/features/theme-toggle/ui/ThemeToggle.tsx
export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => setTheme('light')}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
```

**체크리스트**:
- [ ] ThemeProvider 구현
- [ ] localStorage 저장
- [ ] 시스템 테마 감지
- [ ] 테마 토글 UI

---

## 3. 에러 핸들링 (P1)

### 3.1 에러 타입 정의

```typescript
// src/shared/types/errors.ts
export enum ErrorType {
  PARSE_ERROR = 'PARSE_ERROR',
  CONVERSION_ERROR = 'CONVERSION_ERROR',
  FILE_ERROR = 'FILE_ERROR',
}

export interface AppError {
  type: ErrorType;
  message: string;
  details?: string;
}

export function getUserFriendlyMessage(error: AppError): string {
  switch (error.type) {
    case ErrorType.PARSE_ERROR:
      return 'SVG 코드를 파싱할 수 없습니다. 올바른 SVG 형식인지 확인해주세요.';
    case ErrorType.CONVERSION_ERROR:
      return 'TSX 변환 중 오류가 발생했습니다.';
    case ErrorType.FILE_ERROR:
      return '파일 처리 중 오류가 발생했습니다.';
    default:
      return '알 수 없는 오류가 발생했습니다.';
  }
}
```

### 3.2 Toast 시스템

```typescript
// src/shared/ui/toast.tsx
import { Toaster, toast } from 'sonner';

export { Toaster, toast };

// 사용 예시
toast.success('변환 완료!');
toast.error('SVG 파싱 실패');
toast.warning('파일 크기가 너무 큽니다');
```

**설치**:
```bash
pnpm add sonner
```

**체크리스트**:
- [ ] sonner 설치
- [ ] Toaster 컴포넌트 추가
- [ ] 성공/에러/경고 toast

---

## 4. 단축키 시스템 (P2)

### 4.1 단축키 정의

```typescript
// src/shared/config/shortcuts.ts
export const SHORTCUTS = {
  SWITCH_TO_INPUT: { key: '1', modifiers: ['ctrl', 'meta'] },
  SWITCH_TO_PREVIEW: { key: '2', modifiers: ['ctrl', 'meta'] },
  SWITCH_TO_OPTIONS: { key: '3', modifiers: ['ctrl', 'meta'] },
  COPY_CODE: { key: 'c', modifiers: ['ctrl', 'meta'] },
  SAVE_FILE: { key: 's', modifiers: ['ctrl', 'meta'] },
  CONVERT: { key: 'Enter', modifiers: ['ctrl', 'meta'] },
} as const;
```

### 4.2 useKeyboardShortcuts 훅

```typescript
// src/shared/hooks/useKeyboardShortcuts.ts
export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifier = isMac ? e.metaKey : e.ctrlKey;

      if (modifier && e.key === '1') {
        e.preventDefault();
        handlers.onSwitchToInput?.();
      }
      if (modifier && e.key === '2') {
        e.preventDefault();
        handlers.onSwitchToPreview?.();
      }
      if (modifier && e.key === '3') {
        e.preventDefault();
        handlers.onSwitchToOptions?.();
      }
      if (modifier && e.key === 's') {
        e.preventDefault();
        handlers.onSave?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);
}
```

### 4.3 단축키 도움말 모달

```typescript
// src/features/shortcuts-help/ui/ShortcutsHelpModal.tsx
export const ShortcutsHelpModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '?') {
        setIsOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>키보드 단축키</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <ShortcutItem keys={['Cmd/Ctrl', '1']} description="Input 탭으로 이동" />
          <ShortcutItem keys={['Cmd/Ctrl', '2']} description="Preview 탭으로 이동" />
          <ShortcutItem keys={['Cmd/Ctrl', '3']} description="Options 탭으로 이동" />
          <ShortcutItem keys={['Cmd/Ctrl', 'S']} description="TSX 파일 저장" />
          <ShortcutItem keys={['?']} description="이 도움말 표시" />
        </div>
      </DialogContent>
    </Dialog>
  );
};
```

**체크리스트**:
- [ ] 단축키 정의
- [ ] useKeyboardShortcuts 훅
- [ ] 도움말 모달 (? 키)
- [ ] OS별 수정자 키 감지

---

## 5. 히스토리 기능 (P2)

### 5.1 히스토리 스토어

```typescript
// src/entities/history/store.ts
interface HistoryEntry {
  id: string;
  timestamp: number;
  svgInput: string;
  tsxOutput: string;
  componentName: string;
}

interface HistoryStore {
  entries: HistoryEntry[];
  maxEntries: number;
  addEntry: (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => void;
  removeEntry: (id: string) => void;
  clearHistory: () => void;
  restoreEntry: (id: string) => void;
}

export const useHistoryStore = create<HistoryStore>(
  persist(
    (set, get) => ({
      entries: [],
      maxEntries: 20,

      addEntry: (entry) => {
        const newEntry: HistoryEntry = {
          ...entry,
          id: crypto.randomUUID(),
          timestamp: Date.now(),
        };

        set((state) => ({
          entries: [newEntry, ...state.entries].slice(0, state.maxEntries),
        }));
      },

      removeEntry: (id) => {
        set((state) => ({
          entries: state.entries.filter((e) => e.id !== id),
        }));
      },

      clearHistory: () => set({ entries: [] }),

      restoreEntry: (id) => {
        const entry = get().entries.find((e) => e.id === id);
        if (entry) {
          // 복원 로직
        }
      },
    }),
    { name: 'svg2tsx-history' }
  )
);
```

### 5.2 히스토리 패널

```typescript
// src/widgets/history-panel/ui/HistoryPanel.tsx
export const HistoryPanel: React.FC = () => {
  const { entries, removeEntry, restoreEntry, clearHistory } = useHistoryStore();

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">변환 히스토리</h3>
        <Button variant="ghost" size="sm" onClick={clearHistory}>
          전체 삭제
        </Button>
      </div>

      <div className="space-y-2">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="flex items-center justify-between p-2 border rounded"
          >
            <div>
              <p className="font-medium">{entry.componentName}</p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(entry.timestamp, { addSuffix: true })}
              </p>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => restoreEntry(entry.id)}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeEntry(entry.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
```

**체크리스트**:
- [ ] 히스토리 스토어 구현
- [ ] localStorage 저장
- [ ] 최대 20개 제한
- [ ] 복원/삭제 기능

---

## 6. E2E 테스트 (P2)

### 6.1 Playwright 설정

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:1420',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'pnpm tauri dev',
    url: 'http://localhost:1420',
    reuseExistingServer: !process.env.CI,
  },
});
```

### 6.2 핵심 플로우 테스트

```typescript
// e2e/conversion-flow.spec.ts
import { test, expect } from '@playwright/test';

const SAMPLE_SVG = `<svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/></svg>`;

test('SVG 입력 및 변환', async ({ page }) => {
  await page.goto('/');

  // SVG 입력
  await page.fill('[data-testid="svg-input"]', SAMPLE_SVG);

  // 변환 결과 확인
  await expect(page.locator('[data-testid="tsx-output"]'))
    .toContainText('export const Icon');
});

test('코드 복사', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/');

  await page.fill('[data-testid="svg-input"]', SAMPLE_SVG);
  await page.click('[data-testid="copy-button"]');

  const clipboardText = await page.evaluate(() =>
    navigator.clipboard.readText()
  );
  expect(clipboardText).toContain('export const Icon');
});

test('테마 전환', async ({ page }) => {
  await page.goto('/');

  await page.click('[data-testid="theme-toggle"]');
  await page.click('text=Light');

  await expect(page.locator('html')).toHaveClass(/light/);
});
```

### 6.3 테스트 실행

```bash
pnpm test:e2e
pnpm test:e2e:ui  # UI 모드
```

**체크리스트**:
- [ ] Playwright 설정
- [ ] SVG 입력 테스트
- [ ] 변환 결과 테스트
- [ ] 복사 기능 테스트
- [ ] 테마 전환 테스트

---

## 구현 순서

### 1단계: 기본 UX 개선 (P1)
1. 에러 핸들링 및 Toast
2. 테마 시스템
3. 변환 옵션 저장

### 2단계: 고급 기능 (P2)
4. 단축키 시스템
5. 히스토리 기능

### 3단계: 품질 보증 (P2)
6. E2E 테스트 작성

---

## 완료 기준

### P1 (필수)
- [ ] 변환 옵션 localStorage 저장
- [ ] 에러 Toast 알림
- [ ] 다크/라이트 테마 전환

### P2 (선택)
- [ ] 단축키 동작
- [ ] 히스토리 저장/복원
- [ ] E2E 테스트 통과율 90%+

---

## 의존성

```bash
# 필수
pnpm add sonner zustand

# 선택
pnpm add date-fns
pnpm add -D @playwright/test
```

---

**작성일**: 2025-12-25
**버전**: 1.0.0
