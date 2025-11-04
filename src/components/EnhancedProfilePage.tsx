import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useScrollToTop } from './utils/useScrollToTop';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Progress } from './ui/progress';
import { useTheme } from './ThemeProvider';
import { useLanguage, languages } from './LanguageProvider';
import { 
  ArrowLeft,
  Camera,
  Edit,
  Save,
  X,
  Eye,
  EyeOff,
  Calendar,
  Weight,
  Baby,
  Heart,
  Activity,
  Users,
  Settings,
  Shield,
  Moon,
  Sun,
  Globe,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';

interface EnhancedProfilePageProps {
  onBack: () => void;
  userName?: string;
}

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  profilePicture?: string;
  dueDate: string;
  currentWeek: number;
  currentWeight: number;
  prePregnancyWeight: number;
  height: number;
  bloodType: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  privacy: {
    profileVisible: boolean;
    showWeight: boolean;
    showDueDate: boolean;
    showLocation: boolean;
    onlineStatus: boolean;
  };
  preferences: {
    notifications: boolean;
    darkMode: boolean;
  };
  bio: string;
}

export function EnhancedProfilePage({ onBack, userName = "Brenda" }: EnhancedProfilePageProps) {
  useScrollToTop();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState<'profile' | 'privacy' | 'health' | 'settings'>('profile');
  
  const [profile, setProfile] = useState<UserProfile>({
    name: "Brenda Wanjiku",
    email: "brenda.wanjiku@example.com",
    phone: "+254 712 345 678",
    location: "Nairobi, Kenya",
    profilePicture: "/api/placeholder/120/120",
    dueDate: "2024-12-15",
    currentWeek: 16,
    currentWeight: 68,
    prePregnancyWeight: 62,
    height: 165,
    bloodType: "A+",
    emergencyContact: {
      name: "Samuel Wanjiku",
      phone: "+254 722 123 456",
      relationship: "Husband"
    },
    privacy: {
      profileVisible: true,
      showWeight: false,
      showDueDate: true,
      showLocation: true,
      onlineStatus: true
    },
    preferences: {
      notifications: true,
      darkMode: theme === 'dark'
    },
    bio: "First-time mama excited about this beautiful journey! 💕"
  });

  const calculateDaysLeft = () => {
    const due = new Date(profile.dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateBMI = () => {
    const heightInM = profile.height / 100;
    return (profile.currentWeight / (heightInM * heightInM)).toFixed(1);
  };

  const getWeightGainRecommendation = () => {
    const bmi = parseFloat(calculateBMI());
    if (bmi < 18.5) return "12.5-18 kg";
    if (bmi < 25) return "11.5-16 kg";
    if (bmi < 30) return "7-11.5 kg";
    return "5-9 kg";
  };

  const updateProfile = (field: string, value: any) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updatePrivacy = (field: string, value: boolean) => {
    setProfile(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [field]: value
      }
    }));
  };

  const sections = [
    { id: 'profile', label: 'Profile', icon: Users },
    { id: 'health', label: 'Health Data', icon: Heart },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'settings', label: 'Settings', icon: Settings }
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
        <h1 className="text-lg text-foreground">My Profile</h1>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsEditing(!isEditing)}
          className="p-2"
        >
          {isEditing ? <Save className="w-6 h-6 text-primary" /> : <Edit className="w-6 h-6 text-foreground" />}
        </Button>
      </div>

      {/* Section Tabs */}
      <div className="bg-card border-b border-border">
        <div className="flex overflow-x-auto">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id as any)}
              className={`flex items-center space-x-2 px-4 py-3 text-sm whitespace-nowrap transition-colors ${
                activeSection === section.id
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <section.icon className="w-4 h-4" />
              <span>{section.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="pb-20">
        {/* Profile Section */}
        {activeSection === 'profile' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 space-y-6"
          >
            {/* Profile Picture & Basic Info */}
            <Card className="border-border">
              <CardContent className="p-6 text-center space-y-4">
                <div className="relative inline-block">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={profile.profilePicture} />
                    <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                      {profile.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button 
                      size="sm" 
                      className="absolute -bottom-2 -right-2 w-8 h-8 p-0 rounded-full bg-primary hover:bg-primary/90"
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  )}
                  {profile.privacy.onlineStatus && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 border-2 border-card rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full" />
                    </div>
                  )}
                </div>
                
                {isEditing ? (
                  <div className="space-y-3">
                    <Input
                      value={profile.name}
                      onChange={(e) => updateProfile('name', e.target.value)}
                      className="text-center bg-background"
                    />
                    <Textarea
                      placeholder="Tell other mothers about yourself..."
                      value={profile.bio}
                      onChange={(e) => updateProfile('bio', e.target.value)}
                      className="bg-background text-center"
                      rows={2}
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <h2 className="text-foreground">{profile.name}</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {profile.bio}
                    </p>
                  </div>
                )}
                
                <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                  {profile.privacy.showLocation && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Week {profile.currentWeek}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="border-border">
              <CardHeader className="pb-3">
                <h4 className="text-foreground">Contact Information</h4>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm text-muted-foreground">Email</Label>
                  {isEditing ? (
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => updateProfile('email', e.target.value)}
                        className="pl-10 bg-background"
                      />
                    </div>
                  ) : (
                    <p className="text-foreground">{profile.email}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm text-muted-foreground">Phone</Label>
                  {isEditing ? (
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        value={profile.phone}
                        onChange={(e) => updateProfile('phone', e.target.value)}
                        className="pl-10 bg-background"
                      />
                    </div>
                  ) : (
                    <p className="text-foreground">{profile.phone}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-sm text-muted-foreground">Location</Label>
                  {isEditing ? (
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="location"
                        value={profile.location}
                        onChange={(e) => updateProfile('location', e.target.value)}
                        className="pl-10 bg-background"
                      />
                    </div>
                  ) : (
                    <p className="text-foreground">{profile.location}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Health Data Section */}
        {activeSection === 'health' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 space-y-6"
          >
            {/* Pregnancy Overview */}
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader className="pb-3">
                <h4 className="text-foreground flex items-center space-x-2">
                  <Baby className="w-5 h-5 text-primary" />
                  <span>Pregnancy Overview</span>
                </h4>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Current Week</p>
                    <p className="text-lg text-primary">{profile.currentWeek}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Days Left</p>
                    <p className="text-lg text-primary">{calculateDaysLeft()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Trimester</p>
                    <p className="text-lg text-primary">
                      {profile.currentWeek <= 12 ? '1st' : profile.currentWeek <= 27 ? '2nd' : '3rd'}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Pregnancy Progress</span>
                    <span className="text-foreground">{Math.round((profile.currentWeek / 40) * 100)}%</span>
                  </div>
                  <Progress value={(profile.currentWeek / 40) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Weight Tracking */}
            <Card className="border-border">
              <CardHeader className="pb-3">
                <h4 className="text-foreground flex items-center space-x-2">
                  <Weight className="w-5 h-5 text-primary" />
                  <span>Weight & Health</span>
                </h4>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Current Weight</Label>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={profile.currentWeight}
                        onChange={(e) => updateProfile('currentWeight', parseFloat(e.target.value))}
                        className="bg-background"
                      />
                    ) : (
                      <p className="text-foreground">{profile.currentWeight} kg</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Height</Label>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={profile.height}
                        onChange={(e) => updateProfile('height', parseFloat(e.target.value))}
                        className="bg-background"
                      />
                    ) : (
                      <p className="text-foreground">{profile.height} cm</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Weight Gain</Label>
                    <p className="text-foreground">
                      +{(profile.currentWeight - profile.prePregnancyWeight).toFixed(1)} kg
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">BMI</Label>
                    <p className="text-foreground">{calculateBMI()}</p>
                  </div>
                </div>
                
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    Recommended total weight gain: {getWeightGainRecommendation()}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card className="border-border">
              <CardHeader className="pb-3">
                <h4 className="text-foreground">Emergency Contact</h4>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Name</Label>
                    {isEditing ? (
                      <Input
                        value={profile.emergencyContact.name}
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          emergencyContact: { ...prev.emergencyContact, name: e.target.value }
                        }))}
                        className="bg-background"
                      />
                    ) : (
                      <p className="text-foreground">{profile.emergencyContact.name}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Relationship</Label>
                    {isEditing ? (
                      <Input
                        value={profile.emergencyContact.relationship}
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          emergencyContact: { ...prev.emergencyContact, relationship: e.target.value }
                        }))}
                        className="bg-background"
                      />
                    ) : (
                      <p className="text-foreground">{profile.emergencyContact.relationship}</p>
                    )}
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Phone</Label>
                  {isEditing ? (
                    <Input
                      value={profile.emergencyContact.phone}
                      onChange={(e) => setProfile(prev => ({
                        ...prev,
                        emergencyContact: { ...prev.emergencyContact, phone: e.target.value }
                      }))}
                      className="bg-background"
                    />
                  ) : (
                    <p className="text-foreground">{profile.emergencyContact.phone}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Privacy Section */}
        {activeSection === 'privacy' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 space-y-6"
          >
            <Card className="border-border">
              <CardHeader className="pb-3">
                <h4 className="text-foreground flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <span>Privacy Settings</span>
                </h4>
                <p className="text-sm text-muted-foreground">
                  Control what information is visible to other mothers in the Ubuntu community
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-foreground">Profile Visibility</p>
                    <p className="text-xs text-muted-foreground">Allow other mothers to find your profile</p>
                  </div>
                  <Switch
                    checked={profile.privacy.profileVisible}
                    onCheckedChange={(checked) => updatePrivacy('profileVisible', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-foreground">Show Weight Information</p>
                    <p className="text-xs text-muted-foreground">Display weight and BMI to community</p>
                  </div>
                  <Switch
                    checked={profile.privacy.showWeight}
                    onCheckedChange={(checked) => updatePrivacy('showWeight', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-foreground">Show Due Date</p>
                    <p className="text-xs text-muted-foreground">Let others know your pregnancy timeline</p>
                  </div>
                  <Switch
                    checked={profile.privacy.showDueDate}
                    onCheckedChange={(checked) => updatePrivacy('showDueDate', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-foreground">Show Location</p>
                    <p className="text-xs text-muted-foreground">Display your city/region</p>
                  </div>
                  <Switch
                    checked={profile.privacy.showLocation}
                    onCheckedChange={(checked) => updatePrivacy('showLocation', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-foreground">Online Status</p>
                    <p className="text-xs text-muted-foreground">Show when you're active in the app</p>
                  </div>
                  <Switch
                    checked={profile.privacy.onlineStatus}
                    onCheckedChange={(checked) => updatePrivacy('onlineStatus', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="text-blue-800 text-sm">Data Protection</h4>
                    <p className="text-blue-700 text-xs mt-1 leading-relaxed">
                      Your data is encrypted and secure. You can change these settings anytime. 
                      We never share personal information without your consent.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Settings Section */}
        {activeSection === 'settings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 space-y-6"
          >
            <Card className="border-border">
              <CardHeader className="pb-3">
                <h4 className="text-foreground">App Preferences</h4>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {theme === 'light' ? (
                      <Sun className="w-5 h-5 text-primary" />
                    ) : (
                      <Moon className="w-5 h-5 text-primary" />
                    )}
                    <div>
                      <p className="text-foreground">Dark Mode</p>
                      <p className="text-xs text-muted-foreground">Switch between light and dark themes</p>
                    </div>
                  </div>
                  <Switch
                    checked={theme === 'dark'}
                    onCheckedChange={toggleTheme}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Activity className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-foreground">Push Notifications</p>
                      <p className="text-xs text-muted-foreground">Reminders and updates</p>
                    </div>
                  </div>
                  <Switch
                    checked={profile.preferences.notifications}
                    onCheckedChange={(checked) => setProfile(prev => ({
                      ...prev,
                      preferences: { ...prev.preferences, notifications: checked }
                    }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Language</Label>
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <select 
                      value={language}
                      onChange={(e) => setLanguage(e.target.value as 'English' | 'Swahili' | 'Francais')}
                      className="flex-1 p-2 bg-background border border-border rounded-md text-foreground"
                    >
                      {languages.map((lang) => (
                        <option key={lang.code} value={lang.name}>
                          {lang.nativeName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}