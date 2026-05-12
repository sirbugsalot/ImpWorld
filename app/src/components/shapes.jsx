import React from 'react';
import { Path, Defs } from 'react-native-svg';
import PatternLibrary from '../patterns/PatternLibrary';

/**
 * Feet Component
 * @param {object} pos - Pivot point {x, y}
 * @param {object} shape - Body parameters {wx, wy}
 * @param {string} color - Fill color
 * @param {number} length - Multiplier for foot length (default 1.0)
 */
export const Feet = ({ pos, shape, color, length = 1.0 }) => {
    const { wx = 50, wy = 60 } = shape || {};
    
    // We use 'length' to scale the vertical offsets from the pivot point
    const reach = (offset) => offset * length;

    return (
        <>
            {/* --- Left Foot --- */}
            <Path 
                d={`M ${pos.x} ${pos.y} 
                   Q ${pos.x - 15} ${pos.y + reach(5)}, ${pos.x - 15} ${pos.y + reach(13)}
                   Q ${pos.x - 13} ${pos.y + reach(13)}, ${pos.x - 15} ${pos.y + reach(16)}
                   Q ${pos.x - 18} ${pos.y + reach(18)}, ${pos.x - 22} ${pos.y + reach(16)}
                   Q ${pos.x - wx / 2 - 3} ${wy + reach(20)}, ${pos.x - wx / 2} ${wy}
                   Z`} 
                stroke="#111" 
                strokeWidth="1" 
                fill={color}
                strokeLinecap="round" 
            />

            {/* --- Right Foot --- */}
            <Path 
                d={`M ${pos.x + 2} ${pos.y} 
                   Q ${pos.x + 8} ${pos.y + reach(10)}, ${pos.x + 8} ${pos.y + reach(14)}
                   Q ${pos.x + 12} ${pos.y + reach(17)}, ${pos.x + 18} ${pos.y + reach(15)}
                   Q ${pos.x + 19} ${pos.y + reach(14)}, ${pos.x + 17} ${pos.y + reach(12)}
                   Q ${pos.x + wx / 2 + 3} ${wy + reach(25)}, ${pos.x + wx / 2 - 10} ${wy}
                   Z`} 
                stroke="#111" 
                strokeWidth="1" 
                fill={color}
                strokeLinecap="round" 
            />
        </>
    );
};

/**
 * Arms Component
 * @param {object} pos - Pivot point {x, y}
 * @param {object} shape - Body parameters {wx, wy}
 * @param {string} color - Fill color
 * @param {number} length - Multiplier for arm length (default 1.0)
 */
export const Arms = ({ pos, shape, color, length = 1.0 }) => {
    const { hy, wx, wy } = shape || {};
    
    // We use 'length' to scale the horizontal offsets from the pivot point
    const reach = (offset) => offset * length;

    return (
        <>
            {/* --- Left Arm --- */}
            <Path 
                d={`M ${pos.x - 0.5*0.95*wx} ${pos.y - 0.4*(pos.y - hy)} 
                   Q ${pos.x - 27} ${pos.y - 18}, ${pos.x - 21} ${pos.y - 13}
                   Q ${pos.x - 15} ${pos.y - 10}, ${pos.x - 8} ${pos.y - 14}
                   Q ${pos.x - 5} ${pos.y - 25}, ${pos.x} ${pos.y - 23}
                   Z`} 
                stroke="#111" 
                strokeWidth="1" 
                fill={color}
                strokeLinecap="round" 
            />
        </>
    );
};

export const Oval = ({ pos, shape, color, patternId, patternColor = '#FFFFFF' }) => {
    const { hy = 60, wx = 40, wy = 35 } = shape || {};
    const centerX = pos.x;
    const baseLineY = pos.y; 

    const halfWidth = wx / 2;
    const rightX = centerX + halfWidth;
    const leftX = centerX - halfWidth;
    const rx = halfWidth;
    
    const bottomRadiusY = baseLineY - wy;
    const topY = baseLineY - hy;
    const topRadiusY = wy - topY;

    const d = `M ${leftX} ${wy} 
               A ${rx} ${bottomRadiusY} 0 0 0 ${rightX} ${wy} 
               A ${rx} ${topRadiusY} 0 0 0 ${leftX} ${wy}`;

    return (
        <>
            <Defs>
                <PatternLibrary patternId={patternId} color={patternColor} />
            </Defs>
            <Path d={d} fill={color || '#059669'} />
            {patternId && <Path d={d} fill={`url(#${patternId})`} />}
            <Path d={d} fill="none" stroke="#374151" strokeWidth="1.5" />
        </>
    );
};

