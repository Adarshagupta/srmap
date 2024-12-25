"use client";

import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";
import { ModeToggle } from "./mode-toggle";
import Link from "next/link";
import Image from "next/image";
import { LogOut, Settings, User, Shield, Menu } from "lucide-react";
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
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
      <div className="container flex h-14 items-center">
        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 mt-6">
                <Link 
                  href="/feed" 
                  className="flex items-center text-sm font-medium transition-colors hover:text-primary"
                >
                  Feed
                </Link>
                <Link 
                  href="/events" 
                  className="flex items-center text-sm font-medium transition-colors hover:text-primary"
                >
                  Events
                </Link>
                <Link 
                  href="/mess-menu" 
                  className="flex items-center text-sm font-medium transition-colors hover:text-primary"
                >
                  Mess Menu
                </Link>
                <Link 
                  href="/discover" 
                  className="flex items-center text-sm font-medium transition-colors hover:text-primary"
                >
                  Discover
                </Link>
                {user && (
                  <Link 
                    href={`/profile/${user.uid}`} 
                    className="flex items-center text-sm font-medium transition-colors hover:text-primary"
                  >
                    Profile
                  </Link>
                )}
                {isAdmin && (
                  <Link 
                    href="/admin" 
                    className="flex items-center text-sm font-medium transition-colors hover:text-primary"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <Link 
                  href="/settings" 
                  className="flex items-center text-sm font-medium transition-colors hover:text-primary"
                >
                  Settings
                </Link>
                {user && (
                  <Button 
                    variant="ghost" 
                    className="justify-start px-0 font-medium hover:text-destructive" 
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo */}
        <div className="flex items-center flex-shrink-0 ml-2">
          <Link href="/" className="flex items-center">
            <div className="relative w-20 h-10 md:w-24 md:h-12">
              <Image
                src="https://srmap.edu.in/wp-content/uploads/2019/11/SRMAP-Logo-2.png"
                alt="SRM University AP Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>
        </div>

        {/* Navigation Links - Hidden on Mobile, Centered on Desktop */}
        <nav className="hidden md:flex items-center justify-center flex-1 px-6">
          <div className="flex items-center space-x-6">
            <Link 
              href="/feed" 
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Feed
            </Link>
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
        <div className="flex items-center gap-2 ml-auto">
          {user && <Notifications />}
          <ModeToggle />
          {user ? (
            <div className="hidden md:block">
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
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
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