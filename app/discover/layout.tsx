"use client";

import { AuthCheck } from '@/components/auth-check';

export default function DiscoverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthCheck>{children}</AuthCheck>;
}