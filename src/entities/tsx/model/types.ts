/**
 * TSX 생성기 타입 정의
 *
 * Task02에서 구현, Task03에서 사용하는 공유 인터페이스
 */

/** TSX 생성 옵션 */
export interface GeneratorOptions {
  /** 컴포넌트 이름 (기본값: 'Icon') */
  componentName?: string;
  /** TypeScript 타입 포함 여부 (기본값: true) */
  typescript?: boolean;
  /** props 스프레드 여부 (기본값: true) */
  spreadProps?: boolean;
  /** React.memo 래핑 여부 (기본값: false) */
  useMemo?: boolean;
  /** forwardRef 사용 여부 (기본값: false) */
  useForwardRef?: boolean;
}

/** TSX 출력 결과 */
export interface TsxOutput {
  /** 생성된 TSX 코드 */
  code: string;
  /** 컴포넌트 이름 */
  componentName: string;
}

/** TSX 템플릿 옵션 (내부 사용) */
export interface TemplateOptions extends GeneratorOptions {
  /** SVG 내용 (생성된 JSX) */
  svgContent: string;
}
