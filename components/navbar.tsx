"use client";

import { ModeToggle } from "./mode-toggle";
import Link from "next/link";
import Image from "next/image";
import {
  LogOut,
  Settings,
  User,
  Shield,
  Menu,
  Download,
  Home,
  Newspaper,
  Calendar,
  Utensils,
  Users,
  Rocket,
  ChevronDown,
  Search,
  Bell
} from "lucide-react";
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
  DropdownMenuGroup,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Notifications from './notifications';
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

// List of admin emails
const ADMIN_EMAILS = ['admin@srmap.edu.in'];

// Define navigation links with icons
const navigationLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/feed", label: "Feed", icon: Newspaper },
  { href: "/events", label: "Events", icon: Calendar },
  { href: "/mess", label: "Mess", icon: Utensils },
  { href: "/discover", label: "Discover", icon: Users },
  { href: "/hackathons", label: "Hackathons", icon: Rocket },
];

export default function Navbar() {
  const { user } = useAuth();
  const { toast } = useToast();
  const pathname = usePathname();
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstallButton(false);
    }
  };

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

  // Get user's first name for the avatar
  const userFirstName = user?.displayName?.split(' ')[0] || '';
  const userInitial = userFirstName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader className="border-b pb-4 mb-4">
                <SheetTitle className="flex items-center gap-2">
                  <div className="relative w-8 h-8">
                    <Image
                      src="https://srmap.edu.in/wp-content/uploads/2019/11/SRMAP-Logo-2.png"
                      alt="SRM University AP Logo"
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                  <span>SRM AP Connect</span>
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-1">
                {navigationLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <SheetClose asChild key={link.href}>
                      <Link
                        href={link.href}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors",
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-muted"
                        )}
                      >
                        <link.icon className="h-5 w-5" />
                        {link.label}
                      </Link>
                    </SheetClose>
                  );
                })}

                {user && (
                  <SheetClose asChild>
                    <Link
                      href={`/profile/${user.uid}`}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors",
                        pathname === `/profile/${user.uid}`
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-muted"
                      )}
                    >
                      <User className="h-5 w-5" />
                      Profile
                    </Link>
                  </SheetClose>
                )}
              </div>

              <div className="border-t mt-4 pt-4">
                {isAdmin && (
                  <SheetClose asChild>
                    <Link
                      href="/admin"
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors hover:bg-muted"
                    >
                      <Shield className="h-5 w-5" />
                      Admin Dashboard
                    </Link>
                  </SheetClose>
                )}

                <SheetClose asChild>
                  <Link
                    href="/settings"
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors hover:bg-muted"
                  >
                    <Settings className="h-5 w-5" />
                    Settings
                  </Link>
                </SheetClose>

                {showInstallButton && (
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors hover:bg-muted"
                    onClick={handleInstall}
                  >
                    <Download className="h-5 w-5" />
                    Install App
                  </Button>
                )}
              </div>

              <SheetFooter className="mt-auto border-t pt-4">
                {user ? (
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors hover:bg-destructive/10 hover:text-destructive"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-5 w-5" />
                    Sign Out
                  </Button>
                ) : (
                  <SheetClose asChild>
                    <Link href="/auth" className="w-full">
                      <Button className="w-full" size="sm">
                        Sign In
                      </Button>
                    </Link>
                  </SheetClose>
                )}
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <div className="relative w-8 h-8 md:w-10 md:h-10 mr-2">
              <Image
                src="https://srmap.edu.in/wp-content/uploads/2019/11/SRMAP-Logo-2.png"
                alt="SRM University AP Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="font-semibold text-lg hidden sm:inline-block">SRM AP Connect</span>
          </Link>
        </div>

        {/* Navigation Links - Hidden on Mobile, Visible on Desktop */}
        <nav className="hidden md:flex items-center ml-8 space-x-1">
          {navigationLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2 ml-auto">
          <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
              >
                <Search className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Search</DialogTitle>
              </DialogHeader>
              <div className="flex items-center border rounded-md overflow-hidden mt-2">
                <Search className="h-4 w-4 mx-3 text-muted-foreground" />
                <Input
                  placeholder="Search for anything..."
                  className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Quick Links</h4>
                <div className="grid grid-cols-2 gap-2">
                  {navigationLinks.map((link) => (
                    <DialogClose asChild key={link.href}>
                      <Link
                        href={link.href}
                        className="flex items-center gap-2 p-2 rounded-md hover:bg-muted"
                      >
                        <link.icon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{link.label}</span>
                      </Link>
                    </DialogClose>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {user && (
            <Notifications />
          )}

          {showInstallButton && (
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
              onClick={handleInstall}
              title="Install App"
            >
              <Download className="h-5 w-5" />
            </Button>
          )}

          <ModeToggle />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 p-0">
                  <Avatar className="h-8 w-8">
                    {user.photoURL ? (
                      <AvatarImage src={user.photoURL} alt={user.displayName || 'User'} />
                    ) : (
                      <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {userInitial}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.displayName}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
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
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
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