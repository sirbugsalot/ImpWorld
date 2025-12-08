import React from 'react';
import Svg, { Path } from 'react-native-svg'; 
import { 
    MAX_SHAPE_HEIGHT_VIEWBOX,
    MAX_SHAPE_WIDTH_VIEWBOX,
    BASE_Y_ANCHOR,
    WAIST_MARGIN_PERCENTAGE
} from '../constants'; // Import new constants

/**
 * Renders the custom avatar shape (Egg or Humanoid) using SVG.
 * NEW LOGIC: Dimensions (width, height) are percentages (10-100) of a max size 
 * defined in the viewbox. The egg is anchored at the bottom (BASE_Y_ANCHOR).
 * * @param {object} props - Component props.
 * @param {string} props.color - Fill color of the shape.
 * @param {object} props.shape - Shape parameters (width, height, waist).
 */
const EggPreviewSVG = ({ color, shape }) => {
    // Inputs are percentages (10-100)
    const { width, height, waist } = shape; 

    // Convert percentage inputs to ratios (0.1 to 1.0)
    const widthRatio = width / 100;
    const heightRatio = height / 100;
    const waistRatioInput = waist / 100; 
    
    // Calculate the actual dimensions in ViewBox units
    const shapeWidth = widthRatio * MAX_SHAPE_WIDTH_VIEWBOX; 
    const shapeTotalHeight = heightRatio * MAX_SHAPE_HEIGHT_VIEWBOX;

    // --- Anchor Points ---
    
    // Bottom Y coordinate is fixed (Y=90 in the 100x100 viewbox)
    const bottomY = BASE_Y_ANCHOR; 
    
    // Top Y coordinate grows upwards from the base
    const topY = bottomY - shapeTotalHeight; 
    
    // X coordinates remain centered
    const centerX = 50; 
    const leftX = centerX - shapeWidth;
    const rightX = centerX + shapeWidth;

    // --- Waist Calculation (Percentage of Total Height with Margin) ---
    
    // Margin in ratio: 10% of total height
    const marginRatio = WAIST_MARGIN_PERCENTAGE / 100;
    
    // Clamped ratio: Min is 0.1 (10% from top), Max is 0.9 (10% from bottom)
    const clampedWaistRatio = Math.max(marginRatio, Math.min(1 - marginRatio, waistRatioInput));
    
    // waistY is calculated from the top point (topY) downwards using the clamped ratio
    const waistY = topY + (clampedWaistRatio * shapeTotalHeight);

    // --- Path Generation for two semi-ellipses (Half Ovals) ---
    
    // 1. Top Semi-Ellipse (height from topY to waistY)
    const topRadiusY = waistY - topY; 

    // 2. Bottom Semi-Ellipse (height from waistY to bottomY)
    const bottomRadiusY = bottomY - waistY; 

    // Start at the left waist point (leftX, waistY)
    let d = `M ${leftX} ${waistY}`;

    // A. Draw the top semi-oval (Arc curve to the right waist point)
    d += ` A ${shapeWidth} ${topRadiusY} 0 0 0 ${rightX} ${waistY}`;

    // B. Draw the bottom semi-oval (Arc curve back to the left waist point)
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
