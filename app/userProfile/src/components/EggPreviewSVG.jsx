import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { BASE_Y_ANCHOR, windowWidth } from '../constants'; // Correct path

// --- Fixed Geometric Constants (Based on your request) ---
// These values define the default egg shape within the 100x100 SVG viewbox.

// ViewBox units (5% padding means drawing area is effectively 90x90)
// To keep the math simple, we use a 100x100 viewBox and center the shape.

const EGG_BASE_Y = BASE_Y_ANCHOR;            // Y-coordinate for the bottom of the egg (Fixed at ~35% down from top of frame)

/**
 * Renders the custom avatar shape (Egg) using the fixed geometric constraints.
 * This component is self-contained and does not rely on external slider inputs yet.
 * * @param {object} props - Component props.
 * @param {string} props.color - Fill color of the shape.
 * @param {object} props.shape - Shape parameters (width, height, waist).
 */
const EggPreviewSVG = ({ color, shape }) => {
    // We ignore the 'shape' prop for now, and use the fixed constants for initialization
    // const { width, height, waist } = shape; 
    
    // --- Anchor Points ---
    const shapeWidth = shape.width;
    const shapeHeight = shape.height;
    const shapeWaist = shape.waist;
    
    // Bottom Y coordinate is fixed
    const bottomY = EGG_BASE_Y; 
    
    // Top Y coordinate is calculated based on height
    const topY = bottomY - shapeHeight; // EGG_BASE_Y - EGG_FIXED_HEIGHT (e.g., 70 - 40 = 30)
    
    // X coordinates remain centered
    const centerX = 0.5*windowWidth; 
    const leftX = centerX - centerX;     // 50 - 20 = 30
    const rightX = centerX + centerX;    // 50 + 20 = 70

    // --- Waist Calculation ---
    // Waist position is given as a percentage of the total egg height (40%)
    const waistY = bottomY - shapeHeight*shapeWaist;
    
    // --- Path Generation for two semi-ellipses (Half Ovals) ---
    
    // 1. Top Semi-Ellipse (height from topY to waistY)
    const topRadiusY = waistY - topY; // e.g., 46 - 30 = 16

    // 2. Bottom Semi-Ellipse (height from waistY to bottomY)
    const bottomRadiusY = bottomY - waistY; // e.g., 70 - 46 = 24

    // Start at the left waist point (leftX, waistY)
    let d = `M ${leftX} ${waistY}`;

    // A. Draw the top semi-oval (Arc curve to the right waist point)
    // rx = shapeWidth, ry = topRadiusY
    d += ` A ${shapeWidth} ${topRadiusY} 0 0 0 ${rightX} ${waistY}`;

    // B. Draw the bottom semi-oval (Arc curve back to the left waist point)
    // rx = shapeWidth, ry = bottomRadiusY
    d += ` A ${shapeWidth} ${bottomRadiusY} 0 0 0 ${leftX} ${waistY}`;

    const eggPath = d;
    
    return (
        // The container frame needs to be slightly smaller than 100% to simulate 5% padding
        <Svg height="100%" width="100%" viewBox="0 0 100 100">
            {/* Background Frame/Reference (Visual cue for the 100x100 space) */}
            <Path 
                d="M 5 5 L 95 5 L 95 95 L 5 95 Z"
                fill="#E5E7EB"
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
            
            {/* Base Anchor Line (Visual confirmation the base is at Y=70) */}
             <Path
                d={`M 20 ${EGG_BASE_Y} L 80 ${EGG_BASE_Y}`}
                stroke="#E94949"
                strokeWidth="1"
                strokeDasharray="4 4"
                strokeOpacity="0.5"
            />
        </Svg>
    );
};

export default EggPreviewSVG;

