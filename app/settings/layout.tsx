"use client";

import { AuthCheck } from '@/components/auth-check';

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthCheck>{children}</AuthCheck>;
}