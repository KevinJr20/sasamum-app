import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { mockUserData } from './PregnancyData';
import { 
  ArrowLeft,
  Camera,
  Edit,
  Settings,
  Shield,
  Heart,
  Baby,
  Calendar,
  Weight,
  Ruler,
  MapPin,
  Phone,
  Mail,
  Globe,
  Eye,
  EyeOff,
  Home,
  MessageCircle,
  User,
  LogOut,
  HelpCircle
} from 'lucide-react';

interface ProfilePageProps {
  onBack: () => void;
  userName?: string;
}

export function ProfilePage({ onBack, userName = "Brenda" }: ProfilePageProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [isProfilePublic, setIsProfilePublic] = useState(true);
  const [showWeight, setShowWeight] = useState(false);
  const [showDueDate, setShowDueDate] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [profileData, setProfileData] = useState({
    name: 'Brenda Nelson',
    email: 'brenda.nelson@example.com',
    phone: '+254 712 345 678',
    location: 'Kisumu, Kenya',
    bio: 'First-time mama excited for this beautiful journey. Love connecting with other mothers in our Ubuntu sisterhood! 💕',
    currentWeight: '65 kg',
    prePregnancyWeight: '58 kg',
    height: '165 cm',
    bloodType: 'O+',
    allergies: 'None',
    emergencyContact: 'Patrick O. - +254 712 345 679'
  });

  const pregnancyStats = [
    {
      icon: Baby,
      label: 'Current Week',
      value: `${mockUserData.currentWeek} weeks`,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      icon: Calendar,
      label: 'Due Date',
      value: new Date(mockUserData.dueDate).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      }),
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      isPrivate: !showDueDate
    },
    {
      icon: Heart,
      label: 'Days Left',
      value: `${mockUserData.daysLeft} days`,
      color: 'text-red-500',
      bgColor: 'bg-red-100'
    },
    {
      icon: Weight,
      label: 'Current Weight',
      value: profileData.currentWeight,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      isPrivate: !showWeight
    }
  ];

  const bottomNavItems = [
    { icon: Home, isActive: false },
    { icon: Calendar, isActive: false },
    { icon: MessageCircle, isActive: false },
    { icon: User, isActive: true }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-background max-w-sm mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white">
        <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </Button>
        <h1 className="text-lg text-foreground">Profile</h1>
        <Button 
          variant="ghost" 
          size="sm" 
          className="p-2"
          onClick={() => setIsEditing(!isEditing)}
        >
          <Edit className="w-5 h-5 text-foreground" />
        </Button>
      </div>

      <div className="px-4 pb-20">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6"
        >
          <Card className="border-border/50">
            <CardContent className="p-6 text-center">
              <div className="relative inline-block mb-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage src="/api/placeholder/96/96" />
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                    {profileData.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                {/* Online Status */}
                <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white ${
                  isOnline ? 'bg-green-500' : 'bg-gray-400'
                }`} />
                
                {/* Camera Button */}
                <Button 
                  size="sm" 
                  className="absolute -top-1 -right-1 w-8 h-8 p-0 bg-primary hover:bg-primary/90 rounded-full"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>
              
              <h2 className="text-xl text-foreground mb-1">{profileData.name}</h2>
              <p className="text-sm text-muted-foreground mb-3">
                {mockUserData.currentWeek} weeks pregnant • Due {new Date(mockUserData.dueDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </p>
              
              <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground mb-4">
                <MapPin className="w-4 h-4" />
                <span>{profileData.location}</span>
              </div>
              
              <p className="text-sm text-muted-foreground leading-relaxed">
                {profileData.bio}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pregnancy Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6"
        >
          <h3 className="text-lg text-foreground mb-4">Pregnancy Journey</h3>
          <div className="grid grid-cols-2 gap-3">
            {pregnancyStats.map((stat, index) => (
              <Card key={index} className="border-border/50">
                <CardContent className="p-4 text-center">
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                  <div className="flex items-center justify-center space-x-1">
                    <p className="text-sm text-foreground">
                      {stat.isPrivate ? '••••' : stat.value}
                    </p>
                    {stat.isPrivate && (
                      <EyeOff className="w-3 h-3 text-muted-foreground" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Privacy Settings */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-6"
        >
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <h3 className="text-lg text-foreground flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Privacy Settings</span>
              </h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <Label className="text-sm text-foreground">Show Online Status</Label>
                    <p className="text-xs text-muted-foreground">Let other mothers see when you're active</p>
                  </div>
                </div>
                <Switch 
                  checked={isOnline}
                  onCheckedChange={setIsOnline}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Eye className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <Label className="text-sm text-foreground">Public Profile</Label>
                    <p className="text-xs text-muted-foreground">Allow other mothers to view your profile</p>
                  </div>
                </div>
                <Switch 
                  checked={isProfilePublic}
                  onCheckedChange={setIsProfilePublic}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <Label className="text-sm text-foreground">Show Due Date</Label>
                    <p className="text-xs text-muted-foreground">Display your due date publicly</p>
                  </div>
                </div>
                <Switch 
                  checked={showDueDate}
                  onCheckedChange={setShowDueDate}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Weight className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <Label className="text-sm text-foreground">Show Weight Info</Label>
                    <p className="text-xs text-muted-foreground">Display weight information publicly</p>
                  </div>
                </div>
                <Switch 
                  checked={showWeight}
                  onCheckedChange={setShowWeight}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Personal Information */}
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <h3 className="text-lg text-foreground">Personal Information</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label className="text-sm text-foreground">Email</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <Input 
                        value={profileData.email}
                        className="flex-1 bg-input-background border-border/50"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm text-foreground">Phone</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <Input 
                        value={profileData.phone}
                        className="flex-1 bg-input-background border-border/50"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm text-foreground">Height</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Ruler className="w-4 h-4 text-muted-foreground" />
                      <Input 
                        value={profileData.height}
                        className="flex-1 bg-input-background border-border/50"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-3"
        >
          <Button variant="outline" className="w-full justify-start border-border/50">
            <Settings className="w-5 h-5 mr-3" />
            Account Settings
          </Button>
          
          <Button variant="outline" className="w-full justify-start border-border/50">
            <HelpCircle className="w-5 h-5 mr-3" />
            Help & Support
          </Button>
          
          <Button variant="outline" className="w-full justify-start border-destructive/50 text-destructive hover:bg-destructive/5">
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </Button>
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm bg-white border-t border-border/50 px-4 py-3"
      >
        <div className="flex justify-around">
          {bottomNavItems.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={() => {
                if (item.icon === Home) {
                  onBack();
                }
              }}
              className={`p-3 transition-all duration-200 ${
                item.isActive 
                  ? 'text-primary bg-primary/10 scale-110' 
                  : 'text-muted-foreground hover:text-foreground hover:scale-105'
              }`}
            >
              <item.icon className="w-6 h-6" />
            </Button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}