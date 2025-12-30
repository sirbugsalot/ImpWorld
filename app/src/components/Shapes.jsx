import React from 'react';
import { Path, Defs } from 'react-native-svg';
import PatternLibrary from '../patterns/PatternLibrary';

/**
 * Centered Oval/Egg Shape
 * @param {object} pos - { x, y } center/reference position
 * @param {object} shape - { hy, wx, wy } height and width parameters
 * @param {string} color - Hex base color
 * @param {string} patternId - ID of pattern from PatternLibrary
 * @param {string} patternColor - Color of the pattern overlay
 */
export const Oval = ({ pos, shape, color, patternId, patternColor = '#FFFFFF' }) => {
    const { hy = 60, wx = 40, wy = 35 } = shape || {};
    const centerX = pos.x;
    const baseLineY = pos.y; // Reference bottom line

    // Geometry calculations matching EggPreviewSVG logic
    const halfWidth = wx / 2;
    const rightX = centerX + halfWidth;
    const leftX = centerX - halfWidth;
    const rx = halfWidth;
    
    // wy is the vertical "waist" position in the viewbox
    // bottomRadiusY is the distance from waist to bottom
    const bottomRadiusY = baseLineY - wy;
    // topRadiusY is the distance from waist to the peak (hy is total height)
    const topY = baseLineY - hy;
    const topRadiusY = wy - topY;

    // SVG Arc Path: M startX startY A rx ry xAxisRotation largeArcFlag sweepFlag endX endY
    const d = `M ${leftX} ${wy} 
               A ${rx} ${bottomRadiusY} 0 0 0 ${rightX} ${wy} 
               A ${rx} ${topRadiusY} 0 0 0 ${leftX} ${wy}`;

    return (
        <>
            <Defs>
                <PatternLibrary patternId={patternId} color={patternColor} />
            </Defs>
            
            {/* Base Color */}
            <Path d={d} fill={color || '#059669'} />
            
            {/* Pattern Layer */}
            {patternId && (
                <Path d={d} fill={`url(#${patternId})`} />
            )}

            {/* Outline */}
            <Path d={d} fill="none" stroke="#374151" strokeWidth="1.5" />
        </>
    );
};

      
