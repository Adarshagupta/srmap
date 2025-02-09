"use client";

import React from 'react';
import { Card } from '@/components/ui/card';
import UpcomingEvents from '@/components/upcoming-events';
import FeaturedUsers from '@/components/featured-users';
import { CurrentMeal } from '@/components/current-meal';
import { AskSrmAi } from '@/components/ask-srm-ai';
import { RecentPapers } from '@/components/recent-papers';
import { BookOpen, Calendar, MapPin, Utensils, Users, User, Bell, Trophy, Newspaper, FileText, Code2, Wifi, Bus, Coffee, Clock, AlertCircle, Cloud, Sun, CloudRain, CloudLightning, CloudSnow, CloudDrizzle, ThermometerSun, Wind, CheckCircle2, CircleDot, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
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
      <div className="md:hidden">
        <div className="px-4 py-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold">Today's Schedule</h2>
              <p className="text-sm text-muted-foreground">
                {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">
                {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="text-xs text-muted-foreground">
                {weather.temp}°C • {weather.condition}
              </div>
            </div>
          </div>

          {/* Horizontally Scrollable Timeline */}
          <div className="overflow-x-auto pb-2 -mx-4 px-4 hide-scrollbar">
            <div className="flex gap-3 min-w-max">
              {todaySchedule.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleItemClick(item)}
                  className="text-left w-[250px] h-[60px] shrink-0"
                >
                  <div 
                    className={[
                      "relative flex items-start gap-4 p-2.5 rounded-xl backdrop-blur-md transition-colors duration-200 border border-border/50 h-full",
                      item.status === 'current' 
                        ? "bg-primary/5 border-primary" 
                        : item.status === 'completed'
                        ? "bg-white/5 opacity-60"
                        : "bg-white/5 hover:border-primary/50",
                    ].filter(Boolean).join(" ")}
                  >
                    {/* Time Column */}
                    <div className="min-w-[48px] text-center relative">
                      <div className="text-sm font-medium">{item.time}</div>
                      {item.status === 'completed' && (
                        <CheckCircle2 className="w-4 h-4 mx-auto mt-1 text-green-500" />
                      )}
                      {item.status === 'current' && (
                        <>
                          <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary" />
                          <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                          <CircleDot className="w-4 h-4 mx-auto mt-1 text-primary" />
                        </>
                      )}
                    </div>

                    {/* Content Column */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3">
                        <div className={[
                          "p-1.5 rounded-lg shrink-0",
                          getItemColor(item.type),
                          item.status === 'current' ? "animate-pulse" : ""
                        ].filter(Boolean).join(" ")}>
                          {React.createElement(getItemIcon(item.type), { 
                            className: [
                              "w-4 h-4",
                              item.status === 'current' ? "text-primary" : ""
                            ].filter(Boolean).join(" ")
                          })}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className={[
                            "text-sm font-medium line-clamp-2",
                            item.status === 'current' ? "text-primary" : ""
                          ].filter(Boolean).join(" ")}>
                            {item.title}
                          </div>
                          {item.location && (
                            <div className="text-xs text-muted-foreground truncate mt-0.5">
                              {item.location}
                            </div>
                          )}
                        </div>
                        {item.status === 'upcoming' && (
                          <ChevronRight className="w-4 h-4 ml-auto text-muted-foreground shrink-0" />
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Hide scrollbar styles */}
          <style jsx global>{`
            .hide-scrollbar {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
            .hide-scrollbar::-webkit-scrollbar {
              display: none;
            }
          `}</style>
        </div>
      </div>

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