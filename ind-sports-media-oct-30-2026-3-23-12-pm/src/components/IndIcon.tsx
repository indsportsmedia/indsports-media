import React from 'react';

export const IndIcon: React.FC<{ className?: string; size?: number | string }> = ({ 
  className = '', 
  size = 48 
}) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 400 400" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block select-none ${className}`}
      aria-label="IND Sports Media Icon"
    >
      <g fill="#FFFFFF">
        {/* Top-Right Triangle Arch & Right Apex */}
        <path d="M 148 38 C 162 38 175 46 184 57 L 368 186 C 382 196 382 210 368 220 L 184 349 C 175 360 162 368 148 368 C 122 368 104 350 104 326 L 104 300 L 138 300 L 138 322 C 138 328 146 332 152 328 L 332 203 L 152 78 C 146 74 138 78 138 84 L 138 106 L 104 106 L 104 80 C 104 56 122 38 148 38 Z" />

        {/* 'i' Dot: Slanted parallelogram at upper left */}
        <path d="M 98 88 L 134 88 L 122 130 L 86 130 Z" />

        {/* 'i' Stem: Slanted lower-left block projecting outwards */}
        <path d="M 80 148 L 118 148 L 78 274 L 40 274 Z" />

        {/* Bottom left bracket hook */}
        <path d="M 40 292 L 78 292 L 95 330 C 98 338 104 344 112 344 L 122 344 L 112 366 C 96 366 84 356 76 342 L 40 292 Z" />

        {/* 'N' Monogram: Athletic bold slanted 'N' inside triangle */}
        {/* Left pillar of N */}
        <path d="M 142 110 L 176 110 L 138 274 L 104 274 Z" />
        
        {/* Diagonal stroke of N */}
        <path d="M 142 110 L 232 274 L 268 274 L 178 110 Z" />
        
        {/* Right pillar of N */}
        <path d="M 232 134 L 266 134 L 234 274 L 200 274 Z" />
      </g>
    </svg>
  );
};

export default IndIcon;
