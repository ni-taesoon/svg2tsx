/**
 * 클립보드 유틸리티
 *
 * 브라우저 Clipboard API 래퍼
 */

/**
 * 텍스트를 클립보드에 복사
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};
