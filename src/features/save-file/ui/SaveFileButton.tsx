/**
 * TSX 파일 저장 버튼 컴포넌트
 *
 * 파일 저장 다이얼로그를 열고 TSX 코드를 저장
 */

import { useState } from 'react';
import { Check, Download } from 'lucide-react';
import { Button } from '@/shared/ui';
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
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!content) return;

    setIsSaving(true);
    setError(null);

    try {
      const savePath = await saveFileDialog(defaultFileName);
      if (!savePath) {
        // 사용자가 취소함
        setIsSaving(false);
        return;
      }

      await saveTsxFile(savePath, content);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save file');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="icon"
        onClick={handleSave}
        className={className}
        disabled={!content || isSaving}
        aria-label={isSaved ? 'File saved' : 'Save as TSX file'}
      >
        {isSaved ? (
          <Check className="h-4 w-4" />
        ) : (
          <Download className="h-4 w-4" />
        )}
      </Button>
      {error && (
        <span className="absolute top-full left-0 mt-1 text-xs text-destructive whitespace-nowrap">
          {error}
        </span>
      )}
    </div>
  );
};
