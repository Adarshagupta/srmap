// This file is kept for future server-side Firebase functionality
// Currently using client-side Firebase only for static exports

import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const firebaseAdminConfig = {
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
};

const app = getApps().length === 0 ? initializeApp(firebaseAdminConfig) : getApps()[0];
export const adminDb = getFirestore(app);

export const isServerSide = false;

export function getServerSideAuth() {
  throw new Error('Server-side Firebase functionality is not available in static exports');
} 