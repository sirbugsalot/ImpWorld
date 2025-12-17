import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; 

// Import modular components from their new relative locations
import AvatarCustomizer from './avatar'; 
import HamburgerMenu from '../src/components/HamburgerMenu'; 

// Import constants for initial state and colors
import { 
    INITIAL_DARK_MODE, 
    PRIMARY_COLOR, 
    LIGHT_TEXT_COLOR, 
    DARK_TEXT_COLOR, 
    LIGHT_BG_COLOR, 
    DARK_BG_COLOR, 
    DARK_HEADER_BG 
} from '../src/utils/constants'; 

const DEFAULT_AVATAR_DATA = { 
    type: 'egg', 
    color: PRIMARY_COLOR, 
    shape: { hy: 60, wx: 40, wy: 35 } 
};

const SCREENS = {
    PROFILE_VIEW: 'profile',
    CUSTOMIZER: 'customizer'
};

const ProfileView = ({ avatarData, onNavigateToCustomizer, onGoBack, onToggleMenu, theme }) => {
    const getSizeDescription = () => {
        const { hy, wx } = avatarData.shape; 
        if (hy < 40 && wx < 35) return "Small and Compact";
        if (hy > 70 && wx > 45) return "Large and Robust";
        return "Balanced Egg";
    };

    const { textColor, bgColor, headerBg, dividerColor, cardBg, primaryColor } = theme;

    return (
        <View style={[styles.container, { backgroundColor: bgColor }]}>
            <View style={[styles.header, { backgroundColor: headerBg, borderBottomColor: dividerColor }]}>
                <TouchableOpacity onPress={onGoBack}>
                    <Ionicons name="chevron-back" size={32} color={primaryColor} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: textColor }]}>Player Profile</Text>
                <TouchableOpacity onPress={onToggleMenu}>
                    <Ionicons name="menu" size={32} color={primaryColor} />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <Text style={[styles.label, { color: textColor }]}>Your Avatar</Text>
                <Text style={[styles.subLabel, { color: textColor }]}>Type: {avatarData.type.toUpperCase()}</Text>

                <View 
                    style={[
                        styles.avatarBlob, 
                        { 
                            backgroundColor: avatarData.color,
                            width: avatarData.shape.wx * 3, 
                            height: avatarData.shape.hy * 1.5, 
                            borderRadius: 100, 
                            borderColor: cardBg,
                        }
                    ]} 
                />
                
                <View style={[styles.statsContainer, { backgroundColor: cardBg, borderColor: dividerColor }]}>
                    <Text style={[styles.statText, { color: textColor }]}>Color: {avatarData.color}</Text>
                    <Text style={[styles.statText, { color: textColor }]}>Shape: {getSizeDescription()}</Text>
                    <Text style={[styles.statText, { color: textColor }]}>Height Y (hy): {avatarData.shape.hy.toFixed(1)}</Text>
                    <Text style={[styles.statText, { color: textColor }]}>Width X (wx): {avatarData.shape.wx.toFixed(1)}</Text>
                    <Text style={[styles.statText, { color: textColor }]}>Waist Y (wy): {avatarData.shape.wy.toFixed(1)}</Text>
                </View>

                <TouchableOpacity
                    style={[styles.customizeButton, { backgroundColor: primaryColor }]}
                    onPress={onNavigateToCustomizer}
                >
                    <Ionicons name="settings-outline" size={20} color="white" />
                    <Text style={styles.customizeButtonText}>Customize Avatar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const ProfileScreen = () => {
    const router = useRouter();
    const [currentScreen, setCurrentScreen] = useState(SCREENS.PROFILE_VIEW);
    const [avatarData, setAvatarData] = useState(DEFAULT_AVATAR_DATA);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    const isDarkMode = INITIAL_DARK_MODE; 
    
    const primaryColor = PRIMARY_COLOR;
    const theme = {
        primaryColor,
        textColor: isDarkMode ? DARK_TEXT_COLOR : LIGHT_TEXT_COLOR,
        bgColor: isDarkMode ? DARK_BG_COLOR : LIGHT_BG_COLOR,
        headerBg: isDarkMode ? DARK_HEADER_BG : '#FFFFFF',
        cardBg: isDarkMode ? DARK_HEADER_BG : '#FFFFFF', 
        dividerColor: isDarkMode ? '#4B5563' : '#E5E7EB',
    };

    const handleCustomizationSave = (newAvatarData) => {
        setAvatarData({
            ...newAvatarData,
            shape: {
                hy: Number(newAvatarData.shape.hy),
                wx: Number(newAvatarData.shape.wx),
                wy: Number(newAvatarData.shape.wy),
            }
        });
        setCurrentScreen(SCREENS.PROFILE_VIEW);
    };

    // The list of items to show in the hamburger menu
    const menuKeys = ['home', 'profile', 'sandbox', 'settings', 'version', 'auth'];

    if (currentScreen === SCREENS.CUSTOMIZER) {
        return (
            <AvatarCustomizer
                initialCustomization={avatarData}
                onSave={handleCustomizationSave}
                onCancel={() => setCurrentScreen(SCREENS.PROFILE_VIEW)}
            />
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <ProfileView
                avatarData={avatarData}
                onNavigateToCustomizer={() => setCurrentScreen(SCREENS.CUSTOMIZER)}
                onGoBack={() => router.back()}
                onToggleMenu={() => setIsMenuOpen(prev => !prev)}
                theme={theme}
            />

            {isMenuOpen && (
                <HamburgerMenu 
                    onClose={() => setIsMenuOpen(false)} 
                    activeItems={menuKeys}
                />
            )}
        </View>
    );
};

export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? 30 : 50,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
        borderBottomWidth: 1,
        paddingBottom: 10,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
    },
    label: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 5,
    },
    subLabel: {
        fontSize: 16,
        marginBottom: 30,
    },
    avatarBlob: {
        marginBottom: 40,
        borderWidth: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 10,
    },
    statsContainer: {
        width: '80%',
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    statText: {
        fontSize: 16,
        lineHeight: 24,
    },
    customizeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 10,
        marginTop: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 6,
    },
    customizeButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    }
});

                        
