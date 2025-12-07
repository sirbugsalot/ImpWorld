import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/avatarStyles'; // Correct path
import { MIN_DIMENSION, MAX_DIMENSION } from '../constants';

/**
 * Dedicated component for controlling the Waist (percentage from top) using buttons.
 */
const WaistSlider = ({ shape, handleShapeUpdate }) => {
    const value = shape.waist;
    // Waist is a percentage from 0 (top) to 100 (bottom)
    const min = 0; 
    const max = 100;

    return (
        <View style={styles.waistSliderContainer}>
            <Text style={styles.sliderLabel}>Waist Position: {value}% from top</Text>
            <View style={styles.sliderControlRow}>
                {/* Minus button (Move waist UP/closer to 0%) */}
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

                {/* Plus button (Move waist DOWN/closer to 100%) */}
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