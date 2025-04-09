"use client";

import { useAuthGuard } from '@/hooks/use-auth-guard';
import { useAuth } from '@/components/auth-provider';
import { redirect } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { AdminSidebar } from '@/components/admin-sidebar';

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

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 md:pl-64">
        <main className="py-6">
          {children}
        </main>
      </div>
    </div>
  );
}