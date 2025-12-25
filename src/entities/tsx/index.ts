/**
 * TSX Entity Public API
 *
 * @packageDocumentation
 */

// Types (공유 인터페이스 - Task03에서 사용)
export type { GeneratorOptions, TsxOutput, TemplateOptions } from './model/types';

// Functions
export { generateTsx } from './model/generator';
export { getTemplate } from './model/templates';
