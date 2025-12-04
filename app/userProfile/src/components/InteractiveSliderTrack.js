import React, { useState, useCallback } from 'react';
import { View } from 'react-native';
import { styles } from '../styles/avatarStyles';
import { THUMB_SIZE } from '../constants';

/**
 * Reusable component for horizontal or vertical slider track interaction.
 */
const InteractiveSliderTrack = ({ parameterKey, value, min, max, orientation, handleUpdate, shapeHeight }) => {
    const [trackDimension, setTrackDimension] = useState(0);
    const isVertical = orientation === 'vertical';
    const range = max - min;
    
    // Normalize the value to a percentage position (0 to 100)
    const normalizedValue = ((value - min) / range) * 100;

    // Handler for direct sliding/tapping on the track
    const handleSlide = useCallback((e) => {
        if (!trackDimension) return;

        const touchPos = isVertical ? e.nativeEvent.locationY : e.nativeEvent.locationX;
        const dimension = trackDimension;

        let normalizedPos = touchPos / dimension;
        
        if (isVertical) {
            normalizedPos = 1 - normalizedPos; 
        }

        let newValue = Math.round(min + normalizedPos * range);
        
        // Waist specific clamping (Waist cannot exceed height)
        if (parameterKey === 'waist') {
            newValue = Math.min(newValue, shapeHeight);
        }

        const clampedValue = Math.max(min, Math.min(max, newValue));

        handleUpdate(parameterKey, clampedValue);
    }, [trackDimension, isVertical, min, range, parameterKey, handleUpdate, shapeHeight, max]);

    const trackStyle = isVertical ? styles.verticalTrack : styles.horizontalTrack;
    const fillStyle = isVertical ? styles.verticalFill : styles.horizontalFill;
    const thumbStyle = isVertical ? styles.verticalThumb : styles.horizontalThumb;
    
    const fillPosition = isVertical 
        ? { height: `${normalizedValue}%`, alignSelf: 'flex-end' } 
        : { width: `${normalizedValue}%` };

    const thumbTranslation = THUMB_SIZE / 2;
    const thumbPosition = isVertical 
        ? { bottom: `${normalizedValue}%`, transform: [{ translateY: normalizedValue === 100 ? 0 : thumbTranslation }] } 
        : { left: `${normalizedValue}%`, transform: [{ translateX: normalizedValue === 0 ? 0 : -thumbTranslation }] }; 

    return (
        <View 
            style={[trackStyle, styles.interactiveTrackShadow]}
            onLayout={(e) => setTrackDimension(isVertical ? e.nativeEvent.layout.height : e.nativeEvent.layout.width)}
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

