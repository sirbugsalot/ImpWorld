import React from 'react';
import { Path, Defs } from 'react-native-svg';
import PatternLibrary from '../patterns/PatternLibrary';

/**
Position is obtained from within the hand
*/
export const Pencil = ({ pos, color }) => {
    
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
        </>
    );
};
