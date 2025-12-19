qimport React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import the Theme Context hook
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

/**
 * A centralized modal for app settings.
 * Now acts as a consumer of the global ThemeContext.
 */
const SettingsModal = ({ onClose }) => {
    // 1. Consume global theme state and the toggle function
    const { isDarkMode, colors, toggleTheme } = useTheme();

    const handleSettingPress = (name) => {
        if (name === 'Dark Mode') {
            // 2. This triggers a re-render for EVERY component using useTheme()
            toggleTheme();
        } else {
            console.log(`${name} clicked`);
        }
    };

    const settingButtons = [
        { name: 'Music', icon: 'musical-notes-outline' },
        { name: 'Sound', icon: 'volume-high-outline' },
        { name: 'Language', icon: 'language-outline' },
        { name: 'Dark Mode', icon: isDarkMode ? 'moon' : 'moon-outline' },
    ];

    return (
        <View style={styles.overlay}>
            {/* 3. We use the 'colors' object from context for all styles */}
            <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
                <View style={styles.header}>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>App Settings</Text>
                    <TouchableOpacity onPress={onClose}>
                        <Ionicons 
                            name="close-circle" 
                            size={32} 
                            color={isDarkMode ? '#9CA3AF' : '#4B5563'} 
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.buttonGrid}>
                    {settingButtons.map((item) => (
                        <TouchableOpacity
                            key={item.name}
                            style={[
                                styles.settingButton, 
                                { 
                                    backgroundColor: colors.card, 
                                    borderColor: colors.border,
                                    borderWidth: (item.name === 'Dark Mode' && isDarkMode) ? 2 : 1,
                                    // Highlight border if active dark mode
                                    borderColor: (item.name === 'Dark Mode' && isDarkMode) ? colors.primary : colors.border
                                }
                            ]}
                            onPress={() => handleSettingPress(item.name)}
                        >
                            <Ionicons 
                                name={item.icon} 
                                size={32} 
                                color={item.name === 'Dark Mode' && isDarkMode ? '#FBBF24' : colors.primary} 
                            />
                            <Text style={[styles.settingButtonText, { color: colors.text }]}>
                                {item.name}
                            </Text>
                            {item.name === 'Dark Mode' && (
                                <Text style={{ fontSize: 10, color: colors.primary, fontWeight: 'bold' }}>
                                    {isDarkMode ? 'ON' : 'OFF'}
                                </Text>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.footer}>
                    <Text style={[styles.versionText, { color: isDarkMode ? '#6B7280' : '#9CA3AF' }]}>
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
        zIndex: 5001, // Ensuring it stays above the Hamburger Dropdown (5000)
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

                                
