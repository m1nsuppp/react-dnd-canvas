'use client';

import { useCallback, useRef, type ReactNode } from 'react';

interface StageWrapperProps {
  children: ReactNode;
  onResize?: (width: number, height: number) => void;
}

export function StageWrapper({
  children,
  onResize,
}: StageWrapperProps): ReactComponent {
  const { containerRef, targetRef } = useSquareContainer({
    onResize,
  });

  return (
    <div
      ref={containerRef}
      className="w-full h-full p-10 flex justify-center items-center"
    >
      <div
        ref={targetRef}
        className="w-full h-full outline outline-1 outline-blue-300 rounded"
      >
        {children}
      </div>
    </div>
  );
}

function useSquareContainer(options?: {
  onResize?: (width: number, height: number) => void;
}) {
  const { onResize } = options || {};

  const targetRef = useRef<HTMLDivElement>(null);

  const containerRef = useCallback((node: HTMLDivElement | null) => {
    if (!node) {
      return;
    }

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (!targetRef.current) {
          return;
        }

        const { width, height } = entry.contentRect;
        const minDimension = Math.min(width, height);

        console.log(minDimension);

        targetRef.current.style.maxWidth = `${minDimension}px`;
        targetRef.current.style.maxHeight = `${minDimension}px`;
        onResize?.(minDimension, minDimension);
      }
    });

    ro.observe(node);

    return () => {
      ro.unobserve(node);
      ro.disconnect();
    };
  }, []);

  return { containerRef, targetRef };
}
