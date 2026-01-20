import React, { useState } from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import { Oval } from './shapes';

const VIEWBOX_SIZE = 100; 
const EGG_VIEWBOX_BASE_Y = 90; 
const MAX_HEIGHT = 70; 
const MIN_HEIGHT = 10;
const MAX_WIDTH = 60;
const MIN_WIDTH = 30;
const DRAG_THRESHOLD = 15; 

/**
 * Refactored EggPreviewSVG
 * Uses the shared Oval component for rendering, while maintaining drag logic.
 */
const EggPreviewSVG = ({ color, patternId, patternColor = '#FFFFFF', shape, onShapeChange, convertPixelsToUnits }) => {
    const [draggedVertexIndex, setDraggedVertexIndex] = useState(null);

    const { hy = 60, wx = 40, wy = 35 } = shape || {}; 

    const bottomY = EGG_VIEWBOX_BASE_Y; 
    const topY = bottomY - hy; 
    const centerX = VIEWBOX_SIZE / 2; 

    // Draggable handles positions
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
        }
    };

    const handleTouchMove = (event) => {
        if (draggedVertexIndex === null) return;
        
        const { unitX, unitY } = convertPixelsToUnits(
            event.nativeEvent.locationX, 
            event.nativeEvent.locationY
        );

        let newHy = hy;
        let newWx = wx;
        let newWy = wy;
        
        if (draggedVertexIndex === 0) {
            const minTopY = EGG_VIEWBOX_BASE_Y - MAX_HEIGHT;
            const maxTopY = EGG_VIEWBOX_BASE_Y - MIN_HEIGHT;
            const newTopY = Math.max(minTopY, Math.min(maxTopY, unitY));
            newHy = EGG_VIEWBOX_BASE_Y - newTopY;
        } else if (draggedVertexIndex === 1) {
            const minWaistX = centerX + MIN_WIDTH / 2;
            const maxWaistX = centerX + MAX_WIDTH / 2;
            const newWaistX = Math.max(minWaistX, Math.min(maxWaistX, unitX));
            newWx = (newWaistX - centerX) * 2;

            const currentTopY = EGG_VIEWBOX_BASE_Y - hy;
            const availableHeight = EGG_VIEWBOX_BASE_Y - currentTopY;
            const minWaistY = currentTopY + availableHeight * 0.15;
            const maxWaistY = EGG_VIEWBOX_BASE_Y - availableHeight * 0.15;
            newWy = Math.max(minWaistY, Math.min(maxWaistY, unitY));
        }
        onShapeChange({ hy: newHy, wx: newWx, wy: newWy });
    };

    return (
        <Svg 
            height="100%" 
            width="100%" 
            viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={() => setDraggedVertexIndex(null)}  
        >
            {/* Background Frame */}
            <Path d="M 5 5 L 95 5 L 95 95 L 5 95 Z" fill="#F9FAFB" stroke="#D1D5DB" strokeWidth="1" />
            
            {/* Guide Lines */}
            <Path d={`M 20 ${bottomY} L 80 ${bottomY}`} stroke="#EF4444" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.3" />
            <Path d={`M 20 ${wy} L 80 ${wy}`} stroke="#3B82F6" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.3" />

            {/* CALLING SHARED COMPONENT */}
            <Oval 
                pos={{ x: centerX, y: bottomY }} 
                shape={{ hy, wx, wy }} 
                color={color} 
                patternId={patternId} 
                patternColor={patternColor} 
            />

            {/* Draggable Handles */}
            {eggVertices.map((vertex, index) => (
                <Circle 
                    key={index} 
                    cx={vertex.x} 
                    cy={vertex.y} 
                    r={3.5} 
                    fill={index === 0 ? '#EF4444' : '#3B82F6'} 
                    stroke="white" 
                    strokeWidth="1.5" 
                />
            ))}
        </Svg>
    );
};

export default EggPreviewSVG;
