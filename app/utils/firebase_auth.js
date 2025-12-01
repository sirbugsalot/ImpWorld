import React, { createContext, useContext, useState, useEffect } from 'react';

// --- STANDARD ES MODULE FIREBASE IMPORTS ---
// This is the fix for the 'Unable to resolve module' error in Expo/Metro.
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, setLogLevel } from 'firebase/firestore'; 

const AuthContext = createContext();

// Global configuration variables passed by the environment
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// --- INITIALIZE FIREBASE SERVICES (Runs once) ---
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
setLogLevel('debug'); // Enable Firestore logging

/**
 * Provider component to manage Firebase Authentication state.
 */
export const AuthProvider = ({ children }) => {
    const [userId, setUserId] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('Initializing Firebase...');

    // Effect to handle the initial anonymous sign-in process
    useEffect(() => {
        // Set up the listener immediately
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUserId(user.uid);
                setIsAuthReady(true);
                setLoadingMessage('Connection established. Profile ready.');
            } else {
                // If no user is found (first load), attempt sign-in
                try {
                    if (initialAuthToken) {
                        await signInWithCustomToken(auth, initialAuthToken);
                    } else {
                        // Sign in anonymously for Guest profile
                        await signInAnonymously(auth);
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
    }, []);


    const value = {
        userId,
        dbInstance: db,
        isAuthReady,
        loadingMessage,
        appId,
        // Pass the required utility functions for components to use
        fsUtils: { doc, getDoc, setDoc, auth }, 
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook for consuming authentication state and utility functions.
 */
export const useAuth = () => {
    return useContext(AuthContext);
};

