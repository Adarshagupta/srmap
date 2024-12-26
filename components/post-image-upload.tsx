"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Image as ImageIcon, X, Loader2 } from 'lucide-react';
import { useImageUpload } from '@/hooks/use-image-upload';
import Image from 'next/image';

interface PostImageUploadProps {
  userId: string;
  onUploadComplete: (url: string) => void;
  onRemove: () => void;
  currentImageUrl?: string;
}

export function PostImageUpload({ userId, onUploadComplete, onRemove, currentImageUrl }: PostImageUploadProps) {
  const { uploadImage, uploading } = useImageUpload({
    type: 'post',
    userId,
    maxSizeMB: 5,
  });

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const imageUrl = await uploadImage(file);
    if (imageUrl) {
      onUploadComplete(imageUrl);
    }
  };

  return (
    <div className="relative">
      {currentImageUrl ? (
        <div className="relative rounded-lg overflow-hidden">
          <div className="aspect-video relative">
            <Image
              src={currentImageUrl}
              alt="Post image"
              fill
              className="object-cover"
            />
          </div>
          <Button
            size="icon"
            variant="destructive"
            className="absolute top-2 right-2"
            onClick={onRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <label className="block">
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors">
            {uploading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 py-4">
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Click to add an image
                </p>
              </div>
            )}
          </div>
          <input
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