import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand, ListBucketsCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

// Initialize S3 client with explicit configuration
const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION!,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
  },
  maxAttempts: 3, // Retry failed requests up to 3 times
});

const BUCKET_NAME = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!;
const BUCKET_REGION = process.env.NEXT_PUBLIC_AWS_REGION!;

// Debug configuration with more detail
console.log('Checking S3 Environment Variables:', {
  NEXT_PUBLIC_AWS_REGION: process.env.NEXT_PUBLIC_AWS_REGION ? 'Set' : 'Missing',
  NEXT_PUBLIC_AWS_BUCKET_NAME: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME ? 'Set' : 'Missing',
  NEXT_PUBLIC_AWS_ACCESS_KEY_ID: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID ? 'Set' : 'Missing',
  NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY ? 'Set' : 'Missing'
});

// Validate environment variables with specific messages
const missingVars = [];
if (!process.env.NEXT_PUBLIC_AWS_REGION) missingVars.push('NEXT_PUBLIC_AWS_REGION');
if (!process.env.NEXT_PUBLIC_AWS_BUCKET_NAME) missingVars.push('NEXT_PUBLIC_AWS_BUCKET_NAME');
if (!process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID) missingVars.push('NEXT_PUBLIC_AWS_ACCESS_KEY_ID');
if (!process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY) missingVars.push('NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY');

if (missingVars.length > 0) {
  const errorMessage = `Missing required S3 environment variables: ${missingVars.join(', ')}`;
  console.error(errorMessage);
  throw new Error(errorMessage);
}

// Debug configuration
console.log('S3 Configuration:', {
  region: BUCKET_REGION,
  bucketName: BUCKET_NAME,
  hasAccessKey: !!process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
  hasSecretKey: !!process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
});

// Validate environment variables
if (!BUCKET_NAME || !BUCKET_REGION) {
  throw new Error('Missing required S3 configuration. Please check your environment variables.');
}

export async function validateS3Configuration(): Promise<boolean> {
  try {
    console.log('Validating S3 configuration...');
    
    // Check if all required environment variables are set
    const requiredVars = {
      region: process.env.NEXT_PUBLIC_AWS_REGION,
      bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
      accessKey: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
      secretKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY
    };

    const missingVars = Object.entries(requiredVars)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingVars.length > 0) {
      console.error('Missing required environment variables:', missingVars);
      return false;
    }

    // Instead of making a test request, just verify the client is configured
    if (!s3Client) {
      console.error('S3 client not initialized');
      return false;
    }

    // Check if the bucket name is valid
    if (!BUCKET_NAME.match(/^[a-z0-9][a-z0-9.-]*[a-z0-9]$/)) {
      console.error('Invalid bucket name format:', BUCKET_NAME);
      return false;
    }

    console.log('S3 configuration appears valid');
    return true;
  } catch (error) {
    console.error('Error in validateS3Configuration:', error);
    return false;
  }
}

export function generateS3Key(userId: string, type: 'profile' | 'post'): string {
  const uuid = uuidv4();
  const timestamp = Date.now();
  return `${type}/${userId}/${timestamp}-${uuid}`;
}

export async function uploadToS3(file: File, key: string): Promise<string> {
  console.log('Starting S3 upload:', {
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
    key,
    bucket: BUCKET_NAME,
    region: BUCKET_REGION
  });

  try {
    // Validate file
    if (!file.type.startsWith('image/')) {
      throw new Error('Invalid file type. Only images are allowed.');
    }

    // Convert file to buffer
    console.log('Converting file to buffer...');
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Prepare upload command
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type,
      Metadata: {
        'original-filename': file.name,
        'upload-date': new Date().toISOString(),
        'content-type': file.type,
      },
    });

    // Upload to S3
    console.log('Uploading to S3...');
    const response = await s3Client.send(command);
    console.log('Upload successful:', response);

    // Generate and return public URL
    const publicUrl = `https://${BUCKET_NAME}.s3.${BUCKET_REGION}.amazonaws.com/${key}`;
    console.log('Generated public URL:', publicUrl);
    
    return publicUrl;
  } catch (error) {
    console.error('Error uploading to S3:', {
      error,
      fileName: file.name,
      bucket: BUCKET_NAME,
      key,
    });

    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('NetworkingError')) {
        throw new Error('Network error while uploading. Please check your connection and try again.');
      } else if (error.message.includes('AccessDenied')) {
        throw new Error('Access denied. Please check your S3 permissions.');
      } else if (error.message.includes('NoSuchBucket')) {
        throw new Error('S3 bucket not found. Please check your configuration.');
      } else if (error.message.includes('AccessControlListNotSupported')) {
        throw new Error('Bucket configuration error. Please contact support.');
      }
    }
    
    throw new Error('Failed to upload image. Please try again.');
  }
}

export async function deleteFromS3(key: string): Promise<void> {
  console.log('Deleting from S3:', { key, bucket: BUCKET_NAME });

  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
    console.log('Delete successful');
  } catch (error) {
    console.error('Error deleting from S3:', { error, key, bucket: BUCKET_NAME });
    throw new Error('Failed to delete image');
  }
}

export async function getSignedS3Url(key: string): Promise<string> {
  console.log('Generating signed URL:', { key, bucket: BUCKET_NAME });

  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    // URL expires in 1 hour
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    console.log('Generated signed URL successfully');
    return signedUrl;
  } catch (error) {
    console.error('Error getting signed URL:', { error, key, bucket: BUCKET_NAME });
    throw new Error('Failed to get image URL');
  }
}

export function getPublicUrl(key: string): string {
  return `https://${BUCKET_NAME}.s3.${BUCKET_REGION}.amazonaws.com/${key}`;
} 