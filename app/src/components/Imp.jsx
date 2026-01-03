import React from 'react';
import Svg, { 
  Circle, 
  Path, 
  Ellipse, 
  G, 
  Rect 
} from 'react-native-svg';

/**
 * Imp Component - Refactored for React Native
 * Uses react-native-svg components to ensure compatibility in the Sandbox.
 */
const Imp = ({ 
  hairColor = "#4A90E2", 
  bodyColor = "#F5F5F5", 
  noseSize = 0.8,
  eyeSize = 5 // Example of your "learning tool" customization
}) => {
  return (
    <Svg viewBox="0 0 200 200" width="100%" height="100%">
      {/* BODY SHAPE (The "Teardrop" style from your image)
        M: Start at bottom center
        Q: Curve up left side to the neck
        Q: Curve around the top of the head
        Q: Curve down the right side
        Z: Close at the bottom
      */}
      <Path 
        d="M 100 180 
           Q 40 180, 50 110 
           Q 50 40, 100 40 
           Q 150 40, 150 110 
           Q 160 180, 100 180 
           Z" 
        fill={bodyColor} 
        stroke="#333" 
        strokeWidth="3" 
      />

      {/* FACE FEATURES */}
      <G>
        {/* Eyes - using your request for adjustable size */}
        <Circle cx="80" cy="90" r={eyeSize} fill="#333" />
        <Circle cx="120" cy="90" r={eyeSize} fill="#333" />
        
        {/* Mouth - A simple benevolent curve */}
        <Path 
          d="M 85 110 Q 100 125, 115 110" 
          fill="none" 
          stroke="#333" 
          strokeWidth="2" 
          strokeLinecap="round" 
        />
      </G>

      {/* MESSY HAIR 
        Using 'M' to jump and 'Q' to create individual tufts
      */}
      <Path 
        d="M 70 45 Q 60 10, 85 35 
           M 90 35 Q 100 0, 115 35
           M 120 35 Q 140 10, 130 50" 
        stroke={hairColor} 
        strokeWidth="6" 
        fill="none" 
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default Imp;

