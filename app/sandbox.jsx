import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Platform, PanResponder } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useTheme } from './src/context/ThemeContext';
import Imp from './src/components/Imp';

const Sandbox = () => {
    const router = useRouter();
    const { isDarkMode, colors, toggleTheme } = useTheme();
    
    // Imp Customization State - Matching the new object structure
    const [config, setConfig] = useState({
        customization: {
            color: '#8A2BE2',
            pos: { x: 50, y: 80 }, // The pivot point
            shape: { hy: 80, wx: 50, wy: 60 },
            patternId: null,
            patternColor: '#FFFFFF',
        },
        footLength: 1.0,
        armLength: 1.0,
        eyeSize: 5
    });

    // PanResponder for the sliding dot at [pos.x, pos.y - 10]
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: (evt, gestureState) => {
                // Modulate length based on vertical drag
                // Dragging UP (negative dy) increases length
                const sensitivity = 0.02;
                const newLength = Math.max(0.2, Math.min(3.0, config.footLength - gestureState.dy * sensitivity));
                
                setConfig(prev => ({ ...prev, footLength: newLength }));
            },
        })
    ).current;

    const updateConfig = (key, value) => {
        setConfig(prev => ({ ...prev, [key]: value }));
    };

    const updateNestedConfig = (key, value) => {
        setConfig(prev => ({
            ...prev,
            customization: { ...prev.customization, [key]: value }
        }));
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
                            customization={config.customization}
                            footLength={config.footLength}
                            eyeSize={config.eyeSize}
                            armLength={config.armLength}
                        />

                        {/* Interactive Sliding Dot 
                            Positioned at [pos.x, pos.y - 10] 
                            Since Imp is scaled by 2, x=50 becomes 50% left, 
                            and y=80-10=70 becomes 70% from top (30% from bottom).
                        */}
                        <View 
                            {...panResponder.panHandlers}
                            style={[
                                styles.sliderDot, 
                                { 
                                    left: `${config.customization.pos.x}%`, 
                                    top: `${config.customization.pos.y - 10}%`,
                                    backgroundColor: colors.primary,
                                    transform: [{ translateX: -17 }, { translateY: -17 }] // Center the 34px dot
                                }
                            ]} 
                        >
                            <Ionicons name="move" size={18} color="white" />
                        </View>
                    </View>
                </View>

                {/* Control Panel */}
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Morphology</Text>
                <View style={styles.controlRow}>
                    <View>
                        <Text style={[styles.label, { color: colors.text }]}>Foot Length: {config.footLength.toFixed(2)}</Text>
                        <Text style={[styles.hint, { color: colors.text }]}>Drag the dot at [{config.customization.pos.x}, {config.customization.pos.y - 10}]</Text>
                    </View>
                </View>

                <View style={styles.controlRow}>
                    <Text style={[styles.label, { color: colors.text }]}>Eye Size: {config.eyeSize}</Text>
                    <View style={styles.buttonGroup}>
                        <TouchableOpacity 
                            style={styles.miniBtn} 
                            onPress={() => updateConfig('eyeSize', Math.max(2, config.eyeSize - 1))}
                        >
                            <Ionicons name="remove" size={20} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.miniBtn} 
                            onPress={() => updateConfig('eyeSize', Math.min(15, config.eyeSize + 1))}
                        >
                            <Ionicons name="add" size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>

                <Text style={[styles.sectionTitle, { color: colors.text }]}>Colors</Text>
                <View style={styles.grid}>
                    {['#8A2BE2', '#FF6B6B', '#4ECDC4', '#FFD93D'].map(color => (
                        <TouchableOpacity 
                            key={color}
                            style={[styles.actionBtn, { backgroundColor: color }]}
                            onPress={() => updateNestedConfig('color', color)}
                        >
                            <Text style={styles.btnText}>{color}</Text>
                        </TouchableOpacity>
                    ))}
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
        position: 'relative',
        overflow: 'hidden'
    },
    impWrapper: { width: '100%', height: '100%', position: 'relative' },
    sliderDot: {
        position: 'absolute',
        width: 34,
        height: 34,
        borderRadius: 17,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        zIndex: 100,
    },
    sectionTitle: { fontSize: 12, fontWeight: '800', marginTop: 15, marginBottom: 10, textTransform: 'uppercase', opacity: 0.6 },
    controlRow: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        paddingVertical: 10
    },
    label: { fontSize: 16, fontWeight: '600' },
    hint: { fontSize: 11, opacity: 0.5, marginTop: 2 },
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
    btnText: { color: 'white', fontWeight: 'bold', fontSize: 11, textTransform: 'uppercase' }
});

export default Sandbox;

