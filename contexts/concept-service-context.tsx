'use client';

import { createConceptService, type ConceptService } from '@/lib/concept';
import { createContext, useContext, useState, type ReactNode } from 'react';

export const ConceptServiceContext = createContext<ConceptService | undefined>(undefined);

export function ConceptServiceProvider({ children }: { children: ReactNode }) {
  const [conceptService] = useState(() => {
    return createConceptService();
  });

  return (
    <ConceptServiceContext.Provider value={conceptService}>
      {children}
    </ConceptServiceContext.Provider>
  );
}

export function useConceptService(): ConceptService {
  const context = useContext(ConceptServiceContext);
  if (context === undefined) {
    throw new Error('useConceptService must be used within a ConceptServiceProvider');
  }

  return context;
}
