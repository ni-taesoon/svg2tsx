/**
 * SVG 변환 버튼 컴포넌트
 *
 * SVG를 TSX로 변환하는 액션을 트리거
 */

import { Loader2 } from 'lucide-react';
import { Button } from '@/shared/ui';
import { t } from '@/i18n';

export interface ConvertButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
}

export const ConvertButton: React.FC<ConvertButtonProps> = ({
  onClick,
  isLoading,
  disabled,
  className,
}) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={className}
      aria-label={isLoading ? t('convert.ariaConverting') : t('convert.ariaConvert')}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {t('convert.loading')}
        </>
      ) : (
        t('convert.button')
      )}
    </Button>
  );
};
