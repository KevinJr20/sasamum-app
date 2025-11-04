import React from 'react';
import logoImage from 'figma:asset/eb89c871dac272c601731f1bd9cfc258fcf9aa3a.png';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export function NeoMamaLogo({ className = '', size = 'md', showText = true }: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const textSizes = {
    sm: '1rem',
    md: '1.25rem',
    lg: '1.5rem',
    xl: '2rem'
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className={`${sizeClasses[size]} relative flex items-center justify-center`}>
        <img 
          src={logoImage} 
          alt="NeoMama Logo" 
          className="w-full h-full object-contain"
        />
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <span className="leading-none" style={{ 
            fontSize: textSizes[size],
            fontWeight: '600',
            color: '#7c3aed',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            NeoMama
          </span>
          {(size === 'lg' || size === 'xl') && (
            <span className="text-sm text-muted-foreground leading-none mt-1">
              Your pregnancy journey
            </span>
          )}
        </div>
      )}
    </div>
  );
}
