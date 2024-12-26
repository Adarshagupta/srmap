import './globals.css';
import { Inter } from 'next/font/google';
import type { Metadata, Viewport } from 'next';
import ClientLayout from './client-layout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SRM University AP',
  description: 'SRM University AP Student Portal',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}