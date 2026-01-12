import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, ScrollView, Platform, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

import { auth, db, appId } from '../src/config/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

import Imp from '../src/components/Imp';
import ColorPicker from '../src/components/ColorPicker';
import { useTheme } from '../src/context/ThemeContext';

const DEFAULT_CUSTOMIZATION = {
    type: 'imp', 
    color: '#8A2BE2',
    shape: { hy: 80, wx: 50, wy: 60 },
    pos: { x: 50, y: 80 },
    footLength: 1.0,
    eyeSize: 5,
    activeCategory: 'Body' 
};

const AvatarCustomizer = ({ onSave, onCancel }) => {
    const { colors } = useTheme();
    const [customization, setCustomization] = useState(DEFAULT_CUSTOMIZATION);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchAvatar = async () => {
            if (!auth.currentUser) { setIsLoading(false); return; }
            const avatarRef = doc(db, 'artifacts', appId, 'users', auth.currentUser.uid, 'settings', 'avatar');
            const docSnap = await getDoc(avatarRef);
            if (docSnap.exists()) setCustomization(docSnap.data());
            setIsLoading(false);
        };
        fetchAvatar();
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        const avatarRef = doc(db, 'artifacts', appId, 'users', auth.currentUser.uid, 'settings', 'avatar');
        await setDoc(avatarRef, customization, { merge: true });
        setIsSaving(false);
        if (onSave) onSave(customization);
    };

    const categories = ['Body', 'Feet', 'Arms', 'Face', 'Accessories'];

    if (isLoading) return <ActivityIndicator style={{ flex: 1 }} />;

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onCancel}><Ionicons name="close" size={32} color={colors.text} /></TouchableOpacity>
                <Text style={[styles.title, { color: colors.text }]}>Imp Studio</Text>
                <View style={{ width: 32 }} />
            </View>

            <View style={styles.previewCard}>
                <Imp 
                    customization={customization} 
                    setCustomization={setCustomization} 
                    activeCategory={customization.activeCategory}
                />
            </View>

            {/* Sub-menu appearing above save button */}
            <View style={styles.controls}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
                    {categories.map(cat => (
                        <TouchableOpacity 
                            key={cat} 
                            onPress={() => setCustomization(p => ({ ...p, activeCategory: cat }))}
                            style={[styles.catBtn, customization.activeCategory === cat && { backgroundColor: colors.primary }]}
                        >
                            <Text style={{ color: customization.activeCategory === cat ? 'white' : colors.text }}>{cat}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
                    <Text style={styles.saveBtnText}>{isSaving ? 'Saving...' : 'SAVE CHANGES'}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 50 },
    header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20 },
    title: { fontSize: 20, fontWeight: 'bold' },
    previewCard: { width: '90%', aspectRatio: 1, alignSelf: 'center', backgroundColor: '#f0f0f0', borderRadius: 20, overflow: 'hidden' },
    controls: { padding: 20, marginTop: 'auto' },
    catScroll: { marginBottom: 20 },
    catBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, marginRight: 10, borderWidth: 1, borderColor: '#ccc' },
    saveBtn: { backgroundColor: '#10B981', padding: 18, borderRadius: 15, alignItems: 'center' },
    saveBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});

export default AvatarCustomizer;

                                             
