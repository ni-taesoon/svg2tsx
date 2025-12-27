/**
 * 탭 컨테이너
 *
 * Preview, Options 탭을 관리하는 컨테이너
 */

import { Eye, Settings } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui';
import { OptionsPanel } from '@/widgets/options-panel';
import type { ConversionOptions } from '@/entities/options';

export type TabValue = 'preview' | 'options';

export interface TabsContainerProps {
  svgContent: string;
  options: ConversionOptions;
  onOptionsChange: (options: Partial<ConversionOptions>) => void;
  activeTab: TabValue;
  onTabChange: (tab: TabValue) => void;
  className?: string;
}

export const TabsContainer: React.FC<TabsContainerProps> = ({
  svgContent,
  options,
  onOptionsChange,
  activeTab,
  onTabChange,
  className,
}) => {
  return (
    <Tabs value={activeTab} onValueChange={(v) => onTabChange(v as TabValue)} className={className}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="preview">
          <Eye className="mr-2 h-4 w-4" />
          Preview
        </TabsTrigger>
        <TabsTrigger value="options">
          <Settings className="mr-2 h-4 w-4" />
          Options
        </TabsTrigger>
      </TabsList>

      <TabsContent value="preview" className="mt-4">
        <div className="border rounded-lg p-8 min-h-[400px] flex items-center justify-center">
          {svgContent ? (
            <div
              dangerouslySetInnerHTML={{ __html: svgContent }}
              className="max-w-full max-h-full"
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              No SVG content to preview. Click Input button to add SVG.
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
