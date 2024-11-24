"use client";

import { useState, useEffect } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { useAuth } from './auth-provider';

interface ProfileFormData {
  name: string;
  email: string;
  regNumber: string;
  batch: string;
  year: string;
  department: string;
  dob: string;
  interests: string;
  bio: string;
}

const DEPARTMENTS = [
  'Computer Science and Engineering',
  'Electronics and Communication',
  'Mechanical Engineering',
  'Civil Engineering',
  'Chemical Engineering',
  'Electrical Engineering',
];

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

const initialFormData: ProfileFormData = {
  name: '',
  email: '',
  regNumber: '',
  batch: new Date().getFullYear().toString(),
  year: '',
  department: '',
  dob: '',
  interests: '',
  bio: '',
};

export default function ProfileForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>(initialFormData);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            name: data.name || '',
            email: data.email || user.email || '',
            regNumber: data.regNumber || '',
            batch: data.batch || new Date().getFullYear().toString(),
            year: data.year || '',
            department: data.department || '',
            dob: data.dob || '',
            interests: Array.isArray(data.interests) ? data.interests.join(', ') : data.interests || '',
            bio: data.bio || '',
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, toast]);

  const handleChange = (field: keyof ProfileFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);
      await setDoc(doc(db, 'users', user.uid), {
        ...formData,
        interests: formData.interests.split(',').map(i => i.trim()),
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">College Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              disabled
              className="bg-muted"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="regNumber">Registration Number</Label>
            <Input
              id="regNumber"
              value={formData.regNumber}
              onChange={(e) => handleChange('regNumber', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="batch">Batch</Label>
            <Input
              id="batch"
              type="number"
              min={2020}
              max={2030}
              value={formData.batch}
              onChange={(e) => handleChange('batch', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="year">Current Year</Label>
            <Select
              value={formData.year}
              onValueChange={(value) => handleChange('year', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {YEARS.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select
              value={formData.department}
              onValueChange={(value) => handleChange('department', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {DEPARTMENTS.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dob">Date of Birth</Label>
            <Input
              id="dob"
              type="date"
              value={formData.dob}
              onChange={(e) => handleChange('dob', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="interests">Interests (comma-separated)</Label>
            <Input
              id="interests"
              placeholder="AI, Web Development, Robotics"
              value={formData.interests}
              onChange={(e) => handleChange('interests', e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <textarea
            id="bio"
            className="w-full min-h-[100px] p-3 rounded-md border border-input bg-background"
            value={formData.bio}
            onChange={(e) => handleChange('bio', e.target.value)}
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating Profile
            </>
          ) : (
            'Update Profile'
          )}
        </Button>
      </form>
    </Card>
  );
}