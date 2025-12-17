import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated, Dimensions, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import SettingsModal from './SettingsModal';

const { width, height } = Dimensions.get('window');

/**
 * A centralized Navigation Menu that handles app-wide routing and modals.
 * @param {object} props
 * @param {function} props.onClose - Callback to close the menu.
 * @param {string[]} props.activeItems - Array of IDs to display (home, profile, sandbox, settings, version, auth).
 */
const HamburgerMenu = ({ onClose, activeItems = ['home', 'profile', 'sandbox', 'settings', 'version', 'auth'] }) => {
    const router = useRouter();
    const [isSettingsVisible, setIsSettingsVisible] = useState(false);
    const slideAnim = React.useRef(new Animated.Value(width)).current;

    React.useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: width * 0.3, 
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, []);

    const handleCloseMenu = () => {
        Animated.timing(slideAnim, {
            toValue: width,
            duration: 250,
            useNativeDriver: true,
        }).start(() => onClose());
    };

    // Centralized definitions for menu behaviors
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
            handleCloseMenu();
        } else if (item.action) {
            item.action();
            // We don't necessarily close the menu for modals (like settings) 
            // unless we want the modal to be the only thing visible.
            if (id !== 'settings') handleCloseMenu();
        }
    };

    return (
        <View style={styles.overlay}>
            {/* Backdrop closes the menu */}
            <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={handleCloseMenu} />
            
            <Animated.View style={[styles.menuContainer, { transform: [{ translateX: slideAnim }] }]}>
                <View style={styles.menuHeader}>
                    <Text style={styles.menuTitle}>Navigation</Text>
                    <TouchableOpacity onPress={handleCloseMenu}>
                        <Ionicons name="close" size={28} color="#374151" />
                    </TouchableOpacity>
                </View>

                <View style={styles.menuContent}>
                    {activeItems.map((id) => {
                        const item = MENU_DEFINITIONS[id];
                        if (!item) return null;
                        return (
                            <TouchableOpacity key={id} style={styles.menuItem} onPress={() => handleAction(id)}>
                                <Ionicons name={item.icon} size={22} color="#1D4ED8" style={styles.itemIcon} />
                                <Text style={styles.menuItemText}>{item.title}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </Animated.View>

            {/* Internal Settings Modal handling */}
            {isSettingsVisible && (
                <SettingsModal 
                    onClose={() => setIsSettingsVisible(false)} 
                    onToggleDarkMode={() => console.log("Toggle Dark Mode triggered in Settings")}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: { 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width, 
        height, 
        zIndex: 1000, 
        flexDirection: 'row' 
    },
    backdrop: { 
        flex: 1, 
        backgroundColor: 'rgba(0,0,0,0.4)' 
    },
    menuContainer: { 
        width: width * 0.7, 
        height, 
        backgroundColor: 'white', 
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        shadowColor: '#000',
        shadowOffset: { width: -2, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5
    },
    menuHeader: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        paddingHorizontal: 20, 
        paddingBottom: 20, 
        borderBottomWidth: 1, 
        borderBottomColor: '#F3F4F6' 
    },
    menuTitle: { 
        fontSize: 18, 
        fontWeight: '700',
        color: '#1F2937'
    },
    menuContent: {
        flex: 1,
    },
    menuItem: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingVertical: 18, 
        paddingHorizontal: 20, 
        borderBottomWidth: 0.5, 
        borderBottomColor: '#F3F4F6' 
    },
    itemIcon: { 
        marginRight: 15, 
        width: 25 
    },
    menuItemText: { 
        fontSize: 16, 
        color: '#374151', 
        fontWeight: '500' 
    }
});

export default HamburgerMenu;

