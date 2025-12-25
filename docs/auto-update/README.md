# Tauri v2 자동 업데이트 구현 계획

## 개요

SVG2TSX 앱에 Tauri v2 자동 업데이트 기능을 추가하여, 사용자가 새 버전을 자동으로 받을 수 있도록 한다.

## 아키텍처

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   GitHub        │     │   GitHub         │     │   사용자 앱     │
│   Actions       │────▶│   Releases       │◀────│   (Updater)     │
│   (빌드+서명)   │     │   (latest.json)  │     │                 │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

### 동작 흐름

1. **릴리스 시**: GitHub Actions가 빌드 → 서명 → `latest.json` 생성 → Release 업로드
2. **앱 실행 시**: `latest.json` 확인 → 새 버전 발견 → 다운로드 → 서명 검증 → 설치

## 현재 상태 분석

| 항목 | 현재 상태 | 필요 작업 |
|------|----------|----------|
| 앱 버전 | `0.1.6` | ✓ |
| `tauri-plugin-updater` | ❌ 미설치 | Cargo.toml에 추가 |
| `tauri-plugin-process` | ❌ 미설치 | 재시작용 추가 |
| 서명 키 | ❌ 없음 | 생성 후 시크릿 등록 |
| `tauri.conf.json` | 기본 설정 | updater 설정 추가 |
| `capabilities` | 기본 권한 | updater 권한 추가 |
| `release.yml` | 기본 workflow | 서명 환경변수 추가 |
| 프론트엔드 | 없음 | 업데이트 UI 추가 |

## 구현 단계

### Phase 1: 기반 설정
- [01-setup.md](./01-setup.md) - 서명 키 생성, 의존성 설치

### Phase 2: 설정 파일 수정
- [02-configuration.md](./02-configuration.md) - tauri.conf.json, capabilities, lib.rs

### Phase 3: CI/CD 설정
- [03-github-actions.md](./03-github-actions.md) - release.yml 수정, 시크릿 등록

### Phase 4: 프론트엔드 UI
- [04-frontend.md](./04-frontend.md) - 업데이트 확인 UI 구현

## 보안 고려사항

1. **개인키 보안**: GitHub Secrets에만 저장, 로컬 파일은 `.gitignore`에 추가
2. **서명 검증**: 모든 업데이트는 공개키로 검증됨 (비활성화 불가)
3. **HTTPS 강제**: 프로덕션에서 TLS 필수

## 예상 작업량

- Phase 1: 10분
- Phase 2: 15분
- Phase 3: 10분
- Phase 4: 30분 (UI 복잡도에 따라)

## 참고 자료

- [Tauri Updater Plugin 공식 문서](https://v2.tauri.app/plugin/updater/)
- [Tauri GitHub Action](https://github.com/tauri-apps/tauri-action)
- [GitHub + Tauri 자동 업데이트 가이드](https://thatgurjot.com/til/tauri-auto-updater/)
