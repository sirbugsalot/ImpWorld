import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, TextInput, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

const { width } = Dimensions.get('window');

const primaryColor = '#1D4ED8'; 
const accentColor = '#10B981'; // Green for success/save
const backgroundColor = '#F9FAFB';

// Default state structure
const DEFAULT_CUSTOMIZATION = {
    type: 'egg',
    color: '#8A2BE2',
    shape: { width: 40, height: 60, waist: 30 } // Adjusted defaults for better ellipsoid shape
};

/**
 * AvatarCustomizer component allows users to modify the appearance of their avatar.
 */
const AvatarCustomizer = ({ initialCustomization, onSave, onCancel }) => {
    const [customization, setCustomization] = useState(initialCustomization || DEFAULT_CUSTOMIZATION);
    const [status, setStatus] = useState('Customize your avatar.');

    // --- Handlers ---
    const handleShapeChange = (key, newValue) => {
        // Clamp values within bounds
        const min = key === 'waist' ? 0 : 20;
        const max = key === 'waist' ? customization.shape.height : 80;
        let clampedValue = Math.max(min, Math.min(max, newValue));

        let newShape = { ...customization.shape, [key]: clampedValue };
        
        // Dependency check: Ensure waist does not exceed height
        if (key === 'height' && newShape.waist > clampedValue) {
            newShape.waist = clampedValue;
        }

        setCustomization(prev => ({ ...prev, shape: newShape }));
    };

    const handleColorChange = (e) => {
        // For React Native, text inputs pass the value directly
        setCustomization(prev => ({ ...prev, color: e.nativeEvent.text }));
    };

    const handleTypeChange = (type) => {
        setCustomization(prev => ({ ...prev, type }));
    };
    
    // --- Render Functions ---
    const renderEggPreview = () => {
        const { color, shape } = customization;
        // Scale the user-defined shape for preview purposes
        const PREVIEW_SCALE = 2.0; 
        const { width, height, waist } = shape;
        const previewWidth = width * PREVIEW_SCALE; 
        const previewHeight = height * PREVIEW_SCALE; 
        
        // Calculate dynamic border radius for asymmetric ellipsoid (egg/pear shape).
        // The 'waist' controls the ratio of the top vs. bottom curvature.
        const topCurvature = (waist / height) * 100; // 0 to 100
        const bottomCurvature = 100 - topCurvature;

        // Ensure a balanced, smooth transition for the four corners
        const radiusTop = `${topCurvature * 0.8}px ${topCurvature * 0.8}px`; // Top is narrower
        const radiusBottom = `${bottomCurvature * 0.4}px ${bottomCurvature * 0.4}px`; // Bottom is wider

        return (
            <View 
                style={[
                    styles.eggPreview, 
                    {
                        width: previewWidth,
                        height: previewHeight,
                        backgroundColor: color,
                        // This uses percentage-like values to create the asymmetric shape
                        borderTopLeftRadius: topCurvature * 1.5,
                        borderTopRightRadius: topCurvature * 1.5,
                        borderBottomLeftRadius: bottomCurvature * 1.5,
                        borderBottomRightRadius: bottomCurvature * 1.5,
                        // Ensure it's centered visually
                        marginBottom: (previewHeight / 4) * (bottomCurvature / 100 - topCurvature / 100) 
                    }
                ]}
            />
        );
    };

    /**
     * Renders a simulated slider control with +/- buttons.
     */
    const renderSlider = (key, min, max) => {
        const value = customization.shape[key];
        // Calculate percentage fill for the visual track
        const range = max - min;
        const percent = ((value - min) / range) * 100;
        
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
                        <Text style={styles.sliderButtonText}>-</Text>
                    </TouchableOpacity>
                    
                    {/* Visual Track (Simulated Slider Bar) */}
                    <View style={styles.mockSliderTrack}>
                        <View style={[styles.mockSliderFill, { width: `${percent}%` }]} />
                    </View>

                    {/* Increment Button (+) */}
                    <TouchableOpacity
                        onPress={() => handleShapeChange(key, value + 1)}
                        disabled={value >= max}
                        style={[styles.sliderButton, value >= max && styles.sliderButtonDisabled]}
                    >
                        <Text style={styles.sliderButtonText}>+</Text>
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

                {/* Type Selector */}
                <View style={styles.controlSection}>
                    <Text style={styles.controlTitle}>Avatar Type</Text>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity 
                          onPress={() => handleTypeChange('egg')}
                          style={[styles.typeButton, customization.type === 'egg' && styles.typeButtonActive]}
                        >
                            <Text style={[styles.typeButtonText, customization.type === 'egg' && styles.typeButtonTextActive]}>Egg/Ellipsoid</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          onPress={() => handleTypeChange('human')}
                          style={[styles.typeButton, customization.type === 'human' && styles.typeButtonActive]}
                        >
                            <Text style={[styles.typeButtonText, customization.type === 'human' && styles.typeButtonTextActive]}>Human (WIP)</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Egg Customization Controls */}
                {customization.type === 'egg' && (
                    <View style={styles.controlSection}>
                        <Text style={styles.controlTitle}>Ellipsoid Shape & Color</Text>
                        
                        {/* Color Input */}
                        <View style={styles.colorInputRow}>
                            <Text style={styles.sliderLabel}>Color:</Text>
                            <View style={[styles.colorSwatch, { backgroundColor: customization.color }]} />
                            <TextInput 
                              style={styles.colorTextInput}
                              value={customization.color} 
                              onChange={handleColorChange}
                              placeholder="#RRGGBB"
                              maxLength={7}
                            />
                        </View>

                        {/* Shape Sliders/Inputs */}
                        {renderSlider('width', 20, 80)}
                        {renderSlider('height', 20, 80)}
                        {/* Note: Max for waist is dynamic based on height */}
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
    },
    colorSwatch: {
        width: 30,
        height: 30,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: '#D1D5DB',
        marginHorizontal: 10,
    },
    colorTextInput: {
        flex: 1,
        padding: 8,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        fontSize: 16,
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
    sliderButtonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
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
    }
});

export default AvatarCustomizer;
