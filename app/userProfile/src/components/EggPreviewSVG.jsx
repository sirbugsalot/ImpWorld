import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { 
    MIN_SVG_DIMENSION, 
    MAX_SVG_DIMENSION, 
    TRACK_THICKNESS 
} from '../constants'; // Correct path

/**
 * Renders the custom avatar shape (Egg or Humanoid) using SVG.
 * * @param {object} props - Component props.
 * @param {string} props.color - Fill color of the shape.
 * @param {object} props.shape - Shape parameters (width, height, waist).
 */
const EggPreviewSVG = ({ color, shape }) => {
    const { width, height, waist } = shape;

    // The component is displayed within a 180x200 window.
    // We normalize the dimensions (50-100) to fit within the SVG viewbox (0-100).
    // Max dimension (100) maps to 100 in the view box. Min dimension (50) maps to 50.
    const normalizedWidth = width; // 50-100
    const normalizedHeight = height; // 50-100
    const normalizedWaist = waist; // 0-100 (position of the waist line, 100 is top)
    
    // Scale factor to map 50-100 to a suitable size within a 100x100 SVG viewbox
    const W = normalizedWidth;
    const H = normalizedHeight;

    // Calculate the center point for the shape
    const centerX = 50; 
    const centerY = 50;
    
    // Scale the dimensions to fit the 100x100 grid for rendering
    // We are scaling based on the max possible range (50) and centering it.
    const shapeWidth = W * 0.5; // Scaled width (25 to 50)
    const shapeHeight = H * 0.5; // Scaled height (25 to 50)
    
    // Top and Bottom Y coordinates
    const topY = centerY - shapeHeight; // Y coordinate of the very top point
    const bottomY = centerY + shapeHeight; // Y coordinate of the very bottom point
    
    // Waist Y coordinate (Waist parameter: 0 is bottom, 100 is top)
    // The waist parameter controls the position of the maximum width (equator).
    // NormalizedWaist 0 (bottom) -> bottomY (center + H)
    // NormalizedWaist 100 (top) -> topY (center - H)
    const waistY = topY + ((100 - normalizedWaist) / 100) * (bottomY - topY);

    // X coordinates
    const leftX = centerX - shapeWidth;
    const rightX = centerX + shapeWidth;

    // --- FIX: Use two semi-ellipses (half ovals) joined at the waistY line ---
    
    // 1. Top Semi-Ellipse (from topY to waistY)
    // rx = shapeWidth, ry = waistY - topY
    const topRadiusY = waistY - topY;

    // 2. Bottom Semi-Ellipse (from waistY to bottomY)
    // rx = shapeWidth, ry = bottomY - waistY
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

