/**
 * SVG AST (Abstract Syntax Tree) 타입 정의
 *
 * Task02에서 구현, Task03에서 사용하는 공유 인터페이스
 */

/** SVG 속성 */
export interface SvgAttribute {
  name: string;
  value: string;
}

/** SVG 노드 타입 */
export type SvgNodeType = 'element' | 'text';

/** SVG 노드 (재귀적 구조) */
export interface SvgNode {
  type: SvgNodeType;
  tagName: string;
  attributes: SvgAttribute[];
  children: SvgNode[];
  textContent?: string;
}

/** SVG 메타데이터 */
export interface SvgMetadata {
  viewBox?: string;
  xmlns?: string;
  width?: string;
  height?: string;
}

/** SVG AST 루트 */
export interface SvgAst {
  root: SvgNode;
  metadata: SvgMetadata;
}

/** SVG 파싱 에러 */
export class SvgParseError extends Error {
  constructor(message: string, public readonly line?: number, public readonly column?: number) {
    super(message);
    this.name = 'SvgParseError';
  }
}

/** SVG 최적화 옵션 */
export interface OptimizerOptions {
  /** data-* 속성 제거 */
  removeDataAttrs?: boolean;
  /** id 속성 제거 */
  removeIds?: boolean;
  /** 빈 그룹 요소 제거 */
  removeEmptyGroups?: boolean;
  /** 중복 속성 병합 */
  mergeDuplicateAttrs?: boolean;
  /** 기본값 속성 제거 (fill="black", stroke="none") */
  removeDefaultAttrs?: boolean;
  /** transform 최적화 (translate(0,0) 제거 등) */
  optimizeTransforms?: boolean;
}
