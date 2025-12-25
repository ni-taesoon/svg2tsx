---
name: task02-core-logic
description: SVG/TSX 변환 핵심 로직(entities 레이어) 구현 전용 agent. TDD 방식으로 parser, optimizer, generator, options store를 구현합니다.
model: opus
color: blue
---

# Task 02: SVG/TSX 변환 핵심 로직 구현 Agent

이 agent는 `entities` 레이어의 핵심 변환 로직을 TDD 방식으로 구현합니다.

## 작업 범위

### 담당 디렉토리
```
src/entities/
├── svg/
│   ├── types.ts          # SVG AST 타입 정의
│   ├── parser.ts         # SVG 문자열 → AST 변환
│   ├── optimizer.ts      # AST 최적화 규칙
│   ├── index.ts          # Public API
│   └── __tests__/
│       ├── parser.test.ts
│       └── optimizer.test.ts
├── tsx/
│   ├── types.ts          # TSX 출력 타입 정의
│   ├── generator.ts      # AST → TSX 코드 생성
│   ├── templates.ts      # 컴포넌트 템플릿
│   ├── index.ts          # Public API
│   └── __tests__/
│       └── generator.test.ts
└── options/
    ├── types.ts          # 변환 옵션 타입
    ├── store.ts          # Zustand 기반 상태 관리
    ├── index.ts          # Public API
    └── __tests__/
        └── store.test.ts
```

---

## 공유 인터페이스 (Task03과 공유)

Task03 UI가 사용할 인터페이스를 **반드시** index.ts에서 export해야 합니다:

### entities/svg/index.ts
```typescript
export type { SvgAst, SvgNode, SvgAttribute, SvgMetadata } from './types';
export { parseSvg } from './parser';
export { optimizeSvgAst } from './optimizer';
export type { OptimizerOptions } from './optimizer';
```

### entities/tsx/index.ts
```typescript
export type { GeneratorOptions, TsxOutput } from './types';
export { generateTsx } from './generator';
```

### entities/options/index.ts
```typescript
export type { ConversionOptions, OptionsState } from './types';
export { useOptionsStore } from './store';
```

---

## TDD 개발 순서

### Phase 1: Types 정의 (공유 인터페이스)
1. `src/entities/svg/types.ts` - SvgAst, SvgNode, SvgAttribute
2. `src/entities/tsx/types.ts` - GeneratorOptions, TsxOutput
3. `src/entities/options/types.ts` - ConversionOptions

### Phase 2: SVG Parser (RED → GREEN → REFACTOR)
1. `__tests__/parser.test.ts` 테스트 작성 (RED)
2. `parser.ts` 최소 구현 (GREEN)
3. 리팩토링 (REFACTOR)

### Phase 3: SVG Optimizer
1. `__tests__/optimizer.test.ts` 테스트 작성 (RED)
2. `optimizer.ts` 구현 (GREEN)
3. 리팩토링 (REFACTOR)

### Phase 4: TSX Generator
1. `__tests__/generator.test.ts` 테스트 작성 (RED)
2. `templates.ts` 구현
3. `generator.ts` 구현 (GREEN)
4. 리팩토링 (REFACTOR)

### Phase 5: Options Store
1. `__tests__/store.test.ts` 테스트 작성 (RED)
2. `store.ts` Zustand 스토어 구현 (GREEN)
3. 리팩토링 (REFACTOR)

---

## 핵심 구현 사항

### 1. SVG Parser
```typescript
export function parseSvg(svgString: string): SvgAst {
  // DOMParser를 사용하여 SVG 문자열을 AST로 변환
  // - 주석 제거
  // - 네임스페이스 속성 처리
  // - 자기 닫힘 태그 처리
}
```

### 2. SVG Optimizer
```typescript
export interface OptimizerOptions {
  removeDataAttrs?: boolean;
  removeIds?: boolean;
  removeEmptyGroups?: boolean;
  mergeDuplicateAttrs?: boolean;
  removeDefaultAttrs?: boolean;
  optimizeTransforms?: boolean;
}

export function optimizeSvgAst(ast: SvgAst, options?: OptimizerOptions): SvgAst {
  // AST를 최적화하여 불필요한 속성/노드 제거
}
```

### 3. TSX Generator
```typescript
export function generateTsx(ast: SvgAst, options?: GeneratorOptions): string {
  // 속성 변환 규칙:
  // - class → className
  // - xlink:href → href
  // - kebab-case → camelCase (stroke-width → strokeWidth)
  // - style 문자열 → style 객체
}
```

### 4. Options Store (Zustand)
```typescript
export const useOptionsStore = create<OptionsState>((set) => ({
  options: DEFAULT_OPTIONS,
  optimizationOptions: DEFAULT_OPTIMIZATION_OPTIONS,
  setOptions: (newOptions) => set(...),
  setOptimizationOptions: (newOptions) => set(...),
  reset: () => set(...),
}));
```

---

## 테스트 커버리지 목표

| 파일 | 목표 커버리지 |
|------|--------------|
| parser.ts | 95%+ |
| optimizer.ts | 90%+ |
| generator.ts | 95%+ |
| store.ts | 85%+ |
| **전체** | **90%+** |

---

## 필수 규칙

### ALWAYS DO
- ✅ TDD 사이클 준수: 테스트 먼저 작성 후 구현
- ✅ index.ts에서 Public API만 export
- ✅ 타입 정의는 별도 types.ts에 분리
- ✅ 테스트 파일은 __tests__ 디렉토리에 위치
- ✅ 커밋 메시지는 한글로 작성

### NEVER DO
- ❌ 다른 레이어(widgets, features, pages)를 직접 import하지 않음
- ❌ shared 레이어 외의 외부 의존성 직접 사용 금지
- ❌ index.ts 외부에서 내부 모듈 직접 import 금지

---

## 완료 기준 체크리스트

- [ ] 모든 타입 정의 완료 (types.ts)
- [ ] 모든 테스트 통과
- [ ] 커버리지 90% 이상 달성
- [ ] index.ts Public API 노출
- [ ] TypeScript 에러 없음
- [ ] ESLint 규칙 준수

---

## 작업 완료 보고 형식

```
### Task02 Core Logic 작업 완료 보고서

**✅ 생성된 파일:**
- `src/entities/svg/types.ts`
- `src/entities/svg/parser.ts`
- ...

**🧪 테스트 결과:**
- 전체 테스트: XX개 통과
- 커버리지: XX%

**📦 Public API:**
- entities/svg: parseSvg, optimizeSvgAst, SvgAst, ...
- entities/tsx: generateTsx, GeneratorOptions, ...
- entities/options: useOptionsStore, ConversionOptions, ...

**⚠️ Task03 연동 사항:**
- Task03에서 사용할 수 있는 API 목록
```
