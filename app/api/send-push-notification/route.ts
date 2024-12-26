import { NextResponse } from 'next/server';
import admin from 'firebase-admin';

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export async function POST(request: Request) {
  try {
    const { token, title, body, data } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'FCM token is required' },
        { status: 400 }
      );
    }

    const message = {
      notification: {
        title,
        body,
      },
      data: data || {},
      token,
    };

    const response = await admin.messaging().send(message);
    
    return NextResponse.json({ success: true, messageId: response });
  } catch (error) {
    console.error('Error sending push notification:', error);
    return NextResponse.json(
      { error: 'Failed to send push notification' },
      { status: 500 }
    );
  }
} 