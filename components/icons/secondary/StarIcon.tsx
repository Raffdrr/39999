import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

export const StarIcon: React.FC<IconProps> = ({ className, size = 14 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    style={{ filter: 'drop-shadow(0 1px 1.5px rgba(0,0,0,0.2))' }}
  >
    <defs>
      <linearGradient id="star-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fcd34d" />
        <stop offset="100%" stopColor="#fbbf24" />
      </linearGradient>
       <radialGradient id="star-gloss" cx="0.5" cy="0.5" r="0.8">
        <stop offset="0%" stopColor="white" stopOpacity="0.8" />
        <stop offset="70%" stopColor="white" stopOpacity="0" />
      </radialGradient>
    </defs>
    
    {/* Shadow */}
    <path
      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
      fill="#b45309"
      opacity="0.5"
      transform="translate(0.4, 0.4)"
    />
    
    {/* Body */}
     <path
      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
      fill="url(#star-grad)"
      stroke="#f59e0b"
      strokeWidth="0.5"
    />

     {/* Gloss */}
    <path
      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
      fill="url(#star-gloss)"
    />
  </svg>
);