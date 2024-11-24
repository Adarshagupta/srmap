"use client";

import { useState, useEffect } from 'react';
import { doc, setDoc, collection, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Plus, Trash2 } from 'lucide-react';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const MEAL_TYPES = ['breakfast', 'lunch', 'dinner'];
const MESS_TYPES = ['national', 'international'];

export default function MessMenuEditor() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState(DAYS[0]);
  const [selectedMeal, setSelectedMeal] = useState(MEAL_TYPES[0]);
  const [selectedMess, setSelectedMess] = useState(MESS_TYPES[0]);
  const [items, setItems] = useState<string[]>([]);
  const [newItem, setNewItem] = useState('');
  const [fetchingMenu, setFetchingMenu] = useState(false);

  // Fetch existing menu when selections change
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setFetchingMenu(true);
        const menuRef = doc(db, 'mess-menus', `${selectedMess}-${selectedDay}`);
        const menuDoc = await getDoc(menuRef);
        
        if (menuDoc.exists()) {
          const data = menuDoc.data();
          setItems(data[selectedMeal] || []);
        } else {
          setItems([]);
        }
      } catch (error) {
        console.error('Error fetching menu:', error);
        toast({
          title: "Error",
          description: "Failed to load menu",
          variant: "destructive",
        });
      } finally {
        setFetchingMenu(false);
      }
    };

    fetchMenu();
  }, [selectedMess, selectedDay, selectedMeal, toast]);

  const handleAddItem = () => {
    if (newItem.trim()) {
      setItems([...items, newItem.trim()]);
      setNewItem('');
    }
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const menuRef = doc(db, 'mess-menus', `${selectedMess}-${selectedDay}`);
      
      // Get existing data first
      const existingDoc = await getDoc(menuRef);
      const existingData = existingDoc.exists() ? existingDoc.data() : {};
      
      // Merge with new data
      await setDoc(menuRef, {
        ...existingData,
        id: `${selectedMess}-${selectedDay}`,
        [selectedMeal]: items,
        updatedAt: new Date().toISOString(),
      });

      toast({
        title: "Success",
        description: "Menu updated successfully",
      });
    } catch (error) {
      console.error('Error updating menu:', error);
      toast({
        title: "Error",
        description: "Failed to update menu",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetchingMenu) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Mess Type</Label>
          <Select value={selectedMess} onValueChange={setSelectedMess}>
            <SelectTrigger>
              <SelectValue placeholder="Select mess type" />
            </SelectTrigger>
            <SelectContent>
              {MESS_TYPES.map((type) => (
                <SelectItem key={type} value={type} className="capitalize">
                  {type} Mess
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Day</Label>
          <Select value={selectedDay} onValueChange={setSelectedDay}>
            <SelectTrigger>
              <SelectValue placeholder="Select day" />
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

        <div className="space-y-2">
          <Label>Meal</Label>
          <Select value={selectedMeal} onValueChange={setSelectedMeal}>
            <SelectTrigger>
              <SelectValue placeholder="Select meal" />
            </SelectTrigger>
            <SelectContent>
              {MEAL_TYPES.map((meal) => (
                <SelectItem key={meal} value={meal} className="capitalize">
                  {meal}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Add menu item..."
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
          />
          <Button onClick={handleAddItem} size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
              <span>{item}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveItem(index)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
          {items.length === 0 && (
            <p className="text-center text-muted-foreground py-4">
              No items added yet
            </p>
          )}
        </div>

        <Button 
          onClick={handleSave} 
          className="w-full" 
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving Changes
            </>
          ) : (
            'Save Menu'
          )}
        </Button>
      </div>
    </div>
  );
}