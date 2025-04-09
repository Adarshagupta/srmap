"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Users, 
  Settings, 
  Bell, 
  Calendar, 
  Trophy, 
  BarChart, 
  Utensils,
  Menu,
  X,
  Code
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

const adminRoutes = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: Home
  },
  {
    name: 'Users',
    href: '/admin/users',
    icon: Users
  },
  {
    name: 'Events',
    href: '/admin/events',
    icon: Calendar
  },
  {
    name: 'Hackathons',
    href: '/admin/hackathons',
    icon: Code
  },
  {
    name: 'Statistics',
    href: '/admin/statistics',
    icon: BarChart
  },
  {
    name: 'Mess',
    href: '/admin/mess',
    icon: Utensils
  },
  {
    name: 'Notifications',
    href: '/admin/notifications',
    icon: Bell
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: Settings
  }
];

interface AdminSidebarProps {
  className?: string;
}

export function AdminSidebar({ className }: AdminSidebarProps) {
  const pathname = usePathname();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(path + '/');
  };

  return (
    <>
      {/* Mobile Nav Toggle */}
      <Button
        variant="outline"
        size="icon"
        className="md:hidden fixed top-4 left-4 z-50"
        onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
      >
        {isMobileNavOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        <span className="sr-only">Toggle Menu</span>
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-background border-r border-border transition-transform duration-300 ease-in-out md:translate-x-0",
          isMobileNavOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
      >
        <div className="h-full flex flex-col">
          <div className="p-6">
            <h2 className="text-2xl font-bold">Admin Panel</h2>
            <p className="text-muted-foreground text-sm">Manage your application</p>
          </div>
          <ScrollArea className="flex-1 px-3">
            <nav className="space-y-1 py-2">
              {adminRoutes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  <Button
                    variant={isActive(route.href) ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      isActive(route.href) 
                        ? "bg-primary text-primary-foreground" 
                        : "hover:bg-muted"
                    )}
                  >
                    <route.icon className="mr-2 h-4 w-4" />
                    {route.name}
                  </Button>
                </Link>
              ))}
            </nav>
          </ScrollArea>
          <div className="p-4 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              &copy; {new Date().getFullYear()} SRM University AP
            </p>
          </div>
        </div>
      </div>

      {/* Backdrop for mobile */}
      {isMobileNavOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsMobileNavOpen(false)}
        />
      )}
    </>
  );
} 