/**
 * SVG Entity Public API
 *
 * @packageDocumentation
 */

// Types (공유 인터페이스 - Task03에서 사용)
export type {
  SvgAst,
  SvgNode,
  SvgAttribute,
  SvgMetadata,
  SvgNodeType,
  OptimizerOptions,
} from './model/types';

export { SvgParseError } from './model/types';

// Functions
export { parseSvg } from './model/parser';
export { optimizeSvgAst } from './model/optimizer';
