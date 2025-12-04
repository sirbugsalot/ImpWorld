import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/avatarStyles'; // Correct path

/**
 * Dedicated component for controlling the Waist (minor axis position) using buttons only.
 * FIX: Removed the unstable InteractiveSliderTrack and relies only on buttons.
 */
const WaistSlider = ({ shape, handleShapeUpdate }) => {
    const value = shape.waist;
    const max = shape.height; // Waist must be between 0 and the current height
    const min = 0;

    return (
        <View style={styles.waistSliderContainer}>
            <Text style={styles.sliderLabel}>Waist Position: {value} (Max: {max})</Text>
            <View style={styles.sliderControlRow}>
                {/* Minus button for fine tuning */}
                <TouchableOpacity
                    onPress={() => handleShapeUpdate('waist', value - 1)}
                    disabled={value <= min}
                    style={[styles.smallButton, value <= min && styles.sliderButtonDisabled]}
                >
                    <Ionicons name="remove-outline" size={20} color="white" />
                </TouchableOpacity>

                {/* Display Value in the center */}
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1F2937' }}>{value}</Text>
                </View>

                {/* Plus button for fine tuning */}
                <TouchableOpacity
                    onPress={() => handleShapeUpdate('waist', value + 1)}
                    disabled={value >= max}
                    style={[styles.smallButton, value >= max && styles.sliderButtonDisabled]}
                >
                    <Ionicons name="add-outline" size={20} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default WaistSlider;

