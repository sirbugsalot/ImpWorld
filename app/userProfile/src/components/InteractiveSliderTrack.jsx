import React, { useState, useCallback } from 'react';
import { View } from 'react-native';
import { styles } from '../styles/avatarStyles'; // Correct path
import { THUMB_SIZE } from '../constants'; // Correct path

/**
 * Reusable component for horizontal or vertical slider track interaction.
 * FIX: Re-verified touch calculation for horizontal orientation to ensure it moves off the minimum value.
 */
const InteractiveSliderTrack = ({ parameterKey, value, min, max, orientation, handleUpdate, shapeHeight }) => {
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
            // Vertical: Touch is measured from top (0) down (dimension). We need to invert it.
            ratio = (dimension - touchPos) / dimension;
        } else {
            // Horizontal: Touch is measured from left (0) right (dimension).
            // This is the width slider fix: ensuring ratio correctly maps the touch movement.
            ratio = touchPos / dimension;
        }

        // Clamp ratio between 0 and 1
        const clampedRatio = Math.max(0, Math.min(1, ratio));

        // Map ratio back to the value range (min to max)
        let newValue = min + clampedRatio * range;
        
        // Round to nearest integer for clean parameter updates
        newValue = Math.round(newValue);

        // Ensure the new value is absolutely within the allowed min/max range before updating.
        newValue = Math.max(min, Math.min(max, newValue));

        // Waist specific clamping (Waist cannot exceed height)
        if (parameterKey === 'waist') {
            newValue = Math.min(newValue, shapeHeight);
        }

        handleUpdate(parameterKey, newValue);
    }, [trackDimension, isVertical, min, range, parameterKey, handleUpdate, shapeHeight, max]);

    const trackStyle = isVertical ? styles.verticalTrack : styles.horizontalTrack;
    const fillStyle = isVertical ? styles.verticalFill : styles.horizontalFill;
    const thumbStyle = isVertical ? styles.verticalThumb : styles.horizontalThumb;
    
    const fillPosition = isVertical 
        ? { height: `${normalizedPosition * 100}%`, alignSelf: 'flex-end' } 
        : { width: `${normalizedPosition * 100}%` };

    const thumbTranslation = THUMB_SIZE / 2;
    const thumbOffset = normalizedPosition * 100;

    const thumbPosition = isVertical 
        ? { 
            // Vertical: bottom=0% means min value, bottom=100% means max value
            bottom: `${thumbOffset}%`, 
            // Translate by half the thumb size to center it on the track end
            transform: [{ translateY: thumbTranslation }] 
          } 
        : { 
            // Horizontal: left=0% means min value, left=100% means max value
            left: `${thumbOffset}%`, 
            // Translate by half the thumb size to center it on the track end
            transform: [{ translateX: -thumbTranslation }] 
          }; 

    return (
        <View 
            style={[trackStyle, styles.interactiveTrackShadow]}
            // Measure the track size on layout to get accurate dimension for calculation
            onLayout={(e) => {
                const dim = isVertical ? e.nativeEvent.layout.height : e.nativeEvent.layout.width;
                setTrackDimension(dim);
            }}
            // Use onTouchStart and onTouchMove for continuous/smooth dragging
            onTouchStart={handleSlide} 
            onTouchMove={handleSlide}
        >
            {/* Fill Indicator */}
            <View style={[fillStyle, fillPosition]} />
            {/* Thumb Indicator */}
            <View style={[thumbStyle, thumbPosition]} />
        </View>
    );
};

export default InteractiveSliderTrack;

    
