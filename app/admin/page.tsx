"use client";

import { useAuth } from '@/components/auth-provider';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MessMenuEditor from '@/components/admin/mess-menu-editor';
import EventsEditor from '@/components/admin/events-editor';
import NavigationEditor from '@/components/admin/navigation-editor';
import { QuestionPaperUpload } from '@/components/question-paper-upload';
import { Shield } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const { user } = useAuth();

  // Check if user is admin
  const isAdmin = user?.email?.endsWith('@srmap.edu.in');

  if (!user || !isAdmin) {
    return (
      <div className="max-w-lg mx-auto py-12 px-4">
        <Card className="p-6">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Admin Access Only</h2>
            <p className="text-muted-foreground">
              You need to be an admin to access this page.
            </p>
            <Link href="/">
              <Button className="rounded-full px-8">Go Home</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Shield className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage mess menus, events, navigation, and question papers
          </p>
        </div>
      </div>

      <Card className="p-6">
        <Tabs defaultValue="mess" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="mess">Mess Menu</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="navigation">Navigation</TabsTrigger>
            <TabsTrigger value="question-papers">Question Papers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="mess" className="space-y-4">
            <MessMenuEditor />
          </TabsContent>

          <TabsContent value="events" className="space-y-4">
            <EventsEditor />
          </TabsContent>

          <TabsContent value="navigation" className="space-y-4">
            <NavigationEditor />
          </TabsContent>

          <TabsContent value="question-papers" className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-semibold">Upload Question Paper</h2>
                <p className="text-sm text-muted-foreground">
                  Add past year question papers for students
                </p>
              </div>
              <Link href="/question-papers">
                <Button variant="outline">View All Papers</Button>
              </Link>
            </div>
            <QuestionPaperUpload />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}