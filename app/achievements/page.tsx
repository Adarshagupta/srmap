"use client";

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Award, Users, GraduationCap } from 'lucide-react';
import Image from 'next/image';

interface Achievement {
  title: string;
  description: string;
  imageUrl?: string;
  category: 'student' | 'faculty' | 'research';
  date: string;
  achiever: string;
  department: string;
}

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await fetch('/api/achievements');
        const data = await response.json();
        setAchievements(data);
      } catch (error) {
        console.error('Error fetching achievements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Achievements</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Achievements</h1>
      
      <Tabs defaultValue="all" className="mb-8">
        <TabsList>
          <TabsTrigger value="all" className="gap-2">
            <Award className="h-4 w-4" />
            All
          </TabsTrigger>
          <TabsTrigger value="student" className="gap-2">
            <GraduationCap className="h-4 w-4" />
            Student
          </TabsTrigger>
          <TabsTrigger value="faculty" className="gap-2">
            <Users className="h-4 w-4" />
            Faculty
          </TabsTrigger>
          <TabsTrigger value="research" className="gap-2">
            <Users className="h-4 w-4" />
            Research
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {achievements.map((item, index) => (
              <AchievementCard key={index} achievement={item} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="student" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {achievements
              .filter(item => item.category === 'student')
              .map((item, index) => (
                <AchievementCard key={index} achievement={item} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="faculty" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {achievements
              .filter(item => item.category === 'faculty')
              .map((item, index) => (
                <AchievementCard key={index} achievement={item} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="research" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {achievements
              .filter(item => item.category === 'research')
              .map((item, index) => (
                <AchievementCard key={index} achievement={item} />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AchievementCard({ achievement }: { achievement: Achievement }) {
  return (
    <Card className="overflow-hidden flex flex-col">
      {achievement.imageUrl && (
        <div className="relative h-48">
          <Image
            src={achievement.imageUrl}
            alt={achievement.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <span>{achievement.department}</span>
          <span>•</span>
          <span>{achievement.date}</span>
        </div>
        <h2 className="text-xl font-semibold mb-2 line-clamp-2">
          {achievement.title}
        </h2>
        <p className="text-muted-foreground mb-4 line-clamp-3">
          {achievement.description}
        </p>
        <div className="mt-auto">
          <p className="text-sm font-medium">
            {achievement.achiever}
          </p>
        </div>
      </div>
    </Card>
  );
} 