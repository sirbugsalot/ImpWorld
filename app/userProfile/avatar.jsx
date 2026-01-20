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

// Consistent data structure for Cloud and Local State
const DEFAULT_CUSTOMIZATION = {
    type: 'egg',
    color: '#059669',        // Base Color
    patternId: null,         // Pattern Reference
    patternColor: '#FFFFFF', // Pattern Detail Color
    shape: { hy: 60, wx: 40, wy: 35 } // Shared geometry params
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

    // Fetch existing avatar on load
    useEffect(() => {
        const fetchAvatar = async () => {
            if (!auth.currentUser) {
                setIsLoading(false);
                return;
            }

            try {
                const avatarRef = doc(db, 'artifacts', appId, 'users', auth.currentUser.uid, 'settings', 'avatar');
                const docSnap = await getDoc(avatarRef);

                if (docSnap.exists()) {
                    setCustomization(docSnap.data());
                    setStatus('Cloud profile loaded.');
                }
            } catch (error) {
                console.error("Error fetching avatar:", error);
                setStatus('Local mode (load failed).');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAvatar();
    }, []);

    // Updated Save Logic
    const handleSaveToCloud = async () => {
        if (!auth.currentUser) {
            setStatus('Please log in (Guest) to sync cloud data.');
            return;
        }

        setIsSaving(true);
        setStatus('Transmitting to ImpWorld...');

        try {
            const avatarRef = doc(db, 'artifacts', appId, 'users', auth.currentUser.uid, 'settings', 'avatar');
            
            // Explicitly defining the structure to ensure world.jsx receives exactly what it needs
            const payload = {
                type: customization.type,
                color: customization.color,
                patternId: customization.patternId,
                patternColor: customization.patternColor,
                shape: customization.shape,
                lastUpdated: new Date().toISOString()
            };

            await setDoc(avatarRef, payload, { merge: true });

            setStatus('Cloud Sync Successful!');
            if (onSave) onSave(payload);
        } catch (error) {
            console.error("Error saving avatar:", error);
            setStatus('Sync error. Retrying later.');
        } finally {
            setIsSaving(false);
        }
    };

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
                    <Text style={dynamicStyles.headerTitle}>Imp Studio</Text>
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
                                <Ionicons name="cloud-done-outline" size={24} color="white" style={{ marginRight: 10 }} />
                                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>SYNC AVATAR</Text>
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

    
