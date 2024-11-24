"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Bell, Globe, Palette, Shield } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [sound, setSound] = useState(true);
  const [language, setLanguage] = useState('en');

  return (
    <div className="space-y-6 pb-16">
      <div className="space-y-0.5">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your app preferences and account settings.
        </p>
      </div>

      <Separator />

      <div className="grid gap-6">
        {/* Appearance */}
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <Palette className="h-6 w-6" />
            <h2 className="text-xl font-semibold">Appearance</h2>
          </div>
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <Label>Theme</Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger>
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <Bell className="h-6 w-6" />
            <h2 className="text-xl font-semibold">Notifications</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications about events and updates
                </p>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Sound</Label>
                <p className="text-sm text-muted-foreground">
                  Play sound for notifications
                </p>
              </div>
              <Switch
                checked={sound}
                onCheckedChange={setSound}
              />
            </div>
          </div>
        </Card>

        {/* Language */}
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <Globe className="h-6 w-6" />
            <h2 className="text-xl font-semibold">Language & Region</h2>
          </div>
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <Label>Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">Hindi</SelectItem>
                  <SelectItem value="te">Telugu</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Advanced Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <Shield className="h-6 w-6" />
            <h2 className="text-xl font-semibold">Advanced Settings</h2>
          </div>
          <div className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              Clear App Cache
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Export Data
            </Button>
            <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
              Reset All Settings
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}