import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

export const MapPinIcon: React.FC<IconProps> = ({ className, size = 14 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    style={{ filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.2))' }}
  >
    <defs>
       <linearGradient id="mappin-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fbbf24" />
        <stop offset="100%" stopColor="#f59e0b" />
      </linearGradient>
       <radialGradient id="mappin-gloss" cx="0.3" cy="0.3" r="0.7">
        <stop offset="0%" stopColor="white" stopOpacity="0.7" />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </radialGradient>
    </defs>
    
    {/* Shadow */}
     <path
      d="M12 22s-8-6-8-12a8 8 0 0 1 16 0c0 6-8 12-8 12z"
      fill="#a16207"
      opacity="0.6"
      transform="translate(0.5, 0.5)"
    />

    {/* Body */}
    <path
      d="M12 22s-8-6-8-12a8 8 0 0 1 16 0c0 6-8 12-8 12z"
      fill="url(#mappin-grad)"
      stroke="rgba(255,255,255,0.3)"
      strokeWidth="0.5"
    />
    
     {/* Gloss */}
    <path
      d="M12 22s-8-6-8-12a8 8 0 0 1 16 0c0 6-8 12-8 12z"
      fill="url(#mappin-gloss)"
    />

    {/* Inner Circle */}
    <circle cx="12" cy="10" r="3" fill="white" />
  </svg>
);