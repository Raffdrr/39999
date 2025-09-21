import React from 'react';

interface IconProps {
  className?: string;
}
export const HelpIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <defs>
       <linearGradient id="help-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="100%" stopColor="#0ea5e9" />
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" r="10" fill="url(#help-grad)" stroke="#0284c7" strokeWidth="1"/>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="white" strokeWidth="2.5" />
    <line x1="12" y1="17" x2="12.01" y2="17" stroke="white" strokeWidth="3" />
  </svg>
);