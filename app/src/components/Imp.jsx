import React from 'react';
import Svg, { Path, Circle, G } from 'react-native-svg';
// Note: Ensure the path to shapes is correct for your local environment
import { Oval } from './shapes'; 

/**
 * Imp Component
 * Fixed the string interpolation error in the Path 'd' attribute.
 */
const Imp = ({ 
  customization, 
  hairColor = "#4A90E2", 
  waveIntensity = 20,
  eyeSize = 5,
  noseSize = 0.8
}) => {
    const { 
        color = '#8A2BE2', 
        pos = { x: 50, y: 80 },
        shape = { hy: 80, wx: 50, wy: 60 }, 
        patternId = null, 
        patternColor = '#FFFFFF' 
    } = customization || {};

    return (
        <Svg viewBox="0 0 200 200" width="100%" height="100%">
            
            {/* --- Body Group (Scaled) --- */}
            <G transform="scale(2)">
                
                {/* --- Left Foot --- */}
                {/* FIX: Changed double quotes to backticks so ${pos.x} evaluates correctly */}
                <Path 
                    d={`M ${pos.x} ${pos.y} 
                       Q ${pos.x}-15 ${pos.y}+5, ${pos.x}-15 ${pos.y}+13 
                       Q ${pos.x}-10 ${pos.y}+13, ${pos.x}-15 ${pos.y}+17 
                       T ${pos.x}-20 ${pos.y}+17`} 
                    stroke="#FF0000" 
                    strokeWidth="1" 
                    fill="none" 
                    strokeLinecap="round" 
                />

                <Oval 
                    pos={pos} 
                    shape={shape} 
                    color={color} 
                    patternId={patternId} 
                    patternColor={patternColor} 
                />

                {/* Reference point (Pivot) */}
                <Circle cx={pos.x} cy={pos.y} r="1" fill="#FF0000" opacity="0.5" />
            </G>

            {/* --- Face Overlay --- */}
            {/* Note: Face coordinates are outside the scale(2) group, 
                so they use the full 200x200 coordinate space. */}
            <G>
                {/* Eyes */}
                <Circle cx="80" cy="100" r={eyeSize} fill="#333" />
                <Circle cx="120" cy="100" r={eyeSize} fill="#333" />
              
                {/* Benevolent Smile */}
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

