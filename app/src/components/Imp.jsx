import React from 'react';
import Svg, { Path, Circle, G } from 'react-native-svg';
import { Oval, Feet } from './shapes'; 

const Imp = ({ 
  customization, 
  eyeSize = 5,
  footLength = 1.0, // New prop for customization
  armLength = 1.0
}) => {
    const { 
        color = '#8A2BE2', 
        pos = { x: 50, y: 80 },
        shape = { hy: 70, wx: 60, wy: 60 }, 
        patternId = null, 
        patternColor = '#FFFFFF' 
    } = customization || {};

    return (
        <Svg viewBox="0 0 200 200" width="100%" height="100%">
            <G transform="scale(2)">
                {/* Feet now take the 'length' argument */}
                <Feet 
                    pos={pos} 
                    shape={shape} 
                    color={color} 
                    length={footLength} 
                />
              
                <Arms 
                    pos={pos} 
                    shape={shape} 
                    color={color} 
                    length={armLength} 
                />

                <Oval 
                    pos={pos} 
                    shape={shape} 
                    color={color} 
                    patternId={patternId} 
                    patternColor={patternColor} 
                />
            </G>

            {/* Face Layer */}
            <G>
                <Circle cx="80" cy="100" r={eyeSize} fill="#333" />
                <Circle cx="120" cy="100" r={eyeSize} fill="#333" />
                <Path 
                    d="M 85 125 Q 100 135, 115 125" 
                    stroke="#333" 
                    strokeWidth="2" 
                    fill="none" 
                    strokeLinecap="round" 
                />
            </G>
        </Svg>
    );
};

export default Imp;
