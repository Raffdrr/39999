import React from 'react';

interface IconProps {
  isActive: boolean;
  className?: string;
}

export const FavoritesIcon: React.FC<IconProps> = ({ isActive, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="28"
    height="28"
    className={className}
    style={{ filter: isActive ? 'drop-shadow(0 4px 5px rgba(239, 68, 68, 0.5))' : 'none' }}
  >
    <defs>
      <linearGradient id="heart-grad-active" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fb7185" />
        <stop offset="100%" stopColor="#f43f5e" />
      </linearGradient>
      <radialGradient id="heart-gloss-sculpted" cx="0.25" cy="0.25" r="0.7">
        <stop offset="0%" stopColor="white" stopOpacity="0.8" />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="heart-inner-shadow-sculpted">
         <stop offset="70%" stopColor="transparent" />
         <stop offset="100%" stopColor="rgba(0,0,0,0.3)" />
      </radialGradient>
    </defs>
    
    <path
      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      fill={isActive ? "none" : "currentColor"}
      stroke={isActive ? "none" : "currentColor"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    
    {isActive && (
      <>
        {/* Base/Shadow layer */}
        <path
          transform="translate(0.6, 0.8)"
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          fill="#be123c"
          opacity="0.6"
        />
        {/* Main colored heart */}
        <path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          fill="url(#heart-grad-active)"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="0.75"
        />
        {/* Inner Shadow for bevel */}
         <path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          fill="url(#heart-inner-shadow-sculpted)"
        />
        {/* Gloss highlight */}
        <path
          d="M7.5,3 C 9,4 12,6 12,8.5 C 12,6 15,4 16.5,3 C 14,3 12,5 12,7 C 12,5 10,3 7.5,3 z"
          fill="url(#heart-gloss-sculpted)"
          opacity="0.9"
        />
      </>
    )}
  </svg>
);