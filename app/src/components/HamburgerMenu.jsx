import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import SettingsModal from './SettingsModal';

// Firebase imports
import { auth } from '../config/firebase';
import { signInAnonymously, onAuthStateChanged, signOut } from 'firebase/auth';

const { width, height } = Dimensions.get('window');

/**
 * HamburgerMenu with Real-Time Auth State Tracking
 */
const HamburgerMenu = ({ onClose, activeItems = ['home', 'profile', 'sandbox', 'settings', 'version', 'auth'] }) => {
    const router = useRouter();
    const [isSettingsVisible, setIsSettingsVisible] = useState(false);
    
    // Auth State
    const [user, setUser] = useState(auth?.currentUser || null);
    const [authLoading, setAuthLoading] = useState(false);

    // Subscribe to auth state changes on mount
    useEffect(() => {
        if (!auth) return;
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const handleAuthAction = async () => {
        if (!auth) return;

        setAuthLoading(true);
        try {
            if (user) {
                // If already logged in, the action becomes 'Sign Out'
                await signOut(auth);
                console.log("User signed out");
            } else {
                // If not logged in, perform Guest Login
                const userCredential = await signInAnonymously(auth);
                console.log("Guest User Signed In:", userCredential.user.uid);
                // We don't need to manually set user; onAuthStateChanged handles it
            }
        } catch (error) {
            console.error("Auth Error:", error.message);
        } finally {
            setAuthLoading(false);
        }
    };

    const MENU_DEFINITIONS = {
        home: { title: 'Home', icon: 'home-outline', path: '/' },
        profile: { title: 'Profile', icon: 'person-outline', path: '/userProfile/profile' },
        sandbox: { title: 'Sandbox', icon: 'flask-outline', path: '../sandbox' },
        settings: { 
            title: 'Settings', 
            icon: 'settings-outline', 
            action: () => setIsSettingsVisible(true) 
        },
        version: { title: 'Version', icon: 'information-circle-outline', action: () => console.log("v1.0.5-Alpha") },
        auth: { 
            // DYNAMIC TITLE: Shows 'Guest' if logged in anonymously, else 'Log In'
            title: user ? (user.isAnonymous ? 'Guest (Sign Out)' : 'User (Sign Out)') : 'Log In / Sign Up', 
            icon: user ? 'log-out-outline' : 'log-in-outline', 
            action: handleAuthAction 
        },
    };

    const handleAction = (id) => {
        const item = MENU_DEFINITIONS[id];
        if (!item) return;

        if (item.path) {
            router.push(item.path);
            onClose();
        } else if (item.action) {
            item.action();
            // Don't close if it's settings (modal) or auth (needs to show loading)
            if (id !== 'settings' && id !== 'auth') onClose();
        }
    };

    return (
        <View style={styles.fullScreenOverlay}>
            <TouchableOpacity 
                style={styles.backdrop} 
                activeOpacity={1} 
                onPress={onClose} 
            />
            
            <View style={styles.dropdownCard}>
                <View style={styles.arrowUp} />
                
                {activeItems.map((id, index) => {
                    const item = MENU_DEFINITIONS[id];
                    if (!item) return null;
                    
                    const isAuthItem = id === 'auth';
                    
                    return (
                        <TouchableOpacity 
                            key={id} 
                            disabled={isAuthItem && authLoading}
                            style={[
                                styles.menuItem, 
                                index === activeItems.length - 1 && styles.lastItem
                            ]} 
                            onPress={() => handleAction(id)}
                        >
                            {isAuthItem && authLoading ? (
                                <ActivityIndicator size="small" color="#1D4ED8" style={{ width: 20 }} />
                            ) : (
                                <Ionicons 
                                    name={item.icon} 
                                    size={20} 
                                    color={isAuthItem && user ? '#EF4444' : "#1D4ED8"} 
                                />
                            )}
                            
                            <Text style={[
                                styles.menuItemText,
                                isAuthItem && user && { color: '#EF4444' } // Red text for Sign Out
                            ]}>
                                {item.title}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {isSettingsVisible && (
                <SettingsModal 
                    onClose={() => {
                        setIsSettingsVisible(false);
                        onClose();
                    }} 
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    fullScreenOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: width,
        height: height,
        zIndex: 5000,
    },
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    dropdownCard: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 95 : 75,
        right: 20,
        width: 220,
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        paddingVertical: 8,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.15,
                shadowRadius: 15,
            },
            android: {
                elevation: 10,
            },
        }),
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    arrowUp: {
        position: 'absolute',
        top: -10,
        right: 15,
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderBottomWidth: 10,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: '#FFFFFF',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    lastItem: {
        borderBottomWidth: 0,
    },
    menuItemText: {
        marginLeft: 12,
        fontSize: 15,
        fontWeight: '600',
        color: '#374151',
    },
});

export default HamburgerMenu;

                                     
