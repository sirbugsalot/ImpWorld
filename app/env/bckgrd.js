import React from 'react';
import { StyleSheet, Dimensions, Animated } from 'react-native'; 
import { LinearGradient } from 'expo-linear-gradient';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

// --- Defined Texture Sets ---
export const TEXTURES = {
    GRASS: {
        startColor: '#A9D18E', // Pastel Green Start
        endColor: '#7FC060',   // Pastel Green End
        // Multiplier controls how large the simulated world is
        sizeMultiplier: 100,
    },
    PATH: {
        startColor: '#BCAAA4', // Light brown
        endColor: '#A1887F', 
        sizeMultiplier: 50,
    },
    WATER: {
        startColor: '#4DD0E1', // Cyan
        endColor: '#00BCD4',
        sizeMultiplier: 30,
    }
};

/**
 * Renders the World Background.
 * This component renders a massive area filled with a texture and applies the camera offset.
 * * @param {object} props
 * @param {object} props.worldTransform - The Animated transform style object from the parent.
 * @param {string} props.textureType - Key from the TEXTURES object.
 */
const WorldBackground = ({ worldTransform, textureType = 'GRASS' }) => {
    const texture = TEXTURES[textureType] || TEXTURES.GRASS;
    
    // Set a very large size for the background to create the "infinite" illusion.
    const mapWidth = SCREEN_WIDTH * texture.sizeMultiplier;
    const mapHeight = SCREEN_HEIGHT * texture.sizeMultiplier;

    return (
        // The Animated.View receives the transform for the camera movement (worldOffset)
        <Animated.View 
            style={[
                styles.backgroundContainer, 
                // Set the massive size and offset the origin to the center of this huge map
                { 
                    width: mapWidth, 
                    height: mapHeight, 
                    left: -mapWidth/2, 
                    top: -mapHeight/2 
                }, 
                worldTransform
            ]}
        >
            {/* The LinearGradient fills the entire massive container */}
            <LinearGradient
                colors={[texture.startColor, texture.endColor]}
                start={{ x: 0.1, y: 0.1 }}
                end={{ x: 0.9, y: 0.9 }}
                style={StyleSheet.absoluteFillObject}
            />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    backgroundContainer: {
        position: 'absolute',
    }
});


export default WorldBackground;
