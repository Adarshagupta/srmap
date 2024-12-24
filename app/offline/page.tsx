'use client';

import { WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function OfflinePage() {
  return (
    <div className="container max-w-lg min-h-[80vh] flex items-center justify-center p-4">
      <Card className="w-full">
        <CardContent className="flex flex-col items-center text-center p-6 space-y-4">
          <div className="p-4 bg-muted rounded-full">
            <WifiOff className="h-8 w-8 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold">You're Offline</h1>
          <p className="text-muted-foreground">
            Please check your internet connection and try again.
            Some features may be available offline.
          </p>
          <div className="flex gap-2">
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
            <Button variant="outline" onClick={() => window.history.back()}>
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 