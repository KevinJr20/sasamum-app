import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useScrollToTop } from './utils/useScrollToTop';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Progress } from './ui/progress';
import { toast } from 'sonner@2.0.3';
import { useTheme } from './ThemeProvider';
import { useLanguage } from './LanguageProvider';
import {
  ArrowLeft,
  Camera,
  Edit,
  Save,
  MapPin,
  Phone,
  Mail,
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
  AlertCircle,
  CheckCircle2,
  User,
  Sparkles,
  TrendingUp,
  Zap
} from 'lucide-react';

interface SuperEnhancedProfilePageProps {
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

export function SuperEnhancedProfilePage({ onBack, userName = "Akinyi" }: SuperEnhancedProfilePageProps) {
  useScrollToTop();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState<'profile' | 'privacy' | 'health' | 'settings'>('profile');

  const [profile, setProfile] = useState<UserProfile>({
    name: "Akinyi Atieno",
    email: "akinyi.atieno@sasamum.ke",
    phone: "+254 712 345 678",
    location: "Nairobi, Kenya",
    profilePicture: undefined,
    dueDate: "2026-02-15",
    currentWeek: 16,
    currentWeight: 68,
    prePregnancyWeight: 62,
    height: 165,
    bloodType: "A+",
    emergencyContact: {
      name: "James Odhiambo",
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

  const updateProfile = (field: string, value: any) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateEmergencyContact = (field: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact,
        [field]: value
      }
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

  const calculateDaysLeft = () => {
    const due = new Date(profile.dueDate);
    const now = new Date('2025-10-16');
    const diffTime = due.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };

  const calculateBMI = () => {
    const heightInM = profile.height / 100;
    return (profile.currentWeight / (heightInM * heightInM)).toFixed(1);
  };

  const getWeightGainProgress = () => {
    const gained = profile.currentWeight - profile.prePregnancyWeight;
    return Math.round((gained / 15) * 100); // Assuming 15kg target
  };

  const getPregnancyProgress = () => {
    return Math.round((profile.currentWeek / 40) * 100);
  };

  const handleSaveChanges = () => {
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  const sections = [
    { id: 'profile', label: 'Profile', icon: Users },
    { id: 'health', label: 'Health', icon: Heart },
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
      <div className="sticky top-0 z-40 flex items-center justify-between p-4 bg-gradient-to-r from-pink-500/10 to-purple-500/10 backdrop-blur-md border-b border-border shadow-sm">
        <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </Button>
        <h1 className="text-lg text-foreground">My Profile</h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => (isEditing ? handleSaveChanges() : setIsEditing(true))}
          className="p-2"
        >
          {isEditing ? <Save className="w-6 h-6 text-primary" /> : <Edit className="w-6 h-6 text-foreground" />}
        </Button>
      </div>

      {/* Section Tabs */}
      <div className="bg-card border-b border-border sticky top-[72px] z-30">
        <div className="flex overflow-x-auto">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id as any)}
              className={`flex items-center space-x-2 px-4 py-3 text-sm whitespace-nowrap transition-all ${
                activeSection === section.id
                  ? 'text-primary border-b-2 border-primary bg-primary/5'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
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
            {/* Hero Card with Profile Picture */}
            <Card className="border-none bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 dark:from-pink-950/40 dark:via-purple-950/40 dark:to-blue-950/40 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/20 dark:bg-black/20 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/20 dark:bg-black/20 rounded-full translate-y-1/2 -translate-x-1/2" />
              
              <CardContent className="p-6 text-center space-y-4 relative z-10">
                <div className="relative inline-block">
                  <Avatar className="w-32 h-32 border-4 border-white dark:border-gray-800 shadow-xl">
                    <AvatarImage src={profile.profilePicture} />
                    <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-500 text-white text-3xl">
                      {profile.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button
                      size="sm"
                      className="absolute -bottom-2 -right-2 w-10 h-10 p-0 rounded-full bg-primary hover:bg-primary/90 shadow-lg"
                    >
                      <Camera className="w-5 h-5" />
                    </Button>
                  )}
                  {profile.privacy.onlineStatus && !isEditing && (
                    <div className="absolute -top-1 -right-1 w-8 h-8 bg-green-500 border-4 border-white dark:border-gray-800 rounded-full animate-pulse" />
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-3">
                    <Input
                      value={profile.name}
                      onChange={(e) => updateProfile('name', e.target.value)}
                      className="text-center bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-white/20"
                    />
                    <Textarea
                      placeholder="Tell other mothers about yourself..."
                      value={profile.bio}
                      onChange={(e) => updateProfile('bio', e.target.value)}
                      className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm text-center border-white/20"
                      rows={2}
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <h2 className="text-2xl text-foreground">{profile.name}</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
                      {profile.bio}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-center space-x-4 text-sm pt-2">
                  {profile.privacy.showLocation && (
                    <div className="flex items-center space-x-1 bg-white/30 dark:bg-black/30 px-3 py-1 rounded-full">
                      <MapPin className="w-4 h-4" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1 bg-primary/20 px-3 py-1 rounded-full">
                    <Calendar className="w-4 h-4" />
                    <span>Week {profile.currentWeek}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pregnancy Progress */}
            <Card className="border-primary/20">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Baby className="w-5 h-5 text-primary" />
                    <h4 className="text-foreground">Pregnancy Progress</h4>
                  </div>
                  <Badge variant="secondary" className="bg-primary/20 text-primary">
                    {getPregnancyProgress()}%
                  </Badge>
                </div>
                <Progress value={getPregnancyProgress()} className="h-3" />
                <div className="grid grid-cols-3 gap-4 pt-2">
                  <div className="text-center">
                    <p className="text-2xl text-primary">{profile.currentWeek}</p>
                    <p className="text-xs text-muted-foreground">Weeks</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl text-primary">{calculateDaysLeft()}</p>
                    <p className="text-xs text-muted-foreground">Days to go</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl text-primary">{40 - profile.currentWeek}</p>
                    <p className="text-xs text-muted-foreground">Weeks left</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm text-muted-foreground flex items-center gap-2">
                    <Mail className="w-4 h-4" /> Email
                  </Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => updateProfile('email', e.target.value)}
                      className="bg-background"
                    />
                  ) : (
                    <p className="text-foreground pl-6">{profile.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm text-muted-foreground flex items-center gap-2">
                    <Phone className="w-4 h-4" /> Phone
                  </Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => updateProfile('phone', e.target.value)}
                      className="bg-background"
                    />
                  ) : (
                    <p className="text-foreground pl-6">{profile.phone}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="text-sm text-muted-foreground flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Location
                  </Label>
                  {isEditing ? (
                    <Input
                      id="location"
                      value={profile.location}
                      onChange={(e) => updateProfile('location', e.target.value)}
                      className="bg-background"
                    />
                  ) : (
                    <p className="text-foreground pl-6">{profile.location}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card className="border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  Emergency Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Name</Label>
                  {isEditing ? (
                    <Input
                      value={profile.emergencyContact.name}
                      onChange={(e) => updateEmergencyContact('name', e.target.value)}
                      className="bg-background"
                    />
                  ) : (
                    <p className="text-foreground">{profile.emergencyContact.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Phone</Label>
                  {isEditing ? (
                    <Input
                      type="tel"
                      value={profile.emergencyContact.phone}
                      onChange={(e) => updateEmergencyContact('phone', e.target.value)}
                      className="bg-background"
                    />
                  ) : (
                    <p className="text-foreground">{profile.emergencyContact.phone}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Relationship</Label>
                  {isEditing ? (
                    <Input
                      value={profile.emergencyContact.relationship}
                      onChange={(e) => updateEmergencyContact('relationship', e.target.value)}
                      className="bg-background"
                    />
                  ) : (
                    <p className="text-foreground">{profile.emergencyContact.relationship}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Health Section */}
        {activeSection === 'health' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 space-y-6"
          >
            {/* Health Stats */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    Health Stats
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    {isEditing ? 'Done' : 'Edit'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950/20 dark:to-pink-900/20 rounded-xl">
                    <div className="flex items-center space-x-2 mb-2">
                      <Weight className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                      <span className="text-xs text-muted-foreground">Current Weight</span>
                    </div>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={profile.currentWeight}
                        onChange={(e) => updateProfile('currentWeight', parseFloat(e.target.value))}
                        className="text-lg h-auto p-1 text-foreground bg-white/50 dark:bg-gray-900/50"
                      />
                    ) : (
                      <p className="text-2xl text-foreground">{profile.currentWeight}kg</p>
                    )}
                  </div>

                  <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 rounded-xl">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <span className="text-xs text-muted-foreground">Weight Gain</span>
                    </div>
                    <p className="text-2xl text-foreground">+{profile.currentWeight - profile.prePregnancyWeight}kg</p>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 rounded-xl">
                    <div className="flex items-center space-x-2 mb-2">
                      <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-xs text-muted-foreground">BMI</span>
                    </div>
                    <p className="text-2xl text-foreground">{calculateBMI()}</p>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20 rounded-xl">
                    <div className="flex items-center space-x-2 mb-2">
                      <Heart className="w-4 h-4 text-red-600 dark:text-red-400" />
                      <span className="text-xs text-muted-foreground">Blood Type</span>
                    </div>
                    {isEditing ? (
                      <Input
                        type="text"
                        value={profile.bloodType}
                        onChange={(e) => updateProfile('bloodType', e.target.value)}
                        className="text-lg h-auto p-1 text-foreground bg-white/50 dark:bg-gray-900/50"
                      />
                    ) : (
                      <p className="text-2xl text-foreground">{profile.bloodType}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Vitals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-primary" />
                  Vital Signs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Blood Pressure (Systolic)</Label>
                    {isEditing ? (
                      <Input
                        type="number"
                        defaultValue="120"
                        className="bg-background"
                        placeholder="120"
                      />
                    ) : (
                      <p className="text-lg text-foreground">120 mmHg</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Blood Pressure (Diastolic)</Label>
                    {isEditing ? (
                      <Input
                        type="number"
                        defaultValue="80"
                        className="bg-background"
                        placeholder="80"
                      />
                    ) : (
                      <p className="text-lg text-foreground">80 mmHg</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Heart Rate</Label>
                    {isEditing ? (
                      <Input
                        type="number"
                        defaultValue="75"
                        className="bg-background"
                        placeholder="75"
                      />
                    ) : (
                      <p className="text-lg text-foreground">75 bpm</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Glucose Level</Label>
                    {isEditing ? (
                      <Input
                        type="number"
                        defaultValue="95"
                        className="bg-background"
                        placeholder="95"
                      />
                    ) : (
                      <p className="text-lg text-foreground">95 mg/dL</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pregnancy-Specific Health Data */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Baby className="w-5 h-5 text-primary" />
                  Pregnancy Health
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Pre-Pregnancy Weight</Label>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={profile.prePregnancyWeight}
                      onChange={(e) => updateProfile('prePregnancyWeight', parseFloat(e.target.value))}
                      className="bg-background"
                    />
                  ) : (
                    <p className="text-lg text-foreground">{profile.prePregnancyWeight} kg</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Height</Label>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={profile.height}
                      onChange={(e) => updateProfile('height', parseFloat(e.target.value))}
                      className="bg-background"
                    />
                  ) : (
                    <p className="text-lg text-foreground">{profile.height} cm</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Hemoglobin Level</Label>
                  {isEditing ? (
                    <Input
                      type="number"
                      defaultValue="12.5"
                      step="0.1"
                      className="bg-background"
                      placeholder="12.5"
                    />
                  ) : (
                    <p className="text-lg text-foreground">12.5 g/dL</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Iron Level</Label>
                  {isEditing ? (
                    <Input
                      type="number"
                      defaultValue="90"
                      className="bg-background"
                      placeholder="90"
                    />
                  ) : (
                    <p className="text-lg text-foreground">90 mcg/dL</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Health Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Health Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea
                    placeholder="Add any health notes, allergies, or concerns..."
                    className="min-h-[100px]"
                    defaultValue="No known allergies. Regular prenatal checkups."
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No known allergies. Regular prenatal checkups.
                  </p>
                )}
              </CardContent>
            </Card>

            {isEditing && (
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleSaveChanges}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            )}
          </motion.div>
        )}

        {/* Privacy Section */}
        {activeSection === 'privacy' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Privacy Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(profile.privacy).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between py-2">
                    <div className="space-y-0.5">
                      <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</Label>
                      <p className="text-xs text-muted-foreground">
                        {key === 'profileVisible' && 'Make your profile visible to other mothers'}
                        {key === 'showWeight' && 'Show your weight information'}
                        {key === 'showDueDate' && 'Display your due date'}
                        {key === 'showLocation' && 'Show your location'}
                        {key === 'onlineStatus' && 'Display when you\'re online'}
                      </p>
                    </div>
                    <Switch
                      checked={value}
                      onCheckedChange={(checked) => updatePrivacy(key, checked)}
                    />
                  </div>
                ))}
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" />
                  App Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <Label>Dark Mode</Label>
                    <p className="text-xs text-muted-foreground">Switch between light and dark theme</p>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      toggleTheme();
                      updateProfile('preferences', { ...profile.preferences, darkMode: theme !== 'dark' });
                    }}
                  >
                    {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </Button>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <Label>Push Notifications</Label>
                    <p className="text-xs text-muted-foreground">Receive updates and reminders</p>
                  </div>
                  <Switch
                    checked={profile.preferences.notifications}
                    onCheckedChange={(checked) =>
                      updateProfile('preferences', { ...profile.preferences, notifications: checked })
                    }
                  />
                </div>

                <div className="pt-4 border-t">
                  <Label className="mb-3 block">Language</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { code: 'English', flag: '🇬🇧', name: 'English' },
                      { code: 'Swahili', flag: '🇰🇪', name: 'Kiswahili' },
                      { code: 'Francais', flag: '🇫🇷', name: 'Français' }
                    ].map((lang) => (
                      <Button
                        key={lang.code}
                        variant={language === lang.code ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                          setLanguage(lang.code as any);
                          toast.success('Language updated');
                        }}
                        className={lang.code === 'Francais' ? 'col-span-2' : ''}
                      >
                        {lang.flag} {lang.name}
                      </Button>
                    ))}
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
