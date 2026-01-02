import React from 'react';

const Mascot = ({ 
  hairColor = "#4A90E2", 
  bodyColor = "#F5F5F5", 
  noseSize = 0.8, 
  showPencil = true,
  smileType = "benevolent" 
}) => {
  return (
    <svg 
      viewBox="0 0 200 200" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: 'auto', maxWidth: '400px' }}
    >
      {/* --- Body --- */}
      <circle cx="100" cy="110" r="60" fill={bodyColor} stroke="#333" strokeWidth="2" />

      {/* --- Panda/Cat Hybrid Ears --- */}
      {/* Left Ear */}
      <path 
        d="M60 60 Q40 20 80 50" 
        fill="#333" 
        stroke="#333" 
        strokeWidth="2" 
        strokeLinecap="round" 
      />
      {/* Right Ear - Poking through hair */}
      <path 
        d="M120 50 Q160 20 140 60" 
        fill="#333" 
        stroke="#333" 
        strokeWidth="2" 
      />

      {/* --- Messy Hair (The "Before" Style) --- */}
      <path 
        d="M50 70 Q40 40 70 50 T100 30 T130 50 T150 70" 
        fill="none" 
        stroke={hairColor} 
        strokeWidth="8" 
        strokeLinecap="round" 
      />
      <path 
        d="M65 60 Q80 35 95 55 M105 55 Q120 35 135 60" 
        stroke={hairColor} 
        strokeWidth="4" 
        fill="none" 
      />

      {/* --- Face --- */}
      {/* Eyes */}
      <circle cx="80" cy="95" r="5" fill="#333" />
      <circle cx="120" cy="95" r="5" fill="#333" />
      
      {/* Small Nose (Scaled by Prop) */}
      <ellipse 
        cx="100" 
        cy="105" 
        rx={4 * noseSize} 
        ry={3 * noseSize} 
        fill="#FF9999" 
      />

      {/* Benevolent Smile */}
      <path 
        d="M85 115 Q100 130 115 115" 
        fill="none" 
        stroke="#333" 
        strokeWidth="2" 
        strokeLinecap="round" 
      />

      {/* --- Left Arm & Yellow Pencil --- */}
      <g transform="translate(45, 120)">
        {/* Arm */}
        <path d="M0 0 Q-20 10 -10 30" fill="none" stroke={bodyColor} strokeWidth="12" strokeLinecap="round" />
        <path d="M0 0 Q-20 10 -10 30" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" />
        
        {/* Simple Yellow Pencil - Inside Hand */}
        {showPencil && (
          <g transform="rotate(-15, -10, 30)">
            <rect x="-13" y="20" width="6" height="25" fill="#FFD700" stroke="#333" strokeWidth="1" />
            <path d="M-13 45 L-10 52 L-7 45 Z" fill="#F5CBA7" stroke="#333" strokeWidth="1" />
            <path d="M-11 50 L-10 52 L-9 50 Z" fill="#333" />
          </g>
        )}
        
        {/* Hand closing over pencil */}
        <circle cx="-10" cy="30" r="8" fill={bodyColor} stroke="#333" strokeWidth="2" />
      </g>
    </svg>
  );
};

export default Imp;
