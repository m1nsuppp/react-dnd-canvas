import './globals.css';
import { type ReactNode } from 'react';
import { type Metadata } from 'next';

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
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
