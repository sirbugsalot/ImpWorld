import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { EGG_VIEWBOX_BASE_Y } from '../constants'; // Import EGG_VIEWBOX_BASE_Y (which is 70)

// The component will draw entirely within a 100x100 coordinate system
const VIEWBOX_SIZE = 100; 

/**
 * Renders the custom avatar shape (Egg).
 * All coordinates and geometry are calculated using the 100x100 viewBox units.
 * * @param {object} props - Component props.
 * @param {string} props.color - Fill color of the shape.
 * @param {object} props.shape - Shape parameters (width, height, waist) as percentages (0-100).
 */
const EggPreviewSVG = ({ color, shape }) => {
    // The shape parameters are interpreted as percentages (0-100) of the maximum VIEWBOX size.
    // e.g., shape.height 50 means 50 units high in the 100-unit viewbox.
    const shapeWidthPercentage = shape.width;
    const shapeHeightPercentage = shape.height;
    const shapeWaistPercentage = ((shape.waist+10)/shape.height) * (90/110);// (shape.height - shape.waist +10)/(shape.height + 10); // This is the height of the waist point FROM THE EGG'S BOTTOM, as a percentage of the total egg height.
    
    // --- Anchor Points ---
    
    // Bottom Y coordinate is fixed in the 100-unit viewbox (70)
    const bottomY = EGG_VIEWBOX_BASE_Y; 
    
    // Total height of the egg shape in viewbox units (e.g., 50 units)
    const shapeTotalHeight = shapeHeightPercentage; 
    
    // Half width of the egg shape in viewbox units (e.g., 25 units)
    const halfShapeWidth = shapeWidthPercentage / 2;

    // Top Y coordinate is calculated based on height
    // TopY = BaseY - TotalHeight (e.g., 70 - 50 = 20)
    const topY = bottomY - shapeTotalHeight; 
    
    // X coordinates remain centered in the viewbox (50)
    const centerX = VIEWBOX_SIZE / 2; 
    const leftX = centerX - halfShapeWidth;  // e.g., 50 - 25 = 25
    const rightX = centerX + halfShapeWidth; // e.g., 50 + 25 = 75

    // --- Waist Calculation ---
    // Waist position (Y-coordinate) is calculated FROM THE TOP of the egg shape (topY)
    // The waist value (40) is the percentage of the egg's total height (shapeTotalHeight) down from the top.
    const waistRatio = shapeWaistPercentage;
    
    // waistY = topY + (waistRatio * shapeTotalHeight) 
    // e.g., 20 + (0.4 * 50) = 20 + 20 = 40
    const waistY = bottomY - (waistRatio * shapeTotalHeight);

    // --- Path Generation for two semi-ellipses (Half Ovals) ---
    
    // 1. Top Semi-Ellipse (height from topY to waistY)
    const topRadiusY = waistY - topY; // e.g., 40 - 20 = 20

    // 2. Bottom Semi-Ellipse (height from waistY to bottomY)
    const bottomRadiusY = bottomY - waistY; // e.g., 70 - 40 = 30
    
    // Horizontal radius (rx) is halfShapeWidth (e.g., 25)
    const rx = halfShapeWidth;

    // Start at the left waist point (leftX, waistY)
    let d = `M ${leftX} ${waistY}`;

    // B. Draw the bottom semi-oval (Arc curve back to the left waist point)
    d += ` A ${rx} ${bottomRadiusY} 0 0 0 ${rightX} ${waistY}`;
    
    // A. Draw the top semi-oval (Arc curve to the right waist point)
    // A rx ry x-axis-rotation large-arc-flag sweep-flag x y
    d += ` A ${rx} ${topRadiusY} 0 0 0 ${leftX} ${waistY}`;

    const eggPath = d;
    
    return (
        // Use 0 0 100 100 viewBox for internal relative drawing
        <Svg height="100%" width="90%" viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}>
            {/* Background Frame/Reference (Draws inside the 5% padding area of the viewbox) */}
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
            
            {/* Base Anchor Line (Visual confirmation the base is at Y=70) */}
             <Path
                d={`M 20 ${bottomY} L 80 ${bottomY}`}
                stroke="#E94949"
                strokeWidth="1"
                strokeDasharray="4 4"
                strokeOpacity="0.5"
            />
            
            {/* Waist Anchor Line (Visual confirmation of waist position) */}
             <Path
                d={`M 20 ${waistY} L 80 ${waistY}`}
                stroke="#3B82F6"
                strokeWidth="1"
                strokeDasharray="4 4"
                strokeOpacity="0.5"
            />
        </Svg>
    );
};

export default EggPreviewSVG;
