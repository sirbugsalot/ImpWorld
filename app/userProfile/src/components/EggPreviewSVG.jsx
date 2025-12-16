import React from 'react';
import Svg, { Path, Circle, Text } from 'react-native-svg'; // Added Text for the error message

/**
 * Renders the custom avatar shape (Egg) and its draggable handles.
 * All coordinates and geometry are calculated using the 100x100 viewBox units.
 * @param {object} props - Component props.
 * @param {string} props.color - Fill color of the shape.
 * @param {object} props.shape - Shape parameters (hy=Height Dimension, wx=Width Dimension, wy=Waist Y-Coordinate).
 * @param {Array<object>} props.eggVertices - Raw coordinates of the two draggable handles.
 */
const EggPreviewSVG = ({ color, shape }) => {
    const VIEWBOX_SIZE = 100
    
    // Destructured shape: Height (hy), Width (wx), Waist Y (wy)
    const { hy, wx, wy } = shape; 
    
    const bottomY = 70; // The fixed Y-coordinate of the egg's base
    
    // Calculate top Y-coordinate by subtracting the height dimension (hy) from the fixed base coordinate (bottomY).
    const topY = bottomY - hy; 
    
    const centerX = VIEWBOX_SIZE / 2; // 50
    const waistY = wy; 
    
    // --- GEOMETRY CALCULATIONS ---
    const halfWidth = wx / 2;
    const rightX = centerX + halfWidth; 
    const leftX = centerX - halfWidth;  

    // --- Calculate the vertices (draggable handles) based on shape dimensions ---
    const eggVertices = [
        { 
            x: centerX, 
            y: topY // Correct absolute Y coordinate: BaseY - hy
        },
        { 
            x: centerX + wx / 2, 
            y: wy // Correct absolute Y coordinate: wy
        }
    ];
    
    // Horizontal radius (rx) is half the total width
    const rx = halfWidth; 
    
    // --- Path Generation for two semi-ellipses (Half Ovals) ---
    
    // topRadiusY and bottomRadiusY are the vertical radii for the top and bottom arcs
    const topRadiusY = waistY - topY; 
    const bottomRadiusY = bottomY - waistY; 
    
    // Start at the left waist point (leftX, waistY)
    let d = `M ${leftX} ${waistY}`;

    // 1. Bottom arc: From (leftX, waistY) to (rightX, waistY)
    d += ` A ${rx} ${bottomRadiusY} 0 0 1 ${rightX} ${waistY}`; 

    // 2. Top arc: From (rightX, waistY) back to (leftX, waistY)
    d += ` A ${rx} ${topRadiusY} 0 0 1 ${leftX} ${waistY}`; 

    const eggPath = d;
    
    return (
        // Use 0 0 100 100 viewBox for internal relative drawing
        <Svg height="100%" width="90%" viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}>
            {/* Background Frame/Reference */}
            <Path 
                d="M 5 5 L 95 5 L 95 95 L 5 95 Z"
                fill="#F9FAFB"
                stroke="#D1D5DB"
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
                d={`M 20 ${waistY} L 80 ${waistY}`}
                stroke="#3B82F6"
                strokeWidth="1"
                strokeDasharray="4 4"
                strokeOpacity="0.5"
            />
            
            {/* Draggable Handles */}
            {/* Use an explicit check to ensure eggVertices is a valid array with elements */}
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
