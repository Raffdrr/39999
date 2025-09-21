import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

export const EventPinIcon: React.FC<IconProps> = ({ className, size = 14 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    style={{ filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.2))' }}
  >
    <defs>
      <linearGradient id="eventpin-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f97316" />
        <stop offset="100%" stopColor="#ea580c" />
      </linearGradient>
      <radialGradient id="eventpin-gloss" cx="0.3" cy="0.3" r="0.7">
        <stop offset="0%" stopColor="white" stopOpacity="0.7" />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </radialGradient>
    </defs>
    
    {/* Shadow */}
    <path
      d="M12 22s-8-6-8-12a8 8 0 0 1 16 0c0 6-8 12-8 12z"
      fill="#9a3412"
      opacity="0.6"
      transform="translate(0.5, 0.5)"
    />

    {/* Body */}
    <path
      d="M12 22s-8-6-8-12a8 8 0 0 1 16 0c0 6-8 12-8 12z"
      fill="url(#eventpin-grad)"
      stroke="rgba(255,255,255,0.3)"
      strokeWidth="0.5"
    />
    
    {/* Gloss */}
    <path
      d="M12 22s-8-6-8-12a8 8 0 0 1 16 0c0 6-8 12-8 12z"
      fill="url(#eventpin-gloss)"
    />

    {/* Inner Calendar Icon */}
    <g transform="translate(7.5, 6) scale(0.4)">
        <path d="M4 7V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7zm0 4h16M16 3v4M8 3v4" 
            fill="none" 
            stroke="white" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"/>
    </g>
  </svg>
);