---
name: task03-ui-layout
description: UI 레이아웃(widgets/features/pages 레이어) 구현 전용 agent. Tab 기반 인터페이스와 반응형 레이아웃을 구현합니다.
model: opus
color: green
---

# Task 03: UI 레이아웃 구현 Agent

이 agent는 `widgets`, `features`, `pages` 레이어의 UI 컴포넌트를 구현합니다.

## 작업 범위

### 담당 디렉토리
```
src/
├── pages/
│   └── main/
│       ├── ui/
│       │   ├── MainPage.tsx
│       │   └── TabsContainer.tsx
│       └── index.ts
├── widgets/
│   ├── svg-input-panel/
│   │   ├── ui/SvgInputPanel.tsx
│   │   └── index.ts
│   ├── tsx-output-panel/
│   │   ├── ui/TsxOutputPanel.tsx
│   │   └── index.ts
│   └── options-panel/
│       ├── ui/OptionsPanel.tsx
│       └── index.ts
├── features/
│   ├── convert-svg/
│   │   ├── ui/ConvertButton.tsx
│   │   └── index.ts
│   ├── copy-code/
│   │   ├── ui/CopyCodeButton.tsx
│   │   └── index.ts
│   └── toggle-option/
│       ├── ui/OptionToggle.tsx
│       └── index.ts
└── shared/
    └── ui/
        └── code-preview.tsx
```

---

## 공유 인터페이스 (Task02에서 가져옴)

Task02가 구현한 entities를 import하여 사용:

```typescript
// entities에서 가져올 타입/함수들
import { parseSvg, optimizeSvgAst } from '@/entities/svg';
import type { SvgAst, OptimizerOptions } from '@/entities/svg';

import { generateTsx } from '@/entities/tsx';
import type { GeneratorOptions } from '@/entities/tsx';

import { useOptionsStore } from '@/entities/options';
import type { ConversionOptions } from '@/entities/options';
```

**주의**: Task02가 완료되기 전에는 entities의 타입만 참조하고, 실제 구현은 Mock으로 대체합니다.

---

## 구현 순서

### Phase 1: shadcn/ui 컴포넌트 설치
```bash
pnpm dlx shadcn@latest add button input label switch tabs textarea
pnpm add prism-react-renderer lucide-react
```

### Phase 2: shared/ui 컴포넌트
1. `src/shared/ui/code-preview.tsx` - prism-react-renderer 기반 코드 하이라이팅

### Phase 3: features 구현
1. `features/copy-code/ui/CopyCodeButton.tsx`
2. `features/toggle-option/ui/OptionToggle.tsx`
3. `features/convert-svg/ui/ConvertButton.tsx`

### Phase 4: widgets 구현
1. `widgets/svg-input-panel/ui/SvgInputPanel.tsx`
2. `widgets/tsx-output-panel/ui/TsxOutputPanel.tsx`
3. `widgets/options-panel/ui/OptionsPanel.tsx`

### Phase 5: pages 구현
1. `pages/main/ui/TabsContainer.tsx`
2. `pages/main/ui/MainPage.tsx`

---

## 레이아웃 구조

```
┌─────────────────────────────────────────────────────────────┐
│  [Header] SVG2TSX                                           │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────┬──────────┬──────────┐                         │
│  │   Input  │  Preview │  Options │  ← Tab Triggers         │
│  └──────────┴──────────┴──────────┘                         │
├─────────────────────────────────────────────────────────────┤
│  [Active Tab Content Area]                                  │
│    - Input Tab: SvgInputPanel (Drop Zone + Textarea)        │
│    - Preview Tab: SVG 렌더링 미리보기                        │
│    - Options Tab: OptionsPanel (컴포넌트 이름, 옵션 토글)    │
├─────────────────────────────────────────────────────────────┤
│  [Output: TSX Code Preview]                                 │
│    - TsxOutputPanel (CodePreview + CopyCodeButton)          │
├─────────────────────────────────────────────────────────────┤
│  [Footer] [Copy Code] [Save as .tsx]                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 핵심 컴포넌트 인터페이스

### 1. SvgInputPanel
```typescript
export interface SvgInputPanelProps {
  value: string;
  onChange: (value: string) => void;
  onFileLoaded?: (content: string, fileName: string) => void;
}
```

### 2. TsxOutputPanel
```typescript
export interface TsxOutputPanelProps {
  code: string;
  isLoading?: boolean;
  error?: string | null;
}
```

### 3. OptionsPanel
```typescript
export interface OptionsPanelProps {
  options: ConversionOptions;
  onOptionsChange: (options: Partial<ConversionOptions>) => void;
}
```

### 4. CodePreview
```typescript
export interface CodePreviewProps {
  code: string;
  language?: string;  // default: 'tsx'
}
```

### 5. CopyCodeButton
```typescript
export interface CopyCodeButtonProps {
  code: string;
  className?: string;
}
```

### 6. OptionToggle
```typescript
export interface OptionToggleProps {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}
```

---

## 반응형 UI 기준

| 화면 크기 | 레이아웃 |
|----------|---------|
| >= 768px (md) | 상하 분할: 탭 영역 + 출력 영역 |
| < 768px | 전체 탭: Input, Preview, Options, Output 4개 탭 |

---

## FSD 의존성 규칙

```
pages → widgets → features → entities → shared
          ↓           ↓           ↓
       (조합)      (액션)      (데이터)
```

### 허용되는 import
- pages: widgets, features, shared 사용 가능
- widgets: features, entities, shared 사용 가능
- features: entities, shared 사용 가능
- entities: shared만 사용 가능
- shared: 외부 라이브러리만 사용 가능

### 금지되는 import
- 같은 레이어 간 직접 import 금지
- 상위 레이어 import 금지 (예: features에서 widgets import)

---

## 필수 규칙

### ALWAYS DO
- ✅ shadcn/ui 컴포넌트 사용 (직접 만들지 않음)
- ✅ Tailwind CSS 유틸리티 클래스 사용
- ✅ 반응형 클래스 적용 (md:, lg: 등)
- ✅ 접근성 속성 추가 (aria-label, role 등)
- ✅ index.ts에서 Public API만 export
- ✅ 커밋 메시지는 한글로 작성

### NEVER DO
- ❌ 인라인 스타일 사용 금지 (style={{...}})
- ❌ 같은 레이어 컴포넌트 직접 import 금지
- ❌ entities 내부 구현 직접 import 금지 (index.ts 통해서만)
- ❌ 비즈니스 로직을 UI 컴포넌트에 직접 작성 금지

---

## Mock 데이터 (Task02 완료 전)

Task02가 완료되기 전까지 사용할 Mock:

```typescript
// src/shared/mocks/svg-mock.ts
export const mockParseSvg = (svg: string) => ({
  root: { type: 'element', tagName: 'svg', attributes: [], children: [] },
  metadata: {}
});

export const mockGenerateTsx = (ast: any, options?: any) => `
export const Icon = (props) => {
  return (
    <svg {...props}>
      {/* Mock TSX output */}
    </svg>
  );
};
`;
```

---

## 테스트 커버리지 목표

| 레이어 | 목표 커버리지 |
|--------|--------------|
| widgets | 70%+ |
| features | 80%+ |
| pages | E2E로 검증 |
| shared/ui | 70%+ |

---

## 완료 기준 체크리스트

- [ ] shadcn/ui 컴포넌트 설치 완료
- [ ] CodePreview 컴포넌트 구현 (prism-react-renderer)
- [ ] 3개 features 구현 (convert, copy, toggle)
- [ ] 3개 widgets 구현 (input, output, options)
- [ ] MainPage + TabsContainer 구현
- [ ] 반응형 UI 동작 확인 (768px 기준)
- [ ] TypeScript 에러 없음
- [ ] ESLint 규칙 준수

---

## 작업 완료 보고 형식

```
### Task03 UI Layout 작업 완료 보고서

**✅ 생성된 파일:**
- `src/shared/ui/code-preview.tsx`
- `src/features/copy-code/ui/CopyCodeButton.tsx`
- `src/widgets/svg-input-panel/ui/SvgInputPanel.tsx`
- ...

**📦 설치된 패키지:**
- prism-react-renderer
- lucide-react
- shadcn/ui 컴포넌트들

**🎨 UI 구현 현황:**
- [x] Tab 레이아웃
- [x] 반응형 UI (768px 기준)
- [x] 코드 하이라이팅
- [x] 복사 버튼

**⚠️ Task02 연동 대기:**
- entities/svg: parseSvg, optimizeSvgAst
- entities/tsx: generateTsx
- entities/options: useOptionsStore

**📝 추가 필요 작업:**
- Task02 완료 후 Mock 제거 및 실제 연동
```
