"use client";

import { Calendar, Home, MapPin, Settings, Utensils } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: Calendar, label: 'Events', href: '/events' },
  { icon: Utensils, label: 'Mess', href: '/mess' },
  { icon: MapPin, label: 'Map', href: '/navigation' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t md:hidden">
      <div className="flex justify-around items-center h-16">
        {navItems.map(({ icon: Icon, label, href }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full",
                "transition-colors duration-200",
                isActive 
                  ? "text-primary relative after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:rounded-full after:bg-primary" 
                  : "text-muted-foreground hover:text-primary"
              )}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}