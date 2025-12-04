import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { styles } from '../styles/avatarStyles';
import { PREVIEW_SCALE } from '../constants';

/**
 * Renders the egg shape using SVG Path commands based on the two-half-oval geometry.
 */
const EggPreviewSVG = ({ color, shape }) => {
    const { width, height, waist } = shape;

    // --- SCALING ---
    const previewWidth = width * PREVIEW_SCALE;
    const previewHeight = height * PREVIEW_SCALE;

    // --- SVG GEOMETRY CALCULATION ---
    const { pathData, svgHeight, waistLinePosition, width: actualWidth } = useMemo(() => {
        // 1. Radii (in scaled pixels)
        const rx = previewWidth / 2; // Half the minor axis
        const ryTop = (height - waist) * PREVIEW_SCALE; // Top half major axis
        const ryBottom = waist * PREVIEW_SCALE; // Bottom half major axis
        
        // Viewbox definition (0,0 is the top-left corner)
        const totalSvgHeight = ryTop + ryBottom;
        
        // Coordinates
        const startX = 0;
        const startY = ryTop; // The waist line position
        const centerPointX = previewWidth;
        const centerPointY = ryTop; 
        
        // Path definition:
        const path = `
            M ${startX} ${startY}
            A ${rx} ${ryBottom} 0 0 1 ${centerPointX} ${centerPointY}
            A ${rx} ${ryTop} 0 0 1 ${startX} ${startY}
            Z
        `;
        
        // Waist line Y position relative to the shape container (0 to 100%)
        const linePos = `${(height - waist) / height * 100}%`; 

        return { 
            pathData: path, 
            svgHeight: totalSvgHeight, 
            waistLinePosition: linePos,
            width: previewWidth
        };
    }, [width, height, waist]);
    
    const viewBox = `0 0 ${previewWidth} ${svgHeight}`;

    return (
        <View>
            <Svg 
                height={previewHeight}
                width={previewWidth}
                viewBox={viewBox} 
                style={styles.eggSvg}
            >
                <Path
                    d={pathData}
                    fill={color}
                    stroke="#4B5563"
                    strokeWidth="2"
                />
            </Svg>
            
            {/* Waist Indicator Line (Rendered as a standard View on top of the SVG) */}
            <View 
                style={[
                    styles.waistLine, 
                    { 
                        top: waistLinePosition, 
                        transform: [{ translateY: -1 }], 
                        width: actualWidth,
                    }
                ]} 
            />
        </View>
    );
};

export default EggPreviewSVG;
