/**
 * Entities 통합 테스트
 *
 * SVG 파싱 → 최적화 → TSX 생성 전체 플로우 테스트
 */

import { describe, it, expect } from 'vitest';
import { parseSvg, optimizeSvgAst } from '../svg';
import { generateTsx } from '../tsx';
import { useOptionsStore } from '../options';

describe('Entities 통합 테스트', () => {
  it('SVG → AST → 최적화 → TSX 전체 플로우가 동작해야 함', () => {
    // 1. SVG 파싱
    const svg = `
      <svg width="24" height="24" viewBox="0 0 24 24">
        <g id="layer1" data-name="test" transform="translate(0,0)">
          <rect fill="black" stroke="none" x="10" y="20" stroke-width="2"/>
        </g>
        <g></g>
      </svg>
    `;
    const ast = parseSvg(svg);

    // 2. 최적화
    const optimized = optimizeSvgAst(ast, {
      removeDataAttrs: true,
      removeIds: true,
      removeEmptyGroups: true,
      removeDefaultAttrs: true,
      optimizeTransforms: true,
    });

    // 3. TSX 생성
    const tsx = generateTsx(optimized, {
      componentName: 'TestIcon',
      typescript: true,
      spreadProps: true,
    });

    // 검증
    expect(tsx).toContain('export const TestIcon');
    expect(tsx).toContain('SVGProps');
    expect(tsx).toContain('viewBox="0 0 24 24"');
    expect(tsx).toContain('strokeWidth={2}');
    expect(tsx).not.toContain('id=');
    expect(tsx).not.toContain('data-');
    expect(tsx).not.toContain('transform=');
    expect(tsx).not.toContain('fill="black"');
    expect(tsx).not.toContain('<g></g>');
  });

  it('Options Store와 함께 동작해야 함', () => {
    // Options Store 초기화
    useOptionsStore.getState().reset();

    // 옵션 설정
    useOptionsStore.getState().setOptions({
      componentName: 'CustomIcon',
      typescript: false,
      useMemo: true,
    });

    useOptionsStore.getState().setOptimizationOptions({
      removeIds: true,
      removeDataAttrs: true,
    });

    // 옵션 가져오기
    const { options, optimizationOptions } = useOptionsStore.getState();

    // SVG 파싱 및 변환
    const svg = '<svg id="root" data-test="123"><rect x="10"/></svg>';
    const ast = parseSvg(svg);
    const optimized = optimizeSvgAst(ast, optimizationOptions);
    const tsx = generateTsx(optimized, options);

    // 검증
    expect(tsx).toContain('CustomIcon');
    expect(tsx).toContain('React.memo');
    expect(tsx).not.toContain(':'); // typescript=false
    expect(tsx).not.toContain('id=');
    expect(tsx).not.toContain('data-');
  });

  it('복잡한 실제 SVG 아이콘을 변환할 수 있어야 함', () => {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
    `;

    const ast = parseSvg(svg);
    const optimized = optimizeSvgAst(ast, {
      removeDataAttrs: true,
      removeEmptyGroups: true,
    });
    const tsx = generateTsx(optimized, {
      componentName: 'AlertCircle',
      typescript: true,
      spreadProps: true,
      useForwardRef: true,
    });

    // 검증
    expect(tsx).toContain('AlertCircle');
    expect(tsx).toContain('forwardRef');
    expect(tsx).toContain('ref={ref}');
    expect(tsx).toContain('stroke="currentColor"');
    expect(tsx).toContain('strokeWidth={2}');
    expect(tsx).toContain('strokeLinecap="round"');
    expect(tsx).toContain('strokeLinejoin="round"');
    expect(tsx).toContain('<circle');
    expect(tsx).toContain('<line');
  });

  it('모든 Public API가 정상적으로 export되어야 함', () => {
    // SVG Entity
    expect(parseSvg).toBeDefined();
    expect(optimizeSvgAst).toBeDefined();

    // TSX Entity
    expect(generateTsx).toBeDefined();

    // Options Entity
    expect(useOptionsStore).toBeDefined();
  });
});
