/**
 * 코드 복사 버튼 컴포넌트
 *
 * 클립보드에 코드를 복사하고 시각적 피드백 제공
 */

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Button, toast } from '@/shared/ui';
import { t } from '@/i18n';
import { copyToClipboard } from '../lib/clipboard';

export interface CopyCodeButtonProps {
  code: string;
  className?: string;
}

export const CopyCodeButton: React.FC<CopyCodeButtonProps> = ({ code, className }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(code);
    if (success) {
      setIsCopied(true);
      toast.success(t('toast.copied'));
      setTimeout(() => setIsCopied(false), 2000);
    } else {
      toast.error(t('toast.copyFailed'));
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleCopy}
      className={className}
      disabled={!code}
      data-testid="copy-button"
      aria-label={isCopied ? t('copyButton.ariaCopied') : t('copyButton.ariaCopy')}
    >
      {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
    </Button>
  );
};
