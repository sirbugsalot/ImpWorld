import React, { useState, useCallback } from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

// --- GEOMETRY & CLAMPING CONSTANTS ---
const VIEWBOX_SIZE = 100; 
const WIDTH_VIEWBOX = VIEWBOX_SIZE;
const EGG_VIEWBOX_BASE_Y = 90; // Base Y-coordinate for the bottom of the egg
const MAX_HEIGHT = 70; 
const MIN_HEIGHT = 10;
const MAX_WIDTH = 60;
const MIN_WIDTH = 30;
const DRAG_THRESHOLD = 15; // Increased touch radius for mobile usability


/**
 * Renders the custom avatar shape (Egg) and its draggable handles, 
 * and handles the touch interaction to modify the shape.
 * @param {object} props - Component props.
 * @param {string} props.color - Fill color of the shape.
 * @param {object} props.shape - Shape parameters (hy, wx, wy).
 * @param {function} props.onShapeChange - Callback to update the shape in the parent state.
 * @param {function} props.convertPixelsToUnits - Utility function to map screen pixels to SVG units.
 */
const EggPreviewSVG = ({ color, shape, onShapeChange, convertPixelsToUnits }) => {
 
    // State to track which vertex is currently being dragged
    const [draggedVertexIndex, setDraggedVertexIndex] = useState(null);

    // Use optional chaining and default values
    const { hy = 60, wx = 40, wy = 35 } = shape || {}; 

    const bottomY = EGG_VIEWBOX_BASE_Y; 
    const topY = bottomY - hy; 
    const centerX = VIEWBOX_SIZE / 2; 

    // Calculate current vertices based on shape dimensions
    const eggVertices = [
        { 
            x: centerX, 
            y: topY
        },
        { 
            x: centerX + wx / 2, 
            y: wy
        }
    ];
    
    // --- TOUCH LOGIC ---

    /**
     * Determines if a touch point (in SVG units) is close enough to a vertex.
     */
    const getActiveVertext = (unitX, unitY) => {
        for (let i = 0; i < eggVertices.length; i++){
            const vertex = eggVertices[i];
            const distance = Math.sqrt( (unitX - vertex.x)**2 + (unitY - vertex.y)**2);
            if (distance <= DRAG_THRESHOLD) {
                return i;
            }
        }
        return null; 
    };
    
    /**
     * Handles the start of a touch/drag gesture.
     */
    const handleTouchStart = (event) => {
        const { unitX, unitY } = convertPixelsToUnits(
            event.nativeEvent.locationX, 
            event.nativeEvent.locationY
        );
        
        const activeVertexIndex = getActiveVertext(unitX, unitY);

        if (activeVertexIndex !== null) {
            setDraggedVertexIndex(activeVertexIndex);
            // Call move handler immediately for snappier feedback
            handleTouchMove(event, activeVertexIndex); 
        }
    };


    /**
     * Handles the movement during a drag gesture and updates the shape.
     */
    const handleTouchMove = (event, initialIndex = null) => {
        const activeVertexIndex = initialIndex !== null ? initialIndex : draggedVertexIndex;

        if (activeVertexIndex === null) {
            return; // Not currently dragging a vertex
        }
        
        // 1. Convert pixel event coordinates to 100-unit coordinates
        const { unitX, unitY } = convertPixelsToUnits(
            event.nativeEvent.locationX, 
            event.nativeEvent.locationY
        );

        let newHy = hy;
        let newWx = wx;
        let newWy = wy;
        
        if (activeVertexIndex === 0) {
            // Index 0: Height/Top vertex (Y modification)
            const minTopY = EGG_VIEWBOX_BASE_Y - MAX_HEIGHT; // Tallest allowed
            const maxTopY = EGG_VIEWBOX_BASE_Y - MIN_HEIGHT; // Shortest allowed

            // Clamp Y and calculate new Height dimension (hy)
            const newTopY = Math.max(minTopY, Math.min(maxTopY, unitY));
            newHy = EGG_VIEWBOX_BASE_Y - newTopY;
            
        } else if (activeVertexIndex === 1) {
            // Index 1: Width/Waist vertex (X and Y modification)
            
            const currentTopY = EGG_VIEWBOX_BASE_Y - hy;

            // X Clamping (Width)
            const minWaistX = WIDTH_VIEWBOX / 2 + MIN_WIDTH / 2;
            const maxWaistX = WIDTH_VIEWBOX / 2 + MAX_WIDTH / 2;
            const newWaistX = Math.max(minWaistX, Math.min(maxWaistX, unitX));
            newWx = (newWaistX - WIDTH_VIEWBOX / 2) * 2; // Dimension is width, not half-width

            // Y Clamping (Waist Position)
            const availableHeight = EGG_VIEWBOX_BASE_Y - currentTopY;
            const minWaistY = currentTopY + availableHeight * 0.15; // 15% down from the top
            const maxWaistY = EGG_VIEWBOX_BASE_Y - availableHeight * 0.15; // 15% up from the bottom
            newWy = Math.max(minWaistY, Math.min(maxWaistY, unitY));
        }

        // 2. Call the parent update function
        onShapeChange({ hy: newHy, wx: newWx, wy: newWy });
    };

    const releaseUpdate = () => {
        setDraggedVertexIndex(null);
    };

    // --- GEOMETRY PATH GENERATION ---
    const halfWidth = wx / 2;
    const rightX = centerX + halfWidth; 
    const leftX = centerX - halfWidth;  
    const rx = halfWidth; 

    const bottomRadiusY = bottomY - wy;
    const topRadiusY = topY - bottomRadiusY; 
    
    let d = `M ${leftX} ${wy}`;
    d += ` A ${rx} ${bottomRadiusY} 0 0 0 ${rightX} ${wy}`; 
    d += ` A ${rx} ${topRadiusY} 0 0 0 ${leftX} ${wy}`; 
    const eggPath = d;

    // --- Fixed Light Theme Colors ---
    const frameFill = '#F9FAFB';
    const frameStroke = '#D1D5DB';
    
    return (
        // Touch handlers are now on the <Svg> element itself!
        <Svg 
            height="100%" 
            width="100%" 
            viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={releaseUpdate}  
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
