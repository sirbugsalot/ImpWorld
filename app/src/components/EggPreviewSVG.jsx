import React, { useState } from 'react';
import Svg, { Path, Circle, Defs } from 'react-native-svg';
import PatternLibrary from '../patterns/PatternLibrary';

const VIEWBOX_SIZE = 100; 
const WIDTH_VIEWBOX = VIEWBOX_SIZE;
const EGG_VIEWBOX_BASE_Y = 90; 
const MAX_HEIGHT = 70; 
const MIN_HEIGHT = 10;
const MAX_WIDTH = 60;
const MIN_WIDTH = 30;
const DRAG_THRESHOLD = 15; 

/**
 * Renders the custom avatar shape (Egg) and its draggable handles.
 * Handles dual-color patterns and shape manipulation.
 */
const EggPreviewSVG = ({ color, patternId, patternColor = '#FFFFFF', shape, onShapeChange, convertPixelsToUnits }) => {
    const [draggedVertexIndex, setDraggedVertexIndex] = useState(null);

    const { hy = 60, wx = 40, wy = 35 } = shape || {}; 

    const bottomY = EGG_VIEWBOX_BASE_Y; 
    const topY = bottomY - hy; 
    const centerX = VIEWBOX_SIZE / 2; 

    const eggVertices = [
        { x: centerX, y: topY },
        { x: centerX + wx / 2, y: wy }
    ];
    
    const getActiveVertex = (unitX, unitY) => {
        for (let i = 0; i < eggVertices.length; i++){
            const vertex = eggVertices[i];
            const distance = Math.sqrt((unitX - vertex.x)**2 + (unitY - vertex.y)**2);
            if (distance <= DRAG_THRESHOLD) return i;
        }
        return null; 
    };
    
    const handleTouchStart = (event) => {
        const { unitX, unitY } = convertPixelsToUnits(
            event.nativeEvent.locationX, 
            event.nativeEvent.locationY
        );
        const activeVertexIndex = getActiveVertex(unitX, unitY);
        if (activeVertexIndex !== null) {
            setDraggedVertexIndex(activeVertexIndex);
            handleTouchMove(event, activeVertexIndex); 
        }
    };

    const handleTouchMove = (event, initialIndex = null) => {
        const activeVertexIndex = initialIndex !== null ? initialIndex : draggedVertexIndex;
        if (activeVertexIndex === null) return;
        
        const { unitX, unitY } = convertPixelsToUnits(
            event.nativeEvent.locationX, 
            event.nativeEvent.locationY
        );

        let newHy = hy;
        let newWx = wx;
        let newWy = wy;
        
        if (activeVertexIndex === 0) {
            const minTopY = EGG_VIEWBOX_BASE_Y - MAX_HEIGHT;
            const maxTopY = EGG_VIEWBOX_BASE_Y - MIN_HEIGHT;
            const newTopY = Math.max(minTopY, Math.min(maxTopY, unitY));
            newHy = EGG_VIEWBOX_BASE_Y - newTopY;
        } else if (activeVertexIndex === 1) {
            const currentTopY = EGG_VIEWBOX_BASE_Y - hy;
            const minWaistX = WIDTH_VIEWBOX / 2 + MIN_WIDTH / 2;
            const maxWaistX = WIDTH_VIEWBOX / 2 + MAX_WIDTH / 2;
            const newWaistX = Math.max(minWaistX, Math.min(maxWaistX, unitX));
            newWx = (newWaistX - WIDTH_VIEWBOX / 2) * 2;

            const availableHeight = EGG_VIEWBOX_BASE_Y - currentTopY;
            const minWaistY = currentTopY + availableHeight * 0.15;
            const maxWaistY = EGG_VIEWBOX_BASE_Y - availableHeight * 0.15;
            newWy = Math.max(minWaistY, Math.min(maxWaistY, unitY));
        }
        onShapeChange({ hy: newHy, wx: newWx, wy: newWy });
    };

    const releaseUpdate = () => setDraggedVertexIndex(null);

    // Geometry calculations
    const halfWidth = wx / 2;
    const rightX = centerX + halfWidth; 
    const leftX = centerX - halfWidth;  
    const rx = halfWidth; 
    const bottomRadiusY = bottomY - wy;
    const topRadiusY = hy - bottomRadiusY; 
    
    const eggPath = `M ${leftX} ${wy} A ${rx} ${bottomRadiusY} 0 0 0 ${rightX} ${wy} A ${rx} ${topRadiusY} 0 0 0 ${leftX} ${wy}`;

    return (
        <Svg 
            height="100%" 
            width="100%" 
            viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={releaseUpdate}  
        >
            <Defs>
                <PatternLibrary patternId={patternId} color={patternColor} />
            </Defs>

            {/* Background Frame */}
            <Path d="M 5 5 L 95 5 L 95 95 L 5 95 Z" fill="#F9FAFB" stroke="#D1D5DB" strokeWidth="1" />
            
            {/* 1. Base Color Layer */}
            <Path d={eggPath} fill={color || '#059669'} />
            
            {/* 2. Pattern Layer (using the ID from PatternLibrary) */}
            {patternId && (
                <Path d={eggPath} fill={`url(#${patternId})`} />
            )}

            {/* 3. Stroke Outline */}
            <Path d={eggPath} fill="none" stroke="#6B7280" strokeWidth="1" />
            
            {/* Guide Lines */}
            <Path d={`M 20 ${bottomY} L 80 ${bottomY}`} stroke="#E94949" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.5" />
            <Path d={`M 20 ${wy} L 80 ${wy}`} stroke="#3B82F6" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.5" />
            
            {/* Draggable Handles */}
            {eggVertices.map((vertex, index) => (
                <Circle 
                    key={index} 
                    cx={vertex.x} 
                    cy={vertex.y} 
                    r={3} 
                    fill={index === 0 ? '#EF4444' : '#3B82F6'} 
                    stroke="white" 
                    strokeWidth="1" 
                />
            ))}
        </Svg>
    );
};

export default EggPreviewSVG;

