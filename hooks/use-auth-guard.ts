"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';

export function useAuthGuard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      const isPublicPath = pathname === '/auth';
      
      if (!user && !isPublicPath) {
        router.push('/auth');
      }

      if (user && isPublicPath) {
        router.push('/');
      }
    }
  }, [user, loading, pathname, router]);

  return { user, loading };
}