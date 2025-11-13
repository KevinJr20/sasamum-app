import React from 'react';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';

interface TopBarProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  onBack?: () => void;
  right?: React.ReactNode;
  className?: string;
  sticky?: boolean;
}

export function TopBar({ title, subtitle, onBack, right, className = '', sticky = false }: TopBarProps) {
  const container = `page-header ${sticky ? 'sticky top-0 z-40' : ''} flex items-center justify-between p-4 bg-card/95 backdrop-blur-md border-b border-border shadow-sm ${className}`.trim();

  return (
    <div className={container}>
      <div className="flex items-center gap-4">
        {onBack ? (
          <Button variant="ghost" size="icon" onClick={onBack} className="p-2">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Button>
        ) : (
          <div className="w-10" />
        )}

        <div className="flex-1">
          {title && <h1 className="text-lg text-foreground">{title}</h1>}
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center">
        {right}
      </div>
    </div>
  );
}

export default TopBar;
