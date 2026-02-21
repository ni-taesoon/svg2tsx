/**
 * TSX 출력 패널 위젯
 *
 * 변환된 TSX 코드 미리보기 및 복사 기능
 */

import { CodePreview } from '@/shared/ui';
import { CopyCodeButton } from '@/features/copy-code';
import { SaveFileButton } from '@/features/save-file';
import { cn } from '@/shared/lib/utils';
import { t } from '@/i18n';

export interface TsxOutputPanelProps {
  code: string;
  isLoading?: boolean;
  error?: string | null;
  defaultFileName?: string;
  className?: string;
}

export const TsxOutputPanel: React.FC<TsxOutputPanelProps> = ({
  code,
  isLoading,
  error,
  defaultFileName = 'Icon.tsx',
  className,
}) => {
  return (
    <div className={cn('bg-secondary/50 flex flex-col', className)}>
      {/* Header - 고정 */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 pt-3 pb-2">
        <h3 className="text-sm font-medium">{t('tsxOutput.title')}</h3>
        <div className="flex items-center gap-2">
          <CopyCodeButton code={code} />
          <SaveFileButton content={code} defaultFileName={defaultFileName} />
        </div>
      </div>

      {/* Content - 스크롤 가능 */}
      <div className="flex-1 min-h-0 px-4 pb-3 overflow-hidden">
        {error ? (
          <div className="text-destructive text-sm p-4 border border-destructive rounded-lg bg-destructive/10 overflow-auto h-full">
            {error}
          </div>
        ) : isLoading ? (
          <div className="text-muted-foreground text-sm p-4">{t('tsxOutput.loading')}</div>
        ) : code ? (
          <CodePreview code={code} language="tsx" className="h-full" />
        ) : (
          <div className="text-muted-foreground text-sm p-4 border border-dashed rounded-lg">
            {t('tsxOutput.empty')}
          </div>
        )}
      </div>
    </div>
  );
};
