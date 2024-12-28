import { NextResponse } from 'next/server';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION!,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fileUrl = searchParams.get('url');

    if (!fileUrl) {
      return new NextResponse('Missing file URL', { status: 400 });
    }

    // Extract the key from the S3 URL
    const s3Url = new URL(fileUrl);
    const key = decodeURIComponent(s3Url.pathname.substring(1));
    const bucketName = s3Url.hostname.split('.')[0];

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    const response = await s3Client.send(command);
    const stream = response.Body as ReadableStream;

    // Set appropriate headers
    const headers = new Headers();
    headers.set('Content-Type', response.ContentType || 'application/pdf');
    headers.set('Content-Length', response.ContentLength?.toString() || '');
    headers.set('Content-Disposition', 'inline');
    headers.set('Cache-Control', 'public, max-age=3600');

    return new NextResponse(stream, {
      headers,
      status: 200,
    });
  } catch (error) {
    console.error('Error fetching PDF:', error);
    return new NextResponse('Failed to fetch PDF', { status: 500 });
  }
} 