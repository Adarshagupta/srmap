"use client";

import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Clock, UtensilsCrossed, Coffee, ChefHat, Timer, CalendarDays } from 'lucide-react';

const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

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

export default function MessPage() {
  const [selectedMess, setSelectedMess] = useState('national');
  const [selectedDay, setSelectedDay] = useState(DAYS[getCurrentIndianTime().getDay()]);
  const [selectedMeal, setSelectedMeal] = useState(getCurrentMeal());
  const [menu, setMenu] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [nextMeal, setNextMeal] = useState(getTimeUntilNextMeal());

  useEffect(() => {
    const timer = setInterval(() => {
      const now = getCurrentIndianTime();
      setSelectedMeal(getCurrentMeal());
      setNextMeal(getTimeUntilNextMeal());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const menuRef = collection(db, 'mess-menus');
    const menuQuery = query(menuRef, where('id', '==', `${selectedMess}-${selectedDay}`));
    
    const unsubscribe = onSnapshot(menuQuery, (snapshot) => {
      if (!snapshot.empty) {
        setMenu(snapshot.docs[0].data());
      } else {
        setMenu(null);
      }
      setLoading(false);
    }, (error) => {
      console.error('Error fetching menu:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [selectedMess, selectedDay]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const MealIcon = MEAL_TIMINGS[selectedMeal as keyof typeof MEAL_TIMINGS].icon;

  return (
    <div className="container max-w-4xl py-3 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Mess Menu</h1>
          <p className="text-muted-foreground mt-1">View today's menu and upcoming meals</p>
        </div>

        <Card className="border-primary/20">
          <CardContent className="p-3 flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <Timer className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">{nextMeal.meal} in {nextMeal.countdown}</p>
              <p className="text-xs text-muted-foreground">Starts at {nextMeal.time}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card>
          <CardHeader className="pb-2 pt-3 px-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              Select Day
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <div className="flex flex-wrap gap-2">
              {DAYS.map((day) => (
                <Badge
                  key={day}
                  variant={selectedDay === day ? "default" : "outline"}
                  className="capitalize cursor-pointer"
                  onClick={() => setSelectedDay(day)}
                >
                  {day.slice(0, 3)}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 pt-3 px-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <UtensilsCrossed className="h-4 w-4" />
              Select Mess
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <div className="flex gap-2">
              <Badge
                variant={selectedMess === 'national' ? "default" : "outline"}
                className="flex-1 justify-center cursor-pointer"
                onClick={() => setSelectedMess('national')}
              >
                National
              </Badge>
              <Badge
                variant={selectedMess === 'international' ? "default" : "outline"}
                className="flex-1 justify-center cursor-pointer"
                onClick={() => setSelectedMess('international')}
              >
                International
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="relative overflow-hidden">
        <div className="absolute right-3 top-3 p-2 bg-primary/10 rounded-full">
          <MealIcon className="h-5 w-5 text-primary" />
        </div>
        
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle>Today's Menu</CardTitle>
        </CardHeader>

        <CardContent className="px-3 pb-3">
          <Tabs value={selectedMeal} onValueChange={setSelectedMeal}>
            <TabsList className="w-full justify-start mb-3">
              <TabsTrigger value="breakfast" className="flex gap-2">
                <Coffee className="h-4 w-4" />
                Breakfast
              </TabsTrigger>
              <TabsTrigger value="lunch" className="flex gap-2">
                <UtensilsCrossed className="h-4 w-4" />
                Lunch
              </TabsTrigger>
              <TabsTrigger value="dinner" className="flex gap-2">
                <ChefHat className="h-4 w-4" />
                Dinner
              </TabsTrigger>
            </TabsList>

            {['breakfast', 'lunch', 'dinner'].map((meal) => (
              <TabsContent key={meal} value={meal}>
                {menu && menu[meal] ? (
                  <ul className="space-y-1.5">
                    {menu[meal].map((item: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-6">
                    <UtensilsCrossed className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No menu available for this meal</p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}