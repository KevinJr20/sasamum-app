import React from 'react';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';

interface StickyHeaderProps {
  title: string;
  onBack?: () => void;
  actions?: React.ReactNode;
  showBackButton?: boolean;
}

export function StickyHeader({ 
  title, 
  onBack, 
  actions,
  showBackButton = true 
}: StickyHeaderProps) {
  return (
    <div className="sticky top-0 z-40 flex items-center justify-between p-4 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="flex items-center space-x-3">
        {showBackButton && onBack && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack} 
            className="p-2 hover:bg-accent"
          >
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </Button>
        )}
        <h1 className="text-lg text-foreground">{title}</h1>
      </div>
      
      {actions && (
        <div className="flex items-center space-x-2">
          {actions}
        </div>
      )}
    </div>
  );
}
