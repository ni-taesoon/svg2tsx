# Task 01: 프로젝트 초기 설정 및 기반 구조

## 📋 작업 개요

- **담당 영역**: 프로젝트 초기 설정 및 기반 구조
- **우선순위**: P0 (최우선)
- **예상 기간**: 2일
- **의존성**: 선행 작업 없음 (독립 작업)
- **후속 작업**: 모든 작업 (Task 02~05)

---

## 🎯 목표

Tauri v2 + React 19 + Vite 7 기반의 개발 환경을 완전히 구축하고, FSD 아키텍처 폴더 구조를 생성하며, 모든 개발 도구(ESLint, Prettier, Vitest, Playwright)를 설정합니다.

---

## ✅ 체크리스트

### 1. Tauri v2 + React 19 + Vite 7 프로젝트 생성

- [x] **Tauri CLI 설치**
  ```bash
  bun add -g @tauri-apps/cli
  ```

- [x] **Tauri 프로젝트 초기화**
  ```bash
  bun create tauri-app --rc
  # 옵션 선택:
  # - App name: svg2tsx
  # - Frontend: Vite
  # - Frontend framework: React
  # - TypeScript: Yes
  # - Package manager: bun
  ```

- [x] **React 19 및 Vite 7 버전 확인**
  ```bash
  # package.json에서 버전 확인
  # React: ^19.0.0
  # Vite: ^7.0.0
  ```

- [x] **프로젝트 실행 확인**
  ```bash
  bun install
  bun run tauri dev
  ```
  **완료 기준**: Tauri 윈도우가 정상적으로 열리고 "Hello, Tauri!" 화면이 표시됨

---

### 2. bun 설정

- [x] **bun 버전 확인**
  ```bash
  bun --version  # >= 1.0.0
  ```

- [x] **bunfig.toml 설정 (선택사항)**
  ```toml
  # bunfig.toml
  [install]
  peer = true
  ```
  **참고**: bun은 기본적으로 peer dependencies 자동 설치

---

### 3. FSD (Feature-Sliced Design) 폴더 구조 생성

- [ ] **src/ 폴더 구조 생성**
  ```bash
  mkdir -p src/app/providers
  mkdir -p src/app/styles
  mkdir -p src/pages/main/ui
  mkdir -p src/widgets/svg-input-panel/ui
  mkdir -p src/widgets/tsx-output-panel/ui
  mkdir -p src/widgets/options-panel/ui
  mkdir -p src/features/convert-svg/model
  mkdir -p src/features/convert-svg/ui
  mkdir -p src/features/copy-code/ui
  mkdir -p src/features/save-file/ui
  mkdir -p src/features/toggle-option/model
  mkdir -p src/features/toggle-option/ui
  mkdir -p src/entities/svg/model/__tests__
  mkdir -p src/entities/tsx/model/__tests__
  mkdir -p src/entities/options/model
  mkdir -p src/shared/ui
  mkdir -p src/shared/lib
  mkdir -p src/shared/api
  mkdir -p src/shared/config
  ```

- [ ] **각 슬라이스별 index.ts 생성**
  - [ ] `src/app/index.ts`
  ```typescript
  export { default as App } from './App';
  ```

  - [ ] `src/app/providers/index.ts`
  ```typescript
  export { ThemeProvider } from './ThemeProvider';
  ```

  - [ ] `src/pages/main/index.ts`
  ```typescript
  export { MainPage } from './ui/MainPage';
  ```

  - [ ] `src/widgets/svg-input-panel/index.ts`
  ```typescript
  export { SvgInputPanel } from './ui/SvgInputPanel';
  ```

  - [ ] `src/widgets/tsx-output-panel/index.ts`
  ```typescript
  export { TsxOutputPanel } from './ui/TsxOutputPanel';
  ```

  - [ ] `src/widgets/options-panel/index.ts`
  ```typescript
  export { OptionsPanel } from './ui/OptionsPanel';
  ```

  - [ ] `src/features/convert-svg/index.ts`
  ```typescript
  export { convertSvgToTsx } from './model/convert';
  export { ConvertButton } from './ui/ConvertButton';
  ```

  - [ ] `src/features/copy-code/index.ts`
  ```typescript
  export { CopyCodeButton } from './ui/CopyCodeButton';
  ```

  - [ ] `src/features/save-file/index.ts`
  ```typescript
  export { SaveFileButton } from './ui/SaveFileButton';
  ```

  - [ ] `src/features/toggle-option/index.ts`
  ```typescript
  export { useOptions } from './model/useOptions';
  export { OptionToggle } from './ui/OptionToggle';
  ```

  - [ ] `src/entities/svg/index.ts`
  ```typescript
  export { parseSvg } from './model/parser';
  export { optimizeSvg } from './model/optimizer';
  export type { SvgNode, SvgAttribute } from './model/types';
  ```

  - [ ] `src/entities/tsx/index.ts`
  ```typescript
  export { generateTsx } from './model/generator';
  export { getTsxTemplate } from './model/templates';
  export type { TsxConfig, TsxOutput } from './model/types';
  ```

  - [ ] `src/entities/options/index.ts`
  ```typescript
  export { useOptionsStore } from './model/store';
  export type { ConversionOptions } from './model/types';
  ```

  - [ ] `src/shared/ui/index.ts`
  ```typescript
  export * from './button';
  export * from './tabs';
  ```

  - [ ] `src/shared/lib/index.ts`
  ```typescript
  export * from './utils';
  ```

  - [ ] `src/shared/api/index.ts`
  ```typescript
  export * from './file-system';
  export * from './clipboard';
  ```

  - [ ] `src/shared/config/index.ts`
  ```typescript
  export * from './constants';
  ```

- [ ] **완료 기준**: 모든 폴더와 index.ts 파일이 생성되고, TypeScript 에러 없음

---

### 4. TypeScript 설정 (tsconfig.json)

- [ ] **tsconfig.json 업데이트**
  ```json
  {
    "compilerOptions": {
      "target": "ES2022",
      "lib": ["ES2023", "DOM", "DOM.Iterable"],
      "module": "ESNext",
      "skipLibCheck": true,

      /* Bundler mode */
      "moduleResolution": "bundler",
      "allowImportingTsExtensions": true,
      "resolveJsonModule": true,
      "isolatedModules": true,
      "noEmit": true,
      "jsx": "react-jsx",

      /* Linting */
      "strict": true,
      "noUnusedLocals": true,
      "noUnusedParameters": true,
      "noFallthroughCasesInSwitch": true,

      /* Path Aliases (FSD) */
      "baseUrl": ".",
      "paths": {
        "@/app/*": ["src/app/*"],
        "@/pages/*": ["src/pages/*"],
        "@/widgets/*": ["src/widgets/*"],
        "@/features/*": ["src/features/*"],
        "@/entities/*": ["src/entities/*"],
        "@/shared/*": ["src/shared/*"]
      }
    },
    "include": ["src"],
    "references": [{ "path": "./tsconfig.node.json" }]
  }
  ```

- [ ] **tsconfig.node.json 업데이트**
  ```json
  {
    "compilerOptions": {
      "composite": true,
      "skipLibCheck": true,
      "module": "ESNext",
      "moduleResolution": "bundler",
      "allowSyntheticDefaultImports": true,
      "strict": true
    },
    "include": ["vite.config.ts"]
  }
  ```

- [ ] **완료 기준**: `bun run tsc --noEmit` 실행 시 에러 없음

---

### 5. Tailwind CSS 4 + shadcn/ui 설정

- [ ] **Tailwind CSS 4 설치**
  ```bash
  bun add -D tailwindcss@next postcss autoprefixer
  bunx tailwindcss init -p
  ```

- [ ] **tailwind.config.js 설정**
  ```javascript
  /** @type {import('tailwindcss').Config} */
  export default {
    darkMode: ["class"],
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          border: "hsl(var(--border))",
          input: "hsl(var(--input))",
          ring: "hsl(var(--ring))",
          background: "hsl(var(--background))",
          foreground: "hsl(var(--foreground))",
          primary: {
            DEFAULT: "hsl(var(--primary))",
            foreground: "hsl(var(--primary-foreground))",
          },
          secondary: {
            DEFAULT: "hsl(var(--secondary))",
            foreground: "hsl(var(--secondary-foreground))",
          },
          destructive: {
            DEFAULT: "hsl(var(--destructive))",
            foreground: "hsl(var(--destructive-foreground))",
          },
          muted: {
            DEFAULT: "hsl(var(--muted))",
            foreground: "hsl(var(--muted-foreground))",
          },
          accent: {
            DEFAULT: "hsl(var(--accent))",
            foreground: "hsl(var(--accent-foreground))",
          },
          popover: {
            DEFAULT: "hsl(var(--popover))",
            foreground: "hsl(var(--popover-foreground))",
          },
          card: {
            DEFAULT: "hsl(var(--card))",
            foreground: "hsl(var(--card-foreground))",
          },
        },
        borderRadius: {
          lg: "var(--radius)",
          md: "calc(var(--radius) - 2px)",
          sm: "calc(var(--radius) - 4px)",
        },
      },
    },
    plugins: [require("tailwindcss-animate")],
  }
  ```

- [ ] **shadcn/ui 초기화**
  ```bash
  bunx shadcn@latest init
  # 옵션 선택:
  # - Style: Default
  # - Base color: Slate
  # - CSS variables: Yes
  # - React Server Components: No
  # - Path aliases: @/shared/ui
  ```

- [ ] **src/app/styles/globals.css 생성**
  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  @layer base {
    :root {
      --background: 0 0% 100%;
      --foreground: 222.2 84% 4.9%;
      --card: 0 0% 100%;
      --card-foreground: 222.2 84% 4.9%;
      --popover: 0 0% 100%;
      --popover-foreground: 222.2 84% 4.9%;
      --primary: 222.2 47.4% 11.2%;
      --primary-foreground: 210 40% 98%;
      --secondary: 210 40% 96.1%;
      --secondary-foreground: 222.2 47.4% 11.2%;
      --muted: 210 40% 96.1%;
      --muted-foreground: 215.4 16.3% 46.9%;
      --accent: 210 40% 96.1%;
      --accent-foreground: 222.2 47.4% 11.2%;
      --destructive: 0 84.2% 60.2%;
      --destructive-foreground: 210 40% 98%;
      --border: 214.3 31.8% 91.4%;
      --input: 214.3 31.8% 91.4%;
      --ring: 222.2 84% 4.9%;
      --radius: 0.5rem;
    }

    .dark {
      --background: 222.2 84% 4.9%;
      --foreground: 210 40% 98%;
      --card: 222.2 84% 4.9%;
      --card-foreground: 210 40% 98%;
      --popover: 222.2 84% 4.9%;
      --popover-foreground: 210 40% 98%;
      --primary: 210 40% 98%;
      --primary-foreground: 222.2 47.4% 11.2%;
      --secondary: 217.2 32.6% 17.5%;
      --secondary-foreground: 210 40% 98%;
      --muted: 217.2 32.6% 17.5%;
      --muted-foreground: 215 20.2% 65.1%;
      --accent: 217.2 32.6% 17.5%;
      --accent-foreground: 210 40% 98%;
      --destructive: 0 62.8% 30.6%;
      --destructive-foreground: 210 40% 98%;
      --border: 217.2 32.6% 17.5%;
      --input: 217.2 32.6% 17.5%;
      --ring: 212.7 26.8% 83.9%;
    }
  }

  @layer base {
    * {
      @apply border-border;
    }
    body {
      @apply bg-background text-foreground;
    }
  }
  ```

- [ ] **필수 shadcn/ui 컴포넌트 추가**
  ```bash
  bunx shadcn@latest add button
  bunx shadcn@latest add tabs
  bunx shadcn@latest add textarea
  bunx shadcn@latest add switch
  bunx shadcn@latest add dropdown-menu
  ```

- [ ] **tailwindcss-animate 설치**
  ```bash
  bun add -D tailwindcss-animate
  ```

- [ ] **완료 기준**: Tailwind 클래스가 정상 동작하고, shadcn/ui 컴포넌트 임포트 가능

---

### 6. ESLint + Prettier 설정

- [ ] **ESLint 설치 및 설정**
  ```bash
  bun add -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
  bun add -D eslint-plugin-react eslint-plugin-react-hooks
  bun add -D eslint-plugin-import eslint-plugin-boundaries
  ```

- [ ] **.eslintrc.cjs 생성**
  ```javascript
  module.exports = {
    root: true,
    env: { browser: true, es2022: true },
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:react/recommended',
      'plugin:react-hooks/recommended',
      'plugin:import/recommended',
      'plugin:import/typescript',
    ],
    ignorePatterns: ['dist', '.eslintrc.cjs', 'src-tauri'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true,
      },
    },
    plugins: ['react-refresh', 'boundaries'],
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
      'boundaries/elements': [
        { type: 'app', pattern: 'src/app/*' },
        { type: 'pages', pattern: 'src/pages/*' },
        { type: 'widgets', pattern: 'src/widgets/*' },
        { type: 'features', pattern: 'src/features/*' },
        { type: 'entities', pattern: 'src/entities/*' },
        { type: 'shared', pattern: 'src/shared/*' },
      ],
    },
    rules: {
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',

      // FSD 아키텍처 규칙
      'boundaries/element-types': [
        'error',
        {
          default: 'disallow',
          rules: [
            {
              from: 'app',
              allow: ['pages', 'widgets', 'features', 'entities', 'shared'],
            },
            {
              from: 'pages',
              allow: ['widgets', 'features', 'entities', 'shared'],
            },
            {
              from: 'widgets',
              allow: ['features', 'entities', 'shared'],
            },
            {
              from: 'features',
              allow: ['entities', 'shared'],
            },
            {
              from: 'entities',
              allow: ['shared'],
            },
            {
              from: 'shared',
              allow: ['shared'],
            },
          ],
        },
      ],

      // Import 순서 규칙
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling', 'index'],
          ],
          pathGroups: [
            {
              pattern: 'react',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '@/app/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@/pages/**',
              group: 'internal',
            },
            {
              pattern: '@/widgets/**',
              group: 'internal',
            },
            {
              pattern: '@/features/**',
              group: 'internal',
            },
            {
              pattern: '@/entities/**',
              group: 'internal',
            },
            {
              pattern: '@/shared/**',
              group: 'internal',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: ['react'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
    },
  };
  ```

- [ ] **Prettier 설치 및 설정**
  ```bash
  bun add -D prettier eslint-config-prettier eslint-plugin-prettier
  ```

- [ ] **.prettierrc 생성**
  ```json
  {
    "semi": true,
    "trailingComma": "es5",
    "singleQuote": true,
    "printWidth": 80,
    "tabWidth": 2,
    "useTabs": false,
    "arrowParens": "always",
    "endOfLine": "lf"
  }
  ```

- [ ] **.prettierignore 생성**
  ```
  dist
  node_modules
  pnpm-lock.yaml
  src-tauri/target
  ```

- [ ] **package.json에 스크립트 추가**
  ```json
  {
    "scripts": {
      "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
      "lint:fix": "eslint . --ext ts,tsx --fix",
      "format": "prettier --write \"src/**/*.{ts,tsx,css}\"",
      "format:check": "prettier --check \"src/**/*.{ts,tsx,css}\""
    }
  }
  ```

- [ ] **완료 기준**: `bun run lint` 및 `bun run format:check` 실행 시 에러 없음

---

### 7. Vitest + Playwright 설정

#### Vitest 설정

- [ ] **Vitest 및 관련 라이브러리 설치**
  ```bash
  bun add -D vitest @vitest/ui @vitest/coverage-v8
  bun add -D @testing-library/react @testing-library/jest-dom
  bun add -D @testing-library/user-event jsdom
  ```

- [ ] **vitest.config.ts 생성**
  ```typescript
  import { defineConfig } from 'vitest/config';
  import react from '@vitejs/plugin-react';
  import path from 'path';

  export default defineConfig({
    plugins: [react()],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/shared/lib/test/setup.ts'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        exclude: [
          'node_modules/',
          'src-tauri/',
          'src/shared/lib/test/',
          '**/*.d.ts',
          '**/*.config.*',
          '**/index.ts',
        ],
        thresholds: {
          lines: 80,
          functions: 80,
          branches: 80,
          statements: 80,
        },
      },
    },
    resolve: {
      alias: {
        '@/app': path.resolve(__dirname, './src/app'),
        '@/pages': path.resolve(__dirname, './src/pages'),
        '@/widgets': path.resolve(__dirname, './src/widgets'),
        '@/features': path.resolve(__dirname, './src/features'),
        '@/entities': path.resolve(__dirname, './src/entities'),
        '@/shared': path.resolve(__dirname, './src/shared'),
      },
    },
  });
  ```

- [ ] **src/shared/lib/test/setup.ts 생성**
  ```typescript
  import '@testing-library/jest-dom';
  import { expect, afterEach } from 'vitest';
  import { cleanup } from '@testing-library/react';
  import * as matchers from '@testing-library/jest-dom/matchers';

  expect.extend(matchers);

  afterEach(() => {
    cleanup();
  });
  ```

- [ ] **package.json에 테스트 스크립트 추가**
  ```json
  {
    "scripts": {
      "test": "vitest",
      "test:ui": "vitest --ui",
      "test:coverage": "vitest --coverage"
    }
  }
  ```

#### Playwright 설정

- [ ] **Playwright 설치**
  ```bash
  bun create playwright
  # 옵션 선택:
  # - TypeScript: Yes
  # - Test directory: e2e
  # - GitHub Actions: No
  # - Install browsers: Yes
  ```

- [ ] **playwright.config.ts 생성**
  ```typescript
  import { defineConfig, devices } from '@playwright/test';

  export default defineConfig({
    testDir: './e2e',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
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
      command: 'bun run tauri dev',
      url: 'http://localhost:1420',
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000,
    },
  });
  ```

- [ ] **e2e/example.spec.ts 생성 (샘플 테스트)**
  ```typescript
  import { test, expect } from '@playwright/test';

  test('앱이 정상적으로 시작됨', async ({ page }) => {
    await page.goto('/');

    // 앱 타이틀 확인
    await expect(page).toHaveTitle(/SVG2TSX/);
  });
  ```

- [ ] **package.json에 E2E 스크립트 추가**
  ```json
  {
    "scripts": {
      "test:e2e": "playwright test",
      "test:e2e:ui": "playwright test --ui"
    }
  }
  ```

- [ ] **완료 기준**:
  - `bun run test` 실행 성공 (테스트 없어도 에러 없음)
  - `bun run test:e2e` 실행 성공 (샘플 테스트 통과)

---

### 8. 기본 App.tsx 및 providers 구조

- [x] **src/app/providers/ThemeProvider.tsx 생성**
  ```typescript
  import React, { createContext, useContext, useEffect, useState } from 'react';

  type Theme = 'dark' | 'light' | 'system';

  interface ThemeProviderProps {
    children: React.ReactNode;
    defaultTheme?: Theme;
    storageKey?: string;
  }

  interface ThemeProviderState {
    theme: Theme;
    setTheme: (theme: Theme) => void;
  }

  const initialState: ThemeProviderState = {
    theme: 'system',
    setTheme: () => null,
  };

  const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

  export function ThemeProvider({
    children,
    defaultTheme = 'dark',
    storageKey = 'svg2tsx-theme',
    ...props
  }: ThemeProviderProps) {
    const [theme, setTheme] = useState<Theme>(
      () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
    );

    useEffect(() => {
      const root = window.document.documentElement;

      root.classList.remove('light', 'dark');

      if (theme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
          .matches
          ? 'dark'
          : 'light';

        root.classList.add(systemTheme);
        return;
      }

      root.classList.add(theme);
    }, [theme]);

    const value = {
      theme,
      setTheme: (theme: Theme) => {
        localStorage.setItem(storageKey, theme);
        setTheme(theme);
      },
    };

    return (
      <ThemeProviderContext.Provider {...props} value={value}>
        {children}
      </ThemeProviderContext.Provider>
    );
  }

  export const useTheme = () => {
    const context = useContext(ThemeProviderContext);

    if (context === undefined)
      throw new Error('useTheme must be used within a ThemeProvider');

    return context;
  };
  ```

- [x] **src/app/App.tsx 생성**
  ```typescript
  import { ThemeProvider } from '@/app/providers';
  import '@/app/styles/globals.css';

  function App() {
    return (
      <ThemeProvider defaultTheme="dark">
        <div className="h-screen w-screen bg-background text-foreground">
          <div className="flex h-full items-center justify-center">
            <h1 className="text-4xl font-bold">SVG2TSX</h1>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  export default App;
  ```

- [ ] **src/main.tsx 업데이트**
  ```typescript
  import React from 'react';
  import ReactDOM from 'react-dom/client';
  import App from '@/app/App';

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  ```

- [ ] **vite.config.ts 업데이트 (path alias 추가)**
  ```typescript
  import { defineConfig } from 'vite';
  import react from '@vitejs/plugin-react';
  import path from 'path';

  // https://vitejs.dev/config/
  export default defineConfig({
    plugins: [react()],

    // Tauri expects a fixed port, fail if that port is not available
    server: {
      port: 1420,
      strictPort: true,
      watch: {
        // 3. tell vite to ignore watching `src-tauri`
        ignored: ['**/src-tauri/**'],
      },
    },

    resolve: {
      alias: {
        '@/app': path.resolve(__dirname, './src/app'),
        '@/pages': path.resolve(__dirname, './src/pages'),
        '@/widgets': path.resolve(__dirname, './src/widgets'),
        '@/features': path.resolve(__dirname, './src/features'),
        '@/entities': path.resolve(__dirname, './src/entities'),
        '@/shared': path.resolve(__dirname, './src/shared'),
      },
    },
  });
  ```

- [ ] **index.html 업데이트**
  ```html
  <!doctype html>
  <html lang="ko">
    <head>
      <meta charset="UTF-8" />
      <link rel="icon" type="image/svg+xml" href="/vite.svg" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>SVG2TSX</title>
    </head>
    <body>
      <div id="root"></div>
      <script type="module" src="/src/main.tsx"></script>
    </body>
  </html>
  ```

- [ ] **완료 기준**: `bun run tauri dev` 실행 시 "SVG2TSX" 텍스트가 중앙에 표시되고 다크 테마 적용됨

---

### 9. Tauri 기본 설정

- [x] **src-tauri/tauri.conf.json 업데이트**
  ```json
  {
    "$schema": "https://tauri.app/schema/tauri.conf.json",
    "productName": "SVG2TSX",
    "version": "0.1.0",
    "identifier": "com.svg2tsx.app",
    "build": {
      "beforeDevCommand": "bun run dev",
      "beforeBuildCommand": "bun run build",
      "devUrl": "http://localhost:1420",
      "frontendDist": "../dist"
    },
    "bundle": {
      "active": true,
      "targets": "all",
      "icon": [
        "icons/32x32.png",
        "icons/128x128.png",
        "icons/128x128@2x.png",
        "icons/icon.icns",
        "icons/icon.ico"
      ]
    },
    "app": {
      "windows": [
        {
          "title": "SVG2TSX",
          "titleBarStyle": "Overlay",
          "width": 1200,
          "height": 800,
          "minWidth": 800,
          "minHeight": 600,
          "resizable": true,
          "fullscreen": false
        }
      ],
      "security": {
        "csp": null
      }
    }
  }
  ```
  **참고**: `titleBarStyle: "Overlay"`로 Custom title bar 적용됨

- [ ] **Tauri 플러그인 설치 (준비)**
  ```bash
  # Task 04에서 사용될 플러그인 미리 설치
  bun add @tauri-apps/plugin-dialog
  bun add @tauri-apps/plugin-fs
  bun add @tauri-apps/plugin-clipboard-manager
  ```

- [ ] **완료 기준**: Tauri 윈도우가 설정된 크기로 열리고 타이틀이 "SVG2TSX"로 표시됨

---

### 10. 기타 설정 파일

- [ ] **.gitignore 업데이트**
  ```
  # Logs
  logs
  *.log
  npm-debug.log*
  yarn-debug.log*
  yarn-error.log*
  pnpm-debug.log*
  lerna-debug.log*

  # Dependencies
  node_modules
  dist
  dist-ssr
  *.local

  # Editor
  .vscode/*
  !.vscode/extensions.json
  .idea
  .DS_Store
  *.suo
  *.ntvs*
  *.njsproj
  *.sln
  *.sw?

  # Tauri
  src-tauri/target

  # Test coverage
  coverage
  .nyc_output

  # Playwright
  /test-results/
  /playwright-report/
  /playwright/.cache/
  ```

- [ ] **.vscode/extensions.json 생성 (권장 확장)**
  ```json
  {
    "recommendations": [
      "dbaeumer.vscode-eslint",
      "esbenp.prettier-vscode",
      "bradlc.vscode-tailwindcss",
      "tauri-apps.tauri-vscode",
      "vitest.explorer"
    ]
  }
  ```

- [ ] **.vscode/settings.json 생성**
  ```json
  {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": true
    },
    "tailwindCSS.experimental.classRegex": [
      ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
      ["cn\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
    ]
  }
  ```

- [ ] **README.md 업데이트**
  ```markdown
  # SVG2TSX

  SVG를 React TSX 컴포넌트로 변환하는 데스크톱 애플리케이션

  ## 기술 스택

  - **Frontend**: React 19, TypeScript 5.x, Vite 7, Tailwind CSS 4, shadcn/ui
  - **Desktop**: Tauri v2
  - **패키지 매니저**: bun
  - **테스트**: Vitest, Playwright
  - **아키텍처**: Feature-Sliced Design (FSD)

  ## 시작하기

  ### 필수 조건

  - Node.js >= 20.x
  - pnpm >= 9.x
  - Rust (Tauri 빌드용)

  ### 설치

  ```bash
  pnpm install
  ```

  ### 개발 서버 실행

  ```bash
  bun run tauri dev
  ```

  ### 빌드

  ```bash
  bun run tauri build
  ```

  ### 테스트

  ```bash
  # 유닛 테스트
  bun run test

  # 테스트 커버리지
  bun run test:coverage

  # E2E 테스트
  bun run test:e2e
  ```

  ### 린팅 및 포맷팅

  ```bash
  # ESLint 검사
  bun run lint

  # ESLint 자동 수정
  bun run lint:fix

  # Prettier 포맷팅
  bun run format

  # Prettier 검사
  bun run format:check
  ```

  ## 프로젝트 구조

  ```
  src/
  ├── app/           # 앱 초기화
  ├── pages/         # 페이지
  ├── widgets/       # 조합된 UI 블록
  ├── features/      # 사용자 기능
  ├── entities/      # 비즈니스 엔티티
  └── shared/        # 공유 코드
  ```

  ## 라이선스

  MIT
  ```

- [ ] **완료 기준**: 모든 설정 파일이 생성되고 프로젝트 문서 업데이트 완료

---

## 🎯 최종 검증

모든 체크리스트 완료 후 다음 명령어들이 모두 성공해야 합니다:

- [ ] **프로젝트 실행**
  ```bash
  bun run tauri dev
  ```
  **기대 결과**: Tauri 윈도우 열림, "SVG2TSX" 텍스트 중앙 표시, 다크 테마 적용

- [ ] **TypeScript 컴파일**
  ```bash
  bun run tsc --noEmit
  ```
  **기대 결과**: 에러 없음

- [ ] **ESLint 검사**
  ```bash
  bun run lint
  ```
  **기대 결과**: 에러 없음

- [ ] **Prettier 검사**
  ```bash
  bun run format:check
  ```
  **기대 결과**: 포맷 위반 없음

- [ ] **유닛 테스트**
  ```bash
  bun run test
  ```
  **기대 결과**: 테스트 실행 성공 (0개 테스트여도 OK)

- [ ] **E2E 테스트**
  ```bash
  bun run test:e2e
  ```
  **기대 결과**: 샘플 테스트 통과

- [ ] **빌드**
  ```bash
  bun run tauri build
  ```
  **기대 결과**: 빌드 성공, dist/ 폴더에 실행 파일 생성

---

## 📝 완료 기준 총정리

1. **환경 설정**
   - Tauri v2 + React 19 + Vite 7 프로젝트 생성 완료
   - pnpm 패키지 매니저 설정 완료
   - 모든 의존성 설치 완료

2. **아키텍처**
   - FSD 6개 레이어 폴더 구조 생성
   - 각 슬라이스별 index.ts Public API 생성
   - TypeScript path alias 설정 완료

3. **개발 도구**
   - ESLint + Prettier 설정 완료
   - FSD 아키텍처 규칙 (eslint-plugin-boundaries) 적용
   - Vitest + Playwright 테스트 환경 구축

4. **UI 프레임워크**
   - Tailwind CSS 4 설정 완료
   - shadcn/ui 초기화 및 필수 컴포넌트 설치
   - 다크/라이트 테마 Provider 구현

5. **실행 검증**
   - `bun run tauri dev` 정상 실행
   - TypeScript 컴파일 에러 없음
   - 린팅 및 포맷팅 통과
   - 테스트 환경 정상 동작

---

## 🚀 다음 단계

Task 01 완료 후:
- **Task 02**: SVG/TSX 변환 핵심 로직 (TDD 개발)
- **Task 03**: 기본 UI 및 레이아웃 구현

---

**작성일**: 2025-12-25
**버전**: 1.0.0
**담당자**: 주니어 문서 작성자
