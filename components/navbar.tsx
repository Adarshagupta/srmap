"use client";

import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";
import { ModeToggle } from "./mode-toggle";
import Link from "next/link";
import { GraduationCap, LogOut, Settings, User, Shield } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "./auth-provider";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useToast } from "./ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Notifications from './notifications';

// List of admin emails
const ADMIN_EMAILS = ['admin@srmap.edu.in'];

export default function Navbar() {
  const { user } = useAuth();
  const { toast } = useToast();

  const isAdmin = user && ADMIN_EMAILS.includes(user.email || '');

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Signed out successfully",
      });
    } catch (error) {
      toast({
        title: "Error signing out",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6" />
            <span className="font-semibold hidden md:inline-block">SRM University AP</span>
          </Link>
        </div>

        {/* Navigation Links - Hidden on Mobile, Centered on Desktop */}
        <nav className="hidden md:flex items-center justify-center flex-1 px-6">
          <div className="flex items-center space-x-6">
            <Link 
              href="/events" 
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Events
            </Link>
            <Link 
              href="/mess-menu" 
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Mess Menu
            </Link>
            <Link 
              href="/discover" 
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Discover
            </Link>
            {user && (
              <Link 
                href={`/profile/${user.uid}`} 
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Profile
              </Link>
            )}
          </div>
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {user && <Notifications />}
          <ModeToggle />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <Link href={`/profile/${user.uid}`}>
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                </Link>
                {isAdmin && (
                  <Link href="/admin">
                    <DropdownMenuItem>
                      <Shield className="mr-2 h-4 w-4" />
                      Admin Dashboard
                    </DropdownMenuItem>
                  </Link>
                )}
                <Link href="/settings">
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/auth">
              <Button variant="default" size="sm">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}