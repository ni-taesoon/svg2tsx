/**
 * 옵션 패널 위젯
 *
 * 변환 옵션 설정 UI (컴포넌트 이름, TypeScript, memo, forwardRef 등)
 */

import { Input, Label } from '@/shared/ui';
import { OptionToggle } from '@/features/toggle-option';
import type { ConversionOptions } from '@/entities/options';
import { t } from '@/i18n';

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
          <Label htmlFor="componentName">{t('options.componentName.label')}</Label>
          <Input
            id="componentName"
            value={options.componentName}
            onChange={(e) => onOptionsChange({ componentName: e.target.value })}
            placeholder={t('options.componentName.placeholder')}
            aria-label={t('options.componentName.aria')}
          />
        </div>

        {/* TypeScript Toggle */}
        <OptionToggle
          id="typescript"
          label={t('options.typescript.label')}
          description={t('options.typescript.description')}
          checked={options.typescript ?? true}
          onCheckedChange={(checked) => onOptionsChange({ typescript: checked })}
        />

        {/* Spread Props Toggle */}
        <OptionToggle
          id="spreadProps"
          label={t('options.spreadProps.label')}
          description={t('options.spreadProps.description')}
          checked={options.spreadProps ?? true}
          onCheckedChange={(checked) => onOptionsChange({ spreadProps: checked })}
        />

        {/* Memo Toggle */}
        <OptionToggle
          id="useMemo"
          label={t('options.memo.label')}
          description={t('options.memo.description')}
          checked={options.useMemo ?? false}
          onCheckedChange={(checked) => onOptionsChange({ useMemo: checked })}
        />

        {/* ForwardRef Toggle */}
        <OptionToggle
          id="useForwardRef"
          label={t('options.forwardRef.label')}
          description={t('options.forwardRef.description')}
          checked={options.useForwardRef ?? false}
          onCheckedChange={(checked) => onOptionsChange({ useForwardRef: checked })}
        />

        {/* Optimize Toggle */}
        <OptionToggle
          id="optimize"
          label={t('options.optimize.label')}
          description={t('options.optimize.description')}
          checked={options.optimize ?? true}
          onCheckedChange={(checked) => onOptionsChange({ optimize: checked })}
        />
      </div>
    </div>
  );
};
