import React, { useRef } from 'react';
import { View, PanResponder, StyleSheet } from 'react-native';
import Svg, { G, Path, Circle } from 'react-native-svg';
import { Oval, Feet } from './shapes'; // Ensure Feet is exported from shapes.jsx

const EggPreviewSVG = ({ 
    color, 
    shape, 
    type, 
    footLength = 1.0, 
    activeCategory = 'BODY', 
    onShapeChange, 
    onFootChange 
}) => {
    const { hy, wx, wy } = shape;
    const pos = { x: 50, y: 80 }; // Shared pivot point

    // --- BODY RESPONDERS ---
    const heightResponder = useRef(PanResponder.create({
        onStartShouldSetPanResponder: () => activeCategory === 'BODY',
        onPanResponderMove: (_, gesture) => {
            const newHy = Math.max(40, Math.min(95, hy - gesture.dy / 2));
            onShapeChange({ ...shape, hy: newHy });
        }
    })).current;

    const widthResponder = useRef(PanResponder.create({
        onStartShouldSetPanResponder: () => activeCategory === 'BODY',
        onPanResponderMove: (_, gesture) => {
            const newWx = Math.max(20, Math.min(80, wx + gesture.dx / 2));
            onShapeChange({ ...shape, wx: newWx });
        }
    })).current;

    // --- FEET RESPONDER ---
    const feetResponder = useRef(PanResponder.create({
        onStartShouldSetPanResponder: () => activeCategory === 'FEET',
        onPanResponderMove: (_, gesture) => {
            const newLen = Math.max(0.2, Math.min(3.0, footLength - gesture.dy * 0.02));
            if (onFootChange) onFootChange(newLen);
        }
    })).current;

    return (
        <View style={styles.container}>
            <Svg viewBox="0 0 100 100" width="100%" height="100%">
                <G>
                    {/* Only render feet if type is 'imp' */}
                    {type === 'imp' && (
                        <Feet pos={pos} shape={shape} color={color} length={footLength} />
                    )}

                    <Oval pos={pos} shape={shape} color={color} />
                </G>
            </Svg>

            {/* --- INTERACTIVE DOTS --- */}

            {/* Height/Width dots: Always present, only active/visible when category is BODY */}
            <View 
                {...heightResponder.panHandlers}
                style={[
                    styles.dot, 
                    { left: '50%', top: `${pos.y - hy}%`, opacity: activeCategory === 'BODY' ? 1 : 0 }
                ]}
            />
            <View 
                {...widthResponder.panHandlers}
                style={[
                    styles.dot, 
                    { left: `${pos.x + wx/2}%`, top: `${wy}%`, opacity: activeCategory === 'BODY' ? 1 : 0 }
                ]}
            />

            {/* Foot Length dot: Only visible when category is FEET and type is 'imp' */}
            {type === 'imp' && (
                <View 
                    {...feetResponder.panHandlers}
                    style={[
                        styles.dot, 
                        { 
                            left: `${pos.x}%`, 
                            top: `${pos.y - 10}%`, 
                            backgroundColor: '#3B82F6', 
                            opacity: activeCategory === 'FEET' ? 1 : 0 
                        }
                    ]}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { width: '100%', aspectRatio: 1, position: 'relative' },
    dot: {
        position: 'absolute',
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: '#10B981',
        borderWidth: 3,
        borderColor: 'white',
        transform: [{ translateX: -13 }, { translateY: -13 }],
        zIndex: 100
    }
});

export default EggPreviewSVG;

