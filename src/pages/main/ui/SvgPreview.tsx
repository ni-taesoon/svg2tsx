/**
 * SVG Preview 컴포넌트
 *
 * 확대/축소만 지원하는 SVG 미리보기 (패닝 비활성화, 항상 중앙 정렬)
 * CSS transform으로 직접 scale 관리하여 컨테이너 크기 변경에도 중앙 유지
 */

import { useState, useCallback } from 'react';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { Button } from '@/shared/ui';
import { t } from '@/i18n';

interface SvgPreviewProps {
  svgContent: string;
}

const MIN_SCALE = 0.1;
const MAX_SCALE = 10;
const SCALE_STEP = 0.5;

export const SvgPreview: React.FC<SvgPreviewProps> = ({ svgContent }) => {
  const [scale, setScale] = useState(1);

  const handleZoomIn = useCallback(() => {
    setScale((prev) => Math.min(prev + SCALE_STEP, MAX_SCALE));
  }, []);

  const handleZoomOut = useCallback(() => {
    setScale((prev) => Math.max(prev - SCALE_STEP, MIN_SCALE));
  }, []);

  const handleReset = useCallback(() => {
    setScale(1);
  }, []);

  if (!svgContent) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-sm text-muted-foreground">{t('preview.empty')}</p>
      </div>
    );
  }

  return (
    <div className="relative h-full">
      {/* Zoom Controls */}
      <div className="absolute top-2 right-2 flex gap-1 z-10">
        <Button
          variant="outline"
          size="icon"
          onClick={handleZoomIn}
          title={t('preview.zoomInTitle')}
          disabled={scale >= MAX_SCALE}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleZoomOut}
          title={t('preview.zoomOutTitle')}
          disabled={scale <= MIN_SCALE}
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleReset}
          title={t('preview.resetTitle')}
          disabled={scale === 1}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* SVG Container - 항상 중앙 정렬 */}
      <div className="h-full w-full flex items-center justify-center overflow-hidden">
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
            transition: 'transform 150ms ease-out',
          }}
          dangerouslySetInnerHTML={{ __html: svgContent }}
          className="max-w-full max-h-full"
        />
      </div>
    </div>
  );
};
