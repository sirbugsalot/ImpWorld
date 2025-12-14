import React, { useState, useCallback } from 'react';
import { Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import Svg, { Path } from 'react-native-svg'; // FIX: Must include Svg and Path import if used in subcomponents

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

const AvatarCustomizer = ({ initialCustomization = DEFAULT_CUSTOMIZATION, onSave, onCancel }) => {
    
    // State for color and type
    const [customization, setCustomization] = useState(initialCustomization);

    // --- Renamed from eggDim to eggVertices for consistency ---
    const [eggVertices, setEggVertices] = useState([
        { x: VIEWBOX_SIZE / 2,          y: initialCustomization.shape.hy }, // Index 0: Height/Top vertex
        { x: VIEWBOX_SIZE / 2 + initialCustomization.shape.wx / 2, y: initialCustomization.shape.wy }, // Index 1: Width/Waist vertex
    ]);

    // --- State to track which vertex is being dragged ---
    const [draggedVertexIndex, setDraggedVertexIndex] = useState(null);

    // --- Initialized customization correctly, removing stray 'z' ---
    // const [customization, setCustomization] = useState(initialCustomization || DEFAULT_CUSTOMIZATION);
    const [status, setStatus] = useState('Customize your avatar.');
    const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);

    // --- Removed incorrect destructuring: const { shape } = eggDim; ---
    // Use customization.shape where needed, but the dragging logic operates directly on eggVertices.

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
                y: Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, locationY)), // Clamping Y
            };
        } else if (activeVertexIndex === 1) {
            // Index 1: Width/Waist vertex (y is clamped, x determines width)
            const topY = eggVertices[0].y;
            newVertex = {
                // X: Clamping X (width)
                x: Math.max(WIDTH_VIEWBOX / 2 + MIN_WIDTH / 2, Math.min(WIDTH_VIEWBOX / 2 + MAX_WIDTH / 2, locationX)),
                // Y: Clamping Y (waist position) to be within 15% to 85% of the height (relative to the bottom 100)
                y: Math.max(topY + (VIEWBOX_SIZE - topY) * 0.15, Math.min(topY + (VIEWBOX_SIZE - topY) * 0.85, locationY)),
            };
        }

        updatedVertices[activeVertexIndex] = newVertex;
        setEggVertices(updatedVertices);

        // Also update the customization state which controls the component logic
        setCustomization(prev => ({
            ...prev,
            shape: {
                ...prev.shape,
                hy: updatedVertices[0].y, // Height (Y-coord of top vertex)
                wx: (updatedVertices[1].x - WIDTH_VIEWBOX / 2) * 2, // Width (distance from center * 2)
                wy: updatedVertices[1].y, // Waist position (Y-coord of waist vertex)
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
                    {/* The handleShapeUpdate will now check if a vertex is being dragged or if a touch starts near one. */}
                    <View 
                        style={styles.previewWindow} 
                        // Using onTouchMove and onTouchEnd for interactive dragging
                        onTouchMove={handleShapeUpdate} 
                        onTouchEnd={releaseUpdate}
                    >
                        {/* FIX: Pass the state shape, not the default, so it updates */}
                        {/* The shape object now reflects changes from eggVertices state */}
                        <EggPreviewSVG color={customization.color} shape={customization.shape} eggVertices={eggVertices} /> 
                        
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