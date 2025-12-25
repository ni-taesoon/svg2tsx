/**
 * SVG Parser
 *
 * SVG 문자열을 AST로 변환
 */

import type { SvgAst, SvgNode, SvgAttribute, SvgMetadata } from './types';
import { SvgParseError } from './types';

/**
 * SVG 문자열을 AST로 파싱
 */
export function parseSvg(svgString: string): SvgAst {
  // 빈 문자열 검증
  if (!svgString || svgString.trim().length === 0) {
    throw new SvgParseError('SVG 문자열이 비어있습니다');
  }

  // xlink 네임스페이스가 없으면 추가 (jsdom 호환성)
  let processedSvg = svgString;
  if (processedSvg.includes('xlink:') && !processedSvg.includes('xmlns:xlink')) {
    processedSvg = processedSvg.replace(
      /<svg/,
      '<svg xmlns:xlink="http://www.w3.org/1999/xlink"'
    );
  }

  // DOMParser로 파싱
  const parser = new DOMParser();
  const doc = parser.parseFromString(processedSvg, 'image/svg+xml');

  // 파싱 에러 검사
  const parserError = doc.querySelector('parsererror');
  if (parserError) {
    throw new SvgParseError(`SVG 파싱 실패: ${parserError.textContent}`);
  }

  // SVG 루트 요소 찾기
  const svgElement = doc.documentElement;
  if (!svgElement || svgElement.tagName.toLowerCase() !== 'svg') {
    throw new SvgParseError('SVG 루트 요소를 찾을 수 없습니다');
  }

  // 메타데이터 추출
  const metadata = extractMetadata(svgElement);

  // SVG 요소를 AST 노드로 변환
  const root = elementToNode(svgElement);

  return {
    root,
    metadata,
  };
}

/**
 * SVG 메타데이터 추출
 */
function extractMetadata(svgElement: Element): SvgMetadata {
  const metadata: SvgMetadata = {};

  const viewBox = svgElement.getAttribute('viewBox');
  if (viewBox) metadata.viewBox = viewBox;

  const xmlns = svgElement.getAttribute('xmlns');
  if (xmlns) metadata.xmlns = xmlns;

  const width = svgElement.getAttribute('width');
  if (width) metadata.width = width;

  const height = svgElement.getAttribute('height');
  if (height) metadata.height = height;

  return metadata;
}

/**
 * DOM Element를 SvgNode로 변환
 */
function elementToNode(element: Element): SvgNode {
  const tagName = element.tagName.toLowerCase();
  const attributes = extractAttributes(element);
  const children = extractChildren(element);

  return {
    type: 'element',
    tagName,
    attributes,
    children,
  };
}

/**
 * 요소의 속성을 추출
 */
function extractAttributes(element: Element): SvgAttribute[] {
  const attributes: SvgAttribute[] = [];

  for (let i = 0; i < element.attributes.length; i++) {
    const attr = element.attributes[i];
    attributes.push({
      name: attr.name,
      value: attr.value,
    });
  }

  return attributes;
}

/**
 * 요소의 자식 노드를 추출
 */
function extractChildren(element: Element): SvgNode[] {
  const children: SvgNode[] = [];

  for (let i = 0; i < element.childNodes.length; i++) {
    const child = element.childNodes[i];

    if (child.nodeType === Node.ELEMENT_NODE) {
      // 요소 노드
      children.push(elementToNode(child as Element));
    } else if (child.nodeType === Node.TEXT_NODE) {
      // 텍스트 노드 (공백만 있는 것은 제외)
      const textContent = child.textContent?.trim();
      if (textContent) {
        children.push({
          type: 'text',
          tagName: '#text',
          attributes: [],
          children: [],
          textContent,
        });
      }
    }
    // 주석 노드(Node.COMMENT_NODE)는 자동으로 무시됨
  }

  return children;
}
