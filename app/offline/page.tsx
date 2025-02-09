'use client';

import { WifiOff, Home, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export default function OfflinePage() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="container max-w-lg min-h-[80vh] flex items-center justify-center p-4">
      <Card className="w-full">
        <CardContent className="flex flex-col items-center text-center p-6 space-y-4">
          <div className="p-4 bg-muted rounded-full">
            <WifiOff className="h-8 w-8 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold">You're Offline</h1>
          <p className="text-muted-foreground">
            Don't worry! You can still access previously viewed pages and essential features.
            The app will automatically sync when you're back online.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button onClick={handleRefresh} className="flex items-center gap-2">
              <RefreshCcw className="h-4 w-4" />
              Try Again
            </Button>
            <Link href="/" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full flex items-center gap-2">
                <Home className="h-4 w-4" />
                Go to Homepage
              </Button>
            </Link>
          </div>
          <div className="text-sm text-muted-foreground pt-4 border-t">
            <p>Available Offline Features:</p>
            <ul className="mt-2 space-y-1">
              <li>• View cached pages</li>
              <li>• Access saved content</li>
              <li>• Basic navigation</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 