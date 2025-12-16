import React, { useState, useCallback } from 'react';
import { Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import Svg, { Path } from 'react-native-svg';

// Import modular components from src/
import EggPreviewSVG from './src/components/EggPreviewSVG';
import ColorPicker from './src/components/ColorPicker';

// Import constants and styles from src/
import { 
    DEFAULT_CUSTOMIZATION, 
    MAX_HEIGHT, MIN_HEIGHT, MAX_WIDTH, MIN_WIDTH, 
    WIDTH_VIEWBOX, EGG_VIEWBOX_BASE_Y,
    primaryColor, 
    accentColor,
    windowWidth // We need windowWidth to calculate the coordinate ratio
} from './src/constants';
import { styles } from './src/styles/avatarStyles';


const AvatarCustomizer = ({ initialCustomization = DEFAULT_CUSTOMIZATION, onSave, onCancel }) => {
    
    // State for color and type
    const [customization, setCustomization] = useState(initialCustomization);

    // --- Viewport/Pixel to Unit Conversion ---
    // This assumes the preview window is 90% wide (from styles.previewWindow) and centered.
    // We need the actual width of the drawing area (in pixels) for coordinate mapping.
    // Since the SVG is width="90%" of the View, let's assume the parent View is 80% of windowWidth.
    // The actual conversion factor needs to be calculated dynamically, but we will use a common factor
    // based on the assumption that the 100-unit viewbox maps to the pixel width of the preview window.
    
    // IMPORTANT: Assuming the previewWindow area has a fixed pixel width or its ratio is known.
    // If the style sheet defines the previewWindow width, you should use that. 
    // Since we don't have styles, we assume the preview window's pixel width is W_PIXEL.
    // For simplicity, let's calculate the conversion factor based on the style definition of `styles.previewWindow`. 
    // If it's a square container (W=H), the conversion factor is: W_PIXEL / 100. 
    // Since we don't have the style definition, we'll try to estimate the ratio based on screen width.

    // Calculate the ratio: Pixel width of the SVG drawing area / VIEWBOX_SIZE (100)
    // Assuming styles.previewWindow is 80% of windowWidth, and the SVG is 90% of that.
    const SVG_DRAWING_AREA_PIXEL_WIDTH = windowWidth * 0.8 * 0.9;
    const PIXEL_TO_UNIT_RATIO = SVG_DRAWING_AREA_PIXEL_WIDTH / VIEWBOX_SIZE;
    
    // We need the X offset (margin on the left side) of the SVG within the window
    // Assuming the preview window is centered:
    const PREVIEW_WINDOW_OFFSET_X = (windowWidth - (windowWidth * 0.8)) / 2; // Pixel offset of the preview card
    const SVG_OFFSET_X = PREVIEW_WINDOW_OFFSET_X + (windowWidth * 0.8 * 0.05); // Offset for the 90% wide SVG

    // Function to convert pixel location (from event) to 100-unit coordinate
    const pixelToUnitX = (px) => {
        // locationX is relative to the previewWindow parent View.
        // We need to map it to the 100-unit scale.
        // If the viewbox perfectly covers the View, it's a simple ratio:
        return (px / SVG_DRAWING_AREA_PIXEL_WIDTH) * VIEWBOX_SIZE;
    };

    const pixelToUnitY = (py) => {
        // Assuming the preview window height is also proportional to its width
        // If the preview window is a 1:1 aspect ratio view that contains the 100x100 SVG:
        return (py / SVG_DRAWING_AREA_PIXEL_WIDTH) * VIEWBOX_SIZE;
    };
    
    // --- FIX: Initialize eggVertices[0].y with the ABSOLUTE Y-COORDINATE (in 100-units) ---
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
        const unitX = pixelToUnitX(event.nativeEvent.locationX);
        const unitY = pixelToUnitY(event.nativeEvent.locationY);
        
        let activeVertexIndex = draggedVertexIndex;

        // If dragging hasn't started, try to find a vertex to start dragging
        if (activeVertexIndex === null) {
            activeVertexIndex = getActiveVertext(unitX, unitY);
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
            const minTopY = EGG_VIEWBOX_BASE_Y - MAX_HEIGHT; // Lowest Y (Tallest Egg)
            const maxTopY = EGG_VIEWBOX_BASE_Y - MIN_HEIGHT; // Highest Y (Shortest Egg)

            newVertex = {
                x: VIEWBOX_SIZE / 2,
                // Clamping Y on the 100-unit coordinate system
                y: Math.max(minTopY, Math.min(maxTopY, unitY)), 
            };
        } else if (activeVertexIndex === 1) {
            // Index 1: Width/Waist vertex (y is clamped, x determines width)
            const topY = updatedVertices[0].y; // Use the potentially updated Y coordinate of the top
            
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
                        onTouchStart={handleShapeUpdate} // Use touch start to begin drag tracking
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
