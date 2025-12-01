import React, { createContext, useContext, useState, useEffect } from 'react';

// --- GLOBAL FIREBASE SETUP VARIABLES ---
// These global variables will be populated by the CDN load process inside useFirebaseCdnLoader.
let firebase = null;
let auth = null;
let db = null;

// Global configuration variables passed by the environment
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : null;
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

const AuthContext = createContext();

/**
 * Custom hook to handle loading Firebase SDKs via CDN.
 * This is crucial for environments where standard npm imports fail.
 */
const useFirebaseCdnLoader = () => {
    const [isCdnLoaded, setIsCdnLoaded] = useState(false);

    useEffect(() => {
        if (isCdnLoaded) return;

        const loadScript = (url) => new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = url;
            script.onload = resolve;
            script.onerror = resolve; 
            document.head.appendChild(script);
        });

        // Load Firebase Core, Auth, and Firestore SDKs
        Promise.all([
            loadScript("https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js"),
            loadScript("https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js"),
            loadScript("https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js"),
        ]).then(() => {
            if (window.firebase) {
                firebase = window.firebase;
                const appInstance = firebase.initializeApp(firebaseConfig);
                auth = firebase.getAuth(appInstance);
                db = firebase.getFirestore(appInstance);
                firebase.setLogLevel('debug'); // Enable Firestore logging
                setIsCdnLoaded(true);
            } else {
                console.error("Profile: Firebase SDK failed to load globally.");
            }
        });
    }, [isCdnLoaded]);

    return isCdnLoaded;
};

/**
 * Provider component to manage Firebase Authentication state.
 */
export const AuthProvider = ({ children }) => {
    const isCdnLoaded = useFirebaseCdnLoader();
    const [userId, setUserId] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('Loading Firebase SDKs...');

    // Effect to handle the initial anonymous sign-in process
    useEffect(() => {
        if (isCdnLoaded && auth && !userId) {
            setLoadingMessage('Authenticating...');

            const unsubscribe = auth.onAuthStateChanged(async (user) => {
                if (user) {
                    setUserId(user.uid);
                    setIsAuthReady(true);
                    setLoadingMessage('Connection established. Profile ready.');
                } else {
                    // No user, attempt initial sign-in
                    try {
                        if (initialAuthToken) {
                            await firebase.signInWithCustomToken(auth, initialAuthToken);
                        } else {
                            // Sign in anonymously for Guest profile
                            await firebase.signInAnonymously(auth);
                        }
                    } catch (e) {
                        setLoadingMessage(`Authentication Failed: ${e.message}`);
                        console.error("Fatal Auth Error:", e);
                    }
                }
            });
            return () => {
                if (unsubscribe) unsubscribe();
            };
        }
    }, [isCdnLoaded]);


    const value = {
        userId,
        dbInstance: db,
        isAuthReady,
        loadingMessage,
        appId,
        firebase, // Export firebase global for doc, setDoc utilities in components
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook for consuming authentication state and utility functions.
 */
export const useAuth = () => {
    return useContext(AuthContext);
};

