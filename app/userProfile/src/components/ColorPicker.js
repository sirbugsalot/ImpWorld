import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/avatarStyles';
import { COLOR_PALETTE } from '../constants';

/**
 * Modal component for selecting the avatar color.
 */
const ColorPicker = ({ selectedColor, onColorChange, onClose }) => {
    return (
        <View style={styles.colorPickerModal}>
            <View style={styles.colorPaletteGrid}>
                {COLOR_PALETTE.map((color, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[styles.paletteSwatch, { backgroundColor: color }]}
                        onPress={() => onColorChange(color)}
                    >
                        {selectedColor === color && (
                            <Ionicons name="checkmark-circle" size={20} color="white" style={styles.checkmarkIcon} />
                        )}
                    </TouchableOpacity>
                ))}
            </View>
            <TouchableOpacity onPress={onClose} style={styles.colorPickerCloseButton}>
                <Text style={styles.colorPickerCloseText}>Close</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ColorPicker;
