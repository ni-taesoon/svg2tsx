/**
 * SVG Optimizer
 *
 * SVG AST를 최적화하여 불필요한 속성/노드 제거
 */

import type { SvgAst, SvgNode, SvgAttribute, OptimizerOptions } from './types';

/**
 * SVG AST를 최적화
 */
export function optimizeSvgAst(
  ast: SvgAst,
  options: OptimizerOptions = {}
): SvgAst {
  // 원본을 변경하지 않도록 깊은 복사
  const optimized: SvgAst = {
    root: optimizeNode(ast.root, options),
    metadata: { ...ast.metadata },
  };

  return optimized;
}

/**
 * 노드를 재귀적으로 최적화
 */
function optimizeNode(node: SvgNode, options: OptimizerOptions): SvgNode {
  // 속성 최적화
  let attributes = [...node.attributes];

  if (options.removeDataAttrs) {
    attributes = removeDataAttributes(attributes);
  }

  if (options.removeIds) {
    attributes = removeIdAttributes(attributes);
  }

  if (options.removeDefaultAttrs) {
    attributes = removeDefaultAttributes(attributes);
  }

  if (options.optimizeTransforms) {
    attributes = optimizeTransformAttributes(attributes);
  }

  // 자식 노드 재귀 최적화
  let children = node.children.map(child => optimizeNode(child, options));

  // 빈 그룹 제거
  if (options.removeEmptyGroups) {
    children = removeEmptyGroups(children);
  }

  return {
    ...node,
    attributes,
    children,
  };
}

/**
 * data-* 속성 제거
 */
function removeDataAttributes(attributes: SvgAttribute[]): SvgAttribute[] {
  return attributes.filter(attr => !attr.name.startsWith('data-'));
}

/**
 * id 속성 제거
 */
function removeIdAttributes(attributes: SvgAttribute[]): SvgAttribute[] {
  return attributes.filter(attr => attr.name !== 'id');
}

/**
 * 기본값 속성 제거
 */
function removeDefaultAttributes(attributes: SvgAttribute[]): SvgAttribute[] {
  const defaultValues: Record<string, string[]> = {
    fill: ['black', '#000', '#000000'],
    stroke: ['none'],
  };

  return attributes.filter(attr => {
    const defaults = defaultValues[attr.name];
    if (!defaults) return true;
    return !defaults.includes(attr.value.toLowerCase());
  });
}

/**
 * transform 속성 최적화
 */
function optimizeTransformAttributes(attributes: SvgAttribute[]): SvgAttribute[] {
  return attributes.filter(attr => {
    if (attr.name !== 'transform') return true;

    // translate(0,0) 또는 translate(0 0) 제거
    const value = attr.value.trim();
    if (
      value === 'translate(0,0)' ||
      value === 'translate(0 0)' ||
      value === 'translate(0, 0)'
    ) {
      return false;
    }

    return true;
  });
}

/**
 * 빈 그룹 제거
 */
function removeEmptyGroups(children: SvgNode[]): SvgNode[] {
  return children.filter(child => {
    // g 태그가 아니면 유지
    if (child.tagName !== 'g') return true;

    // 자식이 있으면 유지
    if (child.children.length > 0) return true;

    // 빈 그룹은 제거
    return false;
  });
}
