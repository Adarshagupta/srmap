"use client";

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Loader2, Camera } from 'lucide-react';
import { useImageUpload } from '@/hooks/use-image-upload';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/components/auth-provider';
import { useToast } from '@/components/ui/use-toast';

interface ProfileImageUploadProps {
  userId: string;
  currentImageUrl?: string;
  userName: string;
  onUploadComplete?: (url: string) => void;
}

export function ProfileImageUpload({ userId, currentImageUrl, userName, onUploadComplete }: ProfileImageUploadProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const { uploadImage, uploading } = useImageUpload({
    type: 'profile',
    userId,
    maxSizeMB: 2,
  });

  // Check if the current user is authorized to change this profile
  const isAuthorized = user?.uid === userId;

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    // Double-check authorization
    if (!isAuthorized) {
      toast({
        title: "Unauthorized",
        description: "You can only change your own profile image",
        variant: "destructive",
      });
      return;
    }

    const file = event.target.files?.[0];
    if (!file) return;

    const imageUrl = await uploadImage(file);
    if (imageUrl) {
      // Update user profile in Firestore
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        avatar: imageUrl,
      });
      onUploadComplete?.(imageUrl);
    }
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Avatar className="w-24 h-24 border-2 border-background">
        <AvatarImage src={currentImageUrl} />
        <AvatarFallback className="text-lg">
          {userName.split(' ').map(n => n[0]).join('')}
        </AvatarFallback>
      </Avatar>

      {isAuthorized && (
        <label
          htmlFor="profile-image"
          className={`absolute inset-0 flex items-center justify-center rounded-full cursor-pointer transition-opacity ${
            isHovered || uploading ? 'bg-black/50' : 'bg-transparent opacity-0'
          }`}
        >
          {uploading ? (
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          ) : (
            <Camera className="w-6 h-6 text-white" />
          )}
          <input
            id="profile-image"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
            disabled={uploading}
          />
        </label>
      )}
    </div>
  );
} 