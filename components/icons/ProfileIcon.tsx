import React from 'react';

interface IconProps {
  isActive: boolean;
  className?: string;
}

export const ProfileIcon: React.FC<IconProps> = ({ isActive, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="28"
    height="28"
    className={className}
    style={{ filter: isActive ? 'drop-shadow(0 4px 5px rgba(251, 191, 36, 0.4))' : 'none' }}
  >
    <defs>
      <linearGradient id="profile-grad-head" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fde047" />
        <stop offset="100%" stopColor="#facc15" />
      </linearGradient>
      <linearGradient id="profile-grad-body" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fbbf24" />
        <stop offset="100%" stopColor="#f59e0b" />
      </linearGradient>
      <radialGradient id="profile-gloss-sculpted" cx="0.3" cy="0.2" r="0.8">
        <stop offset="0%" stopColor="#fff" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#fff" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="profile-inner-shadow" cx="0.5" cy="0.5" r="0.5">
        <stop offset="70%" stopColor="transparent" />
        <stop offset="100%" stopColor="rgba(0,0,0,0.2)" />
      </radialGradient>
    </defs>
    
    {isActive ? (
      <>
        {/* Base/Shadow Layer */}
        <path
          transform="translate(0.6, 0.8)"
          d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
          fill="#92400e"
          opacity="0.6"
        />
        <circle
          transform="translate(0.6, 0.8)"
          cx="12"
          cy="7"
          r="4"
          fill="#92400e"
          opacity="0.6"
        />

        {/* Main Body */}
        <path
          d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
          fill="url(#profile-grad-body)"
          stroke="#fb923c"
          strokeWidth="0.75"
        />
        {/* Head */}
        <circle
          cx="12"
          cy="7"
          r="4"
          fill="url(#profile-grad-head)"
          stroke="#fb923c"
          strokeWidth="0.75"
        />
        {/* Inner shadow for sculpted effect */}
        <circle cx="12" cy="7" r="4" fill="url(#profile-inner-shadow)" />
        {/* Gloss Highlight */}
        <circle cx="12" cy="7" r="4" fill="url(#profile-gloss-sculpted)" opacity="0.9" />
      </>
    ) : (
      <path
        d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    )}
  </svg>
);