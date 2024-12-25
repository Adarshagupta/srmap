import { NextResponse } from 'next/server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export async function POST(request: Request) {
  try {
    const { token, title, body } = await request.json();

    // Send message through FCM
    await getMessaging().send({
      token,
      notification: {
        title,
        body,
      },
      webpush: {
        notification: {
          icon: '/icon.png', // Add your notification icon
          badge: '/icon.png',
          vibrate: [100, 50, 100],
          requireInteraction: true,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending push notification:', error);
    return NextResponse.json(
      { error: 'Failed to send push notification' },
      { status: 500 }
    );
  }
} 