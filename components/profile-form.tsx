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
import { useRouter } from 'next/navigation';

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
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof ProfileFormData, string>>>({});

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
        } else {
          // If no profile exists, set email from user
          setFormData(prev => ({
            ...prev,
            email: user.email || '',
          }));
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

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ProfileFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.regNumber.trim()) {
      newErrors.regNumber = 'Registration number is required';
    } else if (!/^AP\d{8,13}$/i.test(formData.regNumber)) {
      newErrors.regNumber = 'Invalid registration number format (e.g., AP21110010XXX)';
    }

    const batchYear = parseInt(formData.batch);
    if (isNaN(batchYear) || batchYear < 2020 || batchYear > 2030) {
      newErrors.batch = 'Batch year must be between 2020 and 2030';
    }

    if (!formData.year) {
      newErrors.year = 'Year is required';
    }

    if (!formData.department) {
      newErrors.department = 'Department is required';
    }

    if (!formData.dob) {
      newErrors.dob = 'Date of birth is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof ProfileFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when field is edited
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please check the form for errors",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      await setDoc(doc(db, 'users', user.uid), {
        ...formData,
        interests: formData.interests.split(',').map(i => i.trim()).filter(Boolean),
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });

      // Navigate back to profile page after successful update
      router.push('/profile');
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
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
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
              onChange={(e) => handleChange('regNumber', e.target.value.toUpperCase())}
              placeholder="AP21110010"
              required
              className={errors.regNumber ? 'border-destructive' : ''}
            />
            {errors.regNumber && (
              <p className="text-sm text-destructive">{errors.regNumber}</p>
            )}
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
              className={errors.batch ? 'border-destructive' : ''}
            />
            {errors.batch && (
              <p className="text-sm text-destructive">{errors.batch}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="year">Current Year</Label>
            <Select
              value={formData.year}
              onValueChange={(value) => handleChange('year', value)}
            >
              <SelectTrigger className={errors.year ? 'border-destructive' : ''}>
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
            {errors.year && (
              <p className="text-sm text-destructive">{errors.year}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select
              value={formData.department}
              onValueChange={(value) => handleChange('department', value)}
            >
              <SelectTrigger className={errors.department ? 'border-destructive' : ''}>
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
            {errors.department && (
              <p className="text-sm text-destructive">{errors.department}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dob">Date of Birth</Label>
            <Input
              id="dob"
              type="date"
              value={formData.dob}
              onChange={(e) => handleChange('dob', e.target.value)}
              required
              className={errors.dob ? 'border-destructive' : ''}
            />
            {errors.dob && (
              <p className="text-sm text-destructive">{errors.dob}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="interests">Interests (comma-separated)</Label>
            <Input
              id="interests"
              placeholder="AI, Web Development, Robotics"
              value={formData.interests}
              onChange={(e) => handleChange('interests', e.target.value)}
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
            placeholder="Tell us about yourself..."
          />
        </div>

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" className="flex-1" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating Profile
              </>
            ) : (
              'Update Profile'
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}