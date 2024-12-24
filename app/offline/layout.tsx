import type { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0f172a',
};

export const metadata: Metadata = {
  title: 'Offline | SRM AP Connect',
  description: 'You are currently offline. Some features may still be available.',
};

export default function OfflineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 