'use client';

import { useEffect, useRef } from 'react';

export function Canvas(): React.JSX.Element {
  const grandParentRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const grandParentElement = grandParentRef.current;
    const parentElement = parentRef.current;
    const canvasElement = canvasRef.current;

    if (!grandParentElement || !parentElement || !canvasElement) {
      return;
    }

    const grandParentElementResizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        parentElement.style.maxWidth = `${entry.contentRect.width}px`;
        parentElement.style.maxHeight = `${entry.contentRect.width}px`;

        const dpr = window.devicePixelRatio;
        canvasElement.style.maxWidth = `${entry.contentRect.width}px`;
        canvasElement.style.maxHeight = `${entry.contentRect.width}px`;
        canvasElement.width = entry.contentRect.width * dpr;
        canvasElement.height = entry.contentRect.width * dpr;
      }
    });

    grandParentElementResizeObserver.observe(grandParentElement);

    return () => {
      grandParentElementResizeObserver.unobserve(grandParentElement);
    };
  }, []);

  return (
    <div
      ref={grandParentRef}
      className="w-full h-full flex justify-center items-center p-9"
    >
      <div
        ref={parentRef}
        className="w-full h-full"
      >
        <canvas
          className="w-full h-full outline outline-1 outline-green-600"
          ref={canvasRef}
        />
      </div>
    </div>
  );
}
