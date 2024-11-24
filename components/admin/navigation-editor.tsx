"use client";

import { useState } from 'react';
import { doc, setDoc, collection, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Card } from '@/components/ui/card';
import { Loader2, Plus, Trash2 } from 'lucide-react';

interface Building {
  id: string;
  name: string;
  description: string;
  location: string;
  imageUrl: string;
  facilities: string[];
}

export default function NavigationEditor() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [building, setBuilding] = useState<Building>({
    id: '',
    name: '',
    description: '',
    location: '',
    imageUrl: '',
    facilities: [],
  });
  const [newFacility, setNewFacility] = useState('');

  const handleChange = (field: keyof Building, value: string) => {
    setBuilding(prev => ({ ...prev, [field]: value }));
  };

  const handleAddFacility = () => {
    if (newFacility.trim()) {
      setBuilding(prev => ({
        ...prev,
        facilities: [...prev.facilities, newFacility.trim()],
      }));
      setNewFacility('');
    }
  };

  const handleRemoveFacility = (index: number) => {
    setBuilding(prev => ({
      ...prev,
      facilities: prev.facilities.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const buildingId = building.id || Date.now().toString();
      const buildingRef = doc(collection(db, 'buildings'), buildingId);
      
      await setDoc(buildingRef, {
        ...building,
        id: buildingId,
        updatedAt: new Date().toISOString(),
      });

      toast({
        title: "Success",
        description: "Building information saved successfully",
      });

      // Reset form
      setBuilding({
        id: '',
        name: '',
        description: '',
        location: '',
        imageUrl: '',
        facilities: [],
      });
    } catch (error) {
      console.error('Error saving building:', error);
      toast({
        title: "Error",
        description: "Failed to save building information",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Building Name</Label>
            <Input
              id="name"
              value={building.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              className="w-full min-h-[100px] p-3 rounded-md border border-input bg-background"
              value={building.description}
              onChange={(e) => handleChange('description', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={building.location}
              onChange={(e) => handleChange('location', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              type="url"
              value={building.imageUrl}
              onChange={(e) => handleChange('imageUrl', e.target.value)}
              placeholder="https://example.com/image.jpg"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Facilities</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add facility..."
                value={newFacility}
                onChange={(e) => setNewFacility(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddFacility()}
              />
              <Button onClick={handleAddFacility} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2 mt-2">
              {building.facilities.map((facility, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                  <span>{facility}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveFacility(index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Button 
          onClick={handleSave} 
          className="w-full mt-6" 
          disabled={loading || !building.name || !building.location}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving Building
            </>
          ) : (
            'Save Building'
          )}
        </Button>
      </Card>
    </div>
  );
}