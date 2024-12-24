'use client';

import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function PWAPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-16 left-0 right-0 z-50 p-4 md:bottom-4 md:left-4 md:right-auto">
      <Card className="relative w-full md:w-80">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2"
          onClick={() => setShowPrompt(false)}
        >
          <X className="h-4 w-4" />
        </Button>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Install App
          </CardTitle>
          <CardDescription>
            Install SRM AP Connect for a better experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Access offline</p>
            <p>• Quick launch</p>
            <p>• Better performance</p>
          </div>
          <Button className="mt-4 w-full" onClick={handleInstall}>
            Install Now
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 