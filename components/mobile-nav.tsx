"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Newspaper, Menu, User, Utensils } from "lucide-react";
import { useAuth } from "./auth-provider";

export function MobileNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  const links = [
    {
      href: "/",
      label: "Home",
      icon: Home,
    },
    {
      href: "/mess",
      label: "Mess",
      icon: Utensils,
    },
    {
      href: "/feed",
      label: "Feed",
      icon: Newspaper,
    },
    {
      href: "/discover",
      label: "Discover",
      icon: Menu,
    },
    ...(user ? [{
      href: `/profile/${user.uid}`,
      label: "Profile",
      icon: User,
    }] : []),
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden">
      <nav className="container flex h-16 items-center justify-around">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-col items-center gap-1 text-muted-foreground transition-colors hover:text-foreground",
              pathname === href && "text-foreground"
            )}
          >
            <Icon className="h-5 w-5" />
            <span className="text-xs">{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
} 