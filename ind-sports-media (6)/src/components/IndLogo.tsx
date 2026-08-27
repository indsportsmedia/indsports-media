import React, { useState } from 'react';

interface IndLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon';
  src?: string;
}

export const IndLogo: React.FC<IndLogoProps> = ({ 
  className = '', 
  size = 'md',
  variant = 'full',
  src
}) => {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    sm: 'h-8 sm:h-9',
    md: 'h-10 sm:h-12',
    lg: 'h-16 sm:h-20 md:h-24',
    xl: 'h-20 sm:h-28 md:h-36',
  };

  // If a custom image path is provided or if logo (3).png / logo.png exists in public/
  const imageSource = src || '/logo (3).png';

  if (!imgError && imageSource) {
    return (
      <div className={`inline-flex items-center select-none ${sizeClasses[size]} ${className}`}>
        <img
          src={imageSource}
          alt="IND Sports Media"
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="h-full w-auto object-contain filter drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]"
        />
      </div>
    );
  }

  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center select-none ${sizeClasses[size]} ${className}`}>
        <svg 
          viewBox="0 0 400 400" 
          className="h-full w-auto object-contain filter drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]"
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
            <path d="M 142 110 L 176 110 L 138 274 L 104 274 Z" />
            <path d="M 142 110 L 232 274 L 268 274 L 178 110 Z" />
            <path d="M 232 134 L 266 134 L 234 274 L 200 274 Z" />
          </g>
        </svg>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center select-none ${sizeClasses[size]} ${className}`}>
      <svg 
        viewBox="0 0 880 280" 
        className="h-full w-auto object-contain filter drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]"
        aria-label="IND Sports Media Logo"
      >
        <g fill="#FFFFFF">
          {/* PLAY BUTTON TRIANGLE MONOGRAM (iND Icon) */}
          <g transform="translate(10, 10) scale(0.65)">
            {/* Top-Right Triangle Arch & Right Apex */}
            <path d="M 148 38 C 162 38 175 46 184 57 L 368 186 C 382 196 382 210 368 220 L 184 349 C 175 360 162 368 148 368 C 122 368 104 350 104 326 L 104 300 L 138 300 L 138 322 C 138 328 146 332 152 328 L 332 203 L 152 78 C 146 74 138 78 138 84 L 138 106 L 104 106 L 104 80 C 104 56 122 38 148 38 Z" />

            {/* 'i' Dot: Slanted parallelogram at upper left */}
            <path d="M 98 88 L 134 88 L 122 130 L 86 130 Z" />

            {/* 'i' Stem: Slanted lower-left block projecting outwards */}
            <path d="M 80 148 L 118 148 L 78 274 L 40 274 Z" />

            {/* Bottom left bracket hook */}
            <path d="M 40 292 L 78 292 L 95 330 C 98 338 104 344 112 344 L 122 344 L 112 366 C 96 366 84 356 76 342 L 40 292 Z" />

            {/* 'N' Monogram: Athletic bold slanted 'N' inside triangle */}
            <path d="M 142 110 L 176 110 L 138 274 L 104 274 Z" />
            <path d="M 142 110 L 232 274 L 268 274 L 178 110 Z" />
            <path d="M 232 134 L 266 134 L 234 274 L 200 274 Z" />
          </g>

          {/* WORDMARK: IND SPORTS MEDIA */}
          <g transform="translate(300, 10)">
            {/* IND Main Athletic Display Header */}
            <g transform="skewX(-16)">
              {/* Letter 'I' */}
              <path 
                d="M 60 28 L 102 28 C 108 28 112 32 112 38 L 112 152 C 112 158 108 162 102 162 L 60 162 C 54 162 50 158 50 152 L 50 38 C 50 32 54 28 60 28 Z" 
                fill="#FFFFFF"
              />
              
              {/* Letter 'N' */}
              <path 
                d="M 138 28 L 180 28 L 254 126 L 254 38 C 254 32 258 28 264 28 L 302 28 C 308 28 312 32 312 38 L 312 152 C 312 158 308 162 302 162 L 260 162 L 186 64 L 186 152 C 186 158 182 162 176 162 L 138 162 C 132 162 128 158 128 152 L 128 38 C 128 32 132 28 138 28 Z" 
                fill="#FFFFFF"
              />
              
              {/* Letter 'D' */}
              <path 
                d="M 338 28 L 418 28 C 472 28 512 60 512 95 C 512 130 472 162 418 162 L 338 162 C 332 162 328 158 328 152 L 328 38 C 328 32 332 28 338 28 Z M 382 64 L 382 126 L 412 126 C 444 126 464 114 464 95 C 464 76 444 64 412 64 Z" 
                fill="#FFFFFF"
              />
            </g>
            
            {/* 'SPORTS MEDIA' Subtitle */}
            <text 
              x="2" 
              y="222" 
              fontFamily="'Montserrat', 'Impact', 'Arial Black', -apple-system, sans-serif" 
              fontSize="44" 
              fontWeight="900" 
              fontStyle="italic" 
              fill="#FFFFFF" 
              letterSpacing="9"
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
