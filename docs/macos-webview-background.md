# macOS 리사이즈 흰색 플래시 해결 (WKWebView 배경 고정)

## 문제

macOS에서 다크 테마 적용 후 창을 천천히 리사이즈하면, WKWebView가 먼저 흰색으로 클리어되고
웹 콘텐츠가 다시 그려지면서 다크로 덮이는 현상이 발생한다.
CSS 배경과 NSWindow 배경만으로는 리사이즈 중 플래시를 막지 못한다.

## 해결 전략

Tauri의 `with_webview`로 WKWebView 핸들을 얻어 아래를 함께 설정한다.

- `NSWindow` 배경색
- `WKWebView`의 `underPageBackgroundColor`
- WKWebView 레이어 배경색
- `drawsBackground = false` (KVC)로 WebView 자체 배경 그리기 비활성화

## 구현 단계

### 1) macOS 의존성 추가

`src-tauri/Cargo.toml`:
```toml
[target."cfg(target_os = \"macos\")".dependencies]
objc2 = "0.6"
objc2-app-kit = { version = "0.3", features = ["objc2-core-foundation", "objc2-core-graphics", "objc2-quartz-core"] }
objc2-core-graphics = "0.3"
objc2-foundation = { version = "0.3", features = ["NSString", "NSValue"] }
objc2-quartz-core = "0.3"
objc2-web-kit = { version = "0.3", features = ["WKWebView"] }
```

### 2) WKWebView 배경 적용 함수

`src-tauri/src/lib.rs`:
```rust
#[cfg(target_os = "macos")]
fn apply_macos_background(window: &tauri::WebviewWindow, r: f64, g: f64, b: f64) {
    let red = r / 255.0;
    let green = g / 255.0;
    let blue = b / 255.0;

    if let Err(err) = window.with_webview(move |webview| {
        unsafe {
            use objc2::msg_send;
            use objc2_app_kit::{NSColor, NSView, NSWindow};
            use objc2_foundation::{ns_string, NSNumber};
            use objc2_web_kit::WKWebView;

            let ns_color = NSColor::colorWithDeviceRed_green_blue_alpha(red, green, blue, 1.0);

            let ns_window_ptr = webview.ns_window();
            if !ns_window_ptr.is_null() {
                let ns_window = &*(ns_window_ptr as *mut NSWindow);
                ns_window.setBackgroundColor(Some(&ns_color));
            }

            let webview_ptr = webview.inner();
            if webview_ptr.is_null() {
                return;
            }

            let wk_webview = &*(webview_ptr as *mut WKWebView);
            wk_webview.setUnderPageBackgroundColor(Some(&ns_color));

            let ns_view = &*(webview_ptr as *mut NSView);
            let no = NSNumber::numberWithBool(false);
            let _: () = msg_send![wk_webview, setValue:&*no forKey:ns_string!("drawsBackground")];

            ns_view.setWantsLayer(true);
            if let Some(layer) = ns_view.layer() {
                let cg_color = ns_color.CGColor();
                layer.setBackgroundColor(Some(&cg_color));
            }
        }
    }) {
        eprintln!("Failed to set macOS webview background: {err}");
    }
}
```

### 3) 커맨드 시그니처 변경

`src-tauri/src/lib.rs`:
```rust
#[tauri::command]
fn set_theme_color(window: tauri::WebviewWindow, r: f64, g: f64, b: f64) {
    #[cfg(target_os = "macos")]
    {
        apply_macos_background(&window, r, g, b);
    }

    #[cfg(not(target_os = "macos"))]
    {
        let _ = (window, r, g, b);
    }
}
```

### 4) 앱 시작 시 기본 배경 적용

`src-tauri/src/lib.rs`:
```rust
.setup(|app| {
    #[cfg(target_os = "macos")]
    {
        if let Some(window) = app.get_webview_window("main") {
            apply_macos_background(&window, 47.0, 47.0, 47.0);
        }
    }
    Ok(())
})
```

## 주의사항

- `with_webview`는 플랫폼 핸들에 접근하므로 Tauri minor 버전을 고정하는 것이 안전하다.
- `drawsBackground`는 KVC 접근이라 macOS 버전에 따라 동작 차이가 있을 수 있다.
- 리사이즈 중 플래시만 해결하려면 위 조합이 가장 안정적으로 동작했다.

## Windows 배경 동기화 (추가)

Windows는 런타임에서 배경색 동기화가 필요하다. 테마 적용 시 `WebviewWindow.setBackgroundColor`
를 호출하면 리사이즈/재그림 중 배경 플래시를 줄일 수 있다.

### 권한 추가

`src-tauri/capabilities/default.json`:
```json
{
  "permissions": [
    "core:window:allow-set-background-color",
    "core:webview:allow-set-webview-background-color"
  ]
}
```

### 프론트엔드 적용

`src/useTheme.ts`:
```ts
const isWindows =
  typeof navigator !== "undefined" && /Win/.test(navigator.platform);
if (isWindows) {
  await getCurrentWebviewWindow().setBackgroundColor([
    color.r,
    color.g,
    color.b,
    255,
  ]);
}
```

## 시작 시 다크 -> 라이트 전환 방지 (윈도우 숨김)

초기 네이티브 배경을 먼저 설정한 뒤, 프론트엔드 테마 적용이 끝나면 창을 표시하도록 한다.
이 방식은 다크 -> 라이트 플래시를 제거하는 데 가장 확실하다.

### 1) 창을 숨김으로 시작

`src-tauri/tauri.conf.json`:
```json
{
  "app": {
    "windows": [
      {
        "visible": false
      }
    ]
  }
}
```

### 2) 테마 적용 후 show 호출

`src/useTheme.ts`:
```ts
const hasShownWindow = useRef(false);

useEffect(() => {
  const applyAndShow = async () => {
    await applyTheme(theme);
    if (!hasShownWindow.current) {
      await getCurrentWindow().show();
      hasShownWindow.current = true;
    }
  };
  applyAndShow();
}, [theme]);
```

### 3) 권한 추가

`src-tauri/capabilities/default.json`:
```json
{
  "permissions": ["core:window:allow-show"]
}
```

## 새 프로젝트 적용 체크리스트

- `src-tauri/Cargo.toml`에 macOS 의존성 추가했는지 확인
- `src-tauri/src/lib.rs`에 `apply_macos_background`와 `set_theme_color` 적용 여부 확인
- `src-tauri/tauri.conf.json`에 `visible: false` 설정 여부 확인
- `src/useTheme.ts`에서 테마 적용 후 `show()` 호출 여부 확인
- `src-tauri/capabilities/default.json`에 `core:window:allow-show` 추가 여부 확인
- Windows 타겟이면 `WebviewWindow.setBackgroundColor` 호출 여부 확인
