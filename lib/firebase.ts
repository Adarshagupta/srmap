import { initializeApp, getApps } from 'firebase/app';
import { 
  getFirestore, 
  enableIndexedDbPersistence,
  getDoc,
  doc,
  collection,
  getDocs,
  query,
  where,
  onSnapshot,
  initializeFirestore,
  CACHE_SIZE_UNLIMITED
} from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';

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
let app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firestore with settings for better offline support
const db = initializeFirestore(app, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED
});

// Enable offline persistence
try {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled in one tab at a time.
      console.warn('Multiple tabs open, persistence disabled');
    } else if (err.code === 'unimplemented') {
      // The current browser doesn't support persistence
      console.warn('Persistence not supported by browser');
    }
  });
} catch (err) {
  console.warn('Error enabling persistence:', err);
}

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Configure Google Auth Provider
googleProvider.setCustomParameters({
  hd: 'srmap.edu.in',
  prompt: 'select_account'
});

// Initialize Analytics only in production
const analytics = process.env.NODE_ENV === 'production' 
  ? isSupported().then(yes => yes ? getAnalytics(app) : null)
  : null;

export { app, db, auth, googleProvider, analytics };