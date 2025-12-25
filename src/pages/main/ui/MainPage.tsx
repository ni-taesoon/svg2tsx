/**
 * 메인 페이지
 *
 * SVG2TSX 애플리케이션의 메인 화면
 */

import { useState, useCallback } from 'react';
import { TabsContainer } from './TabsContainer';
import { TsxOutputPanel } from '@/widgets/tsx-output-panel';
import { ConvertButton } from '@/features/convert-svg';
import type { ConversionOptions } from '@/entities/options';
import { DEFAULT_CONVERSION_OPTIONS } from '@/entities/options';
import { cn } from '@/shared/lib/utils';

export interface MainPageProps {
  className?: string;
}

export const MainPage: React.FC<MainPageProps> = ({ className }) => {
  const [svgContent, setSvgContent] = useState('');
  const [tsxCode, setTsxCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState<ConversionOptions>(DEFAULT_CONVERSION_OPTIONS);

  const handleOptionsChange = useCallback((newOptions: Partial<ConversionOptions>) => {
    setOptions((prev) => ({ ...prev, ...newOptions }));
  }, []);

  const handleConvert = useCallback(async () => {
    if (!svgContent.trim()) {
      setError('Please provide SVG content');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // TODO: Task02 완료 후 실제 변환 로직으로 대체
      // const ast = parseSvg(svgContent);
      // const optimizedAst = options.optimize ? optimizeSvgAst(ast) : ast;
      // const output = generateTsx(optimizedAst, options);
      // setTsxCode(output.code);

      // Mock 구현 (Task02 완료 전까지 사용)
      await new Promise((resolve) => setTimeout(resolve, 500)); // 로딩 시뮬레이션
      const mockTsxCode = `export const ${options.componentName}${
        options.typescript ? ': React.FC<React.SVGProps<SVGSVGElement>>' : ''
      } = (${options.spreadProps ? 'props' : ''}) => {
  return (
    <svg${options.spreadProps ? ' {...props}' : ''}>
      {/* Mock TSX output */}
      {/* SVG content will be transformed here */}
    </svg>
  );
};${
        options.useMemo
          ? `\n\nexport default React.memo(${options.componentName});`
          : ''
      }`;
      setTsxCode(mockTsxCode);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to convert SVG');
    } finally {
      setIsLoading(false);
    }
  }, [svgContent, options]);

  return (
    <div className={cn('min-h-screen flex flex-col', className)}>
      {/* Header */}
      <header className="border-b p-4">
        <h1 className="text-xl font-bold">SVG2TSX</h1>
        <p className="text-sm text-muted-foreground">
          Convert SVG to React TSX components
        </p>
      </header>

      {/* Main Content - 반응형 레이아웃 */}
      <main className="flex-1 flex flex-col md:grid md:grid-rows-[1fr_auto]">
        {/* Tabs Area */}
        <div className="flex-1 overflow-auto p-4">
          <TabsContainer
            svgContent={svgContent}
            onSvgContentChange={setSvgContent}
            options={options}
            onOptionsChange={handleOptionsChange}
          />
        </div>

        {/* Output Area */}
        <div className="border-t md:max-h-[40vh]">
          <TsxOutputPanel code={tsxCode} isLoading={isLoading} error={error} />
        </div>
      </main>

      {/* Footer Actions */}
      <footer className="border-t p-4 flex gap-2 justify-end">
        <ConvertButton
          onClick={handleConvert}
          isLoading={isLoading}
          disabled={!svgContent.trim()}
        />
      </footer>
    </div>
  );
};
