import React, { useState, useCallback, useEffect } from 'react';
import { Text, View, TouchableOpacity, ScrollView, Platform, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

// Firebase imports
import { auth, db, appId } from '../src/config/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

import EggPreviewSVG from '../src/components/EggPreviewSVG';
import Imp from '../src/components/Imp'; // Import your new Imp component
import ColorPicker from '../src/components/ColorPicker';
import HamburgerMenu from '../src/components/HamburgerMenu';
import { useTheme } from '../src/context/ThemeContext';

const VIEWBOX_SIZE = 100;
const ACCENT_COLOR = '#10B981';

const DEFAULT_CUSTOMIZATION = {
    type: 'egg', // 'egg' or 'imp'
    color: '#8A2BE2',
    patternId: null,
    patternColor: '#FFFFFF',
    shape: { hy: 80, wx: 50, wy: 60 },
    pos: { x: 50, y: 80 },
    footLength: 1.0,
    eyeSize: 5,
    activeCategory: 'Body' // Controls which dots appear
};

const AvatarCustomizer = ({ onSave, onCancel }) => {
    const { isDarkMode, colors } = useTheme();

    const [customization, setCustomization] = useState(DEFAULT_CUSTOMIZATION);
    const [previewWindowPixelSize, setPreviewWindowPixelSize] = useState(VIEWBOX_SIZE);
    const [status, setStatus] = useState('Select a part to begin research.');
    const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchAvatar = async () => {
            if (!auth.currentUser) { setIsLoading(false); return; }
            try {
                const avatarRef = doc(db, 'artifacts', appId, 'users', auth.currentUser.uid, 'settings', 'avatar');
                const docSnap = await getDoc(avatarRef);
                if (docSnap.exists()) {
                    setCustomization({ ...DEFAULT_CUSTOMIZATION, ...docSnap.data() });
                }
            } catch (error) {
                console.error("Error fetching avatar:", error);
            } finally { setIsLoading(false); }
        };
        fetchAvatar();
    }, []);

    const handleSaveToCloud = async () => {
        if (!auth.currentUser) { setStatus('Please log in to sync.'); return; }
        setIsSaving(true);
        try {
            const avatarRef = doc(db, 'artifacts', appId, 'users', auth.currentUser.uid, 'settings', 'avatar');
            const payload = { ...customization, lastUpdated: new Date().toISOString() };
            await setDoc(avatarRef, payload, { merge: true });
            setStatus('Research Synced!');
            if (onSave) onSave(payload);
        } catch (error) {
            setStatus('Sync error.');
        } finally { setIsSaving(false); }
    };

    const handleLayout = (event) => setPreviewWindowPixelSize(event.nativeEvent.layout.width);

    const categories = ['Body', 'Feet', 'Arms', 'Face', 'Accessories'];

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
            alignSelf: 'center',
            position: 'relative'
        },
        categoryScroll: { marginVertical: 15, paddingLeft: 5 },
        categoryBtn: { 
            paddingHorizontal: 16, 
            paddingVertical: 8, 
            borderRadius: 20, 
            marginRight: 10,
            borderWidth: 1,
            borderColor: colors.border
        },
        categoryBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
        categoryText: { fontWeight: '600', color: colors.text },
        categoryTextActive: { color: 'white' },
        typeSelector: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: 10 },
        typeBtn: { padding: 10, borderRadius: 10, borderWidth: 1, borderColor: colors.border }
    });

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <ScrollView style={dynamicStyles.container}>
                <View style={dynamicStyles.header}>
                    <TouchableOpacity onPress={onCancel}><Ionicons name="chevron-back" size={32} color={colors.primary} /></TouchableOpacity>
                    <Text style={dynamicStyles.headerTitle}>Imp Studio</Text>
                    <TouchableOpacity onPress={() => setIsMenuOpen(true)}><Ionicons name="menu" size={32} color={colors.primary} /></TouchableOpacity>
                </View>

                <View style={dynamicStyles.typeSelector}>
                    {['egg', 'imp'].map(t => (
                        <TouchableOpacity 
                            key={t}
                            style={[dynamicStyles.typeBtn, customization.type === t && { backgroundColor: colors.primary }]}
                            onPress={() => setCustomization(p => ({ ...p, type: t }))}
                        >
                            <Text style={{ color: customization.type === t ? 'white' : colors.text }}>{t.toUpperCase()}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                
                <View style={dynamicStyles.card}>
                    <View style={dynamicStyles.previewWindow} onLayout={handleLayout}>
                        {customization.type === 'egg' ? (
                            <EggPreviewSVG 
                                color={customization.color} 
                                shape={customization.shape} 
                                onShapeChange={(s) => setCustomization(p => ({ ...p, shape: s }))}
                            /> 
                        ) : (
                            <Imp 
                                customization={customization}
                                setCustomization={setCustomization}
                                activeCategory={customization.activeCategory}
                            />
                        )}
                    </View>

                    {customization.type === 'imp' && (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={dynamicStyles.categoryScroll}>
                            {categories.map(cat => (
                                <TouchableOpacity 
                                    key={cat} 
                                    style={[dynamicStyles.categoryBtn, customization.activeCategory === cat && dynamicStyles.categoryBtnActive]}
                                    onPress={() => setCustomization(p => ({ ...p, activeCategory: cat }))}
                                >
                                    <Text style={[dynamicStyles.categoryText, customization.activeCategory === cat && dynamicStyles.categoryTextActive]}>{cat}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    )}

                    <TouchableOpacity onPress={handleSaveToCloud} disabled={isSaving} style={[dynamicStyles.categoryBtn, { backgroundColor: ACCENT_COLOR, padding: 15, marginTop: 10, alignItems: 'center' }]}>
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>{isSaving ? 'TRANSMITTING...' : 'SYNC RESEARCH'}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {isMenuOpen && <HamburgerMenu onClose={() => setIsMenuOpen(false)} activeItems={['home', 'settings']} />}
        </View>
    );
};

export default AvatarCustomizer;

