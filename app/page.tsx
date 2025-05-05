"use client";

import React from 'react';
import { Card } from '@/components/ui/card';
import UpcomingEvents from '@/components/upcoming-events';
import FeaturedUsers from '@/components/featured-users';
import { CurrentMeal } from '@/components/current-meal';
import { AskSrmAi } from '@/components/ask-srm-ai';
import { RecentPapers } from '@/components/recent-papers';
import { UpcomingHackathons } from '@/components/upcoming-hackathons';
import { BookOpen, Calendar, MapPin, Utensils, Users, User, Bell, Trophy, Newspaper, FileText, Code2, Code, Wifi, Bus, Coffee, Clock, AlertCircle, Cloud, Sun, CloudRain, CloudLightning, CloudSnow, CloudDrizzle, ThermometerSun, Wind, CheckCircle2, CircleDot, ChevronRight, Briefcase, Rocket, Zap } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const QuickLinks = [
  {
    icon: Calendar,
    title: 'Events',
    href: '/events',
    color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  },
  {
    icon: Code2,
    title: 'DSA',
    href: '/dsa',
    color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
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
    title: 'Exam',
    href: '/question-papers',
    color: 'bg-pink-500/10 text-pink-600 dark:text-pink-400',
  },
  {
    icon: Users,
    title: 'Discover',
    href: '/discover',
    color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
  },
];

const Highlights = [
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

type StatusType = 'strong' | 'weak' | 'down' | 'on-time' | 'delayed' | 'suspended' | 'open' | 'busy' | 'closed';

type WeatherData = {
  temp: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'snowy' | 'drizzle';
  humidity: number;
  windSpeed: number;
};

type ClassData = {
  currentClass: {
    name: string;
    room: string;
    startTime: string;
    endTime: string;
    attendance: number;
  } | null;
  nextClass: {
    name: string;
    room: string;
    startTime: string;
    timeUntil: string;
  } | null;
};

type ScheduleItem = {
  time: string;
  title: string;
  location?: string;
  type: 'class' | 'meal' | 'event' | 'deadline';
  status: 'completed' | 'current' | 'upcoming';
  attendance?: number;
  href?: string;
  action?: () => void;
};

export default function Home() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState<WeatherData>({
    temp: 28,
    condition: 'sunny',
    humidity: 65,
    windSpeed: 12,
  });
  const [classData, setClassData] = useState<ClassData>({
    currentClass: {
      name: 'CS301 - Data Structures',
      room: 'AB-1 304',
      startTime: '09:30',
      endTime: '10:45',
      attendance: 78,
    },
    nextClass: {
      name: 'CS302 - Algorithms',
      room: 'AB-2 201',
      startTime: '11:00',
      timeUntil: '45 min',
    },
  });
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'info', message: 'Library closing in 30 minutes' },
    { id: 2, type: 'warning', message: 'Heavy rain expected today' },
  ]);

  // Function to determine item status based on time
  const getItemStatus = (timeStr: string): 'completed' | 'current' | 'upcoming' => {
    const now = new Date();
    const [hours, minutes] = timeStr.split(':').map(Number);
    const itemTime = hours * 60 + minutes;
    const currentTime = now.getHours() * 60 + now.getMinutes();

    // Consider an item "current" if we're within its 1-hour time slot
    if (currentTime >= itemTime && currentTime < itemTime + 60) {
      return 'current';
    }
    return currentTime > itemTime + 60 ? 'completed' : 'upcoming';
  };

  const [todaySchedule, setTodaySchedule] = useState<ScheduleItem[]>([
    {
      time: '08:00',
      title: 'Breakfast',
      location: 'Main Mess',
      type: 'meal',
      status: getItemStatus('08:00'),
      href: '/mess'
    },
    {
      time: '09:30',
      title: 'Data Struct',
      location: 'AB-1 304',
      type: 'class',
      status: getItemStatus('09:30'),
      attendance: 78,
      href: '/schedule/CS301'
    },
    {
      time: '11:00',
      title: 'Algorithms',
      location: 'AB-2 201',
      type: 'class',
      status: getItemStatus('11:00'),
      href: '/schedule/CS302'
    },
    {
      time: '12:30',
      title: 'Lunch',
      location: 'Main Mess',
      type: 'meal',
      status: getItemStatus('12:30'),
      href: '/mess'
    },
    {
      time: '19:30',
      title: 'Dinner',
      location: 'Main Mess',
      type: 'meal',
      status: getItemStatus('19:30'),
      href: '/mess'
    }
  ]);

  // Update schedule status every minute
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      // Update all schedule items' status
      setTodaySchedule(prev => prev.map(item => ({
        ...item,
        status: getItemStatus(item.time)
      })));

      // Other updates
      updateWeather();
      updateClassData(now);
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const updateWeather = () => {
    // In a real app, this would fetch from a weather API
    const conditions: WeatherData['condition'][] = ['sunny', 'cloudy', 'rainy', 'stormy', 'snowy', 'drizzle'];
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
    const newTemp = Math.floor(25 + Math.random() * 10);

    setWeather(prev => ({
      ...prev,
      temp: newTemp,
      condition: randomCondition,
      humidity: Math.floor(60 + Math.random() * 20),
      windSpeed: Math.floor(8 + Math.random() * 8),
    }));
  };

  const updateClassData = (now: Date) => {
    // In a real app, this would fetch from your class schedule API
    const hour = now.getHours();
    const minutes = now.getMinutes();
    const currentTime = hour * 60 + minutes;

    // Example: Update attendance for current class
    if (classData.currentClass) {
      const newAttendance = Math.min(100, classData.currentClass.attendance + Math.floor(Math.random() * 5));
      if (newAttendance > 90) {
        toast({
          title: "High Class Attendance",
          description: "Great turnout today! Over 90% of students are present.",
        });
      }
      setClassData(prev => ({
        ...prev,
        currentClass: prev.currentClass ? { ...prev.currentClass, attendance: newAttendance } : null,
      }));
    }
  };

  const getWeatherIcon = (condition: WeatherData['condition']) => {
    const icons = {
      sunny: Sun,
      cloudy: Cloud,
      rainy: CloudRain,
      stormy: CloudLightning,
      snowy: CloudSnow,
      drizzle: CloudDrizzle,
    };
    return icons[condition];
  };

  const WeatherIcon = getWeatherIcon(weather.condition);

  // Mock status data (in real app, this would come from an API)
  const campusStatus = {
    wifiStatus: 'strong' as StatusType,
    busService: 'on-time' as StatusType,
    messStatus: 'open' as StatusType,
    libraryOccupancy: '45%',
    nextClass: '10:30 AM - CS301',
    alerts: 2,
  };

  const getStatusColor = (status: StatusType): string => {
    const colors: Record<StatusType, string> = {
      strong: 'text-green-500',
      weak: 'text-yellow-500',
      down: 'text-red-500',
      'on-time': 'text-green-500',
      delayed: 'text-yellow-500',
      suspended: 'text-red-500',
      open: 'text-green-500',
      busy: 'text-yellow-500',
      closed: 'text-red-500',
    };
    return colors[status];
  };

  const getItemColor = (type: ScheduleItem['type']) => {
    const colors = {
      class: 'bg-blue-500/10 text-blue-500',
      meal: 'bg-green-500/10 text-green-500',
      event: 'bg-purple-500/10 text-purple-500',
      deadline: 'bg-red-500/10 text-red-500'
    };
    return colors[type];
  };

  const getItemIcon = (type: ScheduleItem['type']) => {
    const icons = {
      class: BookOpen,
      meal: Coffee,
      event: Calendar,
      deadline: AlertCircle
    };
    return icons[type];
  };

  const handleItemClick = (item: ScheduleItem) => {
    switch (item.type) {
      case 'class':
        if (item.status === 'current') {
          toast({
            title: "Class Check-in",
            description: "Checking in to " + item.title,
          });
          // In real app: Handle class check-in
        }
        router.push(`/schedule/${encodeURIComponent(item.title)}`);
        break;
      case 'meal':
        router.push('/mess');
        break;
      case 'event':
        router.push('/events');
        break;
      case 'deadline':
        router.push('/assignments');
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Mobile Daily Timeline */}
      {/* Removing Today's Schedule section */}

      {/* Full Banner (hidden on small screens) */}
      <div className="hidden md:block relative h-[180px] sm:h-[200px] md:h-[220px] lg:h-[250px] xl:h-[280px] rounded-2xl overflow-hidden">
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
          <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-background/20 to-transparent" />
          <div className="absolute top-1/2 right-0 w-32 lg:w-48 h-32 lg:h-48 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 right-0 w-24 lg:w-32 h-24 lg:h-32 bg-purple-500/10 rounded-full blur-2xl" />
        </div>

        {/* Content */}
        <div className="relative h-full flex items-center p-4 sm:p-6 md:p-8 lg:p-10 max-w-[1600px] mx-auto">
          <div className="flex justify-between items-center w-full">
            {/* Logo and Title */}
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="p-1.5 bg-white/10 backdrop-blur-md rounded-xl">
                <Image
                  src="https://srmap.edu.in/wp-content/uploads/2019/11/SRMAP-Logo-2.png"
                  alt="SRM University AP Logo"
                  width={120}
                  height={48}
                  className="w-auto h-auto sm:w-[120px] sm:h-[48px] lg:w-[150px] lg:h-[60px]"
                  style={{ width: 'auto', height: 'auto' }}
                  priority
                />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold tracking-tight text-white">
                  Welcome to SRM University AP
                </h1>
                <p className="text-xs sm:text-sm md:text-base lg:text-lg text-white/90 mt-0.5 sm:mt-1 lg:mt-2 max-w-2xl">
                  Experience excellence in education at our state-of-the-art campus
                </p>
              </div>
            </div>

            {/* Current Time */}
            <div className="hidden sm:flex items-center gap-2 text-white/90 bg-white/10 backdrop-blur-md rounded-lg px-3 py-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-sm">{currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
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



      {/* Internship Section */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 my-6">
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="relative p-6 sm:p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3 text-center md:text-left">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Campus Internship Opportunities
              </h2>
              <p className="text-muted-foreground max-w-2xl">
                Gain valuable work experience, develop professional skills, and build your network right here on campus.
              </p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Briefcase className="h-4 w-4 mr-1.5 text-blue-500" />
                  Multiple Positions
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1.5 text-indigo-500" />
                  On Campus & Remote
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-1.5 text-purple-500" />
                  Flexible Duration
                </div>
              </div>
            </div>
            <Link href="/internships" className="w-full md:w-auto">
              <Button
                className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/20"
                size="lg"
              >
                View Opportunities
              </Button>
            </Link>
          </div>
        </div>
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

        {/* Hackathon Section - Redesigned */}
        <div className="lg:col-span-3">
          <UpcomingHackathons expanded={true} />
        </div>

        {/* Combined Events and Papers Section - Takes up 3 columns */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-rose-600 bg-clip-text text-transparent">
                Campus Resources
              </h2>
              <p className="text-muted-foreground">Stay updated with campus activities and resources</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-rose-50 dark:from-blue-500/5 dark:to-rose-500/5 rounded-2xl p-0.5">
            <div className="bg-background rounded-2xl">
              <Tabs defaultValue="events" className="w-full">
                <div className="px-4 pt-4">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="events" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Upcoming Events
                    </TabsTrigger>
                    <TabsTrigger value="papers" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Question Papers
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="events" className="p-4 pt-2">
                  <div className="flex justify-end mb-2">
                    <Link
                      href="/events"
                      className="text-xs text-primary hover:text-blue-600 transition-colors hover:underline flex items-center gap-1"
                    >
                      View all events
                      <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                  <UpcomingEvents />
                </TabsContent>

                <TabsContent value="papers" className="p-4 pt-2">
                  <div className="flex justify-end mb-2">
                    <Link
                      href="/question-papers"
                      className="text-xs text-pink-600 hover:text-rose-600 transition-colors hover:underline flex items-center gap-1"
                    >
                      View all papers
                      <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                  <RecentPapers />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Users Section - Compact Design */}
      <div>
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl overflow-hidden mb-4">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full">
                <Users className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold text-white">People You May Know</h3>
            </div>
            <Link
              href="/discover"
              className="text-xs bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-full transition-colors"
            >
              View all
            </Link>
          </div>
        </div>
        <div className="bg-gradient-to-br from-amber-100/50 to-orange-100/50 dark:from-amber-500/5 dark:to-orange-500/5 rounded-xl p-3">
          <FeaturedUsers />
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

      {/* Moderator Recruitment Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-pink-500/10">
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="relative p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
              Become a Moderator
            </h2>
            <p className="text-muted-foreground max-w-[500px]">
              Help us maintain and improve the community by joining our moderation team. Make a difference in your campus community.
            </p>
          </div>
          <a
            href="mailto:adarsh_kishor@srmap.edu.in?subject=Application for Moderator Position&body=Hi Adarsh,%0A%0AI'm interested in becoming a moderator. I would like to help maintain and improve the community.%0A%0ARegards,%0A[Your Name]"
            className="w-full sm:w-auto"
          >
            <Button
              className="w-full sm:w-auto bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/20"
              size="lg"
            >
              Apply Now
            </Button>
          </a>
        </div>
      </div>

      {/* Developer Section */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-r from-teal-500/10 via-emerald-500/10 to-green-500/10">
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="relative p-6 sm:p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-xl overflow-hidden border-4 border-white/10 shadow-xl bg-gradient-to-br from-teal-500 to-emerald-600">
                <Avatar className="w-full h-full">
                  <AvatarImage src="https://media.licdn.com/dms/image/v2/D5603AQEw_0xc6mijKQ/profile-displayphoto-shrink_800_800/B56ZaNw94sGUAc-/0/1746135146517?e=1752105600&v=beta&t=xBt-_88lE66PgCRAh9ZHmkCF3hR-m_31N7s2pKGpRTs" alt="Adarsh Gupta" />
                  <AvatarFallback className="bg-teal-100 text-teal-800 text-2xl">
                    AG
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1.5 shadow-md">
                <Code2 className="h-5 w-5 text-teal-600" />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left space-y-3">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-green-600 bg-clip-text text-transparent">
                  Adarsh Gupta
                </h2>
                <p className="text-muted-foreground">Full Stack Developer & Creator</p>
              </div>

              <p className="max-w-2xl">
                Passionate about building intuitive and efficient applications that solve real-world problems.
                Developed this platform to connect students and enhance campus life at SRM University AP.
              </p>

              <div className="flex items-center justify-center md:justify-start gap-3 pt-2">
                <a
                  href="https://github.com/adarshagupta"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 p-2 rounded-full hover:bg-teal-200 dark:hover:bg-teal-900/50 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                </a>
                <a
                  href="https://www.linkedin.com/in/adasgpt/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 p-2 rounded-full hover:bg-teal-200 dark:hover:bg-teal-900/50 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                </a>
                <a
                  href="mailto:adarsh.gupta@srmap.edu.in"
                  className="bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 p-2 rounded-full hover:bg-teal-200 dark:hover:bg-teal-900/50 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                </a>
                <Button variant="outline" size="sm" className="ml-2 border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-400 hover:bg-teal-100 dark:hover:bg-teal-900/30">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                  Resume
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Assistant */}
      <AskSrmAi />

      {/* Add custom scrollbar hiding style */}
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
