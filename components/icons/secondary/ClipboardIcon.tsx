import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

export const ClipboardIcon: React.FC<IconProps> = ({ className, size = 28 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    style={{ filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.2))' }}
  >
    <defs>
      <linearGradient id="clipboard-grad-body" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#e2e8f0" />
        <stop offset="100%" stopColor="#cbd5e1" />
      </linearGradient>
      <linearGradient id="clipboard-grad-clip" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="100%" stopColor="#0ea5e9" />
      </linearGradient>
    </defs>

    {/* Paper */}
    <path d="M6 4h8a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" fill="url(#clipboard-grad-body)" stroke="#94a3b8" strokeWidth="0.5" />
    <path d="M8 12h4m-4 4h2" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
    
    {/* Clip */}
    <path d="M14 4h2a2 2 0 0 1 2 2v2M10 4H8a2 2 0 0 0-2 2v2" fill="none" />
    <rect x="8" y="2" width="8" height="4" rx="1" fill="url(#clipboard-grad-clip)" stroke="#0284c7" strokeWidth="0.5" />
  </svg>
);