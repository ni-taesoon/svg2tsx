/**
 * 탭 컨테이너
 *
 * Input, Preview, Options 탭을 관리하는 컨테이너
 */

import { FileInput, Eye, Settings } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui';
import { SvgInputPanel } from '@/widgets/svg-input-panel';
import { OptionsPanel } from '@/widgets/options-panel';
import type { ConversionOptions } from '@/entities/options';

export type TabValue = 'input' | 'preview' | 'options';

export interface TabsContainerProps {
  svgContent: string;
  onSvgContentChange: (content: string) => void;
  options: ConversionOptions;
  onOptionsChange: (options: Partial<ConversionOptions>) => void;
  activeTab: TabValue;
  onTabChange: (tab: TabValue) => void;
  className?: string;
}

export const TabsContainer: React.FC<TabsContainerProps> = ({
  svgContent,
  onSvgContentChange,
  options,
  onOptionsChange,
  activeTab,
  onTabChange,
  className,
}) => {
  return (
    <Tabs value={activeTab} onValueChange={(v) => onTabChange(v as TabValue)} className={className}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="input">
          <FileInput className="mr-2 h-4 w-4" />
          Input
        </TabsTrigger>
        <TabsTrigger value="preview">
          <Eye className="mr-2 h-4 w-4" />
          Preview
        </TabsTrigger>
        <TabsTrigger value="options">
          <Settings className="mr-2 h-4 w-4" />
          Options
        </TabsTrigger>
      </TabsList>

      <TabsContent value="input" className="mt-4">
        <SvgInputPanel
          value={svgContent}
          onChange={onSvgContentChange}
          onFileLoaded={(content, fileName) => {
            onSvgContentChange(content);
            // 파일명에서 컴포넌트 이름 추출 (확장자 제거)
            const componentName = fileName.replace(/\.svg$/i, '');
            if (componentName) {
              onOptionsChange({ componentName });
            }
          }}
        />
      </TabsContent>

      <TabsContent value="preview" className="mt-4">
        <div className="border rounded-lg p-8 min-h-[400px] flex items-center justify-center">
          {svgContent ? (
            <div
              dangerouslySetInnerHTML={{ __html: svgContent }}
              className="max-w-full max-h-full"
            />
          ) : (
            <p className="text-muted-foreground">
              No SVG content to preview. Add SVG in the Input tab.
            </p>
          )}
        </div>
      </TabsContent>

      <TabsContent value="options" className="mt-4">
        <OptionsPanel options={options} onOptionsChange={onOptionsChange} />
      </TabsContent>
    </Tabs>
  );
};
