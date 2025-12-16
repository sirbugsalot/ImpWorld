import React, { useState, useCallback } from 'react';
import { Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import Svg, { Path } from 'react-native-svg';

// Import modular components from src/
import EggPreviewSVG from './src/components/EggPreviewSVG';
import ColorPicker from './src/components/ColorPicker';

// --- MOCK CONSTANTS & STYLES FOR RUNNABILITY ---
const VIEWBOX_SIZE = 100;
const primaryColor = '#4F46E5'; // Indigo
const accentColor = '#10B981'; // Emerald
const DEFAULT_CUSTOMIZATION = {
    type: 'egg',
    color: '#059669',
    shape: { hy: 40, wx: 50, wy: 55 }
};
const styles = {
    container: { flex: 1, padding: 10, backgroundColor: '#FFFFFF' },
    contentContainer: { paddingBottom: 50 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#1F2937' },
    card: { margin: 10, padding: 20, borderRadius: 12, borderWidth: 1, borderColor: '#D1D5DB', backgroundColor: '#F9FAFB', shadowColor: '#000', shadowOpacity: 0.1, elevation: 5 },
    statusText: { textAlign: 'center', marginBottom: 15, fontStyle: 'italic', color: '#4B5563' },
    previewArea: { alignItems: 'center', justifyContent: 'center', marginVertical: 20 },
    // Important: Setting a fixed aspect ratio and size helps align touch events
    previewWindow: { width: '80%', aspectRatio: 1, borderWidth: 1, borderRadius: 10, overflow: 'hidden' }, 
    colorTriggerIcon: { position: 'absolute', top: 10, right: 10 },
    controlSection: { marginVertical: 10 },
    buttonRow: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 },
    typeButton: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, borderWidth: 1, borderColor: '#D1D5DB' },
    typeButtonActive: { backgroundColor: accentColor, borderColor: accentColor },
    typeButtonText: { fontWeight: '600', color: '#4B5563' },
    typeButtonTextActive: { color: 'white' },
    actionButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 15, borderRadius: 10, marginVertical: 20 },
    actionButtonText: { color: 'white', fontWeight: 'bold', fontSize: 18 }
};
// --- END MOCK DEFINITIONS ---


const AvatarCustomizer = ({ initialCustomization = DEFAULT_CUSTOMIZATION, onSave, onCancel }) => {
    
    const [customization, setCustomization] = useState(initialCustomization);
    const [previewWindowPixelSize, setPreviewWindowPixelSize] = useState(VIEWBOX_SIZE);
    const [status, setStatus] = useState('Customize your avatar by dragging the red and blue circles.');
    const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);

    // Constants for coordinate conversion (must match EggPreviewSVG's SVG element dimensions)
    const SVG_WIDTH_RATIO = 0.9;
    const SVG_OFFSET_X_RATIO = (1 - SVG_WIDTH_RATIO) / 2; // 0.05 (5% margin)

    /**
     * Converts touch coordinates (pixels) relative to the container 
     * into 100-unit SVG coordinates, adjusting for the 90% SVG width offset.
     * This function is passed to the SVG component.
     */
    const convertPixelsToUnits = useCallback((pxX, pxY) => {
        if (previewWindowPixelSize === VIEWBOX_SIZE) {
            return { unitX: pxX, unitY: pxY }; 
        }

        // 1. Calculate X relative to the SVG's top-left corner (accounting for the 5% left margin)
        const svgPxX = pxX - (previewWindowPixelSize * SVG_OFFSET_X_RATIO);
        
        // 2. Scale X based on the SVG's actual pixel width (90% of container)
        const svgPxWidth = previewWindowPixelSize * SVG_WIDTH_RATIO;
        let unitX = (svgPxX / svgPxWidth) * VIEWBOX_SIZE;
        
        // 3. Scale Y based on the container's full height (100%)
        let unitY = (pxY / previewWindowPixelSize) * VIEWBOX_SIZE; 
        
        // 4. Clamp X to ensure coordinates stay within the 0-100 viewBox range
        unitX = Math.max(0, Math.min(VIEWBOX_SIZE, unitX));

        return { unitX, unitY };
    }, [previewWindowPixelSize]);

    const handleLayout = (event) => {
        const { width } = event.nativeEvent.layout;
        setPreviewWindowPixelSize(width);
    };

    /**
     * Callback used by EggPreviewSVG to update the parent state.
     */
    const handleShapeUpdateFromSVG = useCallback((newShape) => {
        setCustomization(prev => ({
            ...prev,
            shape: newShape
        }));
    }, []);

    const handleColorChange = (newColor) => {
        setCustomization(prev => ({ ...prev, color: newColor }));
        setIsColorPickerVisible(false);
    };

    const handleTypeChange = (type) => {
        setCustomization(prev => ({ ...prev, type }));
    };


    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onCancel}>
                    <Ionicons name="chevron-back" size={32} color={primaryColor} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Customize Avatar</Text>
                <View style={{ width: 32 }} />
            </View>
            
            <View style={styles.card}>
                <Text style={styles.statusText}>{status}</Text>

                {/* --- PREVIEW AREA (The main touch-based control) --- */}
                <View style={styles.previewArea}>

                    {/* Egg Preview Window (onLayout handles pixel size calculation) */}
                    <View 
                        style={styles.previewWindow} 
                        onLayout={handleLayout} 
                        // Note: Touch handlers are now INSIDE EggPreviewSVG on the <Svg> element.
                    >
                        <EggPreviewSVG 
                            color={customization.color} 
                            shape={customization.shape} 
                            onShapeChange={handleShapeUpdateFromSVG}
                            convertPixelsToUnits={convertPixelsToUnits}
                        /> 
                        
                        <TouchableOpacity style={styles.colorTriggerIcon} onPress={() => setIsColorPickerVisible(true)}>
                            <Ionicons name="color-palette-outline" size={24} color={primaryColor} />
                        </TouchableOpacity>

                        {isColorPickerVisible && (
                            <ColorPicker 
                                selectedColor={customization.color} 
                                onColorChange={handleColorChange} 
                                onClose={() => setIsColorPickerVisible(false)} 
                            />
                        )}
                    </View>
                </View>
                
                {/* --- TYPE SELECTOR AND SAVE --- */}
                <View style={styles.controlSection}>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity 
                            onPress={() => handleTypeChange('egg')}
                            style={[styles.typeButton, customization.type === 'egg' && styles.typeButtonActive]}
                        >
                            <Text style={[styles.typeButtonText, customization.type === 'egg' && styles.typeButtonTextActive]}>EGG</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={() => handleTypeChange('imp')} 
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
                        onSave(customization);
                    }}
                    style={[styles.actionButton, { backgroundColor: accentColor }]}
                >
                    <Ionicons name="save-outline" size={24} color="white" style={{ marginRight: 10 }} />
                    <Text style={styles.actionButtonText}>SAVE</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default AvatarCustomizer;
