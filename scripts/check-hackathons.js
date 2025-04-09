// Script to check hackathons in Firebase
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

// Your Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkHackathons() {
  try {
    const hackathonsRef = collection(db, 'hackathons');
    const snapshot = await getDocs(hackathonsRef);
    
    if (snapshot.empty) {
      console.log('No hackathons found in the database.');
      return;
    }
    
    console.log(`Found ${snapshot.size} hackathon(s):`);
    snapshot.forEach(doc => {
      const data = doc.data();
      console.log(`ID: ${doc.id}`);
      console.log(`Title: ${data.title}`);
      console.log(`Start Date: ${data.startDate?.toDate?.() || 'Invalid date'}`);
      console.log(`End Date: ${data.endDate?.toDate?.() || 'Invalid date'}`);
      console.log('-------------------');
    });
  } catch (error) {
    console.error('Error checking hackathons:', error);
  }
}

checkHackathons();
