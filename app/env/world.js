import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; 
import { LinearGradient } from 'expo-linear-gradient'; 

// Import the Building class from the sibling file in the 'env' folder
import Building from './building'; 

// Constants based on screen size
const SCREEN_WIDTH = Dimensions.get('window').width;
// Calculate height remaining after header (50+10+20) and controls (120+40)
const SCREEN_HEIGHT = Dimensions.get('window').height - (Platform.OS === 'android' ? 100 : 120) - 160; 

const STEP_SIZE = 4;
const MOVEMENT_SPEED_MS = 25; 

const BLOB_SIZE = 40;
const BUILDING_WIDTH = 100;
const BUILDING_HEIGHT = 80;

// New Pastel/Aesthetic Colors
const primaryColor = '#1D4ED8'; 
const menuColor = '#4B5563'; 
const dPadColor = '#555555'; 
const textColor = '#1F2937';

// --- FIXED Gradient Palette ---
const pastelGrassStart = '#A9D18E'; 
const pastelGrassEnd = '#7FC060';   

// --- INSTANTIATE BUILDING ---
// Create a fixed instance of a building
const pokeCenter = new Building('Pokémon Center', 'rectangle', { 
    width: BUILDING_WIDTH, 
    height: BUILDING_HEIGHT 
}, {
    x: 50, // door position relative to building top-left
    y: BUILDING_HEIGHT - 5 // door near bottom edge
});

// Calculate the building's fixed position on the map
const buildingMapPosition = {
    x: SCREEN_WIDTH / 2 - BUILDING_WIDTH / 2,
    y: 50 // Near the top of the map area
};


// --- Settings Dropdown Component ---
const SettingsMenu = ({ onClose }) => {
    const router = useRouter();

    const navigateAndClose = (path) => {
        router.push(path);
        onClose();
    };

    return (
        <View style={styles.dropdownContainer}>
            <TouchableOpacity 
                style={styles.menuItem} 
                onPress={() => { router.replace('/'); onClose(); }}
            >
                <Text style={styles.menuItemText}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.menuItem} 
                onPress={() => navigateAndClose('/userProfile/profile')}
            >
                <Text style={styles.menuItemText}>Profile</Text>
            </TouchableOpacity>
                    
            <TouchableOpacity 
                style={styles.menuItem} 
                onPress={() => { alert("Displaying Version Information..."); onClose(); }}
            >
                <Text style={styles.menuItemText}>Version</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.menuItem} 
                onPress={() => { alert("Navigating to Authentication Screen..."); onClose(); }}
            >
                <Text style={styles.menuItemText}>Log In / Sign Up</Text>
            </TouchableOpacity>
        </View>
    );
};


// The main component for the World UI
const WorldScreen = () => {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    
    // ADJUSTED BLOB START POSITION: Move it down to 75% of the screen height
    const [blobPosition, setBlobPosition] = useState({ 
        x: SCREEN_WIDTH / 2 - BLOB_SIZE / 2, 
        y: SCREEN_HEIGHT * 0.75 - BLOB_SIZE / 2 
    });

    const [activeDirection, setActiveDirection] = useState(null); 
    const movementIntervalRef = useRef(null);

    // Core function to move the blob one step
    const moveBlob = (direction) => {
        setBlobPosition(currentPos => {
            let newX = currentPos.x;
            let newY = currentPos.y;

            switch (direction) {
                case 'up': newY -= STEP_SIZE; break;
                case 'down': newY += STEP_SIZE; break;
                case 'left': newX -= STEP_SIZE; break;
                case 'right': newX += STEP_SIZE; break;
                default: return currentPos; 
            }

            // Boundary Check
            const maxX = SCREEN_WIDTH - BLOB_SIZE;
            const maxY = SCREEN_HEIGHT - BLOB_SIZE;

            newX = Math.max(0, Math.min(newX, maxX));
            newY = Math.max(0, Math.min(newY, maxY));

            return { x: newX, y: newY };
        });
    };

    // --- EFFECT HOOK: Manages the continuous movement loop ---
    useEffect(() => {
        if (activeDirection) {
            clearInterval(movementIntervalRef.current);
            movementIntervalRef.current = setInterval(() => {
                moveBlob(activeDirection); 
            }, MOVEMENT_SPEED_MS);
        } else {
            clearInterval(movementIntervalRef.current);
        }
        return () => clearInterval(movementIntervalRef.current);
    }, [activeDirection]); 

    // --- HANDLERS for D-Pad Touch Events ---
    const handlePressIn = (direction) => {
        setActiveDirection(direction);
    };

    const handlePressOut = () => {
        setTimeout(() => setActiveDirection(null), 50); 
    };

    const renderDpadButton = (direction, iconName) => (
        <TouchableOpacity 
            style={styles.dPadButton} 
            onPressIn={() => handlePressIn(direction)}
            onPressOut={handlePressOut}
        >
            <Ionicons name={iconName} size={20} color="white" />
        </TouchableOpacity>
    );

    return (
        <View style={styles.fullContainer}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Game World</Text>
                <TouchableOpacity onPress={() => setIsSettingsOpen(!isSettingsOpen)}>
                    <Ionicons name="menu" size={32} color={primaryColor} />
                </TouchableOpacity>
            </View>

            {/* Game Map Area (Infinite Look with Gradient Texture) */}
            <View style={styles.gameContainer}>
                <LinearGradient
                    colors={[pastelGrassStart, pastelGrassEnd]}
                    start={{ x: 0.1, y: 0.1 }}
                    end={{ x: 0.9, y: 0.9 }}
                    style={styles.mapArea}
                >
                    {/* --- RENDER BUILDING --- */}
                    <View 
                        style={[
                            styles.building, 
                            { 
                                width: pokeCenter.size.width, 
                                height: pokeCenter.size.height,
                                transform: [{ translateX: buildingMapPosition.x }, { translateY: buildingMapPosition.y }]
                            }
                        ]} 
                    >
                        <Text style={styles.buildingLabel}>{pokeCenter.name}</Text>
                        <View 
                            style={[
                                styles.buildingDoor,
                                {
                                    left: pokeCenter.door.x - 10, // Adjust door position slightly for visual center
                                    top: pokeCenter.door.y - 10,
                                }
                            ]}
                        />
                    </View>
                    
                    {/* Moveable Blob Character */}
                    <View 
                        style={[
                            styles.blob, 
                            { transform: [{ translateX: blobPosition.x }, { translateY: blobPosition.y }] }
                        ]} 
                    />
                </LinearGradient>
            </View>
            
            {/* --- Controls and D-Pad Area --- */}
            <View style={styles.controlsContainer}>
                <View style={styles.dPad}>
                    <View style={styles.dPadRow}>
                        <View style={styles.dPadPlaceholder} />
                        {renderDpadButton('up', 'arrow-up')}
                        <View style={styles.dPadPlaceholder} />
                    </View>
                    <View style={styles.dPadRow}>
                        {renderDpadButton('left', 'arrow-back')}
                        <View style={styles.dPadCenter} />
                        {renderDpadButton('right', 'arrow-forward')}
                    </View>
                    <View style={styles.dPadRow}>
                        <View style={styles.dPadPlaceholder} />
                        {renderDpadButton('down', 'arrow-down')}
                        <View style={styles.dPadPlaceholder} />
                    </View>
                </View>

                <View style={styles.actionButtons}>
                    <View style={styles.buttonPlaceholder}>
                        <Text style={styles.buttonPlaceholderText}>Action Buttons</Text>
                    </View>
                </View>
            </View>

            {isSettingsOpen && <SettingsMenu onClose={() => setIsSettingsOpen(false)} />}
        </View>
    );
};

export default WorldScreen;


const styles = StyleSheet.create({
    fullContainer: {
        flex: 1,
        backgroundColor: '#F9FAFB', 
        paddingTop: Platform.OS === 'android' ? 30 : 50,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: primaryColor,
    },
    gameContainer: {
        flex: 1, 
        width: '100%',
    },
    mapArea: {
        flex: 1,
        width: '100%',
        position: 'relative',
    },
    // --- BUILDING STYLES ---
    building: {
        position: 'absolute',
        backgroundColor: '#D16666', // Pokémon Center Red/White theme placeholder
        borderRadius: 5,
        borderWidth: 3,
        borderColor: 'white',
        shadowColor: '#000',
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 5,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
    },
    buildingLabel: {
        position: 'absolute',
        top: -20,
        fontSize: 12,
        fontWeight: 'bold',
        color: textColor,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        paddingHorizontal: 5,
        borderRadius: 3,
    },
    buildingDoor: {
        position: 'absolute',
        width: 20,
        height: 10,
        backgroundColor: '#A0522D', // Brown door
        borderRadius: 2,
        bottom: 0,
        alignSelf: 'center',
    },
    // --- BLOB STYLES ---
    blob: {
        position: 'absolute',
        width: BLOB_SIZE,
        height: BLOB_SIZE,
        borderRadius: BLOB_SIZE / 2,
        backgroundColor: '#FF66B2', 
        zIndex: 10,
    },
    // --- CONTROL STYLES (Rest remain the same) ---
    controlsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: 20,
        width: '100%',
        backgroundColor: '#EAEAEA', 
        borderTopWidth: 1,
        borderTopColor: '#DDDDDD',
    },
    dPad: {
        width: 120,
        height: 120,
        backgroundColor: dPadColor,
        borderRadius: 15,
        padding: 5,
    },
    dPadRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: '33.33%',
    },
    dPadButton: {
        width: 35,
        height: 35,
        backgroundColor: menuColor,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 2,
        shadowColor: '#000',
        shadowOpacity: 0.4,
        shadowRadius: 1,
        elevation: 2,
    },
    dPadCenter: {
        width: 35,
        height: 35,
        margin: 2,
    },
    dPadPlaceholder: {
        width: 35,
        height: 35,
        margin: 2,
    },
    actionButtons: {
        width: 120,
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonPlaceholder: {
        backgroundColor: '#999',
        padding: 10,
        borderRadius: 5,
    },
    buttonPlaceholderText: {
        color: 'white',
        fontWeight: 'bold',
    },
    dropdownContainer: {
        position: 'absolute',
        top: Platform.OS === 'android' ? 70 : 100, 
        right: 20,
        width: 200,
        backgroundColor: 'white',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
        zIndex: 100, 
    },
    menuItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    menuItemText: {
        fontSize: 16,
        color: textColor,
        fontWeight: '500',
    }
});
