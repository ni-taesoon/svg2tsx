/**
 * SVG Preview 컴포넌트
 *
 * 확대/축소 및 드래그 패닝을 지원하는 SVG 미리보기
 */

import { TransformWrapper, TransformComponent, useControls } from 'react-zoom-pan-pinch';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { Button } from '@/shared/ui';

interface SvgPreviewProps {
  svgContent: string;
}

const ZoomControls = () => {
  const { zoomIn, zoomOut, resetTransform } = useControls();

  return (
    <div className="absolute top-2 right-2 flex gap-1 z-10">
      <Button
        variant="outline"
        size="icon"
        onClick={() => zoomIn()}
        title="확대"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => zoomOut()}
        title="축소"
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => resetTransform()}
        title="원래 크기"
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
    </div>
  );
};

export const SvgPreview: React.FC<SvgPreviewProps> = ({ svgContent }) => {
  if (!svgContent) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-sm text-muted-foreground">
          No SVG content to preview. Click Input button to add SVG.
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-full">
      <TransformWrapper
        initialScale={1}
        minScale={0.1}
        maxScale={10}
        centerOnInit
      >
        <ZoomControls />
        <TransformComponent
          wrapperStyle={{ width: '100%', height: '100%' }}
          contentStyle={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
          }}
        >
          <div
            dangerouslySetInnerHTML={{ __html: svgContent }}
            className="max-w-full max-h-full"
          />
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
};
