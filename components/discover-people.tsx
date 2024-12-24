"use client";

import { useEffect, useState } from 'react';
import { collection, getDocs, query, limit, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserCircle, MapPin, BookOpen, Mail, Calendar, GraduationCap, Hash } from 'lucide-react';
import { useToast } from './ui/use-toast';

interface Person {
  id: string;
  name: string;
  email: string;
  collegeEmail?: string;
  regNumber: string;
  batch: string;
  year: string;
  department: string;
  dob: string;
  interests: string[];
  bio: string;
}

export default function DiscoverPeople() {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        setLoading(true);
        setError(null);

        const q = query(collection(db, 'users'), limit(10));

        const unsubscribe = onSnapshot(q, 
          (snapshot) => {
            console.log('Number of documents:', snapshot.docs.length);
            snapshot.docs.forEach(doc => {
              const data = doc.data();
              console.log('User data:', {
                id: doc.id,
                email: data.email,
                collegeEmail: data.collegeEmail,
                name: data.name
              });
            });
            const peopleData = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            })) as Person[];
            setPeople(peopleData);
            setLoading(false);
          },
          (error) => {
            console.error('Error fetching people:', error);
            setError('Failed to load people. Please try again later.');
            setLoading(false);
            toast({
              title: "Error",
              description: "Failed to load people. Please check your connection.",
              variant: "destructive",
            });
          }
        );

        return () => unsubscribe();
      } catch (error) {
        console.error('Error setting up people listener:', error);
        setError('Failed to initialize people loader.');
        setLoading(false);
      }
    };

    fetchPeople();
  }, [toast]);

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-destructive mb-4">{error}</p>
        <Button 
          onClick={() => window.location.reload()}
          variant="outline"
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {people.map((person) => (
        <Card key={person.id} className="p-6 hover:shadow-lg transition-all duration-200">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <UserCircle className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{person.name}</h3>
                <p className="text-sm text-muted-foreground">{person.year} • {person.batch} Batch</p>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Hash className="w-4 h-4" />
                <span>{person.regNumber}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <GraduationCap className="w-4 h-4" />
                <span>{person.department}</span>
              </div>
              <div className="flex flex-col gap-1">
                {person.collegeEmail && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <a href={`mailto:${person.collegeEmail}`} className="hover:text-primary transition-colors">
                      {person.collegeEmail} (College)
                    </a>
                  </div>
                )}
                {person.email && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <a href={`mailto:${person.email}`} className="hover:text-primary transition-colors">
                      {person.email}
                    </a>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{new Date(person.dob).toLocaleDateString()}</span>
              </div>
            </div>

            {person.bio && (
              <p className="text-sm text-muted-foreground border-l-2 border-primary/20 pl-3">
                {person.bio}
              </p>
            )}

            <div className="flex flex-wrap gap-2">
              {person.interests?.map((interest, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
                >
                  {interest}
                </span>
              ))}
            </div>

            <Button className="w-full">Connect</Button>
          </div>
        </Card>
      ))}
    </div>
  );
}