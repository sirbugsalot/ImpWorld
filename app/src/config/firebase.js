import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithCustomToken, 
  signInAnonymously, 
  initializeAuth, 
  getReactNativePersistence 
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// 1. Setup Config from environment globals
const firebaseConfig = JSON.parse(__firebase_config);

// 2. Initialize App
const app = initializeApp(firebaseConfig);

// 3. Initialize Auth with Persistence (Ensures users stay logged in on mobile)
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

/**
 * MANDATORY RULE 3: Auth Before Queries
 * This function ensures we are authenticated before the app attempts 
 * to read/write to Firestore.
 */
export const initFirebaseStack = async () => {
  try {
    if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
      await signInWithCustomToken(auth, __initial_auth_token);
    } else {
      await signInAnonymously(auth);
    }
    console.log("Firebase Auth Initialized");
  } catch (error) {
    console.error("Firebase Auth Error:", error);
  }
};

export { auth, db, appId };
