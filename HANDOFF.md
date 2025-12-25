# SVG2TSX Handoff Document

## Goal

SVG를 React TSX 컴포넌트로 변환하는 데스크톱 애플리케이션(Tauri v2 + React 19) 개발

## Current Progress

### 완료된 작업

#### 1. Task 01: 프로젝트 초기 설정 (완료)
- bun으로 Tauri v2 프로젝트 설정 완료
- Custom title bar 적용 (`titleBarStyle: "Overlay"`)
- 다크/라이트 테마 시스템 적용 (ThemeProvider)
- FSD 폴더 구조 생성 완료 (app/pages/widgets/features/entities/shared)
- Tailwind CSS 4 + shadcn/ui 설정 완료 (button, tabs, textarea, switch)
- ESLint 9 (flat config) + Prettier 설정 완료
- Vitest 테스트 환경 설정 완료
- Path alias 설정 완료 (@/app, @/pages 등)

#### 2. PRD 문서 작성 및 업데이트 (`docs/PRD.md`)
- 테크스택 분리 (Frontend, Desktop Runtime, 개발 도구, 핵심 라이브러리)
- FSD (Feature-Sliced Design) 아키텍처 설계
- Tab-based 레이아웃 구조 정의
- TDD Red-Green-Refactor 개발 가이드
- 테스트 커버리지 목표 (entities 90%+)

#### 3. 작업 문서 세분화 (`docs/tasks/`)
6개 문서 생성 완료:

| 파일 | 내용 | 우선순위 |
|------|------|----------|
| `README.md` | 전체 작업 분배 및 의존성 | - |
| `task-01-setup.md` | 프로젝트 초기 설정 (Tauri+React+FSD) | P0 |
| `task-02-core-logic.md` | SVG/TSX 변환 핵심 로직 (TDD) | P0 |
| `task-03-ui-layout.md` | UI 및 Tab-based 레이아웃 | P0 |
| `task-04-file-tauri.md` | 파일 입출력 및 Tauri 연동 | P1 |
| `task-05-advanced.md` | 고급 기능 (테마, 단축키, E2E) | P2 |

### 기술 결정사항

- **아키텍처**: FSD (Feature-Sliced Design)
  ```
  app → pages → widgets → features → entities → shared
  ```
- **레이아웃**: Tab-based (Input | Preview | Options) + 하단 Output
- **개발 방법론**: TDD Red-Green-Refactor
- **패키지 매니저**: bun
- **커밋/PR**: 한글로 작성

## What Worked

1. **시니어-주니어 agent 패턴**
   - 시니어 agent가 전체 구조를 먼저 설계 (README.md)
   - 5개 주니어 agent가 병렬로 세부 문서 작성
   - 효율적인 문서 생성 (총 6개 문서, ~120KB)

2. **ToT (Tree of Thought) 분석**
   - 아키텍처 선택 시 3가지 옵션 비교 분석
   - 레이아웃 구조 2가지 안 제시 후 사용자 선택

3. **체크리스트 기반 문서**
   - 각 task 문서에 체크박스 형식으로 진행 추적 가능
   - 명확한 완료 기준 정의

## What Didn't Work

1. **일부 agent 파일 미생성 이슈**
   - Task 03, 05 agent가 완료 보고했으나 실제 파일 미생성
   - 수동으로 직접 생성하여 해결

## Next Steps

### 즉시 수행 (Phase 1: MVP)

1. **Task 02 실행**: 핵심 변환 로직 (TDD)
   ```bash
   # docs/tasks/task-02-core-logic.md 참조
   # entities/svg - parser, optimizer
   # entities/tsx - generator, templates
   # 테스트 먼저 작성 후 구현
   ```

   ```bash
   # docs/tasks/task-03-ui-layout.md 참조
   # pages/main, widgets, features
   # Tab-based 레이아웃
   # prism-react-renderer 코드 하이라이팅
   ```

### 이후 수행

4. **Task 04**: 파일 입출력 및 Tauri 연동
5. **Task 05**: 고급 기능 (테마, 단축키, 히스토리)

## Key Files

```
svg2tsx/
├── docs/
│   ├── PRD.md                    # 전체 요구사항
│   └── tasks/
│       ├── README.md             # 작업 분배 총괄
│       ├── task-01-setup.md      # 프로젝트 초기 설정
│       ├── task-02-core-logic.md # 핵심 변환 로직
│       ├── task-03-ui-layout.md  # UI/레이아웃
│       ├── task-04-file-tauri.md # 파일/Tauri
│       └── task-05-advanced.md   # 고급 기능
└── HANDOFF.md                    # 이 파일
```

## Commands for Next Agent

```bash
# 프로젝트 디렉토리 이동
cd /Users/taesoonpark/workspace/svg2tsx

# PRD 확인
@docs/PRD.md

# 작업 목록 확인
@docs/tasks/README.md

# 첫 번째 작업 시작
@docs/tasks/task-01-setup.md
```

---

**Last Updated**: 2025-12-25
**Session Context**: Task 01 완료! 다음은 Task 02 (SVG/TSX 변환 핵심 로직) 또는 Task 03 (기본 UI) 진행
