import { Card } from '@/components/ui/card';
import UpcomingEvents from '@/components/upcoming-events';
import { BookOpen, Calendar, MapPin, Utensils, Users, Settings, User } from 'lucide-react';
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

export const metadata = {
  title: 'SRM University AP',
  description: 'Experience excellence in education at our state-of-the-art campus. Your journey to success begins here.',
}

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <Card className="relative overflow-hidden border-none">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1562774053-701939374585?w=1800&q=80"
            alt="Campus"
            fill
            className="object-cover opacity-20 dark:opacity-10"
          />
        </div>
        <div className="relative p-8 md:p-12 bg-gradient-to-r from-primary/5 via-primary/5 to-transparent">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Welcome to SRM University AP
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Experience excellence in education at our state-of-the-art campus. 
            Your journey to success begins here.
          </p>
        </div>
      </Card>

      {/* Quick Links with consistent sizing */}
      <div className="flex flex-wrap gap-4 justify-center">
        {QuickLinks.map((link) => (
          <Link key={link.title} href={link.href}>
            <Card className="group hover:shadow-lg transition-all duration-200 w-[100px]">
              <div className="flex flex-col items-center p-4 h-[100px] justify-center">
                <div className={`w-12 h-12 flex items-center justify-center rounded-lg ${link.color}`}>
                  <link.icon className="h-6 w-6" />
                </div>
                <span className="mt-2 text-sm font-medium group-hover:text-primary transition-colors text-center">
                  {link.title}
                </span>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Events Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
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