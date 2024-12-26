"use client";

import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Clock, UtensilsCrossed, Coffee, ChefHat, Timer, CalendarDays, WifiOff, ChevronDown } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Define type for days
type Day = 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';

const DAYS: Day[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

// Meal timings in 24-hour format (IST)
const MEAL_TIMINGS = {
  breakfast: { start: 7, end: 10, icon: Coffee },  // 7:00 AM - 10:00 AM
  lunch: { start: 12, end: 15, icon: UtensilsCrossed },     // 12:00 PM - 3:00 PM
  dinner: { start: 19, end: 22, icon: ChefHat },    // 7:00 PM - 10:00 PM
};

function getCurrentIndianTime() {
  const options = { timeZone: 'Asia/Kolkata' };
  const indianTime = new Date().toLocaleString('en-US', options);
  return new Date(indianTime);
}

function getCurrentMeal() {
  const now = getCurrentIndianTime();
  const hour = now.getHours();

  if (hour >= MEAL_TIMINGS.breakfast.start && hour < MEAL_TIMINGS.breakfast.end) {
    return 'breakfast';
  } else if (hour >= MEAL_TIMINGS.lunch.start && hour < MEAL_TIMINGS.lunch.end) {
    return 'lunch';
  } else if (hour >= MEAL_TIMINGS.dinner.start && hour < MEAL_TIMINGS.dinner.end) {
    return 'dinner';
  } else {
    if (hour < MEAL_TIMINGS.breakfast.start || hour >= MEAL_TIMINGS.dinner.end) {
      return 'breakfast';
    } else if (hour < MEAL_TIMINGS.lunch.start) {
      return 'lunch';
    } else {
      return 'dinner';
    }
  }
}

function getTimeUntilNextMeal() {
  const now = getCurrentIndianTime();
  const hour = now.getHours();
  const minutes = now.getMinutes();
  let nextMeal = '';
  let nextMealTime = 0;
  let hoursUntil = 0;
  let minutesUntil = 0;

  if (hour < MEAL_TIMINGS.breakfast.start) {
    nextMeal = 'Breakfast';
    nextMealTime = MEAL_TIMINGS.breakfast.start;
    hoursUntil = nextMealTime - hour;
    minutesUntil = 60 - minutes;
    if (minutesUntil > 0) hoursUntil--;
  } else if (hour < MEAL_TIMINGS.lunch.start) {
    nextMeal = 'Lunch';
    nextMealTime = MEAL_TIMINGS.lunch.start;
    hoursUntil = nextMealTime - hour;
    minutesUntil = 60 - minutes;
    if (minutesUntil > 0) hoursUntil--;
  } else if (hour < MEAL_TIMINGS.dinner.start) {
    nextMeal = 'Dinner';
    nextMealTime = MEAL_TIMINGS.dinner.start;
    hoursUntil = nextMealTime - hour;
    minutesUntil = 60 - minutes;
    if (minutesUntil > 0) hoursUntil--;
  } else {
    nextMeal = 'Breakfast';
    nextMealTime = MEAL_TIMINGS.breakfast.start + 24;
    hoursUntil = (nextMealTime - hour);
    minutesUntil = 60 - minutes;
    if (minutesUntil > 0) hoursUntil--;
  }

  if (minutesUntil === 60) minutesUntil = 0;

  return {
    meal: nextMeal,
    time: `${nextMealTime % 12 || 12}:00 ${nextMealTime >= 12 ? 'PM' : 'AM'}`,
    countdown: `${hoursUntil}h ${minutesUntil}m`,
  };
}

// Format day name to be more readable
function formatDayName(day: 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday') {
  return day.charAt(0).toUpperCase() + day.slice(1);
}

// Get current day as Day type
function getCurrentDay(): Day {
  return DAYS[getCurrentIndianTime().getDay()];
}

// Get tomorrow as Day type
function getTomorrowDay(): Day {
  return DAYS[(getCurrentIndianTime().getDay() + 1) % 7];
}

// Get day name with "Today" or "Tomorrow" if applicable
function getDayLabel(day: Day) {
  const today = getCurrentDay();
  const tomorrow = getTomorrowDay();
  
  if (day === today) return 'Today';
  if (day === tomorrow) return 'Tomorrow';
  return formatDayName(day);
}

export default function MessPage() {
  const [selectedMess, setSelectedMess] = useState('national');
  const [selectedDay, setSelectedDay] = useState<Day>(getCurrentDay());
  const [selectedMeal, setSelectedMeal] = useState(getCurrentMeal());
  const [menu, setMenu] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [nextMeal, setNextMeal] = useState(getTimeUntilNextMeal());
  const [isOffline, setIsOffline] = useState(false);
  const { toast } = useToast();

  // Check online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      fetchMenu(); // Refresh data when back online
    };
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    setIsOffline(!navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = getCurrentIndianTime();
      setSelectedMeal(getCurrentMeal());
      setNextMeal(getTimeUntilNextMeal());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const fetchMenu = useCallback(async () => {
    try {
      const menuRef = collection(db, 'mess-menus');
      const menuQuery = query(menuRef, where('id', '==', `${selectedMess}-${selectedDay}`));
      
      // First try to get from cache
      const snapshot = await getDocs(menuQuery);
      if (!snapshot.empty) {
        const menuData = snapshot.docs[0].data();
        setMenu(menuData);
        setLoading(false);
      }

      // Then set up real-time listener for updates
      const unsubscribe = onSnapshot(menuQuery, 
        (snapshot) => {
          if (!snapshot.empty) {
            const menuData = snapshot.docs[0].data();
            setMenu(menuData);
            
            // Cache the menu data
            if ('caches' in window) {
              const cacheKey = `mess-menu-${selectedMess}-${selectedDay}`;
              localStorage.setItem(cacheKey, JSON.stringify(menuData));
            }
          } else {
            setMenu(null);
          }
          setLoading(false);
        },
        (error) => {
          console.error('Error fetching menu:', error);
          // Try to get from local storage if offline
          const cacheKey = `mess-menu-${selectedMess}-${selectedDay}`;
          const cachedData = localStorage.getItem(cacheKey);
          if (cachedData) {
            setMenu(JSON.parse(cachedData));
          } else {
            setMenu(null);
          }
          setLoading(false);
          
          if (!isOffline) {
            toast({
              title: "Connection Error",
              description: "Using cached menu data. Some information may be outdated.",
              variant: "destructive",
            });
          }
        }
      );

      return unsubscribe;
    } catch (error) {
      console.error('Error in fetchMenu:', error);
      setLoading(false);
      
      // Try to get from local storage
      const cacheKey = `mess-menu-${selectedMess}-${selectedDay}`;
      const cachedData = localStorage.getItem(cacheKey);
      if (cachedData) {
        setMenu(JSON.parse(cachedData));
      }
    }
  }, [selectedMess, selectedDay, isOffline, toast]);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    
    const initializeMenu = async () => {
      unsubscribe = await fetchMenu();
    };

    initializeMenu();

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [selectedMess, selectedDay, fetchMenu]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const MealIcon = MEAL_TIMINGS[selectedMeal as keyof typeof MEAL_TIMINGS].icon;

  return (
    <div className="container max-w-7xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="space-y-6">
        <div className="flex-1 space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Mess Menu</h1>
          <p className="text-muted-foreground">
            {isOffline ? (
              <span className="flex items-center gap-2">
                <WifiOff className="h-4 w-4" />
                Offline Mode - Showing cached menu
              </span>
            ) : (
              "View today's menu and upcoming meals"
            )}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4">
          {/* Mess Selection */}
          <Tabs 
            value={selectedMess} 
            onValueChange={setSelectedMess}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="national">National Mess</TabsTrigger>
              <TabsTrigger value="international">International Mess</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Meal Selection */}
          <Tabs 
            value={selectedMeal} 
            onValueChange={setSelectedMeal}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              {Object.entries(MEAL_TIMINGS).map(([meal, { icon: Icon }]) => (
                <TabsTrigger 
                  key={meal} 
                  value={meal}
                  className="flex items-center gap-2"
                >
                  <Icon className="h-4 w-4" />
                  <span className="capitalize">{meal}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Day Selection */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border bg-background hover:bg-accent transition-colors">
                <CalendarDays className="h-4 w-4" />
                <span className="capitalize">{getDayLabel(selectedDay)}</span>
                <ChevronDown className="h-3 w-3 opacity-50 ml-auto" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              {DAYS.map((day) => (
                <DropdownMenuItem
                  key={day}
                  className={cn(
                    "capitalize cursor-pointer",
                    selectedDay === day && "bg-primary/10"
                  )}
                  onClick={() => {
                    setSelectedDay(day);
                    setLoading(true);
                  }}
                >
                  {getDayLabel(day)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Next Meal Timer */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-background rounded-2xl">
              <Timer className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-lg">Next Meal</h3>
              <p className="text-base text-muted-foreground">
                {nextMeal.meal} in {nextMeal.countdown}
              </p>
              <p className="text-sm text-primary font-medium">
                Starts at {nextMeal.time}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Menu Content */}
      <div className="grid gap-4">
        {menu?.[selectedMeal] ? (
          menu[selectedMeal].map((item: string, index: number) => (
            <div 
              key={index}
              className="flex items-center gap-3 p-4 rounded-xl bg-card hover:bg-muted/50 transition-colors border"
            >
              <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
              <span className="text-sm md:text-base">{item}</span>
            </div>
          ))
        ) : (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <UtensilsCrossed className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-lg text-muted-foreground text-center">
                No menu available for {selectedMeal}
              </p>
              <p className="text-sm text-muted-foreground/80 text-center mt-1">
                Please check back later or try a different meal
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}