import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform, Dimensions, Animated, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; 
import { LinearGradient } from 'expo-linear-gradient'; 

// Import the Building class from the sibling file in the 'env' folder
import Building from './building'; 

// Constants based on screen size
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height - (Platform.OS === 'android' ? 100 : 120) - 160; 

const STEP_SIZE = 4;
const MOVEMENT_SPEED_MS = 25; 
const BOUNCE_HEIGHT = 4; // Max vertical bounce distance
const BOUNCE_DURATION = 150; // How fast the bounce completes

const BLOB_SIZE = 40;
const BUILDING_WIDTH = 100;
const BUILDING_HEIGHT = 80;

// New Pastel/Aesthetic Colors
const primaryColor = '#1D4ED8'; 
const menuColor = '#4B5563'; 
const dPadColor = '#555555'; 
const textColor = '#1F2937';

const pastelGrassStart = '#A9D18E'; 
const pastelGrassEnd = '#7FC060';   

// --- INSTANTIATE BUILDING ---
const pokeCenter = new Building('Pokémon Center', 'rectangle', { 
    width: BUILDING_WIDTH, 
    height: BUILDING_HEIGHT 
}, {
    x: 50, 
    y: BUILDING_HEIGHT - 5 
});

const buildingMapPosition = {
    x: SCREEN_WIDTH / 2 - BUILDING_WIDTH / 2,
    y: 50 
};


// --- Settings Dropdown Component (Unchanged) ---
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
    
    // 1. STATE CHANGE: blobPosition now tracks the *World Offset* (how much the map is translated)
    // The player is visually fixed at the center of the screen.
    const [worldOffset, setWorldOffset] = useState({ x: 0, y: 0 });

    const [activeDirection, setActiveDirection] = useState(null); 
    const movementIntervalRef = useRef(null);
    
    // 2. ANIMATION VALUE: Used for the vertical bounce effect
    const bounceAnim = useRef(new Animated.Value(0)).current; 

    // Function to run the subtle vertical bounce animation
    const triggerBounce = () => {
        // Stop any current animation
        bounceAnim.stopAnimation();
        
        // Sequence: Move Up (-BOUNCE_HEIGHT) then return to center (0)
        Animated.sequence([
            Animated.timing(bounceAnim, {
                toValue: -BOUNCE_HEIGHT, // Move up
                duration: BOUNCE_DURATION / 2,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
            Animated.timing(bounceAnim, {
                toValue: 0, // Return to center
                duration: BOUNCE_DURATION / 2,
                easing: Easing.in(Easing.ease),
                useNativeDriver: true,
            }),
        ]).start();
    };

    // Core function to move the world (opposite of direction)
    const moveWorld = (direction) => {
        setWorldOffset(currentOffset => {
            let newX = currentOffset.x;
            let newY = currentOffset.y;

            // Movement must be *OPPOSITE* to the direction the player is moving
            // If player moves UP, the world must translate DOWN (increase Y offset)
            switch (direction) {
                case 'up': newY += STEP_SIZE; break;
                case 'down': newY -= STEP_SIZE; break;
                case 'left': newX += STEP_SIZE; break;
                case 'right': newX -= STEP_SIZE; break;
                default: return currentOffset; 
            }

            // Trigger the visual bounce effect on every step
            triggerBounce();

            return { x: newX, y: newY };
        });
    };

    // --- EFFECT HOOK: Manages the continuous movement loop ---
    useEffect(() => {
        if (activeDirection) {
            clearInterval(movementIntervalRef.current);
            movementIntervalRef.current = setInterval(() => {
                // Call moveWorld instead of moveBlob
                moveWorld(activeDirection); 
            }, MOVEMENT_SPEED_MS);
        } else {
            clearInterval(movementIntervalRef.current);
            // Optionally reset bounce animation when movement stops
            // Animated.timing(bounceAnim, {toValue: 0, duration: 100, useNativeDriver: true}).start();
        }
        return () => clearInterval(movementIntervalRef.current);
    }, [activeDirection]); 

    // --- HANDLERS for D-Pad Touch Events (Unchanged) ---
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
    
    // Calculate the fixed center position for the player blob
    const playerCenterStyle = {
        left: SCREEN_WIDTH / 2 - BLOB_SIZE / 2,
        top: SCREEN_HEIGHT / 2 - BLOB_SIZE / 2,
    };

    // The entire map content (building, grass, etc.) moves via worldOffset
    const mapContentTransform = [
        { translateX: worldOffset.x },
        { translateY: worldOffset.y },
    ];

    // The player blob only moves vertically via the bounceAnim
    const blobBounceTransform = [{ translateY: bounceAnim }];


    return (
        <View style={styles.fullContainer}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Game World</Text>
                <TouchableOpacity onPress={() => setIsSettingsOpen(!isSettingsOpen)}>
                    <Ionicons name="menu" size={32} color={primaryColor} />
                </TouchableOpacity>
            </View>

            {/* Game Map Area */}
            <View style={styles.gameContainer}>
                
                {/* --- MOVING MAP CONTENT LAYER --- */}
                <Animated.View
                    style={[
                        styles.mapArea,
                        { transform: mapContentTransform }
                    ]}
                >
                    {/* Background (Always fill the mapArea) */}
                    <LinearGradient
                        colors={[pastelGrassStart, pastelGrassEnd]}
                        start={{ x: 0.1, y: 0.1 }}
                        end={{ x: 0.9, y: 0.9 }}
                        style={StyleSheet.absoluteFillObject}
                    />

                    {/* RENDER BUILDING (Positioned relative to the world coordinate 0,0) */}
                    <View 
                        style={[
                            styles.building, 
                            { 
                                width: pokeCenter.size.width, 
                                height: pokeCenter.size.height,
                                // Building position is relative to world map.
                                transform: [
                                    { translateX: buildingMapPosition.x }, 
                                    { translateY: buildingMapPosition.y }
                                ]
                            }
                        ]} 
                    >
                        <Text style={styles.buildingLabel}>{pokeCenter.name}</Text>
                        <View 
                            style={[
                                styles.buildingDoor,
                                {
                                    left: pokeCenter.door.x - 10, 
                                    top: pokeCenter.door.y - 10,
                                }
                            ]}
                        />
                    </View>
                </Animated.View>

                {/* --- FIXED PLAYER BLOB LAYER (Always visually centered) --- */}
                <Animated.View 
                    style={[
                        styles.blob, 
                        playerCenterStyle,
                        { transform: blobBounceTransform } // Apply the bounce animation here
                    ]} 
                />
            </View>
            
            {/* --- Controls and D-Pad Area (Unchanged) --- */}
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
        // This is the viewing window for the map
        flex: 1, 
        width: '100%',
        overflow: 'hidden', // Crucial: clips map content outside the view
    },
    mapArea: {
        // This container holds ALL world elements (grass, buildings, etc.)
        position: 'absolute',
        top: 0,
        left: 0,
        width: SCREEN_WIDTH * 2, // Arbitrarily large map size for infinite scroll illusion
        height: SCREEN_HEIGHT * 2,
    },
    // --- BUILDING STYLES ---
    building: {
        position: 'absolute',
        backgroundColor: '#D16666', 
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
        backgroundColor: '#A0522D', 
        borderRadius: 2,
        bottom: 0,
        alignSelf: 'center',
    },
    // --- BLOB STYLES (Fixed in center) ---
    blob: {
        position: 'absolute',
        width: BLOB_SIZE,
        height: BLOB_SIZE,
        borderRadius: BLOB_SIZE / 2,
        backgroundColor: '#FF66B2', 
        zIndex: 10,
    },
    // --- CONTROL STYLES ---
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
