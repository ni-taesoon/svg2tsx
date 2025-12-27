# CLAUDE.md 개선 계획

> 리서치 기반 CLAUDE.md 개선 항목 정리
> 작성일: 2025-12-25

## 리서치 요약

### 참고 자료
- [Anthropic 공식 베스트 프랙티스](https://www.anthropic.com/engineering/claude-code-best-practices)
- [Claude Code 공식 문서](https://docs.anthropic.com/en/docs/claude-code/overview)
- [CLAUDE.md 사용 가이드 (Claude 블로그)](https://claude.com/blog/using-claude-md-files)
- [awesome-claude-md (73개 예제 모음)](https://github.com/josix/awesome-claude-md)
- [claude-code-templates](https://github.com/davila7/claude-code-templates)

---

## 현재 CLAUDE.md 분석

### 잘 된 점 ✓
| 항목 | 설명 |
|------|------|
| Project Overview | 프로젝트 목적 명확히 설명 |
| Commands | 개발/빌드/테스트 명령어 포함 |
| Architecture | FSD 아키텍처 구조 문서화 |
| Entry Points | 진입점 테이블로 정리 |
| Tech Stack | 기술 스택 목록화 |
| Conventions | 코드 컨벤션 정의 |
| What Worked | 효과적인 패턴 기록 |

### 개선 필요 항목 ✗
| 카테고리 | 현재 상태 | 개선 방향 |
|----------|----------|----------|
| 간결성 | 장황한 설명 포함 | 짧은 불릿 포인트로 압축 |
| 강조 표현 | 일반 텍스트 | MUST/SHOULD/NEVER 강조 추가 |
| 금지사항 | 없음 | Do NOT 섹션 추가 |
| 에러 핸들링 | 없음 | 일반적인 에러 패턴 추가 |
| 보안 가이드 | 없음 | 민감 정보 처리 지침 추가 |
| 용어 사전 | 없음 | 프로젝트 특화 용어 정의 |
| 디버깅 팁 | 없음 | 일반적인 문제 해결 추가 |

---

## 개선 항목 상세

### 1. 간결성 향상 (토큰 효율성)

**현재 문제:**
```markdown
# 현재 - 너무 장황함
Red-Green-Refactor 사이클 준수:
1. 🔴 RED: 실패하는 테스트 작성
2. 🟢 GREEN: 테스트 통과하는 최소 코드 작성
3. 🔵 REFACTOR: 코드 개선 (중복 제거)
```

**개선안:**
```markdown
# 개선 - 간결하게
TDD: RED(실패 테스트) → GREEN(최소 구현) → REFACTOR(개선)
```

**적용 대상:**
- [ ] Onboarding 섹션: 프로젝트 이해 순서 압축
- [ ] Architecture 섹션: 레이어 설명 간소화
- [ ] Development Principles: TDD 설명 한 줄로

---

### 2. MUST/SHOULD/NEVER 강조 규칙

Anthropic에서 권장하는 강조 표현 패턴:

```markdown
# 강조 레벨
- **MUST**: CI에서 강제하는 필수 규칙
- **SHOULD**: 강력 권장 사항
- **NEVER**: 절대 금지 사항
- **IMPORTANT**: 중요 참고사항
```

**추가할 규칙 예시:**
```markdown
## Critical Rules

- **MUST**: 코드 수정 후 `bun run test` 실행
- **MUST**: 각 레이어 의존성 규칙 준수
- **NEVER**: 내부 구현 직접 import (index.ts 통해서만)
- **NEVER**: 같은 레이어 간 직접 import
- **SHOULD**: PR 전 `bun run format` 실행
```

---

### 3. Do NOT 섹션 추가

```markdown
## Do NOT (금지사항)

- `src-tauri/` 내부 Rust 코드 임의 수정 금지 (Tauri 설정 변경 시 문서 확인)
- `shared/ui/` shadcn 컴포넌트 직접 수정 금지 (래퍼 생성하여 사용)
- 테스트 없는 entities/ 코드 커밋 금지
- API 키, 시크릿 등 민감 정보 하드코딩 금지
```

---

### 4. 에러 핸들링 패턴 추가

```markdown
## Error Handling Patterns

### Tauri 명령어 에러
\`\`\`typescript
// entities/ 레이어에서 Result 타입 래핑
type Result<T> = { ok: true; data: T } | { ok: false; error: string }
\`\`\`

### 일반적인 빌드 에러
| 에러 | 원인 | 해결 |
|------|------|------|
| `Cannot find module` | 경로 오류 | index.ts 통해 import 확인 |
| `Type error` | 타입 불일치 | `bun run typecheck` 후 수정 |
| `Rust compile error` | Rust 문법 | `cd src-tauri && cargo check` |
```

---

### 5. 보안 가이드라인 추가

```markdown
## Security Guidelines

- **민감 정보 처리**
  - `.env` 파일 gitignore 확인
  - Tauri 설정에서 `dangerousAllowAssetsCspModification` 사용 금지
  - 사용자 입력 SVG 검증 필수 (XSS 방지)

- **NEVER include in commits:**
  - API keys
  - Database credentials
  - Personal tokens
```

---

### 6. 프로젝트 용어 사전 (Glossary)

```markdown
## Glossary (용어 사전)

| 용어 | 정의 |
|------|------|
| FSD | Feature-Sliced Design - 레이어 기반 아키텍처 |
| Slice | FSD에서 기능 단위 폴더 (예: svg/, tsx/) |
| Segment | Slice 내부 구조 (model, ui, api 등) |
| SVGO | SVG 최적화 라이브러리 |
| TSX | TypeScript + JSX (React 컴포넌트 파일) |
```

---

### 7. 디버깅 팁 추가

```markdown
## Debugging Tips

### Tauri 개발 시
\`\`\`bash
# Rust 백엔드 로그 확인
RUST_LOG=debug bun run tauri dev

# 프론트엔드 DevTools
# 앱 내에서 F12 또는 Cmd+Option+I
\`\`\`

### 일반적인 문제
| 증상 | 확인 사항 |
|------|----------|
| 핫 리로드 안됨 | Vite dev 서버 재시작 |
| Rust 변경 반영 안됨 | Tauri dev 재시작 |
| 타입 에러 | node_modules 삭제 후 재설치 |
```

---

### 8. 워크플로우 명확화

```markdown
## Workflows

### 새 기능 구현 시
1. 해당 레이어 기존 패턴 확인 (같은 폴더 내 다른 파일 참고)
2. 테스트 먼저 작성 (entities 90%, features 80%)
3. 구현 후 `bun run test` 통과 확인
4. `bun run format` 실행
5. PR 생성

### 버그 수정 시
1. 버그 재현 테스트 작성
2. 테스트 실패 확인 (RED)
3. 최소 수정으로 테스트 통과 (GREEN)
4. 리팩토링 검토
```

---

### 9. 파일 위치 가이드 추가

```markdown
## File Placement Guide

| 추가할 코드 | 위치 | 예시 |
|------------|------|------|
| SVG 파싱 로직 | `entities/svg/` | parseSvg.ts |
| 변환 옵션 타입 | `entities/options/` | types.ts |
| 복사 버튼 UI | `features/copy/` | CopyButton.tsx |
| 패널 조합 | `widgets/` | SvgInputPanel.tsx |
| Tauri API 래퍼 | `shared/api/` | file-system.ts |
| UI 컴포넌트 | `shared/ui/` | (shadcn 확장) |
```

---

### 10. 세션 관리 팁

```markdown
## Session Management

- `/init` - CLAUDE.md 자동 생성
- `#` 키 - 현재 세션에서 규칙 추가 (CLAUDE.md에 자동 반영)
- `/clear` - 컨텍스트 초기화 (CLAUDE.md 설정은 유지)
- CLAUDE.local.md - 개인 설정 (gitignore에 추가)
```

---

## 우선순위 및 실행 계획

### Phase 1: 필수 개선 (즉시)
1. [x] MUST/SHOULD/NEVER 강조 규칙 추가
2. [x] Do NOT 섹션 추가
3. [x] 간결성 개선 (장황한 설명 압축)

### Phase 2: 권장 개선 (단기)
4. [ ] 에러 핸들링 패턴 추가
5. [ ] 보안 가이드라인 추가
6. [ ] 워크플로우 명확화

### Phase 3: 선택 개선 (장기)
7. [ ] 용어 사전 추가
8. [ ] 디버깅 팁 추가
9. [ ] 파일 위치 가이드 추가
10. [ ] 세션 관리 팁 추가

---

## 참고: 우수 CLAUDE.md 예시 구조

[awesome-claude-md](https://github.com/josix/awesome-claude-md)에서 분석한 공통 패턴:

```markdown
# PROJECT_NAME

Brief one-line description

## Quick Start
Essential commands only

## Architecture
High-level structure (diagram preferred)

## Critical Rules
MUST/SHOULD/NEVER format

## Do NOT
Explicit prohibitions

## Common Tasks
Step-by-step workflows

## Debugging
Common issues and solutions
```

---

## 체크리스트

- [ ] Phase 1 개선 항목 CLAUDE.md에 반영
- [ ] Phase 2 개선 항목 CLAUDE.md에 반영
- [ ] 개선된 CLAUDE.md 길이 500줄 이하 유지
- [ ] 팀 리뷰 후 최종 반영
