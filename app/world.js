import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; 

// Define colors (Keep these standard as they are stable)
const primaryColor = '#1D4ED8'; 
const textColor = '#1F2937';

// --- Settings Menu Dropdown Component (From index.js) ---
const SettingsMenu = ({ onClose }) => {
    const router = useRouter();

    // Placeholder handlers (using alert, which we know works)
    const handleVersionInfo = () => { alert("Displaying Version Information..."); };
    const handleAuth = () => { alert("Navigating to Authentication Screen..."); };

    return (
        <View style={styles.dropdownContainer}>
            
            {/* 1. Home Option: CRITICAL for navigating back */}
            <TouchableOpacity 
                style={styles.menuItem} 
                onPress={() => { router.replace('/'); onClose(); }}
            >
                <Text style={styles.menuItemText}>Home</Text>
            </TouchableOpacity>

            {/* 2. Version */}
            <TouchableOpacity 
                style={styles.menuItem} 
                onPress={() => { handleVersionInfo(); onClose(); }}
            >
                <Text style={styles.menuItemText}>Version</Text>
            </TouchableOpacity>

            {/* 3. Log In / Sign Up */}
            <TouchableOpacity 
                style={styles.menuItem} 
                onPress={() => { handleAuth(); onClose(); }}
            >
                <Text style={styles.menuItemText}>Log In / Sign Up</Text>
            </TouchableOpacity>
        </View>
    );
};

// --- Main World Component ---
const WorldScreen = () => {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    return (
        <View style={styles.container}>
            
            {/* Header Bar with Hamburger Icon */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Simple World Loaded</Text>
                <TouchableOpacity onPress={() => setIsSettingsOpen(!isSettingsOpen)}>
                    <Ionicons name="menu" size={32} color={primaryColor} />
                </TouchableOpacity>
            </View>

            {/* Simple Content to prove the screen loaded */}
            <View style={styles.mainContent}>
                <Text style={styles.confirmationText}>
                    SUCCESS: The /world route is now stable!
                </Text>
            </View>

            {/* Settings Dropdown Overlay */}
            {isSettingsOpen && <SettingsMenu onClose={() => setIsSettingsOpen(false)} />}
        </View>
    );
};

// **CRITICAL:** Default export is required by Expo Router
export default WorldScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB', 
        paddingTop: Platform.OS === 'android' ? 30 : 50,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: textColor,
    },
    mainContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    confirmationText: {
        fontSize: 18,
        fontWeight: '500',
        color: '#10B981', // Green for success
    },
    // --- Dropdown Styles ---
    dropdownContainer: {
        position: 'absolute',
        top: Platform.OS === 'android' ? 70 : 100, 
        right: 20,
        width: 200,
        backgroundColor: 'white',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
        zIndex: 100,
    },
    menuItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    menuItemText: {
        fontSize: 16,
        color: textColor,
        fontWeight: '500',
    }
});
