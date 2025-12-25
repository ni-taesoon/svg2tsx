use std::fs;
use std::path::Path;

/// SVG 파일 내용을 읽어오는 명령어
#[tauri::command]
pub async fn read_svg_file(path: String) -> Result<String, String> {
    // 파일 확장자 검증
    if !path.to_lowercase().ends_with(".svg") {
        return Err("Only SVG files are allowed".to_string());
    }

    // 파일 존재 여부 확인
    let path_ref = Path::new(&path);
    if !path_ref.exists() {
        return Err("File not found".to_string());
    }

    // 파일 읽기
    fs::read_to_string(&path).map_err(|e| format!("Failed to read file: {}", e))
}

/// TSX 파일로 저장하는 명령어
#[tauri::command]
pub async fn save_tsx_file(path: String, content: String) -> Result<(), String> {
    // 파일 확장자 검증
    if !path.to_lowercase().ends_with(".tsx") {
        return Err("File must have .tsx extension".to_string());
    }

    // 파일 쓰기
    fs::write(&path, content).map_err(|e| format!("Failed to write file: {}", e))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_read_svg_file_rejects_non_svg() {
        let result = read_svg_file("test.txt".to_string()).await;
        assert!(result.is_err());
        assert!(result.unwrap_err().contains("Only SVG files"));
    }

    #[tokio::test]
    async fn test_read_svg_file_rejects_missing_file() {
        let result = read_svg_file("/nonexistent/path.svg".to_string()).await;
        assert!(result.is_err());
        assert!(result.unwrap_err().contains("File not found"));
    }

    #[tokio::test]
    async fn test_save_tsx_file_rejects_non_tsx() {
        let result = save_tsx_file("test.js".to_string(), "content".to_string()).await;
        assert!(result.is_err());
        assert!(result.unwrap_err().contains(".tsx extension"));
    }
}
