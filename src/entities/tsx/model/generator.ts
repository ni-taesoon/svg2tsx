/**
 * TSX Generator
 *
 * SVG AST를 TSX 코드로 변환
 */

import type { SvgAst, SvgNode, SvgAttribute } from '@/entities/svg/model/types';
import type { GeneratorOptions } from './types';
import { getTemplate } from './templates';

/**
 * 기본 옵션
 */
const DEFAULT_OPTIONS: Required<GeneratorOptions> = {
  componentName: 'Icon',
  typescript: true,
  spreadProps: true,
  useMemo: false,
  useForwardRef: false,
};

/**
 * SVG AST를 TSX 코드로 변환
 */
export function generateTsx(ast: SvgAst, options: GeneratorOptions = {}): string {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };

  // SVG 내용 생성
  const svgContent = nodeToJsx(ast.root, mergedOptions, 0);

  // 템플릿에 SVG 내용 삽입
  const code = getTemplate({
    ...mergedOptions,
    svgContent,
  });

  return code;
}

/**
 * 노드를 JSX로 변환
 */
function nodeToJsx(node: SvgNode, options: Required<GeneratorOptions>, depth: number): string {
  const indent = '  '.repeat(depth + 2); // 컴포넌트 내부의 들여쓰기

  // 텍스트 노드
  if (node.type === 'text') {
    return node.textContent || '';
  }

  // 요소 노드
  const tagName = node.tagName;
  const attributes = transformAttributes(node.attributes, options, tagName);
  const hasChildren = node.children.length > 0;

  // 자기 닫힘 태그
  if (!hasChildren) {
    if (attributes) {
      return `<${tagName} ${attributes} />`;
    }
    return `<${tagName} />`;
  }

  // 여는 태그와 닫는 태그
  const openTag = attributes ? `<${tagName} ${attributes}>` : `<${tagName}>`;
  const closeTag = `</${tagName}>`;

  // 자식 노드 변환
  const childrenJsx = node.children
    .map((child) => {
      if (child.type === 'text') {
        return child.textContent || '';
      }
      return `\n${indent}  ${nodeToJsx(child, options, depth + 1)}`;
    })
    .join('');

  // 텍스트만 있는 경우
  if (node.children.length === 1 && node.children[0].type === 'text') {
    return `${openTag}${childrenJsx}${closeTag}`;
  }

  // 요소가 있는 경우
  return `${openTag}${childrenJsx}\n${indent}${closeTag}`;
}

/**
 * 속성을 JSX 형식으로 변환
 */
function transformAttributes(
  attributes: SvgAttribute[],
  options: Required<GeneratorOptions>,
  tagName: string
): string {
  const transformed: string[] = [];

  for (const attr of attributes) {
    const { name, value } = attr;

    // xmlns 속성은 제외
    if (name === 'xmlns' || name.startsWith('xmlns:')) {
      continue;
    }

    // 빈 style 속성은 제외
    if (name === 'style' && !value.trim()) {
      continue;
    }

    // 속성 이름 변환
    let jsxName = transformAttributeName(name);

    // 속성 값 변환
    const jsxValue = transformAttributeValue(jsxName, value);

    // ref 추가 (forwardRef 사용 시 svg 태그에만)
    if (tagName === 'svg' && options.useForwardRef && options.spreadProps) {
      if (transformed.length === 0) {
        transformed.push('ref={ref}');
      }
    }

    // props spread 추가 (svg 태그에만)
    if (tagName === 'svg' && options.spreadProps) {
      if (transformed.length === 0 && !options.useForwardRef) {
        transformed.push('...props');
      } else if (options.useForwardRef && transformed.length === 1) {
        transformed.push('...props');
      }
    }

    transformed.push(`${jsxName}=${jsxValue}`);
  }

  // svg 태그에 ref/props만 추가 (다른 속성이 없는 경우)
  if (tagName === 'svg' && options.spreadProps && transformed.length === 0) {
    if (options.useForwardRef) {
      transformed.push('ref={ref}');
    }
    transformed.push('...props');
  }

  return transformed.join(' ');
}

/**
 * 속성 이름 변환
 */
function transformAttributeName(name: string): string {
  // class → className
  if (name === 'class') {
    return 'className';
  }

  // xlink:href → href
  if (name === 'xlink:href') {
    return 'href';
  }

  // kebab-case → camelCase
  return kebabToCamel(name);
}

/**
 * 속성 값 변환
 */
function transformAttributeValue(name: string, value: string): string {
  // style 속성은 객체로 변환
  if (name === 'style') {
    return transformStyleValue(value);
  }

  // 숫자 값은 중괄호로
  if (isNumericValue(value)) {
    return `{${value}}`;
  }

  // 문자열 값은 따옴표로
  return `"${value}"`;
}

/**
 * style 문자열을 객체로 변환
 */
function transformStyleValue(styleString: string): string {
  const trimmed = styleString.trim();
  if (!trimmed) {
    return '{{}}';
  }

  const styles: string[] = [];
  const declarations = trimmed.split(';').filter((s) => s.trim());

  for (const decl of declarations) {
    const [prop, val] = decl.split(':').map((s) => s.trim());
    if (!prop || !val) continue;

    const camelProp = kebabToCamel(prop);
    styles.push(`${camelProp}: "${val}"`);
  }

  return `{{ ${styles.join(', ')} }}`;
}

/**
 * kebab-case를 camelCase로 변환
 */
function kebabToCamel(str: string): string {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * 숫자 값인지 확인
 */
function isNumericValue(value: string): boolean {
  // 숫자로만 구성된 문자열 (소수점 포함)
  return /^-?\d+(\.\d+)?$/.test(value);
}
