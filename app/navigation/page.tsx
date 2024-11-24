"use client";

import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

interface Building {
  id: string;
  name: string;
  description: string;
  location: string;
  facilities: string[];
  imageUrl: string;
}

export default function NavigationPage() {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const buildingsRef = collection(db, 'buildings');
    
    const unsubscribe = onSnapshot(buildingsRef, (snapshot) => {
      const buildingsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Building[];
      
      setBuildings(buildingsData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching buildings:', error);
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
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Campus Navigation</h1>
        <p className="text-muted-foreground">Find your way around SRM University AP campus</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {buildings.length > 0 ? (
          buildings.map((building) => (
            <Card key={building.id} className="overflow-hidden">
              <div className="relative h-48">
                <Image
                  src={building.imageUrl}
                  alt={building.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{building.name}</h2>
                <p className="text-muted-foreground mb-4">{building.description}</p>
                <div className="space-y-2">
                  <p><strong>Location:</strong> {building.location}</p>
                  <div>
                    <strong>Facilities:</strong>
                    <ul className="list-disc list-inside mt-1">
                      {building.facilities.map((facility) => (
                        <li key={facility}>{facility}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <p className="text-center text-muted-foreground col-span-2 py-8">
            No buildings information available
          </p>
        )}
      </div>
    </div>
  );
}