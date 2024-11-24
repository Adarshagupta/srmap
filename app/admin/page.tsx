"use client";

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MessMenuEditor from '@/components/admin/mess-menu-editor';
import EventsEditor from '@/components/admin/events-editor';
import NavigationEditor from '@/components/admin/navigation-editor';
import { Card } from '@/components/ui/card';
import { Shield } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Shield className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage mess menus, events, and campus navigation
          </p>
        </div>
      </div>

      <Card className="p-6">
        <Tabs defaultValue="mess" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="mess">Mess Menu</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="navigation">Navigation</TabsTrigger>
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
        </Tabs>
      </Card>
    </div>
  );
}