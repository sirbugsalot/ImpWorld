import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Svg, { Rect } from 'react-native-svg';

import { useTheme } from './src/context/ThemeContext';
import { GrassTerrain, GravelTerrain, InteriorTerrain } from './env/terrains/TerrainLibrary';
import PatternLibrary from './src/patterns/PatternLibrary';
import ColorPicker from './src/components/ColorPicker';
import HamburgerMenu from './src/components/HamburgerMenu';
import Imp from './src/components/Imp';

const { width } = Dimensions.get('window');
const GRID_COLUMNS = 6;
const TILE_SIZE = (width - 40) / GRID_COLUMNS; 

const Sandbox = () => {
    const router = useRouter();
    const { isDarkMode, colors, toggleTheme } = useTheme();
    
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);

    const [terrainGrid, setTerrainGrid] = useState(Array(18).fill('grass'));
    const [patternGrid, setPatternGrid] = useState(Array(18).fill({ 
        id: 'polka-dots', 
        color: '#6366F1',
        patternColor: '#FFFFFF' 
    }));

    // Imp Customization State for Testing
    const [impConfig, setImpConfig] = useState({
        bodyColor: "#E0E0E0",
        hairColor: "#5D4037",
        noseSize: 0.6,
        eyeScale: 1.0
    });

    const terrainTypes = ['grass', 'gravel', 'interior'];

    const cycleTerrain = (index) => {
        const nextGrid = [...terrainGrid];
        nextGrid[index] = terrainTypes[(terrainTypes.indexOf(nextGrid[index]) + 1) % terrainTypes.length];
        setTerrainGrid(nextGrid);
    };

    const handleUpdatePattern = (id) => {
        if (editingIndex === null) return;
        const nextGrid = [...patternGrid];
        nextGrid[editingIndex] = { ...nextGrid[editingIndex], id };
        setPatternGrid(nextGrid);
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={28} color={colors.primary} /></TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Texture Sandbox</Text>
                <TouchableOpacity onPress={() => setIsMenuOpen(true)}><Ionicons name="menu" size={32} color={colors.primary} /></TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.controlPanel}>
                    <TouchableOpacity style={[styles.themeToggle, { backgroundColor: colors.primary }]} onPress={toggleTheme}>
                        <Ionicons name={isDarkMode ? "sunny" : "moon"} size={18} color="white" />
                        <Text style={styles.themeToggleText}>Toggle Theme</Text>
                    </TouchableOpacity>
                </View>

                {/* NEW: Entity Research Section */}
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Entity Research (Imp)</Text>
                <View style={[styles.impPreviewFrame, { borderColor: colors.border }]}>
                    <View style={styles.impDisplay}>
                         <Imp 
                            hairColor={impConfig.hairColor}
                            noseSize={impConfig.noseSize}
                            bodyColor={impConfig.bodyColor}
                            eyeScale={impConfig.eyeScale}
                         />
                    </View>
                    <View style={styles.impControls}>
                        <TouchableOpacity 
                            style={styles.miniControl} 
                            onPress={() => setImpConfig(prev => ({ ...prev, noseSize: prev.noseSize > 1 ? 0.4 : 1.2 }))}
                        >
                            <Text style={styles.miniControlText}>Toggle Nose</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.miniControl} 
                            onPress={() => setImpConfig(prev => ({ ...prev, hairColor: prev.hairColor === "#5D4037" ? "#EF4444" : "#5D4037" }))}
                        >
                            <Text style={styles.miniControlText}>Toggle Hair</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <Text style={[styles.sectionTitle, { color: colors.text }]}>Terrains (6x3)</Text>
                <View style={styles.gridContainer}>
                    {terrainGrid.map((type, index) => (
                        <TouchableOpacity key={`t-${index}`} style={styles.gridTile} onPress={() => cycleTerrain(index)}>
                            {type === 'grass' ? <GrassTerrain /> : type === 'gravel' ? <GravelTerrain /> : <InteriorTerrain />}
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={[styles.sectionTitle, { color: colors.text }]}>Pattern Designer (6x3)</Text>
                <View style={styles.gridContainer}>
                    {patternGrid.map((config, index) => (
                        <TouchableOpacity key={`p-${index}`} style={styles.gridTile} onPress={() => setEditingIndex(index)}>
                            <Svg height="100%" width="100%">
                                <PatternLibrary patternId={config.id} color={config.patternColor || '#FFFFFF'} />
                                <Rect width="100%" height="100%" fill={config.color} />
                                <Rect width="100%" height="100%" fill={`url(#${config.id})`} />
                            </Svg>
                        </TouchableOpacity>
                    ))}
                </View>
                <View style={{ height: 100 }} />
            </ScrollView>

            {editingIndex !== null && (
                <ColorPicker 
                    selectedColor={patternGrid[editingIndex].color}
                    patternColor={patternGrid[editingIndex].patternColor || '#FFFFFF'}
                    selectedPattern={patternGrid[editingIndex].id}
                    onColorChange={(color) => {
                        const next = [...patternGrid];
                        next[editingIndex].color = color;
                        setPatternGrid(next);
                    }}
                    onPatternColorChange={(color) => {
                        const next = [...patternGrid];
                        next[editingIndex].patternColor = color;
                        setPatternGrid(next);
                    }}
                    onPatternChange={handleUpdatePattern}
                    onClose={() => setEditingIndex(null)}
                />
            )}

            {isMenuOpen && <HamburgerMenu onClose={() => setIsMenuOpen(false)} activeItems={['home', 'settings']} />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: Platform.OS === 'ios' ? 60 : 40 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 15, borderBottomWidth: 1 },
    headerTitle: { fontSize: 18, fontWeight: '900' },
    scrollContent: { padding: 20 },
    controlPanel: { marginBottom: 10 },
    themeToggle: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, alignSelf: 'flex-start' },
    themeToggleText: { color: 'white', fontWeight: 'bold', marginLeft: 6, fontSize: 12 },
    sectionTitle: { fontSize: 14, fontWeight: '800', marginTop: 20, marginBottom: 10, textTransform: 'uppercase' },
    gridContainer: { flexDirection: 'row', flexWrap: 'wrap', width: TILE_SIZE * GRID_COLUMNS, alignSelf: 'center' },
    gridTile: { width: TILE_SIZE, height: TILE_SIZE, backgroundColor: '#333', overflow: 'hidden' },
    impPreviewFrame: { 
        flexDirection: 'row', 
        height: 120, 
        borderWidth: 1, 
        borderRadius: 12, 
        padding: 10, 
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.02)'
    },
    impDisplay: { width: 100, height: 100 },
    impControls: { flex: 1, paddingLeft: 20 },
    miniControl: { backgroundColor: '#4B5563', padding: 8, borderRadius: 6, marginBottom: 8 },
    miniControlText: { color: 'white', fontSize: 12, fontWeight: 'bold', textAlign: 'center' }
});

export default Sandbox;

