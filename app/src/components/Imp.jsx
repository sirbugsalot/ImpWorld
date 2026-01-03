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
  showPencil = true,
  smileType = "benevolent" 
}) => {
  return (
    <Svg 
      viewBox="0 0 200 200" 
      width="100%" 
      height="100%"
    >
      {/* --- Body --- */}
      <Circle cx="100" cy="110" r="60" fill={bodyColor} stroke="#333" strokeWidth="2" />

      {/* --- Panda/Cat Hybrid Ears --- */}
      {/* Left Ear */}
      <Path 
        d="M60 60 Q40 20 80 50" 
        fill="#333" 
        stroke="#333" 
        strokeWidth="2" 
        strokeLinecap="round" 
      />
      {/* Right Ear - Poking through hair */}
      <Path 
        d="M120 50 Q160 20 140 60" 
        fill="#333" 
        stroke="#333" 
        strokeWidth="2" 
      />

      {/* --- Messy Hair --- */}
      <Path 
        d="M50 70 Q40 40 70 50 T100 30 T130 50 T150 70" 
        fill="none" 
        stroke={hairColor} 
        strokeWidth="8" 
        strokeLinecap="round" 
      />
      <Path 
        d="M65 60 Q80 35 95 55 M105 55 Q120 35 135 60" 
        stroke={hairColor} 
        strokeWidth="4" 
        fill="none" 
      />

      {/* --- Face --- */}
      {/* Eyes */}
      <Circle cx="80" cy="95" r="5" fill="#333" />
      <Circle cx="120" cy="95" r="5" fill="#333" />
      
      {/* Small Nose */}
      <Ellipse 
        cx="100" 
        cy="105" 
        rx={4 * noseSize} 
        ry={3 * noseSize} 
        fill="#FF9999" 
      />

      {/* Benevolent Smile */}
      <Path 
        d="M85 115 Q100 130 115 115" 
        fill="none" 
        stroke="#333" 
        strokeWidth="2" 
        strokeLinecap="round" 
      />

      {/* --- Left Arm & Yellow Pencil --- */}
      <G transform="translate(45, 120)">
        {/* Arm */}
        <Path d="M0 0 Q-20 10 -10 30" fill="none" stroke={bodyColor} strokeWidth="12" strokeLinecap="round" />
        <Path d="M0 0 Q-20 10 -10 30" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" />
        
        {/* Simple Yellow Pencil */}
        {showPencil && (
          <G transform="rotate(-15, -10, 30)">
            <Rect x="-13" y="20" width="6" height="25" fill="#FFD700" stroke="#333" strokeWidth="1" />
            <Path d="M-13 45 L-10 52 L-7 45 Z" fill="#F5CBA7" stroke="#333" strokeWidth="1" />
            <Path d="M-11 50 L-10 52 L-9 50 Z" fill="#333" />
          </G>
        )}
        
        {/* Hand closing over pencil */}
        <Circle cx="-10" cy="30" r="8" fill={bodyColor} stroke="#333" strokeWidth="2" />
      </G>
    </Svg>
  );
};

export default Imp;
