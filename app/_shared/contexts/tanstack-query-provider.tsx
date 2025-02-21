'use client';

import { useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

interface TanstackQueryProviderProps {
  children: ReactNode;
}

export function TanstackQueryProvider({ children }: TanstackQueryProviderProps) {
  const [queryClient] = useState<QueryClient>(() => {
    return new QueryClient();
  });

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
