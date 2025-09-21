import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

export const TrashIcon: React.FC<IconProps> = ({ className, size = 18 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    style={{ filter: 'drop-shadow(0 1px 1.5px rgba(0,0,0,0.15))' }}
  >
    <defs>
      <linearGradient id="trash-grad-body" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#f87171" />
        <stop offset="100%" stopColor="#ef4444" />
      </linearGradient>
      <linearGradient id="trash-grad-lid" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ef4444" />
        <stop offset="100%" stopColor="#dc2626" />
      </linearGradient>
    </defs>
    
    {/* Body */}
    <path d="M4 7h16m-1 14H5a2 2 0 0 1-2-2V7h14v12a2 2 0 0 1-2 2z" fill="url(#trash-grad-body)" />
    
    {/* Lid */}
    <path d="M20 7H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2z" transform="translate(0, -2)" fill="url(#trash-grad-lid)" />
    <path d="M10 2h4" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />

  </svg>
);