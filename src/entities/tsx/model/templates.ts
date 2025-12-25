/**
 * TSX 컴포넌트 템플릿
 */

import type { TemplateOptions } from './types';

/**
 * 기본 템플릿
 */
function getBasicTemplate(options: TemplateOptions): string {
  const { componentName, svgContent, typescript, spreadProps } = options;

  const propsType = typescript ? ': React.SVGProps<SVGSVGElement>' : '';
  const propsParam = spreadProps ? 'props' : '_props';

  return `export const ${componentName} = (${propsParam}${propsType}) => {
  return (
    ${svgContent}
  );
};`;
}

/**
 * React.memo 템플릿
 */
function getMemoTemplate(options: TemplateOptions): string {
  const { componentName, svgContent, typescript, spreadProps } = options;

  const propsType = typescript ? ': React.SVGProps<SVGSVGElement>' : '';
  const propsParam = spreadProps ? 'props' : '_props';

  return `const ${componentName}Component = (${propsParam}${propsType}) => {
  return (
    ${svgContent}
  );
};

export const ${componentName} = React.memo(${componentName}Component);`;
}

/**
 * forwardRef 템플릿
 */
function getForwardRefTemplate(options: TemplateOptions): string {
  const { componentName, svgContent, typescript, spreadProps } = options;

  const propsType = typescript ? 'React.SVGProps<SVGSVGElement>' : 'any';
  const refType = typescript ? 'SVGSVGElement' : 'any';
  const propsParam = spreadProps ? 'props' : '_props';

  return `export const ${componentName} = React.forwardRef<${refType}, ${propsType}>(
  (${propsParam}, ref) => {
    return (
      ${svgContent}
    );
  }
);

${componentName}.displayName = '${componentName}';`;
}

/**
 * memo + forwardRef 템플릿
 */
function getMemoForwardRefTemplate(options: TemplateOptions): string {
  const { componentName, svgContent, typescript, spreadProps } = options;

  const propsType = typescript ? 'React.SVGProps<SVGSVGElement>' : 'any';
  const refType = typescript ? 'SVGSVGElement' : 'any';
  const propsParam = spreadProps ? 'props' : '_props';

  return `const ${componentName}Component = React.forwardRef<${refType}, ${propsType}>(
  (${propsParam}, ref) => {
    return (
      ${svgContent}
    );
  }
);

${componentName}Component.displayName = '${componentName}';

export const ${componentName} = React.memo(${componentName}Component);`;
}

/**
 * 템플릿 선택 및 생성
 */
export function getTemplate(options: TemplateOptions): string {
  const { useMemo, useForwardRef } = options;

  if (useMemo && useForwardRef) {
    return getMemoForwardRefTemplate(options);
  }

  if (useForwardRef) {
    return getForwardRefTemplate(options);
  }

  if (useMemo) {
    return getMemoTemplate(options);
  }

  return getBasicTemplate(options);
}
