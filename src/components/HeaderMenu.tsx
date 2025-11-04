import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { 
  Menu,
  X,
  Baby,
  ShoppingCart,
  Apple,
  Settings,
  LogOut,
  ChevronRight,
  Camera,
  FileText,
  Play,
  UserCheck,
  Pill,
  Stethoscope
} from 'lucide-react';

interface HeaderMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToFood?: () => void;
  onNavigateToBabyTracker?: () => void;
  onNavigateToMarketplace?: () => void;
  onNavigateToChildcare?: () => void;
  onNavigateToSettings?: () => void;
  onNavigateToPhotos?: () => void;
  onNavigateToArticlesVideos?: () => void;
  onNavigateToMedications?: () => void;
  onNavigateToProviderPortal?: () => void;
  onSignOut?: () => void;
  userName?: string;
}

export function HeaderMenu({ 
  isOpen, 
  onClose, 
  onNavigateToFood,
  onNavigateToBabyTracker,
  onNavigateToMarketplace,
  onNavigateToChildcare,
  onNavigateToSettings,
  onNavigateToPhotos,
  onNavigateToArticlesVideos,
  onNavigateToMedications,
  onNavigateToProviderPortal,
  onSignOut,
  userName = "Brenda" 
}: HeaderMenuProps) {
  // Check if user is a provider
  const userType = localStorage.getItem('userType');
  const isProvider = userType === 'provider';

  const menuItems = [
    {
      id: 'medications',
      title: 'Medications & Appointments',
      description: 'Track meds and clinic visits',
      icon: Pill,
      action: onNavigateToMedications,
      priority: true
    },
    {
      id: 'articles-videos',
      title: 'Articles & Videos',
      description: 'Pregnancy guides and tutorials',
      icon: FileText,
      action: onNavigateToArticlesVideos,
      priority: true
    },
    {
      id: 'food',
      title: 'Food & Nutrition',
      description: 'Healthy recipes and meal plans',
      icon: Apple,
      action: onNavigateToFood,
      priority: true
    },
    {
      id: 'photos',
      title: 'Photo Journal',
      description: 'Capture pregnancy memories',
      icon: Camera,
      action: onNavigateToPhotos
    },
    {
      id: 'baby-tracker',
      title: 'Baby Tracker',
      description: 'Post-birth care & immunizations',
      icon: Baby,
      action: onNavigateToBabyTracker
    },
    {
      id: 'marketplace',
      title: 'Toto\'s Marketplace',
      description: 'Community buying & support',
      icon: ShoppingCart,
      action: onNavigateToMarketplace
    },
    {
      id: 'childcare',
      title: 'Childcare Services',
      description: 'Nannies, nurses & daycare',
      icon: UserCheck,
      action: onNavigateToChildcare
    },
    ...(isProvider ? [{
      id: 'provider-portal',
      title: 'Provider Portal',
      description: 'Manage patients & appointments',
      icon: Stethoscope,
      action: onNavigateToProviderPortal,
      priority: true
    }] : [])
  ];

  const handleMenuItemClick = (action?: () => void) => {
    if (action) {
      action();
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />
          
          {/* Menu Panel */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 z-50 h-full w-80 bg-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="text-lg text-foreground">Menu</h2>
                <Button variant="ghost" size="sm" onClick={onClose} className="p-2">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* User Info */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-primary text-lg">{userName.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-foreground">Hello, {userName}!</p>
                    <p className="text-sm text-muted-foreground">
                      Welcome to your pregnancy journey
                    </p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-4 space-y-2">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="h-px flex-1 bg-border" />
                    <h3 className="text-xs text-muted-foreground uppercase tracking-wider">More Features</h3>
                    <div className="h-px flex-1 bg-border" />
                  </div>
                  
                  {menuItems.map((item) => (
                    <Card 
                      key={item.id} 
                      className="border-border hover:shadow-sm transition-all cursor-pointer hover:scale-[1.02]"
                      onClick={() => handleMenuItemClick(item.action)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                              <item.icon className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="text-foreground">{item.title}</p>
                              <p className="text-xs text-muted-foreground">{item.description}</p>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Additional Menu Items */}
                <div className="p-4 space-y-2">
                  <Card 
                    className="border-border hover:shadow-sm transition-all cursor-pointer"
                    onClick={() => handleMenuItemClick(onNavigateToSettings)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Settings className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-foreground">Settings</p>
                            <p className="text-xs text-muted-foreground">App preferences</p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-border">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => {
                    onClose();
                    if (onSignOut) {
                      onSignOut();
                    }
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}