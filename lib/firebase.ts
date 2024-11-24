import { initializeApp, getApps } from 'firebase/app';
import { 
  getFirestore, 
  initializeFirestore, 
  persistentLocalCache, 
  persistentSingleTabManager
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

// Initialize Firestore with settings
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentSingleTabManager({
      forceOwnership: true
    })
  })
});

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