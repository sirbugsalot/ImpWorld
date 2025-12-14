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
    MAX_HEIGHT, MAX_WIDTH, MIN_WIDTH, MIN_HEIGHT, 
    primaryColor, 
    accentColor 
} from './src/constants';
import { styles } from './src/styles/avatarStyles';

const AvatarCustomizer = ({ initialCustomization = DEFAULT_CUSTOMIZATION, onSave, onCancel }) => {
    
    // State for color and type
    const [customization, setCustomization] = useState(initialCustomization);

    // State for the two draggable vertices (coordinates in VIEWBOX units 0-100)
    const [eggVertices, setEggVertices] = useState([
        { x: VIEWBOX_SIZE / 2,          y: initialCustomization.hy }, // Index 0: Height/Top vertex
        { x: VIEWBOX_SIZE / 2 + initialCustomization.wx/2,   y: initialCustomization.wy }, // Index 1: Width/Waist vertex
    ]);


    // Note: If initialCustomization is null/undefined, use the default from constants
    z
    //const [customization, setCustomization] = useState(initialCustomization || DEFAULT_CUSTOMIZATION);
    const [status, setStatus] = useState('Customize your avatar.');
    const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);
    const { shape } = eggDim;
    //const { shape } = customization;

    /**
     * Centralized function to handle all shape dimension updates (Width, Height, Waist).
     */

    // const shapeWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, shape.wx)); // x coordinate of right edge
    // const shapeHeight = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, shape.hy)); // x,y coordinate of top edge
    // const shapeWaist = Math.max(shapeHeight*0.15, Math.min(shapeHeight*0.85, shape.wy));// Clip the width +/- 15% of current height.
    const getActiveVertext = (x, y) => {
        const threshold = 20;
        for (let i = 0; i < eggDim.length; i++){
            const vertex = eggDim[i];
            const distance = Math.sqrt( (x-vertex.x)**2 + (y-vertex.y)**2);
            if (distance <= threshold) {
                return i;
        }
    }

    const handleShapeUpdate = (event) => {
        const locationX = event.nativeEvent.locationX;
        const locationY = event.nativeEvent.locationY;
        
        let activeVertex;
        if (setDraggedVertexIndex == null) {
            activeVertex = getActiveVertext(locationX, locationY);
            setDraggedVertexIndex(activeVertex)
        }
        const updatedVertices = [...eggDim];
        updatedVertices[setDraggedVertexIndex] = activeVertex == 0 ? {
                x: WIDTH_VIEWBOX/2,
                y: Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, event.nativeEvent.locationY)),
        } : {
                x: Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, event.nativeEvent.locationX)),
                y: Math.max(eggDim[0].y*0.15, Math.min(eggDim[0].y*0.85, event.nativeEvent.locationY)),
        }
        setEggDim(updatedVertices);
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

                {/* 1. Vertical Slider (Height) */}
                {/* <View style={styles.verticalSliderWrapper}>
                    <InteractiveSliderTrack
                        parameterKey="height"
                        value={shape.height}
                        min={MIN_DIMENSION}
                        max={MAX_DIMENSION+50}
                        orientation="vertical"
                        handleUpdate={handleShapeUpdate}
                    />
                    <Text style={styles.sliderValueText}>H:{shape.height}%</Text>
                </View> */}

                {/* 2. Horizontal Slider (Width) */}
                {/* <View style={styles.horizontalSliderWrapper}>
                    <InteractiveSliderTrack
                        parameterKey="width"
                        value={shape.width}
                        min={MIN_DIMENSION}
                        max={MAX_DIMENSION+50}
                        orientation="horizontal"
                        handleUpdate={handleShapeUpdate}
                    />
                    <Text style={styles.sliderLabel}>Width: {shape.width}%</Text>
                </View> */}
                
                {/* --- PREVIEW AREA (Vertical Slider + Egg) --- */}
                <View style={styles.previewArea}>

                    {/* 3. Egg Preview Window (Holds Egg and Color Picker Icon) */}
                    <View style={styles.previewWindow} onTouchMove={handleShapeUpdate} onTouchEnd={releaseUpdate}>

                        {/* FIX: Pass the state shape, not the default, so it updates */}
                        <EggPreviewSVG color={customization.color} shape={customization.shape} /> 
                        
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
                
                {/* Waist Control */}
                {/* WaistSlider needs to be placed correctly, assuming it's horizontal here */}
                {/* <WaistSlider shape={shape} handleShapeUpdate={handleShapeUpdate} /> */}


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
