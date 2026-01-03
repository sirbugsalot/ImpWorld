import React from 'react';
import Svg, { Path, Circle, G } from 'react-native-svg';
import { Oval } from '../src/components/shapes';

const Imp = ({ 
  hairColor = "#4A90E2", 
  bodyColor = "#F5F5F5",
  waveIntensity = 20 // We can use this to make the hair "messier"
}) => {
  return (
    <Svg viewBox="0 0 200 200" width="100%" height="100%">
      {/* --- Body --- */}
      <Oval 
                    pos={{ x: 50, y: 95 }} // Positioned near bottom of local 100x100 box
                    shape={shape} 
                    color={color} 
                    patternId={patternId} 
                    patternColor={patternColor} 
      />
      {/* --- Smooth Wavy Hair using T --- 
          M 50 80          -> Start the pen at the left temple
          Q 65 30, 80 60   -> Initial curve (Control point at 65,30)
          T 110 60         -> Smoothly continues to 110,60
          T 140 60         -> Smoothly continues to 140,60
          T 160 90         -> Ends at the right temple
      */}
      <Path 
        d={`M 50 80 
            Q 75 ${80 - waveIntensity}, 100 80 
            T 150 80`} 
        fill="none" 
        stroke={hairColor} 
        strokeWidth="8" 
        strokeLinecap="round" 
      />

      {/* --- Spiky T-Path (Adding points to make it look messy) --- */}
      <Path 
        d="M 60 70 
           Q 80 20, 100 70 
           T 140 70" 
        fill="none" 
        stroke={hairColor} 
        strokeWidth="4" 
        strokeLinecap="round"
        opacity="0.7"
      />

      {/* Face for context */}
      <G>
        <Circle cx="80" cy="100" r="5" fill="#333" />
        <Circle cx="120" cy="100" r="5" fill="#333" />
        <Path d="M 90 120 Q 100 130 110 120" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />
      </G>
    </Svg>
  );
};

export default Imp;

