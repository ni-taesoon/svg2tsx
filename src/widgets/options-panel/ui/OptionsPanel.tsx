/**
 * 옵션 패널 위젯
 *
 * 변환 옵션 설정 UI (컴포넌트 이름, TypeScript, memo, forwardRef 등)
 */

import { Input, Label } from '@/shared/ui';
import { OptionToggle } from '@/features/toggle-option';
import type { ConversionOptions } from '@/entities/options';

export interface OptionsPanelProps {
  options: ConversionOptions;
  onOptionsChange: (options: Partial<ConversionOptions>) => void;
  className?: string;
}

export const OptionsPanel: React.FC<OptionsPanelProps> = ({
  options,
  onOptionsChange,
  className,
}) => {
  return (
    <div className={className}>
      <div className="space-y-6 mb-8">
        {/* Component Name */}
        <div className="space-y-2">
          <Label htmlFor="componentName">Component Name</Label>
          <Input
            id="componentName"
            value={options.componentName}
            onChange={(e) => onOptionsChange({ componentName: e.target.value })}
            placeholder="Icon"
            aria-label="Component name"
          />
        </div>

        {/* TypeScript Toggle */}
        <OptionToggle
          id="typescript"
          label="TypeScript"
          description="Generate TypeScript types"
          checked={options.typescript ?? true}
          onCheckedChange={(checked) => onOptionsChange({ typescript: checked })}
        />

        {/* Spread Props Toggle */}
        <OptionToggle
          id="spreadProps"
          label="Spread Props"
          description="Spread props to SVG element (...props)"
          checked={options.spreadProps ?? true}
          onCheckedChange={(checked) => onOptionsChange({ spreadProps: checked })}
        />

        {/* Memo Toggle */}
        <OptionToggle
          id="useMemo"
          label="React.memo"
          description="Wrap component with React.memo"
          checked={options.useMemo ?? false}
          onCheckedChange={(checked) => onOptionsChange({ useMemo: checked })}
        />

        {/* ForwardRef Toggle */}
        <OptionToggle
          id="useForwardRef"
          label="forwardRef"
          description="Support ref forwarding"
          checked={options.useForwardRef ?? false}
          onCheckedChange={(checked) => onOptionsChange({ useForwardRef: checked })}
        />

        {/* Optimize Toggle */}
        <OptionToggle
          id="optimize"
          label="Optimize SVG"
          description="Apply SVG optimization (remove unnecessary attributes)"
          checked={options.optimize ?? true}
          onCheckedChange={(checked) => onOptionsChange({ optimize: checked })}
        />
      </div>
    </div>
  );
};
