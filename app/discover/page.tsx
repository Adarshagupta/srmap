"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import DiscoverPeople from '@/components/discover-people';
import ProfileForm from '@/components/profile-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function DiscoverPage() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('discover');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'profile') {
      setActiveTab('profile');
    }
  }, [searchParams]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          Discover & Connect
        </h1>
        <p className="text-muted-foreground">
          Manage your profile and connect with the SRM University AP community
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="discover">Discover People</TabsTrigger>
          <TabsTrigger value="profile">My Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="discover" className="space-y-6">
          <DiscoverPeople />
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold">Profile Information</h2>
              <p className="text-muted-foreground">
                Update your profile information to connect with others
              </p>
            </div>
            <ProfileForm />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}