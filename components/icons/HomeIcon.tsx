import React from 'react';

interface IconProps {
  isActive: boolean;
  className?: string;
}

export const HomeIcon: React.FC<IconProps> = ({ isActive, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="28"
    height="28"
    className={className}
    style={{ filter: isActive ? 'drop-shadow(0 4px 5px rgba(30, 144, 255, 0.4))' : 'none' }}
  >
    <defs>
      <linearGradient id="home-grad-base" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="100%" stopColor="#3b82f6" />
      </linearGradient>
      <linearGradient id="home-grad-roof" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#7dd3fc" />
        <stop offset="100%" stopColor="#38bdf8" />
      </linearGradient>
      <radialGradient id="home-gloss-sculpted" cx="0.2" cy="0.2" r="0.8">
        <stop offset="0%" stopColor="#fff" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#fff" stopOpacity="0" />
      </radialGradient>
    </defs>
    
    {isActive ? (
      <>
        {/* Base/Shadow Layer */}
        <path
          transform="translate(0.6, 0.8)"
          d="M1.5 10.5 L12 2 L22.5 10.5 V 22 H15 V 15 H9 V 22 H1.5 Z"
          fill="#1e3a8a"
          opacity="0.6"
        />
        {/* Main Body */}
        <path
          d="M1.5 10.5 L12 2 L22.5 10.5 V 22 H15 V 15 H9 V 22 H1.5 Z"
          fill="url(#home-grad-base)"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="0.75"
          strokeLinejoin="round"
        />
        {/* Roof */}
        <path
          d="M1 11 L12 2 L23 11 Z"
          fill="url(#home-grad-roof)"
          stroke="rgba(255,255,255,0.6)"
          strokeWidth="0.75"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </>
    ) : (
      <path
        d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    )}
  </svg>
);