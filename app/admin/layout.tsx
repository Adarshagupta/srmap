"use client";

import { useAuthGuard } from '@/hooks/use-auth-guard';
import { useAuth } from '@/components/auth-provider';
import { redirect } from 'next/navigation';
import { Loader2 } from 'lucide-react';

// List of admin emails
const ADMIN_EMAILS = ['admin@srmap.edu.in'];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuthGuard();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Check if user is admin
  if (!user || !ADMIN_EMAILS.includes(user.email || '')) {
    redirect('/');
  }

  return <>{children}</>;
}