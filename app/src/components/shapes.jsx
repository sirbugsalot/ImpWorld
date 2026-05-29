import { Defs, Path, Circle } from 'react-native-svg';
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
            {/* --- Fingers --- */}
            {/* --- Pinky --- */}
            <Path 
                d={`M ${handCenter.x + 1} ${handCenter.y + 1}
                    A ${3.2/2} ${2.7/2} 0 0 0 ${handCenter.x + 4} ${handCenter.y} 
                    A ${3.2/2} ${2.7/2} 0 0 0 ${handCenter.x + 1} ${handCenter.y + 1}
                   `}
                stroke="#111" 
                strokeWidth="1" 
                fill={color}
                strokeLinecap="round" 
            />
            {/* --- Middle --- */}
            <Path 
                d={`M ${handCenter.x + 0.2} ${handCenter.y - 0.2}
                    A ${4.24/2} ${2.8/2} 0 0 0 ${handCenter.x + 3.5} ${handCenter.y - 3.2} 
                    A ${3.2/2} ${2.7/2} 0 0 0 ${handCenter.x + 0.2} ${handCenter.y - 0.2}
                   `}
                stroke="#111" 
                strokeWidth="1" 
                fill={color}
                strokeLinecap="round" 
            />
            {/* --- Index --- */}
            <Path 
                d={`M ${handCenter.x - 2.7} ${handCenter.y - 3.2}
                    A ${5.3/2} ${3.64/2} 0 0 0 ${handCenter.x + 2.1} ${handCenter.y - 5} 
                    A ${5.3/2} ${3.64/2} 0 0 0 ${handCenter.x - 2.7} ${handCenter.y - 3.2}
                   `}
                stroke="#111" 
                strokeWidth="1" 
                fill={color}
                strokeLinecap="round" 
            />
            {/* --- Thumb --- */}
            <Path 
                d={`M ${handCenter.x - 5.0} ${handCenter.y + 0.2}
                    A ${5.8/2} ${4.9/2} 0 0 0 ${handCenter.x - 2.2} ${handCenter.y - 5.0} 
                    A ${5.8/2} ${4.9/2} 0 0 0 ${handCenter.x - 5.0} ${handCenter.y + 0.2}
                   `}
                stroke="#111" 
                strokeWidth="1" 
                fill={color}
                strokeLinecap="round" 
            />
        </>
    );
};

export const Ears = ({pos, shape, color, length = 1.0 }) => {
    const { hy, wx, wy } = shape || {};
    
    // We use 'length' to scale the vertical offsets from the pivot point
    const reach = (offset) => offset * length;
    const ref_y = pos.y - hy;
    const ref_x = pos.x;
    const scale = 3.0;

    return (
        <>
            {/* --- Outer Ears --- */}
            <Path 
                d={`M ${ref_x + 7.5} ${ref_y + 1.5} 
                   Q ${ref_x + 15.0} ${ref_y - 7.5 - reach(5)}, ${ref_x + 18.0} ${ref_y - 9.0 - reach(5)}
                   Q ${ref_x + 19.2} ${ref_y - 8.4 - reach(5)}, ${ref_x + 19.5} ${ref_y + 15.6}
                   Q ${ref_x + 13.5} ${ref_y + 6.0}, ${ref_x + 7.5} ${ref_y + 1.5}
                   M ${ref_x - 21.0} ${ref_y + 18.0} 
                   Q ${ref_x - 27.9} ${ref_y + 3.0 - reach(5)}, ${ref_x - 27.0} ${ref_y - 6.0 - reach(5)}
                   Q ${ref_x - 21.0} ${ref_y - 4.5 - reach(5)}, ${ref_x - 7.5} ${ref_y + 6.0}
                   Q ${ref_x - 16.5} ${ref_y + 5.4}, ${ref_x - 21.0} ${ref_y + 13.5} 
                   `} 
                stroke="#657c7c" 
                strokeWidth="0.1" 
                fill="#2d2a32"
                strokeLinecap="round" 
            />
            {/* --- Inner Ears --- */}
            <Path 
                d={`M ${ref_x + 12.9} ${ref_y + 4.5} 
                   Q ${ref_x + 16.5} ${ref_y - 5.4 - reach(5)}, ${ref_x + 18.0} ${ref_y - 7.5 - reach(5)}
                   Q ${ref_x + 18.3} ${ref_y - 3.0 - reach(5)}, ${ref_x + 18.0} ${ref_y + 9.0}
                   M ${ref_x - 20.4} ${ref_y + 15.0} 
                   Q ${ref_x - 26.7} ${ref_y + 1.5 - reach(5)}, ${ref_x - 25.8} ${ref_y - 4.5 - reach(5)}
                   Q ${ref_x - 22.5} ${ref_y - 2.4 - reach(5)}, ${ref_x - 17.1} ${ref_y + 9.0}
                   `}
                stroke="#d59b95" 
                strokeWidth="0.25" 
                fill="#eac3b5"
                strokeLinecap="round" 
            />
        </>
    );
};

export const Eyes = ({pos, shape, color, length = 1.0 }) => {
    const { hy, wx, wy } = shape || {};
    
    // We use 'length' to scale the offsets from the pivot point
    const reach = (offset) => offset * length;
    const ref_y = pos.y - hy;
    const ref_x = pos.x;
    const scale = 3.0;

    // Outer Eye parameters
    const R_outer    = 15.0/2*length*0.5; // Outer eye major radius
        // LH
    const centerL_outer = {x: ref_x - 10.8, y: ref_y + 19.5}; // Center of LH eye
    const r_outer_L  = 12.0/2*length*0.5*0.9; // Outer eye minor radius LH
    const p1_outer_L  = {x: centerL_outer.x + r_outer_L, y: centerL_outer.y}; // LH construction point on outer LH eye
    const p2_outer_L  = {x: centerL_outer.x - r_outer_L, y: centerL_outer.y}; // RH construction point on outer LH eye
        // RH
    const centerR_outer = {x: ref_x + 12, y: ref_y + 19.5}; // Center of LH eye
    const r_outer_R  = r_outer_L*0.75; // Outer eye minor radius RH
    const p1_outer_R  = {x: centerR_outer.x - r_outer_R, y: centerR_outer.y}; // LH construction point on outer RH eye
    const p2_outer_R  = {x: centerR_outer.x + r_outer_R, y: centerR_outer.y}; // RH construction point on outer RH eye   

    // Iris
    const R_iris    = R_outer*0.8; // Outer eye major radius
        // LH
    const centerL_iris = {x: centerL_outer.x + 0.1*length, y: centerL_outer.y - 0.1*length}; // Center of LH eye
    const r_iris_L = r_outer_L*0.8; // Inner eye radius LH
    const p1_iris_L  = {x: centerL_iris.x + r_iris_L, y: centerL_iris.y}; // LH construction point on iris LH eye
    const p2_iris_L  = {x: centerL_iris.x - r_iris_L, y: centerL_iris.y}; // RH construction point on iris LH eye
    
        // RH
    const centerR_iris = {x: centerR_outer.x + 0.05*length, y: centerR_outer.y - 0.1*length}; // Center of RH eye
    const r_iris_R = r_iris_L*0.75 ; // Inner eye radius RH
    const p1_iris_R  = {x: centerR_iris.x - r_iris_R, y: centerR_iris.y}; // LH construction point on iris RH eye
    const p2_iris_R  = {x: centerR_iris.x + r_iris_R, y: centerR_iris.y}; // RH construction point on iris RH eye
    return (
        <>
            {/* --- Outer Eyes --- */}
            {/* --- LH eye then RH eye --- */}
            <Path 
                d={`M ${p1_outer_L.x} ${p1_outer_L.y}
                    A ${r_outer_L} ${R_outer} 0 0 0 ${p2_outer_L.x} ${p2_outer_L.y}
                    A ${r_outer_L} ${R_outer} 0 0 0 ${p1_outer_L.x} ${p1_outer_L.y}
                    M ${p1_outer_R.x} ${p1_outer_R.y}
                    A ${r_outer_R} ${R_outer} 0 0 0 ${p2_outer_R.x} ${p2_outer_R.y}
                    A ${r_outer_R} ${R_outer} 0 0 0 ${p1_outer_R.x} ${p1_outer_R.y}                   
                    `}
                stroke="#f4e6cc" 
                strokeWidth="0.1" 
                fill="#f4e6cc"
                strokeLinecap="round" 
            />
            {/* --- Iris --- */}
            {/* --- LH eye then RH eye --- */}
            <Path 
                d={`M ${p1_iris_L.x} ${p1_iris_L.y}
                    A ${r_iris_L} ${R_iris} 0 0 0 ${p2_iris_L.x} ${p2_iris_L.y}
                    A ${r_iris_L} ${R_iris} 0 0 0 ${p1_iris_L.x} ${p1_iris_L.y}
                    M ${p1_iris_R.x} ${p1_iris_R.y}
                    A ${r_iris_R} ${R_iris} 0 0 0 ${p2_iris_R.x} ${p2_iris_R.y}
                    A ${r_iris_R} ${R_iris} 0 0 0 ${p1_iris_R.x} ${p1_iris_R.y}                   
                    `}
                stroke="#63ede8" 
                strokeWidth="0.1" 
                fill="#36d9ef"
                strokeLinecap="round" 
            />
        </>
    );
};
{/* --- Hair color: muted sage highlights #b5ded3  and mint teal primary #7ce3c7 --- */}