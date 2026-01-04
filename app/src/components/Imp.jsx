import React from 'react';
import Svg, { Path, Circle, G } from 'react-native-svg';
import { Oval } from './shapes'; 

/**
 * Imp Component
 * Fixed a math syntax error where a calculation was outside the curly braces.
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
        shape = { hy: 80, wx: 70, wy: 40 }, 
        patternId = null, 
        patternColor = '#FFFFFF' 
    } = customization || {};

    return (
        <Svg viewBox="0 0 200 200" width="100%" height="100%">
            
            {/* --- Body Group (Scaled) --- */}
            <G transform="scale(2)">
                
                {/* --- Left Foot --- */}
                <Path 
                    d={`M ${pos.x} ${pos.y} 
                       Q ${pos.x - 15} ${pos.y + 5}, ${pos.x - 15} ${pos.y + 13}
                       Q ${pos.x - 13} ${pos.y + 13}, ${pos.x - 15} ${pos.y + 16}
                       Q ${pos.x - 18} ${pos.y + 18}, ${pos.x - 22} ${pos.y + 16}
                       Q ${pos.x - shape.wx/2 - 3} ${shape.wy + 20}, ${pos.x - shape.wx/2} ${shape.wy}
                       Z`} 
                    stroke="#FF0000" 
                    strokeWidth="1" 
                    fill={color}
                    strokeLinecap="round" 
                />
                {/* --- Right Foot --- */}
                <Path 
                    d={`M ${pos.x + 2} ${pos.y} 
                       Q ${pos.x + 9} ${pos.y + 12}, ${pos.x + 8} ${pos.y + 15}
                       Q ${pos.x + 12} ${pos.y + 17}, ${pos.x + 17} ${pos.y + 14}
                       Q ${pos.x + 19} ${pos.y + 12}, ${pos.x + 17} ${pos.y + 11}
                       Q ${pos.x + shape.wx/2 + 3} ${shape.wy + 25}, ${pos.x + shape.wx/2 - 10} ${shape.wy}
                       Z`} 
                    stroke="#FF0000" 
                    strokeWidth="1" 
                    fill={color}
                    strokeLinecap="round" 
                />

                <Oval 
                    pos={pos} 
                    shape={shape} 
                    color={color} 
                    patternId={patternId} 
                    patternColor={patternColor} 
                />

                {/* Pivot Point for debugging */}
                <Circle cx={pos.x + 2} cy={pos.y} r="1" fill="#FF0000" opacity="0.7" />
                <Circle cx={pos.x + 8} cy={pos.y + 14} r="1" fill="#333" opacity="0.5" />
                <Circle cx={pos.x + 17} cy={pos.y + 15} r="1" fill="#333" opacity="0.5" />
                <Circle cx={pos.x + 17} cy={pos.y + 11} r="1" fill="#333" opacity="0.5" />
            </G>
        </Svg>
    );
};

export default Imp;

