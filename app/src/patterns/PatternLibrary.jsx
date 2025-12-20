import React from 'react';
import Svg, { Defs, Pattern, Circle, Rect, Path } from 'react-native-svg';

/**
 * PatternLibrary provides SVG definitions for various textures.
 * Each pattern takes a 'color' (for the pattern itself) and a 'id'.
 */
const PatternLibrary = ({ patternId, color = '#000000' }) => {
  return (
    <Defs>
      {/* Polka Dots */}
      <Pattern
        id="polka-dots"
        patternUnits="userSpaceOnUse"
        width="20"
        height="20"
      >
        <Circle cx="10" cy="10" r="3" fill={color} />
      </Pattern>

      {/* Stripes (Diagonal) */}
      <Pattern
        id="stripes"
        patternUnits="userSpaceOnUse"
        width="10"
        height="10"
        patternTransform="rotate(45)"
      >
        <Rect width="5" height="10" fill={color} />
      </Pattern>

      {/* Hearts */}
      <Pattern
        id="hearts"
        patternUnits="userSpaceOnUse"
        width="30"
        height="30"
      >
        <Path 
          d="M15 25.5 L13.2 23.8 C5.2 16.6 0 12 0 6.5 C0 2.9 2.8 0 6.4 0 C8.4 0 10.4 1 11.6 2.5 C12.8 1 14.8 0 16.8 0 C20.4 0 23.2 2.9 23.2 6.5 C23.2 12 18 16.6 10 23.8 L15 25.5" 
          fill={color} 
          transform="scale(0.6) translate(5, 5)"
        />
      </Pattern>

      {/* Squares (Checkerboard style) */}
      <Pattern
        id="squares"
        patternUnits="userSpaceOnUse"
        width="20"
        height="20"
      >
        <Rect width="10" height="10" fill={color} />
        <Rect x="10" y="10" width="10" height="10" fill={color} />
      </Pattern>

      {/* Zigzag */}
      <Pattern
        id="zigzag"
        patternUnits="userSpaceOnUse"
        width="20"
        height="20"
      >
        <Path 
          d="M0 10 L5 5 L10 10 L15 5 L20 10 L20 15 L15 10 L10 15 L5 10 L0 15 Z" 
          fill={color} 
        />
      </Pattern>
    </Defs>
  );
};

export default PatternLibrary;

