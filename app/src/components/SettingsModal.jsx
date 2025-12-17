import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import constants to ensure the modal uses the same source of truth
import { 
    PRIMARY_COLOR, 
    DARK_BG_COLOR, 
    LIGHT_BG_COLOR, 
    DARK_TEXT_COLOR, 
    LIGHT_TEXT_COLOR,
    INITIAL_DARK_MODE 
} from '../../src/utils/constants';

const { width } = Dimensions.get('window');

/**
 * A centralized modal for app settings.
 * Handles theme toggling and persists visual state.
 */
const SettingsModal = ({ onClose }) => {
    // We initialize based on our global constant
    const [isDark, setIsDark] = useState(INITIAL_DARK_MODE);

    // Dynamic theme colors based on internal state
    const theme = {
        bg: isDark ? DARK_BG_COLOR : '#FFFFFF',
        card: isDark ? '#374151' : '#F3F4F6',
        text: isDark ? DARK_TEXT_COLOR : LIGHT_TEXT_COLOR,
        border: isDark ? '#4B5563' : '#E5E7EB',
    };

    const handleSettingPress = (name) => {
        if (name === 'Dark Mode') {
            const newMode = !isDark;
            setIsDark(newMode);
            // logic for persistent storage (e.g. AsyncStorage) would go here
            console.log(`Theme changed to: ${newMode ? 'Dark' : 'Light'}`);
        } else {
            console.log(`${name} clicked`);
        }
    };

    const settingButtons = [
        { name: 'Music', icon: 'musical-notes-outline' },
        { name: 'Sound', icon: 'volume-high-outline' },
        { name: 'Language', icon: 'language-outline' },
        { name: 'Dark Mode', icon: isDark ? 'moon' : 'moon-outline' },
    ];

    return (
        <View style={styles.overlay}>
            <View style={[styles.modalContainer, { backgroundColor: theme.bg }]}>
                <View style={styles.header}>
                    <Text style={[styles.headerTitle, { color: theme.text }]}>App Settings</Text>
                    <TouchableOpacity onPress={onClose}>
                        <Ionicons name="close-circle" size={32} color={isDark ? '#9CA3AF' : '#4B5563'} />
                    </TouchableOpacity>
                </View>

                <View style={styles.buttonGrid}>
                    {settingButtons.map((item) => (
                        <TouchableOpacity
                            key={item.name}
                            style={[
                                styles.settingButton, 
                                { 
                                    backgroundColor: theme.card, 
                                    borderColor: theme.border,
                                    // Highlight the Dark Mode button when active
                                    borderWidth: (item.name === 'Dark Mode' && isDark) ? 2 : 1,
                                    borderColor: (item.name === 'Dark Mode' && isDark) ? PRIMARY_COLOR : theme.border
                                }
                            ]}
                            onPress={() => handleSettingPress(item.name)}
                        >
                            <Ionicons 
                                name={item.icon} 
                                size={32} 
                                color={item.name === 'Dark Mode' && isDark ? '#FBBF24' : PRIMARY_COLOR} 
                            />
                            <Text style={[styles.settingButtonText, { color: theme.text }]}>
                                {item.name}
                            </Text>
                            {item.name === 'Dark Mode' && (
                                <Text style={{ fontSize: 10, color: PRIMARY_COLOR, fontWeight: 'bold' }}>
                                    {isDark ? 'ON' : 'OFF'}
                                </Text>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.footer}>
                    <Text style={[styles.versionText, { color: isDark ? '#6B7280' : '#9CA3AF' }]}>
                        v1.0.5-Alpha
                    </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2000, 
    },
    modalContainer: {
        width: width * 0.85,
        maxWidth: 400,
        borderRadius: 24,
        padding: 24,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.3,
                shadowRadius: 20,
            },
            android: {
                elevation: 10,
            },
        }),
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 25,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    buttonGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    settingButton: {
        width: '47%',
        paddingVertical: 20,
        marginVertical: 6,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    settingButtonText: {
        marginTop: 8,
        fontSize: 14,
        fontWeight: '700',
    },
    footer: {
        marginTop: 20,
        alignItems: 'center',
    },
    versionText: {
        fontSize: 12,
        fontWeight: '500',
    }
});

export default SettingsModal;

