"use client";

import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export default function MessPage() {
  const [selectedMess, setSelectedMess] = useState('national');
  const [selectedDay, setSelectedDay] = useState('monday');
  const [menu, setMenu] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Mess Menu</h1>
        <p className="text-muted-foreground">View the weekly menu for National and International mess</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Select value={selectedMess} onValueChange={setSelectedMess}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Mess" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="national">National Mess</SelectItem>
            <SelectItem value="international">International Mess</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedDay} onValueChange={setSelectedDay}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Day" />
          </SelectTrigger>
          <SelectContent>
            {DAYS.map((day) => (
              <SelectItem key={day} value={day} className="capitalize">
                {day}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="breakfast" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="breakfast">Breakfast</TabsTrigger>
          <TabsTrigger value="lunch">Lunch</TabsTrigger>
          <TabsTrigger value="dinner">Dinner</TabsTrigger>
        </TabsList>
        {['breakfast', 'lunch', 'dinner'].map((meal) => (
          <TabsContent key={meal} value={meal}>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 capitalize">{meal}</h3>
              {menu && menu[meal] ? (
                <ul className="list-disc list-inside space-y-2">
                  {menu[meal].map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No menu available for this meal</p>
              )}
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}