import './globals.css';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import Navbar from '@/components/navbar';
import BottomNav from '@/components/bottom-nav';
import { OfflineBanner } from '@/components/offline-banner';
import type { Metadata, Viewport } from 'next';
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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0f172a',
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: {
    default: 'SRM AP Connect',
    template: '%s | SRM AP Connect',
  },
  description: 'Experience excellence in education at our state-of-the-art campus. Your journey to success begins here.',
  keywords: [
    'SRM AP',
    'university',
    'education',
    'engineering',
    'campus',
    'college',
    'student portal',
    'mess menu',
    'events',
    'navigation',
  ],
  authors: [{ name: 'SRM University AP' }],
  creator: 'SRM University AP',
  publisher: 'SRM University AP',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://srmap.edu.in'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://srmap.edu.in',
    title: 'SRM AP Connect',
    description: 'Experience excellence in education at our state-of-the-art campus. Your journey to success begins here.',
    siteName: 'SRM AP Connect',
    images: [
      {
        url: 'https://srmap.edu.in/wp-content/uploads/2019/11/SRMAP-Logo-2.png',
        width: 1200,
        height: 630,
        alt: 'SRM University AP',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SRM AP Connect',
    description: 'Experience excellence in education at our state-of-the-art campus. Your journey to success begins here.',
    creator: '@SRMAP_Official',
    images: ['https://srmap.edu.in/wp-content/uploads/2019/11/SRMAP-Logo-2.png'],
  },
  verification: {
    google: 'your-google-site-verification',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/icons/favicon.ico',
    shortcut: '/icons/favicon.ico',
    apple: '/icons/ios/ios-appicon-180-180.png',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/icons/ios/ios-appicon-180-180.png',
    },
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'SRM AP Connect',
  },
  applicationName: 'SRM AP Connect',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
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