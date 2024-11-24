"use client";

import { useEffect } from 'react';
import { ErrorBoundary } from './error-boundary';

export default function ClientErrorBoundary({
  children
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Handle unhandled promise rejections
    const handler = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
    };

    window.addEventListener('unhandledrejection', handler);
    return () => window.removeEventListener('unhandledrejection', handler);
  }, []);

  return <ErrorBoundary>{children}</ErrorBoundary>;
}