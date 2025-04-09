"use client";

import { useState, useEffect } from 'react';
import Navbar from '@/components/navbar';
import BottomNav from '@/components/bottom-nav';
import { OfflineBanner } from '@/components/offline-banner';
import { PWAPrompt } from '@/components/pwa-prompt';
import { AuthProvider } from '@/components/auth-provider';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { Button } from '@/components/ui/button';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Check if user has previously dismissed the prompt
    const hasUserDismissed = localStorage.getItem('installPromptDismissed');
    if (hasUserDismissed === 'true') {
      return;
    }

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstallPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    // Store user's preference
    localStorage.setItem('installPromptDismissed', 'true');
  };

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <div className="min-h-screen bg-background antialiased pb-16 md:pb-0">
          <Navbar />
          <main className="flex-1 container mx-auto px-4 py-2 pb-20 md:pb-6">
            {children}
          </main>
          <BottomNav />
          <OfflineBanner />
          <PWAPrompt />
          <Toaster />
          {showInstallPrompt && (
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t flex items-center justify-between">
              <div>
                <h4 className="font-semibold">Install SRM AP Connect</h4>
                <p className="text-sm text-muted-foreground">Get the best experience</p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={handleDismiss}>Not now</Button>
                <Button onClick={handleInstallClick}>Install</Button>
              </div>
            </div>
          )}
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}