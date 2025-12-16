import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Define colors (Should be consistent with index.jsx)
const primaryColor = '#1D4ED8'; 
const textColor = '#1F2937';

/**
 * A modal component for application settings.
 * @param {object} props - Component props.
 * @param {function} props.onClose - Callback to close the modal.
 * @param {function} props.onToggleDarkMode - Placeholder for future dark mode implementation.
 */
const SettingsModal = ({ onClose, onToggleDarkMode }) => {
    
    // Placeholder handlers for the settings buttons
    const handleSetting = (name) => {
        console.log(`Setting clicked: ${name}`);
        // For 'Dark' button, we can simulate the toggle action
        if (name === 'Dark') {
            onToggleDarkMode();
        }
    };

    const settingButtons = [
        { name: 'Music', icon: 'musical-notes-outline' },
        { name: 'Sound', icon: 'volume-high-outline' },
        { name: 'Language', icon: 'language-outline' },
        { name: 'Dark', icon: 'moon-outline' },
    ];

    return (
        // Modal Overlay
        <View style={modalStyles.overlay}>
            {/* Modal Content */}
            <View style={modalStyles.modalContainer}>
                <View style={modalStyles.header}>
                    <Text style={modalStyles.headerTitle}>App Settings</Text>
                    <TouchableOpacity onPress={onClose}>
                        <Ionicons name="close-circle-outline" size={30} color={textColor} />
                    </TouchableOpacity>
                </View>

                {/* Settings Grid */}
                <View style={modalStyles.buttonGrid}>
                    {settingButtons.map((item) => (
                        <TouchableOpacity
                            key={item.name}
                            style={modalStyles.settingButton}
                            onPress={() => handleSetting(item.name)}
                        >
                            <Ionicons name={item.icon} size={40} color={primaryColor} />
                            <Text style={modalStyles.settingButtonText}>{item.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </View>
    );
};

const modalStyles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 20, // Higher Z-index than the menu
    },
    modalContainer: {
        width: width * 0.9,
        maxWidth: 400,
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 8,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: textColor,
    },
    buttonGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    settingButton: {
        width: '48%', // Two columns
        padding: 15,
        marginVertical: 5,
        backgroundColor: '#F3F4F6',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    settingButtonText: {
        marginTop: 5,
        fontSize: 14,
        fontWeight: '600',
        color: textColor,
    },
});

export default SettingsModal;

          
