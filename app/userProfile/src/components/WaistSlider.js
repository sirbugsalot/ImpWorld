import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import InteractiveSliderTrack from './InteractiveSliderTrack';
import { styles } from '../styles/avatarStyles';

/**
 * Dedicated component for controlling the Waist (minor axis position).
 */
const WaistSlider = ({ shape, handleShapeUpdate }) => {
    const value = shape.waist;
    // Waist must be between 0 and the current height
    const min = 0;
    const max = shape.height;

    return (
        <View style={styles.waistSliderContainer}>
            <Text style={styles.sliderLabel}>Waist Position: {value}</Text>
            <View style={styles.sliderControlRow}>
                {/* Minus button for fine tuning */}
                <TouchableOpacity
                    onPress={() => handleShapeUpdate('waist', value - 1)}
                    disabled={value <= min}
                    style={[styles.smallButton, value <= min && styles.sliderButtonDisabled]}
                >
                    <Ionicons name="remove-outline" size={20} color="white" />
                </TouchableOpacity>

                {/* Interactive Track for dragging */}
                <InteractiveSliderTrack
                    parameterKey="waist"
                    value={value}
                    min={min}
                    max={max}
                    orientation="horizontal"
                    handleUpdate={handleShapeUpdate}
                    shapeHeight={shape.height} // Needed for clamping logic
                />

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

