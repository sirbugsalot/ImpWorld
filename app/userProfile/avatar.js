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
    shape: { width: 30, height: 40, waist: 20 }
};

/**
 * AvatarCustomizer component allows users to modify the appearance of their avatar.
 * It operates solely on local state and passes the final data via a callback.
 * * @param {object} initialCustomization - The starting avatar data (passed from ProfileScreen).
 * @param {function} onSave - Callback function to call when the user saves/enters the world.
 * @param {function} onCancel - Callback function to exit the customizer.
 */
const AvatarCustomizer = ({ initialCustomization, onSave, onCancel }) => {
    // Initialize state from props or use default if none provided
    const [customization, setCustomization] = useState(initialCustomization || DEFAULT_CUSTOMIZATION);
    const [status, setStatus] = useState('Customize your avatar.');

    // --- Handlers ---
    const handleShapeChange = (name, value) => {
        const newValue = parseInt(value, 10);
        let newShape = { ...customization.shape, [name]: newValue };
        
        // Ensure waist does not exceed height
        if (name === 'height' && newShape.waist > newValue) {
            newShape.waist = newValue;
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
        const PREVIEW_SCALE = 2.5; 
        const { width, height, waist } = shape;
        const previewWidth = width * PREVIEW_SCALE; 
        const previewHeight = height * PREVIEW_SCALE; 
        
        // Dynamic radius calculation for an egg shape
        const radiusFactor = 0.5;
        const topRadius = (waist < height / 2) ? width * radiusFactor * 1.5 : width * radiusFactor * 0.5;
        const bottomRadius = (waist > height / 2) ? width * radiusFactor * 1.5 : width * radiusFactor * 0.5;
        const minRadius = width * 0.2; 

        return (
            <View 
                style={[
                    styles.eggPreview, 
                    {
                        width: previewWidth,
                        height: previewHeight,
                        backgroundColor: color,
                        borderTopLeftRadius: Math.max(topRadius, minRadius),
                        borderTopRightRadius: Math.max(topRadius, minRadius),
                        borderBottomLeftRadius: Math.max(bottomRadius, minRadius),
                        borderBottomRightRadius: Math.max(bottomRadius, minRadius),
                    }
                ]}
            />
        );
    };

    const renderSlider = (key, min, max, isColor = false) => {
        const value = customization.shape[key];
        const percent = ((value - min) / (max - min)) * 100;
        
        // Note: React Native does not support dynamic range input styling like Web CSS. 
        // We will just use standard components for simplicity here.
        
        return (
            <View style={styles.sliderContainer} key={key}>
                <Text style={styles.sliderLabel}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
                </Text>
                {/* A simple mock slider representation in RN */}
                <View style={styles.mockSliderTrack}>
                    <View style={[styles.mockSliderFill, { width: `${percent}%` }]} />
                    <View style={[styles.mockSliderThumb, { left: `${percent}%` }]} />
                </View>
                {/* Since RN does not have a native slider component available in this environment, 
                    we will use a text input as a stand-in for easy value adjustment/testing. */}
                <TextInput
                    style={styles.numericInput}
                    keyboardType="numeric"
                    value={String(value)}
                    onChangeText={(text) => handleShapeChange(key, text)}
                />
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
                    <Text style={styles.previewTitle}>Live Preview</Text>
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
                            <Text style={[styles.typeButtonText, customization.type === 'egg' && styles.typeButtonTextActive]}>Egg</Text>
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
                        <Text style={styles.controlTitle}>Egg Shape & Color</Text>
                        
                        {/* Color Input */}
                        <View style={styles.colorInputRow}>
                            <Text style={styles.sliderLabel}>Color:</Text>
                            {/* Color preview circle based on state */}
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
                        {renderSlider('width', 20, 60)}
                        {renderSlider('height', 20, 60)}
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
        transition: 'all 300ms',
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
        marginBottom: 5,
    },
    mockSliderTrack: {
        height: 10,
        backgroundColor: '#D1D5DB',
        borderRadius: 5,
        position: 'relative',
        marginBottom: 5,
    },
    mockSliderFill: {
        height: 10,
        backgroundColor: accentColor,
        borderRadius: 5,
        position: 'absolute',
    },
    mockSliderThumb: {
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: primaryColor,
        position: 'absolute',
        top: -4,
        transform: [{ translateX: -9 }],
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 3,
    },
    numericInput: {
        padding: 8,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        fontSize: 16,
        textAlign: 'center',
        width: '100%',
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
