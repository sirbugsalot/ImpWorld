import React, { useState, useCallback } from 'react';
import { Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

// Import modular components from src/
import InteractiveSliderTrack from './src/components/InteractiveSliderTrack';
import EggPreviewSVG from './src/components/EggPreviewSVG';
import ColorPicker from './src/components/ColorPicker';
import WaistSlider from './src/components/WaistSlider';

// Import constants and styles from src/
import { 
    DEFAULT_CUSTOMIZATION, 
    MIN_DIMENSION, 
    MAX_DIMENSION, 
    primaryColor, 
    accentColor 
} from './src/constants';
import { styles } from './src/styles/avatarStyles';

const AvatarCustomizer = ({ initialCustomization, onSave, onCancel }) => {
    // Note: If initialCustomization is null/undefined, use the default from constants
    const [customization, setCustomization] = useState(initialCustomization || DEFAULT_CUSTOMIZATION);
    const [status, setStatus] = useState('Customize your avatar.');
    const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);
    
    const { shape } = customization;

    /**
     * Centralized function to handle all shape dimension updates (Width, Height, Waist).
     */
    const handleShapeUpdate = useCallback((key, newValue) => {
        const min = key === 'waist' ? 0 : MIN_DIMENSION;
        const max = MAX_DIMENSION; 

        // Apply general clamping
        const clampedValue = Math.max(min, Math.min(max, newValue));

        let newShape = { ...shape, [key]: clampedValue };
        
        // Ensure waist does not exceed height after height update
        if (key === 'height' && newShape.waist > clampedValue) {
            newShape.waist = clampedValue;
        }

        setCustomization(prev => ({ ...prev, shape: newShape }));
    }, [shape]);

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
                
                {/* --- PREVIEW AREA (Vertical Slider + Egg) --- */}
                <View style={styles.previewArea}>
                    
                    {/* 1. Vertical Slider (Height) */}
                    <View style={styles.verticalSliderWrapper}>
                        <InteractiveSliderTrack
                            parameterKey="height"
                            value={shape.height}
                            min={MIN_DIMENSION}
                            max={MAX_DIMENSION}
                            orientation="vertical"
                            handleUpdate={handleShapeUpdate}
                        />
                        <Text style={styles.sliderValueText}>H:{shape.height}</Text>
                    </View>

                    {/* 2. Egg Preview Window (Holds Egg and Color Picker Icon) */}
                    {/* FIX 2: Color icon is now positioned relative to this window */}
                    <View style={styles.previewWindow}>
                        <EggPreviewSVG color={customization.color} shape={shape} />
                        
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
                
                {/* 3. Horizontal Slider (Width) */}
                {/* FIX 3: Using horizontalSliderContainer to ensure the slider is wider */}
                <View style={styles.horizontalSliderContainer}>
                    <Text style={styles.sliderLabel}>Width: {shape.width}</Text>
                    <View style={styles.horizontalSliderWrapper}>
                        <InteractiveSliderTrack
                            parameterKey="width"
                            value={shape.width}
                            min={MIN_DIMENSION}
                            max={MAX_DIMENSION}
                            orientation="horizontal"
                            handleUpdate={handleShapeUpdate}
                        />
                    </View>
                </View>

                {/* Waist Control */}
                <WaistSlider shape={shape} handleShapeUpdate={handleShapeUpdate} />


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

