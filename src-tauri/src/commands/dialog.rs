use tauri_plugin_dialog::{DialogExt, FilePath};

/// 파일 선택 다이얼로그를 열고 경로를 반환
#[tauri::command]
pub async fn open_file_dialog(app: tauri::AppHandle) -> Result<Option<String>, String> {
    let file_path = app
        .dialog()
        .file()
        .add_filter("SVG Files", &["svg"])
        .blocking_pick_file();

    Ok(file_path.map(|fp| match fp {
        FilePath::Path(path) => path.to_string_lossy().to_string(),
        FilePath::Url(url) => url.to_string(),
    }))
}

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

    Ok(file_path.map(|fp| match fp {
        FilePath::Path(path) => path.to_string_lossy().to_string(),
        FilePath::Url(url) => url.to_string(),
    }))
}
