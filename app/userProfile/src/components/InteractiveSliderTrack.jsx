import React, { useState, useCallback } from 'react';
import { View, Text } from 'react-native'; 
import { styles } from '../styles/avatarStyles'; 
import { THUMB_SIZE } from '../constants'; 

/**
 * Reusable component for horizontal or vertical slider track interaction.
 * The function returns an ABSOLUTE value (min to max), which is now 10-100 percentage.
 */
const InteractiveSlider = ({ parameterKey, value, min, max, orientation, handleUpdate, shapeHeight }) => {
    // trackDimension will be height for vertical, width for horizontal
    const [trackDimension, setTrackDimension] = useState(0); 
    const isVertical = orientation === 'vertical';
    const range = max - min;
    
    // Normalized position of the current value (0 to 1)
    const normalizedPosition = (value - min) / range;

    // Handler for direct sliding/tapping on the track
    const handleSlide = useCallback((e) => {
        if (!trackDimension || range === 0) return;

        // locationX/Y are coordinates relative to the track's bounding box.
        const touchPos = isVertical ? e.nativeEvent.locationY : e.nativeEvent.locationX;
        const dimension = trackDimension;
        
        // Calculate position as a ratio (0.0 to 1.0)
        let ratio;
        
        if (isVertical) {
            // Vertical: Touch measures DOWN from the top (0). We want value to INCREASE UP.
            // Invert the touch position:
            ratio = (dimension - touchPos) / dimension;
        } else {
            // Horizontal: Touch measures RIGHT from the left (0).
            ratio = touchPos / dimension;
        }

        // Clamp ratio between 0 and 1
        const clampedRatio = Math.max(0, Math.min(1, ratio));

        // Map ratio back to the absolute value range (min to max)
        let newValue = min + clampedRatio * range;
        
        // Round to nearest integer for clean parameter updates
        newValue = Math.round(newValue);

        // Ensure the new value is absolutely within the allowed min/max range (10-100).
        newValue = Math.max(min, Math.min(max, newValue));

        handleUpdate(parameterKey, newValue);
    }, [trackDimension, isVertical, min, range, parameterKey, handleUpdate, max]);

    const trackStyle = isVertical ? styles.verticalTrack : styles.horizontalTrack;
    const fillStyle = isVertical ? styles.verticalFill : styles.horizontalFill;
    const thumbStyle = isVertical ? styles.verticalThumb : styles.horizontalThumb;
    
    // Fill size calculation
    const fillPosition = isVertical 
        ? { height: `${normalizedPosition * 100}%`, alignSelf: 'flex-end' } 
        : { width: `${normalizedPosition * 100}%` };

    const thumbTranslation = THUMB_SIZE / 2;
    const thumbOffset = normalizedPosition * 100;

    // Thumb position calculation
    const thumbPosition = isVertical 
        ? { 
            bottom: `${thumbOffset}%`, 
            transform: [{ translateY: thumbTranslation }] 
          } 
        : { 
            left: `${thumbOffset}%`, 
            transform: [{ translateX: -thumbTranslation }] 
          }; 

    return (
        <View style={styles.horizontalSliderWrapper}>
            <View 
                style={[trackStyle, styles.interactiveTrackShadow]}
                // Measure the track size on layout to get accurate dimension for calculation
                onLayout={(e) => {
                    const dim = isVertical ? e.nativeEvent.layout.height : e.nativeEvent.layout.width;
                    setTrackDimension(dim);
                }}
                // Use onTouchStart (for initial tap) and onTouchMove (for dragging)
                onTouchStart={handleSlide} 
                onTouchMove={handleSlide}
            >
                {/* Fill Indicator */}
                <View style={[fillStyle, fillPosition]} />
                {/* Thumb Indicator */}
                <View style={[thumbStyle, thumbPosition]} />
            </View>
        </View>
    );
};

export default InteractiveSlider;

                    
