import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Rect } from 'react-native-svg';

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

const ColorPicker = ({ 
    selectedColor, 
    patternColor, 
    selectedPattern, 
    onColorChange, 
    onPatternColorChange, 
    onPatternChange, 
    onClose 
}) => {
    const { colors, isDarkMode } = useTheme();
    const [activeTab, setActiveTab] = useState('colors');
    // Track which color "slot" we are filling (1 = Base, 2 = Pattern)
    const [activeColorSlot, setActiveColorSlot] = useState(1);

    const PatternIcon = ({ patternId }) => (
        <Svg viewBox="0 0 40 40" width="40" height="40">
            <PatternLibrary patternId={patternId} color={isDarkMode ? '#FFFFFF' : '#333333'} />
            <Rect width="40" height="40" rx="8" fill={isDarkMode ? '#374151' : '#E5E7EB'} />
            <Rect width="40" height="40" rx="8" fill={`url(#${patternId})`} />
        </Svg>
    );

    const handleSelection = (color) => {
        if (activeColorSlot === 1) {
            onColorChange(color);
        } else {
            onPatternColorChange(color);
        }
    };

    return (
        <View style={styles.colorPickerModal}>
            {/* Tab Navigation */}
            <View style={localStyles.tabContainer}>
                {['colors', 'patterns'].map(tab => (
                    <TouchableOpacity 
                        key={tab}
                        onPress={() => setActiveTab(tab)}
                        style={[localStyles.tab, activeTab === tab && { backgroundColor: colors.primary }]}
                    >
                        <Text style={[localStyles.tabText, { color: activeTab === tab ? 'white' : colors.text }]}>
                            {tab.toUpperCase()}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Sub-toggle for Dual Colors (Only shows if a pattern is active) */}
            {selectedPattern && activeTab === 'colors' && (
                <View style={localStyles.slotContainer}>
                    <TouchableOpacity 
                        style={[localStyles.slotBtn, activeColorSlot === 1 && { borderColor: colors.primary }]}
                        onPress={() => setActiveColorSlot(1)}
                    >
                        <View style={[localStyles.slotIndicator, { backgroundColor: selectedColor }]} />
                        <Text style={{ color: colors.text, fontSize: 12 }}>1. Base</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[localStyles.slotBtn, activeColorSlot === 2 && { borderColor: colors.primary }]}
                        onPress={() => setActiveColorSlot(2)}
                    >
                        <View style={[localStyles.slotIndicator, { backgroundColor: patternColor }]} />
                        <Text style={{ color: colors.text, fontSize: 12 }}>2. Pattern</Text>
                    </TouchableOpacity>
                </View>
            )}

            <ScrollView showsVerticalScrollIndicator={false}>
                {activeTab === 'colors' ? (
                    <View style={styles.colorPaletteGrid}>
                        {COLOR_PALETTE.map((color, index) => {
                            const isSlot1 = selectedColor === color;
                            const isSlot2 = patternColor === color;
                            
                            return (
                                <TouchableOpacity
                                    key={index}
                                    style={[styles.paletteSwatch, { backgroundColor: color }]}
                                    onPress={() => handleSelection(color)}
                                >
                                    {isSlot1 && (
                                        <View style={localStyles.numberBadge}><Text style={localStyles.numberText}>1</Text></View>
                                    )}
                                    {isSlot2 && (
                                        <View style={[localStyles.numberBadge, isSlot1 && { right: -10 }]}><Text style={localStyles.numberText}>2</Text></View>
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                ) : (
                    <View style={localStyles.patternGrid}>
                        <TouchableOpacity
                            style={[localStyles.patternBtn, !selectedPattern && { borderColor: colors.primary }]}
                            onPress={() => onPatternChange(null)}
                        >
                            <Ionicons name="ban-outline" size={24} color={colors.text} />
                            <Text style={{ fontSize: 10, color: colors.text }}>None</Text>
                        </TouchableOpacity>

                        {PATTERNS.map((p) => (
                            <TouchableOpacity
                                key={p.id}
                                style={[localStyles.patternBtn, selectedPattern === p.id && { borderColor: colors.primary }]}
                                onPress={() => onPatternChange(p.id)}
                            >
                                <PatternIcon patternId={p.id} />
                                <Text style={{ fontSize: 10, color: colors.text }}>{p.name}</Text>
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

const localStyles = StyleSheet.create({
    tabContainer: { flexDirection: 'row', marginBottom: 15, borderRadius: 10, overflow: 'hidden', backgroundColor: 'rgba(0,0,0,0.05)' },
    tab: { flex: 1, paddingVertical: 10, alignItems: 'center' },
    tabText: { fontWeight: 'bold', fontSize: 12 },
    slotContainer: { flexDirection: 'row', justifyContent: 'center', gap: 20, marginBottom: 20 },
    slotBtn: { flexDirection: 'row', alignItems: 'center', padding: 6, borderRadius: 8, borderWidth: 2, borderColor: 'transparent', backgroundColor: 'rgba(0,0,0,0.03)' },
    slotIndicator: { width: 16, height: 16, borderRadius: 4, marginRight: 6, borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)' },
    numberBadge: { position: 'absolute', top: -5, left: -5, backgroundColor: 'white', width: 18, height: 18, borderRadius: 9, justifyContent: 'center', alignItems: 'center', elevation: 2 },
    numberText: { color: 'black', fontWeight: 'bold', fontSize: 10 },
    patternGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12 },
    patternBtn: { alignItems: 'center', padding: 8, borderRadius: 12, borderWidth: 2, borderColor: 'transparent' }
});

export default ColorPicker;
                                                      
