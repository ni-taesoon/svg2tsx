# Phase 3: GitHub Actions 설정

## 3.1 GitHub Secrets 등록

GitHub 저장소 Settings > Secrets and variables > Actions에서 추가:

| Secret 이름 | 값 |
|------------|-----|
| `TAURI_SIGNING_PRIVATE_KEY` | `~/.tauri/svg2tsx.key` 파일 내용 전체 |
| `TAURI_SIGNING_PRIVATE_KEY_PASSWORD` | 키 생성 시 입력한 비밀번호 |

### 개인키 내용 확인

```bash
cat ~/.tauri/svg2tsx.key
```

> ⚠️ 이 내용을 GitHub Secrets에만 저장하고, 절대 코드에 포함시키지 않는다.

## 3.2 release.yml 수정

`.github/workflows/release.yml` 수정:

```yaml
name: Release

on:
  push:
    tags:
      - "v*"

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

env:
  CARGO_TERM_COLOR: always

jobs:
  release:
    name: Release (${{ matrix.platform }})
    permissions:
      contents: write
    strategy:
      fail-fast: false
      matrix:
        include:
          - platform: macos-latest
            target: aarch64-apple-darwin
          - platform: macos-latest
            target: x86_64-apple-darwin
          - platform: ubuntu-22.04
            target: x86_64-unknown-linux-gnu
          - platform: windows-latest
            target: x86_64-pc-windows-msvc

    runs-on: ${{ matrix.platform }}
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Bun
        uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest

      - name: Install Rust
        uses: dtolnay/rust-toolchain@stable
        with:
          targets: ${{ matrix.target }}

      - name: Rust cache
        uses: swatinem/rust-cache@v2
        with:
          workspaces: "./src-tauri -> target"

      - name: Install Linux dependencies
        if: matrix.platform == 'ubuntu-22.04'
        run: |
          sudo apt-get update
          sudo apt-get install -y \
            libwebkit2gtk-4.1-dev \
            libappindicator3-dev \
            librsvg2-dev \
            patchelf

      - name: Install frontend dependencies
        run: bun install

      - name: Build and release
        uses: tauri-apps/tauri-action@v0
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          TAURI_SIGNING_PRIVATE_KEY: ${{ secrets.TAURI_SIGNING_PRIVATE_KEY }}
          TAURI_SIGNING_PRIVATE_KEY_PASSWORD: ${{ secrets.TAURI_SIGNING_PRIVATE_KEY_PASSWORD }}
        with:
          tauriScript: bunx tauri
          tagName: ${{ github.ref_name }}
          releaseName: "svg2tsx ${{ github.ref_name }}"
          releaseBody: |
            SVG2TSX ${{ github.ref_name }} 릴리스

            ## 다운로드
            - **macOS (Apple Silicon)**: `.dmg` (aarch64)
            - **macOS (Intel)**: `.dmg` (x86_64)
            - **Windows**: `.msi` 또는 `.exe`
            - **Linux**: `.deb` 또는 `.AppImage`

            ## 자동 업데이트
            기존 사용자는 앱 내에서 자동으로 업데이트 알림을 받습니다.
          releaseDraft: true
          prerelease: false
          includeUpdaterJson: true
          args: --target ${{ matrix.target }}
```

### 변경 사항

1. **환경 변수 추가**:
   - `TAURI_SIGNING_PRIVATE_KEY`: 빌드 시 서명용
   - `TAURI_SIGNING_PRIVATE_KEY_PASSWORD`: 키 복호화용

2. **tauri-action 옵션 추가**:
   - `includeUpdaterJson: true`: `latest.json` 자동 생성 및 업로드

## 3.3 latest.json 구조

tauri-action이 자동 생성하는 `latest.json` 예시:

```json
{
  "version": "0.2.0",
  "notes": "SVG2TSX v0.2.0 릴리스...",
  "pub_date": "2025-01-15T10:30:00.000Z",
  "platforms": {
    "darwin-aarch64": {
      "signature": "dW50cnVzdGVkIGNvbW1lbnQ6...",
      "url": "https://github.com/.../Svg2Tsx_0.2.0_aarch64.app.tar.gz"
    },
    "darwin-x86_64": {
      "signature": "dW50cnVzdGVkIGNvbW1lbnQ6...",
      "url": "https://github.com/.../Svg2Tsx_0.2.0_x64.app.tar.gz"
    },
    "linux-x86_64": {
      "signature": "dW50cnVzdGVkIGNvbW1lbnQ6...",
      "url": "https://github.com/.../svg2tsx_0.2.0_amd64.AppImage"
    },
    "windows-x86_64": {
      "signature": "dW50cnVzdGVkIGNvbW1lbnQ6...",
      "url": "https://github.com/.../Svg2Tsx_0.2.0_x64-setup.nsis.exe"
    }
  }
}
```

## 완료 체크리스트

- [ ] `TAURI_SIGNING_PRIVATE_KEY` 시크릿 등록
- [ ] `TAURI_SIGNING_PRIVATE_KEY_PASSWORD` 시크릿 등록
- [ ] `release.yml`에 환경 변수 추가
- [ ] `release.yml`에 `includeUpdaterJson: true` 추가
- [ ] 테스트 태그 푸시로 workflow 검증
