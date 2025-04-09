"use client";

import { Calendar, Utensils, Users, Home, User, Newspaper, Rocket } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from './auth-provider';
import { cn } from '@/lib/utils';

// Match the navigation links from navbar.tsx
const navigationLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/feed", label: "Feed", icon: Newspaper },
  { href: "/events", label: "Events", icon: Calendar },
  { href: "/mess", label: "Mess", icon: Utensils },
  { href: "/discover", label: "Discover", icon: Users },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <nav className="border-t bg-background/95 backdrop-blur-xl shadow-lg">
        <div className="grid grid-cols-5 h-14">
          {navigationLinks.slice(0, 5).map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center justify-center transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
                aria-label={label}
              >
                <div className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full",
                  isActive ? "bg-primary/10" : ""
                )}>
                  <Icon className="h-5 w-5" />
                </div>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}