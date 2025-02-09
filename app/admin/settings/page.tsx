"use client";

import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from '@/components/ui/separator';

interface Settings {
  allowRegistration: boolean;
  requireEmailVerification: boolean;
  maxLoginAttempts: number;
  sessionTimeout: number;
  notificationSettings: {
    enablePushNotifications: boolean;
    enableEmailNotifications: boolean;
    emailFrequency: string;
  };
  maintenanceMode: boolean;
  maintenanceMessage: string;
  theme: {
    primaryColor: string;
    darkMode: boolean;
  };
}

const DEFAULT_SETTINGS: Settings = {
  allowRegistration: true,
  requireEmailVerification: true,
  maxLoginAttempts: 5,
  sessionTimeout: 60,
  notificationSettings: {
    enablePushNotifications: true,
    enableEmailNotifications: true,
    emailFrequency: 'daily',
  },
  maintenanceMode: false,
  maintenanceMessage: 'System is under maintenance. Please try again later.',
  theme: {
    primaryColor: 'blue',
    darkMode: true,
  },
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const settingsRef = doc(db, 'settings', 'app-settings');
      const snapshot = await getDoc(settingsRef);
      
      if (snapshot.exists()) {
        setSettings(snapshot.data() as Settings);
      } else {
        // Initialize with default settings if none exist
        await updateDoc(settingsRef, DEFAULT_SETTINGS);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast({
        title: "Error",
        description: "Failed to fetch settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function saveSettings() {
    setSaving(true);
    try {
      const settingsRef = doc(db, 'settings', 'app-settings');
      await updateDoc(settingsRef, settings);
      
      toast({
        title: "Success",
        description: "Settings saved successfully",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage application settings and configurations
        </p>
      </div>

      <div className="grid gap-6">
        {/* Authentication Settings */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Authentication</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Allow Registration</Label>
                <p className="text-sm text-muted-foreground">
                  Allow new users to register
                </p>
              </div>
              <Switch
                checked={settings.allowRegistration}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, allowRegistration: checked })
                }
              />
            </div>
            
            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Require Email Verification</Label>
                <p className="text-sm text-muted-foreground">
                  Require users to verify their email before accessing the app
                </p>
              </div>
              <Switch
                checked={settings.requireEmailVerification}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, requireEmailVerification: checked })
                }
              />
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Max Login Attempts</Label>
                <Input
                  type="number"
                  value={settings.maxLoginAttempts}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      maxLoginAttempts: parseInt(e.target.value),
                    })
                  }
                  min={1}
                  max={10}
                />
              </div>

              <div className="space-y-2">
                <Label>Session Timeout (minutes)</Label>
                <Input
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      sessionTimeout: parseInt(e.target.value),
                    })
                  }
                  min={15}
                  max={480}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Enable push notifications for users
                </p>
              </div>
              <Switch
                checked={settings.notificationSettings.enablePushNotifications}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...settings,
                    notificationSettings: {
                      ...settings.notificationSettings,
                      enablePushNotifications: checked,
                    },
                  })
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Enable email notifications for users
                </p>
              </div>
              <Switch
                checked={settings.notificationSettings.enableEmailNotifications}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...settings,
                    notificationSettings: {
                      ...settings.notificationSettings,
                      enableEmailNotifications: checked,
                    },
                  })
                }
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Email Digest Frequency</Label>
              <Select
                value={settings.notificationSettings.emailFrequency}
                onValueChange={(value) =>
                  setSettings({
                    ...settings,
                    notificationSettings: {
                      ...settings.notificationSettings,
                      emailFrequency: value,
                    },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="never">Never</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Maintenance Settings */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Maintenance</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Enable maintenance mode to restrict access
                </p>
              </div>
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, maintenanceMode: checked })
                }
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Maintenance Message</Label>
              <Input
                value={settings.maintenanceMessage}
                onChange={(e) =>
                  setSettings({ ...settings, maintenanceMessage: e.target.value })
                }
                placeholder="Message to display during maintenance"
              />
            </div>
          </div>
        </Card>

        {/* Theme Settings */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Theme</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Primary Color</Label>
              <Select
                value={settings.theme.primaryColor}
                onValueChange={(value) =>
                  setSettings({
                    ...settings,
                    theme: { ...settings.theme, primaryColor: value },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select color" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blue">Blue</SelectItem>
                  <SelectItem value="green">Green</SelectItem>
                  <SelectItem value="purple">Purple</SelectItem>
                  <SelectItem value="red">Red</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Dark Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Enable dark mode by default
                </p>
              </div>
              <Switch
                checked={settings.theme.darkMode}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...settings,
                    theme: { ...settings.theme, darkMode: checked },
                  })
                }
              />
            </div>
          </div>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={saveSettings}
          disabled={saving}
        >
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Settings
        </Button>
      </div>
    </div>
  );
} 