import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

export const CalendarPlusIcon: React.FC<IconProps> = ({ className, size = 28 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    style={{ filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.2))' }}
  >
    <defs>
      <linearGradient id="calplus-grad-body" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f87171" />
        <stop offset="100%" stopColor="#ef4444" />
      </linearGradient>
      <linearGradient id="calplus-grad-header" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fca5a5" />
        <stop offset="100%" stopColor="#f87171" />
      </linearGradient>
    </defs>

    {/* Main body */}
    <rect x="3" y="4" width="18" height="18" rx="2" fill="url(#calplus-grad-body)" stroke="#b91c1c" strokeWidth="0.5" />
    {/* Header */}
    <path d="M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3H3V6z" fill="url(#calplus-grad-header)" />
    <path d="M16 2v4M8 2v4" stroke="#fed7d7" strokeWidth="2" strokeLinecap="round" />

    {/* Plus Icon */}
    <path d="M12 11v6m3-3h-6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);