/**
 * TSX 파일 저장 버튼 컴포넌트
 *
 * 파일 저장 다이얼로그를 열고 TSX 코드를 저장
 */

import { useState } from 'react';
import { Check, Download } from 'lucide-react';
import { Button, toast } from '@/shared/ui';
import { t } from '@/i18n';
import { saveFileDialog, saveTsxFile } from '@/shared/api';

export interface SaveFileButtonProps {
  content: string;
  defaultFileName?: string;
  className?: string;
}

export const SaveFileButton: React.FC<SaveFileButtonProps> = ({
  content,
  defaultFileName = 'Icon.tsx',
  className,
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = async () => {
    if (!content) return;

    setIsSaving(true);

    try {
      const savePath = await saveFileDialog(defaultFileName);
      if (!savePath) {
        // 사용자가 취소함
        setIsSaving(false);
        return;
      }

      await saveTsxFile(savePath, content);
      setIsSaved(true);
      toast.success(t('toast.fileSaved'));
      setTimeout(() => setIsSaved(false), 2000);
    } catch (err) {
      toast.error(t('toast.fileSaveFailed'), {
        description: err instanceof Error ? err.message : undefined,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleSave}
      className={className}
      disabled={!content || isSaving}
      aria-label={isSaved ? t('saveButton.ariaSaved') : t('saveButton.ariaSave')}
    >
      {isSaved ? <Check className="h-4 w-4" /> : <Download className="h-4 w-4" />}
    </Button>
  );
};
