/**
 * TSX 파일 저장 버튼 컴포넌트
 *
 * 파일 저장 다이얼로그를 열고 TSX 코드를 저장
 */

import { useState } from 'react';
import { Check, Download } from 'lucide-react';
import { Button, toast } from '@/shared/ui';
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
      toast.success('파일이 저장되었습니다');
      setTimeout(() => setIsSaved(false), 2000);
    } catch (err) {
      toast.error('파일 저장에 실패했습니다', {
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
      aria-label={isSaved ? 'File saved' : 'Save as TSX file'}
    >
      {isSaved ? <Check className="h-4 w-4" /> : <Download className="h-4 w-4" />}
    </Button>
  );
};
