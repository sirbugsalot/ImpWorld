import React, { useRef, useEffect } from 'react';
import { StyleSheet, Animated, Easing } from 'react-native';

// --- PLAYER CONSTANTS ---
const BLOB_WIDTH = 30;
const BLOB_HEIGHT = 40;
const BOUNCE_HEIGHT = 4; // Max vertical step distance
const BOUNCE_DURATION = 150; // Speed of half a step cycle

/**
 * Player component handles the visual representation and animation of the player.
 * It is fixed at the center of the viewport, while the world moves around it.
 * * @param {object} props
 * @param {string | null} props.activeDirection - The current direction of movement ('up', 'down', 'left', 'right', or null).
 * @param {object} props.customization - Object containing player customization details (e.g., { color: '#8A2BE2' }).
 * @param {object} props.playerCenterStyle - Calculated position styles to keep the avatar centered in the viewport.
 */
const Player = ({ activeDirection, customization, playerCenterStyle }) => {
    
    // Animated Value for the vertical bounce/step effect
    const bounceAnim = useRef(new Animated.Value(0)).current; 

    // Effect to manage the continuous bounce animation loop
    useEffect(() => {
        if (activeDirection) {
            // Start continuous bounce animation loop only when moving
            Animated.loop(
                Animated.sequence([
                    Animated.timing(bounceAnim, {
                        toValue: -BOUNCE_HEIGHT, // Move up (step)
                        duration: BOUNCE_DURATION,
                        easing: Easing.out(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(bounceAnim, {
                        toValue: 0, // Return to base
                        duration: BOUNCE_DURATION,
                        easing: Easing.in(Easing.ease),
                        useNativeDriver: true,
                    }),
                ])
            ).start();

        } else {
            // Stop and reset bounce animation gently when movement stops
            bounceAnim.stopAnimation();
            Animated.timing(bounceAnim, {
                toValue: 0, 
                duration: 100, 
                useNativeDriver: true
            }).start();
        }
        
        // Cleanup function for effect
        return () => {
            bounceAnim.stopAnimation();
        };
    }, [activeDirection]); 

    // Combine vertical bounce animation with fixed center style
    const playerStyle = {
        transform: [{ translateY: bounceAnim }], 
        backgroundColor: customization.color 
    };

    return (
        <Animated.View 
            style={[
                styles.player, 
                playerCenterStyle,
                playerStyle
            ]} 
        />
    );
};

const styles = StyleSheet.create({
    // --- PLAYER STYLES (Egg Shape) ---
    player: {
        position: 'absolute',
        width: BLOB_WIDTH, // Egg shape width
        height: BLOB_HEIGHT, // Egg shape height
        borderRadius: BLOB_HEIGHT / 2, // Creates the egg shape (taller than wide)
        zIndex: 10,
    },
});

export default Player;

// Export dimensions so WorldScreen can correctly calculate the center position
export { BLOB_WIDTH, BLOB_HEIGHT };
