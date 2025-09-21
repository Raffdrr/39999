import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

export const AwardIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
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
      <linearGradient id="award-grad-medal" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fde047" />
        <stop offset="100%" stopColor="#facc15" />
      </linearGradient>
      <linearGradient id="award-grad-ribbon" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#fb923c" />
        <stop offset="100%" stopColor="#f97316" />
      </linearGradient>
    </defs>
    <circle cx="12" cy="8" r="7" fill="url(#award-grad-medal)" stroke="#eab308" strokeWidth="1" />
    <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" fill="url(#award-grad-ribbon)" stroke="#ea580c" strokeWidth="1"/>
  </svg>
);