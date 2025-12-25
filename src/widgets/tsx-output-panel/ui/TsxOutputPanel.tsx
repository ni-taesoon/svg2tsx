/**
 * TSX 출력 패널 위젯
 *
 * 변환된 TSX 코드 미리보기 및 복사 기능
 */

import { CodePreview } from '@/shared/ui';
import { CopyCodeButton } from '@/features/copy-code';

export interface TsxOutputPanelProps {
  code: string;
  isLoading?: boolean;
  error?: string | null;
  className?: string;
}

export const TsxOutputPanel: React.FC<TsxOutputPanelProps> = ({
  code,
  isLoading,
  error,
  className,
}) => {
  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-2 px-4 pt-4">
        <h3 className="text-sm font-medium">Output</h3>
        <CopyCodeButton code={code} />
      </div>

      <div className="px-4 pb-4">
        {error ? (
          <div className="text-destructive text-sm p-4 border border-destructive rounded-lg bg-destructive/10">
            {error}
          </div>
        ) : isLoading ? (
          <div className="text-muted-foreground text-sm p-4">
            Converting SVG to TSX...
          </div>
        ) : code ? (
          <CodePreview code={code} language="tsx" />
        ) : (
          <div className="text-muted-foreground text-sm p-4 border border-dashed rounded-lg">
            No output yet. Convert SVG to see the result.
          </div>
        )}
      </div>
    </div>
  );
};
