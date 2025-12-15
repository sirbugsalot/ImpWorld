import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { EGG_VIEWBOX_BASE_Y, MAX_HEIGHT, MAX_WIDTH, MIN_WIDTH, MIN_HEIGHT } from '../constants'; // Import EGG_VIEWBOX_BASE_Y (which is 70)

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
    // const shapeWidthPercentage = shape.width; // x coordinate of left edge
    // const shapeHeightPercentage = shape.height; // x,y coordinate of top edge
    // const shapeWaistPercentage = ((shape.waist+5)/shape.height) * (95/105);// (shape.height - shape.waist +10)/(shape.height + 10); // This is the height of the waist point FROM THE EGG'S BOTTOM, as a percentage of the total egg height.
    //                                                                 // waist: y coord of waist bar

    // const [eggDim, setEggDim] = useState([
    //     {hx: WIDTH_VIEWBOX/2,                                   hy:DEFAULT_CUSTOMIZATION.height},
    //     {wx: WIDTH_VIEWBOX/2 + DEFAULT_CUSTOMIZATION.width/2,   wy:DEFAULT_CUSTOMIZATION.waist},
    // ]);

    //         const clampedRatio = Math.max(0, Math.min(1, ratio));


    // const shapeWidth = shape.wx; //Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, shape.wx)); // x coordinate of right edge
    // const shapeHeight = shape.hy; // Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, shape.hy)); // x,y coordinate of top edge
    // const shapeWaist = shape.wy; //Math.max(shapeHeight*0.15, Math.min(shapeHeight*0.85, shape.wy));// Clip the width +/- 15% of current height.

    const { hy, wx, wy } = shape; // Top Y, Right X, Waist Y coordinates (0-100)

    const bottomY = EGG_VIEWBOX_BASE_Y; 
    const topY = hy; 
    const centerX = VIEWBOX_SIZE / 2; 
    const rightX = wx; 
    const leftX = VIEWBOX_SIZE - rightX; 
    const waistY = wy; 

    // --- Anchor Points ---
    
    // // Bottom Y coordinate is fixed in the 100-unit viewbox (70)
    // const bottomY = EGG_VIEWBOX_BASE_Y; 

    // // Top Y coordinate is calculated based on height
    // const topY = bottomY - shapeHeight; 
    
    // // X coordinates remain centered in the viewbox (50)
    // const centerX = VIEWBOX_SIZE / 2; 
    // const rightX = shapeWidth; // e.g., 50 + 25 = 75
    // const leftX = VIEWBOX_SIZE - shapeWidth;  // e.g., 50 - 25 = 25

    // // --- Waist Calculation ---
    // // Waist position (Y-coordinate) is calculated FROM THE TOP of the egg shape (topY)
    
    // const waistY = bottomY - (shapeWaist * shapeHeight);

    // --- Path Generation for two semi-ellipses (Half Ovals) ---
    
    // 1. Top Semi-Ellipse (height from topY to waistY)
    const topRadiusY = waistY - topY; // e.g., 40 - 20 = 20

    // 2. Bottom Semi-Ellipse (height from waistY to bottomY)
    const bottomRadiusY = bottomY - waistY; // e.g., 70 - 40 = 30
    
    // Horizontal radius (rx) is halfShapeWidth (e.g., 25)
    const rx = shapeWidth - centerX;

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
