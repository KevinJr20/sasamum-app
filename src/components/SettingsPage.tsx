import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { useTheme } from './ThemeProvider';
import { useLanguage, languages } from './LanguageProvider';
import { copyWithFeedback } from './utils/clipboard';
import { toast } from 'sonner@2.0.3';
import { 
  ArrowLeft,
  Settings,
  Bell,
  Globe,
  Shield,
  Heart,
  Info,
  Users,
  Download,
  Trash2,
  LogOut,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Smartphone,
  Wifi,
  Database,
  HelpCircle,
  Mail,
  Star,
  ExternalLink,
  ChevronRight,
  Check
} from 'lucide-react';

interface SettingsPageProps {
  onBack: () => void;
  userName?: string;
  onSignOut?: () => void;
}

export function SettingsPage({ onBack, userName = "Brenda", onSignOut }: SettingsPageProps) {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const [showLanguageDialog, setShowLanguageDialog] = useState(false);
  const [showThemeDialog, setShowThemeDialog] = useState(false);
  const [settings, setSettings] = useState({
    notifications: {
      push: true,
      email: true,
      sms: false,
      pregnancy: true,
      appointments: true,
      community: true,
      emergencies: true
    },
    privacy: {
      onlineStatus: true,
      profileVisible: true,
      analyticsSharing: false,
      locationSharing: true
    },
    app: {
      autoUpdate: true,
      offlineMode: true,
      soundEffects: true,
      hapticFeedback: true,
      dataCompression: true
    }
  });

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage as 'English' | 'Swahili' | 'Francais');
    setShowLanguageDialog(false);
    toast.success(`Language changed to ${newLanguage}`);
  };

  const appVersion = "2.1.0";
  const buildNumber = "241215";

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
  };

  const settingsSections = [
    {
      title: 'Notifications',
      icon: Bell,
      settings: [
        {
          key: 'push',
          label: 'Push Notifications',
          description: 'Get important updates and reminders',
          type: 'switch',
          value: settings.notifications.push
        },
        {
          key: 'pregnancy',
          label: 'Pregnancy Reminders',
          description: 'Weekly updates and appointment reminders',
          type: 'switch',
          value: settings.notifications.pregnancy
        },
        {
          key: 'community',
          label: 'Community Updates',
          description: 'Messages from Ubuntu sisterhood',
          type: 'switch',
          value: settings.notifications.community
        },
        {
          key: 'emergencies',
          label: 'Emergency Alerts',
          description: 'Critical health and safety notifications',
          type: 'switch',
          value: settings.notifications.emergencies,
          critical: true
        }
      ]
    },
    {
      title: 'Privacy & Security',
      icon: Shield,
      settings: [
        {
          key: 'onlineStatus',
          label: 'Show Online Status',
          description: 'Let other mothers see when you\'re active',
          type: 'switch',
          value: settings.privacy.onlineStatus
        },
        {
          key: 'analyticsSharing',
          label: 'Share Analytics',
          description: 'Help improve maternal health research',
          type: 'switch',
          value: settings.privacy.analyticsSharing
        },
        {
          key: 'locationSharing',
          label: 'Location Services',
          description: 'Find nearby hospitals and services',
          type: 'switch',
          value: settings.privacy.locationSharing
        }
      ]
    },
    {
      title: 'App Preferences',
      icon: Smartphone,
      settings: [
        {
          key: 'autoUpdate',
          label: 'Auto-Update Content',
          description: 'Download latest articles and videos',
          type: 'switch',
          value: settings.app.autoUpdate
        },
        {
          key: 'offlineMode',
          label: 'Offline Mode',
          description: 'Save content for offline access',
          type: 'switch',
          value: settings.app.offlineMode
        },
        {
          key: 'soundEffects',
          label: 'Sound Effects',
          description: 'Play sounds for interactions',
          type: 'switch',
          value: settings.app.soundEffects
        }
      ]
    }
  ];

  const supportSections = [
    {
      icon: HelpCircle,
      title: 'Help & Support',
      description: 'Get help and contact support',
      action: () => {
        window.open('mailto:support@sasamum.ke?subject=SasaMum Support Request', '_blank');
      }
    },
    {
      icon: Shield,
      title: 'Privacy Policy',
      description: 'View our privacy policy',
      action: () => {
        window.open('https://sasamum.ke/privacy', '_blank');
      }
    },
    {
      icon: Info,
      title: 'Terms of Service',
      description: 'Read our terms and conditions',
      action: () => {
        window.open('https://sasamum.ke/terms', '_blank');
      }
    },
    {
      icon: Heart,
      title: 'Rate SasaMum',
      description: 'Share your experience with other mothers',
      action: () => {
        // In a real app, this would open the app store
        alert('Thank you for your support! ❤️\n\nWe appreciate your feedback. This would typically open your device\'s app store.');
      }
    },
    {
      icon: Users,
      title: 'Invite Friends',
      description: 'Share SasaMum with other mothers',
      action: async () => {
        const shareText = 'Join me on NeoMama! 🤰❤️\n\nIt\'s an amazing app for Kenyan mothers with pregnancy tracking, community support, and so much more.\n\nhttps://neomama.ke';
        
        // Try native sharing first
        if (navigator.share) {
          try {
            await navigator.share({
              title: 'Join NeoMama',
              text: shareText,
              url: 'https://neomama.ke'
            });
            return; // Success - exit early
          } catch (err) {
            // User cancelled or sharing failed, fall through to clipboard
          }
        }
        
        // Fallback to clipboard with our safe method
        await copyWithFeedback(
          shareText,
          'Invite link copied! Share it with your friends ❤️',
          'Share NeoMama'
        );
      }
    },
    {
      icon: Mail,
      title: 'Feedback',
      description: 'Send suggestions and feedback',
      action: () => {
        window.open('mailto:feedback@sasamum.ke?subject=SasaMum Feedback&body=Hi SasaMum Team,%0D%0A%0D%0AI would like to share the following feedback:%0D%0A%0D%0A', '_blank');
      }
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-background w-full pb-20"
    >
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 flex items-center justify-between p-4 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
        <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </Button>
        <h1 className="text-lg text-foreground">Settings</h1>
        <div className="w-10" />
      </div>

      <div className="pb-20">
        {/* Theme Selection */}
        <div className="p-4 border-b border-border">
          <Card 
            className="border-border cursor-pointer hover:shadow-sm transition-shadow"
            onClick={() => setShowThemeDialog(true)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {theme === 'light' ? (
                    <Sun className="w-5 h-5 text-primary" />
                  ) : theme === 'dark' ? (
                    <Moon className="w-5 h-5 text-primary" />
                  ) : (
                    <Smartphone className="w-5 h-5 text-primary" />
                  )}
                  <div>
                    <p className="text-foreground">Theme</p>
                    <p className="text-xs text-muted-foreground">
                      Choose your preferred appearance
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">
                    {theme === 'light' ? 'Light' : theme === 'dark' ? 'Dark' : 'System'}
                  </Badge>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Language Selection */}
        <div className="p-4 border-b border-border">
          <Card 
            className="border-border cursor-pointer hover:shadow-sm transition-shadow"
            onClick={() => setShowLanguageDialog(true)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Globe className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-foreground">Language</p>
                    <p className="text-xs text-muted-foreground">
                      Choose your preferred language
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{language}</Badge>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Settings Sections */}
        {settingsSections.map((section, sectionIndex) => (
          <div key={section.title} className="p-4 border-b border-border">
            <div className="mb-3">
              <h3 className="text-foreground flex items-center space-x-2">
                <section.icon className="w-5 h-5 text-primary" />
                <span>{section.title}</span>
              </h3>
            </div>
            
            <div className="space-y-3">
              {section.settings.map((setting) => (
                <Card key={setting.key} className="border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <p className="text-foreground">{setting.label}</p>
                          {setting.critical && (
                            <Badge className="text-xs bg-red-100 text-red-800">
                              Important
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {setting.description}
                        </p>
                      </div>
                      <Switch
                        checked={setting.value}
                        onCheckedChange={(checked) => {
                          const category = sectionIndex === 0 ? 'notifications' : 
                                         sectionIndex === 1 ? 'privacy' : 'app';
                          updateSetting(category, setting.key, checked);
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}

        {/* Data Management */}
        <div className="p-4 border-b border-border">
          <div className="mb-3">
            <h3 className="text-foreground flex items-center space-x-2">
              <Database className="w-5 h-5 text-primary" />
              <span>Data Management</span>
            </h3>
          </div>
          
          <div className="space-y-3">
            <Card className="border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-foreground">Storage Used</p>
                    <p className="text-xs text-muted-foreground">App data and cached content</p>
                  </div>
                  <Badge variant="outline">24.5 MB</Badge>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="border-border cursor-pointer hover:shadow-sm transition-shadow hover:border-primary/50"
              onClick={() => {
                // Export all user data
                const userData = {
                  user: userName,
                  exportDate: new Date().toISOString(),
                  pregnancyData: {
                    dueDate: localStorage.getItem('dueDate') || 'Not set',
                    currentWeek: 'Week data would go here',
                  },
                  settings: settings,
                  note: 'This is a sample export. In production, this would include all user data.'
                };
                
                const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `sasamum-data-${new Date().toISOString().split('T')[0]}.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Download className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-foreground">Export My Data</p>
                      <p className="text-xs text-muted-foreground">Download your pregnancy journey</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card 
              className="border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20 cursor-pointer hover:shadow-sm transition-shadow"
              onClick={() => {
                if (window.confirm('⚠️ WARNING!\n\nThis will permanently delete ALL your SasaMum data including:\n• Pregnancy tracking data\n• Photos and journal entries\n• Health records\n• Community posts\n• All saved content\n\nThis action CANNOT be undone!\n\nAre you absolutely sure?')) {
                  if (window.confirm('Final confirmation: Delete all data?')) {
                    localStorage.clear();
                    alert('All data has been cleared. The app will now reload.');
                    window.location.reload();
                  }
                }
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Trash2 className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="text-red-800 dark:text-red-400">Clear All Data</p>
                      <p className="text-xs text-red-700 dark:text-red-500">This action cannot be undone</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Support & Help */}
        <div className="p-4 border-b border-border">
          <div className="mb-3">
            <h3 className="text-foreground">Support & Help</h3>
          </div>
          
          <div className="space-y-3">
            {supportSections.map((item, index) => (
              <Card 
                key={index} 
                className="border-border cursor-pointer hover:shadow-sm transition-shadow hover:border-primary/50"
                onClick={item.action}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-foreground">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* About */}
        <div className="p-4 border-b border-border">
          <div className="mb-3">
            <h3 className="text-foreground">About SasaMum</h3>
          </div>
          
          <div className="space-y-3">
            <Card className="border-border">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Version</span>
                    <span className="text-foreground">{appVersion}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Build</span>
                    <span className="text-foreground">{buildNumber}</span>
                  </div>
                  <div className="pt-2 border-t border-border">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      SasaMum is built with love for African mothers, celebrating Ubuntu philosophy 
                      and supporting your beautiful journey to motherhood.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-3">
              <Card 
                className="border-border cursor-pointer hover:shadow-sm transition-shadow hover:border-primary/50"
                onClick={() => window.open('https://sasamum.ke/privacy', '_blank')}
              >
                <CardContent className="p-4 text-center">
                  <ExternalLink className="w-5 h-5 text-primary mx-auto mb-2" />
                  <p className="text-sm text-foreground">Privacy Policy</p>
                </CardContent>
              </Card>
              
              <Card 
                className="border-border cursor-pointer hover:shadow-sm transition-shadow hover:border-primary/50"
                onClick={() => window.open('https://sasamum.ke/terms', '_blank')}
              >
                <CardContent className="p-4 text-center">
                  <ExternalLink className="w-5 h-5 text-primary mx-auto mb-2" />
                  <p className="text-sm text-foreground">Terms of Service</p>
                </CardContent>
              </Card>
            </div>

            <Card 
              className="border-border cursor-pointer hover:shadow-sm transition-shadow hover:border-primary/50"
              onClick={() => window.open('https://sasamum.ke', '_blank')}
            >
              <CardContent className="p-4 text-center">
                <ExternalLink className="w-5 h-5 text-primary mx-auto mb-2" />
                <p className="text-sm text-foreground">Visit Our Website</p>
                <p className="text-xs text-muted-foreground mt-1">sasamum.ke</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sign Out */}
        <div className="p-4">
          <Card 
            className="border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20 cursor-pointer hover:shadow-sm transition-shadow"
            onClick={() => {
              if (window.confirm('Are you sure you want to sign out?')) {
                localStorage.clear();
                if (onSignOut) {
                  onSignOut();
                }
              }
            }}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-center space-x-3">
                <LogOut className="w-5 h-5 text-red-600" />
                <span className="text-red-800 dark:text-red-400">Sign Out</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Language Selection Dialog */}
      <Dialog open={showLanguageDialog} onOpenChange={setShowLanguageDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Select Language</DialogTitle>
            <DialogDescription>
              Choose your preferred language for the app
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-2">
            {languages.map((lang) => (
              <Card
                key={lang.code}
                className={`cursor-pointer transition-all hover:shadow-sm ${
                  language === lang.name
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => handleLanguageChange(lang.name)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-foreground font-medium">{lang.name}</p>
                      <p className="text-sm text-muted-foreground">{lang.nativeName}</p>
                    </div>
                    {language === lang.name && (
                      <Check className="w-5 h-5 text-primary" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Theme Selection Dialog */}
      <Dialog open={showThemeDialog} onOpenChange={setShowThemeDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Select Theme</DialogTitle>
            <DialogDescription>
              Choose how SasaMum looks to you
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-2">
            <Card
              className={`cursor-pointer transition-all hover:shadow-sm ${
                theme === 'light'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => {
                setTheme('light');
                setShowThemeDialog(false);
                toast.success('Theme changed to Light mode');
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Sun className="w-5 h-5 text-amber-500" />
                    <div>
                      <p className="text-foreground font-medium">Light</p>
                      <p className="text-sm text-muted-foreground">Bright and clear</p>
                    </div>
                  </div>
                  {theme === 'light' && (
                    <Check className="w-5 h-5 text-primary" />
                  )}
                </div>
              </CardContent>
            </Card>

            <Card
              className={`cursor-pointer transition-all hover:shadow-sm ${
                theme === 'dark'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => {
                setTheme('dark');
                setShowThemeDialog(false);
                toast.success('Theme changed to Dark mode');
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Moon className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-foreground font-medium">Dark</p>
                      <p className="text-sm text-muted-foreground">Easy on the eyes</p>
                    </div>
                  </div>
                  {theme === 'dark' && (
                    <Check className="w-5 h-5 text-primary" />
                  )}
                </div>
              </CardContent>
            </Card>

            <Card
              className={`cursor-pointer transition-all hover:shadow-sm ${
                theme === 'system'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => {
                setTheme('system');
                setShowThemeDialog(false);
                toast.success('Theme set to follow system preference');
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Smartphone className="w-5 h-5 text-purple-500" />
                    <div>
                      <p className="text-foreground font-medium">System</p>
                      <p className="text-sm text-muted-foreground">Follow device settings</p>
                    </div>
                  </div>
                  {theme === 'system' && (
                    <Check className="w-5 h-5 text-primary" />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
