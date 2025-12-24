# SVG2TSX PRD (Product Requirements Document)

## 1. 개요

### 1.1 제품명
**SVG2TSX** - SVG를 React TSX 컴포넌트로 변환하는 데스크톱 애플리케이션

### 1.2 목적
디자이너나 개발자가 SVG 파일을 드래그 앤 드롭하거나 직접 입력하여 최적화된 React TSX 컴포넌트로 빠르게 변환할 수 있는 도구

### 1.3 기술 스택
- **Frontend**: React 19, TypeScript, Vite 7
- **Desktop Runtime**: Tauri v2
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS

---

## 2. 핵심 기능

### 2.1 SVG 입력 방식
| 기능 | 설명 | 우선순위 |
|------|------|----------|
| 드래그 앤 드롭 | SVG 파일을 앱 영역에 드래그하여 입력 | P0 |
| 파일 선택 | 파일 탐색기를 통한 SVG 파일 선택 | P0 |
| 텍스트 입력 | SVG 코드 직접 붙여넣기 | P0 |
| 클립보드 | 클립보드에서 SVG 코드 자동 감지 | P1 |

### 2.2 SVG 최적화 옵션
| 옵션 | 설명 | 기본값 |
|------|------|--------|
| 불필요한 속성 제거 | `xmlns`, `version` 등 React에서 불필요한 속성 제거 | ON |
| ID/Class 정리 | 중복 또는 불필요한 id, class 제거 | ON |
| 주석 제거 | SVG 내 주석 제거 | ON |
| 빈 그룹 제거 | 자식이 없는 `<g>` 태그 제거 | ON |
| viewBox 유지 | viewBox 속성 보존 | ON |
| currentColor 변환 | fill/stroke 색상을 currentColor로 변환 | OFF |

### 2.3 TSX 변환 옵션
| 옵션 | 설명 | 기본값 |
|------|------|--------|
| 컴포넌트 타입 | Functional Component (React.FC) | FC |
| Props 타입 | SVGProps<SVGSVGElement> 상속 | ON |
| 기본 export | export default vs named export | default |
| 파일명 | PascalCase 컴포넌트명 자동 생성 | 자동 |
| memo 래핑 | React.memo로 감싸기 | OFF |
| forwardRef | ref 전달 지원 | OFF |

### 2.4 출력 기능
| 기능 | 설명 | 우선순위 |
|------|------|----------|
| 코드 미리보기 | 변환된 TSX 코드 실시간 미리보기 | P0 |
| SVG 미리보기 | 원본 SVG 렌더링 미리보기 | P0 |
| 클립보드 복사 | 변환된 코드 원클릭 복사 | P0 |
| 파일 다운로드 | .tsx 파일로 저장 | P0 |
| 배치 처리 | 여러 SVG 일괄 변환 | P2 |

---

## 3. UI/UX 요구사항

### 3.1 레이아웃 구조
```
┌─────────────────────────────────────────────────────────┐
│  [Custom Title Bar - 드래그 가능 영역]                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   ┌──────────────────┐    ┌──────────────────────────┐  │
│   │                  │    │                          │  │
│   │   SVG 입력 영역   │    │     TSX 출력 영역        │  │
│   │                  │    │                          │  │
│   │  [드래그 앤 드롭] │    │   [코드 에디터 뷰]       │  │
│   │  [텍스트 입력]   │    │   [구문 하이라이팅]       │  │
│   │                  │    │                          │  │
│   └──────────────────┘    └──────────────────────────┘  │
│                                                         │
├─────────────────────────────────────────────────────────┤
│   [변환 옵션 패널]                         [복사] [저장] │
└─────────────────────────────────────────────────────────┘
```

### 3.2 반응형 동작
- 최소 창 크기: 600x400px
- 좌우 패널 리사이즈 가능
- 세로 모드 지원 (좁은 화면에서 상하 배치)

### 3.3 테마
- 다크 모드 기본
- 라이트 모드 지원
- 시스템 테마 연동

---

## 4. 기술 요구사항

### 4.1 Frontend (React)
```typescript
// 주요 컴포넌트 구조
src/
├── components/
│   ├── ui/              // shadcn/ui 컴포넌트
│   ├── TitleBar/        // 커스텀 타이틀바
│   ├── SvgInput/        // SVG 입력 영역
│   ├── TsxOutput/       // TSX 출력 영역
│   ├── OptionsPanel/    // 변환 옵션 설정
│   └── Preview/         // SVG 미리보기
├── hooks/
│   ├── useSvgParser.ts  // SVG 파싱 훅
│   ├── useTsxConverter.ts // TSX 변환 훅
│   └── useClipboard.ts  // 클립보드 훅
├── lib/
│   ├── svgOptimizer.ts  // SVG 최적화 로직
│   ├── tsxGenerator.ts  // TSX 코드 생성
│   └── utils.ts
└── types/
    └── index.ts         // 타입 정의
```

### 4.2 Backend (Tauri/Rust)
```rust
// Tauri 명령어
#[tauri::command]
fn read_svg_file(path: String) -> Result<String, String>

#[tauri::command]
fn save_tsx_file(path: String, content: String) -> Result<(), String>

#[tauri::command]
fn open_file_dialog() -> Result<String, String>
```

### 4.3 필요한 Tauri 플러그인
- `@tauri-apps/plugin-dialog` - 파일 다이얼로그
- `@tauri-apps/plugin-fs` - 파일 시스템 접근
- `@tauri-apps/plugin-clipboard-manager` - 클립보드 기능

---

## 5. 변환 로직 상세

### 5.1 SVG → TSX 변환 규칙

#### 속성 변환
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
| `xlink:href` | `xlinkHref` (deprecated) → `href` |

#### 출력 템플릿
```tsx
import { SVGProps, memo } from 'react';

interface IconNameProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

const IconName = ({ size = 24, ...props }: IconNameProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    {/* SVG 내용 */}
  </svg>
);

export default memo(IconName);
```

---

## 6. 성능 요구사항

| 항목 | 목표 |
|------|------|
| 앱 시작 시간 | < 1초 |
| 단일 SVG 변환 | < 100ms |
| 파일 드롭 반응 | < 50ms |
| 메모리 사용량 | < 100MB |

---

## 7. 마일스톤

### Phase 1: MVP (핵심 기능)
- [ ] shadcn/ui 설정
- [ ] 기본 레이아웃 구현
- [ ] SVG 텍스트 입력 기능
- [ ] 기본 TSX 변환 로직
- [ ] 코드 미리보기 (구문 하이라이팅)
- [ ] 클립보드 복사 기능

### Phase 2: 파일 처리
- [ ] 드래그 앤 드롭 구현
- [ ] 파일 다이얼로그 연동
- [ ] TSX 파일 저장 기능
- [ ] SVG 미리보기

### Phase 3: 고급 기능
- [ ] 변환 옵션 UI
- [ ] SVG 최적화 옵션
- [ ] 다크/라이트 테마
- [ ] 설정 저장 (로컬 스토리지)

### Phase 4: 개선
- [ ] 배치 처리 기능
- [ ] 히스토리 기능
- [ ] 단축키 지원
- [ ] 에러 핸들링 개선

---

## 8. 참고 자료

### 유사 도구
- SVGR (https://react-svgr.com/)
- SVG to JSX (https://svg2jsx.com/)
- SVGO (SVG Optimizer)

### 기술 문서
- Tauri v2: https://v2.tauri.app/
- shadcn/ui: https://ui.shadcn.com/
- React 19: https://react.dev/
