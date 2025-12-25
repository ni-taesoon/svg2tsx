# SVG2TSX 작업 분배 문서

## 전체 프로젝트 개요

SVG2TSX는 SVG 파일을 React TSX 컴포넌트로 변환하는 데스크톱 애플리케이션입니다. 이 프로젝트는 **Feature-Sliced Design (FSD)** 아키텍처와 **TDD (Test-Driven Development)** 방법론을 기반으로 개발됩니다.

### 기술 스택
- **Frontend**: React 19, TypeScript 5.x, Vite 7, Tailwind CSS 4, shadcn/ui
- **Desktop**: Tauri v2, Rust
- **개발 도구**: pnpm, Vitest, Playwright, ESLint, Prettier
- **핵심 라이브러리**: prism-react-renderer, @tauri-apps 플러그인들

### 개발 원칙
1. **TDD 개발**: Red-Green-Refactor 사이클 준수
2. **FSD 아키텍처**: 단방향 의존성 규칙 (app → pages → widgets → features → entities → shared)
3. **테스트 커버리지**: entities 90%+, features 80%+, widgets 70%+

---

## 작업 문서 구조

5개의 작업 문서는 PRD의 마일스톤(Phase 1~4)을 기준으로 분리되었으며, 각 문서는 독립적으로 할당 가능하지만 순차적 의존성을 가집니다.

### 📋 작업 문서 목록

| 번호 | 파일명 | 담당 영역 | 우선순위 | 예상 기간 |
|------|--------|-----------|----------|----------|
| 1 | `task-01-project-setup.md` | 프로젝트 초기 설정 및 기반 구조 | P0 (최우선) | 2일 |
| 2 | `task-02-core-logic.md` | SVG/TSX 변환 핵심 로직 (entities layer) | P0 (최우선) | 3일 |
| 3 | `task-03-basic-ui.md` | 기본 UI 및 레이아웃 (widgets/features) | P0 (최우선) | 3일 |
| 4 | `task-04-file-integration.md` | 파일 입출력 및 Tauri 연동 | P1 (중요) | 2일 |
| 5 | `task-05-advanced-features.md` | 고급 기능 및 UX 개선 | P2 (차순위) | 4일 |

---

## 📝 각 작업 문서 상세 내용

### 1️⃣ Task 01: 프로젝트 초기 설정 및 기반 구조
**파일명**: `task-01-project-setup.md`

#### 담당 영역
- Tauri v2 + React 19 + Vite 프로젝트 초기화
- FSD 아키텍처 폴더 구조 생성
- 개발 도구 설정 (ESLint, Prettier, Vitest, Playwright)
- shadcn/ui 설정 및 Tailwind CSS 구성
- 기본 테마 Provider 구현

#### 핵심 산출물
- 완전한 프로젝트 스캐폴딩
- `src/` 폴더의 FSD 레이어 구조
- 테스트 환경 설정 파일
- Tauri 기본 설정 파일
- CI/CD 파이프라인 기초

#### 의존성
- **선행 작업 없음** (독립 작업)
- **후속 작업**: 모든 작업 (Task 02~05)

---

### 2️⃣ Task 02: SVG/TSX 변환 핵심 로직
**파일명**: `task-02-core-logic.md`

#### 담당 영역
- `entities/svg/parser` - SVG 파싱 로직 (TDD)
- `entities/svg/optimizer` - SVG 최적화 로직 (TDD)
- `entities/tsx/generator` - TSX 생성 로직 (TDD)
- `entities/tsx/templates` - TSX 템플릿 정의
- 속성 변환 규칙 구현 (class → className, kebab-case → camelCase 등)

#### 핵심 산출물
- SVG 파서 (`parseSvg()` 함수)
- SVG 최적화기 (`optimizeSvg()` 함수)
- TSX 생성기 (`generateTsx()` 함수)
- 단위 테스트 (커버리지 90%+)
- 타입 정의 파일 (`types.ts`)

#### 의존성
- **선행 작업**: Task 01 (프로젝트 설정 완료 후)
- **후속 작업**: Task 03, 04, 05 (모든 UI/기능이 이 로직 사용)

---

### 3️⃣ Task 03: 기본 UI 및 레이아웃
**파일명**: `task-03-basic-ui.md`

#### 담당 영역
- `pages/main` - 메인 페이지 구현
- `widgets/svg-input-panel` - SVG 입력 패널 (Tab UI)
- `widgets/tsx-output-panel` - TSX 출력 패널 (코드 하이라이팅)
- `widgets/options-panel` - 옵션 설정 패널
- `features/convert-svg` - SVG 변환 기능
- `features/copy-code` - 코드 복사 기능
- Tab-based 레이아웃 구현

#### 핵심 산출물
- 3-Tab 레이아웃 (Input, Preview, Options)
- SVG 텍스트 입력 컴포넌트
- TSX 코드 미리보기 (prism-react-renderer 적용)
- 클립보드 복사 버튼
- 반응형 UI (>= 768px 상하 분할, < 768px 전체 탭)

#### 의존성
- **선행 작업**: Task 01, Task 02 (변환 로직 필요)
- **후속 작업**: Task 04 (파일 입출력 추가), Task 05 (옵션 적용)

---

### 4️⃣ Task 04: 파일 입출력 및 Tauri 연동
**파일명**: `task-04-file-integration.md`

#### 담당 영역
- Tauri 명령어 구현 (Rust)
  - `read_svg_file()`
  - `save_tsx_file()`
  - `open_file_dialog()`
  - `save_file_dialog()`
- `shared/api/file-system.ts` - Tauri 파일 시스템 래퍼
- `features/save-file` - TSX 파일 저장 기능
- 드래그 앤 드롭 구현
- 파일 선택 다이얼로그 연동

#### 핵심 산출물
- Rust Tauri 명령어 4개
- 드래그 앤 드롭 이벤트 핸들러
- 파일 다이얼로그 UI 컴포넌트
- TSX 파일 저장 기능
- 파일 시스템 API 래퍼

#### 의존성
- **선행 작업**: Task 01, Task 03 (UI 레이아웃 필요)
- **후속 작업**: Task 05 (배치 처리 등)

---

### 5️⃣ Task 05: 고급 기능 및 UX 개선
**파일명**: `task-05-advanced-features.md`

#### 담당 영역
- `entities/options/store` - 옵션 상태 관리
- `features/toggle-option` - 옵션 토글 기능
- SVG 최적화 옵션 UI 연동
- TSX 변환 옵션 UI 연동 (memo, forwardRef 등)
- 다크/라이트 테마 전환
- 단축키 구현 (Ctrl/Cmd + 1/2/3/C/S/V)
- 설정 로컬 스토리지 저장
- SVG 미리보기 (Preview 탭)
- 에러 핸들링 개선
- E2E 테스트 (Playwright)

#### 핵심 산출물
- 옵션 설정 UI (9개 옵션)
- 테마 전환 기능
- 단축키 시스템
- 로컬 스토리지 동기화
- SVG 렌더링 미리보기
- Playwright E2E 테스트

#### 의존성
- **선행 작업**: Task 02, Task 03, Task 04 (모든 기본 기능 완료 후)
- **후속 작업**: 없음 (최종 단계)

---

## 🔗 문서 간 의존성 관계

```
Task 01 (프로젝트 설정)
   │
   ├──────────────────┐
   │                  │
   ▼                  ▼
Task 02            Task 03
(핵심 로직)        (기본 UI)
   │                  │
   └────────┬─────────┘
            │
            ▼
         Task 04
      (파일 입출력)
            │
            ▼
         Task 05
     (고급 기능/UX)
```

### 의존성 상세
1. **Task 01은 필수 선행**: 모든 작업은 프로젝트 설정이 완료되어야 시작 가능
2. **Task 02와 Task 03은 병렬 가능**: 서로 독립적이나, Task 03이 Task 02를 나중에 통합
3. **Task 04는 UI 완성 후**: Task 03의 레이아웃이 완성되어야 파일 입출력 UI 추가 가능
4. **Task 05는 모든 기본 기능 후**: Task 02, 03, 04가 모두 완료되어야 옵션 적용 가능

---

## 📅 예상 작업 순서

### Sprint 1 (Week 1): 기반 구축
- **Day 1-2**: Task 01 (프로젝트 설정)
- **Day 3-5**: Task 02 (핵심 로직) + Task 03 시작 (병렬 작업 가능)

### Sprint 2 (Week 2): MVP 완성
- **Day 1-3**: Task 03 완료 (기본 UI)
- **Day 4-5**: Task 04 (파일 입출력)

### Sprint 3 (Week 3): 고급 기능
- **Day 1-4**: Task 05 (고급 기능 및 UX)
- **Day 5**: 통합 테스트 및 버그 수정

---

## ✅ 작업 완료 기준

각 작업은 다음 기준을 모두 충족해야 완료로 간주됩니다:

### 공통 기준
- [ ] 모든 코드가 TypeScript 타입 에러 없음
- [ ] ESLint/Prettier 규칙 준수
- [ ] FSD 아키텍처 레이어 규칙 준수 (단방향 의존성)
- [ ] Public API (`index.ts`) 올바르게 노출
- [ ] Git 커밋 메시지 한글 작성
- [ ] PR 설명 한글 작성

### Task별 추가 기준
- **Task 01**: `pnpm dev`로 앱 실행 성공
- **Task 02**: Vitest 단위 테스트 90%+ 커버리지
- **Task 03**: React Testing Library 테스트 80%+ 커버리지
- **Task 04**: Tauri 명령어 정상 동작 확인
- **Task 05**: Playwright E2E 테스트 통과

---

## 🚀 시작하기

각 주니어 문서 작성자는 할당받은 `task-XX-*.md` 파일을 읽고:

1. **요구사항 분석**: 해당 작업의 범위와 책임 파악
2. **기술 스택 확인**: 사용할 라이브러리와 도구 확인
3. **TDD 사이클 적용**: Red-Green-Refactor 순서로 개발
4. **FSD 규칙 준수**: 레이어 간 의존성 규칙 엄수
5. **완료 기준 체크**: 모든 체크리스트 항목 충족 확인

### 커뮤니케이션
- 의존성 문제 발견 시 즉시 보고
- 기술적 의사결정이 필요한 경우 팀 논의
- 일일 진행 상황 공유

---

## 📚 참고 자료

### 필수 문서
- [PRD.md](../PRD.md) - 전체 제품 요구사항
- [Feature-Sliced Design](https://feature-sliced.design/) - 아키텍처 가이드
- [Tauri v2 문서](https://v2.tauri.app/)
- [shadcn/ui 문서](https://ui.shadcn.com/)

### 테스트 가이드
- [Vitest 문서](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright 문서](https://playwright.dev/)

### 코딩 컨벤션
- TypeScript: strict mode 활성화
- 네이밍: PascalCase (컴포넌트), camelCase (함수/변수)
- pnpm 사용 (npm/yarn 사용 금지)

---

**작성자**: 시니어 문서 관리자
**작성일**: 2025-12-25
**버전**: 1.0.0
