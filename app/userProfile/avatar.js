import React, { useState, useCallback, useMemo } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

const { width: screenWidth } = Dimensions.get('window');

const primaryColor = '#1D4ED8'; // Blue
const accentColor = '#10B981'; // Green
const backgroundColor = '#F9FAFB';

// Fixed set of colors for the palette picker
const COLOR_PALETTE = [
    '#8A2BE2', '#10B981', '#F59E0B', '#EF4444', 
    '#0EA5E9', '#EC4899', '#6B7280', '#FFD700',
];

const DEFAULT_CUSTOMIZATION = {
    type: 'egg',
    color: '#8A2BE2',
    shape: { width: 40, height: 60, waist: 30 } // Max: 80, Min: 20
};

// --- Helper Components for Sliders ---

/**
 * Reusable component for horizontal or vertical slider track interaction.
 */
const InteractiveSliderTrack = ({ parameterKey, value, min, max, orientation, handleUpdate, shapeHeight }) => {
    const [trackDimension, setTrackDimension] = useState(0);
    const isVertical = orientation === 'vertical';
    const range = max - min;
    
    // Convert value to a percentage position (0 to 100)
    const normalizedValue = ((value - min) / range) * 100;

    // Handler for direct sliding/tapping on the track
    const handleSlide = useCallback((e) => {
        if (!trackDimension) return;

        // Use locationY for vertical, locationX for horizontal
        const touchPos = isVertical ? e.nativeEvent.locationY : e.nativeEvent.locationX;
        const dimension = trackDimension;

        // Calculate normalized position (0 to 1)
        let normalizedPos = touchPos / dimension;
        
        // Vertical sliders often go from bottom (0) to top (1). Reverse if vertical.
        if (isVertical) {
            normalizedPos = 1 - normalizedPos; 
        }

        // Calculate new value based on normalized position
        let newValue = Math.round(min + normalizedPos * range);
        
        // Waist specific clamping (Waist cannot exceed height)
        if (parameterKey === 'waist') {
            newValue = Math.min(newValue, shapeHeight);
        }

        // Apply general clamping
        const clampedValue = Math.max(min, Math.min(max, newValue));

        handleUpdate(parameterKey, clampedValue);
    }, [trackDimension, isVertical, min, range, parameterKey, handleUpdate, shapeHeight, max]);

    const trackStyle = isVertical ? styles.verticalTrack : styles.horizontalTrack;
    const fillStyle = isVertical ? styles.verticalFill : styles.horizontalFill;
    const thumbStyle = isVertical ? styles.verticalThumb : styles.horizontalThumb;
    
    // Style for the fill and thumb position
    const fillPosition = isVertical 
        ? { height: `${normalizedValue}%`, alignSelf: 'flex-end' } // Grow from bottom
        : { width: `${normalizedValue}%` };

    const thumbPosition = isVertical 
        ? { bottom: `${normalizedValue}%`, transform: [{ translateY: normalizedValue === 100 ? 0 : 10 }] } // From bottom
        : { left: `${normalizedValue}%`, transform: [{ translateX: normalizedValue === 0 ? 0 : -10 }] }; // From left

    return (
        <View 
            style={[trackStyle, styles.interactiveTrackShadow]}
            onLayout={(e) => setTrackDimension(isVertical ? e.nativeEvent.layout.height : e.nativeEvent.layout.width)}
            onTouchStart={handleSlide} 
            onTouchMove={handleSlide}
        >
            {/* Fill Indicator */}
            <View style={[fillStyle, fillPosition]} />
            {/* Thumb Indicator */}
            <View style={[thumbStyle, thumbPosition]} />
        </View>
    );
};


/**
 * AvatarCustomizer component
 */
const AvatarCustomizer = ({ initialCustomization, onSave, onCancel }) => {
    const [customization, setCustomization] = useState(initialCustomization || DEFAULT_CUSTOMIZATION);
    const [status, setStatus] = useState('Customize your avatar.');
    const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);
    
    const { shape } = customization;

    // --- Core Handler ---
    const handleShapeUpdate = useCallback((key, newValue) => {
        // Clamp values within bounds (handled partially in InteractiveSliderTrack, but good to have here too)
        const min = key === 'waist' ? 0 : 20;
        const max = key === 'waist' ? shape.height : 80;
        const clampedValue = Math.max(min, Math.min(max, newValue));

        let newShape = { ...shape, [key]: clampedValue };
        
        // Ensure waist does not exceed height after update
        if (key === 'height' && newShape.waist > clampedValue) {
            newShape.waist = clampedValue;
        }

        setCustomization(prev => ({ ...prev, shape: newShape }));
    }, [shape]);

    const handleColorChange = (newColor) => {
        setCustomization(prev => ({ ...prev, color: newColor }));
        setIsColorPickerVisible(false);
    };
    
    // --- Render Functions ---

    /**
     * Renders the preview using dynamic border radii for an asymmetric ellipsoid.
     */
    const renderEggPreview = useMemo(() => {
        const { color, shape } = customization;
        const PREVIEW_SCALE = 2.0; 
        const { width, height, waist } = shape;
        const previewWidth = width * PREVIEW_SCALE; 
        const previewHeight = height * PREVIEW_SCALE; 
        
        // Waist ratio controls asymmetry (0 = pointy top, round bottom; 1 = round top, pointy bottom)
        const waistRatio = waist / height; 
        
        // Calculate dynamic radii based on waist ratio
        const majorRadius = previewWidth / 2;
        
        // Use a power function to make the change curve more dramatic (more egg-like)
        const topRadiusScale = Math.pow(waistRatio, 0.6) * 2;
        const bottomRadiusScale = Math.pow(1 - waistRatio, 0.6) * 2;

        const dynamicRadii = {
            borderTopLeftRadius: majorRadius * topRadiusScale,
            borderTopRightRadius: majorRadius * topRadiusScale,
            borderBottomLeftRadius: majorRadius * bottomRadiusScale,
            borderBottomRightRadius: majorRadius * bottomRadiusScale,
            // Fallback for sphere when waist == height/2
            borderRadius: waistRatio === 0.5 ? majorRadius : undefined, 
        };

        // Calculate the vertical position of the waist line for the internal indicator
        const waistLinePosition = `${(1 - waistRatio) * 100}%`;
        const waistLineTranslate = (1 - waistRatio * 2) * -5; // Compensate for visual centering

        return (
            <View style={styles.previewWindow}>
                <View 
                    style={[
                        styles.eggPreview, 
                        {
                            width: previewWidth,
                            height: previewHeight,
                            backgroundColor: color,
                            ...dynamicRadii,
                        }
                    ]}
                >
                    {/* Waist Indicator Line and Arrows */}
                    <View style={[styles.waistLine, { top: waistLinePosition, transform: [{ translateY: waistLineTranslate }] }]} />
                    
                    <View style={[styles.waistArrows, { top: waistLinePosition, transform: [{ translateY: waistLineTranslate }] }]}>
                        <Ionicons name="arrow-up" size={14} color="#4B5563" />
                        <Ionicons name="arrow-down" size={14} color="#4B5563" />
                    </View>
                </View>
                
                {/* Color Picker Trigger Icon (Hatched Circle) */}
                <TouchableOpacity style={styles.colorTriggerIcon} onPress={() => setIsColorPickerVisible(true)}>
                    <Ionicons name="color-palette-outline" size={24} color={primaryColor} />
                </TouchableOpacity>
            </View>
        );
    }, [customization]); // Re-render only when customization changes

    /**
     * Renders the simple modal-style color picker.
     */
    const renderColorPicker = () => (
        <View style={styles.colorPickerModal}>
            <View style={styles.colorPaletteGrid}>
                {COLOR_PALETTE.map((color, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[styles.paletteSwatch, { backgroundColor: color }]}
                        onPress={() => handleColorChange(color)}
                    >
                        {customization.color === color && (
                            <Ionicons name="checkmark-circle" size={20} color="white" style={styles.checkmarkIcon} />
                        )}
                    </TouchableOpacity>
                ))}
            </View>
            <TouchableOpacity onPress={() => setIsColorPickerVisible(false)} style={styles.colorPickerCloseButton}>
                <Text style={styles.colorPickerCloseText}>Close</Text>
            </TouchableOpacity>
        </View>
    );
    
    // A simplified slider for Waist control, keeping the touch interactivity.
    const renderWaistSlider = (min, max) => {
        const value = shape.waist;
        return (
            <View style={styles.waistSliderContainer}>
                <Text style={styles.sliderLabel}>Waist Position: {value}</Text>
                <View style={styles.sliderControlRow}>
                    {/* Minus button for fine tuning */}
                    <TouchableOpacity
                        onPress={() => handleShapeUpdate('waist', value - 1)}
                        disabled={value <= min}
                        style={[styles.smallButton, value <= min && styles.sliderButtonDisabled]}
                    >
                        <Ionicons name="remove-outline" size={20} color="white" />
                    </TouchableOpacity>

                    {/* Interactive Track for dragging */}
                    <InteractiveSliderTrack
                        parameterKey="waist"
                        value={value}
                        min={min}
                        max={max}
                        orientation="horizontal"
                        handleUpdate={handleShapeUpdate}
                        shapeHeight={shape.height}
                    />

                    {/* Plus button for fine tuning */}
                    <TouchableOpacity
                        onPress={() => handleShapeUpdate('waist', value + 1)}
                        disabled={value >= max}
                        style={[styles.smallButton, value >= max && styles.sliderButtonDisabled]}
                    >
                        <Ionicons name="add-outline" size={20} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };


    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onCancel}>
                    <Ionicons name="chevron-back" size={32} color={primaryColor} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Customize your avatar</Text>
                <View style={{ width: 32 }} />
            </View>
            
            <View style={styles.card}>
                <Text style={styles.statusText}>{status}</Text>
                
                {/* --- PREVIEW AREA AS PER SKETCH --- */}
                <View style={styles.previewArea}>
                    
                    {/* 1. Vertical Slider (Height) - LEFT */}
                    <View style={styles.verticalSliderWrapper}>
                        <InteractiveSliderTrack
                            parameterKey="height"
                            value={shape.height}
                            min={20}
                            max={80}
                            orientation="vertical"
                            handleUpdate={handleShapeUpdate}
                        />
                        <Text style={styles.sliderValueText}>H:{shape.height}</Text>
                    </View>

                    {/* 2. Egg Preview + Color Picker Icon */}
                    {renderEggPreview}
                    {isColorPickerVisible && renderColorPicker()}
                </View>
                
                {/* 3. Horizontal Slider (Width) - BOTTOM */}
                <View style={styles.horizontalSliderWrapper}>
                    <InteractiveSliderTrack
                        parameterKey="width"
                        value={shape.width}
                        min={20}
                        max={80}
                        orientation="horizontal"
                        handleUpdate={handleShapeUpdate}
                    />
                    <Text style={styles.sliderValueText}>W:{shape.width}</Text>
                </View>

                {/* Waist Control (Below the main visual area) */}
                {renderWaistSlider(0, shape.height)}


                {/* --- TYPE SELECTOR AND SAVE --- */}
                
                <View style={styles.controlSection}>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity 
                          onPress={() => setCustomization(prev => ({ ...prev, type: 'egg' }))}
                          style={[styles.typeButton, customization.type === 'egg' && styles.typeButtonActive]}
                        >
                            <Text style={[styles.typeButtonText, customization.type === 'egg' && styles.typeButtonTextActive]}>EGG</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          onPress={() => setCustomization(prev => ({ ...prev, type: 'human' }))}
                          style={[styles.typeButton, customization.type === 'human' && styles.typeButtonActive]}
                        >
                            <Text style={[styles.typeButtonText, customization.type === 'human' && styles.typeButtonTextActive]}>HUMAN</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Save Button */}
                <TouchableOpacity 
                  onPress={() => {
                      setStatus('Customization saved locally!');
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: backgroundColor,
    },
    contentContainer: {
        paddingTop: Platform.OS === 'android' ? 30 : 50,
        paddingBottom: 40,
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: screenWidth * 0.9,
        marginBottom: 20,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: primaryColor,
    },
    card: {
        width: screenWidth * 0.9,
        maxWidth: 500,
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    statusText: {
        fontSize: 16,
        fontWeight: '600',
        color: primaryColor,
        textAlign: 'center',
        marginBottom: 20,
    },
    
    // --- SKETCH LAYOUT STYLES ---
    previewArea: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    verticalSliderWrapper: {
        height: 200, // Fixed height for vertical slider
        marginRight: 10,
        alignItems: 'center',
    },
    previewWindow: {
        width: 140, // Fixed size for the frame
        height: 200, // Fixed height for the frame
        backgroundColor: '#F3F4F6',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        position: 'relative',
    },
    eggPreview: {
        borderWidth: 2,
        borderColor: '#4B5563',
        // Dynamic border radius applied in JS
    },
    colorTriggerIcon: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'white',
        padding: 5,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    horizontalSliderWrapper: {
        width: 140, // Match preview window width
        alignSelf: 'center',
        marginTop: 5,
        alignItems: 'center',
    },
    sliderValueText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#4B5563',
        marginTop: 5,
    },
    waistLine: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: '#4B5563',
        opacity: 0.5,
    },
    waistArrows: {
        position: 'absolute',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: 40,
        alignSelf: 'center',
    },

    // --- SLIDER TRACK STYLES ---
    interactiveTrackShadow: {
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    verticalTrack: {
        width: 10,
        height: '100%',
        backgroundColor: '#E5E7EB',
        borderRadius: 5,
        position: 'relative',
    },
    verticalFill: {
        width: 10,
        backgroundColor: accentColor,
        position: 'absolute',
        bottom: 0,
        borderRadius: 5,
    },
    verticalThumb: {
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: primaryColor,
        borderWidth: 3,
        borderColor: 'white',
        position: 'absolute',
        left: -4,
    },
    horizontalTrack: {
        flex: 1,
        height: 10,
        backgroundColor: '#E5E7EB',
        borderRadius: 5,
        position: 'relative',
    },
    horizontalFill: {
        height: 10,
        backgroundColor: accentColor,
        borderRadius: 5,
        position: 'absolute',
    },
    horizontalThumb: {
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: primaryColor,
        borderWidth: 3,
        borderColor: 'white',
        position: 'absolute',
        top: -4,
    },
    
    // --- WAIST SLIDER STYLES (Kept separate with buttons) ---
    waistSliderContainer: {
        paddingVertical: 15,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        marginTop: 10,
    },
    sliderLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#4B5563',
        marginBottom: 8,
    },
    sliderControlRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    smallButton: {
        width: 30,
        height: 30,
        backgroundColor: primaryColor,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sliderButtonDisabled: {
        backgroundColor: '#D1D5DB',
    },

    // --- GENERAL CONTROL STYLES ---
    controlSection: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 15,
    },
    typeButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#E5E7EB',
        marginHorizontal: 5,
    },
    typeButtonActive: {
        backgroundColor: primaryColor,
    },
    typeButtonText: {
        textAlign: 'center',
        fontWeight: '700',
        color: '#4B5563',
        letterSpacing: 1,
    },
    typeButtonTextActive: {
        color: 'white',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    actionButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    
    // --- COLOR PICKER STYLES ---
    colorPickerModal: {
        position: 'absolute',
        top: 40,
        right: 0,
        width: 180,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 5,
        elevation: 8,
        zIndex: 100, 
    },
    colorPaletteGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    paletteSwatch: {
        width: 35,
        height: 35,
        borderRadius: 17.5,
        margin: 4,
        borderWidth: 2,
        borderColor: '#D1D5DB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkmarkIcon: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 10,
    },
    colorPickerCloseButton: {
        padding: 5,
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        marginTop: 5,
    },
    colorPickerCloseText: {
        color: '#4B5563',
        fontWeight: '600',
        fontSize: 12,
    }
});

export default AvatarCustomizer;
