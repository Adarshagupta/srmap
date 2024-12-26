"use client";

import { useState, useEffect } from 'react';
import { uploadToS3, generateS3Key, validateS3Configuration } from '@/lib/s3';
import { useToast } from '@/components/ui/use-toast';

interface UseImageUploadOptions {
  type: 'profile' | 'post';
  userId: string;
  maxSizeMB?: number;
}

export function useImageUpload({ type, userId, maxSizeMB = 5 }: UseImageUploadOptions) {
  const [uploading, setUploading] = useState(false);
  const [isConfigValid, setIsConfigValid] = useState<boolean | null>(null);
  const { toast } = useToast();

  // Validate S3 configuration on mount
  useEffect(() => {
    async function checkConfig() {
      try {
        const isValid = await validateS3Configuration();
        setIsConfigValid(isValid);
        if (!isValid) {
          toast({
            title: "Configuration Error",
            description: "Image upload is not available. Please contact support.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error validating S3 configuration:', error);
        setIsConfigValid(false);
      }
    }
    checkConfig();
  }, [toast]);

  const uploadImage = async (file: File): Promise<string | null> => {
    // Check if configuration is valid
    if (!isConfigValid) {
      toast({
        title: "Upload Error",
        description: "Image upload is not available. Please try again later.",
        variant: "destructive",
      });
      return null;
    }

    console.log('Starting image upload:', {
      fileName: file.name,
      fileType: file.type,
      fileSize: `${(file.size / (1024 * 1024)).toFixed(2)}MB`,
      maxSize: `${maxSizeMB}MB`,
      type,
      userId,
    });

    try {
      setUploading(true);

      // Validate file type
      if (!file.type.startsWith('image/')) {
        console.error('Invalid file type:', file.type);
        toast({
          title: "Invalid file type",
          description: "Please upload an image file (JPG, PNG, GIF, etc.)",
          variant: "destructive",
        });
        return null;
      }

      // Validate file size
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > maxSizeMB) {
        console.error('File too large:', `${fileSizeMB.toFixed(2)}MB`);
        toast({
          title: "File too large",
          description: `Please upload an image smaller than ${maxSizeMB}MB (current size: ${fileSizeMB.toFixed(2)}MB)`,
          variant: "destructive",
        });
        return null;
      }

      // Generate a unique key for the image
      const key = generateS3Key(userId, type);
      console.log('Generated S3 key:', key);

      // Upload to S3
      const url = await uploadToS3(file, key);
      console.log('Upload successful:', url);

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });

      return url;
    } catch (error) {
      console.error('Error in useImageUpload:', error);
      
      // Handle specific error messages from uploadToS3
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload image';
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadImage,
    uploading,
    isConfigValid,
  };
} 