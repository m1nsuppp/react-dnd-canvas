'use client';

import { useRef } from 'react';
import { StageWrapper } from './stage-wrapper';

interface StageProps {
  projectId: string;
}

export function Stage({ projectId }: StageProps): ReactComponent {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <StageWrapper
      onResize={(width, height) => {
        if (!canvasRef.current) {
          return;
        }

        canvasRef.current.width = width;
        canvasRef.current.height = height;
      }}
    >
      <canvas
        className="w-full h-full"
        ref={canvasRef}
      />
    </StageWrapper>
  );
}
