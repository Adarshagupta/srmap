// Script to add a sample hackathon to Firebase
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, Timestamp } = require('firebase/firestore');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBxGPWeCoQzbkq1DQNGHr1MeTLbIrbnYmE",
  authDomain: "srmap-93b6e.firebaseapp.com",
  projectId: "srmap-93b6e",
  storageBucket: "srmap-93b6e.appspot.com",
  messagingSenderId: "37171930820",
  appId: "1:37171930820:web:8daa234e5da6077418cb91",
  measurementId: "G-QZQM5JPGGF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function addSampleHackathon() {
  try {
    // Create a sample hackathon with dates in the future
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 7); // Start 7 days from now
    
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 3); // End 3 days after start date
    
    const hackathonData = {
      title: "SRM AP Coding Challenge 2023",
      description: "Join us for an exciting 3-day hackathon where you can showcase your coding skills, collaborate with peers, and win amazing prizes. This event is open to all SRM AP students.",
      startDate: Timestamp.fromDate(startDate),
      endDate: Timestamp.fromDate(endDate),
      location: "SRM University AP, Andhra Pradesh",
      prizePool: "₹50,000",
      themes: "AI/ML, Web Development, Mobile Apps, Blockchain",
      organizers: "SRM AP Tech Club",
      registrationLink: "https://forms.gle/example",
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    const hackathonsRef = collection(db, 'hackathons');
    const docRef = await addDoc(hackathonsRef, hackathonData);
    
    console.log(`Sample hackathon added with ID: ${docRef.id}`);
    console.log(`Start Date: ${startDate.toLocaleString()}`);
    console.log(`End Date: ${endDate.toLocaleString()}`);
  } catch (error) {
    console.error('Error adding sample hackathon:', error);
  }
}

addSampleHackathon();
