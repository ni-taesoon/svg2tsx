/**
 * 메인 페이지
 *
 * SVG2TSX 애플리케이션의 메인 화면
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { FileInput } from 'lucide-react';
import { TabsContainer, type TabValue } from './TabsContainer';
import { TsxOutputPanel } from '@/widgets/tsx-output-panel';
import { ShortcutsHelpModal } from '@/features/shortcuts-help';
import type { ConversionOptions } from '@/entities/options';
import { DEFAULT_CONVERSION_OPTIONS, DEFAULT_OPTIMIZER_OPTIONS } from '@/entities/options';
import { parseSvg, optimizeSvgAst, SvgParseError } from '@/entities/svg';
import { generateTsx } from '@/entities/tsx';
import { cn } from '@/shared/lib/utils';
import { Button, toast, ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/shared/ui';
import { useKeyboardShortcuts, useTauriDragDrop } from '@/shared/hooks';
import { copyToClipboard } from '@/features/copy-code/lib/clipboard';
import { saveFileDialog, saveTsxFile } from '@/shared/api';

export interface MainPageProps {
  className?: string;
}

export const MainPage: React.FC<MainPageProps> = ({ className }) => {
  const [svgContent, setSvgContent] = useState('');
  const [tsxCode, setTsxCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState<ConversionOptions>(DEFAULT_CONVERSION_OPTIONS);
  const [activeTab, setActiveTab] = useState<TabValue>('preview');
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const saveInProgressRef = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOptionsChange = useCallback((newOptions: Partial<ConversionOptions>) => {
    setOptions((prev) => ({ ...prev, ...newOptions }));
  }, []);

  // 외부 파일 Drag & Drop 처리 (Finder/Explorer에서 드래그)
  const { isDragging } = useTauriDragDrop({
    allowedExtensions: ['.svg'],
    onFileDrop: (content, fileName) => {
      setSvgContent(content);
      // 파일명에서 컴포넌트 이름 추출
      const componentName = fileName.replace(/\.svg$/i, '');
      if (componentName) {
        setOptions((prev) => ({ ...prev, componentName }));
      }
      toast.success(`${fileName} 파일이 로드되었습니다`);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  // 파일 선택 핸들러
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith('.svg')) {
      file.text().then((content) => {
        setSvgContent(content);
        const componentName = file.name.replace(/\.svg$/i, '');
        if (componentName) {
          setOptions((prev) => ({ ...prev, componentName }));
        }
        toast.success(`${file.name} 파일이 로드되었습니다`);
      });
    }
    e.target.value = ''; // 같은 파일 재선택 허용
  }, []);

  // 자동 변환 (svgContent 또는 options 변경 시)
  useEffect(() => {
    if (!svgContent.trim()) {
      setTsxCode('');
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 1. SVG 파싱
      const ast = parseSvg(svgContent);

      // 2. 최적화 (옵션에 따라)
      const optimizedAst = options.optimize ? optimizeSvgAst(ast, DEFAULT_OPTIMIZER_OPTIONS) : ast;

      // 3. TSX 생성
      const tsxOutput = generateTsx(optimizedAst, options);
      setTsxCode(tsxOutput);
    } catch (err) {
      if (err instanceof SvgParseError) {
        setError(`SVG 파싱 에러: ${err.message}`);
      } else {
        setError(err instanceof Error ? err.message : 'Failed to convert SVG');
      }
    } finally {
      setIsLoading(false);
    }
  }, [svgContent, options]);

  const handleCopy = useCallback(async () => {
    if (!tsxCode) {
      toast.error('복사할 코드가 없습니다');
      return;
    }
    const success = await copyToClipboard(tsxCode);
    if (success) {
      toast.success('클립보드에 복사되었습니다');
    } else {
      toast.error('클립보드 복사에 실패했습니다');
    }
  }, [tsxCode]);

  const handleSave = useCallback(async () => {
    if (!tsxCode || saveInProgressRef.current) return;

    saveInProgressRef.current = true;
    try {
      const savePath = await saveFileDialog(`${options.componentName || 'Icon'}.tsx`);
      if (!savePath) {
        saveInProgressRef.current = false;
        return;
      }
      await saveTsxFile(savePath, tsxCode);
      toast.success('파일이 저장되었습니다');
    } catch (err) {
      toast.error('파일 저장에 실패했습니다', {
        description: err instanceof Error ? err.message : undefined,
      });
    } finally {
      saveInProgressRef.current = false;
    }
  }, [tsxCode, options.componentName]);

  // 키보드 단축키 설정
  useKeyboardShortcuts({
    onSwitchToInput: () => fileInputRef.current?.click(),
    onSwitchToPreview: () => setActiveTab('preview'),
    onSwitchToOptions: () => setActiveTab('options'),
    onSave: handleSave,
    onCopy: handleCopy,
    onShowHelp: () => setShowShortcutsHelp(true),
  });

  return (
    <div className={cn('h-screen flex flex-col overflow-hidden', className)}>
      {/* Drag Overlay */}
      {isDragging && (
        <div className="fixed inset-0 z-50 bg-primary/10 backdrop-blur-sm flex items-center justify-center pointer-events-none">
          <div className="bg-background border-2 border-dashed border-primary rounded-xl p-8 text-center">
            <p className="text-lg font-medium">SVG 파일을 여기에 놓으세요</p>
            <p className="text-sm text-muted-foreground mt-1">.svg 파일만 지원됩니다</p>
          </div>
        </div>
      )}

      {/* Header - 고정 */}
      <header className="flex-shrink-0 border-b p-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">SVG2TSX</h1>
          <p className="text-sm text-muted-foreground">Convert SVG to React TSX components</p>
        </div>
        <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
          <FileInput className="mr-2 h-4 w-4" />
          Input
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".svg"
          onChange={handleFileSelect}
          className="hidden"
        />
      </header>

      {/* Main Content - Resizable Panels */}
      <main className="flex-1 flex flex-col min-h-0">
        <ResizablePanelGroup direction="vertical" className="flex-1">
          {/* Preview/Options Panel */}
          <ResizablePanel defaultSize="75%" minSize="300px" className="min-h-0">
            <div className="h-full overflow-x-hidden overflow-y-scroll py-4 pl-4 pr-2">
              <TabsContainer
                svgContent={svgContent}
                options={options}
                onOptionsChange={handleOptionsChange}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
            </div>
          </ResizablePanel>

          {/* Resize Handle */}
          <ResizableHandle withHandle />

          {/* Output Panel */}
          <ResizablePanel defaultSize="25%" minSize="200px" className="min-h-0">
            <TsxOutputPanel code={tsxCode} isLoading={isLoading} error={error} className="h-full" />
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>

      {/* Shortcuts Help Modal */}
      <ShortcutsHelpModal open={showShortcutsHelp} onOpenChange={setShowShortcutsHelp} />
    </div>
  );
};
