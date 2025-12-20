import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Svg, { Rect } from 'react-native-svg';

// Import context and assets
import { useTheme } from './src/context/ThemeContext';
import { GrassTerrain, GravelTerrain, InteriorTerrain } from './env/terrains/TerrainLibrary';
import PatternLibrary from './src/patterns/PatternLibrary';
import ColorPicker from './src/components/ColorPicker';
import HamburgerMenu from './src/components/HamburgerMenu';

const { width } = Dimensions.get('window');
// Horizontal 6x3 grid: 6 columns
const GRID_COLUMNS = 6;
const TILE_SIZE = (width - 40) / GRID_COLUMNS; 

const Sandbox = () => {
    const router = useRouter();
    const { isDarkMode, colors, toggleTheme } = useTheme();
    
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null); // Track which pattern tile is being edited

    // Grid State: 6x3 arrays (18 items each)
    const [terrainGrid, setTerrainGrid] = useState(Array(18).fill('grass'));
    const [patternGrid, setPatternGrid] = useState(Array(18).fill({ 
        id: 'polka-dots', 
        color: '#6366F1' 
    }));

    const terrainTypes = ['grass', 'gravel', 'interior'];

    // Terrain Cycle Logic (Simple tap)
    const cycleTerrain = (index) => {
        const nextGrid = [...terrainGrid];
        const currentType = nextGrid[index];
        const nextIndex = (terrainTypes.indexOf(currentType) + 1) % terrainTypes.length;
        nextGrid[index] = terrainTypes[nextIndex];
        setTerrainGrid(nextGrid);
    };

    // Pattern Selection Logic (Opens Picker)
    const handleUpdatePattern = (id) => {
        if (editingIndex === null) return;
        const nextGrid = [...patternGrid];
        nextGrid[editingIndex] = { ...nextGrid[editingIndex], id };
        setPatternGrid(nextGrid);
    };

    const handleUpdateColor = (color) => {
        if (editingIndex === null) return;
        const nextGrid = [...patternGrid];
        nextGrid[editingIndex] = { ...nextGrid[editingIndex], color };
        setPatternGrid(nextGrid);
    };

    const renderTerrainTile = (type) => {
        switch (type) {
            case 'grass': return <GrassTerrain />;
            case 'gravel': return <GravelTerrain />;
            case 'interior': return <InteriorTerrain />;
            default: return null;
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={28} color={colors.primary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Texture Sandbox</Text>
                <TouchableOpacity onPress={() => setIsMenuOpen(true)}>
                    <Ionicons name="menu" size={32} color={colors.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.controlPanel}>
                    <TouchableOpacity 
                        style={[styles.themeToggle, { backgroundColor: colors.primary }]} 
                        onPress={toggleTheme}
                    >
                        <Ionicons name={isDarkMode ? "sunny" : "moon"} size={18} color="white" />
                        <Text style={styles.themeToggleText}>Toggle Theme</Text>
                    </TouchableOpacity>
                </View>

                {/* Terrain 6x3 Grid */}
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Terrains (6x3 seamless)</Text>
                <View style={styles.gridContainer}>
                    {terrainGrid.map((type, index) => (
                        <TouchableOpacity 
                            key={`terrain-${index}`} 
                            style={styles.gridTile} 
                            onPress={() => cycleTerrain(index)}
                        >
                            {renderTerrainTile(type)}
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Pattern 6x3 Grid */}
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Patterns (6x3 clickable)</Text>
                <View style={styles.gridContainer}>
                    {patternGrid.map((config, index) => (
                        <TouchableOpacity 
                            key={`pattern-${index}`} 
                            style={styles.gridTile} 
                            onPress={() => setEditingIndex(index)}
                        >
                            <View style={styles.tileInner}>
                                <Svg height="100%" width="100%">
                                    <PatternLibrary patternId={config.id} color={config.color} />
                                    <Rect width="100%" height="100%" fill={isDarkMode ? '#111827' : '#F9FAFB'} />
                                    <Rect width="100%" height="100%" fill={`url(#${config.id})`} />
                                </Svg>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
                
                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Color/Pattern Picker Overlay */}
            {editingIndex !== null && (
                <ColorPicker 
                    selectedColor={patternGrid[editingIndex].color}
                    selectedPattern={patternGrid[editingIndex].id}
                    onColorChange={handleUpdateColor}
                    onPatternChange={handleUpdatePattern}
                    onClose={() => setEditingIndex(null)}
                />
            )}

            {isMenuOpen && (
                <HamburgerMenu 
                    onClose={() => setIsMenuOpen(false)} 
                    activeItems={['home', 'profile', 'settings']} 
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 15,
        borderBottomWidth: 1,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '900',
    },
    scrollContent: {
        padding: 20,
    },
    controlPanel: {
        marginBottom: 10,
    },
    themeToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    themeToggleText: {
        color: 'white',
        fontWeight: 'bold',
        marginLeft: 6,
        fontSize: 12,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '800',
        marginTop: 20,
        marginBottom: 10,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: TILE_SIZE * GRID_COLUMNS,
        alignSelf: 'center',
    },
    gridTile: {
        width: TILE_SIZE,
        height: TILE_SIZE,
        backgroundColor: '#333',
        overflow: 'hidden',
        // Zero margins for seamless testing
    },
    tileInner: {
        width: '100%',
        height: '100%',
    }
});

export default Sandbox;

            
