import React from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { 
  Home,
  Calendar,
  MessageCircle,
  User
} from 'lucide-react';

interface BottomNavigationProps {
  currentScreen: string;
  onNavigateToHome: () => void;
  onNavigateToCalendar: () => void;
  onNavigateToChat: () => void;
  onNavigateToProfile: () => void;
}

export function BottomNavigation({ 
  currentScreen, 
  onNavigateToHome, 
  onNavigateToCalendar, 
  onNavigateToChat, 
  onNavigateToProfile 
}: BottomNavigationProps) {
  const bottomNavItems = [
    { 
      id: 'dashboard', 
      icon: Home, 
      label: 'Home',
      isActive: currentScreen === 'dashboard',
      onClick: onNavigateToHome
    },
    { 
      id: 'calendar', 
      icon: Calendar, 
      label: 'Calendar',
      isActive: currentScreen === 'calendar',
      onClick: onNavigateToCalendar
    },
    { 
      id: 'chat', 
      icon: MessageCircle, 
      label: 'Chat',
      isActive: currentScreen === 'chat' || currentScreen === 'chat-screen',
      onClick: onNavigateToChat
    },
    { 
      id: 'profile', 
      icon: User, 
      label: 'Profile',
      isActive: currentScreen === 'profile',
      onClick: onNavigateToProfile
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="fixed bottom-0 left-0 right-0 w-full bg-card/95 backdrop-blur-md border-t border-border shadow-[0_-4px_12px_rgba(0,0,0,0.1)] z-50"
    >
      <div className="max-w-sm mx-auto px-4 py-3">
        <div className="flex justify-around items-center">
          {bottomNavItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              onClick={item.onClick}
              className={`flex flex-col items-center space-y-1 p-2 transition-all duration-200 rounded-xl ${
                item.isActive 
                  ? 'text-primary bg-primary/10 scale-110 shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground hover:scale-105 hover:bg-accent/50'
              }`}
            >
              <item.icon className={`w-6 h-6 ${item.isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className={`text-xs ${item.isActive ? 'font-medium' : ''}`}>{item.label}</span>
            </Button>
          ))}
        </div>
      </div>
      
      {/* Safe area spacer for mobile devices with notches */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </motion.div>
  );
}