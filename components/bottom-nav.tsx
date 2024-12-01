"use client";

import { Calendar, MapPin, Utensils, Users, Home } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  {
    href: '/',
    label: 'Home',
    icon: Home,
  },
  {
    href: '/events',
    label: 'Events',
    icon: Calendar,
  },
  {
    href: '/mess',
    label: 'Mess',
    icon: Utensils,
  },
  {
    href: '/navigation',
    label: 'Map',
    icon: MapPin,
  },
  {
    href: '/discover',
    label: 'Discover',
    icon: Users,
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <nav className="border-t bg-background/80 backdrop-blur-lg">
        <div className="flex justify-around">
          {links.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-1 flex-col items-center justify-center py-3 px-2 transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}