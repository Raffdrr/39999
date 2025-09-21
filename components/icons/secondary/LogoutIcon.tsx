import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}
export const LogoutIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <defs>
      <linearGradient id="logout-grad-arrow" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#f87171" />
        <stop offset="100%" stopColor="#ef4444" />
      </linearGradient>
       <linearGradient id="logout-grad-door" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#fb923c" />
        <stop offset="100%" stopColor="#f97316" />
      </linearGradient>
    </defs>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="url(#logout-grad-door)" strokeWidth="2.5" />
    <polyline points="16 17 21 12 16 7" stroke="url(#logout-grad-arrow)" strokeWidth="2.5" />
    <line x1="21" y1="12" x2="9" y2="12" stroke="url(#logout-grad-arrow)" strokeWidth="2.5" />
  </svg>
);