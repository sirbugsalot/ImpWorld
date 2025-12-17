import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import SettingsModal from './SettingsModal';

const { width, height } = Dimensions.get('window');

/**
 * A Dropdown-style Navigation Menu.
 * Anchors to the top-right and provides quick access to app features.
 */
const HamburgerMenu = ({ onClose, activeItems = ['home', 'profile', 'sandbox', 'settings', 'version', 'auth'] }) => {
    const router = useRouter();
    const [isSettingsVisible, setIsSettingsVisible] = useState(false);

    // Centralized definitions for menu items
    const MENU_DEFINITIONS = {
        home: { title: 'Home', icon: 'home-outline', path: '/' },
        profile: { title: 'Profile', icon: 'person-outline', path: '/userProfile/profile' },
        sandbox: { title: 'Sandbox', icon: 'flask-outline', action: () => console.log("Sandbox accessed") },
        settings: { 
            title: 'Settings', 
            icon: 'settings-outline', 
            action: () => setIsSettingsVisible(true) 
        },
        version: { title: 'Version', icon: 'information-circle-outline', action: () => console.log("v1.0.5-Alpha") },
        auth: { title: 'Log In / Sign Up', icon: 'log-in-outline', action: () => console.log("Auth trigger") },
    };

    const handleAction = (id) => {
        const item = MENU_DEFINITIONS[id];
        if (!item) return;

        if (item.path) {
            router.push(item.path);
            onClose();
        } else if (item.action) {
            item.action();
            // Don't close the overlay if settings is open (modal needs the background)
            if (id !== 'settings') onClose();
        }
    };

    return (
        <View style={styles.fullScreenOverlay}>
            {/* Tapping the transparent background closes the dropdown */}
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
                    
                    return (
                        <TouchableOpacity 
                            key={id} 
                            style={[
                                styles.menuItem, 
                                index === activeItems.length - 1 && styles.lastItem
                            ]} 
                            onPress={() => handleAction(id)}
                        >
                            <Ionicons name={item.icon} size={20} color="#1D4ED8" />
                            <Text style={styles.menuItemText}>{item.title}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* Centralized Settings Modal */}
            {isSettingsVisible && (
                <SettingsModal 
                    onClose={() => {
                        setIsSettingsVisible(false);
                        onClose(); // Close both when done
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
        backgroundColor: 'rgba(0,0,0,0.1)', // Very light dimming for dropdowns
    },
    dropdownCard: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 95 : 75, // Anchored below header
        right: 20,
        width: 220,
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        paddingVertical: 8,
        // Shadow/Elevation for "Floating" effect
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

