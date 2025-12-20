import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Rect } from 'react-native-svg';

// Import existing styles and constants
import { styles } from '../styles/avatarStyles';
import { COLOR_PALETTE } from '../utils/constants';
import { useTheme } from '../context/ThemeContext';
import PatternLibrary from '../patterns/PatternLibrary';

const PATTERNS = [
    { id: 'polka-dots', name: 'Dots' },
    { id: 'stripes', name: 'Stripes' },
    { id: 'hearts', name: 'Hearts' },
    { id: 'squares', name: 'Squares' },
    { id: 'zigzag', name: 'Zigzag' },
];

/**
 * Enhanced Modal component for selecting avatar color and patterns.
 */
const ColorPicker = ({ selectedColor, selectedPattern, onColorChange, onPatternChange, onClose }) => {
    const { colors, isDarkMode } = useTheme();
    const [activeTab, setActiveTab] = useState('colors'); // 'colors' or 'patterns'

    // Helper to render a miniature preview of the pattern
    const PatternIcon = ({ patternId }) => (
        <Svg viewBox="0 0 40 40" width="40" height="40">
            <PatternLibrary patternId={patternId} color={isDarkMode ? '#FFFFFF' : '#333333'} />
            <Rect width="40" height="40" rx="8" fill={isDarkMode ? '#374151' : '#E5E7EB'} />
            <Rect width="40" height="40" rx="8" fill={`url(#${patternId})`} />
        </Svg>
    );

    return (
        <View style={styles.colorPickerModal}>
            {/* Tab Navigation */}
            <View style={{ flexDirection: 'row', marginBottom: 20, borderRadius: 10, overflow: 'hidden', backgroundColor: isDarkMode ? '#1F2937' : '#F3F4F6' }}>
                <TouchableOpacity 
                    onPress={() => setActiveTab('colors')}
                    style={{ flex: 1, paddingVertical: 10, alignItems: 'center', backgroundColor: activeTab === 'colors' ? colors.primary : 'transparent' }}
                >
                    <Text style={{ fontWeight: 'bold', color: activeTab === 'colors' ? 'white' : colors.text }}>Colors</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={() => setActiveTab('patterns')}
                    style={{ flex: 1, paddingVertical: 10, alignItems: 'center', backgroundColor: activeTab === 'patterns' ? colors.primary : 'transparent' }}
                >
                    <Text style={{ fontWeight: 'bold', color: activeTab === 'patterns' ? 'white' : colors.text }}>Patterns</Text>
                </TouchableOpacity>
            </View>

            <ScrollView horizontal={false} showsVerticalScrollIndicator={false}>
                {activeTab === 'colors' ? (
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
                ) : (
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12 }}>
                        {/* Clear Pattern Option */}
                        <TouchableOpacity
                            style={{ alignItems: 'center', padding: 10, borderRadius: 12, borderWidth: 2, borderColor: !selectedPattern ? colors.primary : 'transparent' }}
                            onPress={() => onPatternChange(null)}
                        >
                            <View style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: isDarkMode ? '#374151' : '#E5E7EB', justifyContent: 'center', alignItems: 'center' }}>
                                <Ionicons name="ban-outline" size={24} color={colors.text} />
                            </View>
                            <Text style={{ fontSize: 10, marginTop: 4, color: colors.text }}>None</Text>
                        </TouchableOpacity>

                        {/* Pattern List */}
                        {PATTERNS.map((p) => (
                            <TouchableOpacity
                                key={p.id}
                                style={{ alignItems: 'center', padding: 10, borderRadius: 12, borderWidth: 2, borderColor: selectedPattern === p.id ? colors.primary : 'transparent' }}
                                onPress={() => onPatternChange(p.id)}
                            >
                                <PatternIcon patternId={p.id} />
                                <Text style={{ fontSize: 10, marginTop: 4, color: colors.text }}>{p.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </ScrollView>

            <TouchableOpacity onPress={onClose} style={[styles.colorPickerCloseButton, { marginTop: 20 }]}>
                <Text style={styles.colorPickerCloseText}>Close</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ColorPicker;

        
