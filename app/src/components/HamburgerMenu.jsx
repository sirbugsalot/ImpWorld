import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import SettingsModal from './SettingsModal';

// NEW: Firebase imports
import { auth } from '../config/firebase';
import { signInAnonymously } from 'firebase/auth';

const { width, height } = Dimensions.get('window');

/**
 * Updated HamburgerMenu with Firebase Guest Login Logic
 */
const HamburgerMenu = ({ onClose, activeItems = ['home', 'profile', 'sandbox', 'settings', 'version', 'auth'] }) => {
    const router = useRouter();
    const [isSettingsVisible, setIsSettingsVisible] = useState(false);
    
    // NEW: Local state for auth feedback
    const [authLoading, setAuthLoading] = useState(false);
    const [authStatus, setAuthStatus] = useState(null); // 'success', 'error', or null

    // 1. Logic to handle guest login
    const handleGuestLogin = async () => {
        if (!auth) {
            setAuthStatus('error');
            console.error("Firebase Auth not initialized. Check your config.");
            return;
        }

        setAuthLoading(true);
        setAuthStatus(null);

        try {
            const userCredential = await signInAnonymously(auth);
            console.log("Guest User Signed In:", userCredential.user.uid);
            setAuthStatus('success');
            
            // Close menu after a brief success display
            setTimeout(() => {
                onClose();
            }, 1000);
        } catch (error) {
            console.error("Auth Error:", error.code, error.message);
            setAuthStatus('error');
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
            title: authStatus === 'success' ? 'Connected!' : 'Log In (Guest)', 
            icon: authStatus === 'success' ? 'checkmark-circle' : 'log-in-outline', 
            action: handleGuestLogin 
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
            // Don't close if it's settings (modal) or auth (needs to show loading/status)
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
                                <ActivityIndicator size="small" color="#1D4ED8" />
                            ) : (
                                <Ionicons 
                                    name={item.icon} 
                                    size={20} 
                                    color={isAuthItem && authStatus === 'error' ? '#EF4444' : "#1D4ED8"} 
                                />
                            )}
                            
                            <Text style={[
                                styles.menuItemText,
                                isAuthItem && authStatus === 'error' && { color: '#EF4444' },
                                isAuthItem && authStatus === 'success' && { color: '#10B981' }
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

