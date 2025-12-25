# Task 04: 파일 입출력 및 Tauri 연동

**담당 영역**: 파일 시스템, 드래그 앤 드롭, Tauri Backend 연동
**우선순위**: P1 (중요)
**예상 기간**: 2일
**선행 작업**: Task 01 (프로젝트 설정), Task 03 (기본 UI 레이아웃)

---

## 📋 목차

1. [Tauri 플러그인 설치 및 설정](#1-tauri-플러그인-설치-및-설정)
2. [Rust 명령어 구현](#2-rust-명령어-구현)
3. [Frontend API 래퍼 구현](#3-frontend-api-래퍼-구현)
4. [드래그 앤 드롭 구현](#4-드래그-앤-드롭-구현)
5. [파일 다이얼로그 UI 연동](#5-파일-다이얼로그-ui-연동)
6. [SVG 미리보기 구현](#6-svg-미리보기-구현)
7. [보안 고려사항](#7-보안-고려사항)
8. [테스트 가이드](#8-테스트-가이드)

---

## 1. Tauri 플러그인 설치 및 설정

### 1.1 필요한 플러그인 목록

```bash
# Frontend 의존성 추가
pnpm add @tauri-apps/plugin-dialog
pnpm add @tauri-apps/plugin-fs
pnpm add @tauri-apps/plugin-clipboard-manager
```

### 1.2 Cargo.toml 설정

**파일 위치**: `src-tauri/Cargo.toml`

```toml
[dependencies]
tauri = { version = "2.1.0", features = ["protocol-asset"] }
tauri-plugin-dialog = "2.0.0"
tauri-plugin-fs = "2.0.0"
tauri-plugin-clipboard-manager = "2.0.0"
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
```

**체크리스트**:
- [ ] `Cargo.toml`에 3개 플러그인 추가
- [ ] `serde`, `serde_json` 의존성 추가 (직렬화용)
- [ ] `cargo build` 성공 확인

### 1.3 tauri.conf.json 권한 설정

**파일 위치**: `src-tauri/tauri.conf.json`

```json
{
  "permissions": [
    "dialog:default",
    "fs:allow-read-file",
    "fs:allow-write-file",
    "clipboard-manager:default"
  ],
  "allowlist": {
    "fs": {
      "scope": ["$DOCUMENT/*", "$DESKTOP/*", "$DOWNLOAD/*"]
    },
    "dialog": {
      "open": true,
      "save": true
    }
  }
}
```

**체크리스트**:
- [ ] 파일 시스템 읽기/쓰기 권한 추가
- [ ] 다이얼로그 권한 추가
- [ ] 클립보드 권한 추가
- [ ] 파일 스코프 제한 (보안): 문서, 데스크톱, 다운로드 폴더만 허용

---

## 2. Rust 명령어 구현

### 2.1 프로젝트 구조

```
src-tauri/
├── src/
│   ├── commands/
│   │   ├── mod.rs          # 명령어 모듈 진입점
│   │   ├── file_io.rs      # 파일 입출력 명령어
│   │   └── dialog.rs       # 다이얼로그 명령어
│   ├── lib.rs              # Tauri 앱 초기화
│   └── main.rs             # 엔트리포인트
└── Cargo.toml
```

### 2.2 파일 읽기 명령어 (read_svg_file)

**파일 위치**: `src-tauri/src/commands/file_io.rs`

```rust
use tauri_plugin_fs::FsExt;

/// SVG 파일 내용을 읽어오는 명령어
#[tauri::command]
pub async fn read_svg_file(
    app: tauri::AppHandle,
    path: String,
) -> Result<String, String> {
    // 파일 확장자 검증
    if !path.to_lowercase().ends_with(".svg") {
        return Err("Only SVG files are allowed".to_string());
    }

    // 파일 읽기 시도
    let fs = app.fs();
    let content = fs
        .read_to_string(&path)
        .map_err(|e| format!("Failed to read file: {}", e))?;

    // UTF-8 검증 (이미 String이므로 자동 검증됨)
    Ok(content)
}
```

**체크리스트**:
- [ ] `.svg` 확장자 검증 로직 구현
- [ ] 파일 읽기 에러 핸들링 (`map_err`)
- [ ] UTF-8 인코딩 검증 (Rust String이 보장)
- [ ] `async` 함수로 구현 (비동기 I/O)

### 2.3 파일 저장 명령어 (save_tsx_file)

```rust
use tauri_plugin_fs::FsExt;

/// TSX 파일로 저장하는 명령어
#[tauri::command]
pub async fn save_tsx_file(
    app: tauri::AppHandle,
    path: String,
    content: String,
) -> Result<(), String> {
    // 파일 확장자 검증
    if !path.to_lowercase().ends_with(".tsx") {
        return Err("File must have .tsx extension".to_string());
    }

    // 파일 쓰기
    let fs = app.fs();
    fs.write(&path, content.as_bytes())
        .map_err(|e| format!("Failed to write file: {}", e))?;

    Ok(())
}
```

**체크리스트**:
- [ ] `.tsx` 확장자 검증
- [ ] 파일 쓰기 권한 에러 핸들링
- [ ] 디스크 공간 부족 등의 에러 처리
- [ ] 기존 파일 덮어쓰기 경고 (Frontend에서 처리)

### 2.4 파일 열기 다이얼로그 (open_file_dialog)

**파일 위치**: `src-tauri/src/commands/dialog.rs`

```rust
use tauri_plugin_dialog::{DialogExt, FileDialogBuilder};

/// 파일 선택 다이얼로그를 열고 경로를 반환
#[tauri::command]
pub async fn open_file_dialog(app: tauri::AppHandle) -> Result<Option<String>, String> {
    let file_path = app
        .dialog()
        .file()
        .add_filter("SVG Files", &["svg"])
        .blocking_pick_file();

    Ok(file_path.map(|path| path.path().to_string_lossy().to_string()))
}
```

**체크리스트**:
- [ ] `.svg` 파일 필터 적용
- [ ] 사용자가 취소한 경우 `None` 반환
- [ ] 경로를 String으로 변환 (`to_string_lossy`)
- [ ] 멀티 파일 선택은 추후 확장 가능하도록 주석 추가

### 2.5 파일 저장 다이얼로그 (save_file_dialog)

```rust
use tauri_plugin_dialog::{DialogExt, FileDialogBuilder};

/// 저장 위치 선택 다이얼로그를 열고 경로를 반환
#[tauri::command]
pub async fn save_file_dialog(
    app: tauri::AppHandle,
    default_name: String,
) -> Result<Option<String>, String> {
    let file_path = app
        .dialog()
        .file()
        .add_filter("TypeScript React", &["tsx"])
        .set_file_name(&default_name)
        .blocking_save_file();

    Ok(file_path.map(|path| path.path().to_string_lossy().to_string()))
}
```

**체크리스트**:
- [ ] 기본 파일명 설정 (`default_name` 파라미터 사용)
- [ ] `.tsx` 파일 필터 적용
- [ ] 사용자가 취소한 경우 `None` 반환
- [ ] 기존 파일명 충돌 시 OS 기본 경고 다이얼로그 표시됨

### 2.6 명령어 등록

**파일 위치**: `src-tauri/src/lib.rs`

```rust
mod commands;

use commands::{file_io, dialog};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .invoke_handler(tauri::generate_handler![
            file_io::read_svg_file,
            file_io::save_tsx_file,
            dialog::open_file_dialog,
            dialog::save_file_dialog,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

**체크리스트**:
- [ ] 3개 플러그인 초기화 (`init()`)
- [ ] 4개 명령어 핸들러 등록
- [ ] `commands` 모듈 구조 정리
- [ ] `cargo build` 성공 확인

---

## 3. Frontend API 래퍼 구현

### 3.1 파일 시스템 API 래퍼

**파일 위치**: `src/shared/api/file-system.ts`

```typescript
import { invoke } from '@tauri-apps/api/core';

/**
 * SVG 파일을 읽어오는 함수
 * @param path 파일 경로
 * @returns SVG 파일 내용 (문자열)
 * @throws 파일 읽기 실패 시 에러
 */
export async function readSvgFile(path: string): Promise<string> {
  try {
    return await invoke<string>('read_svg_file', { path });
  } catch (error) {
    throw new Error(`Failed to read SVG file: ${error}`);
  }
}

/**
 * TSX 파일로 저장하는 함수
 * @param path 저장할 파일 경로
 * @param content TSX 코드 내용
 * @throws 파일 쓰기 실패 시 에러
 */
export async function saveTsxFile(
  path: string,
  content: string
): Promise<void> {
  try {
    await invoke<void>('save_tsx_file', { path, content });
  } catch (error) {
    throw new Error(`Failed to save TSX file: ${error}`);
  }
}

/**
 * 파일 선택 다이얼로그를 엽니다
 * @returns 선택된 파일 경로 (취소 시 null)
 */
export async function openFileDialog(): Promise<string | null> {
  return await invoke<string | null>('open_file_dialog');
}

/**
 * 저장 위치 선택 다이얼로그를 엽니다
 * @param defaultName 기본 파일명 (예: "Icon.tsx")
 * @returns 선택된 저장 경로 (취소 시 null)
 */
export async function saveFileDialog(
  defaultName: string
): Promise<string | null> {
  return await invoke<string | null>('save_file_dialog', { defaultName });
}
```

**체크리스트**:
- [ ] TypeScript 타입 정의 (`Promise<string>`, `Promise<void>`)
- [ ] JSDoc 주석 추가 (함수 용도, 파라미터, 반환값)
- [ ] 에러 핸들링 (`try-catch`)
- [ ] `index.ts`에서 Public API로 export

### 3.2 클립보드 API 래퍼

**파일 위치**: `src/shared/api/clipboard.ts`

```typescript
import { writeText } from '@tauri-apps/plugin-clipboard-manager';

/**
 * 텍스트를 클립보드에 복사
 * @param text 복사할 텍스트
 */
export async function copyToClipboard(text: string): Promise<void> {
  try {
    await writeText(text);
  } catch (error) {
    throw new Error(`Failed to copy to clipboard: ${error}`);
  }
}
```

**체크리스트**:
- [ ] `@tauri-apps/plugin-clipboard-manager` 사용
- [ ] 에러 핸들링
- [ ] `index.ts`에서 Public API로 export

### 3.3 Public API 노출

**파일 위치**: `src/shared/api/index.ts`

```typescript
export {
  readSvgFile,
  saveTsxFile,
  openFileDialog,
  saveFileDialog,
} from './file-system';

export { copyToClipboard } from './clipboard';
```

---

## 4. 드래그 앤 드롭 구현

### 4.1 Drop Zone 컴포넌트

**파일 위치**: `src/widgets/svg-input-panel/ui/DropZone.tsx`

```typescript
import { useState } from 'react';
import { readSvgFile } from '@/shared/api';

interface DropZoneProps {
  onSvgLoaded: (svgContent: string, fileName: string) => void;
}

export function DropZone({ onSvgLoaded }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);

    // Tauri에서는 e.dataTransfer.files 대신 경로를 사용
    const files = Array.from(e.dataTransfer.files);
    const svgFile = files.find((file) => file.name.endsWith('.svg'));

    if (!svgFile) {
      setError('Please drop a valid SVG file');
      return;
    }

    try {
      // File 객체에서 경로 추출 (Tauri v2에서는 file.path 사용)
      const path = (svgFile as any).path;
      if (!path) {
        throw new Error('File path not available');
      }

      const content = await readSvgFile(path);
      onSvgLoaded(content, svgFile.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        border-2 border-dashed rounded-lg p-12 text-center transition-colors
        ${isDragging ? 'border-primary bg-primary/10' : 'border-muted'}
      `}
    >
      <svg
        className="mx-auto h-12 w-12 text-muted-foreground"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
        />
      </svg>
      <p className="mt-4 text-sm text-muted-foreground">
        Drop SVG file here
      </p>
      {error && (
        <p className="mt-2 text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
```

**체크리스트**:
- [ ] `onDragOver`, `onDragLeave`, `onDrop` 이벤트 핸들러 구현
- [ ] `isDragging` 상태로 시각적 피드백 제공
- [ ] `.svg` 파일 타입 검증
- [ ] Tauri 파일 경로 추출 (`file.path`)
- [ ] 에러 상태 UI 표시
- [ ] `readSvgFile` API 호출

### 4.2 파일 검증 유틸리티

**파일 위치**: `src/shared/lib/file-validator.ts`

```typescript
/**
 * SVG 파일 검증
 * @param content 파일 내용
 * @returns 유효한 SVG이면 true
 */
export function isValidSvg(content: string): boolean {
  // 기본 SVG 태그 검사
  const svgTagRegex = /<svg[\s\S]*?>/i;
  return svgTagRegex.test(content);
}

/**
 * 파일 크기 검증 (최대 1MB)
 * @param content 파일 내용
 * @returns 크기가 적절하면 true
 */
export function isFileSizeValid(content: string): boolean {
  const maxSizeBytes = 1024 * 1024; // 1MB
  const sizeBytes = new Blob([content]).size;
  return sizeBytes <= maxSizeBytes;
}
```

**체크리스트**:
- [ ] SVG 태그 정규식 검증
- [ ] 파일 크기 제한 (1MB)
- [ ] XSS 방지를 위한 추가 검증 (섹션 7 참조)

---

## 5. 파일 다이얼로그 UI 연동

### 5.1 파일 선택 버튼

**파일 위치**: `src/widgets/svg-input-panel/ui/FileSelectButton.tsx`

```typescript
import { Button } from '@/shared/ui/button';
import { openFileDialog, readSvgFile } from '@/shared/api';
import { useState } from 'react';

interface FileSelectButtonProps {
  onFileSelected: (content: string, fileName: string) => void;
}

export function FileSelectButton({ onFileSelected }: FileSelectButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const filePath = await openFileDialog();
      if (!filePath) {
        // 사용자가 취소함
        setIsLoading(false);
        return;
      }

      const content = await readSvgFile(filePath);
      const fileName = filePath.split('/').pop() || 'unknown.svg';

      onFileSelected(content, fileName);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Button
        onClick={handleClick}
        disabled={isLoading}
        variant="outline"
        className="w-full"
      >
        {isLoading ? 'Loading...' : 'Select SVG File'}
      </Button>
      {error && (
        <p className="mt-2 text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
```

**체크리스트**:
- [ ] `openFileDialog` API 호출
- [ ] 로딩 상태 UI (`isLoading`)
- [ ] 사용자 취소 처리 (`filePath === null`)
- [ ] 파일명 추출 (`split('/').pop()`)
- [ ] 에러 핸들링 및 UI 표시

### 5.2 파일 저장 기능

**파일 위치**: `src/features/save-file/ui/SaveButton.tsx`

```typescript
import { Button } from '@/shared/ui/button';
import { saveFileDialog, saveTsxFile } from '@/shared/api';
import { useState } from 'react';
import { Download } from 'lucide-react';

interface SaveButtonProps {
  tsxContent: string;
  defaultFileName?: string;
}

export function SaveButton({
  tsxContent,
  defaultFileName = 'Icon.tsx'
}: SaveButtonProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const savePath = await saveFileDialog(defaultFileName);
      if (!savePath) {
        // 사용자가 취소함
        setIsSaving(false);
        return;
      }

      await saveTsxFile(savePath, tsxContent);
      setSuccess(true);

      // 성공 메시지 3초 후 자동 숨김
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save file');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <Button
        onClick={handleSave}
        disabled={isSaving || !tsxContent}
        className="w-full"
      >
        <Download className="mr-2 h-4 w-4" />
        {isSaving ? 'Saving...' : 'Save as .tsx'}
      </Button>
      {success && (
        <p className="mt-2 text-sm text-green-600">File saved successfully!</p>
      )}
      {error && (
        <p className="mt-2 text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
```

**체크리스트**:
- [ ] `saveFileDialog` API 호출
- [ ] 저장 중 로딩 상태 표시
- [ ] 빈 컨텐츠 저장 방지 (`disabled={!tsxContent}`)
- [ ] 성공/실패 피드백 UI
- [ ] lucide-react 아이콘 사용

---

## 6. SVG 미리보기 구현

### 6.1 Preview 탭 컴포넌트

**파일 위치**: `src/widgets/svg-input-panel/ui/SvgPreview.tsx`

```typescript
import { useMemo } from 'react';
import DOMPurify from 'dompurify';

interface SvgPreviewProps {
  svgContent: string;
}

export function SvgPreview({ svgContent }: SvgPreviewProps) {
  // SVG 내용을 sanitize (XSS 방지)
  const sanitizedSvg = useMemo(() => {
    if (!svgContent) return '';

    return DOMPurify.sanitize(svgContent, {
      USE_PROFILES: { svg: true, svgFilters: true },
      ADD_TAGS: ['use'], // SVG <use> 태그 허용
    });
  }, [svgContent]);

  if (!svgContent) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        <p>No SVG loaded</p>
      </div>
    );
  }

  return (
    <div className="flex h-full items-center justify-center bg-muted/20 p-8">
      <div
        className="max-h-full max-w-full"
        dangerouslySetInnerHTML={{ __html: sanitizedSvg }}
      />
    </div>
  );
}
```

**체크리스트**:
- [ ] `dompurify` 설치 (`pnpm add dompurify @types/dompurify`)
- [ ] `DOMPurify.sanitize` 사용하여 XSS 방지
- [ ] SVG 전용 프로필 사용 (`USE_PROFILES: { svg: true }`)
- [ ] `useMemo`로 성능 최적화 (불필요한 재계산 방지)
- [ ] 빈 상태 UI 처리
- [ ] `dangerouslySetInnerHTML` 사용 (sanitize 후이므로 안전)

### 6.2 의존성 설치

```bash
pnpm add dompurify
pnpm add -D @types/dompurify
```

---

## 7. 보안 고려사항

### 7.1 XSS (Cross-Site Scripting) 방지

**위험 요소**:
- 사용자가 업로드한 SVG에 악성 스크립트가 포함될 수 있음
- `<script>` 태그, `on*` 이벤트 핸들러 등

**대응 방법**:
1. **DOMPurify 사용** (섹션 6.1 참조)
2. **Content Security Policy (CSP) 설정**

**파일 위치**: `index.html`

```html
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;"
/>
```

**체크리스트**:
- [ ] DOMPurify로 SVG sanitize
- [ ] CSP 헤더 설정
- [ ] `<script>` 태그 필터링 확인
- [ ] 이벤트 핸들러 (`onclick` 등) 제거 확인

### 7.2 파일 시스템 접근 제한

**파일 위치**: `src-tauri/tauri.conf.json`

```json
{
  "allowlist": {
    "fs": {
      "scope": ["$DOCUMENT/*", "$DESKTOP/*", "$DOWNLOAD/*"]
    }
  }
}
```

**체크리스트**:
- [ ] 시스템 폴더 접근 차단 (`$HOME`, `/etc` 등)
- [ ] 사용자 문서 폴더만 허용
- [ ] 경로 순회 공격 방지 (Tauri가 자동 처리)

### 7.3 파일 크기 제한

```typescript
// src/shared/lib/file-validator.ts
export const MAX_FILE_SIZE = 1024 * 1024; // 1MB

export function validateFileSize(content: string): boolean {
  const sizeBytes = new Blob([content]).size;
  if (sizeBytes > MAX_FILE_SIZE) {
    throw new Error('File size exceeds 1MB limit');
  }
  return true;
}
```

**체크리스트**:
- [ ] 최대 1MB 제한 설정
- [ ] 초과 시 명확한 에러 메시지
- [ ] 메모리 부족 방지

---

## 8. 테스트 가이드

### 8.1 Rust 명령어 유닛 테스트

**파일 위치**: `src-tauri/src/commands/file_io.rs`

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_read_svg_file_rejects_non_svg() {
        // 테스트용 AppHandle 모킹 필요 (실제 구현 시)
        let result = read_svg_file(app_handle, "test.txt".to_string()).await;
        assert!(result.is_err());
        assert!(result.unwrap_err().contains("Only SVG files"));
    }

    #[tokio::test]
    async fn test_save_tsx_file_rejects_non_tsx() {
        let result = save_tsx_file(
            app_handle,
            "test.js".to_string(),
            "content".to_string(),
        )
        .await;
        assert!(result.is_err());
    }
}
```

**체크리스트**:
- [ ] 파일 확장자 검증 테스트
- [ ] 에러 메시지 검증 테스트
- [ ] `cargo test` 통과 확인

### 8.2 Frontend API 래퍼 테스트

**파일 위치**: `src/shared/api/__tests__/file-system.test.ts`

```typescript
import { describe, it, expect, vi } from 'vitest';
import { readSvgFile, saveTsxFile } from '../file-system';
import { invoke } from '@tauri-apps/api/core';

// Tauri invoke 함수 모킹
vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn(),
}));

describe('file-system API', () => {
  it('should call read_svg_file command', async () => {
    const mockContent = '<svg></svg>';
    (invoke as any).mockResolvedValue(mockContent);

    const result = await readSvgFile('/path/to/file.svg');

    expect(invoke).toHaveBeenCalledWith('read_svg_file', {
      path: '/path/to/file.svg',
    });
    expect(result).toBe(mockContent);
  });

  it('should throw error on read failure', async () => {
    (invoke as any).mockRejectedValue(new Error('File not found'));

    await expect(readSvgFile('/invalid.svg')).rejects.toThrow(
      'Failed to read SVG file'
    );
  });

  it('should call save_tsx_file command', async () => {
    (invoke as any).mockResolvedValue(undefined);

    await saveTsxFile('/path/to/Icon.tsx', 'const Icon = () => <svg />');

    expect(invoke).toHaveBeenCalledWith('save_tsx_file', {
      path: '/path/to/Icon.tsx',
      content: 'const Icon = () => <svg />',
    });
  });
});
```

**체크리스트**:
- [ ] `vi.mock`으로 Tauri invoke 함수 모킹
- [ ] 성공 케이스 테스트
- [ ] 실패 케이스 (에러 처리) 테스트
- [ ] `vitest` 실행 성공 확인

### 8.3 React 컴포넌트 통합 테스트

**파일 위치**: `src/widgets/svg-input-panel/ui/__tests__/DropZone.test.tsx`

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DropZone } from '../DropZone';

describe('DropZone', () => {
  it('should show drag state on dragover', () => {
    const onSvgLoaded = vi.fn();
    const { container } = render(<DropZone onSvgLoaded={onSvgLoaded} />);

    const dropZone = container.firstChild as HTMLElement;
    fireEvent.dragOver(dropZone);

    expect(dropZone).toHaveClass('border-primary');
  });

  it('should show error for non-svg file', async () => {
    const onSvgLoaded = vi.fn();
    render(<DropZone onSvgLoaded={onSvgLoaded} />);

    const dropZone = screen.getByText(/Drop SVG file here/i).parentElement!;

    const file = new File(['content'], 'test.png', { type: 'image/png' });
    fireEvent.drop(dropZone, {
      dataTransfer: { files: [file] },
    });

    expect(await screen.findByText(/Please drop a valid SVG file/i)).toBeInTheDocument();
  });
});
```

**체크리스트**:
- [ ] 드래그 상태 UI 테스트
- [ ] 파일 타입 검증 테스트
- [ ] 에러 메시지 표시 테스트
- [ ] React Testing Library 사용

---

## ✅ 완료 체크리스트

### Rust Backend
- [ ] Cargo.toml에 3개 플러그인 추가
- [ ] tauri.conf.json 권한 설정
- [ ] `read_svg_file` 명령어 구현
- [ ] `save_tsx_file` 명령어 구현
- [ ] `open_file_dialog` 명령어 구현
- [ ] `save_file_dialog` 명령어 구현
- [ ] 명령어 핸들러 등록 (lib.rs)
- [ ] `cargo build` 성공
- [ ] `cargo test` 성공

### Frontend API
- [ ] `shared/api/file-system.ts` 구현
- [ ] `shared/api/clipboard.ts` 구현
- [ ] TypeScript 타입 정의
- [ ] JSDoc 주석 작성
- [ ] Public API export (index.ts)

### UI 컴포넌트
- [ ] DropZone 컴포넌트 구현
- [ ] FileSelectButton 컴포넌트 구현
- [ ] SaveButton 컴포넌트 구현
- [ ] SvgPreview 컴포넌트 구현
- [ ] 드래그 앤 드롭 이벤트 핸들러
- [ ] 파일 타입 검증

### 보안
- [ ] DOMPurify 설치 및 적용
- [ ] CSP 헤더 설정
- [ ] 파일 크기 제한 (1MB)
- [ ] 파일 시스템 스코프 제한
- [ ] XSS 방지 테스트

### 테스트
- [ ] Rust 유닛 테스트 작성
- [ ] Frontend API 테스트 작성
- [ ] React 컴포넌트 테스트 작성
- [ ] 모든 테스트 통과 확인

### 통합
- [ ] Input 탭에 DropZone 통합
- [ ] Input 탭에 FileSelectButton 통합
- [ ] Output 하단에 SaveButton 통합
- [ ] Preview 탭에 SvgPreview 통합
- [ ] 파일 로드 → 미리보기 → 변환 → 저장 플로우 테스트

---

## 📚 참고 자료

### Tauri v2 문서
- [Plugin - Dialog](https://v2.tauri.app/plugin/dialog/)
- [Plugin - File System](https://v2.tauri.app/plugin/file-system/)
- [Plugin - Clipboard](https://v2.tauri.app/plugin/clipboard-manager/)
- [Security Best Practices](https://v2.tauri.app/security/)

### 보안
- [DOMPurify GitHub](https://github.com/cure53/DOMPurify)
- [OWASP XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)

### 테스트
- [Vitest Mocking Guide](https://vitest.dev/guide/mocking.html)
- [React Testing Library - Drag and Drop](https://testing-library.com/docs/example-drag/)

---

**작성일**: 2025-12-25
**버전**: 1.0.0
**담당자**: 주니어 문서 작성자 (Task 04)
