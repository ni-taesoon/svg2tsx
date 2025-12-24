# Tauri 2.x 커스텀 타이틀바 구현 가이드

## 개요

Tauri 2.x에서 시스템 타이틀바를 숨기고 커스텀 드래그 영역을 구현하는 방법.

- 시스템 타이틀바 숨김
- macOS traffic lights(닫기/최소화/최대화 버튼) 유지
- 커스텀 드래그 영역 (상단 52px)
- 더블 클릭으로 최대화/복원 토글

---

## 핵심 포인트 (문제 해결)

### 1. 권한 설정이 필수! (가장 중요)

Tauri 2.x에서는 `startDragging()`, `toggleMaximize()` 등의 API를 사용하려면 **반드시 권한을 추가**해야 합니다.

**`src-tauri/capabilities/default.json`**:
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
    "opener:default"
  ]
}
```

> 권한이 없으면 드래그가 동작하지 않습니다!

### 2. CSS `-webkit-app-region: drag`는 동작하지 않음

Tauri 2.x에서 CSS의 `-webkit-app-region: drag`는 macOS에서 제대로 동작하지 않습니다. 대신 JavaScript의 `startDragging()` API를 사용해야 합니다.

---

## 구현 단계

### Step 1: tauri.conf.json 설정

**`src-tauri/tauri.conf.json`**:
```json
{
  "app": {
    "windows": [
      {
        "title": "svg2tsx",
        "width": 800,
        "height": 600,
        "titleBarStyle": "Overlay",
        "hiddenTitle": true
      }
    ]
  }
}
```

| 옵션 | 설명 |
|------|------|
| `titleBarStyle: "Overlay"` | 타이틀바가 콘텐츠 위에 오버레이됨, traffic lights 유지 |
| `hiddenTitle: true` | 타이틀 텍스트 숨김 |

> 주의: `"Overlay"`는 대문자 O로 시작해야 함 (`"overlay"` X)

### Step 2: 권한 추가

**`src-tauri/capabilities/default.json`**:
```json
{
  "permissions": [
    "core:default",
    "core:window:allow-start-dragging",
    "core:window:allow-toggle-maximize",
    "opener:default"
  ]
}
```

### Step 3: React 컴포넌트 구현

**`src/App.tsx`**:
```tsx
import { getCurrentWindow } from "@tauri-apps/api/window";

function App() {
  const handleDragStart = () => {
    getCurrentWindow().startDragging();
  };

  const handleDoubleClick = () => {
    getCurrentWindow().toggleMaximize();
  };

  return (
    <>
      <div
        className="drag-region"
        onMouseDown={handleDragStart}
        onDoubleClick={handleDoubleClick}
      />
      <main className="container">
        {/* 앱 콘텐츠 */}
      </main>
    </>
  );
}
```

### Step 4: CSS 스타일

**`src/App.css`**:
```css
/* 드래그 가능한 상단 영역 */
.drag-region {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 52px;
  -webkit-app-region: drag;
  z-index: 9998;
  padding-left: 80px; /* macOS traffic lights 여백 */
}

/* 메인 컨테이너 상단 여백 */
.container {
  padding-top: 52px;
}
```

---

## 트러블슈팅

### 드래그가 동작하지 않음

1. **권한 확인**: `src-tauri/capabilities/default.json`에 `core:window:allow-start-dragging` 추가했는지 확인
2. **앱 재시작**: 권한 변경 후 앱 재시작 필요 (Rust 코드 재컴파일)

### 더블 클릭 최대화가 동작하지 않음

1. **권한 확인**: `core:window:allow-toggle-maximize` 추가했는지 확인

### titleBarStyle 오류

- `"overlay"` (X) → `"Overlay"` (O)
- 대소문자 주의

---

## 참고 자료

- [Tauri 2 Window Customization](https://v2.tauri.app/learn/window-customization/)
- [Tauri 2 Configuration](https://v2.tauri.app/reference/config/)
- [Known Issue: macOS Sonoma 드래그 문제](https://github.com/tauri-apps/tauri/issues/9503)
