import React, { useState, useCallback } from 'react';
import { Text, View, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

// Import modular components from src/
import EggPreviewSVG from './src/components/EggPreviewSVG';
// Import the newly created ColorPicker component
import ColorPicker from './src/components/ColorPicker';

import HamburgerMenu from '../src/components/HamburgerMenu';

// --- CONSTANTS & STYLES ---
const VIEWBOX_SIZE = 100;
const primaryColor = '#4F46E5'; // Indigo
const accentColor = '#10B981'; // Emerald

const DEFAULT_CUSTOMIZATION = {
    type: 'egg',
    color: '#059669',
    shape: { hy: 60, wx: 40, wy: 35 }
};

const styles = {
    container: { flex: 1, backgroundColor: '#FFFFFF', paddingTop: Platform.OS === 'ios' ? 40 : 10 },
    contentContainer: { paddingBottom: 50 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#1F2937' },
    card: { margin: 15, padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#F9FAFB', shadowColor: '#000', shadowOpacity: 0.05, elevation: 2 },
    statusText: { textAlign: 'center', marginBottom: 15, fontStyle: 'italic', color: '#6B7280', fontSize: 14 },
    previewArea: { alignItems: 'center', justifyContent: 'center', marginVertical: 10 },
    previewWindow: { width: '90%', aspectRatio: 1, borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 20, backgroundColor: 'white', overflow: 'hidden' }, 
    colorTriggerIcon: { position: 'absolute', top: 15, right: 15, backgroundColor: 'white', padding: 8, borderRadius: 20, shadowColor: '#000', shadowOpacity: 0.1, elevation: 3 },
    controlSection: { marginVertical: 15 },
    buttonRow: { flexDirection: 'row', justifyContent: 'center', gap: 15, marginVertical: 10 },
    typeButton: { paddingVertical: 12, paddingHorizontal: 30, borderRadius: 12, borderWidth: 1, borderColor: '#D1D5DB' },
    typeButtonActive: { backgroundColor: primaryColor, borderColor: primaryColor },
    typeButtonText: { fontWeight: '600', color: '#4B5563' },
    typeButtonTextActive: { color: 'white' },
    actionButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 16, borderRadius: 14, marginTop: 20 },
    actionButtonText: { color: 'white', fontWeight: 'bold', fontSize: 18 }
};

const AvatarCustomizer = ({ initialCustomization = DEFAULT_CUSTOMIZATION, onSave, onCancel }) => {
    
    const [customization, setCustomization] = useState(initialCustomization);
    const [previewWindowPixelSize, setPreviewWindowPixelSize] = useState(VIEWBOX_SIZE);
    const [status, setStatus] = useState('Drag the red and blue markers to shape your avatar.');
    const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Restricted menu items for the customizer view
    const menuKeys = ['home', 'version', 'auth', 'settings'];

    /**
     * Converts touch coordinates (pixels) relative to the container 
     * into 100-unit SVG coordinates for consistent dragging math.
     */
    const convertPixelsToUnits = useCallback((pxX, pxY) => {
        if (previewWindowPixelSize === 0) return { unitX: pxX, unitY: pxY };

        let unitX = (pxX / previewWindowPixelSize) * VIEWBOX_SIZE;
        let unitY = (pxY / previewWindowPixelSize) * VIEWBOX_SIZE; 
        
        unitX = Math.max(0, Math.min(VIEWBOX_SIZE, unitX));
        unitY = Math.max(0, Math.min(VIEWBOX_SIZE, unitY));

        return { unitX, unitY };
    }, [previewWindowPixelSize]);

    const handleLayout = (event) => {
        const { width } = event.nativeEvent.layout;
        setPreviewWindowPixelSize(width);
    };

    const handleShapeUpdateFromSVG = useCallback((newShape) => {
        setCustomization(prev => ({
            ...prev,
            shape: newShape
        }));
    }, []);

    const handleColorChange = (newColor) => {
        setCustomization(prev => ({ ...prev, color: newColor }));
    };

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={onCancel}>
                        <Ionicons name="chevron-back" size={32} color={primaryColor} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Customize Avatar</Text>
                    <TouchableOpacity onPress={() => setIsMenuOpen(true)}>
                        <Ionicons name="menu" size={32} color={primaryColor} />
                    </TouchableOpacity>
                </View>
                
                <View style={styles.card}>
                    <Text style={styles.statusText}>{status}</Text>

                    {/* --- PREVIEW AREA --- */}
                    <View style={styles.previewArea}>
                        <View 
                            style={styles.previewWindow} 
                            onLayout={handleLayout} 
                        >
                            <EggPreviewSVG 
                                color={customization.color} 
                                shape={customization.shape} 
                                onShapeChange={handleShapeUpdateFromSVG}
                                convertPixelsToUnits={convertPixelsToUnits}
                            /> 
                            
                            <TouchableOpacity 
                                style={styles.colorTriggerIcon} 
                                onPress={() => setIsColorPickerVisible(true)}
                            >
                                <Ionicons name="color-palette-outline" size={24} color={primaryColor} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    
                    {/* --- TYPE SELECTOR --- */}
                    <View style={styles.controlSection}>
                        <View style={styles.buttonRow}>
                            <TouchableOpacity 
                                onPress={() => setCustomization(prev => ({ ...prev, type: 'egg' }))}
                                style={[styles.typeButton, customization.type === 'egg' && styles.typeButtonActive]}
                            >
                                <Text style={[styles.typeButtonText, customization.type === 'egg' && styles.typeButtonTextActive]}>EGG</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress={() => setCustomization(prev => ({ ...prev, type: 'imp' }))} 
                                style={[styles.typeButton, customization.type === 'imp' && styles.typeButtonActive]}
                            >
                                <Text style={[styles.typeButtonText, customization.type === 'imp' && styles.typeButtonTextActive]}>IMP</Text> 
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Save Button */}
                    <TouchableOpacity 
                        onPress={() => {
                            setStatus('Customization saved!');
                            if (onSave) onSave(customization);
                        }}
                        style={[styles.actionButton, { backgroundColor: accentColor }]}
                    >
                        <Ionicons name="save-outline" size={24} color="white" style={{ marginRight: 10 }} />
                        <Text style={styles.actionButtonText}>SAVE</Text>
                    </TouchableOpacity>
                </View>
                
                {/* Color Picker Modal */}
                {isColorPickerVisible && (
                    <ColorPicker 
                        selectedColor={customization.color} 
                        onColorChange={handleColorChange} 
                        onClose={() => setIsColorPickerVisible(false)} 
                    />
                )}
            </ScrollView>

            {/* Hamburger Menu Overlay */}
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

            
