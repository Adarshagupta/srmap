import './globals.css';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import Navbar from '@/components/navbar';
import BottomNav from '@/components/bottom-nav';
import { OfflineBanner } from '@/components/offline-banner';
import type { Metadata } from 'next';
import { PWAPrompt } from '@/components/pwa-prompt';

const inter = Inter({ subsets: ['latin'] });

// Register service worker
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(
      (registration) => {
        console.log('ServiceWorker registration successful');
      },
      (err) => {
        console.log('ServiceWorker registration failed: ', err);
      }
    );
  });
}

export const metadata: Metadata = {
  title: {
    default: 'SRM AP Connect',
    template: '%s | SRM AP Connect',
  },
  description: 'Your complete campus companion for SRM University AP',
  manifest: '/manifest.json',
  themeColor: '#0f172a',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'SRM AP Connect',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    shortcut: '/icons/windows11/SmallTile.scale-100.png',
    apple: [
      { url: '/icons/ios/180.png', sizes: '180x180' },
    ],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icons/ios/180.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SRM AP Connect" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#0f172a" />
        <link rel="manifest" href="/manifest.json" />
      </head>
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