# HANDOFF.md

> 마지막 업데이트: 2025-12-25

## Goal

SVG2TSX 앱에 **Tauri v2 자동 업데이트 기능**을 추가하여, GitHub Releases를 통해 사용자가 새 버전을 자동으로 받을 수 있도록 한다.

## Current Progress

### 완료된 작업

1. **자료 조사 완료**
   - Tauri v2 updater 플러그인 공식 문서 분석
   - tauri-action의 `includeUpdaterJson` 옵션 확인
   - 서명 기반 보안 모델 이해

2. **현재 프로젝트 상태 분석**
   - 버전: `0.1.6`
   - updater 플러그인: 미설치
   - 서명 키: 없음
   - release.yml: 기본 workflow만 있음

3. **구현 계획 문서 작성** (`docs/auto-update/`)
   - `README.md` - 개요 및 전체 계획
   - `01-setup.md` - 서명 키 생성, 의존성 설치
   - `02-configuration.md` - tauri.conf.json, capabilities, lib.rs 설정
   - `03-github-actions.md` - release.yml 수정, 시크릿 등록
   - `04-frontend.md` - 업데이트 확인 UI 구현

### 미완료 작업

- [ ] 서명 키 생성 (`bun tauri signer generate`)
- [ ] Rust 의존성 추가 (`tauri-plugin-updater`, `tauri-plugin-process`)
- [ ] 프론트엔드 의존성 추가
- [ ] `lib.rs`에 플러그인 등록
- [ ] `tauri.conf.json`에 updater 설정 추가
- [ ] `capabilities/default.json`에 권한 추가
- [ ] `release.yml`에 서명 환경변수 추가
- [ ] GitHub Secrets 등록
- [ ] 프론트엔드 업데이트 UI 구현
- [ ] 테스트 릴리스로 검증

## What Worked

1. **Context7 MCP를 통한 최신 문서 조회**
   - Tauri v2 공식 문서에서 정확한 설정 방법 확보

2. **tauri-action 분석**
   - `includeUpdaterJson: true` 옵션으로 `latest.json` 자동 생성 가능 확인

## What Didn't Work

- 특별히 실패한 접근 없음 (아직 구현 시작 전)

## Next Steps

### 1단계: 기반 설정 (먼저 해야 함)

```bash
# 서명 키 생성
bun tauri signer generate -- -w ~/.tauri/svg2tsx.key

# Rust 의존성 추가
cd src-tauri && cargo add tauri-plugin-updater tauri-plugin-process

# 프론트엔드 의존성 추가
bun add @tauri-apps/plugin-updater @tauri-apps/plugin-process
```

### 2단계: 설정 파일 수정

- `src-tauri/src/lib.rs` - 플러그인 등록
- `src-tauri/tauri.conf.json` - updater 설정 (공개키 필요)
- `src-tauri/capabilities/default.json` - 권한 추가

### 3단계: GitHub 설정

- Repository Secrets에 `TAURI_SIGNING_PRIVATE_KEY`, `TAURI_SIGNING_PRIVATE_KEY_PASSWORD` 등록
- `.github/workflows/release.yml`에 환경변수 및 `includeUpdaterJson: true` 추가

### 4단계: 프론트엔드 UI

- `src/app/hooks/useAutoUpdate.ts` 훅 구현
- 업데이트 알림 배너/다이얼로그 구현

## Key Files

| 파일 | 역할 |
|------|------|
| `docs/auto-update/` | 구현 계획 문서 (상세 가이드) |
| `src-tauri/tauri.conf.json` | 앱 설정, updater endpoints |
| `src-tauri/src/lib.rs` | Rust 진입점, 플러그인 등록 |
| `src-tauri/capabilities/default.json` | 권한 설정 |
| `.github/workflows/release.yml` | 릴리스 워크플로우 |

## References

- [Tauri Updater Plugin 공식 문서](https://v2.tauri.app/plugin/updater/)
- [Tauri GitHub Action](https://github.com/tauri-apps/tauri-action)
- [GitHub + Tauri 자동 업데이트 가이드](https://thatgurjot.com/til/tauri-auto-updater/)
