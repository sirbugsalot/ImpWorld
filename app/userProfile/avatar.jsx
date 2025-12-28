import React, { useState, useCallback, useEffect } from 'react';
import { Text, View, TouchableOpacity, ScrollView, Platform, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

// Firebase imports
import { auth, db, appId } from '../src/config/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

import EggPreviewSVG from '../src/components/EggPreviewSVG';
import ColorPicker from '../src/components/ColorPicker';
import HamburgerMenu from '../src/components/HamburgerMenu';
import { useTheme } from '../src/context/ThemeContext';

const VIEWBOX_SIZE = 100;
const ACCENT_COLOR = '#10B981';

const DEFAULT_CUSTOMIZATION = {
    type: 'egg',
    color: '#059669',        // Slot 1 (Base)
    patternId: null,         // Pattern ID
    patternColor: '#FFFFFF', // Slot 2 (Pattern)
    shape: { hy: 60, wx: 40, wy: 35 }
};

const AvatarCustomizer = ({ onSave, onCancel }) => {
    const { isDarkMode, colors } = useTheme();

    const [customization, setCustomization] = useState(DEFAULT_CUSTOMIZATION);
    const [previewWindowPixelSize, setPreviewWindowPixelSize] = useState(VIEWBOX_SIZE);
    const [status, setStatus] = useState('Drag the markers to shape your avatar.');
    const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // 1. Fetch existing avatar on load
    useEffect(() => {
        const fetchAvatar = async () => {
            if (!auth.currentUser) {
                setIsLoading(false);
                return;
            }

            try {
                // Rule 1 Path: artifacts/{appId}/users/{userId}/{collectionName}/{docId}
                const avatarRef = doc(db, 'artifacts', appId, 'users', auth.currentUser.uid, 'settings', 'avatar');
                const docSnap = await getDoc(avatarRef);

                if (docSnap.exists()) {
                    setCustomization(docSnap.data());
                    setStatus('Welcome back! Your avatar is loaded.');
                }
            } catch (error) {
                console.error("Error fetching avatar:", error);
                setStatus('Could not load saved avatar.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAvatar();
    }, []);

    // 2. Save logic to Firestore
    const handleSaveToCloud = async () => {
        if (!auth.currentUser) {
            setStatus('Please log in (Guest) to save to the cloud.');
            return;
        }

        setIsSaving(true);
        setStatus('Syncing with ImpWorld...');

        try {
            // Rule 1 Path
            const avatarRef = doc(db, 'artifacts', appId, 'users', auth.currentUser.uid, 'settings', 'avatar');
            
            // Save to Firestore
            await setDoc(avatarRef, {
                ...customization,
                lastUpdated: new Date().toISOString()
            }, { merge: true });

            setStatus('Saved to cloud!');
            if (onSave) onSave(customization);
        } catch (error) {
            console.error("Error saving avatar:", error);
            setStatus('Save failed. Check connection.');
        } finally {
            setIsSaving(false);
        }
    };

    // Coordinate mapping for touch events
    const convertPixelsToUnits = useCallback((pxX, pxY) => {
        if (previewWindowPixelSize === 0) return { unitX: pxX, unitY: pxY };
        let unitX = Math.max(0, Math.min(VIEWBOX_SIZE, (pxX / previewWindowPixelSize) * VIEWBOX_SIZE));
        let unitY = Math.max(0, Math.min(VIEWBOX_SIZE, (pxY / previewWindowPixelSize) * VIEWBOX_SIZE)); 
        return { unitX, unitY };
    }, [previewWindowPixelSize]);

    const handleLayout = (event) => setPreviewWindowPixelSize(event.nativeEvent.layout.width);

    const handleShapeUpdateFromSVG = useCallback((newShape) => {
        setCustomization(prev => ({ ...prev, shape: newShape }));
    }, []);

    // Color/Pattern Handlers
    const handleColorChange = (newColor) => setCustomization(prev => ({ ...prev, color: newColor }));
    const handlePatternColorChange = (newColor) => setCustomization(prev => ({ ...prev, patternColor: newColor }));
    const handlePatternChange = (newPatternId) => setCustomization(prev => ({ ...prev, patternId: newPatternId }));

    const dynamicStyles = StyleSheet.create({
        container: { flex: 1, backgroundColor: colors.background, paddingTop: Platform.OS === 'ios' ? 40 : 10 },
        header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
        headerTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text },
        card: { margin: 15, padding: 20, borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card },
        statusText: { textAlign: 'center', marginBottom: 15, fontStyle: 'italic', color: isDarkMode ? '#9CA3AF' : '#6B7280', fontSize: 14 },
        previewWindow: { 
            width: '90%', 
            aspectRatio: 1, 
            borderWidth: 1, 
            borderColor: colors.border, 
            borderRadius: 20, 
            backgroundColor: isDarkMode ? '#111827' : 'white', 
            overflow: 'hidden',
            alignSelf: 'center'
        },
        paletteButton: { 
            position: 'absolute', 
            top: 15, 
            right: 15, 
            backgroundColor: isDarkMode ? '#4B5563' : 'white', 
            padding: 10, 
            borderRadius: 25, 
            elevation: 4
        },
        actionButton: { 
            flexDirection: 'row', 
            justifyContent: 'center', 
            alignItems: 'center', 
            padding: 16, 
            borderRadius: 14, 
            marginTop: 20, 
            backgroundColor: ACCENT_COLOR,
            opacity: isSaving ? 0.7 : 1
        }
    });

    if (isLoading) {
        return (
            <View style={[dynamicStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={{ color: colors.text, marginTop: 10 }}>Fetching your avatar...</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <ScrollView style={dynamicStyles.container} contentContainerStyle={{ paddingBottom: 50 }}>
                <View style={dynamicStyles.header}>
                    <TouchableOpacity onPress={onCancel}>
                        <Ionicons name="chevron-back" size={32} color={colors.primary} />
                    </TouchableOpacity>
                    <Text style={dynamicStyles.headerTitle}>Customize Avatar</Text>
                    <TouchableOpacity onPress={() => setIsMenuOpen(true)}>
                        <Ionicons name="menu" size={32} color={colors.primary} />
                    </TouchableOpacity>
                </View>
                
                <View style={dynamicStyles.card}>
                    <Text style={dynamicStyles.statusText}>{status}</Text>

                    <View style={dynamicStyles.previewWindow} onLayout={handleLayout}>
                        <EggPreviewSVG 
                            color={customization.color} 
                            patternId={customization.patternId}
                            patternColor={customization.patternColor}
                            shape={customization.shape} 
                            onShapeChange={handleShapeUpdateFromSVG}
                            convertPixelsToUnits={convertPixelsToUnits}
                        /> 
                        
                        <TouchableOpacity 
                            style={dynamicStyles.paletteButton} 
                            onPress={() => setIsColorPickerVisible(true)}
                        >
                            <Ionicons name="color-palette" size={26} color={colors.primary} />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity 
                        onPress={handleSaveToCloud}
                        disabled={isSaving}
                        style={dynamicStyles.actionButton}
                    >
                        {isSaving ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <>
                                <Ionicons name="cloud-upload-outline" size={24} color="white" style={{ marginRight: 10 }} />
                                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>SAVE TO CLOUD</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {isColorPickerVisible && (
                <ColorPicker 
                    selectedColor={customization.color} 
                    patternColor={customization.patternColor}
                    selectedPattern={customization.patternId}
                    onColorChange={handleColorChange} 
                    onPatternColorChange={handlePatternColorChange}
                    onPatternChange={handlePatternChange}
                    onClose={() => setIsColorPickerVisible(false)} 
                />
            )}

            {isMenuOpen && (
                <HamburgerMenu 
                    onClose={() => setIsMenuOpen(false)} 
                    activeItems={['home', 'settings', 'auth']} 
                />
            )}
        </View>
    );
};

export default AvatarCustomizer;

