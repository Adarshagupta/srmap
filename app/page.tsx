import { Card } from '@/components/ui/card';
import UpcomingEvents from '@/components/upcoming-events';
import { BookOpen, Calendar, MapPin, Utensils, Users, Settings, User, Bell, Trophy, Newspaper } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const QuickLinks = [
  {
    icon: Calendar,
    title: 'Events',
    href: '/events',
    color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  },
  {
    icon: Utensils,
    title: 'Mess',
    href: '/mess',
    color: 'bg-green-500/10 text-green-600 dark:text-green-400',
  },
  {
    icon: MapPin,
    title: 'Navigation',
    href: '/navigation',
    color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  },
  {
    icon: Users,
    title: 'Discover',
    href: '/discover',
    color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
  },
  {
    icon: User,
    title: 'Profile',
    href: '/profile',
    color: 'bg-pink-500/10 text-pink-600 dark:text-pink-400',
  },
  {
    icon: Settings,
    title: 'Settings',
    href: '/settings',
    color: 'bg-gray-500/10 text-gray-600 dark:text-gray-400',
  },
];

const Highlights = [
  {
    icon: Trophy,
    title: 'Achievements',
    description: 'Recent student and university accomplishments',
    color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    href: '/achievements',
  },
  {
    icon: Newspaper,
    title: 'News',
    description: 'Latest updates from around the campus',
    color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
    href: '/news',
  },
  {
    icon: BookOpen,
    title: 'About',
    description: 'Learn more about the app and its creator',
    color: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
    href: '/about',
  },
  {
    icon: Bell,
    title: 'Announcements',
    description: 'Important notices and updates',
    color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
    href: '/announcements',
  },
];

export const metadata = {
  title: 'SRM University AP',
  description: 'Experience excellence in education at our state-of-the-art campus. Your journey to success begins here.',
}

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative h-[200px] md:h-[300px] rounded-3xl overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://srmap.edu.in/wp-content/uploads/2017/03/1.jpg"
            alt="SRM AP Campus"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/50 to-transparent dark:from-primary/80 dark:via-primary/40" />
        </div>

        <div className="relative h-full flex flex-col justify-center p-6 md:p-10">
          <div className="flex items-center gap-4 mb-4">
            <Image
              src="https://srmap.edu.in/wp-content/uploads/2019/11/SRMAP-Logo-2.png"
              alt="SRM AP Logo"
              width={60}
              height={60}
              className="rounded-lg bg-white/30 p-1 backdrop-blur-sm"
            />
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-white max-w-2xl">
              Welcome to SRM University AP
            </h1>
          </div>
          <p className="text-base md:text-lg text-white/90 max-w-xl">
            Experience excellence in education at our state-of-the-art campus. 
            Your journey to success begins here.
          </p>
        </div>

        <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-white/10 backdrop-blur-3xl rounded-tl-full transform translate-y-1/4 translate-x-1/4" />
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 backdrop-blur-xl rounded-full transform -translate-y-1/2 translate-x-1/2" />
      </div>

      {/* Quick Links Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {QuickLinks.map((link) => (
          <Link key={link.title} href={link.href}>
            <div className="group hover:scale-105 transition-all duration-200">
              <div className="flex flex-col items-center p-4 rounded-2xl bg-background border border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
                <div className={`w-12 h-12 flex items-center justify-center rounded-xl ${link.color} mb-2`}>
                  <link.icon className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium group-hover:text-primary transition-colors text-center">
                  {link.title}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Highlights Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Highlights.map((highlight) => (
          <Link key={highlight.title} href={highlight.href}>
            <div
              className="group p-6 rounded-2xl border border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200"
            >
              <div className={`w-12 h-12 flex items-center justify-center rounded-xl ${highlight.color} mb-4`}>
                <highlight.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                {highlight.title}
              </h3>
              <p className="text-muted-foreground">
                {highlight.description}
              </p>
            </div>
          </Link>
        ))}
      </div> sir

      {/* Events Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Upcoming Events
            </h2>
            <p className="text-muted-foreground">Stay updated with campus activities</p>
          </div>
          <Link 
            href="/events" 
            className="text-sm text-primary hover:text-blue-600 transition-colors hover:underline"
          >
            View all
          </Link>
        </div>
        <UpcomingEvents />
      </section>
    </div>
  );
}