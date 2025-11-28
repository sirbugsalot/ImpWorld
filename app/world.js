import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; 
import { LinearGradient } from 'expo-linear-gradient'; 

// Constants based on screen size
const SCREEN_WIDTH = Dimensions.get('window').width;
// Calculate height remaining after header (50+10+20) and controls (120+40)
const SCREEN_HEIGHT = Dimensions.get('window').height - (Platform.OS === 'android' ? 100 : 120) - 160; 

const STEP_SIZE = 4; // Reduced step size for smoother continuous movement
const MOVEMENT_SPEED_MS = 25; // How often the movement is updated

const BLOB_SIZE = 40;

// New Pastel/Aesthetic Colors
const primaryColor = '#1D4ED8'; 
const menuColor = '#4B5563'; 
const dPadColor = '#555555'; 
const textColor = '#1F2937';

// --- FIXED Gradient Palette ---
// Increased contrast for better visibility of the texture effect
const pastelGrassStart = '#A9D18E'; // Light, soft green
const pastelGrassEnd = '#7FC060';   // A darker, more distinct shade of pastel green 

// --- Settings Dropdown Component (Reused) ---
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
    const [blobPosition, setBlobPosition] = useState({ 
        x: SCREEN_WIDTH / 2 - BLOB_SIZE / 2, 
        y: SCREEN_HEIGHT / 2 - BLOB_SIZE / 2 
    });

    // State to track the currently active direction (for continuous movement)
    const [activeDirection, setActiveDirection] = useState(null); 
    
    // Ref to hold the interval ID, ensuring it's not recreated on every render
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
                default: return currentPos; // No movement if direction is null
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
            // Clear any existing interval before starting a new one
            clearInterval(movementIntervalRef.current);
            
            // Start the interval for continuous movement
            movementIntervalRef.current = setInterval(() => {
                // We use the activeDirection in the closure
                moveBlob(activeDirection); 
            }, MOVEMENT_SPEED_MS);
        } else {
            // Stop movement when the active direction is null (onPressOut)
            clearInterval(movementIntervalRef.current);
        }

        // Cleanup function: important to clear the interval when the component unmounts
        return () => clearInterval(movementIntervalRef.current);
    }, [activeDirection]); // Reruns whenever the active direction changes

    // --- HANDLERS for D-Pad Touch Events ---

    // Sets the direction and starts the interval (via useEffect)
    const handlePressIn = (direction) => {
        setActiveDirection(direction);
    };

    // Clears the direction and stops the interval (via useEffect)
    const handlePressOut = () => {
        // Set a small delay to prevent immediate stop if the user slides to a different button
        setTimeout(() => setActiveDirection(null), 50); 
    };

    // Renders a D-Pad button with movement handlers
    const renderDpadButton = (direction, iconName) => (
        <TouchableOpacity 
            style={styles.dPadButton} 
            // New continuous press events
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
                    // Adjusting start/end points to make the gradient more diagonal/noticeable
                    start={{ x: 0.1, y: 0.1 }}
                    end={{ x: 0.9, y: 0.9 }}
                    style={styles.mapArea}
                >
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
                
                {/* D-Pad (Cross) */}
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
        flex: 1, 
        width: '100%',
    },
    mapArea: {
        flex: 1,
        width: '100%',
        position: 'relative',
    },
    blob: {
        position: 'absolute',
        width: BLOB_SIZE,
        height: BLOB_SIZE,
        borderRadius: BLOB_SIZE / 2,
        backgroundColor: '#FF66B2', 
        zIndex: 10,
    },
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
        // Optional: Adding a slight shadow/depth for better tactile feedback
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
    // --- Dropdown Styles ---
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
