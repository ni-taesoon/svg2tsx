/**
 * TSX Generator 테스트
 */

import { describe, it, expect } from 'vitest';
import { generateTsx } from '../model/generator';
import { parseSvg } from '@/entities/svg/model/parser';

describe('generateTsx', () => {
  describe('기본 변환', () => {
    it('단순한 SVG를 TSX로 변환해야 함', () => {
      const svg = '<svg width="24" height="24"><circle cx="12" cy="12" r="10"/></svg>';
      const ast = parseSvg(svg);
      const tsx = generateTsx(ast);

      expect(tsx).toContain('export const Icon');
      expect(tsx).toContain('<svg');
      expect(tsx).toContain('<circle');
      expect(tsx).toContain('cx={12}');
      expect(tsx).toContain('cy={12}');
      expect(tsx).toContain('r={10}');
    });

    it('컴포넌트 이름을 커스텀할 수 있어야 함', () => {
      const svg = '<svg><rect/></svg>';
      const ast = parseSvg(svg);
      const tsx = generateTsx(ast, { componentName: 'MyIcon' });

      expect(tsx).toContain('export const MyIcon');
      expect(tsx).not.toContain('export const Icon');
    });
  });

  describe('속성 변환', () => {
    it('class를 className으로 변환해야 함', () => {
      const svg = '<svg><rect class="my-class"/></svg>';
      const ast = parseSvg(svg);
      const tsx = generateTsx(ast);

      expect(tsx).toContain('className="my-class"');
      expect(tsx).not.toContain('class=');
    });

    it('kebab-case를 camelCase로 변환해야 함', () => {
      const svg = '<svg><rect stroke-width="2" fill-opacity="0.5"/></svg>';
      const ast = parseSvg(svg);
      const tsx = generateTsx(ast);

      expect(tsx).toContain('strokeWidth={2}');
      expect(tsx).toContain('fillOpacity={0.5}');
    });

    it('xlink:href를 href로 변환해야 함', () => {
      const svg = '<svg xmlns:xlink="http://www.w3.org/1999/xlink"><use xlink:href="#icon"/></svg>';
      const ast = parseSvg(svg);
      const tsx = generateTsx(ast);

      expect(tsx).toContain('href="#icon"');
      expect(tsx).not.toContain('xlink:href');
    });

    it('숫자 값은 중괄호로 감싸야 함', () => {
      const svg = '<svg width="24" height="24"><rect x="10" y="20"/></svg>';
      const ast = parseSvg(svg);
      const tsx = generateTsx(ast);

      expect(tsx).toContain('width={24}');
      expect(tsx).toContain('height={24}');
      expect(tsx).toContain('x={10}');
      expect(tsx).toContain('y={20}');
    });

    it('문자열 값은 따옴표로 감싸야 함', () => {
      const svg = '<svg><rect fill="red"/></svg>';
      const ast = parseSvg(svg);
      const tsx = generateTsx(ast);

      expect(tsx).toContain('fill="red"');
    });

    it('path의 d 속성은 문자열로 유지해야 함', () => {
      const svg = '<svg><path d="M10 10 L20 20"/></svg>';
      const ast = parseSvg(svg);
      const tsx = generateTsx(ast);

      expect(tsx).toContain('d="M10 10 L20 20"');
    });
  });

  describe('style 속성 변환', () => {
    it('style 문자열을 객체로 변환해야 함', () => {
      const svg = '<svg><rect style="fill: red; stroke: blue;"/></svg>';
      const ast = parseSvg(svg);
      const tsx = generateTsx(ast);

      expect(tsx).toContain('style={{ fill: "red", stroke: "blue" }}');
    });

    it('style의 kebab-case를 camelCase로 변환해야 함', () => {
      const svg = '<svg><rect style="stroke-width: 2px; fill-opacity: 0.5;"/></svg>';
      const ast = parseSvg(svg);
      const tsx = generateTsx(ast);

      expect(tsx).toContain('strokeWidth: "2px"');
      expect(tsx).toContain('fillOpacity: "0.5"');
    });

    it('빈 style은 무시해야 함', () => {
      const svg = '<svg><rect style=""/></svg>';
      const ast = parseSvg(svg);
      const tsx = generateTsx(ast);

      expect(tsx).not.toContain('style=');
    });
  });

  describe('텍스트 노드 처리', () => {
    it('텍스트 노드를 올바르게 변환해야 함', () => {
      const svg = '<svg><text>Hello World</text></svg>';
      const ast = parseSvg(svg);
      const tsx = generateTsx(ast);

      expect(tsx).toContain('<text>Hello World</text>');
    });
  });

  describe('TypeScript 타입', () => {
    it('typescript=true일 때 타입을 포함해야 함', () => {
      const svg = '<svg><rect/></svg>';
      const ast = parseSvg(svg);
      const tsx = generateTsx(ast, { typescript: true });

      expect(tsx).toContain('SVGProps<SVGSVGElement>');
    });

    it('typescript=false일 때 타입을 포함하지 않아야 함', () => {
      const svg = '<svg><rect/></svg>';
      const ast = parseSvg(svg);
      const tsx = generateTsx(ast, { typescript: false });

      expect(tsx).not.toContain('SVGProps');
      expect(tsx).not.toContain(':');
    });
  });

  describe('props 스프레드', () => {
    it('spreadProps=true일 때 {...props}를 포함해야 함', () => {
      const svg = '<svg><rect/></svg>';
      const ast = parseSvg(svg);
      const tsx = generateTsx(ast, { spreadProps: true });

      expect(tsx).toContain('...props');
    });

    it('spreadProps=false일 때 {...props}를 포함하지 않아야 함', () => {
      const svg = '<svg><rect/></svg>';
      const ast = parseSvg(svg);
      const tsx = generateTsx(ast, { spreadProps: false });

      expect(tsx).not.toContain('...props');
    });
  });

  describe('React.memo', () => {
    it('useMemo=true일 때 React.memo로 래핑해야 함', () => {
      const svg = '<svg><rect/></svg>';
      const ast = parseSvg(svg);
      const tsx = generateTsx(ast, { useMemo: true });

      expect(tsx).toContain('React.memo');
    });

    it('useMemo=false일 때 React.memo를 사용하지 않아야 함', () => {
      const svg = '<svg><rect/></svg>';
      const ast = parseSvg(svg);
      const tsx = generateTsx(ast, { useMemo: false });

      expect(tsx).not.toContain('React.memo');
    });
  });

  describe('forwardRef', () => {
    it('useForwardRef=true일 때 forwardRef를 사용해야 함', () => {
      const svg = '<svg><rect/></svg>';
      const ast = parseSvg(svg);
      const tsx = generateTsx(ast, { useForwardRef: true });

      expect(tsx).toContain('forwardRef');
      expect(tsx).toContain('ref');
    });

    it('useForwardRef=false일 때 forwardRef를 사용하지 않아야 함', () => {
      const svg = '<svg><rect/></svg>';
      const ast = parseSvg(svg);
      const tsx = generateTsx(ast, { useForwardRef: false });

      expect(tsx).not.toContain('forwardRef');
    });

    it('useMemo와 useForwardRef를 함께 사용할 수 있어야 함', () => {
      const svg = '<svg><rect/></svg>';
      const ast = parseSvg(svg);
      const tsx = generateTsx(ast, { useMemo: true, useForwardRef: true });

      expect(tsx).toContain('React.memo');
      expect(tsx).toContain('forwardRef');
    });
  });

  describe('복잡한 SVG 변환', () => {
    it('중첩된 요소를 올바르게 변환해야 함', () => {
      const svg = `
        <svg viewBox="0 0 24 24">
          <g fill="none" stroke-width="2">
            <rect x="5" y="5" width="14" height="14"/>
            <circle cx="12" cy="12" r="3"/>
          </g>
        </svg>
      `;
      const ast = parseSvg(svg);
      const tsx = generateTsx(ast);

      expect(tsx).toContain('viewBox="0 0 24 24"');
      expect(tsx).toContain('<g');
      expect(tsx).toContain('fill="none"');
      expect(tsx).toContain('strokeWidth={2}');
      expect(tsx).toContain('<rect');
      expect(tsx).toContain('<circle');
    });
  });

  describe('자기 닫힘 태그', () => {
    it('자식이 없는 요소는 자기 닫힘 태그로 변환해야 함', () => {
      const svg = '<svg><rect x="10" y="20"/><circle cx="5" cy="5" r="2"/></svg>';
      const ast = parseSvg(svg);
      const tsx = generateTsx(ast);

      expect(tsx).toContain('<rect');
      expect(tsx).toContain('/>');
      expect(tsx).toContain('<circle');
    });

    it('자식이 있는 요소는 여는 태그와 닫는 태그로 변환해야 함', () => {
      const svg = '<svg><g><rect/></g></svg>';
      const ast = parseSvg(svg);
      const tsx = generateTsx(ast);

      expect(tsx).toContain('<g>');
      expect(tsx).toContain('</g>');
    });
  });

  describe('기본값', () => {
    it('옵션이 없으면 기본값을 사용해야 함', () => {
      const svg = '<svg><rect/></svg>';
      const ast = parseSvg(svg);
      const tsx = generateTsx(ast);

      expect(tsx).toContain('export const Icon');
      expect(tsx).toContain('SVGProps');
      expect(tsx).toContain('...props');
      expect(tsx).not.toContain('React.memo');
      expect(tsx).not.toContain('forwardRef');
    });
  });
});
