import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export function SasaMumLogo({ className = '', size = 'md', showText = true }: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className={`${sizeClasses[size]} relative flex items-center justify-center`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer heart shape */}
          <path
            d="M50 85C50 85 15 60 15 35C15 25 22.5 17.5 32.5 17.5C40 17.5 45 22.5 50 30C55 22.5 60 17.5 67.5 17.5C77.5 17.5 85 25 85 35C85 60 50 85 50 85Z"
            fill="url(#heartGradient)"
            stroke="#e06b75"
            strokeWidth="2"
          />
          
          {/* Baby silhouette */}
          <circle cx="50" cy="45" r="8" fill="#ffffff" opacity="0.9" />
          <ellipse cx="50" cy="60" rx="6" ry="12" fill="#ffffff" opacity="0.9" />
          
          {/* Decorative sparkles */}
          <circle cx="35" cy="30" r="1.5" fill="#f4a5b9" />
          <circle cx="65" cy="35" r="1" fill="#f4a5b9" />
          <circle cx="70" cy="55" r="1.5" fill="#f4a5b9" />
          <circle cx="30" cy="55" r="1" fill="#f4a5b9" />
          
          <defs>
            <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e06b75" />
              <stop offset="50%" stopColor="#f4a5b9" />
              <stop offset="100%" stopColor="#e06b75" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      <div className="flex flex-col">
        <span className="leading-none" style={{ 
          fontSize: size === 'xl' ? '2rem' : size === 'lg' ? '1.5rem' : size === 'md' ? '1.25rem' : '1rem',
          fontWeight: '600',
          color: '#e06b75',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          SasaMum
        </span>
        {showText && (size === 'lg' || size === 'xl') && (
          <span className="text-sm text-muted-foreground leading-none mt-1">
            Your pregnancy journey
          </span>
        )}
      </div>
    </div>
  );
}
