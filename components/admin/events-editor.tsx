"use client";

import { useState } from 'react';
import { doc, setDoc, collection, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Card } from '@/components/ui/card';
import { Loader2, Plus, Trash2 } from 'lucide-react';

const EVENT_CATEGORIES = ['Academic', 'Cultural', 'Technical', 'Sports', 'Other'];

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: string;
}

export default function EventsEditor() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [event, setEvent] = useState<Event>({
    id: '',
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    category: EVENT_CATEGORIES[0],
  });

  const handleChange = (field: keyof Event, value: string) => {
    setEvent(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const eventId = event.id || Date.now().toString();
      const eventRef = doc(collection(db, 'events'), eventId);
      
      await setDoc(eventRef, {
        ...event,
        id: eventId,
        updatedAt: new Date().toISOString(),
      });

      toast({
        title: "Success",
        description: "Event saved successfully",
      });

      // Reset form
      setEvent({
        id: '',
        title: '',
        date: '',
        time: '',
        location: '',
        description: '',
        category: EVENT_CATEGORIES[0],
      });
    } catch (error) {
      console.error('Error saving event:', error);
      toast({
        title: "Error",
        description: "Failed to save event",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              value={event.title}
              onChange={(e) => handleChange('title', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={event.category}
              onValueChange={(value) => handleChange('category', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {EVENT_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={event.date}
              onChange={(e) => handleChange('date', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              value={event.time}
              onChange={(e) => handleChange('time', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={event.location}
              onChange={(e) => handleChange('location', e.target.value)}
              required
            />
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            className="w-full min-h-[100px] p-3 rounded-md border border-input bg-background"
            value={event.description}
            onChange={(e) => handleChange('description', e.target.value)}
            required
          />
        </div>

        <Button 
          onClick={handleSave} 
          className="w-full mt-4" 
          disabled={loading || !event.title || !event.date}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving Event
            </>
          ) : (
            'Save Event'
          )}
        </Button>
      </Card>
    </div>
  );
}