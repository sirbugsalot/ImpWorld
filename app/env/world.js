import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform, Dimensions, Animated, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; 

import Building from './building'; 
import WorldBackground from './bckgrd'; 
// Updated import to use the new Player component
import Player, { BLOB_WIDTH, BLOB_HEIGHT } from './player'; 


// Constants based on screen size
const SCREEN_WIDTH = Dimensions.get('window').width;
// SCREEN_HEIGHT is the height of the playable map area
const SCREEN_HEIGHT = Dimensions.get('window').height - (Platform.OS === 'android' ? 100 : 120) - 160; 

const STEP_SIZE = 4;
const MOVEMENT_SPEED_MS = 25; 

const BUILDING_WIDTH = 100;
const BUILDING_HEIGHT = 80;

// New Pastel/Aesthetic Colors
const primaryColor = '#1D4ED8'; 
const menuColor = '#4B5563'; 
const textColor = '#1F2937';
const dPadColor = '#555555'; 

// --- INSTANTIATE BUILDING ---
const welcomeCenter = new Building('Welcome Center', 'rectangle', { 
    width: BUILDING_WIDTH, 
    height: BUILDING_HEIGHT 
}, {
    x: 50, 
    y: BUILDING_HEIGHT - 5 
});

// The building is placed at world coordinate (50, 100)
const buildingMapPosition = {
    x: 50, 
    y: 100 
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
    
    // Placeholder for customization (will eventually be loaded from user profile)
    const [customization] = useState({
        color: '#8A2BE2', // BlueViolet: Distinct color for customized blob
    });
    
    // Calculate initial offset for world view
    const initialOffsetX = -(buildingMapPosition.x - (SCREEN_WIDTH / 2));
    const initialOffsetY = -(buildingMapPosition.y + 150 - (SCREEN_HEIGHT / 2)); 
    
    // 1. ANIMATED STATE FOR WORLD OFFSET
    const worldOffsetAnim = useRef(new Animated.ValueXY({ x: initialOffsetX, y: initialOffsetY })).current;
    
    // Non-animated ref to track the current raw offset (for logic)
    const worldOffsetRef = useRef({ x: initialOffsetX, y: initialOffsetY });

    const [activeDirection, setActiveDirection] = useState(null); 
    const movementIntervalRef = useRef(null);

    // Core function to move the world (by updating the Animated Value)
    const moveWorld = (direction) => {
        // Calculate the new raw offset
        let newX = worldOffsetRef.current.x;
        let newY = worldOffsetRef.current.y;

        // Movement must be *OPPOSITE* to the direction the player is moving
        switch (direction) {
            case 'up': newY += STEP_SIZE; break;
            case 'down': newY -= STEP_SIZE; break;
            case 'left': newX += STEP_SIZE; break;
            case 'right': newX -= STEP_SIZE; break;
            default: return; 
        }

        // Update the Animated Value
        worldOffsetAnim.setValue({ x: newX, y: newY });
        
        // Update the reference for the next calculation
        worldOffsetRef.current = { x: newX, y: newY };
    };

    // --- EFFECT HOOK: Manages the continuous world movement loop ---
    useEffect(() => {
        if (activeDirection) {
            clearInterval(movementIntervalRef.current);
            movementIntervalRef.current = setInterval(() => {
                moveWorld(activeDirection); 
            }, MOVEMENT_SPEED_MS);

        } else {
            clearInterval(movementIntervalRef.current);
        }
        
        // Cleanup function for effect
        return () => {
            clearInterval(movementIntervalRef.current);
        };
    }, [activeDirection]); 

    // --- HANDLERS for D-Pad Touch Events (Unchanged) ---
    const handlePressIn = (direction) => {
        setActiveDirection(direction);
    };

    const handlePressOut = () => {
        // Debounce releasing the direction slightly
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
    
    // Calculate the fixed center position for the player avatar using imported constants
    const playerCenterStyle = {
        left: SCREEN_WIDTH / 2 - BLOB_WIDTH / 2, 
        top: SCREEN_HEIGHT / 2 - BLOB_HEIGHT / 2, 
    };

    // Extract the transform style from Animated.ValueXY for map content
    const mapContentTransform = worldOffsetAnim.getTranslateTransform();

    return (
        <View style={styles.fullContainer}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Game World</Text>
                <TouchableOpacity onPress={() => setIsSettingsOpen(!isSettingsOpen)}>
                    <Ionicons name="menu" size={32} color={primaryColor} />
                </TouchableOpacity>
            </View>

            {/* Game Map Area (Viewport) */}
            <View style={styles.gameContainer}>
                
                {/* 1. MOVING MAP CONTENT LAYER (Background and objects) */}
                <WorldBackground 
                    worldTransform={{ transform: mapContentTransform }}
                    textureType="GRASS"
                />

                {/* --- RENDER MAP OBJECTS (Building) --- */}
                <Animated.View
                    style={[
                        styles.mapObjectContainer,
                        { transform: mapContentTransform }
                    ]}
                >
                    <View 
                        style={[
                            styles.building, 
                            { 
                                width: welcomeCenter.size.width, 
                                height: welcomeCenter.size.height,
                                // Position relative to world 0,0
                                transform: [
                                    { translateX: buildingMapPosition.x }, 
                                    { translateY: buildingMapPosition.y }
                                ]
                            }
                        ]} 
                    >
                        <Text style={styles.buildingLabel}>{welcomeCenter.name}</Text>
                        <View 
                            style={[
                                styles.buildingDoor,
                                {
                                    left: welcomeCenter.door.x - 10, 
                                    top: welcomeCenter.door.y - 10,
                                }
                            ]}
                        />
                    </View>
                </Animated.View>

                {/* 2. FIXED PLAYER AVATAR LAYER (Always visually centered) */}
                <Player // Using the renamed Player component
                    activeDirection={activeDirection}
                    customization={customization}
                    playerCenterStyle={playerCenterStyle}
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
        flex: 1, 
        width: '100%',
        overflow: 'hidden', 
        position: 'relative', 
    },
    mapObjectContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
    },
    // --- BUILDING STYLES (Unchanged) ---
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
    // --- CONTROL STYLES (Unchanged) ---
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
