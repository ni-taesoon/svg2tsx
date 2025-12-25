export enum ErrorType {
  PARSE_ERROR = 'PARSE_ERROR',
  CONVERSION_ERROR = 'CONVERSION_ERROR',
  FILE_ERROR = 'FILE_ERROR',
  CLIPBOARD_ERROR = 'CLIPBOARD_ERROR',
}

export interface AppError {
  type: ErrorType;
  message: string;
  details?: string;
}

export function getUserFriendlyMessage(error: AppError): string {
  switch (error.type) {
    case ErrorType.PARSE_ERROR:
      return 'SVG 코드를 파싱할 수 없습니다. 올바른 SVG 형식인지 확인해주세요.';
    case ErrorType.CONVERSION_ERROR:
      return 'TSX 변환 중 오류가 발생했습니다.';
    case ErrorType.FILE_ERROR:
      return '파일 처리 중 오류가 발생했습니다.';
    case ErrorType.CLIPBOARD_ERROR:
      return '클립보드 접근 중 오류가 발생했습니다.';
    default:
      return '알 수 없는 오류가 발생했습니다.';
  }
}

export function createAppError(type: ErrorType, message?: string, details?: string): AppError {
  return {
    type,
    message: message ?? getUserFriendlyMessage({ type, message: '' }),
    details,
  };
}
