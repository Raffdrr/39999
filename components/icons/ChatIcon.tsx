import React from 'react';

interface IconProps {
  isActive: boolean;
  className?: string;
}

export const ChatIcon: React.FC<IconProps> = ({ isActive, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="28"
    height="28"
    className={className}
    style={{ filter: isActive ? 'drop-shadow(0 4px 5px rgba(16, 185, 129, 0.4))' : 'none' }}
  >
    <defs>
      <linearGradient id="chat-grad-back" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#06b6d4" />
        <stop offset="100%" stopColor="#0891b2" />
      </linearGradient>
      <linearGradient id="chat-grad-front" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4ade80" />
        <stop offset="100%" stopColor="#22c55e" />
      </linearGradient>
      <radialGradient id="chat-gloss-sculpted" cx="0.2" cy="0.2" r="0.8">
        <stop offset="0%" stopColor="#fff" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#fff" stopOpacity="0" />
      </radialGradient>
    </defs>
    
    {isActive ? (
      <>
        {/* Back Bubble (Shadow) */}
        <path
          d="M16 14.5V5a2 2 0 0 0-2-2H3a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2.5l3 3.5Z"
          fill="#0f766e"
          transform="translate(4.6, 4.3)"
          opacity="0.6"
        />
        {/* Front Bubble (Main) */}
        <path
          d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
          fill="url(#chat-grad-front)"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="0.75"
          strokeLinejoin="round"
        />
        {/* Gloss Highlight */}
        <path
          d="M5,5 C 10,4.5 18,6 20,10 C 18, 8 10,7 5,9 V5 Z"
          fill="url(#chat-gloss-sculpted)"
          opacity="0.9"
        />
      </>
    ) : (
      <path
        d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    )}
  </svg>
);