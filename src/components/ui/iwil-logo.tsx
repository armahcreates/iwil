import React from 'react';

interface IWILLogoProps {
  size?: number;
  className?: string;
}

export const IWILLogo: React.FC<IWILLogoProps> = ({ size = 40, className = "" }) => {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      {/* Use the actual IWIL logo image */}
      <img 
        src="https://i.imgur.com/9LXk5Qm.png" 
        alt="IWIL Logo" 
        className="w-full h-full object-contain"
        onError={(e) => {
          // Fallback to CSS-based logo if image fails to load
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const fallback = target.nextElementSibling as HTMLElement;
          if (fallback) fallback.style.display = 'block';
        }}
      />
      
      {/* Fallback CSS-based logo */}
      <div className="absolute inset-0 hidden">
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          className="w-full h-full"
        >
          {/* Outer circle with gradient border */}
          <defs>
            <linearGradient id="iwilGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(199, 89%, 48%)" />
              <stop offset="100%" stopColor="hsl(142, 69%, 58%)" />
            </linearGradient>
            <linearGradient id="petalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(195, 100%, 65%)" />
              <stop offset="50%" stopColor="hsl(199, 89%, 48%)" />
              <stop offset="100%" stopColor="hsl(142, 69%, 58%)" />
            </linearGradient>
          </defs>
          
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="48"
            fill="white"
            stroke="url(#iwilGradient)"
            strokeWidth="2"
          />
          
          {/* Lotus petals */}
          <path
            d="M30 70 Q20 50 30 30 Q40 40 50 50 Q60 40 70 30 Q80 50 70 70 Q60 60 50 50 Q40 60 30 70"
            fill="url(#petalGradient)"
            opacity="0.8"
          />
          
          {/* Center meditation figure */}
          <circle cx="50" cy="45" r="8" fill="white" />
          <path
            d="M46 41 Q50 35 54 41 L54 49 Q50 55 46 49 Z"
            fill="url(#iwilGradient)"
          />
          
          {/* Arms in meditation pose */}
          <path
            d="M42 47 Q38 45 42 43 M58 47 Q62 45 58 43"
            stroke="url(#iwilGradient)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
};
