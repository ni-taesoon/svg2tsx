# Task 02: SVG/TSX 변환 핵심 로직 (TDD)

## 📋 개요

SVG 문자열을 파싱하여 AST로 변환하고, 최적화를 거쳐 TSX 컴포넌트로 생성하는 핵심 로직을 TDD 방식으로 구현합니다.

**목표 테스트 커버리지: 90% 이상**

---

## 🎯 구현 범위

### 1. entities/svg (SVG 파싱 및 최적화)
- `types.ts`: SVG AST 타입 정의
- `parser.ts`: SVG 문자열 → AST 변환
- `optimizer.ts`: AST 최적화 규칙
- `__tests__/parser.test.ts`: 파서 테스트
- `__tests__/optimizer.test.ts`: 최적화 테스트

### 2. entities/tsx (TSX 코드 생성)
- `types.ts`: TSX 출력 타입 정의
- `generator.ts`: AST → TSX 코드 생성
- `templates.ts`: 컴포넌트 템플릿
- `__tests__/generator.test.ts`: 생성기 테스트

### 3. entities/options (옵션 상태 관리)
- `types.ts`: 변환 옵션 타입
- `store.ts`: Zustand 기반 상태 관리

---

## 🔴 RED Phase: 테스트 작성

### 1.1 SVG Types 테스트

**파일:** `src/entities/svg/__tests__/types.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import type { SvgNode, SvgAttribute, SvgAst } from '../types';

describe('SVG Types', () => {
  it('SvgAttribute 타입이 올바르게 정의되어야 함', () => {
    const attr: SvgAttribute = {
      name: 'width',
      value: '100'
    };

    expect(attr.name).toBe('width');
    expect(attr.value).toBe('100');
  });

  it('SvgNode 타입이 자식 노드를 포함할 수 있어야 함', () => {
    const node: SvgNode = {
      type: 'element',
      tagName: 'svg',
      attributes: [],
      children: [
        {
          type: 'element',
          tagName: 'path',
          attributes: [{ name: 'd', value: 'M 0 0' }],
          children: []
        }
      ]
    };

    expect(node.children).toHaveLength(1);
    expect(node.children[0].tagName).toBe('path');
  });

  it('SvgAst 타입이 메타데이터를 포함해야 함', () => {
    const ast: SvgAst = {
      root: {
        type: 'element',
        tagName: 'svg',
        attributes: [],
        children: []
      },
      metadata: {
        viewBox: '0 0 100 100',
        xmlns: 'http://www.w3.org/2000/svg'
      }
    };

    expect(ast.metadata.viewBox).toBe('0 0 100 100');
  });
});
```

### 1.2 SVG Parser 테스트

**파일:** `src/entities/svg/__tests__/parser.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { parseSvg } from '../parser';

describe('SVG Parser', () => {
  it('기본 SVG 요소를 파싱해야 함', () => {
    const svg = '<svg width="100" height="100"></svg>';
    const ast = parseSvg(svg);

    expect(ast.root.tagName).toBe('svg');
    expect(ast.root.attributes).toHaveLength(2);
    expect(ast.root.attributes[0].name).toBe('width');
    expect(ast.root.attributes[0].value).toBe('100');
  });

  it('중첩된 요소를 파싱해야 함', () => {
    const svg = `
      <svg>
        <g>
          <path d="M 0 0" />
          <circle cx="50" cy="50" r="10" />
        </g>
      </svg>
    `;
    const ast = parseSvg(svg);

    expect(ast.root.children).toHaveLength(1);
    expect(ast.root.children[0].tagName).toBe('g');
    expect(ast.root.children[0].children).toHaveLength(2);
  });

  it('자기 닫힘 태그를 처리해야 함', () => {
    const svg = '<svg><path d="M 0 0" /></svg>';
    const ast = parseSvg(svg);

    expect(ast.root.children[0].tagName).toBe('path');
    expect(ast.root.children[0].children).toHaveLength(0);
  });

  it('네임스페이스 속성을 처리해야 함', () => {
    const svg = '<svg xmlns:xlink="http://www.w3.org/1999/xlink"><use xlink:href="#icon" /></svg>';
    const ast = parseSvg(svg);

    expect(ast.root.attributes.some(attr => attr.name === 'xmlns:xlink')).toBe(true);
    expect(ast.root.children[0].attributes[0].name).toBe('xlink:href');
  });

  it('잘못된 SVG에 대해 에러를 던져야 함', () => {
    const invalidSvg = '<svg><path></svg>';

    expect(() => parseSvg(invalidSvg)).toThrow();
  });

  it('빈 SVG를 처리해야 함', () => {
    const svg = '<svg></svg>';
    const ast = parseSvg(svg);

    expect(ast.root.children).toHaveLength(0);
  });

  it('주석을 제거해야 함', () => {
    const svg = '<svg><!-- 주석 --><path d="M 0 0" /></svg>';
    const ast = parseSvg(svg);

    expect(ast.root.children).toHaveLength(1);
    expect(ast.root.children[0].tagName).toBe('path');
  });

  it('CDATA 섹션을 처리해야 함', () => {
    const svg = '<svg><style><![CDATA[.cls{fill:red;}]]></style></svg>';
    const ast = parseSvg(svg);

    expect(ast.root.children[0].tagName).toBe('style');
  });
});
```

### 1.3 SVG Optimizer 테스트

**파일:** `src/entities/svg/__tests__/optimizer.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { optimizeSvgAst } from '../optimizer';
import { parseSvg } from '../parser';

describe('SVG Optimizer', () => {
  it('불필요한 속성을 제거해야 함', () => {
    const svg = '<svg id="icon" data-name="icon" width="100"><path d="M 0 0" /></svg>';
    const ast = parseSvg(svg);
    const optimized = optimizeSvgAst(ast, {
      removeDataAttrs: true,
      removeIds: true
    });

    expect(optimized.root.attributes.some(attr => attr.name === 'id')).toBe(false);
    expect(optimized.root.attributes.some(attr => attr.name === 'data-name')).toBe(false);
    expect(optimized.root.attributes.some(attr => attr.name === 'width')).toBe(true);
  });

  it('빈 그룹 요소를 제거해야 함', () => {
    const svg = '<svg><g></g><g><path d="M 0 0" /></g></svg>';
    const ast = parseSvg(svg);
    const optimized = optimizeSvgAst(ast, {
      removeEmptyGroups: true
    });

    expect(optimized.root.children).toHaveLength(1);
    expect(optimized.root.children[0].tagName).toBe('g');
  });

  it('중복 속성을 병합해야 함', () => {
    const svg = '<svg><path fill="red" fill="blue" d="M 0 0" /></svg>';
    const ast = parseSvg(svg);
    const optimized = optimizeSvgAst(ast, {
      mergeDuplicateAttrs: true
    });

    const fillAttrs = optimized.root.children[0].attributes.filter(attr => attr.name === 'fill');
    expect(fillAttrs).toHaveLength(1);
    expect(fillAttrs[0].value).toBe('blue');
  });

  it('기본값 속성을 제거해야 함', () => {
    const svg = '<svg fill="black" stroke="none"><path d="M 0 0" /></svg>';
    const ast = parseSvg(svg);
    const optimized = optimizeSvgAst(ast, {
      removeDefaultAttrs: true
    });

    expect(optimized.root.attributes.some(attr => attr.name === 'fill' && attr.value === 'black')).toBe(false);
  });

  it('viewBox를 메타데이터로 추출해야 함', () => {
    const svg = '<svg viewBox="0 0 100 100"><path d="M 0 0" /></svg>';
    const ast = parseSvg(svg);
    const optimized = optimizeSvgAst(ast);

    expect(optimized.metadata.viewBox).toBe('0 0 100 100');
  });

  it('transform 속성을 최적화해야 함', () => {
    const svg = '<svg><g transform="translate(0, 0)"><path d="M 0 0" /></g></svg>';
    const ast = parseSvg(svg);
    const optimized = optimizeSvgAst(ast, {
      optimizeTransforms: true
    });

    // translate(0, 0)는 제거되어야 함
    expect(optimized.root.children[0].attributes.some(attr => attr.name === 'transform')).toBe(false);
  });
});
```

### 1.4 TSX Generator 테스트

**파일:** `src/entities/tsx/__tests__/generator.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { generateTsx } from '../generator';
import { parseSvg } from '../../svg/parser';

describe('TSX Generator', () => {
  it('기본 React 컴포넌트를 생성해야 함', () => {
    const svg = '<svg width="100" height="100"><path d="M 0 0" /></svg>';
    const ast = parseSvg(svg);
    const tsx = generateTsx(ast, {
      componentName: 'Icon',
      typescript: true
    });

    expect(tsx).toContain('export const Icon');
    expect(tsx).toContain('SVGProps<SVGSVGElement>');
    expect(tsx).toContain('<svg');
    expect(tsx).toContain('<path');
  });

  it('class를 className으로 변환해야 함', () => {
    const svg = '<svg><rect class="box" /></svg>';
    const ast = parseSvg(svg);
    const tsx = generateTsx(ast);

    expect(tsx).toContain('className="box"');
    expect(tsx).not.toContain('class="box"');
  });

  it('kebab-case 속성을 camelCase로 변환해야 함', () => {
    const svg = '<svg><rect stroke-width="2" fill-opacity="0.5" /></svg>';
    const ast = parseSvg(svg);
    const tsx = generateTsx(ast);

    expect(tsx).toContain('strokeWidth="2"');
    expect(tsx).toContain('fillOpacity="0.5"');
    expect(tsx).not.toContain('stroke-width');
    expect(tsx).not.toContain('fill-opacity');
  });

  it('xlink:href를 href로 변환해야 함', () => {
    const svg = '<svg><use xlink:href="#icon" /></svg>';
    const ast = parseSvg(svg);
    const tsx = generateTsx(ast);

    expect(tsx).toContain('href="#icon"');
    expect(tsx).not.toContain('xlink:href');
  });

  it('Props를 스프레드해야 함', () => {
    const svg = '<svg width="100"><path d="M 0 0" /></svg>';
    const ast = parseSvg(svg);
    const tsx = generateTsx(ast, {
      spreadProps: true
    });

    expect(tsx).toContain('{...props}');
  });

  it('TypeScript 타입을 포함해야 함', () => {
    const svg = '<svg><path d="M 0 0" /></svg>';
    const ast = parseSvg(svg);
    const tsx = generateTsx(ast, {
      typescript: true,
      componentName: 'MyIcon'
    });

    expect(tsx).toContain('SVGProps<SVGSVGElement>');
    expect(tsx).toContain(': React.FC');
  });

  it('JavaScript로 변환할 수 있어야 함', () => {
    const svg = '<svg><path d="M 0 0" /></svg>';
    const ast = parseSvg(svg);
    const tsx = generateTsx(ast, {
      typescript: false
    });

    expect(tsx).not.toContain('SVGProps');
    expect(tsx).not.toContain(': React.FC');
  });

  it('memo를 적용할 수 있어야 함', () => {
    const svg = '<svg><path d="M 0 0" /></svg>';
    const ast = parseSvg(svg);
    const tsx = generateTsx(ast, {
      useMemo: true,
      componentName: 'Icon'
    });

    expect(tsx).toContain('React.memo');
    expect(tsx).toContain('Icon.displayName');
  });

  it('forwardRef를 적용할 수 있어야 함', () => {
    const svg = '<svg><path d="M 0 0" /></svg>';
    const ast = parseSvg(svg);
    const tsx = generateTsx(ast, {
      useForwardRef: true
    });

    expect(tsx).toContain('React.forwardRef');
    expect(tsx).toContain('ref={ref}');
  });

  it('인라인 스타일을 객체로 변환해야 함', () => {
    const svg = '<svg><rect style="fill: red; stroke-width: 2px" /></svg>';
    const ast = parseSvg(svg);
    const tsx = generateTsx(ast);

    expect(tsx).toContain('style={{ fill: "red", strokeWidth: "2px" }}');
    expect(tsx).not.toContain('style="');
  });
});
```

### 1.5 Options Store 테스트

**파일:** `src/entities/options/__tests__/store.test.ts`

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { useOptionsStore } from '../store';

describe('Options Store', () => {
  beforeEach(() => {
    // 스토어 초기화
    useOptionsStore.getState().reset();
  });

  it('기본 옵션이 설정되어야 함', () => {
    const options = useOptionsStore.getState().options;

    expect(options.typescript).toBe(true);
    expect(options.componentName).toBe('Icon');
    expect(options.spreadProps).toBe(true);
  });

  it('옵션을 업데이트할 수 있어야 함', () => {
    const { setOptions } = useOptionsStore.getState();

    setOptions({ componentName: 'MyIcon' });

    expect(useOptionsStore.getState().options.componentName).toBe('MyIcon');
  });

  it('부분 업데이트를 지원해야 함', () => {
    const { setOptions } = useOptionsStore.getState();

    setOptions({ typescript: false });

    expect(useOptionsStore.getState().options.typescript).toBe(false);
    expect(useOptionsStore.getState().options.componentName).toBe('Icon'); // 기본값 유지
  });

  it('스토어를 리셋할 수 있어야 함', () => {
    const { setOptions, reset } = useOptionsStore.getState();

    setOptions({ componentName: 'Custom' });
    expect(useOptionsStore.getState().options.componentName).toBe('Custom');

    reset();
    expect(useOptionsStore.getState().options.componentName).toBe('Icon');
  });

  it('최적화 옵션을 관리해야 함', () => {
    const { setOptimizationOptions } = useOptionsStore.getState();

    setOptimizationOptions({
      removeDataAttrs: true,
      removeIds: false
    });

    const opts = useOptionsStore.getState().optimizationOptions;
    expect(opts.removeDataAttrs).toBe(true);
    expect(opts.removeIds).toBe(false);
  });
});
```

---

## 🟢 GREEN Phase: 구현

### 2.1 SVG Types 구현

**파일:** `src/entities/svg/types.ts`

```typescript
export interface SvgAttribute {
  name: string;
  value: string;
}

export type SvgNodeType = 'element' | 'text';

export interface SvgNode {
  type: SvgNodeType;
  tagName: string;
  attributes: SvgAttribute[];
  children: SvgNode[];
  textContent?: string;
}

export interface SvgMetadata {
  viewBox?: string;
  xmlns?: string;
  width?: string;
  height?: string;
}

export interface SvgAst {
  root: SvgNode;
  metadata: SvgMetadata;
}
```

### 2.2 SVG Parser 구현

**파일:** `src/entities/svg/parser.ts`

```typescript
import type { SvgAst, SvgNode, SvgAttribute, SvgMetadata } from './types';

export function parseSvg(svgString: string): SvgAst {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, 'image/svg+xml');

  const parserError = doc.querySelector('parsererror');
  if (parserError) {
    throw new Error(`Invalid SVG: ${parserError.textContent}`);
  }

  const svgElement = doc.documentElement;

  const metadata: SvgMetadata = {
    viewBox: svgElement.getAttribute('viewBox') || undefined,
    xmlns: svgElement.getAttribute('xmlns') || undefined,
    width: svgElement.getAttribute('width') || undefined,
    height: svgElement.getAttribute('height') || undefined,
  };

  const root = parseNode(svgElement);

  return { root, metadata };
}

function parseNode(element: Element): SvgNode {
  const attributes: SvgAttribute[] = [];

  for (let i = 0; i < element.attributes.length; i++) {
    const attr = element.attributes[i];
    attributes.push({
      name: attr.name,
      value: attr.value,
    });
  }

  const children: SvgNode[] = [];

  for (let i = 0; i < element.childNodes.length; i++) {
    const child = element.childNodes[i];

    // 주석 노드 제외
    if (child.nodeType === Node.COMMENT_NODE) {
      continue;
    }

    // 요소 노드만 처리
    if (child.nodeType === Node.ELEMENT_NODE) {
      children.push(parseNode(child as Element));
    }
  }

  return {
    type: 'element',
    tagName: element.tagName.toLowerCase(),
    attributes,
    children,
  };
}
```

### 2.3 SVG Optimizer 구현

**파일:** `src/entities/svg/optimizer.ts`

```typescript
import type { SvgAst, SvgNode, SvgAttribute } from './types';

export interface OptimizerOptions {
  removeDataAttrs?: boolean;
  removeIds?: boolean;
  removeEmptyGroups?: boolean;
  mergeDuplicateAttrs?: boolean;
  removeDefaultAttrs?: boolean;
  optimizeTransforms?: boolean;
}

const DEFAULT_ATTRS: Record<string, string> = {
  fill: 'black',
  stroke: 'none',
};

export function optimizeSvgAst(
  ast: SvgAst,
  options: OptimizerOptions = {}
): SvgAst {
  const optimizedRoot = optimizeNode(ast.root, options);

  return {
    ...ast,
    root: optimizedRoot,
  };
}

function optimizeNode(node: SvgNode, options: OptimizerOptions): SvgNode {
  let attributes = [...node.attributes];

  // 불필요한 속성 제거
  if (options.removeDataAttrs) {
    attributes = attributes.filter(attr => !attr.name.startsWith('data-'));
  }

  if (options.removeIds) {
    attributes = attributes.filter(attr => attr.name !== 'id');
  }

  // 중복 속성 병합
  if (options.mergeDuplicateAttrs) {
    const attrMap = new Map<string, string>();
    attributes.forEach(attr => {
      attrMap.set(attr.name, attr.value);
    });
    attributes = Array.from(attrMap.entries()).map(([name, value]) => ({ name, value }));
  }

  // 기본값 제거
  if (options.removeDefaultAttrs) {
    attributes = attributes.filter(attr => {
      const defaultValue = DEFAULT_ATTRS[attr.name];
      return !defaultValue || defaultValue !== attr.value;
    });
  }

  // Transform 최적화
  if (options.optimizeTransforms) {
    attributes = attributes.filter(attr => {
      if (attr.name === 'transform') {
        // translate(0, 0) 제거
        return attr.value !== 'translate(0, 0)' && attr.value !== 'translate(0,0)';
      }
      return true;
    });
  }

  // 자식 노드 최적화
  let children = node.children.map(child => optimizeNode(child, options));

  // 빈 그룹 제거
  if (options.removeEmptyGroups) {
    children = children.filter(child => {
      if (child.tagName === 'g' && child.children.length === 0) {
        return false;
      }
      return true;
    });
  }

  return {
    ...node,
    attributes,
    children,
  };
}
```

### 2.4 TSX Types 구현

**파일:** `src/entities/tsx/types.ts`

```typescript
export interface GeneratorOptions {
  componentName?: string;
  typescript?: boolean;
  spreadProps?: boolean;
  useMemo?: boolean;
  useForwardRef?: boolean;
}

export interface TsxOutput {
  code: string;
  componentName: string;
}
```

### 2.5 TSX Generator 구현

**파일:** `src/entities/tsx/generator.ts`

```typescript
import type { SvgAst, SvgNode } from '../svg/types';
import type { GeneratorOptions, TsxOutput } from './types';
import { getTemplate } from './templates';

const ATTR_CONVERSIONS: Record<string, string> = {
  'class': 'className',
  'xlink:href': 'href',
  'stroke-width': 'strokeWidth',
  'fill-opacity': 'fillOpacity',
  'stroke-opacity': 'strokeOpacity',
  'stroke-linecap': 'strokeLinecap',
  'stroke-linejoin': 'strokeLinejoin',
  'stroke-dasharray': 'strokeDasharray',
  'fill-rule': 'fillRule',
  'clip-rule': 'clipRule',
};

export function generateTsx(
  ast: SvgAst,
  options: GeneratorOptions = {}
): string {
  const {
    componentName = 'Icon',
    typescript = true,
    spreadProps = true,
    useMemo = false,
    useForwardRef = false,
  } = options;

  const svgContent = generateNodeCode(ast.root, 1);

  const template = getTemplate({
    componentName,
    typescript,
    spreadProps,
    useMemo,
    useForwardRef,
    svgContent,
  });

  return template;
}

function generateNodeCode(node: SvgNode, indent: number): string {
  const indentStr = '  '.repeat(indent);
  const attributes = node.attributes.map(convertAttribute).join(' ');
  const hasChildren = node.children.length > 0;

  if (!hasChildren) {
    return `${indentStr}<${node.tagName}${attributes ? ' ' + attributes : ''} />`;
  }

  const childrenCode = node.children
    .map(child => generateNodeCode(child, indent + 1))
    .join('\n');

  return [
    `${indentStr}<${node.tagName}${attributes ? ' ' + attributes : ''}>`,
    childrenCode,
    `${indentStr}</${node.tagName}>`,
  ].join('\n');
}

function convertAttribute(attr: { name: string; value: string }): string {
  const attrName = ATTR_CONVERSIONS[attr.name] || kebabToCamel(attr.name);

  // style 속성 특수 처리
  if (attrName === 'style') {
    const styleObj = parseStyleString(attr.value);
    return `style={${JSON.stringify(styleObj)}}`;
  }

  return `${attrName}="${attr.value}"`;
}

function kebabToCamel(str: string): string {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

function parseStyleString(style: string): Record<string, string> {
  const styles: Record<string, string> = {};

  style.split(';').forEach(rule => {
    const [key, value] = rule.split(':').map(s => s.trim());
    if (key && value) {
      const camelKey = kebabToCamel(key);
      styles[camelKey] = value;
    }
  });

  return styles;
}
```

### 2.6 TSX Templates 구현

**파일:** `src/entities/tsx/templates.ts`

```typescript
interface TemplateOptions {
  componentName: string;
  typescript: boolean;
  spreadProps: boolean;
  useMemo: boolean;
  useForwardRef: boolean;
  svgContent: string;
}

export function getTemplate(options: TemplateOptions): string {
  const {
    componentName,
    typescript,
    spreadProps,
    useMemo,
    useForwardRef,
    svgContent,
  } = options;

  if (useForwardRef) {
    return getForwardRefTemplate(options);
  }

  if (useMemo) {
    return getMemoTemplate(options);
  }

  return getBasicTemplate(options);
}

function getBasicTemplate(options: TemplateOptions): string {
  const { componentName, typescript, spreadProps, svgContent } = options;

  const typeAnnotation = typescript ? ': React.FC<SVGProps<SVGSVGElement>>' : '';
  const propsType = typescript ? 'SVGProps<SVGSVGElement>' : '';
  const propsSpread = spreadProps ? '{...props}' : '';

  return `import React${typescript ? ', { SVGProps }' : ''} from 'react';

export const ${componentName}${typeAnnotation} = (${typescript ? `props: ${propsType}` : 'props'}) => {
  return (
${svgContent.split('\n').map(line => line ? `    ${line}` : line).join('\n')}${propsSpread ? `      ${propsSpread}\n` : ''}
  );
};
`;
}

function getMemoTemplate(options: TemplateOptions): string {
  const { componentName, typescript, spreadProps, svgContent } = options;

  const typeAnnotation = typescript ? ': React.FC<SVGProps<SVGSVGElement>>' : '';
  const propsType = typescript ? 'SVGProps<SVGSVGElement>' : '';
  const propsSpread = spreadProps ? '{...props}' : '';

  return `import React${typescript ? ', { SVGProps }' : ''} from 'react';

export const ${componentName}${typeAnnotation} = React.memo((${typescript ? `props: ${propsType}` : 'props'}) => {
  return (
${svgContent.split('\n').map(line => line ? `    ${line}` : line).join('\n')}${propsSpread ? `      ${propsSpread}\n` : ''}
  );
});

${componentName}.displayName = '${componentName}';
`;
}

function getForwardRefTemplate(options: TemplateOptions): string {
  const { componentName, typescript, spreadProps, svgContent } = options;

  const propsType = typescript ? 'SVGProps<SVGSVGElement>' : '';
  const refType = typescript ? 'SVGSVGElement' : '';
  const propsSpread = spreadProps ? '{...props}' : '';

  return `import React${typescript ? ', { SVGProps, forwardRef }' : ', { forwardRef }'} from 'react';

export const ${componentName} = forwardRef${typescript ? `<${refType}, ${propsType}>` : ''}((${typescript ? `props: ${propsType}, ref` : 'props, ref'}) => {
  return (
${svgContent.split('\n').map(line => line ? `    ${line}` : line).join('\n')}${propsSpread ? `      ${propsSpread}\n` : ''}      ref={ref}
  );
});

${componentName}.displayName = '${componentName}';
`;
}
```

### 2.7 Options Types 구현

**파일:** `src/entities/options/types.ts`

```typescript
import type { GeneratorOptions } from '../tsx/types';
import type { OptimizerOptions } from '../svg/optimizer';

export interface ConversionOptions extends GeneratorOptions {
  optimize?: boolean;
}

export interface OptionsState {
  options: ConversionOptions;
  optimizationOptions: OptimizerOptions;
  setOptions: (options: Partial<ConversionOptions>) => void;
  setOptimizationOptions: (options: Partial<OptimizerOptions>) => void;
  reset: () => void;
}
```

### 2.8 Options Store 구현

**파일:** `src/entities/options/store.ts`

```typescript
import { create } from 'zustand';
import type { OptionsState, ConversionOptions } from './types';
import type { OptimizerOptions } from '../svg/optimizer';

const DEFAULT_OPTIONS: ConversionOptions = {
  componentName: 'Icon',
  typescript: true,
  spreadProps: true,
  useMemo: false,
  useForwardRef: false,
  optimize: true,
};

const DEFAULT_OPTIMIZATION_OPTIONS: OptimizerOptions = {
  removeDataAttrs: true,
  removeIds: false,
  removeEmptyGroups: true,
  mergeDuplicateAttrs: true,
  removeDefaultAttrs: true,
  optimizeTransforms: true,
};

export const useOptionsStore = create<OptionsState>((set) => ({
  options: DEFAULT_OPTIONS,
  optimizationOptions: DEFAULT_OPTIMIZATION_OPTIONS,

  setOptions: (newOptions) =>
    set((state) => ({
      options: { ...state.options, ...newOptions },
    })),

  setOptimizationOptions: (newOptions) =>
    set((state) => ({
      optimizationOptions: { ...state.optimizationOptions, ...newOptions },
    })),

  reset: () =>
    set({
      options: DEFAULT_OPTIONS,
      optimizationOptions: DEFAULT_OPTIMIZATION_OPTIONS,
    }),
}));
```

---

## 🔵 REFACTOR Phase: 리팩토링

### 3.1 파서 성능 최적화

- 대용량 SVG 파일 처리를 위한 스트리밍 파싱 고려
- 파싱 결과 메모이제이션으로 중복 파싱 방지

**개선 예시:**

```typescript
// parser.ts에 캐싱 추가
const parserCache = new Map<string, SvgAst>();

export function parseSvg(svgString: string, useCache = true): SvgAst {
  if (useCache && parserCache.has(svgString)) {
    return parserCache.get(svgString)!;
  }

  // ... 기존 파싱 로직

  if (useCache) {
    parserCache.set(svgString, ast);
  }

  return ast;
}
```

### 3.2 속성 변환 규칙 확장

- ATTR_CONVERSIONS를 외부 설정 파일로 분리
- 사용자 정의 변환 규칙 추가 가능하도록 확장

**개선 예시:**

```typescript
// attributes.ts (새 파일)
export const DEFAULT_ATTR_CONVERSIONS: Record<string, string> = {
  // ... 기존 규칙
};

export function createAttrConverter(
  customRules: Record<string, string> = {}
) {
  const rules = { ...DEFAULT_ATTR_CONVERSIONS, ...customRules };

  return (attr: { name: string; value: string }) => {
    const attrName = rules[attr.name] || kebabToCamel(attr.name);
    // ... 변환 로직
  };
}
```

### 3.3 에러 처리 강화

- 파싱 에러에 대한 구체적인 메시지
- 복구 가능한 에러는 경고로 처리하고 계속 진행

**개선 예시:**

```typescript
export class SvgParseError extends Error {
  constructor(
    message: string,
    public readonly line?: number,
    public readonly column?: number
  ) {
    super(message);
    this.name = 'SvgParseError';
  }
}

export function parseSvg(svgString: string): SvgAst {
  try {
    // ... 파싱 로직
  } catch (error) {
    if (error instanceof DOMException) {
      throw new SvgParseError(
        `Invalid SVG syntax: ${error.message}`,
        // line, column 정보 추출 (가능한 경우)
      );
    }
    throw error;
  }
}
```

### 3.4 타입 안정성 개선

- 런타임 타입 검증 추가 (zod 등 활용)
- null/undefined 처리 강화

**개선 예시:**

```typescript
import { z } from 'zod';

export const SvgAttributeSchema = z.object({
  name: z.string(),
  value: z.string(),
});

export const SvgNodeSchema: z.ZodType<SvgNode> = z.lazy(() =>
  z.object({
    type: z.literal('element'),
    tagName: z.string(),
    attributes: z.array(SvgAttributeSchema),
    children: z.array(SvgNodeSchema),
  })
);

export function validateSvgAst(ast: unknown): SvgAst {
  return SvgAstSchema.parse(ast);
}
```

---

## 📊 테스트 커버리지 목표

### 목표: 90% 이상

**세부 목표:**
- `parser.ts`: 95% (엣지 케이스 중요)
- `optimizer.ts`: 90%
- `generator.ts`: 95% (출력 품질 중요)
- `store.ts`: 85%
- `types.ts`: 100% (타입 정의)

### 커버리지 확인 방법

```bash
pnpm test:coverage
```

**기준:**
- Statements: 90%+
- Branches: 85%+
- Functions: 90%+
- Lines: 90%+

---

## 🧪 통합 테스트

### E2E 시나리오

**파일:** `src/entities/__tests__/integration.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { parseSvg } from '../svg/parser';
import { optimizeSvgAst } from '../svg/optimizer';
import { generateTsx } from '../tsx/generator';

describe('SVG to TSX Integration', () => {
  it('전체 변환 파이프라인이 동작해야 함', () => {
    const svg = `
      <svg width="100" height="100" viewBox="0 0 100 100">
        <g id="layer1" data-name="Layer 1">
          <path class="icon-path" stroke-width="2" d="M 0 0 L 100 100" />
        </g>
      </svg>
    `;

    // 1. 파싱
    const ast = parseSvg(svg);
    expect(ast.root.tagName).toBe('svg');

    // 2. 최적화
    const optimized = optimizeSvgAst(ast, {
      removeDataAttrs: true,
      removeIds: true,
      removeEmptyGroups: true,
    });

    // 3. TSX 생성
    const tsx = generateTsx(optimized, {
      componentName: 'TestIcon',
      typescript: true,
    });

    // 4. 검증
    expect(tsx).toContain('export const TestIcon');
    expect(tsx).toContain('className="icon-path"');
    expect(tsx).toContain('strokeWidth="2"');
    expect(tsx).not.toContain('data-name');
    expect(tsx).not.toContain('id="layer1"');
  });

  it('복잡한 실제 아이콘을 변환할 수 있어야 함', () => {
    const complexSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <defs>
          <linearGradient id="grad1">
            <stop offset="0%" style="stop-color:rgb(255,255,0);stop-opacity:1" />
          </linearGradient>
        </defs>
        <g transform="translate(0, 0)">
          <circle cx="12" cy="12" r="10" fill="url(#grad1)" />
          <path d="M12 2 L12 22" stroke="black" stroke-width="2" />
        </g>
      </svg>
    `;

    const ast = parseSvg(complexSvg);
    const tsx = generateTsx(ast, { componentName: 'ComplexIcon' });

    expect(tsx).toContain('linearGradient');
    expect(tsx).toContain('stopColor');
    expect(tsx).toContain('strokeWidth');
  });
});
```

---

## 📝 구현 체크리스트

### Phase 1: Types & Parser
- [ ] `src/entities/svg/types.ts` 타입 정의
- [ ] `src/entities/svg/parser.ts` 구현
- [ ] `src/entities/svg/__tests__/parser.test.ts` 작성
- [ ] 파서 테스트 통과 (커버리지 95%+)

### Phase 2: Optimizer
- [ ] `src/entities/svg/optimizer.ts` 구현
- [ ] `src/entities/svg/__tests__/optimizer.test.ts` 작성
- [ ] 최적화 테스트 통과 (커버리지 90%+)

### Phase 3: TSX Generator
- [ ] `src/entities/tsx/types.ts` 타입 정의
- [ ] `src/entities/tsx/templates.ts` 템플릿 구현
- [ ] `src/entities/tsx/generator.ts` 구현
- [ ] `src/entities/tsx/__tests__/generator.test.ts` 작성
- [ ] 생성기 테스트 통과 (커버리지 95%+)

### Phase 4: Options Management
- [ ] `src/entities/options/types.ts` 타입 정의
- [ ] `src/entities/options/store.ts` Zustand 스토어 구현
- [ ] `src/entities/options/__tests__/store.test.ts` 작성
- [ ] 스토어 테스트 통과 (커버리지 85%+)

### Phase 5: Integration & Refactoring
- [ ] `src/entities/__tests__/integration.test.ts` 통합 테스트
- [ ] 전체 커버리지 90% 달성
- [ ] 코드 리뷰 및 리팩토링
- [ ] 성능 최적화
- [ ] 문서화

---

## 🔗 연관 Task

- **Task 01**: 프로젝트 셋업 (테스트 환경 구성 필요)
- **Task 03**: UI 구현 (이 로직을 사용)
- **Task 04**: CLI 구현 (이 로직을 사용)

---

## 📚 참고 자료

- [SVGO - SVG Optimizer](https://github.com/svg/svgo)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Zustand Documentation](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [Vitest API Reference](https://vitest.dev/api/)
- [PRD 섹션 4: TDD 방법론](../PRD.md#4-개발-방법론)
- [PRD 섹션 7: 변환 로직 상세](../PRD.md#7-svg-to-tsx-변환-로직)
