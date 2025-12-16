import React, { useState, useCallback } from 'react';
import { Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import Svg, { Path } from 'react-native-svg';

// Import modular components from src/
import EggPreviewSVG from './src/components/EggPreviewSVG';
import ColorPicker from './src/components/ColorPicker';

// --- MOCK CONSTANTS & STYLES FOR RUNNABILITY ---
// NOTE: In a real app, these should be imported from ./src/constants and ./src/styles/avatarStyles
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
    
    // State for color and type
    const [customization, setCustomization] = useState(initialCustomization);

    // --- Simplifying Coordinate Conversion ---
    // We assume the touch coordinates (locationX, locationY) are already relative to the
    // previewWindow, which contains the 100x100 SVG. We use a simple ratio based on the 
    // container's current width (in pixels) to map to the 100-unit SVG space.
    
    // State to hold the current pixel size of the preview window for accurate coordinate mapping
    const [previewWindowPixelSize, setPreviewWindowPixelSize] = useState(VIEWBOX_SIZE);

    const pixelToUnit = (px) => {
        // Map pixel coordinate to the 100-unit SVG viewbox space
        if (previewWindowPixelSize === VIEWBOX_SIZE) return px; // Fallback if size isn't yet measured
        return (px / previewWindowPixelSize) * VIEWBOX_SIZE;
    };
    
    // Handler to get the actual pixel dimensions of the preview window
    const handleLayout = (event) => {
        const { width } = event.nativeEvent.layout;
        setPreviewWindowPixelSize(width);
    };

    // --- FIX: Initialize eggVertices[0].y with the ABSOLUTE Y-COORDINATE (in 100-units) ---
    const [eggVertices, setEggVertices] = useState([
        { 
            x: VIEWBOX_SIZE / 2,          
            y: EGG_VIEWBOX_BASE_Y - initialCustomization.shape.hy // Convert height dimension to absolute Y coordinate
        }, 
        { 
            x: VIEWBOX_SIZE / 2 + initialCustomization.shape.wx / 2, 
            y: initialCustomization.shape.wy // This is already the waist Y coordinate
        }, 
    ]);

    // --- State to track which vertex is being dragged ---
    const [draggedVertexIndex, setDraggedVertexIndex] = useState(null);

    const [status, setStatus] = useState('Customize your avatar.');
    const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);

    // Get the shape object from customization
    const { shape } = customization;

    /**
     * Finds the index of the vertex near the given coordinates (in VIEWBOX units).
     */
    const getActiveVertext = (unitX, unitY) => {
        const threshold = 5; // Use a small threshold in 100-unit space
        for (let i = 0; i < eggVertices.length; i++){
            const vertex = eggVertices[i];
            const distance = Math.sqrt( (unitX - vertex.x)**2 + (unitY - vertex.y)**2);
            if (distance <= threshold) {
                return i;
            }
        }
        return null; // Return null if no vertex is active
    };

    /**
     * Centralized function to handle dragging of vertices on the SVG.
     */
    const handleShapeUpdate = (event) => {
        // 1. Convert pixel event coordinates to 100-unit coordinates
        const unitX = pixelToUnit(event.nativeEvent.locationX);
        const unitY = pixelToUnit(event.nativeEvent.locationY);
        
        let activeVertexIndex = draggedVertexIndex;

        // Start drag detection only on touch start event if we aren't already dragging
        if (event.type === 'touchstart' && activeVertexIndex === null) {
            activeVertexIndex = getActiveVertext(unitX, unitY);
            if (activeVertexIndex !== null) {
                setDraggedVertexIndex(activeVertexIndex);
            } else {
                return; // Not near a vertex, do not start drag
            }
        } else if (event.type === 'touchmove' && activeVertexIndex === null) {
             return; // Ignore move events if drag hasn't started
        }


        const updatedVertices = [...eggVertices];
        let newVertex = {};
        
        if (activeVertexIndex === 0) {
            // Index 0: Height/Top vertex (x is fixed at center)
            const minTopY = EGG_VIEWBOX_BASE_Y - MAX_HEIGHT; // Lowest Y (Tallest Egg)
            const maxTopY = EGG_VIEWBOX_BASE_Y - MIN_HEIGHT; // Highest Y (Shortest Egg)

            newVertex = {
                x: VIEWBOX_SIZE / 2,
                // Clamping Y on the 100-unit coordinate system
                y: Math.max(minTopY, Math.min(maxTopY, unitY)), 
            };
        } else if (activeVertexIndex === 1) {
            // Index 1: Width/Waist vertex (y is clamped, x determines width)
            // Use the current top vertex Y-coordinate (from state, not unitY, because unitY might be invalid)
            const topY = updatedVertices[0].y; 
            
            const minWaistX = WIDTH_VIEWBOX / 2 + MIN_WIDTH / 2;
            const maxWaistX = WIDTH_VIEWBOX / 2 + MAX_WIDTH / 2;

            // Clamping the Waist Y position relative to the current egg height
            const availableHeight = EGG_VIEWBOX_BASE_Y - topY;
            const minWaistY = topY + availableHeight * 0.15; // 15% down from the top
            const maxWaistY = EGG_VIEWBOX_BASE_Y - availableHeight * 0.15; // 15% up from the bottom

            newVertex = {
                // X: Clamping X (width)
                x: Math.max(minWaistX, Math.min(maxWaistX, unitX)),
                // Y: Clamping Y (waist position) 
                y: Math.max(minWaistY, Math.min(maxWaistY, unitY)),
            };
        }

        updatedVertices[activeVertexIndex] = newVertex;
        setEggVertices(updatedVertices);

        // 2. Update the customization state (shape.hy must be the height DIMENSION)
        setCustomization(prev => ({
            ...prev,
            shape: {
                ...prev.shape,
                // Convert Absolute Y-coordinate back to Height DIMENSION: BaseY - Absolute Y
                hy: EGG_VIEWBOX_BASE_Y - updatedVertices[0].y, 
                // wx is the width dimension (distance from center * 2)
                wx: (updatedVertices[1].x - WIDTH_VIEWBOX / 2) * 2, 
                // wy is the absolute Y coordinate
                wy: updatedVertices[1].y, 
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
                        onTouchStart={handleShapeUpdate} 
                        onTouchMove={handleShapeUpdate} 
                        onTouchEnd={releaseUpdate}
                    >
                        {/* Note: The EggPreviewSVG component definition provided in the prompt is correct and unchanged */}
                        <EggPreviewSVG 
                            //color={customization.color} 
                            shape={customization.shape} 
                            eggVertices={eggVertices} 
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
                            onPress={() => handleTypeChange('human')}
                            style={[styles.typeButton, customization.type === 'human' && styles.typeButtonActive]}
                        >
                            <Text style={[styles.typeButtonText, customization.type === 'human' && styles.typeButtonTextActive]}>HUMAN</Text>
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
