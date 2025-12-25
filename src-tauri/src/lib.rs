mod commands;

use commands::{dialog, file_io};
use tauri::Manager;

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

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .invoke_handler(tauri::generate_handler![
            set_theme_color,
            file_io::read_svg_file,
            file_io::save_tsx_file,
            dialog::open_file_dialog,
            dialog::save_file_dialog,
        ])
        .setup(|app| {
            // 앱 시작 시 기본 배경색 설정 (다크 테마: #2f2f2f)
            #[cfg(target_os = "macos")]
            {
                if let Some(window) = app.get_webview_window("main") {
                    apply_macos_background(&window, 47.0, 47.0, 47.0);
                }
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
