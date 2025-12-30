import React, { useRef, useEffect } from 'react';
import { StyleSheet, Animated, Easing, View } from 'react-native';
import Svg from 'react-native-svg';
import { Oval } from '../src/components/shapes';

// --- PLAYER CONSTANTS ---
// These dimensions now serve as the container for the SVG
const BLOB_WIDTH = 40; 
const BLOB_HEIGHT = 50;
const BOUNCE_HEIGHT = 6; 
const BOUNCE_DURATION = 150; 

/**
 * Player component handles the visual representation and animation of the player.
 * Now uses the shared Oval component for consistent rendering.
 */
const Player = ({ activeDirection, customization, playerCenterStyle }) => {
    
    // Animated Value for the vertical bounce/step effect
    const bounceAnim = useRef(new Animated.Value(0)).current; 

    // Effect to manage the continuous bounce animation loop
    useEffect(() => {
        if (activeDirection) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(bounceAnim, {
                        toValue: -BOUNCE_HEIGHT,
                        duration: BOUNCE_DURATION,
                        easing: Easing.out(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(bounceAnim, {
                        toValue: 0,
                        duration: BOUNCE_DURATION,
                        easing: Easing.in(Easing.ease),
                        useNativeDriver: true,
                    }),
                ])
            ).start();

        } else {
            bounceAnim.stopAnimation();
            Animated.timing(bounceAnim, {
                toValue: 0, 
                duration: 100, 
                useNativeDriver: true
            }).start();
        }
        
        return () => bounceAnim.stopAnimation();
    }, [activeDirection, bounceAnim]); 

    // Destructure customization with defaults to prevent crashes
    const { 
        color = '#8A2BE2', 
        shape = { hy: 60, wx: 40, wy: 35 }, 
        patternId = null, 
        patternColor = '#FFFFFF' 
    } = customization || {};

    return (
        <Animated.View 
            style={[
                styles.playerContainer, 
                playerCenterStyle,
                { transform: [{ translateY: bounceAnim }] }
            ]} 
        >
            <Svg 
                width={BLOB_WIDTH} 
                height={BLOB_HEIGHT} 
                viewBox="0 0 100 100"
            >
                <Oval 
                    pos={{ x: 50, y: 95 }} // Positioned near bottom of local 100x100 box
                    shape={shape} 
                    color={color} 
                    patternId={patternId} 
                    patternColor={patternColor} 
                />
            </Svg>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    playerContainer: {
        position: 'absolute',
        width: BLOB_WIDTH,
        height: BLOB_HEIGHT,
        zIndex: 10,
        // Remove background color as we are now using SVG
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Player;

export { BLOB_WIDTH, BLOB_HEIGHT };

