import './globals.css';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import Navbar from '@/components/navbar';
import BottomNav from '@/components/bottom-nav';
import { OfflineBanner } from '@/components/offline-banner';
import type { Metadata, Viewport } from 'next';
import { PWAPrompt } from '@/components/pwa-prompt';
import Notifications from '@/components/notifications';

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
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-6 pb-20 md:pb-6">
              {children}
            </main>
            <BottomNav />
            <OfflineBanner />
            <PWAPrompt />
          </div>
        </Providers>
      </body>
    </html>
  );
}