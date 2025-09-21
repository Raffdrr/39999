import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

export const FilterIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    style={{ filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.15))' }}
  >
    <defs>
      <linearGradient id="filter-grad-top" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#d1d5db" />
        <stop offset="100%" stopColor="#9ca3af" />
      </linearGradient>
      <linearGradient id="filter-grad-body" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#e5e7eb" />
        <stop offset="100%" stopColor="#d1d5db" />
      </linearGradient>
       <radialGradient id="filter-gloss" cx="0.5" cy="0" r="1">
        <stop offset="0%" stopColor="#fff" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#fff" stopOpacity="0" />
      </radialGradient>
    </defs>
    
    {/* Body */}
    <path
      d="M3 4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2.586a1 1 0 0 1-.293.707l-6.414 6.414a1 1 0 0 0-.293.707V19l-4-2v-4.586a1 1 0 0 0-.293-.707L3.293 7.293A1 1 0 0 1 3 6.586V4z"
      fill="url(#filter-grad-body)"
      stroke="#9ca3af"
      strokeWidth="0.5"
    />
    
    {/* Top Funnel Rim */}
    <path
      d="M3 4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v1H3V4z"
      fill="url(#filter-grad-top)"
    />
     <path
      d="M3 4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v1H3V4z"
      fill="url(#filter-gloss)"
      opacity="0.8"
    />
  </svg>
);