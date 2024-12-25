"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { Loader2 } from 'lucide-react';

export default function ProfileRedirect() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/auth');
      } else {
        router.push(`/profile/${user.uid}`);
      }
    }
  }, [user, authLoading, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
} 