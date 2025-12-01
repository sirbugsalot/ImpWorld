// --- Firebase Authentication Utility ---

// Load Firebase SDKs via CDN - required imports for pure JS module
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : null;
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// Global Firebase instance references
let firebaseApp = null;
let authInstance = null;
let dbInstance = null;
let isInitializing = false;

/**
 * Initializes Firebase, authenticates the user (anonymously or via token),
 * and waits until the auth state is confirmed.
 * @returns {Promise<{auth: firebase.auth.Auth, db: firebase.firestore.Firestore, userId: string}>}
 */
export async function initializeAndAuthenticate() {
    if (dbInstance && authInstance) {
        // Already initialized and authenticated
        return { auth: authInstance, db: dbInstance, userId: authInstance.currentUser.uid };
    }
    
    if (isInitializing) {
        // Prevent concurrent initialization attempts
        return new Promise(resolve => {
            const check = setInterval(() => {
                if (dbInstance && authInstance) {
                    clearInterval(check);
                    resolve({ auth: authInstance, db: dbInstance, userId: authInstance.currentUser.uid });
                }
            }, 100);
        });
    }

    isInitializing = true;
    
    if (!firebaseConfig) {
        console.error("FIREBASE_AUTH_UTIL: Firebase config not found.");
        throw new Error("Firebase configuration is missing.");
    }

    try {
        firebaseApp = initializeApp(firebaseConfig);
        authInstance = getAuth(firebaseApp);
        dbInstance = getFirestore(firebaseApp);
        
        // Use a promise to wait for the initial authentication state
        const user = await new Promise(resolve => {
            const unsubscribe = onAuthStateChanged(authInstance, (user) => {
                // If a user is already signed in (e.g., retained session), resolve immediately
                if (user) {
                    unsubscribe();
                    resolve(user);
                }
            });

            // If no user is immediately found, attempt sign-in
            (async () => {
                try {
                    let userCredential;
                    if (initialAuthToken) {
                        userCredential = await signInWithCustomToken(authInstance, initialAuthToken);
                    } else {
                        // Default to Anonymous sign-in for the "Guest Account" experience
                        userCredential = await signInAnonymously(authInstance);
                    }
                    // Wait for onAuthStateChanged to pick this up, but ensure we resolve if successful
                    if (userCredential && userCredential.user) {
                        unsubscribe();
                        resolve(userCredential.user);
                    }
                } catch (e) {
                    console.error("FIREBASE_AUTH_UTIL: Initial sign-in error.", e);
                    // Resolve with null if sign-in fails, allowing the caller to handle the error
                    resolve(null); 
                }
            })();
        });
        
        isInitializing = false;

        if (!user) {
            throw new Error("Failed to sign in and retrieve user ID.");
        }

        return { auth: authInstance, db: dbInstance, userId: user.uid };

    } catch (e) {
        isInitializing = false;
        console.error("FIREBASE_AUTH_UTIL: Initialization failed:", e);
        throw e;
    }
}

// Export the core application parts for use by other modules
export const getAuthInstance = () => authInstance;
export const getDbInstance = () => dbInstance;
