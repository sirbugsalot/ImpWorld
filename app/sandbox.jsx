import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Import our context and components
import { useTheme } from './src/context/ThemeContext';
import { GrassTerrain, GravelTerrain, InteriorTerrain } from './env/terrains/TerrainLibrary';
import HamburgerMenu from './src/components/HamburgerMenu';

const Sandbox = () => {
    const router = useRouter();
    const { isDarkMode, colors, toggleTheme } = useTheme();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    // Define the specimens we want to inspect
    const terrainSpecimens = [
        { id: 'grass', name: 'Grasslands', Component: GrassTerrain, description: 'Natural green with dark tufts' },
        { id: 'gravel', name: 'Stone Gravel', Component: GravelTerrain, description: 'Mixed grey pebble texture' },
        { id: 'interior', name: 'Building Interior', Component: InteriorTerrain, description: 'Clean grid with light sheen' },
    ];

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header Section */}
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={28} color={colors.primary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Terrain Sandbox</Text>
                <TouchableOpacity onPress={() => setIsMenuOpen(true)}>
                    <Ionicons name="menu" size={32} color={colors.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.introBox}>
                    <Text style={[styles.introText, { color: colors.text }]}>
                        Inspect terrain textures and test how they interact with the current theme.
                    </Text>
                    <TouchableOpacity 
                        style={[styles.themeToggle, { backgroundColor: colors.primary }]} 
                        onPress={toggleTheme}
                    >
                        <Ionicons name={isDarkMode ? "sunny" : "moon"} size={20} color="white" />
                        <Text style={styles.themeToggleText}>
                            Switch to {isDarkMode ? 'Light' : 'Dark'} Mode
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Display each terrain type */}
                {terrainSpecimens.map((item) => (
                    <View key={item.id} style={[styles.specimenCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                        <View style={styles.terrainPreview}>
                            <item.Component style={styles.fullTile} />
                        </View>
                        <View style={styles.specimenInfo}>
                            <Text style={[styles.specimenName, { color: colors.text }]}>{item.name}</Text>
                            <Text style={[styles.specimenDesc, { color: isDarkMode ? '#9CA3AF' : '#6B7280' }]}>
                                {item.description}
                            </Text>
                        </View>
                    </View>
                ))}

                {/* Tiled Grid Example */}
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Grid Continuity Test</Text>
                <View style={styles.gridPreview}>
                    <View style={styles.row}>
                        <GrassTerrain style={styles.smallTile} />
                        <GrassTerrain style={styles.smallTile} />
                        <GravelTerrain style={styles.smallTile} />
                    </View>
                    <View style={styles.row}>
                        <GrassTerrain style={styles.smallTile} />
                        <InteriorTerrain style={styles.smallTile} />
                        <InteriorTerrain style={styles.smallTile} />
                    </View>
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
        fontSize: 20,
        fontWeight: '800',
    },
    scrollContent: {
        padding: 20,
    },
    introBox: {
        marginBottom: 25,
    },
    introText: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 15,
        opacity: 0.8,
    },
    themeToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 10,
        alignSelf: 'flex-start',
    },
    themeToggleText: {
        color: 'white',
        fontWeight: '600',
        marginLeft: 8,
    },
    specimenCard: {
        flexDirection: 'row',
        borderRadius: 16,
        borderWidth: 1,
        marginBottom: 15,
        overflow: 'hidden',
    },
    terrainPreview: {
        width: 100,
        height: 100,
    },
    fullTile: {
        width: '100%',
        height: '100%',
    },
    specimenInfo: {
        flex: 1,
        padding: 15,
        justifyContent: 'center',
    },
    specimenName: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 4,
    },
    specimenDesc: {
        fontSize: 13,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginTop: 20,
        marginBottom: 15,
    },
    gridPreview: {
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: '#000',
        width: 186, // 60 * 3 + margins
    },
    row: {
        flexDirection: 'row',
    },
    smallTile: {
        width: 60,
        height: 60,
        borderWidth: 0.5,
        borderColor: 'rgba(0,0,0,0.1)',
    },
});

export default Sandbox;

          
