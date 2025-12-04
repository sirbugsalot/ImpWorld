import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { 
    MIN_SVG_DIMENSION, 
    MAX_SVG_DIMENSION, 
    TRACK_THICKNESS 
} from '../constants'; // Correct path

/**
 * Renders the custom avatar shape (Egg or Humanoid) using SVG.
 * FIX: Anchored the base of the shape to Y=90 for stability.
 * @param {object} props - Component props.
 * @param {string} props.color - Fill color of the shape.
 * @param {object} props.shape - Shape parameters (width, height, waist).
 */
const EggPreviewSVG = ({ color, shape }) => {
    const { width, height, waist } = shape;

    // We normalize the dimensions (50-100) to fit within the SVG viewbox (0-100).
    const W = width; // 50-100
    const H = height; // 50-100
    const normalizedWaist = waist; // 0-100 (position of the waist line, 100 is top)
    
    // Scale factor to map dimensions to a suitable size within a 100x100 SVG viewbox
    const scaleFactor = 0.5;
    const shapeWidth = W * scaleFactor; // Scaled width (25 to 50)
    const shapeHeight = H * scaleFactor; // Scaled height (25 to 50)

    // --- FIX 1: Anchor the base of the shape at Y=90 (relative to 100 viewbox) ---
    const BASE_Y = 90; 
    
    // Bottom Y coordinate is fixed
    const bottomY = BASE_Y; 
    
    // Top Y coordinate changes with height
    const topY = bottomY - (2 * shapeHeight); 
    
    // X coordinates remain centered
    const centerX = 50; 
    const leftX = centerX - shapeWidth;
    const rightX = centerX + shapeWidth;

    // Waist Y coordinate (Waist parameter: 0 is bottom, 100 is top)
    const shapeTotalHeight = bottomY - topY;
    
    // Calculate vertical offset from the top based on the normalized waist value
    // (100 - normalizedWaist) / 100 gives a ratio where 0 is top, 1 is bottom.
    const waistVerticalRatio = (100 - normalizedWaist) / 100;
    
    // waistY is calculated from the top point (topY) downwards
    const waistY = topY + (waistVerticalRatio * shapeTotalHeight);

    // --- Path Generation for two semi-ellipses (Half Ovals) ---
    
    // 1. Top Semi-Ellipse (from topY to waistY)
    const topRadiusY = waistY - topY;

    // 2. Bottom Semi-Ellipse (from waistY to bottomY)
    const bottomRadiusY = bottomY - waistY;

    // Start at the left waist point (leftX, waistY)
    let d = `M ${leftX} ${waistY}`;

    // A. Draw the top semi-oval (Arc curve to the right waist point)
    // A rx ry x-axis-rotation large-arc-flag sweep-flag x y
    // Use large-arc-flag=0 and sweep-flag=0 for the top half (anti-clockwise)
    d += ` A ${shapeWidth} ${topRadiusY} 0 0 0 ${rightX} ${waistY}`;

    // B. Draw the bottom semi-oval (Arc curve back to the left waist point)
    // Use large-arc-flag=0 and sweep-flag=0 for the bottom half (anti-clockwise)
    d += ` A ${shapeWidth} ${bottomRadiusY} 0 0 0 ${leftX} ${waistY}`;

    // Final path string
    const eggPath = d;
    
    return (
        <Svg height="100%" width="100%" viewBox="0 0 100 100">
            {/* The Shape */}
            <Path
                d={eggPath}
                fill={color}
                stroke="#6B7280"
                strokeWidth="1"
            />
            {/* Waist Line (Visual indicator) */}
            <Path
                d={`M ${leftX} ${waistY} L ${rightX} ${waistY}`}
                stroke="#1F2937"
                strokeWidth="2"
                strokeDasharray="4 4"
            />
        </Svg>
    );
};

export default EggPreviewSVG;
