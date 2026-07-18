import React from 'react';

export default function Logo({ className = "w-8 h-8" }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Outer shield container */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        className="w-full h-full text-gov-accent drop-shadow-[0_0_10px_rgba(34,197,94,0.3)]"
        style={{ transition: 'all 0.3s ease' }}
      >
        {/* Shield Border */}
        <path
          d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Government Building Pillars inside the Shield */}
        <path
          d="M8 17H16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M9 14V17"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M12 14V17"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M15 14V17"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M8 11.5H16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* AI Circuit styling node at the top triangle (dome) */}
        <path
          d="M12 6L7 10H17L12 6Z"
          fill="currentColor"
          fillOpacity="0.2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Glowing Central AI Dot */}
        <circle cx="12" cy="11.5" r="1.5" fill="#22C55E" className="animate-pulse" />
      </svg>
    </div>
  );
}
