# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SVG2TSX는 SVG 파일을 React TSX 컴포넌트로 변환하는 Tauri v2 기반 데스크톱 애플리케이션이다.

---

## 🚀 Onboarding (IMPORTANT - 새 세션 시작 시 필독)

> **MUST**: 새 세션 시작 시 아래 문서를 순서대로 확인할 것

### Step 1: 목표 파악
```
docs/PRD.md → 제품 요구사항, UI 레이아웃, 변환 규칙
```

### Step 2: 현재 진행 상황
```
docs/tasks/README.md → 5개 작업 의존성 및 완료 기준
```

### Step 3: 작업 상세
```
docs/tasks/task-0X-*.md → 해당 작업 상세 구현 가이드
```

### Step 4: 스펙 문서
| 문서 | 내용 |
|------|------|
| `docs/specs/attribute-transform.md` | class→className, kebab→camelCase 변환 규칙 |
| `docs/specs/tsx-template.md` | TSX 템플릿 (옵션별 변형 포함) |
| `docs/specs/ui-layout.md` | Tab-based 레이아웃, 단축키, 반응형 |

### 코드베이스 탐색 맵
```
핵심 로직:
  entities/svg/       → SVG 파싱, 최적화
  entities/tsx/       → TSX 생성, 템플릿
  entities/options/   → 변환 옵션 상태

UI:
  widgets/            → 조합된 패널
  features/           → 사용자 액션
  shared/ui/          → shadcn/ui 컴포넌트

Tauri:
  src-tauri/src/lib.rs → Rust 명령어
  shared/api/          → Tauri API 래퍼
```

### Entry Points
| 영역 | 파일 | 역할 |
|------|------|------|
| 앱 | `src/app/App.tsx` | 루트, providers |
| SVG | `entities/svg/index.ts` | parseSvg, optimizeSvg |
| TSX | `entities/tsx/index.ts` | generateTsx |
| Tauri | `src-tauri/src/lib.rs` | 파일 I/O |

---

## 🧪 TDD (IMPORTANT - 모든 코드 작성 시 필수)

> **MUST**: 모든 entities/, features/ 코드는 테스트 먼저 작성

### Red-Green-Refactor 사이클

```
🔴 RED     → 실패하는 테스트 작성
🟢 GREEN   → 테스트 통과하는 최소 코드
🔵 REFACTOR → 중복 제거, 코드 개선
```

### 테스트 커버리지 목표

| Layer | 목표 | 도구 | 필수 여부 |
|-------|------|------|----------|
| entities/ | **90%+** | Vitest | **MUST** |
| features/ | **80%+** | Vitest + RTL | **MUST** |
| widgets/ | 70%+ | RTL | SHOULD |
| pages/ | E2E | Playwright | SHOULD |

### TDD 워크플로우

**새 기능 구현 시:**
1. **MUST**: 실패하는 테스트 먼저 작성
2. **MUST**: `bun run test` 실패 확인 (RED)
3. 최소 코드로 테스트 통과 (GREEN)
4. 리팩토링 (REFACTOR)
5. **MUST**: `bun run test` 통과 확인

**버그 수정 시:**
1. **MUST**: 버그 재현 테스트 작성
2. 테스트 실패 확인 (RED)
3. 최소 수정으로 통과 (GREEN)
4. 회귀 방지 확인

### 테스트 파일 위치
```
src/
├── entities/svg/
│   ├── parseSvg.ts
│   └── parseSvg.test.ts    ← 같은 폴더에 .test.ts
├── features/convert/
│   ├── ConvertButton.tsx
│   └── ConvertButton.test.tsx
```

---

## Critical Rules

### MUST (필수)
- 코드 수정 후 `bun run test` 실행
- entities/, features/ 코드는 테스트 필수
- 각 레이어 의존성 규칙 준수: `app → pages → widgets → features → entities → shared`
- 각 슬라이스는 `index.ts`로 Public API 노출

### SHOULD (권장)
- PR 전 `bun run format` 실행
- 새 기능 추가 전 해당 레이어 기존 패턴 확인
- 복잡한 로직은 주석 추가

### NEVER (금지)
- 내부 구현 직접 import (index.ts 통해서만)
- 같은 레이어 간 직접 import
- 테스트 없는 entities/ 코드 커밋
- API 키, 시크릿 하드코딩

---

## Do NOT (금지사항)

- `src-tauri/` Rust 코드 임의 수정 금지 → 문서 확인 필수
- `shared/ui/` shadcn 컴포넌트 직접 수정 금지 → 래퍼 생성하여 사용
- 테스트 커버리지 목표 미달 코드 머지 금지
- `.env`, credentials 등 민감 정보 커밋 금지

---

## Commands

```bash
# 개발
bun run tauri dev      # Tauri 앱 (Rust + Frontend)
bun run dev            # Vite만 (Frontend only)

# 빌드
bun run tauri build    # 프로덕션 빌드
bun run build          # Vite 빌드만

# 테스트 (MUST: 커밋 전 실행)
bun run test           # Vitest 유닛 테스트
bun run test:e2e       # Playwright E2E

# Rust 확인
cd src-tauri && cargo check
```

---

## Architecture

**FSD (Feature-Sliced Design)**

```
src/
├── app/        # 앱 초기화, providers
├── pages/      # 페이지 컴포넌트
├── widgets/    # 조합된 UI 블록
├── features/   # 사용자 기능
├── entities/   # 비즈니스 엔티티
└── shared/     # 공유 코드 (ui, api)
```

**의존성**: `app → pages → widgets → features → entities → shared` (단방향만)

---

## Task Workflow

```
Task 01 (프로젝트 설정) → 필수 선행
    ├── Task 02 (핵심 로직: entities)
    └── Task 03 (기본 UI: widgets, features) ← 병렬 가능
            └── Task 04 (Tauri 연동)
                    └── Task 05 (고급 기능)
```

---

## Tech Stack

- **Frontend**: React 19, TypeScript 5.x, Vite 7
- **Desktop**: Tauri v2, Rust
- **Styling**: Tailwind CSS 4, shadcn/ui
- **Testing**: Vitest, RTL, Playwright
- **Package Manager**: bun

---

## Tauri-specific

- 설정: `src-tauri/tauri.conf.json`
- Rust: `src-tauri/src/lib.rs`
- Custom title bar: `titleBarStyle: "Overlay"`
- 플러그인: `plugin-dialog`, `plugin-fs`, `plugin-clipboard-manager`

---

## Conventions

- 커밋/PR: 한글
- Public API: `index.ts`로 노출
- TypeScript strict mode
- 네이밍: PascalCase (컴포넌트), camelCase (함수/변수)

---

## Glossary (용어)

| 용어 | 정의 |
|------|------|
| FSD | Feature-Sliced Design - 레이어 기반 아키텍처 |
| Slice | FSD 기능 단위 폴더 (svg/, tsx/) |
| SVGO | SVG 최적화 라이브러리 |
| TSX | TypeScript + JSX |

---

## What Worked

### 1. 시니어-주니어 Agent 패턴
- 시니어: 전체 구조 설계 → 주니어: 병렬 세부 작업
- 복잡한 작업을 분할 정복

### 2. ToT (Tree of Thought) 분석
- 아키텍처/기술 선택 시 여러 옵션 비교
- 결정 근거 문서화

### 3. 체크리스트 기반 문서
- Definition of Done 정의
- `/handoff`로 HANDOFF.md 업데이트
