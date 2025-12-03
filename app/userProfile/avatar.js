import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, TextInput, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

const { width } = Dimensions.get('window');

const primaryColor = '#1D4ED8'; 
const accentColor = '#10B981'; 
const backgroundColor = '#F9FAFB';

// Fixed set of colors for the palette picker
const COLOR_PALETTE = [
    '#8A2BE2', // Blue Violet (Default)
    '#10B981', // Emerald
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#0EA5E9', // Sky Blue
    '#EC4899', // Pink
    '#6B7280', // Gray
    '#FFD700', // Gold
];

const DEFAULT_CUSTOMIZATION = {
    type: 'egg',
    color: '#8A2BE2',
    shape: { width: 40, height: 60, waist: 30 }
};

/**
 * AvatarCustomizer component allows users to modify the appearance of their avatar.
 */
const AvatarCustomizer = ({ initialCustomization, onSave, onCancel }) => {
    const [customization, setCustomization] = useState(initialCustomization || DEFAULT_CUSTOMIZATION);
    const [status, setStatus] = useState('Customize your avatar.');
    const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);

    // --- Core Handler ---
    const updateCustomization = useCallback((key, newValue) => {
        let newShape = { ...customization.shape, [key]: newValue };
        
        // Dependency check: Ensure waist does not exceed height
        if (key === 'height' && newShape.waist > newValue) {
            newShape.waist = newValue;
        }

        setCustomization(prev => ({ ...prev, shape: newShape }));
    }, [customization.shape]);

    const handleShapeChange = useCallback((key, value) => {
        const min = key === 'waist' ? 0 : 20;
        const max = key === 'waist' ? customization.shape.height : 80;
        const clampedValue = Math.max(min, Math.min(max, value));
        updateCustomization(key, clampedValue);
    }, [customization.shape.height, updateCustomization]);

    const handleColorChange = (newColor) => {
        setCustomization(prev => ({ ...prev, color: newColor }));
        setIsColorPickerVisible(false);
    };
    
    // --- Render Functions ---

    /**
     * Renders the preview using dynamic border radii for an asymmetric ellipsoid.
     */
    const renderEggPreview = () => {
        const { color, shape } = customization;
        const PREVIEW_SCALE = 2.0; 
        const { width, height, waist } = shape;
        const previewWidth = width * PREVIEW_SCALE; 
        const previewHeight = height * PREVIEW_SCALE; 
        
        // Calculate the ratio of the "waist" point relative to the height (0 to 1)
        const waistRatio = waist / height; 
        
        // The top radius should be smaller (pointier) if waist is low (close to 0)
        // The bottom radius should be larger (rounder) if waist is high (close to 1)
        const topRadiusScale = waistRatio * 2.5;
        const bottomRadiusScale = (1 - waistRatio) * 2.5;

        // Use the scaled width for the primary curvature
        const majorRadius = previewWidth / 2;

        return (
            <View 
                style={[
                    styles.eggPreview, 
                    {
                        width: previewWidth,
                        height: previewHeight,
                        backgroundColor: color,
                        // Apply dynamic radii for smooth ellipsoid shape
                        borderTopLeftRadius: majorRadius * topRadiusScale,
                        borderTopRightRadius: majorRadius * topRadiusScale,
                        borderBottomLeftRadius: majorRadius * bottomRadiusScale,
                        borderBottomRightRadius: majorRadius * bottomRadiusScale,
                        // Center the object vertically for a more balanced look
                        transform: [{ translateY: (waistRatio - 0.5) * -10 }] 
                    }
                ]}
            />
        );
    };

    /**
     * Renders a custom touch-enabled slider bar with +/- buttons.
     */
    const renderSlider = (key, min, max) => {
        const value = customization.shape[key];
        const [trackWidth, setTrackWidth] = useState(0);
        const range = max - min;
        const percent = ((value - min) / range) * 100;
        
        // Handler for direct sliding/tapping on the track
        const handleSlide = (e) => {
            if (!trackWidth) return;

            // Get touch position relative to the track
            const touchX = e.nativeEvent.locationX;
            const normalizedX = touchX / trackWidth;

            // Calculate new value based on normalized position
            let newValue = Math.round(min + normalizedX * range);
            
            // Update the state
            handleShapeChange(key, newValue);
        };
        
        return (
            <View style={styles.sliderContainer} key={key}>
                <Text style={styles.sliderLabel}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
                </Text>
                
                <View style={styles.sliderControlRow}>
                    {/* Decrement Button (-) */}
                    <TouchableOpacity
                        onPress={() => handleShapeChange(key, value - 1)}
                        disabled={value <= min}
                        style={[styles.sliderButton, value <= min && styles.sliderButtonDisabled]}
                    >
                        <Ionicons name="remove-outline" size={24} color="white" />
                    </TouchableOpacity>
                    
                    {/* Interactive Slider Track */}
                    <View 
                        style={styles.mockSliderTrack}
                        onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
                        onTouchStart={handleSlide} // Tap to set value
                        onTouchMove={handleSlide} // Drag to set value
                    >
                        {/* Fill Indicator */}
                        <View style={[styles.mockSliderFill, { width: `${percent}%` }]} />
                        {/* Thumb Indicator (A small dot on top of the fill) */}
                        <View style={[styles.mockSliderThumb, { left: `${percent}%` }]} />
                    </View>

                    {/* Increment Button (+) */}
                    <TouchableOpacity
                        onPress={() => handleShapeChange(key, value + 1)}
                        disabled={value >= max}
                        style={[styles.sliderButton, value >= max && styles.sliderButtonDisabled]}
                    >
                        <Ionicons name="add-outline" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };
    
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


    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onCancel}>
                    <Ionicons name="chevron-back" size={32} color={primaryColor} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Avatar Customizer</Text>
                <View style={{ width: 32 }} />
            </View>
            
            <View style={styles.card}>
                <Text style={styles.statusText}>{status}</Text>

                {/* Preview Area */}
                <View style={styles.previewArea}>
                    <Text style={styles.previewTitle}>Live Ellipsoid Preview</Text>
                    <View style={styles.previewWindow}>
                        {renderEggPreview()}
                    </View>
                </View>

                {/* Type Selector (Unchanged) */}
                <View style={styles.controlSection}>
                    <Text style={styles.controlTitle}>Avatar Type</Text>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity 
                          onPress={() => handleTypeChange('egg')}
                          style={[styles.typeButton, customization.type === 'egg' && styles.typeButtonActive]}
                        >
                            <Text style={[styles.typeButtonText, customization.type === 'egg' && styles.typeButtonTextActive]}>Ellipsoid</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          onPress={() => handleTypeChange('human')}
                          style={[styles.typeButton, customization.type === 'human' && styles.typeButtonActive]}
                        >
                            <Text style={[styles.typeButtonText, customization.type === 'human' && styles.typeButtonTextActive]}>Human (WIP)</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Ellipsoid Customization Controls */}
                {customization.type === 'egg' && (
                    <View style={styles.controlSection}>
                        <Text style={styles.controlTitle}>Shape & Color</Text>
                        
                        {/* Color Input */}
                        <View style={styles.colorInputRow}>
                            <Text style={styles.sliderLabel}>Color:</Text>
                            <TouchableOpacity onPress={() => setIsColorPickerVisible(true)}>
                                {/* Color preview circle/button */}
                                <View style={[styles.colorSwatch, { backgroundColor: customization.color }]} />
                            </TouchableOpacity>
                            {/* Display hex code, but keep the TextInput hidden/removed as requested */}
                            <Text style={styles.colorHexText}>{customization.color}</Text>
                        </View>
                        
                        {/* Color Picker Modal */}
                        {isColorPickerVisible && renderColorPicker()}

                        {/* Shape Sliders/Inputs */}
                        {renderSlider('width', 20, 80)}
                        {renderSlider('height', 20, 80)}
                        {renderSlider('waist', 0, customization.shape.height)} 
                    </View>
                )}

                {/* Save and Enter Button */}
                <TouchableOpacity 
                  onPress={() => {
                      setStatus('Customization saved locally!');
                      onSave(customization);
                  }}
                  style={[styles.actionButton, { backgroundColor: accentColor }]}
                >
                    <Ionicons name="save-outline" size={24} color="white" style={{ marginRight: 10 }} />
                    <Text style={styles.actionButtonText}>Save & Enter World</Text>
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
        width: width * 0.9,
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
        width: width * 0.9,
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
    previewArea: {
        alignItems: 'center',
        marginBottom: 30,
        padding: 15,
        backgroundColor: '#F3F4F6',
        borderRadius: 10,
    },
    previewTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4B5563',
        marginBottom: 10,
    },
    previewWindow: {
        width: 140,
        height: 140,
        backgroundColor: 'white',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    eggPreview: {
        borderWidth: 2,
        borderColor: '#4B5563',
        // Note: borderRadius is set dynamically inside renderEggPreview
    },
    controlSection: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    controlTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 15,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
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
        fontWeight: '600',
        color: '#4B5563',
    },
    typeButtonTextActive: {
        color: 'white',
    },
    colorInputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        position: 'relative', // for modal positioning
    },
    colorSwatch: {
        width: 35,
        height: 35,
        borderRadius: 17.5,
        borderWidth: 2,
        borderColor: primaryColor,
        marginHorizontal: 10,
    },
    colorHexText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#4B5563',
        marginLeft: 10,
    },
    sliderContainer: {
        marginBottom: 15,
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
    sliderButton: {
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
    mockSliderTrack: {
        flex: 1,
        height: 10,
        backgroundColor: '#E5E7EB',
        borderRadius: 5,
        position: 'relative',
        marginHorizontal: 10,
        overflow: 'hidden',
    },
    mockSliderFill: {
        height: 10,
        backgroundColor: accentColor,
        borderRadius: 5,
        position: 'absolute',
    },
    mockSliderThumb: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: primaryColor,
        borderWidth: 3,
        borderColor: 'white',
        position: 'absolute',
        top: -5,
        transform: [{ translateX: -10 }],
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 3,
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
    },
    // --- Color Picker Styles ---
    colorPickerModal: {
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
        zIndex: 10, // Ensure it floats above other controls
    },
    colorPaletteGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    paletteSwatch: {
        width: 40,
        height: 40,
        borderRadius: 20,
        margin: 5,
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
        padding: 8,
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
    },
    colorPickerCloseText: {
        color: '#4B5563',
        fontWeight: '600',
    }
});

export default AvatarCustomizer;
