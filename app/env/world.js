import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform, Dimensions, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

import Building from './building'; 
import WorldBackground from './bckgrd'; 
import Player, { BLOB_WIDTH, BLOB_HEIGHT } from './player'; 
import HamburgerMenu from '../src/components/HamburgerMenu';
import { PRIMARY_COLOR, INITIAL_DARK_MODE, DARK_BG_COLOR, LIGHT_BG_COLOR } from '../src/utils/constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SCREEN_HEIGHT = Dimensions.get('window').height - (Platform.OS === 'android' ? 100 : 120) - 160; 

const STEP_SIZE = 4;
const MOVEMENT_SPEED_MS = 25; 

const welcomeCenter = new Building('Welcome Center', 'rectangle', { width: 100, height: 80 }, { x: 50, y: 75 });
const buildingMapPosition = { x: 50, y: 100 };

const WorldScreen = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeDirection, setActiveDirection] = useState(null); 
    const movementIntervalRef = useRef(null);

    const initialOffsetX = -(buildingMapPosition.x - (SCREEN_WIDTH / 2));
    const initialOffsetY = -(buildingMapPosition.y + 150 - (SCREEN_HEIGHT / 2)); 
    
    const worldOffsetAnim = useRef(new Animated.ValueXY({ x: initialOffsetX, y: initialOffsetY })).current;
    const worldOffsetRef = useRef({ x: initialOffsetX, y: initialOffsetY });

    const moveWorld = (direction) => {
        let { x, y } = worldOffsetRef.current;
        if (direction === 'up') y += STEP_SIZE;
        if (direction === 'down') y -= STEP_SIZE;
        if (direction === 'left') x += STEP_SIZE;
        if (direction === 'right') x -= STEP_SIZE;

        worldOffsetAnim.setValue({ x, y });
        worldOffsetRef.current = { x, y };
    };

    useEffect(() => {
        if (activeDirection) {
            movementIntervalRef.current = setInterval(() => moveWorld(activeDirection), MOVEMENT_SPEED_MS);
        } else {
            clearInterval(movementIntervalRef.current);
        }
        return () => clearInterval(movementIntervalRef.current);
    }, [activeDirection]); 

    const renderDpadButton = (direction, iconName) => (
        <TouchableOpacity 
            style={styles.dPadButton} 
            onPressIn={() => setActiveDirection(direction)}
            onPressOut={() => setTimeout(() => setActiveDirection(null), 50)}
        >
            <Ionicons name={iconName} size={20} color="white" />
        </TouchableOpacity>
    );

    return (
        <View style={[styles.fullContainer, { backgroundColor: INITIAL_DARK_MODE ? DARK_BG_COLOR : LIGHT_BG_COLOR }]}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Imp World</Text>
                <TouchableOpacity onPress={() => setIsMenuOpen(true)}>
                    <Ionicons name="menu" size={32} color={PRIMARY_COLOR} />
                </TouchableOpacity>
            </View>

            <View style={styles.gameContainer}>
                <WorldBackground worldTransform={{ transform: worldOffsetAnim.getTranslateTransform() }} textureType="GRASS" />
                <Animated.View style={[styles.mapObjectContainer, { transform: worldOffsetAnim.getTranslateTransform() }]}>
                    <View style={[styles.building, { transform: [{ translateX: buildingMapPosition.x }, { translateY: buildingMapPosition.y }] }]}>
                        <Text style={styles.buildingLabel}>{welcomeCenter.name}</Text>
                        <View style={styles.buildingDoor} />
                    </View>
                </Animated.View>
                <Player 
                    activeDirection={activeDirection} 
                    customization={{ color: '#8A2BE2' }} 
                    playerCenterStyle={{ left: SCREEN_WIDTH / 2 - BLOB_WIDTH / 2, top: SCREEN_HEIGHT / 2 - BLOB_HEIGHT / 2 }} 
                />
            </View>
            
            <View style={styles.controlsContainer}>
                <View style={styles.dPad}>
                    <View style={styles.dPadRow}>{renderDpadButton('up', 'arrow-up')}</View>
                    <View style={styles.dPadRow}>
                        {renderDpadButton('left', 'arrow-back')}
                        <View style={{ width: 35 }} />
                        {renderDpadButton('right', 'arrow-forward')}
                    </View>
                    <View style={styles.dPadRow}>{renderDpadButton('down', 'arrow-down')}</View>
                </View>
            </View>

            {isMenuOpen && <HamburgerMenu onClose={() => setIsMenuOpen(false)} activeItems={['home', 'profile', 'settings']} />}
        </View>
    );
};

const styles = StyleSheet.create({
    fullContainer: { flex: 1, paddingTop: Platform.OS === 'ios' ? 60 : 40 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 10 },
    headerTitle: { fontSize: 22, fontWeight: '700', color: PRIMARY_COLOR },
    gameContainer: { flex: 1, overflow: 'hidden' },
    mapObjectContainer: { position: 'absolute' },
    building: { width: 100, height: 80, backgroundColor: '#D16666', borderRadius: 5, borderWidth: 3, borderColor: 'white', alignItems: 'center' },
    buildingLabel: { position: 'absolute', top: -20, fontSize: 12, fontWeight: 'bold' },
    buildingDoor: { position: 'absolute', width: 20, height: 10, backgroundColor: '#A0522D', bottom: 0 },
    controlsContainer: { padding: 20, backgroundColor: '#EAEAEA', alignItems: 'center' },
    dPad: { width: 120, height: 120, backgroundColor: '#555', borderRadius: 15, padding: 5 },
    dPadRow: { flexDirection: 'row', justifyContent: 'center', height: '33.33%' },
    dPadButton: { width: 35, height: 35, backgroundColor: '#4B5563', borderRadius: 5, justifyContent: 'center', alignItems: 'center', margin: 2 }
});

export default WorldScreen;

                            
