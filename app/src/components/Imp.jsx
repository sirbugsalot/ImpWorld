import React from 'react';
import Svg, { Path, Circle, G } from 'react-native-svg';
// Note: Ensure the path to shapes is correct for your local environment
import { Oval } from './shapes'; 

/**
 * Imp Component
 * Fixed scope issues and tag capitalization to prevent sandbox crashes.
 */
const Imp = ({ 
  customization, // Passed in from Sandbox or WorldScreen
  hairColor = "#4A90E2", 
  waveIntensity = 20,
  eyeSize = 5,
  noseSize = 0.8
}) => {
    // FIX 1: Destructuring MUST happen inside the component to access the 'customization' prop
    const { 
        color = '#8A2BE2', 
        shape = { hy: 80, wx: 30, wy: 60 }, 
        patternId = null, 
        patternColor = '#FFFFFF' 
    } = customization || {}; // Fallback to empty object to prevent "cannot read property of undefined"

    return (
        /* FIX 2: Use capitalized <Svg> for React Native compatibility */
        <Svg viewBox="0 0 200 200" width="100%" height="100%">
            
            {/* --- Body (The Oval) --- */}
            <G transform="scale(2)">
                <Oval 
                    pos={{ x: 50, y: 85 }} 
                    shape={shape} 
                    color={color} 
                    patternId={patternId} 
                    patternColor={patternColor} 
                />
            </G>

            {/* --- Face Overlay --- */}
            <G>
                {/* Eyes - Adjustable for your learning tool */}
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
            {/* reference point */}
            <Circle cx="100" cy="160" r=2 fill="#333" />
        </Svg>
    );
};

export default Imp;
