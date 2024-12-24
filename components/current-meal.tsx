"use client";

import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Coffee, UtensilsCrossed, ChefHat, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from './auth-provider';

const MEAL_TIMINGS = {
  breakfast: { start: 7, end: 10, icon: Coffee, greeting: 'Good Morning' },
  lunch: { start: 12, end: 15, icon: UtensilsCrossed, greeting: 'Good Afternoon' },
  dinner: { start: 19, end: 22, icon: ChefHat, greeting: 'Good Evening' },
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

function getGreeting() {
  const now = getCurrentIndianTime();
  const hour = now.getHours();

  if (hour >= 5 && hour < 12) {
    return 'Good Morning';
  } else if (hour >= 12 && hour < 17) {
    return 'Good Afternoon';
  } else if (hour >= 17 && hour < 22) {
    return 'Good Evening';
  } else {
    return 'Good Night';
  }
}

export function CurrentMeal() {
  const { user } = useAuth();
  const [menu, setMenu] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const currentMeal = getCurrentMeal();
  const greeting = getGreeting();
  const today = getCurrentIndianTime().getDay();
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  // Get user's first name if available
  const userName = user?.displayName ? user.displayName.split(' ')[0] : '';

  useEffect(() => {
    const menuRef = collection(db, 'mess-menus');
    const menuQuery = query(menuRef, where('id', '==', `international-${days[today]}`));
    
    const unsubscribe = onSnapshot(menuQuery, (snapshot) => {
      if (!snapshot.empty) {
        setMenu(snapshot.docs[0].data());
      } else {
        // Fallback to national mess if international menu is not available
        const nationalQuery = query(menuRef, where('id', '==', `national-${days[today]}`));
        const nationalUnsubscribe = onSnapshot(nationalQuery, (nationalSnapshot) => {
          if (!nationalSnapshot.empty) {
            setMenu(nationalSnapshot.docs[0].data());
          } else {
            setMenu(null);
          }
          setLoading(false);
        }, (error) => {
          console.error('Error fetching national menu:', error);
          setLoading(false);
        });

        return () => nationalUnsubscribe();
      }
      setLoading(false);
    }, (error) => {
      console.error('Error fetching international menu:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [today]);

  const MealIcon = MEAL_TIMINGS[currentMeal as keyof typeof MEAL_TIMINGS].icon;

  if (loading) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-full">
              <MealIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <span className="text-sm text-muted-foreground">
                {userName ? `${greeting}, ${userName}` : greeting}
              </span>
              <h3 className="text-lg font-semibold capitalize">{currentMeal} Menu</h3>
            </div>
          </CardTitle>
          <Link 
            href="/mess" 
            className="text-sm text-primary hover:text-primary/80 transition-colors hover:underline inline-flex items-center gap-1"
          >
            Full Menu
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {menu && menu[currentMeal] ? (
          <div className="flex flex-wrap gap-2">
            {menu[currentMeal].map((item: string, index: number) => {
              // Array of color classes for variety
              const colors = [
                'border-blue-500/20 bg-blue-50/50 text-blue-700 dark:bg-blue-500/5 dark:text-blue-300',
                'border-green-500/20 bg-green-50/50 text-green-700 dark:bg-green-500/5 dark:text-green-300',
                'border-purple-500/20 bg-purple-50/50 text-purple-700 dark:bg-purple-500/5 dark:text-purple-300',
                'border-orange-500/20 bg-orange-50/50 text-orange-700 dark:bg-orange-500/5 dark:text-orange-300',
                'border-pink-500/20 bg-pink-50/50 text-pink-700 dark:bg-pink-500/5 dark:text-pink-300',
                'border-indigo-500/20 bg-indigo-50/50 text-indigo-700 dark:bg-indigo-500/5 dark:text-indigo-300',
              ];
              
              return (
                <span 
                  key={index} 
                  className={`text-sm px-3 py-1 rounded-full border ${colors[index % colors.length]} transition-colors`}
                >
                  {item}
                </span>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            No menu available for this meal
          </p>
        )}
      </CardContent>
    </Card>
  );
} 