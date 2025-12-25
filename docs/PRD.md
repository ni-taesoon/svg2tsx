# SVG2TSX PRD (Product Requirements Document)

## 1. 개요

### 1.1 제품명
**SVG2TSX** - SVG를 React TSX 컴포넌트로 변환하는 데스크톱 애플리케이션

### 1.2 목적
디자이너나 개발자가 SVG 파일을 드래그 앤 드롭하거나 직접 입력하여 최적화된 React TSX 컴포넌트로 빠르게 변환할 수 있는 도구

---

## 2. 기술 스택

### 2.1 Frontend
| 기술 | 버전 | 용도 |
|------|------|------|
| React | 19 | UI 프레임워크 |
| TypeScript | 5.x | 타입 시스템 |
| Vite | 7 | 빌드 도구 |
| Tailwind CSS | 4 | 스타일링 |
| shadcn/ui | latest | UI 컴포넌트 라이브러리 |

### 2.2 Desktop Runtime
| 기술 | 버전 | 용도 |
|------|------|------|
| Tauri | v2 | 데스크톱 런타임 |
| Rust | stable | 네이티브 기능 |

### 2.3 개발 도구
| 기술 | 용도 |
|------|------|
| pnpm | 패키지 매니저 |
| Vitest | 유닛 테스트 |
| Playwright | E2E 테스트 |
| ESLint | 린팅 |
| Prettier | 코드 포맷팅 |

### 2.4 핵심 라이브러리
| 라이브러리 | 용도 |
|------------|------|
| prism-react-renderer | 코드 구문 하이라이팅 |
| @tauri-apps/plugin-dialog | 파일 다이얼로그 |
| @tauri-apps/plugin-fs | 파일 시스템 접근 |
| @tauri-apps/plugin-clipboard-manager | 클립보드 기능 |

---

## 3. 아키텍처

### 3.1 FSD (Feature-Sliced Design) 구조

```
src/
├── app/                      # Layer 1: 앱 초기화
│   ├── App.tsx
│   ├── providers/
│   │   ├── ThemeProvider.tsx
│   │   └── index.ts
│   └── styles/
│       └── globals.css
│
├── pages/                    # Layer 2: 페이지 (단일 페이지 앱)
│   └── main/
│       ├── ui/
│       │   └── MainPage.tsx
│       └── index.ts
│
├── widgets/                  # Layer 3: 조합된 UI 블록
│   ├── svg-input-panel/
│   │   ├── ui/
│   │   └── index.ts
│   ├── tsx-output-panel/
│   │   ├── ui/
│   │   └── index.ts
│   └── options-panel/
│       ├── ui/
│       └── index.ts
│
├── features/                 # Layer 4: 사용자 기능
│   ├── convert-svg/
│   │   ├── model/
│   │   ├── ui/
│   │   └── index.ts
│   ├── copy-code/
│   │   ├── ui/
│   │   └── index.ts
│   ├── save-file/
│   │   ├── ui/
│   │   └── index.ts
│   └── toggle-option/
│       ├── model/
│       ├── ui/
│       └── index.ts
│
├── entities/                 # Layer 5: 비즈니스 엔티티
│   ├── svg/
│   │   ├── model/
│   │   │   ├── parser.ts
│   │   │   ├── optimizer.ts
│   │   │   ├── types.ts
│   │   │   └── __tests__/
│   │   └── index.ts
│   ├── tsx/
│   │   ├── model/
│   │   │   ├── generator.ts
│   │   │   ├── templates.ts
│   │   │   ├── types.ts
│   │   │   └── __tests__/
│   │   └── index.ts
│   └── options/
│       ├── model/
│       │   ├── store.ts
│       │   └── types.ts
│       └── index.ts
│
└── shared/                   # Layer 6: 공유 코드
    ├── ui/                   # shadcn/ui 컴포넌트
    │   ├── button.tsx
    │   ├── tabs.tsx
    │   └── ...
    ├── lib/
    │   └── utils.ts
    ├── api/                  # Tauri 명령어 래퍼
    │   ├── file-system.ts
    │   └── clipboard.ts
    └── config/
        └── constants.ts
```

### 3.2 의존성 규칙

```
app → pages → widgets → features → entities → shared
                ↓
        (단방향 의존성만 허용)
```

- **상위 레이어**는 **하위 레이어**만 import 가능
- 같은 레이어 내 슬라이스 간 직접 import 금지
- 각 슬라이스는 `index.ts`로 Public API 노출

### 3.3 데이터 흐름

```
┌─────────────────────────────────────────────────────────────┐
│                        User Input                           │
│                    (Drop/Paste/Select)                      │
└─────────────────────────┬───────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  entities/svg/parser                                        │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │  Raw SVG    │ →  │   Parse     │ →  │  SVG AST    │     │
│  │  String     │    │             │    │             │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
└─────────────────────────┬───────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  entities/svg/optimizer                                     │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │  SVG AST    │ →  │  Optimize   │ →  │ Optimized   │     │
│  │             │    │  (Rules)    │    │    AST      │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
└─────────────────────────┬───────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  entities/tsx/generator                                     │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │ Optimized   │ →  │  Generate   │ →  │    TSX      │     │
│  │    AST      │    │  (Template) │    │   Code      │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
└─────────────────────────┬───────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                      Output Display                         │
│                  (Syntax Highlighted)                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. TDD 개발 가이드

### 4.1 Red-Green-Refactor 사이클

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│   🔴 RED ────────► 🟢 GREEN ────────► 🔵 REFACTOR       │
│     │                  │                    │            │
│     │                  │                    │            │
│   실패하는           테스트 통과하는      코드 개선        │
│   테스트 작성         최소 코드 작성       (중복 제거)      │
│     │                  │                    │            │
│     └──────────────────┴────────────────────┘            │
│                        │                                  │
│                        ▼                                  │
│                   다음 기능으로                            │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 4.2 테스트 예시

```typescript
// 🔴 RED: entities/svg/model/__tests__/parser.test.ts
describe('SvgParser', () => {
  describe('attribute transformation', () => {
    it('should convert class to className', () => {
      const input = '<svg class="icon"></svg>';
      const result = parseSvg(input);
      expect(result.props.className).toBe('icon');
    });

    it('should convert kebab-case to camelCase', () => {
      const input = '<svg stroke-width="2"></svg>';
      const result = parseSvg(input);
      expect(result.props.strokeWidth).toBe('2');
    });
  });
});

// 🟢 GREEN: 테스트 통과하는 최소 구현
export function parseSvg(svg: string): SvgNode {
  // 최소 구현
}

// 🔵 REFACTOR: 코드 개선
export function parseSvg(svg: string): SvgNode {
  const ast = parseToAst(svg);
  return transformNode(ast);
}
```

### 4.3 테스트 피라미드

```
           ╱╲
          ╱  ╲
         ╱ E2E╲           Playwright (최소, 핵심 플로우만)
        ╱──────╲
       ╱        ╲
      ╱Integration╲       React Testing Library
     ╱──────────────╲     (widgets, features 테스트)
    ╱                ╲
   ╱   Unit Tests     ╲   Vitest
  ╱────────────────────╲  (entities 순수 로직)
```

### 4.4 테스트 커버리지 목표

| Layer | 목표 | 테스트 도구 |
|-------|------|-------------|
| entities/ | 90%+ | Vitest |
| features/ | 80%+ | Vitest + RTL |
| widgets/ | 70%+ | RTL |
| pages/ | E2E | Playwright |

---

## 5. 핵심 기능

### 5.1 SVG 입력 방식

| 기능 | 설명 | 우선순위 |
|------|------|----------|
| 드래그 앤 드롭 | SVG 파일을 앱 영역에 드래그하여 입력 | P0 |
| 파일 선택 | 파일 탐색기를 통한 SVG 파일 선택 | P0 |
| 텍스트 입력 | SVG 코드 직접 붙여넣기 | P0 |
| 클립보드 | 클립보드에서 SVG 코드 자동 감지 | P1 |

### 5.2 SVG 최적화 옵션

| 옵션 | 설명 | 기본값 |
|------|------|--------|
| 불필요한 속성 제거 | `xmlns`, `version` 등 React에서 불필요한 속성 제거 | ON |
| ID/Class 정리 | 중복 또는 불필요한 id, class 제거 | ON |
| 주석 제거 | SVG 내 주석 제거 | ON |
| 빈 그룹 제거 | 자식이 없는 `<g>` 태그 제거 | ON |
| viewBox 유지 | viewBox 속성 보존 | ON |
| currentColor 변환 | fill/stroke 색상을 currentColor로 변환 | OFF |

### 5.3 TSX 변환 옵션

| 옵션 | 설명 | 기본값 |
|------|------|--------|
| 컴포넌트 타입 | Functional Component (React.FC) | FC |
| Props 타입 | SVGProps<SVGSVGElement> 상속 | ON |
| 기본 export | export default vs named export | default |
| 파일명 | PascalCase 컴포넌트명 자동 생성 | 자동 |
| memo 래핑 | React.memo로 감싸기 | OFF |
| forwardRef | ref 전달 지원 | OFF |

### 5.4 출력 기능

| 기능 | 설명 | 우선순위 |
|------|------|----------|
| 코드 미리보기 | 변환된 TSX 코드 실시간 미리보기 | P0 |
| SVG 미리보기 | 원본 SVG 렌더링 미리보기 | P0 |
| 클립보드 복사 | 변환된 코드 원클릭 복사 | P0 |
| 파일 다운로드 | .tsx 파일로 저장 | P0 |
| 배치 처리 | 여러 SVG 일괄 변환 | P2 |

---

## 6. UI/UX 요구사항

### 6.1 Tab-based 레이아웃

```
┌─────────────────────────────────────────────────────────────┐
│  [≡] SVG2TSX                              [─] [□] [×]       │
│  (드래그 가능 영역 - Custom Title Bar)                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────┬──────────┬──────────┐                         │
│  │ 📥 Input  │ 👁 Preview │ ⚙ Options │                       │
│  └──────────┴──────────┴──────────┘                         │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────┐  │
│  │                                                       │  │
│  │  [Active Tab Content]                                 │  │
│  │                                                       │  │
│  │  📥 Input Tab:                                        │  │
│  │     ┌─────────────────────────────────────────────┐   │  │
│  │     │  Drop SVG file here                         │   │  │
│  │     │       or                                    │   │  │
│  │     │  [Select File]                              │   │  │
│  │     └─────────────────────────────────────────────┘   │  │
│  │     ┌─────────────────────────────────────────────┐   │  │
│  │     │  <svg xmlns="...">                          │   │  │
│  │     │    ...paste SVG code here                   │   │  │
│  │     └─────────────────────────────────────────────┘   │  │
│  │                                                       │  │
│  │  👁 Preview Tab:                                      │  │
│  │     [Rendered SVG Preview]                            │  │
│  │                                                       │  │
│  │  ⚙ Options Tab:                                       │  │
│  │     [✓] 불필요한 속성 제거                              │  │
│  │     [✓] ID/Class 정리                                 │  │
│  │     [ ] currentColor 변환                             │  │
│  │     ...                                               │  │
│  │                                                       │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  📤 Output                                                   │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  import { SVGProps } from 'react';                    │  │
│  │                                                       │  │
│  │  interface IconProps extends SVGProps<SVGSVGElement> {│  │
│  │    size?: number;                                     │  │
│  │  }                                                    │  │
│  │                                                       │  │
│  │  const Icon = ({ size = 24, ...props }: IconProps) => │  │
│  │    <svg width={size} height={size} {...props}>        │  │
│  │      ...                                              │  │
│  │    </svg>                                             │  │
│  │  );                                                   │  │
│  │                                                       │  │
│  │  export default Icon;                                 │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  [📋 Copy Code]                        [💾 Save as .tsx]    │
└─────────────────────────────────────────────────────────────┘
```

### 6.2 반응형 동작

| 화면 크기 | 레이아웃 |
|-----------|----------|
| >= 768px | 상하 분할 (탭 영역 위, 출력 아래) |
| < 768px | 전체 탭 (Input \| Preview \| Options \| Output) |

### 6.3 단축키

| 단축키 | 동작 |
|--------|------|
| `Ctrl/Cmd + 1` | Input 탭으로 이동 |
| `Ctrl/Cmd + 2` | Preview 탭으로 이동 |
| `Ctrl/Cmd + 3` | Options 탭으로 이동 |
| `Ctrl/Cmd + C` | 출력 코드 복사 (출력 영역 포커스 시) |
| `Ctrl/Cmd + S` | TSX 파일로 저장 |
| `Ctrl/Cmd + V` | 클립보드에서 SVG 붙여넣기 |

### 6.4 테마

- 다크 모드 기본
- 라이트 모드 지원
- 시스템 테마 연동

---

## 7. 변환 로직 상세

### 7.1 SVG → TSX 속성 변환 규칙

| SVG 속성 | TSX 속성 |
|----------|----------|
| `class` | `className` |
| `fill-rule` | `fillRule` |
| `clip-rule` | `clipRule` |
| `stroke-width` | `strokeWidth` |
| `stroke-linecap` | `strokeLinecap` |
| `stroke-linejoin` | `strokeLinejoin` |
| `font-size` | `fontSize` |
| `text-anchor` | `textAnchor` |
| `xlink:href` | `href` (xlinkHref deprecated) |

### 7.2 출력 템플릿

```tsx
import { SVGProps, memo, forwardRef } from 'react';

interface IconNameProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

const IconName = forwardRef<SVGSVGElement, IconNameProps>(
  ({ size = 24, ...props }, ref) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      {/* SVG 내용 */}
    </svg>
  )
);

IconName.displayName = 'IconName';

export default memo(IconName);
```

---

## 8. Backend (Tauri/Rust)

### 8.1 Tauri 명령어

```rust
// src-tauri/src/commands.rs

#[tauri::command]
fn read_svg_file(path: String) -> Result<String, String>

#[tauri::command]
fn save_tsx_file(path: String, content: String) -> Result<(), String>

#[tauri::command]
fn open_file_dialog() -> Result<Option<String>, String>

#[tauri::command]
fn save_file_dialog(default_name: String) -> Result<Option<String>, String>
```

### 8.2 필요한 Tauri 플러그인

- `@tauri-apps/plugin-dialog` - 파일 다이얼로그
- `@tauri-apps/plugin-fs` - 파일 시스템 접근
- `@tauri-apps/plugin-clipboard-manager` - 클립보드 기능

---

## 9. 성능 요구사항

| 항목 | 목표 |
|------|------|
| 앱 시작 시간 | < 1초 |
| 단일 SVG 변환 | < 100ms |
| 파일 드롭 반응 | < 50ms |
| 메모리 사용량 | < 100MB |

---

## 10. 마일스톤

### Phase 1: MVP (핵심 기능)
- [ ] 프로젝트 초기 설정 (Tauri v2 + React 19 + Vite)
- [ ] FSD 아키텍처 폴더 구조 생성
- [ ] shadcn/ui 설정
- [ ] entities/svg - SVG 파서 구현 (TDD)
- [ ] entities/tsx - TSX 제너레이터 구현 (TDD)
- [ ] Tab-based 기본 레이아웃 구현
- [ ] SVG 텍스트 입력 기능
- [ ] 기본 TSX 변환 로직
- [ ] 코드 미리보기 (구문 하이라이팅)
- [ ] 클립보드 복사 기능

### Phase 2: 파일 처리
- [ ] 드래그 앤 드롭 구현
- [ ] 파일 다이얼로그 연동 (Tauri)
- [ ] TSX 파일 저장 기능
- [ ] SVG 미리보기 (Preview 탭)

### Phase 3: 고급 기능
- [ ] 변환 옵션 UI (Options 탭)
- [ ] SVG 최적화 옵션 구현
- [ ] 다크/라이트 테마
- [ ] 설정 저장 (로컬 스토리지)
- [ ] 단축키 지원

### Phase 4: 개선
- [ ] 배치 처리 기능
- [ ] 히스토리 기능
- [ ] 에러 핸들링 개선
- [ ] E2E 테스트 (Playwright)

---

## 11. 참고 자료

### 유사 도구
- SVGR (https://react-svgr.com/)
- SVG to JSX (https://svg2jsx.com/)
- SVGO (SVG Optimizer)

### 기술 문서
- Tauri v2: https://v2.tauri.app/
- shadcn/ui: https://ui.shadcn.com/
- React 19: https://react.dev/
- Feature-Sliced Design: https://feature-sliced.design/
- Vitest: https://vitest.dev/
