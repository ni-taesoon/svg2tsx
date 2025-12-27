/**
 * 탭 컨테이너
 *
 * Preview, Options 탭을 관리하는 컨테이너
 */

import { Eye, Settings } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui';
import { OptionsPanel } from '@/widgets/options-panel';
import { cn } from '@/shared/lib/utils';
import type { ConversionOptions } from '@/entities/options';
import { SvgPreview } from './SvgPreview';

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
    <Tabs value={activeTab} onValueChange={(v) => onTabChange(v as TabValue)} className={cn('flex flex-col h-full', className)}>
      <TabsList className="grid w-full grid-cols-2 flex-shrink-0">
        <TabsTrigger value="preview">
          <Eye className="mr-2 h-4 w-4" />
          Preview
        </TabsTrigger>
        <TabsTrigger value="options">
          <Settings className="mr-2 h-4 w-4" />
          Options
        </TabsTrigger>
      </TabsList>

      <TabsContent value="preview" className="mt-4 flex-1 min-h-[300px]">
        <SvgPreview svgContent={svgContent} />
      </TabsContent>

      <TabsContent value="options" className="mt-4">
        <OptionsPanel options={options} onOptionsChange={onOptionsChange} />
      </TabsContent>
    </Tabs>
  );
};
