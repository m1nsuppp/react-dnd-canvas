import './globals.css';
import { type ReactNode } from 'react';
import { type Metadata } from 'next';
import { TanstackQueryProvider } from './_shared/contexts/tanstack-query-provider';

export const metadata: Metadata = {
  title: 'Web API Image Processing',
  description: 'Web API Image Processing',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>): ReactComponent {
  return (
    <html lang="ko">
      <body className="min-h-screen antialiased">
        <TanstackQueryProvider>{children}</TanstackQueryProvider>
      </body>
    </html>
  );
}
