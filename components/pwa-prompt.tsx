'use client';

import { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { X } from 'lucide-react';

export function PWAPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if user has previously dismissed the prompt
    const hasUserDismissed = localStorage.getItem('pwaPromptDismissed');
    if (hasUserDismissed === 'true') {
      return;
    }

    // Show prompt after a delay
    const timer = setTimeout(() => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      if (!isStandalone) {
        setShowPrompt(true);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setShowPrompt(false);
    // Store user's preference
    localStorage.setItem('pwaPromptDismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="relative max-w-lg w-full p-6">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2"
          onClick={handleDismiss}
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Install SRM AP Connect</h2>
            <p className="text-muted-foreground">
              Install our app for a better experience. You'll get:
            </p>
          </div>

          <ul className="space-y-2 text-muted-foreground">
            <li>• Faster access to features</li>
            <li>• Works offline</li>
            <li>• Better performance</li>
            <li>• Regular updates</li>
          </ul>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="ghost" onClick={handleDismiss}>
              Not now
            </Button>
            <Button onClick={handleDismiss}>
              Install
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
} 