/**
 * SVG Parser 테스트
 */

import { describe, it, expect } from 'vitest';
import { parseSvg } from '../model/parser';
import { SvgParseError } from '../model/types';

describe('parseSvg', () => {
  describe('기본 SVG 파싱', () => {
    it('단순한 SVG를 올바르게 파싱해야 함', () => {
      const svg = '<svg width="24" height="24"><circle cx="12" cy="12" r="10"/></svg>';
      const ast = parseSvg(svg);

      expect(ast.root.tagName).toBe('svg');
      expect(ast.root.children).toHaveLength(1);
      expect(ast.root.children[0].tagName).toBe('circle');
    });

    it('메타데이터를 추출해야 함', () => {
      const svg = '<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"></svg>';
      const ast = parseSvg(svg);

      expect(ast.metadata.width).toBe('24');
      expect(ast.metadata.height).toBe('24');
      expect(ast.metadata.viewBox).toBe('0 0 24 24');
      expect(ast.metadata.xmlns).toBe('http://www.w3.org/2000/svg');
    });

    it('중첩된 요소를 올바르게 파싱해야 함', () => {
      const svg = `
        <svg>
          <g id="layer1">
            <rect x="0" y="0" width="10" height="10"/>
            <circle cx="5" cy="5" r="5"/>
          </g>
        </svg>
      `;
      const ast = parseSvg(svg);

      expect(ast.root.children).toHaveLength(1);
      const group = ast.root.children[0];
      expect(group.tagName).toBe('g');
      expect(group.children).toHaveLength(2);
      expect(group.children[0].tagName).toBe('rect');
      expect(group.children[1].tagName).toBe('circle');
    });

    it('속성을 올바르게 파싱해야 함', () => {
      const svg = '<svg><rect x="10" y="20" width="30" height="40" fill="red"/></svg>';
      const ast = parseSvg(svg);

      const rect = ast.root.children[0];
      expect(rect.attributes).toEqual([
        { name: 'x', value: '10' },
        { name: 'y', value: '20' },
        { name: 'width', value: '30' },
        { name: 'height', value: '40' },
        { name: 'fill', value: 'red' },
      ]);
    });
  });

  describe('주석 처리', () => {
    it('XML 주석을 제거해야 함', () => {
      const svg = `
        <svg>
          <!-- This is a comment -->
          <circle cx="12" cy="12" r="10"/>
          <!-- Another comment -->
        </svg>
      `;
      const ast = parseSvg(svg);

      expect(ast.root.children).toHaveLength(1);
      expect(ast.root.children[0].tagName).toBe('circle');
    });
  });

  describe('텍스트 노드 처리', () => {
    it('텍스트 노드를 올바르게 파싱해야 함', () => {
      const svg = '<svg><text x="10" y="20">Hello</text></svg>';
      const ast = parseSvg(svg);

      const textNode = ast.root.children[0];
      expect(textNode.tagName).toBe('text');
      expect(textNode.children).toHaveLength(1);
      expect(textNode.children[0].type).toBe('text');
      expect(textNode.children[0].textContent).toBe('Hello');
    });

    it('공백만 있는 텍스트 노드는 무시해야 함', () => {
      const svg = `
        <svg>
          <circle cx="12" cy="12" r="10"/>
        </svg>
      `;
      const ast = parseSvg(svg);

      expect(ast.root.children).toHaveLength(1);
      expect(ast.root.children[0].tagName).toBe('circle');
    });
  });

  describe('네임스페이스 속성 처리', () => {
    it('xlink: 네임스페이스를 처리해야 함', () => {
      const svg = '<svg><use xlink:href="#icon"/></svg>';
      const ast = parseSvg(svg);

      const use = ast.root.children[0];
      expect(use.attributes.find(a => a.name === 'xlink:href')).toEqual({
        name: 'xlink:href',
        value: '#icon',
      });
    });
  });

  describe('자기 닫힘 태그 처리', () => {
    it('자기 닫힘 태그를 올바르게 파싱해야 함', () => {
      const svg = '<svg><path d="M10 10"/><circle cx="5" cy="5" r="2"/></svg>';
      const ast = parseSvg(svg);

      expect(ast.root.children).toHaveLength(2);
      expect(ast.root.children[0].tagName).toBe('path');
      expect(ast.root.children[0].children).toHaveLength(0);
      expect(ast.root.children[1].tagName).toBe('circle');
    });
  });

  describe('에러 처리', () => {
    it('잘못된 XML은 에러를 발생시켜야 함', () => {
      const invalidSvg = '<svg><rect></svg>';
      expect(() => parseSvg(invalidSvg)).toThrow(SvgParseError);
    });

    it('빈 문자열은 에러를 발생시켜야 함', () => {
      expect(() => parseSvg('')).toThrow(SvgParseError);
    });

    it('SVG 루트가 없으면 에러를 발생시켜야 함', () => {
      const nonSvg = '<div>Not SVG</div>';
      expect(() => parseSvg(nonSvg)).toThrow(SvgParseError);
    });

    it('parsererror 요소가 있으면 에러를 발생시켜야 함', () => {
      // DOMParser는 잘못된 XML에 대해 parsererror 요소를 생성함
      const invalidSvg = '<svg><invalid<></svg>';
      expect(() => parseSvg(invalidSvg)).toThrow(SvgParseError);
    });
  });

  describe('특수 케이스', () => {
    it('style 속성을 올바르게 파싱해야 함', () => {
      const svg = '<svg><rect style="fill: red; stroke: blue;"/></svg>';
      const ast = parseSvg(svg);

      const rect = ast.root.children[0];
      const styleAttr = rect.attributes.find(a => a.name === 'style');
      expect(styleAttr?.value).toBe('fill: red; stroke: blue;');
    });

    it('빈 SVG를 올바르게 파싱해야 함', () => {
      const svg = '<svg></svg>';
      const ast = parseSvg(svg);

      expect(ast.root.tagName).toBe('svg');
      expect(ast.root.children).toHaveLength(0);
    });

    it('xmlns가 없어도 파싱되어야 함', () => {
      const svg = '<svg width="24" height="24"></svg>';
      const ast = parseSvg(svg);

      expect(ast.root.tagName).toBe('svg');
      expect(ast.metadata.xmlns).toBeUndefined();
    });
  });
});
