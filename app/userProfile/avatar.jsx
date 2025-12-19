import React, { useState, useCallback } from 'react';
import { Text, View, TouchableOpacity, ScrollView, Platform, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

// Import modular components
import EggPreviewSVG from '../src/components/EggPreviewSVG';
import ColorPicker from '../src/components/ColorPicker';
import HamburgerMenu from '../src/components/HamburgerMenu';

// Centralized Theme Constants
import { 
    PRIMARY_COLOR, 
    INITIAL_DARK_MODE, 
    DARK_BG_COLOR, 
    LIGHT_BG_COLOR, 
    DARK_TEXT_COLOR, 
    LIGHT_TEXT_COLOR 
} from '../src/utils/constants';

const VIEWBOX_SIZE = 100;
const ACCENT_COLOR = '#10B981'; // Emerald

const DEFAULT_CUSTOMIZATION = {
    type: 'egg',
    color: '#059669',
    shape: { hy: 60, wx: 40, wy: 35 }
};

const AvatarCustomizer = ({ initialCustomization = DEFAULT_CUSTOMIZATION, onSave, onCancel }) => {
    const [customization, setCustomization] = useState(initialCustomization);
    const [previewWindowPixelSize, setPreviewWindowPixelSize] = useState(VIEWBOX_SIZE);
    const [status, setStatus] = useState('Drag the red and blue markers to shape your avatar.');
    const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Theme values based on global constant
    const isDark = INITIAL_DARK_MODE;
    const bgColor = isDark ? DARK_BG_COLOR : '#FFFFFF';
    const cardBg = isDark ? '#1F2937' : '#F9FAFB';
    const textColor = isDark ? DARK_TEXT_COLOR : LIGHT_TEXT_COLOR;
    const borderColor = isDark ? '#374151' : '#E5E7EB';

    const menuKeys = ['home', 'version', 'auth', 'settings'];

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

    // Dynamic Styles
    const dynamicStyles = StyleSheet.create({
        container: { flex: 1, backgroundColor: bgColor, paddingTop: Platform.OS === 'ios' ? 40 : 10 },
        header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
        headerTitle: { fontSize: 20, fontWeight: 'bold', color: textColor },
        card: { 
            margin: 15, 
            padding: 20, 
            borderRadius: 16, 
            borderWidth: 1, 
            borderColor: borderColor, 
            backgroundColor: cardBg,
            shadowColor: '#000',
            shadowOpacity: isDark ? 0.3 : 0.05,
            elevation: 2 
        },
        statusText: { textAlign: 'center', marginBottom: 15, fontStyle: 'italic', color: isDark ? '#9CA3AF' : '#6B7280', fontSize: 14 },
        previewWindow: { 
            width: '90%', 
            aspectRatio: 1, 
            borderWidth: 1, 
            borderColor: borderColor, 
            borderRadius: 20, 
            backgroundColor: isDark ? '#111827' : 'white', 
            overflow: 'hidden' 
        },
        typeButton: { 
            paddingVertical: 12, 
            paddingHorizontal: 30, 
            borderRadius: 12, 
            borderWidth: 1, 
            borderColor: borderColor,
            backgroundColor: isDark ? '#374151' : 'transparent'
        },
        typeButtonText: { fontWeight: '600', color: isDark ? '#D1D5DB' : '#4B5563' },
        actionButton: { 
            flexDirection: 'row', 
            justifyContent: 'center', 
            alignItems: 'center', 
            padding: 16, 
            borderRadius: 14, 
            marginTop: 20,
            backgroundColor: ACCENT_COLOR 
        }
    });

    return (
        <View style={{ flex: 1, backgroundColor: bgColor }}>
            <ScrollView style={dynamicStyles.container} contentContainerStyle={{ paddingBottom: 50 }}>
                <View style={dynamicStyles.header}>
                    <TouchableOpacity onPress={onCancel}>
                        <Ionicons name="chevron-back" size={32} color={PRIMARY_COLOR} />
                    </TouchableOpacity>
                    <Text style={dynamicStyles.headerTitle}>Customize Avatar</Text>
                    <TouchableOpacity onPress={() => setIsMenuOpen(true)}>
                        <Ionicons name="menu" size={32} color={PRIMARY_COLOR} />
                    </TouchableOpacity>
                </View>
                
                <View style={dynamicStyles.card}>
                    <Text style={dynamicStyles.statusText}>{status}</Text>

                    <View style={{ alignItems: 'center', justifyContent: 'center', marginVertical: 10 }}>
                        <View style={dynamicStyles.previewWindow} onLayout={handleLayout}>
                            <EggPreviewSVG 
                                color={customization.color} 
                                shape={customization.shape} 
                                onShapeChange={handleShapeUpdateFromSVG}
                                convertPixelsToUnits={convertPixelsToUnits}
                            /> 
                            <TouchableOpacity 
                                style={{ position: 'absolute', top: 15, right: 15, backgroundColor: isDark ? '#4B5563' : 'white', padding: 8, borderRadius: 20 }} 
                                onPress={() => setIsColorPickerVisible(true)}
                            >
                                <Ionicons name="color-palette-outline" size={24} color={PRIMARY_COLOR} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    
                    <View style={{ marginVertical: 15 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 15, marginVertical: 10 }}>
                            <TouchableOpacity 
                                onPress={() => setCustomization(prev => ({ ...prev, type: 'egg' }))}
                                style={[dynamicStyles.typeButton, customization.type === 'egg' && { backgroundColor: PRIMARY_COLOR, borderColor: PRIMARY_COLOR }]}
                            >
                                <Text style={[dynamicStyles.typeButtonText, customization.type === 'egg' && { color: 'white' }]}>EGG</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress={() => setCustomization(prev => ({ ...prev, type: 'imp' }))} 
                                style={[dynamicStyles.typeButton, customization.type === 'imp' && { backgroundColor: PRIMARY_COLOR, borderColor: PRIMARY_COLOR }]}
                            >
                                <Text style={[dynamicStyles.typeButtonText, customization.type === 'imp' && { color: 'white' }]}>IMP</Text> 
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
                        onColorChange={handleColorChange} 
                        onClose={() => setIsColorPickerVisible(false)} 
                    />
                )}
            </ScrollView>

            {isMenuOpen && (
                <HamburgerMenu 
                    onClose={() => setIsMenuOpen(false)} 
                    activeItems={menuKeys}
                />
            )}
        </View>
    );
};

export default AvatarCustomizer;

