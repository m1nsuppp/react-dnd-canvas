'use client';

import { createCanvasAPI, type CanvasAPI } from '@/lib/canvas-api';
import { createContext, type ReactNode, useContext, useState } from 'react';

export const CanvasAPIContext = createContext<CanvasAPI | undefined>(undefined);
CanvasAPIContext.displayName = 'CanvasAPIContext';

export function CanvasAPIProvider({ children }: { children: ReactNode }): ReactComponent {
  const [canvasAPI] = useState<CanvasAPI>(() => {
    return createCanvasAPI();
  });

  return <CanvasAPIContext.Provider value={canvasAPI}>{children}</CanvasAPIContext.Provider>;
}

export function useCanvasAPI(): CanvasAPI {
  const context = useContext(CanvasAPIContext);

  if (!context) {
    throw new Error('useCanvasAPI must be used within a CanvasAPIProvider');
  }

  return context;
}
