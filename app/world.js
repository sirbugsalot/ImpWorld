import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; 

// Game constants
const MAP_SIZE = Dimensions.get('window').width * 0.8;
const STEP_SIZE = 16; // Movement speed
const BLOB_SIZE = 40;

const primaryColor = '#1D4ED8'; 
const menuColor = '#4B5563'; // Gray-600 for D-Pad background
const gameBgColor = '#225522'; // Dark moss green for GBA feel
const dPadColor = '#555555'; // Dark gray for D-pad background
const textColor = '#1F2937';

// --- Settings Dropdown Component (Reused) ---
const SettingsMenu = ({ onClose }) => {
    const router = useRouter();
    return (
        <View style={styles.dropdownContainer}>
            
            {/* Home Option: CRITICAL for navigating back */}
            <TouchableOpacity 
                style={styles.menuItem} 
                onPress={() => { router.replace('/'); onClose(); }}
            >
                <Text style={styles.menuItemText}>Home</Text>
            </TouchableOpacity>

            {/* Placeholder Menu Item 1: Version */}
            <TouchableOpacity 
                style={styles.menuItem} 
                onPress={() => { alert("Displaying Version Information..."); onClose(); }}
            >
                <Text style={styles.menuItemText}>Version</Text>
            </TouchableOpacity>

            {/* Placeholder Menu Item 2: Auth */}
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
    // State for the blob's position (center of the map area initially)
    const [blobPosition, setBlobPosition] = useState({ x: MAP_SIZE / 2 - BLOB_SIZE / 2, y: MAP_SIZE / 2 - BLOB_SIZE / 2 });

    // Function to handle movement in four directions
    const moveBlob = (direction) => {
        setBlobPosition(currentPos => {
            let newX = currentPos.x;
            let newY = currentPos.y;

            // Calculate new position based on direction
            switch (direction) {
                case 'up': newY -= STEP_SIZE; break;
                case 'down': newY += STEP_SIZE; break;
                case 'left': newX -= STEP_SIZE; break;
                case 'right': newX += STEP_SIZE; break;
            }

            // Boundary Check: Keep the blob within the map area
            const max = MAP_SIZE - BLOB_SIZE;
            newX = Math.max(0, Math.min(newX, max));
            newY = Math.max(0, Math.min(newY, max));

            return { x: newX, y: newY };
        });
    };

    return (
        <View style={styles.fullContainer}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Game World</Text>
                <TouchableOpacity onPress={() => setIsSettingsOpen(!isSettingsOpen)}>
                    <Ionicons name="menu" size={32} color={primaryColor} />
                </TouchableOpacity>
            </View>

            {/* Game Map Area (Dark Green Background) */}
            <View style={styles.gameContainer}>
                <View style={styles.mapArea}>
                    {/* Moveable Blob Character - Positioned absolutely via transform */}
                    <View 
                        style={[
                            styles.blob, 
                            { transform: [{ translateX: blobPosition.x }, { translateY: blobPosition.y }] }
                        ]} 
                    />
                </View>
            </View>
            
            {/* --- Controls and D-Pad Area --- */}
            <View style={styles.controlsContainer}>
                
                {/* D-Pad (Cross) */}
                <View style={styles.dPad}>
                    <View style={styles.dPadRow}>
                        <View style={styles.dPadPlaceholder} />
                        <TouchableOpacity style={styles.dPadButton} onPress={() => moveBlob('up')}>
                            <Ionicons name="arrow-up" size={20} color="white" />
                        </TouchableOpacity>
                        <View style={styles.dPadPlaceholder} />
                    </View>
                    <View style={styles.dPadRow}>
                        <TouchableOpacity style={styles.dPadButton} onPress={() => moveBlob('left')}>
                            <Ionicons name="arrow-back" size={20} color="white" />
                        </TouchableOpacity>
                        <View style={styles.dPadCenter} />
                        <TouchableOpacity style={styles.dPadButton} onPress={() => moveBlob('right')}>
                            <Ionicons name="arrow-forward" size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.dPadRow}>
                        <View style={styles.dPadPlaceholder} />
                        <TouchableOpacity style={styles.dPadButton} onPress={() => moveBlob('down')}>
                            <Ionicons name="arrow-down" size={20} color="white" />
                        </TouchableOpacity>
                        <View style={styles.dPadPlaceholder} />
                    </View>
                </View>

                <View style={styles.actionButtons}>
                    {/* Placeholder for future A/B buttons */}
                    <View style={styles.buttonPlaceholder}>
                        <Text style={styles.buttonPlaceholderText}>Action Buttons</Text>
                    </View>
                </View>
            </View>

            {/* Settings Dropdown Overlay */}
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
        flex: 1, // Takes up most vertical space
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
    },
    mapArea: {
        width: MAP_SIZE,
        height: MAP_SIZE,
        backgroundColor: gameBgColor, // Dark Green Background
        borderRadius: 10,
        overflow: 'hidden', // Ensures blob doesn't move outside the map
        position: 'relative',
        borderWidth: 5,
        borderColor: '#558855', // Lighter green border
    },
    blob: {
        position: 'absolute',
        width: BLOB_SIZE,
        height: BLOB_SIZE,
        borderRadius: BLOB_SIZE / 2,
        backgroundColor: '#FF66B2', // Pink blob for high contrast
        zIndex: 10,
    },
    controlsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: 20,
        width: '100%',
        backgroundColor: '#EAEAEA', // Light gray background for controls
        borderTopWidth: 1,
        borderTopColor: '#DDDDDD',
    },
    // --- D-Pad Styles ---
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
    // --- Action Buttons Placeholder ---
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
    // --- Dropdown Styles (Reused) ---
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
