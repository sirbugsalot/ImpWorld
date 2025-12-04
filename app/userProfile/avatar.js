import React, { useState, useCallback, useMemo } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
// Use react-native-svg for precise, mathematically driven shapes
import Svg, { Path } from 'react-native-svg';

const { width: screenWidth } = Dimensions.get('window');

const primaryColor = '#1D4ED8'; // Blue
const accentColor = '#10B981'; // Green
const backgroundColor = '#F9FAFB';

// Fixed set of colors for the palette picker
const COLOR_PALETTE = [
    '#8A2BE2', '#10B981', '#F59E0B', '#EF4444', 
    '#0EA5E9', '#EC4899', '#6B7280', '#FFD700',
];

const MIN_DIMENSION = 20;
const MAX_DIMENSION = 80; 
const PREVIEW_SCALE = 2.0; // Increased scale factor for better visibility

// UI Constants for enhanced usability
const TRACK_THICKNESS = 16;
const THUMB_SIZE = 24;

const DEFAULT_CUSTOMIZATION = {
    type: 'egg',
    color: '#8A2BE2',
    shape: { width: 40, height: 60, waist: 30 }
};

// --- Helper Components for Sliders ---

/**
 * Reusable component for horizontal or vertical slider track interaction.
 */
const InteractiveSliderTrack = ({ parameterKey, value, min, max, orientation, handleUpdate, shapeHeight }) => {
    const [trackDimension, setTrackDimension] = useState(0);
    const isVertical = orientation === 'vertical';
    const range = max - min;
    
    // Normalize the value to a percentage position (0 to 100)
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

    // Calculate thumb translation based on its size (THUMB_SIZE / 2)
    const thumbTranslation = THUMB_SIZE / 2;
    const thumbPosition = isVertical 
        ? { bottom: `${normalizedValue}%`, transform: [{ translateY: normalizedValue === 100 ? 0 : thumbTranslation }] } 
        : { left: `${normalizedValue}%`, transform: [{ translateX: normalizedValue === 0 ? 0 : -thumbTranslation }] }; 

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
        const min = key === 'waist' ? 0 : MIN_DIMENSION;
        const max = MAX_DIMENSION; 

        // Apply general clamping
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

    const handleTypeChange = (type) => {
        setCustomization(prev => ({ ...prev, type }));
    };
    
    /**
     * Renders the egg preview using a geometrically calculated SVG path.
     * Geometry: Two half-ovals joined at the minor axis (Width).
     * Top half major axis = H - Waist. Bottom half major axis = Waist.
     */
    const renderEggPreview = useMemo(() => {
        const { color, shape } = customization;
        const { width, height, waist } = shape;
        
        // --- SCALING ---
        const previewWidth = width * PREVIEW_SCALE;
        const previewHeight = height * PREVIEW_SCALE;

        // --- SVG GEOMETRY CALCULATION ---
        
        // 1. Radii (in scaled pixels)
        const rx = previewWidth / 2;
        // Top Y-radius (Top Major Axis)
        const ryTop = (height - waist) * PREVIEW_SCALE; 
        // Bottom Y-radius (Bottom Major Axis)
        const ryBottom = waist * PREVIEW_SCALE; 
        
        // 2. Waist Line Position (Y-coordinate in the SVG viewbox)
        // The center of the SVG is (0, 0), so the top starts at -ryTop and the bottom ends at ryBottom.
        // The waist line (Minor Axis) is at Y=0.
        
        // 3. Viewbox and Translation
        // The total SVG height is ryTop + ryBottom.
        const svgHeight = ryTop + ryBottom;
        const viewBox = `0 0 ${previewWidth} ${svgHeight}`;
        
        // Path starts at the bottom center of the minor axis (Y=ryBottom)
        // Moves to the center of the left side (Y=ryBottom)
        // Arc 1 (Bottom Half): From left side to right side, using rx and ryBottom
        // Arc 2 (Top Half): From right side to left side, using rx and ryTop
        
        // Start point: Left center (0, ryBottom)
        const startX = 0;
        const startY = ryBottom;
        
        // Center point: Right center (previewWidth, ryBottom)
        const centerPointX = previewWidth;
        const centerPointY = ryBottom;
        
        // Top point: (previewWidth / 2, 0)
        
        // Path definition (M = MoveTo, A = ArcTo)
        const pathData = `
            M ${startX} ${startY}
            A ${rx} ${ryBottom} 0 0 1 ${centerPointX} ${centerPointY}
            A ${rx} ${ryTop} 0 0 1 ${startX} ${startY}
            Z
        `;
        
        // Waist line Y position relative to the shape container (0 to 100%)
        const waistRatio = waist / height; 
        const waistLinePosition = `${(height - waist) / height * 100}%`; 

        return (
            <View style={styles.previewWindow}>
                <Svg 
                    height={previewHeight}
                    width={previewWidth}
                    viewBox={viewBox} // Define the coordinate system relative to the total shape size
                    style={styles.eggSvg}
                >
                    <Path
                        d={pathData}
                        fill={color}
                        stroke="#4B5563"
                        strokeWidth="2"
                    />
                </Svg>
                
                {/* Waist Indicator Line (Rendered as a standard View on top of the SVG) */}
                <View 
                    style={[
                        styles.waistLine, 
                        { 
                            top: waistLinePosition, 
                            transform: [{ translateY: -1 }], 
                            width: previewWidth,
                        }
                    ]} 
                />
                
                {/* Color Picker Trigger Icon */}
                <TouchableOpacity style={styles.colorTriggerIcon} onPress={() => setIsColorPickerVisible(true)}>
                    <Ionicons name="color-palette-outline" size={24} color={primaryColor} />
                </TouchableOpacity>
            </View>
        );
    }, [customization]);

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
    
    // A simplified slider for Waist control, kept separate with buttons.
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
                
                {/* --- PREVIEW AREA --- */}
                <View style={styles.previewArea}>
                    
                    {/* 1. Vertical Slider (Height) - LEFT - Wider Target Area */}
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

                    {/* 2. Egg Preview + Color Picker Icon */}
                    {renderEggPreview}
                    {isColorPickerVisible && renderColorPicker()}
                </View>
                
                {/* 3. Horizontal Slider (Width) - BOTTOM - Taller Target Area */}
                <View style={styles.horizontalSliderWrapper}>
                    <InteractiveSliderTrack
                        parameterKey="width"
                        value={shape.width}
                        min={MIN_DIMENSION}
                        max={MAX_DIMENSION}
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
        height: 200, 
        marginRight: 20, 
        width: 40, 
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    previewWindow: {
        width: 180, 
        height: 200, 
        backgroundColor: '#F3F4F6',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        position: 'relative',
    },
    eggSvg: {
        // SVG element handles its own sizing
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
        width: 180, 
        alignSelf: 'center',
        marginTop: 15, 
        height: 40, 
        alignItems: 'center',
        justifyContent: 'center',
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

    // --- SLIDER TRACK STYLES (Enlarged) ---
    interactiveTrackShadow: {
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    verticalTrack: {
        width: TRACK_THICKNESS, 
        height: '100%',
        backgroundColor: '#E5E7EB',
        borderRadius: TRACK_THICKNESS / 2,
        position: 'relative',
    },
    verticalFill: {
        width: TRACK_THICKNESS,
        backgroundColor: accentColor,
        position: 'absolute',
        bottom: 0,
        borderRadius: TRACK_THICKNESS / 2,
    },
    verticalThumb: {
        width: THUMB_SIZE,
        height: THUMB_SIZE,
        borderRadius: THUMB_SIZE / 2,
        backgroundColor: primaryColor,
        borderWidth: 3,
        borderColor: 'white',
        position: 'absolute',
        left: -(THUMB_SIZE - TRACK_THICKNESS) / 2, 
    },
    horizontalTrack: {
        flex: 1,
        height: TRACK_THICKNESS, 
        backgroundColor: '#E5E7EB',
        borderRadius: TRACK_THICKNESS / 2,
        position: 'relative',
    },
    horizontalFill: {
        height: TRACK_THICKNESS,
        backgroundColor: accentColor,
        borderRadius: TRACK_THICKNESS / 2,
        position: 'absolute',
    },
    horizontalThumb: {
        width: THUMB_SIZE,
        height: THUMB_SIZE,
        borderRadius: THUMB_SIZE / 2,
        backgroundColor: primaryColor,
        borderWidth: 3,
        borderColor: 'white',
        position: 'absolute',
        top: -(THUMB_SIZE - TRACK_THICKNESS) / 2, 
    },
    
    // --- WAIST SLIDER STYLES ---
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
        width: 40, 
        height: 40, 
        backgroundColor: primaryColor,
        borderRadius: 8,
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
