import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Define a palette of commonly used colors
const COLOR_PALETTE = [
    '#EF4444', // Red
    '#F97316', // Orange
    '#FBBF24', // Yellow
    '#34D399', // Green (Emerald)
    '#059669', // Dark Green
    '#3B82F6', // Blue
    '#4F46E5', // Indigo
    '#8B5CF6', // Violet
    '#EC4899', // Pink
    '#6B7280', // Gray
    '#1F2937', // Dark Slate
    '#D1D5DB', // Light Gray
];

const styles = {
    // Styles for the modal overlay
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    // Styles for the content card
    card: {
        width: width * 0.85,
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    colorGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    colorOption: {
        width: '30%', // Approx 3 columns, adjusted for margins
        aspectRatio: 1,
        borderRadius: 10,
        marginVertical: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
    },
    colorOptionPlaceholder: {
        width: '30%',
        marginVertical: 5,
    }
};

/**
 * A modal-style color picker overlay.
 * @param {object} props - Component props.
 * @param {string} props.selectedColor - The currently selected color.
 * @param {function} props.onColorChange - Callback when a new color is selected (takes color string).
 * @param {function} props.onClose - Callback to close the picker.
 */
const ColorPicker = ({ selectedColor, onColorChange, onClose }) => {

    const handleSelectColor = (color) => {
        onColorChange(color);
        // onClose(); // Optionally close immediately after selection
    };

    return (
        <View style={styles.overlay}>
            <View style={styles.card}>
                <View style={styles.header}>
                    <Text style={styles.title}>Choose Color</Text>
                    <TouchableOpacity onPress={onClose}>
                        <Ionicons name="close-circle-outline" size={28} color="#4B5563" />
                    </TouchableOpacity>
                </View>

                <View style={styles.colorGrid}>
                    {COLOR_PALETTE.map((color, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.colorOption,
                                { backgroundColor: color },
                                selectedColor === color 
                                    ? { borderColor: '#4F46E5', borderWidth: 4 } // Highlight active color
                                    : { borderColor: '#FFFFFF', borderWidth: 2 } 
                            ]}
                            onPress={() => handleSelectColor(color)}
                        >
                            {selectedColor === color && (
                                <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
                            )}
                        </TouchableOpacity>
                    ))}
                    {/* Add invisible spacers to ensure last row aligns correctly if grid size isn't perfect */}
                    {COLOR_PALETTE.length % 3 === 1 && <View style={styles.colorOptionPlaceholder} />}
                    {COLOR_PALETTE.length % 3 === 2 && (
                        <>
                            <View style={styles.colorOptionPlaceholder} />
                            <View style={styles.colorOptionPlaceholder} />
                        </>
                    )}
                </View>
                
                <TouchableOpacity 
                    onPress={onClose} 
                    style={{ marginTop: 20, padding: 10, backgroundColor: '#D1D5DB', borderRadius: 8 }}
                >
                    <Text style={{ textAlign: 'center', fontWeight: 'bold', color: '#1F2937' }}>
                        Done
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ColorPicker;
