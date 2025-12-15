import React, { useState, useCallback } from 'react';
import { Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import Svg, { Path } from 'react-native-svg';

// Import modular components from src/
// NOTE: InteractiveSliderTrack, ColorPicker, and WaistSlider are not provided, 
// but are imported as placeholders. Assuming they are correct or stubbed out.
//import InteractiveSliderTrack from './src/components/InteractiveSliderTrack'; 
import EggPreviewSVG from './src/components/EggPreviewSVG';
import ColorPicker from './src/components/ColorPicker';
//import WaistSlider from './src/components/WaistSlider';

// Import constants and styles from src/
import { 
    DEFAULT_CUSTOMIZATION, 
    MAX_HEIGHT, MAX_WIDTH, MIN_WIDTH, MIN_HEIGHT, VIEWBOX_SIZE,
    primaryColor, 
    accentColor 
} from './src/constants';
import { styles } from './src/styles/avatarStyles';

// --- FIXED: Define missing constants ---
const WIDTH_VIEWBOX = VIEWBOX_SIZE;
const EGG_VIEWBOX_BASE_Y = 70; // Must be consistent with EggPreviewSVG.jsx logic

const AvatarCustomizer = ({ initialCustomization = DEFAULT_CUSTOMIZATION, onSave, onCancel }) => {
    
    // State for color and type
    const [customization, setCustomization] = useState(initialCustomization);

    // --- FIX: Initialize eggVertices[0].y with the ABSOLUTE Y-COORDINATE ---
    // The vertex position must be the coordinate, which is BaseY - Height_Dimension (hy)
    const [eggVertices, setEggVertices] = useState([
        { 
            x: VIEWBOX_SIZE / 2,          
            y: EGG_VIEWBOX_BASE_Y - initialCustomization.shape.hy // Use dimension to calculate coordinate
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
    const getActiveVertext = (x, y) => {
        const threshold = 15; // Adjusted threshold for better touch detection
        for (let i = 0; i < eggVertices.length; i++){
            const vertex = eggVertices[i];
            // Since x for vertex 0 is fixed at WIDTH_VIEWBOX/2, we only check y distance for index 0
            // and distance for index 1
            const distance = Math.sqrt( (x-vertex.x)**2 + (y-vertex.y)**2);
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
        const locationX = event.nativeEvent.locationX;
        const locationY = event.nativeEvent.locationY;
        
        let activeVertexIndex = draggedVertexIndex;

        // If dragging hasn't started, try to find a vertex to start dragging
        if (activeVertexIndex === null) {
            activeVertexIndex = getActiveVertext(locationX, locationY);
            if (activeVertexIndex !== null) {
                setDraggedVertexIndex(activeVertexIndex);
            } else {
                return; // Not dragging a vertex, so exit
            }
        }

        const updatedVertices = [...eggVertices];
        let newVertex = {};
        
        if (activeVertexIndex === 0) {
            // Index 0: Height/Top vertex (x is fixed at center)
            newVertex = {
                x: WIDTH_VIEWBOX / 2,
                // Clamping Y must ensure the egg is not too short or too tall based on MIN/MAX HEIGHT dimensions
                // Absolute Y coordinate = BaseY - Height Dimension
                // Clamping here is on the absolute Y-coordinate
                y: Math.max(EGG_VIEWBOX_BASE_Y - MAX_HEIGHT, Math.min(EGG_VIEWBOX_BASE_Y - MIN_HEIGHT, locationY)), 
            };
        } else if (activeVertexIndex === 1) {
            // Index 1: Width/Waist vertex (y is clamped, x determines width)
            const topY = eggVertices[0].y;
            newVertex = {
                // X: Clamping X (width)
                x: Math.max(WIDTH_VIEWBOX / 2 + MIN_WIDTH / 2, Math.min(WIDTH_VIEWBOX / 2 + MAX_WIDTH / 2, locationX)),
                // Y: Clamping Y (waist position) relative to the top (topY) and bottom (VIEWBOX_SIZE)
                // Using 15% and 85% of the TOTAL available height (BaseY - TopY)
                y: Math.max(topY + (EGG_VIEWBOX_BASE_Y - topY) * 0.15, Math.min(topY + (EGG_VIEWBOX_BASE_Y - topY) * 0.85, locationY)),
            };
        }

        updatedVertices[activeVertexIndex] = newVertex;
        setEggVertices(updatedVertices);

        // --- FIX: Update the customization state (shape.hy must be the height DIMENSION) ---
        setCustomization(prev => ({
            ...prev,
            shape: {
                ...prev.shape,
                // Convert Absolute Y-coordinate back to Height DIMENSION: BaseY - Absolute Y
                hy: EGG_VIEWBOX_BASE_Y - updatedVertices[0].y, 
                // wx is still the width dimension
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
                        onTouchMove={handleShapeUpdate} 
                        onTouchEnd={releaseUpdate}
                    >
                        <EggPreviewSVG 
                            color={customization.color} 
                            shape={customization.shape} 
                            eggVertices={eggVertices} 
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
