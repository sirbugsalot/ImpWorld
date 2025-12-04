import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; 

// Corrected import: The main customizer logic is now exported from the './avatar' file.
import AvatarCustomizer from './avatar'; 

const primaryColor = '#1D4ED8'; 
const BLOB_SIZE = 100;

const SCREENS = {
    PROFILE_VIEW: 'profile',
    CUSTOMIZER: 'customizer'
};

const DEFAULT_AVATAR_DATA = { 
    type: 'egg', 
    color: '#8A2BE2', 
    shape: { width: 30, height: 40, waist: 20 } 
};

/**
 * The main Profile View component (extracted from the original profile.js)
 */
const ProfileView = ({ avatarData, onNavigateToCustomizer, onGoBack }) => {
    // Determine the size descriptor for display
    const getSizeDescription = () => {
        const { width, height } = avatarData.shape;
        if (width < 30 && height < 40) return "Small and Round";
        if (width > 50 && height > 50) return "Large and Robust";
        return "Balanced Egg";
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onGoBack}>
                    <Ionicons name="chevron-back" size={32} color={primaryColor} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Player Profile</Text>
                <View style={{ width: 32 }} />
            </View>

            <View style={styles.content}>
                <Text style={styles.label}>Your Avatar</Text>
                <Text style={styles.subLabel}>Type: {avatarData.type.toUpperCase()}</Text>

                {/* Avatar Visual (Now rendering the complex shape) */}
                <View 
                    style={[
                        styles.avatarBlob, 
                        { 
                            backgroundColor: avatarData.color,
                            // Use shape properties for dynamic styling
                            width: avatarData.shape.width * 2.5,
                            height: avatarData.shape.height * 2.5,
                            borderRadius: BLOB_SIZE / 2, // Keep default for simplicity here, customizer handles detail
                        }
                    ]} 
                />
                
                {/* Status Display of Avatar Properties */}
                <View style={styles.statsContainer}>
                    <Text style={styles.statText}>Color: {avatarData.color}</Text>
                    <Text style={styles.statText}>Shape: {getSizeDescription()}</Text>
                    <Text style={styles.statText}>Width: {avatarData.shape.width}</Text>
                    <Text style={styles.statText}>Height: {avatarData.shape.height}</Text>
                    <Text style={styles.statText}>Waist: {avatarData.shape.waist}</Text>
                </View>

                <TouchableOpacity
                    style={styles.customizeButton}
                    onPress={onNavigateToCustomizer}
                >
                    <Ionicons name="settings-outline" size={20} color="white" />
                    <Text style={styles.customizeButtonText}>Customize Avatar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

/**
 * The main component acting as a Router for the Profile screen.
 */
const ProfileScreen = () => {
    const router = useRouter();
    const [currentScreen, setCurrentScreen] = useState(SCREENS.PROFILE_VIEW);
    const [avatarData, setAvatarData] = useState(DEFAULT_AVATAR_DATA);

    // Handler to save the customization data and switch back to the profile view
    const handleCustomizationSave = (newAvatarData) => {
        setAvatarData(newAvatarData);
        setCurrentScreen(SCREENS.PROFILE_VIEW);
    };

    // Render the appropriate screen based on state
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
        <ProfileView
            avatarData={avatarData}
            onNavigateToCustomizer={() => setCurrentScreen(SCREENS.CUSTOMIZER)}
            onGoBack={() => router.back()}
        />
    );
};

export default ProfileScreen;

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
        paddingHorizontal: 20,
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        paddingBottom: 10,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: primaryColor,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
    },
    label: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 5,
    },
    subLabel: {
        fontSize: 16,
        color: '#4B5563',
        marginBottom: 30,
    },
    avatarBlob: {
        borderRadius: BLOB_SIZE / 2,
        marginBottom: 40,
        borderWidth: 5,
        borderColor: 'white',
        // Added shadow for depth
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 10,
    },
    statsContainer: {
        width: '80%',
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    statText: {
        fontSize: 16,
        color: '#4B5563',
        lineHeight: 24,
    },
    customizeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: primaryColor,
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
