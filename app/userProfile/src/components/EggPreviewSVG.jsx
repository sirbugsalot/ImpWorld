import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

// The component will draw entirely within a 100x100 coordinate system
const VIEWBOX_SIZE = 100; 
// Must be consistent with the coordinate used in the parent component for the base
const EGG_VIEWBOX_BASE_Y = 70; 

/**
 * Renders the custom avatar shape (Egg) and its draggable handles.
 * All coordinates and geometry are calculated using the 100x100 viewBox units.
 * @param {object} props - Component props.
 * @param {string} props.color - Fill color of the shape.
 * @param {object} props.shape - Shape parameters (hy=Height Dimension, wx=Width Dimension, wy=Waist Y-Coordinate).
 */
const EggPreviewSVG = ({ color, shape }) => {
 
    // Use optional chaining and default values to prevent crashes if shape is missing during initialization
    const { 
        hy = 40, // Default height
        wx = 50, // Default width
        wy = 55  // Default waist Y
    } = shape || {}; 

    const bottomY = EGG_VIEWBOX_BASE_Y; // The fixed Y-coordinate of the egg's base
    
    // Calculate top Y-coordinate by subtracting the height dimension (hy) from the fixed base coordinate (bottomY).
    const topY = bottomY - hy; 
    
    const centerX = VIEWBOX_SIZE / 2; // 50

    // --- Calculate the vertices (draggable handles) based on shape dimensions ---
    // Ensure numeric values are used for coordinates
    const eggVertices = [
        { 
            x: centerX, 
            y: Number(topY) 
        },
        { 
            x: centerX + Number(wx) / 2, 
            y: Number(wy) 
        }
    ];
    // --- END CALCULATION ---
    
    // --- Fixed Light Theme Colors ---
    const frameFill = '#F9FAFB';
    const frameStroke = '#D1D5DB';

    // --- GEOMETRY CALCULATIONS ---
    const halfWidth = Number(wx) / 2;
    const rightX = centerX + halfWidth; 
    const leftX = centerX - halfWidth;  
    
    // Horizontal radius (rx) is half the total width
    const rx = halfWidth; 
    
    // --- Path Generation for two semi-ellipses (Half Ovals) ---
    
    // topRadiusY and bottomRadiusY are the vertical radii for the top and bottom arcs
    const topRadiusY = Number(wy) - topY; 
    const bottomRadiusY = bottomY - Number(wy); 
    
    // Start at the left waist point (leftX, wy)
    let d = `M ${leftX} ${wy}`;

    // 1. Bottom arc: From (leftX, wy) to (rightX, wy)
    d += ` A ${rx} ${bottomRadiusY} 0 0 1 ${rightX} ${wy}`; 

    // 2. Top arc: From (rightX, wy) back to (leftX, wy)
    d += ` A ${rx} ${topRadiusY} 0 0 1 ${leftX} ${wy}`; 

    const eggPath = d;
    
    return (
        // *** CRITICAL FIX: Add pointerEvents="none" to ensure touch events pass through to the parent <View> where the drag logic lives. ***
        <Svg 
            height="100%" 
            width="90%" 
            viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
            pointerEvents="none" 
        >
            {/* Background Frame/Reference */}
            <Path 
                d="M 5 5 L 95 5 L 95 95 L 5 95 Z"
                fill={frameFill}
                stroke={frameStroke}
                strokeWidth="1"
            />
            
            {/* The Egg Shape */}
            <Path
                d={eggPath}
                fill={color || '#059669'}
                stroke="#6B7280"
                strokeWidth="1"
            />
            
            {/* Base Anchor Line */}
            <Path
                d={`M 20 ${bottomY} L 80 ${bottomY}`}
                stroke="#E94949"
                strokeWidth="1"
                strokeDasharray="4 4"
                strokeOpacity="0.5"
            />
            
            {/* Waist Anchor Line */}
            <Path
                d={`M 20 ${wy} L 80 ${wy}`}
                stroke="#3B82F6"
                strokeWidth="1"
                strokeDasharray="4 4"
                strokeOpacity="0.5"
            />
            
            {/* Draggable Handles */}
            {Array.isArray(eggVertices) && eggVertices.length > 0 && eggVertices.map((vertex, index) => (
                <Circle
                    key={index}
                    cx={vertex.x}
                    cy={vertex.y}
                    r={3} // Handle size in viewBox units
                    fill={index === 0 ? 'red' : 'blue'} // Top (red), Waist (blue)
                    stroke="white"
                    strokeWidth="1"
                />
            ))}
        </Svg>
    );
};

export default EggPreviewSVG;
