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
import { Loader2, Twitter, Instagram, Linkedin, Github } from 'lucide-react';
import { useAuth } from './auth-provider';
import { useRouter } from 'next/navigation';

interface SocialLinks {
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  github?: string;
}

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
  socialLinks: SocialLinks;
}

type FormErrors = {
  [K in keyof ProfileFormData | keyof SocialLinks as K extends keyof SocialLinks ? `socialLinks.${K}` : K]?: string;
};

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
  socialLinks: {
    twitter: '',
    instagram: '',
    linkedin: '',
    github: '',
  },
};

export default function ProfileForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});

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
            socialLinks: {
              twitter: data.socialLinks?.twitter || '',
              instagram: data.socialLinks?.instagram || '',
              linkedin: data.socialLinks?.linkedin || '',
              github: data.socialLinks?.github || '',
            },
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

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.name) {
      newErrors.name = 'Name is required';
    }

    if (!formData.regNumber) {
      newErrors.regNumber = 'Registration number is required';
    }

    if (!formData.year) {
      newErrors.year = 'Year is required';
    }

    if (!formData.department) {
      newErrors.department = 'Department is required';
    }

    // Validate social links format
    const urlPattern = /^https?:\/\/.+/;
    if (formData.socialLinks?.twitter && !urlPattern.test(formData.socialLinks.twitter)) {
      newErrors['socialLinks.twitter'] = 'Please enter a valid URL starting with http:// or https://';
    }
    if (formData.socialLinks?.instagram && !urlPattern.test(formData.socialLinks.instagram)) {
      newErrors['socialLinks.instagram'] = 'Please enter a valid URL starting with http:// or https://';
    }
    if (formData.socialLinks?.linkedin && !urlPattern.test(formData.socialLinks.linkedin)) {
      newErrors['socialLinks.linkedin'] = 'Please enter a valid URL starting with http:// or https://';
    }
    if (formData.socialLinks?.github && !urlPattern.test(formData.socialLinks.github)) {
      newErrors['socialLinks.github'] = 'Please enter a valid URL starting with http:// or https://';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please check the form for errors",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to update your profile",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const docRef = doc(db, 'users', user.uid);
      
      const dataToSave = {
        ...formData,
        interests: formData.interests.split(',').map(i => i.trim()).filter(Boolean),
        updatedAt: new Date(),
      };

      console.log('Saving profile data:', dataToSave);
      console.log('Social links being saved:', dataToSave.socialLinks);
      
      await setDoc(docRef, dataToSave, { merge: true });

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });

      router.push(`/profile/${user.uid}`);
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

  type FormField = keyof ProfileFormData | `socialLinks.${keyof SocialLinks}`;

  const handleChange = (field: FormField, value: string) => {
    if (field.startsWith('socialLinks.')) {
      const socialPlatform = field.split('.')[1] as keyof SocialLinks;
      setFormData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialPlatform]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="John Doe"
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
              onChange={(e) => handleChange('regNumber', e.target.value)}
              placeholder="AP21110010XXX"
            />
            {errors.regNumber && (
              <p className="text-sm text-destructive">{errors.regNumber}</p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Year</Label>
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
              {errors.year && (
                <p className="text-sm text-destructive">{errors.year}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Batch</Label>
              <Input
                value={formData.batch}
                onChange={(e) => handleChange('batch', e.target.value)}
                placeholder="2021"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Department</Label>
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
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="interests">Interests (comma-separated)</Label>
            <Input
              id="interests"
              value={formData.interests}
              onChange={(e) => handleChange('interests', e.target.value)}
              placeholder="Programming, AI, Machine Learning"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <textarea
              id="bio"
              className="w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={formData.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              placeholder="Tell us about yourself..."
            />
          </div>

          <div className="space-y-4">
            <Label>Social Links</Label>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Twitter className="w-5 h-5 text-muted-foreground" />
                <Input
                  value={formData.socialLinks?.twitter || ''}
                  onChange={(e) => handleChange('socialLinks.twitter', e.target.value)}
                  placeholder="https://twitter.com/username"
                />
              </div>
              {errors['socialLinks.twitter'] && (
                <p className="text-sm text-destructive">{errors['socialLinks.twitter']}</p>
              )}

              <div className="flex items-center space-x-2">
                <Instagram className="w-5 h-5 text-muted-foreground" />
                <Input
                  value={formData.socialLinks?.instagram || ''}
                  onChange={(e) => handleChange('socialLinks.instagram', e.target.value)}
                  placeholder="https://instagram.com/username"
                />
              </div>
              {errors['socialLinks.instagram'] && (
                <p className="text-sm text-destructive">{errors['socialLinks.instagram']}</p>
              )}

              <div className="flex items-center space-x-2">
                <Linkedin className="w-5 h-5 text-muted-foreground" />
                <Input
                  value={formData.socialLinks?.linkedin || ''}
                  onChange={(e) => handleChange('socialLinks.linkedin', e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
              {errors['socialLinks.linkedin'] && (
                <p className="text-sm text-destructive">{errors['socialLinks.linkedin']}</p>
              )}

              <div className="flex items-center space-x-2">
                <Github className="w-5 h-5 text-muted-foreground" />
                <Input
                  value={formData.socialLinks?.github || ''}
                  onChange={(e) => handleChange('socialLinks.github', e.target.value)}
                  placeholder="https://github.com/username"
                />
              </div>
              {errors['socialLinks.github'] && (
                <p className="text-sm text-destructive">{errors['socialLinks.github']}</p>
              )}
            </div>
          </div>
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