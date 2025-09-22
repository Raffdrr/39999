import React from 'react';

interface IconProps {
  isActive: boolean;
  className?: string;
}

export const CalendarIcon: React.FC<IconProps> = ({ isActive, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="28"
    height="28"
    className={className}
    style={{ filter: isActive ? 'drop-shadow(0 4px 5px rgba(168, 85, 247, 0.4))' : 'none' }}
  >
    <defs>
      <linearGradient id="cal-grad-base" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#c084fc" />
        <stop offset="100%" stopColor="#9333ea" />
      </linearGradient>
      <linearGradient id="cal-grad-header" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#e9d5ff" />
        <stop offset="100%" stopColor="#d8b4fe" />
      </linearGradient>
       <radialGradient id="cal-gloss-sculpted" cx="0.5" cy="0" r="0.8">
        <stop offset="0%" stopColor="#fff" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#fff" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="cal-ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f3e8ff" />
        <stop offset="100%" stopColor="#d8b4fe" />
      </linearGradient>
    </defs>
    
    {isActive ? (
      <>
        {/* Base/Shadow Layer */}
        <rect x="3.6" y="4.8" width="18" height="18" rx="2.5" fill="#581c87" opacity="0.6" />
        {/* Main Body */}
        <rect x="3" y="4" width="18" height="18" rx="2.5" fill="url(#cal-grad-base)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.75"/>
        {/* Header */}
        <path d="M3,6.5c0-1.38,1.12-2.5,2.5-2.5h13c1.38,0,2.5,1.12,2.5,2.5v3H3V6.5z" fill="url(#cal-grad-header)" />
        {/* Rings */}
        <path d="M16,2.5 v4" strokeWidth="3" stroke="url(#cal-ring-grad)" strokeLinecap="round" />
        <path d="M8,2.5 v4" strokeWidth="3" stroke="url(#cal-ring-grad)" strokeLinecap="round" />
        <path d="M16,2.5 v4" strokeWidth="1.5" stroke="#a855f7" strokeLinecap="round" />
        <path d="M8,2.5 v4" strokeWidth="1.5" stroke="#a855f7" strokeLinecap="round" />

        {/* Dots */}
        <rect x="7" y="12" width="2" height="2" rx="0.5" fill="#fff" fillOpacity="0.7" />
        <rect x="11" y="12" width="2" height="2" rx="0.5" fill="#fff" fillOpacity="0.7" />
        <rect x="15" y="12" width="2" height="2" rx="0.5" fill="#fff" fillOpacity="0.7" />
        <rect x="7" y="16" width="2" height="2" rx="0.5" fill="#fff" fillOpacity="0.7" />
      </>
    ) : (
      <path
        d="M4 7V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2M16 3v4M8 3v4M4 11h16M4 11v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    )}
  </svg>
);