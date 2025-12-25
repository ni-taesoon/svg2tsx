# Phase 2: 설정 파일 수정

## 2.1 lib.rs 수정

`src-tauri/src/lib.rs`에 업데이터 플러그인 등록:

```rust
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        // 추가할 플러그인들
        .plugin(tauri_plugin_process::init())
        .setup(|app| {
            #[cfg(desktop)]
            app.handle().plugin(tauri_plugin_updater::Builder::new().build())?;

            // 기존 setup 코드...
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

> `#[cfg(desktop)]`로 감싸서 모바일 빌드에서는 제외한다.

## 2.2 tauri.conf.json 수정

`src-tauri/tauri.conf.json`에 업데이터 설정 추가:

```json
{
  "$schema": "https://schema.tauri.app/config/2",
  "productName": "Svg2Tsx",
  "version": "0.1.6",
  "identifier": "com.taesoonpark.svg2tsx",
  "build": { ... },
  "app": { ... },
  "bundle": {
    "active": true,
    "targets": "all",
    "createUpdaterArtifacts": true,  // 추가
    "icon": [ ... ],
    ...
  },
  "plugins": {
    "updater": {
      "pubkey": "여기에_공개키_붙여넣기",
      "endpoints": [
        "https://github.com/taesoonpark/svg2tsx/releases/latest/download/latest.json"
      ]
    }
  }
}
```

### 설정 항목 설명

| 항목 | 설명 |
|------|------|
| `createUpdaterArtifacts` | 빌드 시 서명된 업데이트 파일 생성 |
| `pubkey` | 업데이트 검증용 공개키 |
| `endpoints` | `latest.json` 파일 URL (여러 개 가능, 폴백용) |

### endpoints URL 템플릿 변수

동적 URL이 필요하면 다음 변수 사용 가능:
- `{{target}}`: `darwin-aarch64`, `windows-x86_64` 등
- `{{arch}}`: `aarch64`, `x86_64` 등
- `{{current_version}}`: 현재 앱 버전

## 2.3 capabilities 수정

`src-tauri/capabilities/default.json`에 권한 추가:

```json
{
  "$schema": "../gen/schemas/desktop-schema.json",
  "identifier": "default",
  "description": "Capability for the main window",
  "windows": ["main"],
  "permissions": [
    "core:default",
    "core:window:allow-start-dragging",
    "core:window:allow-toggle-maximize",
    "core:window:allow-show",
    "core:window:allow-set-background-color",
    "core:webview:allow-set-webview-background-color",
    "opener:default",
    "fs:default",
    "fs:allow-read-text-file",
    "fs:allow-write-text-file",
    "dialog:default",
    "clipboard-manager:default",
    "updater:default",
    "process:allow-restart"
  ]
}
```

### 권한 설명

| 권한 | 설명 |
|------|------|
| `updater:default` | 업데이트 확인, 다운로드, 설치 모두 허용 |
| `process:allow-restart` | 업데이트 후 앱 재시작 허용 |

## 완료 체크리스트

- [ ] `lib.rs`에 `tauri_plugin_process` 등록
- [ ] `lib.rs`에 `tauri_plugin_updater` 등록 (setup 내부)
- [ ] `tauri.conf.json`에 `createUpdaterArtifacts: true` 추가
- [ ] `tauri.conf.json`에 `plugins.updater` 설정 추가
- [ ] `capabilities/default.json`에 `updater:default` 추가
- [ ] `capabilities/default.json`에 `process:allow-restart` 추가
- [ ] `cargo check`로 컴파일 확인
