"use client";

import { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { useToast } from './ui/use-toast';

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    function handleOnline() {
      setIsOffline(false);
      toast({
        title: "Back online",
        description: "Your connection has been restored",
      });
    }

    function handleOffline() {
      setIsOffline(true);
      toast({
        title: "You're offline",
        description: "Some features may be limited",
        variant: "destructive",
      });
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    setIsOffline(!navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);

  if (!isOffline) return null;

  return (
    <Alert variant="destructive" className="fixed bottom-20 left-4 right-4 md:bottom-4 z-50">
      <WifiOff className="h-4 w-4" />
      <AlertDescription>
        You are currently offline. Changes will be synced when your connection is restored.
      </AlertDescription>
    </Alert>
  );
}