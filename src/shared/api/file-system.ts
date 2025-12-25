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
