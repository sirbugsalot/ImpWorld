import React, { useRef } from 'react';
import { View, PanResponder, StyleSheet } from 'react-native';
import Svg, { G, Circle, Path } from 'react-native-svg';
import { Oval, Feet } from './shapes';

const Imp = ({ 
    customization, 
    setCustomization, 
    activeCategory = 'Body' 
}) => {
    const { 
        color = '#8A2BE2', 
        pos = { x: 50, y: 80 },
        shape = { hy: 80, wx: 50, wy: 60 }, 
        patternId = null, 
        patternColor = '#FFFFFF',
        footLength = 1.0,
        eyeSize = 5
    } = customization || {};

    // Helper to update specific nested values
    const updateShape = (key, value) => {
        setCustomization(prev => ({
            ...prev,
            shape: { ...prev.shape, [key]: value }
        }));
    };

    // --- BODY HANDLERS (Same logic as Egg) ---
    const bodyPan = useRef(PanResponder.create({
        onStartShouldSetPanResponder: () => activeCategory === 'Body',
        onPanResponderMove: (_, gesture) => {
            // Vertical drag affects height (hy)
            const newHy = Math.max(40, Math.min(95, shape.hy - gesture.dy / 2));
            updateShape('hy', newHy);
        }
    })).current;

    const widthPan = useRef(PanResponder.create({
        onStartShouldSetPanResponder: () => activeCategory === 'Body',
        onPanResponderMove: (_, gesture) => {
            // Horizontal drag affects width (wx)
            const newWx = Math.max(20, Math.min(80, shape.wx + gesture.dx / 2));
            updateShape('wx', newWx);
        }
    })).current;

    // --- FEET HANDLERS ---
    const feetPan = useRef(PanResponder.create({
        onStartShouldSetPanResponder: () => activeCategory === 'Feet',
        onPanResponderMove: (_, gesture) => {
            const newLen = Math.max(0.2, Math.min(3.0, footLength - gesture.dy * 0.02));
            setCustomization(prev => ({ ...prev, footLength: newLen }));
        }
    })).current;

    return (
        <View style={styles.container}>
            <Svg viewBox="0 0 200 200" width="100%" height="100%">
                <G transform="scale(2)">
                    <Feet pos={pos} shape={shape} color={color} length={footLength} />
                    <Oval 
                        pos={pos} 
                        shape={shape} 
                        color={color} 
                        patternId={patternId} 
                        patternColor={patternColor} 
                    />
                </G>

                {/* Face Components (Static or modulated by Face category later) */}
                <G>
                    <Circle cx="80" cy="100" r={eyeSize} fill="#333" />
                    <Circle cx="120" cy="100" r={eyeSize} fill="#333" />
                    <Path d="M 85 125 Q 100 135, 115 125" stroke="#333" strokeWidth="2" fill="none" />
                </G>
            </Svg>

            {/* --- INTERACTIVE DOTS (Invisible unless active) --- */}
            
            {/* Height Dot (Body) */}
            <View 
                {...bodyPan.panHandlers}
                style={[
                    styles.dot, 
                    { left: '50%', top: `${pos.y - shape.hy}%`, opacity: activeCategory === 'Body' ? 1 : 0 }
                ]}
            />

            {/* Width Dot (Body) */}
            <View 
                {...widthPan.panHandlers}
                style={[
                    styles.dot, 
                    { left: `${pos.x + shape.wx/2}%`, top: `${shape.wy}%`, opacity: activeCategory === 'Body' ? 1 : 0 }
                ]}
            />

            {/* Foot Length Dot (Feet) - Placed at [pos.x, pos.y - 10] per your request */}
            <View 
                {...feetPan.panHandlers}
                style={[
                    styles.dot, 
                    { 
                        left: `${pos.x}%`, 
                        top: `${pos.y - 10}%`, 
                        backgroundColor: '#3B82F6',
                        opacity: activeCategory === 'Feet' ? 1 : 0 
                    }
                ]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { width: '100%', aspectRatio: 1, position: 'relative' },
    dot: {
        position: 'absolute',
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#10B981',
        borderWidth: 2,
        borderColor: 'white',
        transform: [{ translateX: -12 }, { translateY: -12 }],
        zIndex: 100
    }
});

export default Imp;

      
