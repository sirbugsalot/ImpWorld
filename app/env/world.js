import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform, Dimensions, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; 

// Updated relative imports
import Building from './building'; 
import WorldBackground from './bckgrd'; 
import Player, { BLOB_WIDTH, BLOB_HEIGHT } from './player'; 

// Import the centralized menu and constants
import HamburgerMenu from '../src/components/HamburgerMenu';
import { PRIMARY_COLOR, INITIAL_DARK_MODE, DARK_BG_COLOR, LIGHT_BG_COLOR } from '../src/utils/constants';

// Constants based on screen size
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height - (Platform.OS === 'android' ? 100 : 120) - 160; 

const STEP_SIZE = 4;
const MOVEMENT_SPEED_MS = 25; 

const BUILDING_WIDTH = 100;
const BUILDING_HEIGHT = 80;

// Theme logic
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

const buildingMapPosition = { x: 50, y: 100 };

const WorldScreen = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    // Placeholder for customization
    const [customization] = useState({
        color: '#8A2BE2', 
    });
    
    // Menu configuration
    const menuKeys = ['home', 'profile', 'sandbox', 'settings', 'version', 'auth'];
    
    // Initial offset calculation
    const initialOffsetX = -(buildingMapPosition.x - (SCREEN_WIDTH / 2));
    const initialOffsetY = -(buildingMapPosition.y + 150 - (SCREEN_HEIGHT / 2)); 
    
    const worldOffsetAnim = useRef(new Animated.ValueXY({ x: initialOffsetX, y: initialOffsetY })).current;
    const worldOffsetRef = useRef({ x: initialOffsetX, y: initialOffsetY });

    const [activeDirection, setActiveDirection] = useState(null); 
    const movementIntervalRef = useRef(null);

    const moveWorld = (direction) => {
        let newX = worldOffsetRef.current.x;
        let newY = worldOffsetRef.current.y;

        switch (direction) {
            case 'up': newY += STEP_SIZE; break;
            case 'down': newY -= STEP_SIZE; break;
            case 'left': newX += STEP_SIZE; break;
            case 'right': newX -= STEP_SIZE; break;
            default: return; 
        }

        worldOffsetAnim.setValue({ x: newX, y: newY });
        worldOffsetRef.current = { x: newX, y: newY };
    };

    useEffect(() => {
        if (activeDirection) {
            clearInterval(movementIntervalRef.current);
            movementIntervalRef.current = setInterval(() => {
                moveWorld(activeDirection); 
            }, MOVEMENT_SPEED_MS);
        } else {
            clearInterval(movementIntervalRef.current);
        }
        return () => clearInterval(movementIntervalRef.current);
    }, [activeDirection]); 

    const handlePressIn = (direction) => setActiveDirection(direction);
    const handlePressOut = () => setTimeout(() => setActiveDirection(null), 50); 

    const renderDpadButton = (direction, iconName) => (
        <TouchableOpacity 
            style={styles.dPadButton} 
            onPressIn={() => handlePressIn(direction)}
            onPressOut={handlePressOut}
        >
            <Ionicons name={iconName} size={20} color="white" />
        </TouchableOpacity>
    );
    
    const playerCenterStyle = {
        left: SCREEN_WIDTH / 2 - BLOB_WIDTH / 2, 
        top: SCREEN_HEIGHT / 2 - BLOB_HEIGHT / 2, 
    };

    const mapContentTransform = worldOffsetAnim.getTranslateTransform();

    return (
        <View style={[styles.fullContainer, { backgroundColor: INITIAL_DARK_MODE ? DARK_BG_COLOR : LIGHT_BG_COLOR }]}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Imp World</Text>
                <TouchableOpacity onPress={() => setIsMenuOpen(true)}>
                    <Ionicons name="menu" size={32} color={PRIMARY_COLOR} />
                </TouchableOpacity>
            </View>

            <View style={styles.gameContainer}>
                <WorldBackground 
                    worldTransform={{ transform: mapContentTransform }}
                    textureType="GRASS"
                />

                <Animated.View style={[styles.mapObjectContainer, { transform: mapContentTransform }]}>
                    <View 
                        style={[
                            styles.building, 
                            { 
                                width: welcomeCenter.size.width, 
                                height: welcomeCenter.size.height,
                                transform: [
                                    { translateX: buildingMapPosition.x }, 
                                    { translateY: buildingMapPosition.y }
                                ]
                            }
                        ]} 
                    >
                        <Text style={styles.buildingLabel}>{welcomeCenter.name}</Text>
                        <View style={[styles.buildingDoor, { left: welcomeCenter.door.x - 10, top: welcomeCenter.door.y - 10 }]} />
                    </View>
                </Animated.View>

                <Player 
                    activeDirection={activeDirection}
                    customization={customization}
                    playerCenterStyle={playerCenterStyle}
                />
            </View>
            
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
                        <Text style={styles.buttonPlaceholderText}>Interaction</Text>
                    </View>
                </View>
            </View>

            {isMenuOpen && (
                <HamburgerMenu 
                    onClose={() => setIsMenuOpen(false)} 
                    activeItems={menuKeys} 
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    fullContainer: { flex: 1, paddingTop: Platform.OS === 'android' ? 30 : 50 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingHorizontal: 20, marginBottom: 10 },
    headerTitle: { fontSize: 22, fontWeight: '700', color: PRIMARY_COLOR },
    gameContainer: { flex: 1, width: '100%', overflow: 'hidden', position: 'relative' },
    mapObjectContainer: { position: 'absolute', top: 0, left: 0 },
    building: { position: 'absolute', backgroundColor: '#D16666', borderRadius: 5, borderWidth: 3, borderColor: 'white', shadowColor: '#000', shadowOpacity: 0.5, shadowRadius: 5, elevation: 5, justifyContent: 'center', alignItems: 'center', padding: 5 },
    buildingLabel: { position: 'absolute', top: -20, fontSize: 12, fontWeight: 'bold', color: textColor, backgroundColor: 'rgba(255, 255, 255, 0.7)', paddingHorizontal: 5, borderRadius: 3 },
    buildingDoor: { position: 'absolute', width: 20, height: 10, backgroundColor: '#A0522D', borderRadius: 2, bottom: 0, alignSelf: 'center' },
    controlsContainer: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', padding: 20, width: '100%', backgroundColor: '#EAEAEA', borderTopWidth: 1, borderTopColor: '#DDDDDD' },
    dPad: { width: 120, height: 120, backgroundColor: dPadColor, borderRadius: 15, padding: 5 },
    dPadRow: { flexDirection: 'row', justifyContent: 'space-between', height: '33.33%' },
    dPadButton: { width: 35, height: 35, backgroundColor: menuColor, borderRadius: 5, justifyContent: 'center', alignItems: 'center', margin: 2, shadowColor: '#000', shadowOpacity: 0.4, shadowRadius: 1, elevation: 2 },
    dPadCenter: { width: 35, height: 35, margin: 2 },
    dPadPlaceholder: { width: 35, height: 35, margin: 2 },
    actionButtons: { width: 120, height: 120, justifyContent: 'center', alignItems: 'center' },
    buttonPlaceholder: { backgroundColor: '#999', padding: 10, borderRadius: 5 },
    buttonPlaceholderText: { color: 'white', fontWeight: 'bold' }
});

export default WorldScreen;

                        
