import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useTheme } from './src/context/ThemeContext';
import Imp from './src/components/Imp';

const Sandbox = () => {
    const router = useRouter();
    const { isDarkMode, colors, toggleTheme } = useTheme();
    
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Imp Customization State
    const [config, setConfig] = useState({
        hairColor: "#5D4037",
        bodyColor: "#E0E0E0",
        noseSize: 0.6,
        showPencil: true,
        smileType: "benevolent"
    });

    const updateConfig = (key, value) => {
        setConfig(prev => ({ ...prev, [key]: value }));
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={28} color={colors.primary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Entity Research</Text>
                <TouchableOpacity onPress={toggleTheme}>
                    <Ionicons name={isDarkMode ? "sunny" : "moon"} size={28} color={colors.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                
                {/* Hero Preview Section */}
                <View style={[styles.previewCard, { backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF', borderColor: colors.border }]}>
                    <View style={styles.impWrapper}>
                        <Imp 
                            hairColor={config.hairColor}
                            bodyColor={config.bodyColor}
                            noseSize={config.noseSize}
                            showPencil={config.showPencil}
                            smileType={config.smileType}
                        />
                    </View>
                </View>

                {/* Control Panel */}
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Body Proportions</Text>
                <View style={styles.controlRow}>
                    <Text style={[styles.label, { color: colors.text }]}>Nose Size: {config.noseSize.toFixed(1)}</Text>
                    <View style={styles.buttonGroup}>
                        <TouchableOpacity 
                            style={styles.miniBtn} 
                            onPress={() => updateConfig('noseSize', Math.max(0.2, config.noseSize - 0.2))}
                        >
                            <Ionicons name="remove" size={20} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.miniBtn} 
                            onPress={() => updateConfig('noseSize', Math.min(2.0, config.noseSize + 0.2))}
                        >
                            <Ionicons name="add" size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>

                <Text style={[styles.sectionTitle, { color: colors.text }]}>Colors & Styles</Text>
                <View style={styles.grid}>
                    <TouchableOpacity 
                        style={[styles.actionBtn, { backgroundColor: '#5D4037' }]}
                        onPress={() => updateConfig('hairColor', '#5D4037')}
                    >
                        <Text style={styles.btnText}>Dark Hair</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.actionBtn, { backgroundColor: '#4A90E2' }]}
                        onPress={() => updateConfig('hairColor', '#4A90E2')}
                    >
                        <Text style={styles.btnText}>Blue Hair</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.actionBtn, { backgroundColor: config.showPencil ? '#EF4444' : '#10B981' }]}
                        onPress={() => updateConfig('showPencil', !config.showPencil)}
                    >
                        <Text style={styles.btnText}>{config.showPencil ? "Remove Pencil" : "Add Pencil"}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.actionBtn, { backgroundColor: '#6B7280' }]}
                        onPress={() => updateConfig('bodyColor', config.bodyColor === '#E0E0E0' ? '#F5F5F5' : '#E0E0E0')}
                    >
                        <Text style={styles.btnText}>Shift Tone</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ height: 60 }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: Platform.OS === 'ios' ? 60 : 40 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 15, borderBottomWidth: 1 },
    headerTitle: { fontSize: 20, fontWeight: '900', letterSpacing: 0.5 },
    scrollContent: { padding: 20 },
    previewCard: { 
        width: '100%', 
        aspectRatio: 1, 
        borderRadius: 24, 
        borderWidth: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        marginBottom: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    impWrapper: { width: '80%', height: '80%' },
    sectionTitle: { fontSize: 12, fontWeight: '800', marginTop: 15, marginBottom: 10, textTransform: 'uppercase', opacity: 0.6 },
    controlRow: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        paddingVertical: 10
    },
    label: { fontSize: 16, fontWeight: '600' },
    buttonGroup: { flexDirection: 'row' },
    miniBtn: { 
        backgroundColor: '#4B5563', 
        width: 40, 
        height: 40, 
        borderRadius: 20, 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginLeft: 10 
    },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 5 },
    actionBtn: { 
        flex: 1, 
        minWidth: '45%', 
        paddingVertical: 15, 
        borderRadius: 12, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    btnText: { color: 'white', fontWeight: 'bold', fontSize: 13 }
});

export default Sandbox;

