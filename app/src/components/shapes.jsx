import { Defs, Path } from 'react-native-svg';
import PatternLibrary from '../patterns/PatternLibrary';
import {Pencil} from './Objects';

/**
 * Oval Component
 * @param {object} pos - Pivot point {x, y}
 * @param {object} shape - Body parameters {wx, wy}
 * @param {string} color - Fill color
 * @param {number} length - Multiplier for foot length (default 1.0)
 */
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
            {/* --- RIGHT Foot --- */}
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

            {/* --- LEFT Foot --- */}
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
export const RightArm = ({ pos, shape, color, length = 1.0 }) => {
    const { hy, wx, wy } = shape || {};
    
    // We use 'length' to scale the horizontal offsets from the pivot point
    const reach = (offset) => offset * length;

    return (
        <>
            {/* --- RIGHT Arm --- */}
            <Path 
                d={`M ${pos.x - 0.5*0.95*wx} ${pos.y - 0.4*hy} 
                   Q ${pos.x - 0.52*wx} ${pos.y - 0.22*hy}, ${pos.x - 0.5*0.9*wx} ${pos.y - 0.18*hy}
                   Q ${pos.x - 0.5*0.7*wx + reach(1)} ${pos.y - 0.10*hy}, ${pos.x - 0.5*0.42*wx + reach(2)} ${pos.y - 0.19*hy}
                   Q ${pos.x - 0.5*0.22*wx + reach(2)} ${pos.y - 0.20*hy}, ${pos.x - 0.5*0.3*wx + reach(2)} ${pos.y - 0.27*hy}
                   Q ${pos.x - 0.5*0.22*wx + reach(2)} ${pos.y - 0.30*hy}, ${pos.x - 0.5*0.4*wx + reach(2)} ${pos.y - 0.3*hy}
                   Q ${pos.x - 0.5*0.4*wx + reach(2)} ${pos.y - 0.40*hy}, ${pos.x - 0.5*0.5*wx + reach(2)} ${pos.y - 0.3*hy}
                   Q ${pos.x - 0.5*0.74*wx} ${pos.y - 0.27*hy}, ${pos.x - 0.5*0.75*wx} ${pos.y - 0.39*hy}
                   `} 
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
export const LeftArm = ({ pos, shape, color, length = 1.0 }) => {
    const { hy, wx, wy } = shape || {};
    
    // We use 'length' to scale the horizontal offsets from the pivot point
    const reach = (offset) => offset * length;
    const handCenter = {x: pos.x + 0.65*wx + reach(2), y: pos.y - 0.5*hy };

    return (
        <>
            {/* --- LEFT Arm --- */}
            <Path 
                d={`M ${pos.x + 0.5*0.8*wx} ${pos.y - 0.4*hy} 
                   Q ${pos.x + 0.5*0.9*wx + reach(2)} ${pos.y - 0.41*hy}, ${pos.x + 0.5*1.2*wx + reach(2)} ${pos.y - 0.55*hy}
                   Q ${pos.x + 0.5*1.3*wx + reach(2)} ${pos.y - 0.6*hy}, ${pos.x + 0.5*1.4*wx + reach(2)} ${pos.y - 0.6*hy}
                   Q ${pos.x + 0.5*1.47*wx + reach(2)} ${pos.y - 0.5*hy}, ${pos.x + 0.5*1.5*wx + reach(2)} ${pos.y - 0.47*hy}
                   Q ${pos.x + 0.5*1.45*wx + reach(2)} ${pos.y - 0.42*hy}, ${pos.x + 0.5*1.4*wx + reach(2)} ${pos.y - 0.4*hy}
                   Q ${pos.x + 0.5*1.0*wx + reach(2)} ${pos.y - 0.25*hy}, ${pos.x + 0.5*0.9*wx} ${pos.y - 0.25*hy}
                   `}
                stroke="#111" 
                strokeWidth="1" 
                fill={color}
                strokeLinecap="round" 
            />
            <Pencil pos={handCenter} />
            <Path 
                d={`M ${handCenter.x + 1} ${handCenter.y + 1}
                    A ${3.2/2} ${2.7/2} 0 0 0 ${handCenter.x + 4} ${handCenter.y} 
                    A ${3.2/2} ${2.7/2} 0 0 0 ${handCenter.x + 1} ${handCenter.y + 1}
                    M ${handCenter.x + 0.2} ${handCenter.y - 0.2}
                    A ${4.24/2} ${2.8/2} 0 0 0 ${handCenter.x + 3.5} ${handCenter.y - 3.2} 
                    A ${3.2/2} ${2.7/2} 0 0 0 ${handCenter.x + 0.2} ${handCenter.y - 0.2}
                    M ${handCenter.x - 2.7} ${handCenter.y - 3.2}
                    A ${5.3/2} ${3.64/2} 0 0 0 ${handCenter.x + 2.1} ${handCenter.y - 5} 
                    A ${5.3/2} ${3.64/2} 0 0 0 ${handCenter.x - 2.7} ${handCenter.y - 3.2}
                    M ${handCenter.x - 7.5} ${handCenter.y - 1.9}
                    A ${5.6/2} ${4.79/2} 0 0 0 ${handCenter.x - 2.2} ${handCenter.y - 4.5} 
                    A ${5.6/2} ${4.79/2} 0 0 0 ${handCenter.x - 7.5} ${handCenter.y - 1.9}
                   `}
                stroke="#111" 
                strokeWidth="1" 
                fill={color}
                strokeLinecap="round" 
            />
        </>
    );
};

