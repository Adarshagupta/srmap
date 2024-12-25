import './globals.css';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import Navbar from '@/components/navbar';
import BottomNav from '@/components/bottom-nav';
import { OfflineBanner } from '@/components/offline-banner';
import type { Metadata, Viewport } from 'next';
import { PWAPrompt } from '@/components/pwa-prompt';
import Notifications from '@/components/notifications';
import { MobileNav } from '@/components/mobile-nav';
import { AuthProvider } from '@/components/auth-provider';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';

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
      <body className={cn(
        inter.className,
        "min-h-screen bg-background antialiased pb-16 md:pb-0"
      )}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-6 pb-20 md:pb-6">
              {children}
            </main>
            <BottomNav />
            <OfflineBanner />
            <PWAPrompt />
            <MobileNav />
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}