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
    type: 'egg',             // 'egg' or 'imp'
    color: '#059669',
    patternId: null,
    patternColor: '#FFFFFF',
    shape: { hy: 60, wx: 40, wy: 35 },
    footLength: 1.0,         // New param for Imp features
    activeCategory: 'BODY'   // Default category for dots
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
            if (!auth.currentUser) { setIsLoading(false); return; }
            try {
                const avatarRef = doc(db, 'artifacts', appId, 'users', auth.currentUser.uid, 'settings', 'avatar');
                const docSnap = await getDoc(avatarRef);
                if (docSnap.exists()) {
                    setCustomization(prev => ({ ...prev, ...docSnap.data() }));
                }
            } catch (error) {
                console.error("Error fetching avatar:", error);
            } finally { setIsLoading(false); }
        };
        fetchAvatar();
    }, []);

    const handleSaveToCloud = async () => {
        if (!auth.currentUser) return;
        setIsSaving(true);
        try {
            const avatarRef = doc(db, 'artifacts', appId, 'users', auth.currentUser.uid, 'settings', 'avatar');
            const payload = { ...customization, lastUpdated: new Date().toISOString() };
            await setDoc(avatarRef, payload, { merge: true });
            if (onSave) onSave(payload);
        } catch (error) {
            console.error(error);
        } finally { setIsSaving(false); }
    };

    const handleLayout = (event) => setPreviewWindowPixelSize(event.nativeEvent.layout.width);

    const dynamicStyles = StyleSheet.create({
        container: { flex: 1, backgroundColor: colors.background, paddingTop: Platform.OS === 'ios' ? 40 : 10 },
        header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
        headerTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text },
        card: { margin: 15, padding: 20, borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card },
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
        categoryContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 10,
            marginTop: 20,
            marginBottom: 10
        },
        categoryBtn: {
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: colors.border
        },
        activeCategoryBtn: {
            backgroundColor: colors.primary,
            borderColor: colors.primary
        },
        modeToggle: {
            backgroundColor: customization.type === 'imp' ? colors.primary : colors.border,
            padding: 12,
            borderRadius: 12,
            alignItems: 'center',
            marginBottom: 15
        }
    });

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <ScrollView style={dynamicStyles.container}>
                <View style={dynamicStyles.header}>
                    <TouchableOpacity onPress={onCancel}><Ionicons name="chevron-back" size={32} color={colors.primary} /></TouchableOpacity>
                    <Text style={dynamicStyles.headerTitle}>Imp Studio</Text>
                    <TouchableOpacity onPress={() => setIsMenuOpen(true)}><Ionicons name="menu" size={32} color={colors.primary} /></TouchableOpacity>
                </View>
                
                <View style={dynamicStyles.card}>
                    {/* The "Evolution" Toggle */}
                    <TouchableOpacity 
                        style={dynamicStyles.modeToggle}
                        onPress={() => setCustomization(p => ({ ...p, type: p.type === 'egg' ? 'imp' : 'egg' }))}
                    >
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>
                            {customization.type === 'egg' ? "EVOLVE TO IMP" : "REVERT TO EGG"}
                        </Text>
                    </TouchableOpacity>

                    <View style={dynamicStyles.previewWindow} onLayout={handleLayout}>
                        {/* We use EggPreviewSVG for everything, passing the Imp props when active */}
                        <EggPreviewSVG 
                            color={customization.color} 
                            patternId={customization.patternId}
                            patternColor={customization.patternColor}
                            shape={customization.shape} 
                            type={customization.type} // Tells SVG to show feet or not
                            footLength={customization.footLength}
                            activeCategory={customization.activeCategory} // Tells SVG which dots to show
                            onShapeChange={(newShape) => setCustomization(prev => ({ ...prev, shape: newShape }))}
                            onFootChange={(newLen) => setCustomization(prev => ({ ...prev, footLength: newLen }))}
                        /> 
                    </View>

                    {/* Sub-menu for Categories (Only if Imp) */}
                    {customization.type === 'imp' && (
                        <View style={dynamicStyles.categoryContainer}>
                            {['BODY', 'FEET'].map(cat => (
                                <TouchableOpacity 
                                    key={cat}
                                    style={[dynamicStyles.categoryBtn, customization.activeCategory === cat && dynamicStyles.activeCategoryBtn]}
                                    onPress={() => setCustomization(p => ({ ...p, activeCategory: cat }))}
                                >
                                    <Text style={{ color: customization.activeCategory === cat ? 'white' : colors.text, fontWeight: 'bold' }}>{cat}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    <TouchableOpacity 
                        onPress={handleSaveToCloud}
                        disabled={isSaving}
                        style={[dynamicStyles.categoryBtn, { backgroundColor: ACCENT_COLOR, marginTop: 20, alignItems: 'center', padding: 15 }]}
                    >
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>{isSaving ? 'SYNCING...' : 'SYNC AVATAR'}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

export default AvatarCustomizer;

