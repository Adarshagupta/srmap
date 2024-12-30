import { Card } from '@/components/ui/card';
import UpcomingEvents from '@/components/upcoming-events';
import FeaturedUsers from '@/components/featured-users';
import { CurrentMeal } from '@/components/current-meal';
import { AskSrmAi } from '@/components/ask-srm-ai';
import { RecentPapers } from '@/components/recent-papers';
import { BookOpen, Calendar, MapPin, Utensils, Users, User, Bell, Trophy, Newspaper, FileText } from 'lucide-react';
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
    icon: FileText,
    title: 'Question Papers',
    href: '/question-papers',
    color: 'bg-pink-500/10 text-pink-600 dark:text-pink-400',
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
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative h-[250px] md:h-[300px] rounded-3xl overflow-hidden">
        {/* Background Image and Overlay */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2086&auto=format&fit=crop"
            alt="SRM AP Campus"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/70 to-transparent" />
          
          {/* Decorative Elements */}
          <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-background/20 to-transparent" />
          <div className="absolute top-1/2 right-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl" />
        </div>

        {/* Content */}
        <div className="relative h-full flex flex-col justify-center p-6 md:p-10">
          <div className="max-w-3xl space-y-4">
            {/* Logo and Title */}
            <div className="flex items-center gap-4">
              <div className="p-2 bg-white/10 backdrop-blur-md rounded-2xl">
                <Image
                  src="https://srmap.edu.in/wp-content/uploads/2019/11/SRMAP-Logo-2.png"
                  alt="SRM University AP Logo"
                  width={200}
                  height={80}
                  style={{ width: 'auto', height: 'auto' }}
                  priority
                />
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-white">
                  Welcome to SRM University AP
                </h1>
                <p className="text-base md:text-lg text-white/90 mt-2">
                  Experience excellence in education at our state-of-the-art campus
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-3 mt-4">
              {[
                { label: 'Students', value: '5000+' },
                { label: 'Faculty', value: '250+' },
                { label: 'Acres', value: '200+' },
                { label: 'Partners', value: '100+' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/10 backdrop-blur-md rounded-xl p-2 text-center">
                  <div className="text-lg font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-white/70">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
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

      {/* Current Meal, Events, and Papers Section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Menu Section - Takes up 2 columns */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Today's Menu
              </h2>
              <p className="text-muted-foreground">Check what's cooking in the mess</p>
            </div>
            <Link 
              href="/mess" 
              className="text-sm text-green-600 hover:text-green-700 dark:text-green-500 dark:hover:text-green-400 transition-colors hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-500/5 dark:to-emerald-500/5 rounded-2xl p-0.5">
            <CurrentMeal />
          </div>
        </div>

        {/* Events and Papers Section - Takes up 3 columns */}
        <div className="lg:col-span-3 space-y-4">
          {/* Events Section */}
          <div className="space-y-4">
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
          </div>

          {/* Question Papers Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                  Recent Question Papers
                </h2>
                <p className="text-muted-foreground">Latest additions to our question bank</p>
              </div>
              <Link 
                href="/question-papers" 
                className="text-sm text-pink-600 hover:text-rose-600 transition-colors hover:underline"
              >
                View all
              </Link>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-500/5 dark:to-rose-500/5 rounded-2xl p-0.5">
              <div className="bg-background rounded-2xl">
                <div className="p-4">
                  <RecentPapers />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Users Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              People You May Know
            </h2>
            <p className="text-muted-foreground">Connect with your college community</p>
          </div>
          <Link 
            href="/discover" 
            className="text-sm text-purple-600 hover:text-pink-600 transition-colors hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-500/5 dark:to-pink-500/5 rounded-2xl p-0.5">
          <div className="bg-background rounded-2xl">
            <div className="p-6">
              <FeaturedUsers />
            </div>
          </div>
        </div>
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
      </div>

      {/* AI Assistant */}
      <AskSrmAi />
    </div>
  );
}