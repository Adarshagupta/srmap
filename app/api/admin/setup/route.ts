import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  try {
    const { uid, email } = await request.json();

    if (!uid || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Set up the user as admin in Firestore using Admin SDK
    await adminDb.collection('users').doc(uid).set({
      email,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, { merge: true }); // Use merge to preserve existing data

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error setting up admin:', error);
    return NextResponse.json(
      { error: 'Failed to set up admin user' },
      { status: 500 }
    );
  }
} 