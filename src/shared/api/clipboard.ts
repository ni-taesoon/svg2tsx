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
