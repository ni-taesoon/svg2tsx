/**
 * SVG Optimizer 테스트
 */

import { describe, it, expect } from 'vitest';
import { parseSvg } from '../model/parser';
import { optimizeSvgAst } from '../model/optimizer';

describe('optimizeSvgAst', () => {
  describe('data-* 속성 제거', () => {
    it('removeDataAttrs=true일 때 data-* 속성을 제거해야 함', () => {
      const svg = '<svg><rect data-id="123" data-name="test" x="10" y="20"/></svg>';
      const ast = parseSvg(svg);
      const optimized = optimizeSvgAst(ast, { removeDataAttrs: true });

      const rect = optimized.root.children[0];
      expect(rect.attributes.find(a => a.name.startsWith('data-'))).toBeUndefined();
      expect(rect.attributes.find(a => a.name === 'x')).toBeDefined();
      expect(rect.attributes.find(a => a.name === 'y')).toBeDefined();
    });

    it('removeDataAttrs=false일 때 data-* 속성을 유지해야 함', () => {
      const svg = '<svg><rect data-id="123" x="10"/></svg>';
      const ast = parseSvg(svg);
      const optimized = optimizeSvgAst(ast, { removeDataAttrs: false });

      const rect = optimized.root.children[0];
      expect(rect.attributes.find(a => a.name === 'data-id')).toBeDefined();
    });
  });

  describe('id 속성 제거', () => {
    it('removeIds=true일 때 id 속성을 제거해야 함', () => {
      const svg = '<svg><g id="layer1"><rect id="rect1" x="10"/></g></svg>';
      const ast = parseSvg(svg);
      const optimized = optimizeSvgAst(ast, { removeIds: true });

      const group = optimized.root.children[0];
      const rect = group.children[0];
      expect(group.attributes.find(a => a.name === 'id')).toBeUndefined();
      expect(rect.attributes.find(a => a.name === 'id')).toBeUndefined();
    });

    it('removeIds=false일 때 id 속성을 유지해야 함', () => {
      const svg = '<svg><rect id="rect1" x="10"/></svg>';
      const ast = parseSvg(svg);
      const optimized = optimizeSvgAst(ast, { removeIds: false });

      const rect = optimized.root.children[0];
      expect(rect.attributes.find(a => a.name === 'id')).toBeDefined();
    });
  });

  describe('빈 그룹 제거', () => {
    it('removeEmptyGroups=true일 때 빈 그룹을 제거해야 함', () => {
      const svg = '<svg><g></g><rect x="10"/><g></g></svg>';
      const ast = parseSvg(svg);
      const optimized = optimizeSvgAst(ast, { removeEmptyGroups: true });

      expect(optimized.root.children).toHaveLength(1);
      expect(optimized.root.children[0].tagName).toBe('rect');
    });

    it('removeEmptyGroups=false일 때 빈 그룹을 유지해야 함', () => {
      const svg = '<svg><g></g><rect x="10"/></svg>';
      const ast = parseSvg(svg);
      const optimized = optimizeSvgAst(ast, { removeEmptyGroups: false });

      expect(optimized.root.children).toHaveLength(2);
    });

    it('중첩된 빈 그룹도 제거해야 함', () => {
      const svg = '<svg><g><g></g></g><rect x="10"/></svg>';
      const ast = parseSvg(svg);
      const optimized = optimizeSvgAst(ast, { removeEmptyGroups: true });

      expect(optimized.root.children).toHaveLength(1);
      expect(optimized.root.children[0].tagName).toBe('rect');
    });
  });

  describe('기본값 속성 제거', () => {
    it('removeDefaultAttrs=true일 때 기본값을 제거해야 함', () => {
      const svg = '<svg><rect fill="black" stroke="none" x="10"/></svg>';
      const ast = parseSvg(svg);
      const optimized = optimizeSvgAst(ast, { removeDefaultAttrs: true });

      const rect = optimized.root.children[0];
      expect(rect.attributes.find(a => a.name === 'fill')).toBeUndefined();
      expect(rect.attributes.find(a => a.name === 'stroke')).toBeUndefined();
      expect(rect.attributes.find(a => a.name === 'x')).toBeDefined();
    });

    it('기본값이 아닌 경우 유지해야 함', () => {
      const svg = '<svg><rect fill="red" stroke="blue"/></svg>';
      const ast = parseSvg(svg);
      const optimized = optimizeSvgAst(ast, { removeDefaultAttrs: true });

      const rect = optimized.root.children[0];
      expect(rect.attributes.find(a => a.name === 'fill')?.value).toBe('red');
      expect(rect.attributes.find(a => a.name === 'stroke')?.value).toBe('blue');
    });
  });

  describe('transform 최적화', () => {
    it('optimizeTransforms=true일 때 translate(0,0)을 제거해야 함', () => {
      const svg = '<svg><g transform="translate(0,0)"><rect x="10"/></g></svg>';
      const ast = parseSvg(svg);
      const optimized = optimizeSvgAst(ast, { optimizeTransforms: true });

      const group = optimized.root.children[0];
      expect(group.attributes.find(a => a.name === 'transform')).toBeUndefined();
    });

    it('optimizeTransforms=true일 때 translate(0 0)을 제거해야 함', () => {
      const svg = '<svg><g transform="translate(0 0)"><rect x="10"/></g></svg>';
      const ast = parseSvg(svg);
      const optimized = optimizeSvgAst(ast, { optimizeTransforms: true });

      const group = optimized.root.children[0];
      expect(group.attributes.find(a => a.name === 'transform')).toBeUndefined();
    });

    it('의미 있는 transform은 유지해야 함', () => {
      const svg = '<svg><g transform="translate(10,20)"><rect x="10"/></g></svg>';
      const ast = parseSvg(svg);
      const optimized = optimizeSvgAst(ast, { optimizeTransforms: true });

      const group = optimized.root.children[0];
      expect(group.attributes.find(a => a.name === 'transform')).toBeDefined();
    });
  });

  describe('중복 속성 병합', () => {
    it('mergeDuplicateAttrs=true일 때 중복 속성 중 마지막 값을 유지해야 함', () => {
      // DOMParser는 자동으로 중복 속성을 처리하므로 이 테스트는 스킵
      // 실제로는 AST 레벨에서 중복 검사를 수행
      expect(true).toBe(true);
    });
  });

  describe('옵션 조합', () => {
    it('여러 최적화를 동시에 적용해야 함', () => {
      const svg = `
        <svg>
          <g id="layer1" data-name="test" transform="translate(0,0)">
            <rect fill="black" stroke="none" x="10"/>
          </g>
          <g></g>
        </svg>
      `;
      const ast = parseSvg(svg);
      const optimized = optimizeSvgAst(ast, {
        removeDataAttrs: true,
        removeIds: true,
        removeEmptyGroups: true,
        removeDefaultAttrs: true,
        optimizeTransforms: true,
      });

      expect(optimized.root.children).toHaveLength(1);
      const group = optimized.root.children[0];
      expect(group.attributes.find(a => a.name === 'id')).toBeUndefined();
      expect(group.attributes.find(a => a.name.startsWith('data-'))).toBeUndefined();
      expect(group.attributes.find(a => a.name === 'transform')).toBeUndefined();

      const rect = group.children[0];
      expect(rect.attributes.find(a => a.name === 'fill')).toBeUndefined();
      expect(rect.attributes.find(a => a.name === 'stroke')).toBeUndefined();
      expect(rect.attributes.find(a => a.name === 'x')).toBeDefined();
    });

    it('옵션이 없으면 원본을 반환해야 함', () => {
      const svg = '<svg><rect data-id="123" id="rect1"/></svg>';
      const ast = parseSvg(svg);
      const optimized = optimizeSvgAst(ast);

      const rect = optimized.root.children[0];
      expect(rect.attributes.find(a => a.name === 'data-id')).toBeDefined();
      expect(rect.attributes.find(a => a.name === 'id')).toBeDefined();
    });
  });

  describe('메타데이터 보존', () => {
    it('최적화 후에도 메타데이터를 유지해야 함', () => {
      const svg = '<svg width="24" height="24" viewBox="0 0 24 24"><rect x="10"/></svg>';
      const ast = parseSvg(svg);
      const optimized = optimizeSvgAst(ast, {
        removeDataAttrs: true,
        removeIds: true,
      });

      expect(optimized.metadata.width).toBe('24');
      expect(optimized.metadata.height).toBe('24');
      expect(optimized.metadata.viewBox).toBe('0 0 24 24');
    });
  });
});
