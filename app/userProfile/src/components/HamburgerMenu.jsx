import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';

// Define colors (Should be consistent with index.jsx)
const textColor = '#1F2937';

/**
 * Reusable dropdown menu that displays a list of actions.
 * @param {object} props - Component props.
 * @param {function} props.onClose - Callback to close the menu.
 * @param {Array<object>} props.menuItems - List of menu objects: [{ id, title, action }]
 */
const HamburgerMenu = ({ onClose, menuItems }) => {

    // Define a wrapper function to execute the action and close the menu
    const handleAction = (action) => {
        action(onClose); // Pass onClose to the action handler so it can close itself after completion
    };

    return (
        // Dropdown Overlay
        <View style={menuStyles.dropdownContainer}>
            {menuItems.map((item, index) => (
                <TouchableOpacity 
                    key={item.id}
                    style={[
                        menuStyles.menuItem,
                        // Remove border from the last item
                        index === menuItems.length - 1 && { borderBottomWidth: 0 }
                    ]} 
                    onPress={() => handleAction(item.action)}
                >
                    <Text style={menuStyles.menuItemText}>{item.title}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const menuStyles = StyleSheet.create({
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
        zIndex: 10,
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

export default HamburgerMenu;

  
