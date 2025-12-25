/**
 * SVG 입력 패널 위젯
 *
 * 파일 드롭/업로드 + 텍스트 입력을 통합한 입력 영역
 */

import { useState, useCallback } from 'react';
import { Upload } from 'lucide-react';
import { Textarea } from '@/shared/ui';

export interface SvgInputPanelProps {
  value: string;
  onChange: (value: string) => void;
  onFileLoaded?: (content: string, fileName: string) => void;
  className?: string;
}

export const SvgInputPanel: React.FC<SvgInputPanelProps> = ({
  value,
  onChange,
  onFileLoaded,
  className,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      const svgFile = files.find((file) => file.name.endsWith('.svg'));

      if (svgFile) {
        const content = await svgFile.text();
        onChange(content);
        onFileLoaded?.(content, svgFile.name);
      }
    },
    [onChange, onFileLoaded]
  );

  const handleFileInput = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && file.name.endsWith('.svg')) {
        const content = await file.text();
        onChange(content);
        onFileLoaded?.(content, file.name);
      }
    },
    [onChange, onFileLoaded]
  );

  return (
    <div className={className}>
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-8 mb-4
          transition-colors cursor-pointer
          ${isDragOver ? 'border-primary bg-primary/5' : 'border-border'}
        `}
      >
        <input
          type="file"
          accept=".svg"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          aria-label="Upload SVG file"
        />
        <div className="flex flex-col items-center gap-2 text-center pointer-events-none">
          <Upload className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm font-medium">
            Drop SVG file here or click to upload
          </p>
          <p className="text-xs text-muted-foreground">
            Supports .svg files only
          </p>
        </div>
      </div>

      {/* Or Divider */}
      <div className="relative mb-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">or</span>
        </div>
      </div>

      {/* Text Input */}
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste SVG code here..."
        className="min-h-[200px] text-sm resize-none"
        aria-label="SVG code input"
      />
    </div>
  );
};
