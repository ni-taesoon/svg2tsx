# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SVG2TSX는 SVG 파일을 React TSX 컴포넌트로 변환하는 Tauri v2 기반 데스크톱 애플리케이션이다.

## Onboarding (새 세션 시작 시)

### 프로젝트 이해 순서
1. **목표 파악**: `docs/PRD.md` - 제품 요구사항, UI 레이아웃, 변환 규칙
2. **현재 진행 상황**: `docs/tasks/README.md` - 5개 작업 의존성 및 완료 기준
3. **작업 상세**: `docs/tasks/task-0X-*.md` - 해당 작업 상세 구현 가이드

### 코드베이스 탐색 맵
```
핵심 로직을 찾을 때:
  entities/svg/       → SVG 파싱, 최적화
  entities/tsx/       → TSX 생성, 템플릿
  entities/options/   → 변환 옵션 상태

UI를 찾을 때:
  widgets/           → 조합된 패널 (svg-input, tsx-output, options)
  features/          → 사용자 액션 (convert, copy, save)
  shared/ui/         → shadcn/ui 컴포넌트

Tauri/네이티브 기능:
  src-tauri/src/lib.rs     → Rust 명령어 정의
  shared/api/              → Tauri API 래퍼 (file-system, clipboard)
```

### Entry Points (진입점)
| 영역 | 진입 파일 | 역할 |
|------|----------|------|
| 앱 전체 | `src/app/App.tsx` | 앱 루트, providers |
| SVG 변환 | `entities/svg/index.ts` | parseSvg, optimizeSvg |
| TSX 생성 | `entities/tsx/index.ts` | generateTsx |
| Tauri 명령 | `src-tauri/src/lib.rs` | 파일 I/O, 다이얼로그 |

> 💡 각 슬라이스는 `index.ts`로 Public API를 노출한다. 내부 구현을 직접 import하지 말 것.

## Commands

```bash
# 개발 (Tauri는 bun 환경)
bun run tauri dev          # Tauri 앱 개발 서버 실행 (Rust + Frontend)
bun run dev                # Vite 개발 서버만 실행 (Frontend only)

# 빌드
bun run tauri build        # 프로덕션 빌드 (배포용 바이너리 생성)
bun run build              # Vite 빌드만 실행

# Rust 컴파일 확인
cd src-tauri && cargo check

# 테스트 (설정 후)
bun run test               # Vitest 유닛 테스트
bun run test:e2e           # Playwright E2E 테스트
```

## Architecture

**FSD (Feature-Sliced Design) 아키텍처** - 현재는 초기 템플릿 상태

레이어 구조:
```
src/
├── app/           # 앱 초기화, providers
├── pages/         # 페이지 컴포넌트
├── widgets/       # 조합된 UI 블록 (svg-input-panel, tsx-output-panel 등)
├── features/      # 사용자 기능 (convert-svg, copy-code, save-file 등)
├── entities/      # 비즈니스 엔티티 (svg/parser, tsx/generator)
└── shared/        # 공유 코드 (shadcn/ui, Tauri API 래퍼)
```

**의존성 규칙**: `app → pages → widgets → features → entities → shared` (단방향만 허용, 같은 레이어 간 직접 import 금지)

## Development Principles

### TDD (Test-Driven Development)
Red-Green-Refactor 사이클 준수:
1. 🔴 RED: 실패하는 테스트 작성
2. 🟢 GREEN: 테스트 통과하는 최소 코드 작성
3. 🔵 REFACTOR: 코드 개선 (중복 제거)

### 테스트 커버리지 목표
| Layer | 목표 | 도구 |
|-------|------|------|
| entities/ | 90%+ | Vitest |
| features/ | 80%+ | Vitest + RTL |
| widgets/ | 70%+ | RTL |
| pages/ | E2E | Playwright |

### One-shotting을 위한 가이드
> LLM이 한 번에 올바른 구현을 할 수 있도록 컨텍스트 제공

- 새 기능 추가 전: 해당 레이어의 기존 코드 패턴 확인
- 속성 변환 규칙: `docs/specs/attribute-transform.md` (class→className, kebab→camelCase)
- TSX 템플릿: `docs/specs/tsx-template.md` (옵션별 변형 포함)
- UI 레이아웃: `docs/specs/ui-layout.md` (Tab-based 레이아웃, 단축키, 반응형)

## Task Workflow

작업 순서 (의존성 기반):
```
Task 01 (프로젝트 설정) → 필수 선행
    ├── Task 02 (핵심 로직: entities/svg, entities/tsx)
    └── Task 03 (기본 UI: widgets, features) ← 병렬 가능
            └── Task 04 (파일 입출력: Tauri 연동)
                    └── Task 05 (고급 기능: 옵션, 테마, 단축키)
```

## Tech Stack

- **Frontend**: React 19, TypeScript 5.x, Vite 7
- **Desktop Runtime**: Tauri v2, Rust
- **Styling**: Tailwind CSS 4, shadcn/ui
- **Testing**: Vitest (unit), React Testing Library (integration), Playwright (E2E)
- **Package Manager**: bun (Tauri 환경)

## Tauri-specific

- Tauri 설정: `src-tauri/tauri.conf.json`
- Rust 백엔드: `src-tauri/src/lib.rs` (Tauri 명령어 정의)
- Custom title bar 사용 (`titleBarStyle: "Overlay"`)
- 필요 플러그인: `@tauri-apps/plugin-dialog`, `@tauri-apps/plugin-fs`, `@tauri-apps/plugin-clipboard-manager`

## Conventions

- 커밋 메시지: 한글
- PR 설명: 한글
- 각 슬라이스는 `index.ts`로 Public API 노출
- TypeScript strict mode 활성화
- 네이밍: PascalCase (컴포넌트), camelCase (함수/변수)

## What Worked

### 1. 시니어-주니어 Agent 패턴
- 시니어 agent가 전체 구조를 먼저 설계 (README.md)
- 주니어 agent가 병렬로 세부 문서/코드 작성
- 복잡한 작업을 분할 정복으로 효율적 처리

### 2. ToT (Tree of Thought) 분석
- 아키텍처/기술 선택 시 여러 옵션 비교 분석
- 장단점을 명시하고 사용자 선택 유도
- 결정 근거를 문서화하여 추후 참조 가능

### 3. 체크리스트 기반 문서
- 명확한 완료 기준(Definition of Done) 정의
- 작업 상태를 시각적으로 파악 가능
- `/handoff`로 HANDOFF.md 문서 업데이트하여 다음 세션에 컨텍스트 전달
