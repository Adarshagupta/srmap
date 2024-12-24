"use client";

import { Calendar, Utensils, Users, Home, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  {
    href: '/',
    label: 'Home',
    icon: Home,
  },
  {
    href: '/mess',
    label: 'Mess',
    icon: Utensils,
  },
  {
    href: '/events',
    label: 'Events',
    icon: Calendar,
  },
  {
    href: '/discover',
    label: 'Connect',
    icon: Users,
  },
  {
    href: '/profile',
    label: 'Profile',
    icon: User,
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <nav className="border-t bg-background/95 backdrop-blur-xl shadow-lg">
        <div className="flex justify-around">
          {links.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-1 flex-col items-center justify-center py-3 px-2 transition-all hover:bg-accent/50 ${
                  isActive 
                    ? 'text-primary border-t-2 border-primary -mt-[2px] bg-accent/30' 
                    : 'text-muted-foreground'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'animate-bounce-once' : ''}`} />
                <span className="text-xs font-medium mt-1">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}