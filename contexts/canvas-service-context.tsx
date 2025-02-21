'use client';

import { createCanvasService, type CanvasService } from '@/lib/canvas';
import { createContext, useContext, useState, type ReactNode } from 'react';

export const CanvasServiceContext = createContext<CanvasService | undefined>(undefined);
CanvasServiceContext.displayName = 'CanvasServiceContext';

export function CanvasServiceProvider({ children }: { children: ReactNode }) {
  const [canvasService] = useState(() => {
    return createCanvasService();
  });

  return (
    <CanvasServiceContext.Provider value={canvasService}>{children}</CanvasServiceContext.Provider>
  );
}

export function useCanvasService(): CanvasService {
  const context = useContext(CanvasServiceContext);
  if (context === undefined) {
    throw new Error('useCanvasService must be used within a CanvasServiceProvider');
  }

  return context;
}
