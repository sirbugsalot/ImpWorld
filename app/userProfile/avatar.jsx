import React, { useState, useCallback } from 'react';
import { Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import Svg, { Path } from 'react-native-svg';

// Import modular components from src/
import EggPreviewSVG from './src/components/EggPreviewSVG';
import ColorPicker from './src/components/ColorPicker';

// --- MOCK CONSTANTS & STYLES FOR RUNNABILITY ---
const VIEWBOX_SIZE = 100;
const WIDTH_VIEWBOX = VIEWBOX_SIZE;
const EGG_VIEWBOX_BASE_Y = 70;
const MAX_HEIGHT = 50; 
const MIN_HEIGHT = 20;
const MAX_WIDTH = 60;
const MIN_WIDTH = 30;
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
    const [draggedVertexIndex, setDraggedVertexIndex] = useState(null);
    const [status, setStatus] = useState('Customize your avatar by dragging the red and blue circles.');
    const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);


    const pixelToUnit = (px) => {
        // Map pixel coordinate to the 100-unit SVG viewbox space
        if (previewWindowPixelSize === VIEWBOX_SIZE) return px; 
        return (px / previewWindowPixelSize) * VIEWBOX_SIZE;
    };
    
    const handleLayout = (event) => {
        const { width } = event.nativeEvent.layout;
        setPreviewWindowPixelSize(width);
    };

    const { shape } = customization;
    
    const getEggVertices = (currentShape) => {
        const topY = EGG_VIEWBOX_BASE_Y - currentShape.hy;
        return [
            { 
                x: VIEWBOX_SIZE / 2,         
                y: topY 
            }, 
            { 
                x: VIEWBOX_SIZE / 2 + currentShape.wx / 2, 
                y: currentShape.wy 
            }, 
        ];
    };
    
    const currentEggVertices = getEggVertices(shape);


    /**
     * Finds the index of the vertex near the given coordinates (in VIEWBOX units).
     */
    const getActiveVertext = (unitX, unitY) => {
        // Increased threshold to make touch targets easier to hit on mobile
        const threshold = 10; 
        for (let i = 0; i < currentEggVertices.length; i++){
            const vertex = currentEggVertices[i];
            const distance = Math.sqrt( (unitX - vertex.x)**2 + (unitY - vertex.y)**2);
            if (distance <= threshold) {
                return i;
            }
        }
        return null; 
    };
    
    /**
     * Handles the start of a touch/drag gesture.
     */
    const handleTouchStart = (event) => {
        // 1. Convert pixel event coordinates to 100-unit coordinates
        const unitX = pixelToUnit(event.nativeEvent.locationX);
        const unitY = pixelToUnit(event.nativeEvent.locationY);
        
        const activeVertexIndex = getActiveVertext(unitX, unitY);

        if (activeVertexIndex !== null) {
            setDraggedVertexIndex(activeVertexIndex);
            // Optional: Call move handler immediately for snappy start
            handleTouchMove(event, activeVertexIndex); 
        }
    };


    /**
     * Handles the movement during a drag gesture.
     */
    const handleTouchMove = (event, initialIndex = null) => {
        const activeVertexIndex = initialIndex !== null ? initialIndex : draggedVertexIndex;

        if (activeVertexIndex === null) {
            return; // Not currently dragging a vertex
        }
        
        // 1. Convert pixel event coordinates to 100-unit coordinates
        const unitX = pixelToUnit(event.nativeEvent.locationX);
        const unitY = pixelToUnit(event.nativeEvent.locationY);

        // Get current shape dimensions
        const { hy, wx, wy } = customization.shape;
        
        // Temporarily store new dimensions
        let newHy = hy;
        let newWx = wx;
        let newWy = wy;
        
        if (activeVertexIndex === 0) {
            // Index 0: Height/Top vertex (x is fixed at center)
            const minTopY = EGG_VIEWBOX_BASE_Y - MAX_HEIGHT; 
            const maxTopY = EGG_VIEWBOX_BASE_Y - MIN_HEIGHT; 

            // Calculate the absolute Y of the new vertex, clamped
            const newTopY = Math.max(minTopY, Math.min(maxTopY, unitY));
            
            // Convert Absolute Y-coordinate back to Height DIMENSION: BaseY - Absolute Y
            newHy = EGG_VIEWBOX_BASE_Y - newTopY;
            
        } else if (activeVertexIndex === 1) {
            // Index 1: Width/Waist vertex (y is clamped, x determines width)
            
            // Need the current Top Y coordinate to clamp the waist Y relative to the egg's height
            const currentTopY = EGG_VIEWBOX_BASE_Y - hy;

            const minWaistX = WIDTH_VIEWBOX / 2 + MIN_WIDTH / 2;
            const maxWaistX = WIDTH_VIEWBOX / 2 + MAX_WIDTH / 2;

            // Clamping the Waist Y position relative to the current egg height
            const availableHeight = EGG_VIEWBOX_BASE_Y - currentTopY;
            const minWaistY = currentTopY + availableHeight * 0.15; // 15% down from the top
            const maxWaistY = EGG_VIEWBOX_BASE_Y - availableHeight * 0.15; // 15% up from the bottom

            // Calculate new X and Y, clamped
            const newWaistX = Math.max(minWaistX, Math.min(maxWaistX, unitX));
            newWy = Math.max(minWaistY, Math.min(maxWaistY, unitY));
            
            // wx is the width dimension (distance from center * 2)
            newWx = (newWaistX - WIDTH_VIEWBOX / 2) * 2;
        }

        // 2. Update the customization state
        setCustomization(prev => ({
            ...prev,
            shape: {
                ...prev.shape,
                hy: newHy, 
                wx: newWx, 
                wy: newWy, 
            }
        }));
    };

    const releaseUpdate = () => {
        setDraggedVertexIndex(null);
    };

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

                    {/* 3. Egg Preview Window (Handles touch events for dragging) */}
                    <View 
                        style={styles.previewWindow} 
                        onLayout={handleLayout} // Get the actual pixel size for coordinate mapping
                        // Bind separated handlers
                        onTouchStart={handleTouchStart} 
                        onTouchMove={handleTouchMove} 
                        onTouchEnd={releaseUpdate}
                    >
                        <EggPreviewSVG 
                            color={customization.color} 
                            shape={customization.shape} 
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
