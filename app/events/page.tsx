"use client";

import { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { Loader2 } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: string;
}

function EventCard({ event }: { event: Event }) {
  return (
    <Card className="p-4">
      <div className="space-y-3">
        <div>
          <span className="inline-block px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
            {event.category}
          </span>
          <h3 className="text-lg font-semibold mt-2">{event.title}</h3>
        </div>
        <p className="text-sm text-muted-foreground">{event.description}</p>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{new Date(event.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{event.location}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function EventsPage() {
  const [events, setEvents] = useState<{ upcoming: Event[], past: Event[] }>({
    upcoming: [],
    past: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const eventsRef = collection(db, 'events');
    const eventsQuery = query(eventsRef, orderBy('date'));
    
    const unsubscribe = onSnapshot(eventsQuery, (snapshot) => {
      const now = new Date();
      const upcoming: Event[] = [];
      const past: Event[] = [];

      snapshot.forEach((doc) => {
        const event = { id: doc.id, ...doc.data() } as Event;
        const eventDate = new Date(event.date);
        
        if (eventDate >= now) {
          upcoming.push(event);
        } else {
          past.push(event);
        }
      });

      setEvents({ upcoming, past });
      setLoading(false);
    }, (error) => {
      console.error('Error fetching events:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Events</h1>
        <p className="text-muted-foreground">Stay updated with all campus events</p>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="mt-4">
          <div className="grid gap-4">
            {events.upcoming.length > 0 ? (
              events.upcoming.map((event) => (
                <EventCard key={event.id} event={event} />
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No upcoming events scheduled
              </p>
            )}
          </div>
        </TabsContent>
        <TabsContent value="past" className="mt-4">
          <div className="grid gap-4">
            {events.past.length > 0 ? (
              events.past.map((event) => (
                <EventCard key={event.id} event={event} />
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No past events
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}