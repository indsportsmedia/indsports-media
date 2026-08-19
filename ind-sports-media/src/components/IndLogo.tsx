import React from 'react';

interface IndLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const IndLogo: React.FC<IndLogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-8 sm:h-10',
    md: 'h-10 sm:h-12',
    lg: 'h-16 sm:h-20 md:h-24',
    xl: 'h-20 sm:h-28 md:h-36',
  };

  return (
    <div className={`inline-flex items-center select-none ${sizeClasses[size]} ${className}`}>
      <svg 
        viewBox="0 0 580 180" 
        className="h-full w-auto object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
        aria-label="IND Sports Media Logo"
      >
        <g fill="none" fillRule="evenodd">
          {/* Play Triangle Badge */}
          <g transform="translate(15, 10)">
            {/* Outer rounded play button triangle */}
            <path 
              d="M 40 18 L 150 82 C 162 89 162 95 150 102 L 40 166 C 28 173 15 163 15 146 L 15 38 C 15 21 28 11 40 18 Z" 
              fill="none" 
              stroke="#FFFFFF" 
              strokeWidth="14" 
              strokeLinejoin="round"
            />
            
            {/* Inner 'iND' monogram */}
            <circle cx="50" cy="62" r="7.5" fill="#FFFFFF"/>
            <path d="M 44 76 L 56 76 L 50 132 L 38 132 Z" fill="#FFFFFF"/>
            
            <path d="M 62 80 L 74 80 L 68 132 L 56 132 Z" fill="#FFFFFF"/>
            <path d="M 62 80 L 100 132 L 112 132 L 74 80 Z" fill="#FFFFFF"/>
            <path d="M 100 80 L 112 80 L 106 132 L 94 132 Z" fill="#FFFFFF"/>
          </g>

          {/* IND SPORTS MEDIA Typography */}
          <g transform="translate(185, 15)">
            <text 
              x="0" 
              y="100" 
              fontFamily="'Montserrat', 'Impact', 'Arial Black', sans-serif" 
              fontSize="110" 
              fontWeight="900" 
              fontStyle="italic" 
              fill="#FFFFFF" 
              letterSpacing="-1"
            >
              IND
            </text>
            <text 
              x="4" 
              y="142" 
              fontFamily="'Montserrat', 'Arial Black', sans-serif" 
              fontSize="28" 
              fontWeight="900" 
              fontStyle="italic" 
              fill="#FFFFFF" 
              letterSpacing="8"
            >
              SPORTS MEDIA
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
};

export default IndLogo;
