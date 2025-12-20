import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Svg, { Rect } from 'react-native-svg';

// Import context and assets
import { useTheme } from './src/context/ThemeContext';
import { GrassTerrain, GravelTerrain, InteriorTerrain } from './env/terrains/TerrainLibrary';
import PatternLibrary from './src/patterns/PatternLibrary';
import HamburgerMenu from './src/components/HamburgerMenu';

const { width } = Dimensions.get('window');
const TILE_SIZE = (width - 60) / 3; // Calculate tile size for 3-column grid

const Sandbox = () => {
    const router = useRouter();
    const { isDarkMode, colors, toggleTheme } = useTheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Grid State: 3x6 arrays (18 items each)
    const [terrainGrid, setTerrainGrid] = useState(Array(18).fill('grass'));
    const [patternGrid, setPatternGrid] = useState(Array(18).fill('polka-dots'));

    const terrainTypes = ['grass', 'gravel', 'interior'];
    const patternTypes = ['polka-dots', 'stripes', 'hearts', 'squares', 'zigzag'];

    // Cycle logic for Terrain
    const cycleTerrain = (index) => {
        const nextGrid = [...terrainGrid];
        const currentType = nextGrid[index];
        const nextIndex = (terrainTypes.indexOf(currentType) + 1) % terrainTypes.length;
        nextGrid[index] = terrainTypes[nextIndex];
        setTerrainGrid(nextGrid);
    };

    // Cycle logic for Patterns
    const cyclePattern = (index) => {
        const nextGrid = [...patternGrid];
        const currentType = nextGrid[index];
        const nextIndex = (patternTypes.indexOf(currentType) + 1) % patternTypes.length;
        nextGrid[index] = patternTypes[nextIndex];
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

    const PatternTile = ({ patternId }) => (
        <View style={styles.tileInner}>
            <Svg height="100%" width="100%">
                <PatternLibrary patternId={patternId} color={isDarkMode ? '#6366F1' : '#4F46E5'} />
                <Rect width="100%" height="100%" fill={isDarkMode ? '#1F2937' : '#E5E7EB'} />
                <Rect width="100%" height="100%" fill={`url(#${patternId})`} />
            </Svg>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={28} color={colors.primary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Interactive Sandbox</Text>
                <TouchableOpacity onPress={() => setIsMenuOpen(true)}>
                    <Ionicons name="menu" size={32} color={colors.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.controlPanel}>
                    <Text style={[styles.introText, { color: colors.text }]}>
                        Tap any tile to cycle through variations. Useful for testing grid continuity.
                    </Text>
                    <TouchableOpacity 
                        style={[styles.themeToggle, { backgroundColor: colors.primary }]} 
                        onPress={toggleTheme}
                    >
                        <Ionicons name={isDarkMode ? "sunny" : "moon"} size={20} color="white" />
                        <Text style={styles.themeToggleText}>Toggle Theme</Text>
                    </TouchableOpacity>
                </View>

                {/* Terrain 3x6 Grid */}
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Terrain Continuity (3x6)</Text>
                <View style={styles.gridContainer}>
                    {terrainGrid.map((type, index) => (
                        <TouchableOpacity 
                            key={`terrain-${index}`} 
                            style={styles.gridTile} 
                            onPress={() => cycleTerrain(index)}
                        >
                            {renderTerrainTile(type)}
                            <View style={styles.tileLabel}>
                                <Text style={styles.tileLabelText}>{type.charAt(0).toUpperCase()}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Pattern 3x6 Grid */}
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Pattern Visuals (3x6)</Text>
                <View style={styles.gridContainer}>
                    {patternGrid.map((type, index) => (
                        <TouchableOpacity 
                            key={`pattern-${index}`} 
                            style={styles.gridTile} 
                            onPress={() => cyclePattern(index)}
                        >
                            <PatternTile patternId={type} />
                            <View style={styles.tileLabel}>
                                <Text style={styles.tileLabelText}>{type.slice(0, 3).toUpperCase()}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>

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
        marginBottom: 20,
    },
    introText: {
        fontSize: 13,
        marginBottom: 10,
        opacity: 0.7,
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
        fontSize: 16,
        fontWeight: '800',
        marginTop: 20,
        marginBottom: 10,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        backgroundColor: '#000',
        padding: 1,
        borderRadius: 4,
    },
    gridTile: {
        width: TILE_SIZE,
        height: TILE_SIZE,
        marginBottom: 1,
        backgroundColor: '#333',
        overflow: 'hidden',
    },
    tileInner: {
        width: '100%',
        height: '100%',
    },
    tileLabel: {
        position: 'absolute',
        bottom: 2,
        right: 4,
        backgroundColor: 'rgba(0,0,0,0.4)',
        paddingHorizontal: 4,
        borderRadius: 4,
    },
    tileLabelText: {
        color: 'white',
        fontSize: 8,
        fontWeight: 'bold',
    }
});

export default Sandbox;

