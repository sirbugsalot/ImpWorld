import React, { useState, useCallback } from 'react';
import { View } from 'react-native';
import { styles } from '../styles/avatarStyles'; // Correct path
import { THUMB_SIZE } from '../constants'; // Correct path

/**
 * Reusable component for horizontal or vertical slider track interaction.
 * FIX: Reworked touch calculation for better stability and accuracy, especially horizontal.
 */
const InteractiveSliderTrack = ({ parameterKey, value, min, max, orientation, handleUpdate, shapeHeight }) => {
    const [trackDimension, setTrackDimension] = useState(0);
    const isVertical = orientation === 'vertical';
    const range = max - min;
    
    // Normalize the value to a percentage position (0 to 1)
    const normalizedPosition = (value - min) / range;

    // Handler for direct sliding/tapping on the track
    const handleSlide = useCallback((e) => {
        if (!trackDimension || range === 0) return;

        // Use location relative to the track's bounding box
        // locationX is the distance from the left edge of the track
        // locationY is the distance from the top edge of the track
        const touchPos = isVertical ? e.nativeEvent.locationY : e.nativeEvent.locationX;
        const dimension = trackDimension;
        
        // Calculate position as a ratio (0.0 to 1.0)
        let ratio;
        
        if (isVertical) {
            // Vertical sliders start at the bottom (0) and go up (1).
            // Touch events are measured from the top (0) down to the bottom (dimension).
            // We must invert: (dimension - touchPos) / dimension
            ratio = (dimension - touchPos) / dimension;
        } else {
            // Horizontal sliders start at the left (0) and go right (1).
            // Touch events are measured from the left (0) to the right (dimension).
            // Ratio is simply touch position divided by total track width.
            ratio = touchPos / dimension;
        }

        // Clamp ratio between 0 and 1
        const clampedRatio = Math.max(0, Math.min(1, ratio));

        // Map ratio back to the value range (min to max)
        let newValue = min + clampedRatio * range;
        
        // Round to nearest integer for clean parameter updates
        newValue = Math.round(newValue);

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

    // Positioning the thumb:
    const thumbPosition = isVertical 
        ? { 
            // Vertical: bottom=0% means min value, bottom=100% means max value
            bottom: `${thumbOffset}%`, 
            // Fix: Translate by half the thumb size to center it on the track end
            transform: [{ translateY: thumbTranslation }] 
          } 
        : { 
            // Horizontal: left=0% means min value, left=100% means max value
            left: `${thumbOffset}%`, 
            // Fix: Translate by half the thumb size to center it on the track end
            transform: [{ translateX: -thumbTranslation }] 
          }; 

    return (
        <View 
            style={[trackStyle, styles.interactiveTrackShadow]}
            onLayout={(e) => setTrackDimension(isVertical ? e.nativeEvent.layout.height : e.nativeEvent.layout.width)}
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

        
