import { initializeApp, getApps } from 'firebase/app';
import { 
  getFirestore, 
  Firestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  memoryLocalCache,
  type FirestoreSettings
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

// Initialize Firestore with appropriate cache settings
let db: Firestore;

// Check if localStorage is available (indicates browser environment with IndexedDB support)
const hasLocalStorage = typeof window !== 'undefined' && window.localStorage !== undefined;

if (hasLocalStorage) {
  try {
    // Try to initialize with persistent cache
    db = initializeFirestore(app, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager()
      })
    } as FirestoreSettings);
  } catch (err) {
    console.warn('Persistent cache not supported, falling back to memory cache:', err);
    db = initializeFirestore(app, {
      localCache: memoryLocalCache()
    } as FirestoreSettings);
  }
} else {
  // Use memory cache for environments without localStorage
  db = initializeFirestore(app, {
    localCache: memoryLocalCache()
  } as FirestoreSettings);
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