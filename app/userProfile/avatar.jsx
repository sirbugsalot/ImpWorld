import React, { useState, useCallback } from 'react';
import { Text, View, TouchableOpacity, ScrollView, Platform, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

import EggPreviewSVG from '../src/components/EggPreviewSVG';
import ColorPicker from '../src/components/ColorPicker';
import HamburgerMenu from '../src/components/HamburgerMenu';
import { useTheme } from '../src/context/ThemeContext';

const VIEWBOX_SIZE = 100;
const ACCENT_COLOR = '#10B981';

const DEFAULT_CUSTOMIZATION = {
    type: 'egg',
    color: '#059669',
    patternId: null, // Added pattern support
    shape: { hy: 60, wx: 40, wy: 35 }
};

const AvatarCustomizer = ({ initialCustomization = DEFAULT_CUSTOMIZATION, onSave, onCancel }) => {
    const { isDarkMode, colors } = useTheme();

    const [customization, setCustomization] = useState(initialCustomization);
    const [previewWindowPixelSize, setPreviewWindowPixelSize] = useState(VIEWBOX_SIZE);
    const [status, setStatus] = useState('Drag the red and blue markers to shape your avatar.');
    const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const convertPixelsToUnits = useCallback((pxX, pxY) => {
        if (previewWindowPixelSize === 0) return { unitX: pxX, unitY: pxY };
        let unitX = Math.max(0, Math.min(VIEWBOX_SIZE, (pxX / previewWindowPixelSize) * VIEWBOX_SIZE));
        let unitY = Math.max(0, Math.min(VIEWBOX_SIZE, (pxY / previewWindowPixelSize) * VIEWBOX_SIZE)); 
        return { unitX, unitY };
    }, [previewWindowPixelSize]);

    const handleLayout = (event) => setPreviewWindowPixelSize(event.nativeEvent.layout.width);

    const handleShapeUpdateFromSVG = useCallback((newShape) => {
        setCustomization(prev => ({ ...prev, shape: newShape }));
    }, []);

    const handleColorChange = (newColor) => setCustomization(prev => ({ ...prev, color: newColor }));
    const handlePatternChange = (newPatternId) => setCustomization(prev => ({ ...prev, patternId: newPatternId }));

    const dynamicStyles = StyleSheet.create({
        container: { flex: 1, backgroundColor: colors.background, paddingTop: Platform.OS === 'ios' ? 40 : 10 },
        header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
        headerTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text },
        card: { margin: 15, padding: 20, borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card },
        statusText: { textAlign: 'center', marginBottom: 15, fontStyle: 'italic', color: isDarkMode ? '#9CA3AF' : '#6B7280', fontSize: 14 },
        previewWindow: { width: '90%', aspectRatio: 1, borderWidth: 1, borderColor: colors.border, borderRadius: 20, backgroundColor: isDarkMode ? '#111827' : 'white', overflow: 'hidden' },
        typeButton: { paddingVertical: 12, paddingHorizontal: 30, borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: isDarkMode ? '#374151' : 'transparent' },
        typeButtonText: { fontWeight: '600', color: isDarkMode ? '#D1D5DB' : '#4B5563' },
        actionButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 16, borderRadius: 14, marginTop: 20, backgroundColor: ACCENT_COLOR }
    });

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <ScrollView style={dynamicStyles.container} contentContainerStyle={{ paddingBottom: 50 }}>
                <View style={dynamicStyles.header}>
                    <TouchableOpacity onPress={onCancel}>
                        <Ionicons name="chevron-back" size={32} color={colors.primary} />
                    </TouchableOpacity>
                    <Text style={dynamicStyles.headerTitle}>Customize Avatar</Text>
                    <TouchableOpacity onPress={() => setIsMenuOpen(true)}>
                        <Ionicons name="menu" size={32} color={colors.primary} />
                    </TouchableOpacity>
                </View>
                
                <View style={dynamicStyles.card}>
                    <View style={{ alignItems: 'center', justifyContent: 'center', marginVertical: 10 }}>
                        <View style={dynamicStyles.previewWindow} onLayout={handleLayout}>
                            <EggPreviewSVG 
                                color={customization.color} 
                                patternId={customization.patternId}
                                patternColor={isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.1)'}
                                shape={customization.shape} 
                                onShapeChange={handleShapeUpdateFromSVG}
                                convertPixelsToUnits={convertPixelsToUnits}
                            /> 
                            <TouchableOpacity 
                                style={{ position: 'absolute', top: 15, right: 15, backgroundColor: isDarkMode ? '#4B5563' : 'white', padding: 8, borderRadius: 20, elevation: 3 }} 
                                onPress={() => setIsColorPickerVisible(true)}
                            >
                                <Ionicons name="color-palette-outline" size={24} color={colors.primary} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    
                    <TouchableOpacity 
                        onPress={() => {
                            setStatus('Customization saved!');
                            if (onSave) onSave(customization);
                        }}
                        style={dynamicStyles.actionButton}
                    >
                        <Ionicons name="save-outline" size={24} color="white" style={{ marginRight: 10 }} />
                        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>SAVE</Text>
                    </TouchableOpacity>
                </View>
                
                {isColorPickerVisible && (
                    <ColorPicker 
                        selectedColor={customization.color} 
                        selectedPattern={customization.patternId}
                        onColorChange={handleColorChange} 
                        onPatternChange={handlePatternChange}
                        onClose={() => setIsColorPickerVisible(false)} 
                    />
                )}
            </ScrollView>

            {isMenuOpen && <HamburgerMenu onClose={() => setIsMenuOpen(false)} activeItems={['home', 'settings']} />}
        </View>
    );
};

export default AvatarCustomizer;

