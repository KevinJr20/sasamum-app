import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { FeatureDetailModal } from './FeatureDetailModal';
import { EnhancedBabyDevelopmentModal } from './EnhancedBabyDevelopmentModal';
import { PregnancyStageVisualization } from './PregnancyStageVisualization';
import { HeaderMenu } from './HeaderMenu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { SasaMumLogo } from './SasaMum-Logo';
import { 
  mockUserData, 
  getCurrentWeekData, 
  featureCardsData,
  type FeatureCardData 
} from './PregnancyData';
import { 
  Menu, 
  Cross, 
  Baby,
  ChevronRight,
  Activity,
  Brain,
  Truck,
  Heart,
  Users,
  AlertTriangle,
  Stethoscope,
  Pill,
  Droplet,
  Bell,
  Package,
  BrainCircuit,
  Mic,
  CalendarCheck,
  GraduationCap,
  FileCheck,
  Compass,
  Watch,
  TrendingUp,
  Bot,
  Briefcase
} from 'lucide-react';

interface DashboardProps {
  userName?: string;
  onNavigateToCalendar?: () => void;
  onNavigateToHospitals?: () => void;
  onNavigateToChat?: () => void;
  onNavigateToProfile?: () => void;
  onNavigateToPhotos?: () => void;
  onNavigateToBuddySystem?: () => void;
  onNavigateToFood?: () => void;
  onNavigateToBabyTracker?: () => void;
  onNavigateToMarketplace?: () => void;
  onNavigateToSymptoms?: () => void;
  onNavigateToMentalHealth?: () => void;
  onNavigateToEmergency?: () => void;
  onNavigateToContractions?: () => void;
  onNavigateToTransport?: () => void;
  onNavigateToChildcare?: () => void;
  onNavigateToSettings?: () => void;
  onNavigateToAIAssistant?: () => void;
  onNavigateToProviderPortal?: () => void;
  onNavigateToComplications?: () => void;
  onNavigateToArticlesVideos?: () => void;
  onNavigateToMedications?: () => void;
  onNavigateToVitals?: () => void;
  onNavigateToEmergencyAlert?: () => void;
  onNavigateToBirthPreparedness?: () => void;
  onNavigateToAIRisk?: () => void;
  onNavigateToVoiceNav?: () => void;
  onNavigateToCHWPortal?: () => void;
  onNavigateToAppointments?: () => void;
  onNavigateToGamifiedEdu?: () => void;
  onNavigateToBirthCert?: () => void;
  onNavigateToDeliveryPlan?: () => void;
  onNavigateToWearables?: () => void;
  onNavigateToImpact?: () => void;
  onNavigateToChatbot?: () => void;
  onSignOut?: () => void;
}

export function Dashboard({ 
  userName = "Brenda", 
  onNavigateToCalendar, 
  onNavigateToHospitals, 
  onNavigateToChat, 
  onNavigateToProfile, 
  onNavigateToPhotos,
  onNavigateToBuddySystem,
  onNavigateToFood,
  onNavigateToBabyTracker,
  onNavigateToMarketplace,
  onNavigateToSymptoms,
  onNavigateToMentalHealth,
  onNavigateToEmergency,
  onNavigateToContractions,
  onNavigateToTransport,
  onNavigateToChildcare,
  onNavigateToSettings,
  onNavigateToAIAssistant,
  onNavigateToProviderPortal,
  onNavigateToArticlesVideos,
  onNavigateToMedications,
  onNavigateToComplications,
  onNavigateToVitals,
  onNavigateToEmergencyAlert,
  onNavigateToBirthPreparedness,
  onNavigateToAIRisk,
  onNavigateToVoiceNav,
  onNavigateToCHWPortal,
  onNavigateToAppointments,
  onNavigateToGamifiedEdu,
  onNavigateToBirthCert,
  onNavigateToDeliveryPlan,
  onNavigateToWearables,
  onNavigateToImpact,
  onNavigateToChatbot,
  onSignOut
}: DashboardProps) {
  const [userData] = useState(mockUserData);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedDayDate, setSelectedDayDate] = useState<Date | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<FeatureCardData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBabyDevModalOpen, setIsBabyDevModalOpen] = useState(false);
  const [isStageVizModalOpen, setIsStageVizModalOpen] = useState(false);
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [dayNotes, setDayNotes] = useState<Record<string, string>>({});
  
  const weekData = getCurrentWeekData(userData.currentWeek);
  
  // Generate calendar data for current week
  const generateWeekDays = () => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
    
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + mondayOffset + i);
      
      weekDays.push({
        day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
        date: date.getDate(),
        fullDate: date,
        isToday: date.toDateString() === today.toDateString()
      });
    }
    return weekDays;
  };

  const weekDays = generateWeekDays();

  // Enhanced feature cards with icons
  const featureCards = featureCardsData.map(card => ({
    ...card,
    icon: card.id === 'medications' ? Pill :
          card.id === 'contractions' ? Activity :
          card.id === 'transport' ? Truck :
          card.id === 'symptoms' ? Stethoscope :
          card.id === 'mental-health' ? Heart :
          card.id === 'ai-assistant' ? Brain :
          card.id === 'buddy-system' ? Users :
          card.id === 'hospitals' ? Cross :
          card.id === 'emergency' ? AlertTriangle :
          card.id === 'complications' ? Droplet :
          card.id === 'ai-risk' ? BrainCircuit :
          card.id === 'voice-nav' ? Mic :
          card.id === 'appointments' ? CalendarCheck :
          card.id === 'gamified-edu' ? GraduationCap :
          card.id === 'birth-cert' ? FileCheck :
          card.id === 'delivery-plan' ? Compass :
          card.id === 'wearables' ? Watch :
          card.id === 'impact' ? TrendingUp :
          card.id === 'chatbot' ? Bot :
          card.id === 'chw-portal' ? Briefcase : Package
  }));

  const handleFeatureClick = (feature: FeatureCardData) => {
    // Map feature IDs to navigation handlers
    const navigationMap: Record<string, (() => void) | undefined> = {
      'medications': onNavigateToMedications,
      'contractions': onNavigateToContractions,
      'transport': onNavigateToTransport,
      'symptoms': onNavigateToSymptoms,
      'mental-health': onNavigateToMentalHealth,
      'ai-assistant': onNavigateToAIAssistant,
      'buddy-system': onNavigateToBuddySystem,
      'hospitals': onNavigateToHospitals,
      'emergency': onNavigateToEmergency,
      'complications': onNavigateToComplications,
      'ai-risk': onNavigateToAIRisk,
      'voice-nav': onNavigateToVoiceNav,
      'chw-portal': onNavigateToCHWPortal,
      'appointments': onNavigateToAppointments,
      'gamified-edu': onNavigateToGamifiedEdu,
      'birth-cert': onNavigateToBirthCert,
      'delivery-plan': onNavigateToDeliveryPlan,
      'wearables': onNavigateToWearables,
      'impact': onNavigateToImpact,
      'chatbot': onNavigateToChatbot,
    };

    const handler = navigationMap[feature.id];
    if (handler) {
      handler();
    } else {
      setSelectedFeature(feature);
      setIsModalOpen(true);
    }
  };

  const handleDayClick = (date: number, fullDate: Date) => {
    setSelectedDay(date);
    setSelectedDayDate(fullDate);
    const dateKey = fullDate.toISOString().split('T')[0];
    setNoteText(dayNotes[dateKey] || '');
    setIsNoteDialogOpen(true);
  };

  const handleSaveNote = () => {
    if (selectedDayDate) {
      const dateKey = selectedDayDate.toISOString().split('T')[0];
      if (noteText.trim()) {
        setDayNotes({ ...dayNotes, [dateKey]: noteText });
      } else {
        const newNotes = { ...dayNotes };
        delete newNotes[dateKey];
        setDayNotes(newNotes);
      }
    }
    setIsNoteDialogOpen(false);
    setNoteText('');
  };

  const handleDeleteNote = () => {
    if (selectedDayDate) {
      const dateKey = selectedDayDate.toISOString().split('T')[0];
      const newNotes = { ...dayNotes };
      delete newNotes[dateKey];
      setDayNotes(newNotes);
    }
    setIsNoteDialogOpen(false);
    setNoteText('');
  };

  // Bottom navigation handled by App.tsx

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-background w-full pb-20"
    >
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 flex items-center justify-between p-4 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
        <Button 
          variant="ghost" 
          size="sm" 
          className="p-2"
          onClick={() => setIsMenuOpen(true)}
        >
          <Menu className="w-6 h-6 text-foreground" />
        </Button>
        <SasaMumLogo size="sm" showText={true} />
        <Button
          variant="ghost"
          size="sm"
          className="p-2"
          onClick={onNavigateToProfile}
        >
          <Avatar className="w-8 h-8">
            <AvatarImage src="/api/placeholder/32/32" />
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
              {userName.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </div>

      <div className="px-4 pb-4">
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6"
        >
          <h2 className="text-muted-foreground text-sm mb-1">Hello {userData.name}</h2>
          <h3 className="text-lg text-foreground">{userData.currentWeek}th Week of Pregnancy</h3>
        </motion.div>

        {/* Enhanced Calendar with Circular Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6"
        >
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-border/50">
            <CardContent className="p-4">
              {/* Week Days Header */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {weekDays.map((day, index) => {
                  const dateKey = day.fullDate.toISOString().split('T')[0];
                  const hasNote = dayNotes[dateKey];
                  return (
                    <div key={index} className="text-center">
                      <div className="text-xs text-muted-foreground mb-2">{day.day}</div>
                      <button
                        onClick={() => handleDayClick(day.date, day.fullDate)}
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-sm transition-all duration-200 relative ${
                          day.isToday
                            ? 'bg-gradient-to-br from-primary to-pink-400 text-white shadow-lg scale-110'
                            : selectedDay === day.date
                            ? 'bg-primary/20 text-foreground ring-2 ring-primary/50'
                            : 'bg-white/60 dark:bg-gray-800/60 text-foreground hover:bg-primary/10 hover:scale-105'
                        }`}
                      >
                        {day.date}
                        {hasNote && (
                          <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Circular Progress Visualization */}
              <div className="relative flex items-center justify-center my-6">
                <svg className="w-48 h-48 -rotate-90" viewBox="0 0 200 200">
                  {/* Background circle */}
                  <circle
                    cx="100"
                    cy="100"
                    r="85"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-muted/20"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="100"
                    cy="100"
                    r="85"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${(userData.currentWeek / 40) * 534} 534`}
                    className="transition-all duration-1000"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#e06b75" />
                      <stop offset="50%" stopColor="#f4a5b9" />
                      <stop offset="100%" stopColor="#c8a2c8" />
                    </linearGradient>
                  </defs>
                </svg>
                
                {/* Center content */}
                <button 
                  onClick={() => setIsStageVizModalOpen(true)}
                  className="absolute inset-0 flex flex-col items-center justify-center hover:scale-105 transition-transform"
                >
                  <div className="text-5xl mb-2">👶</div>
                  <div className="text-center">
                    <p className="text-2xl text-foreground">{userData.currentWeek}</p>
                    <p className="text-xs text-muted-foreground">weeks</p>
                  </div>
                </button>
              </div>

              {/* Progress Info */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="text-primary">{Math.round((userData.currentWeek / 40) * 100)}%</span>
              </div>
              

            </CardContent>
          </Card>
        </motion.div>

        {/* Baby Development Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-6"
        >
          <Card 
            className="bg-primary/5 border-primary/20 hover:shadow-md transition-shadow duration-200 cursor-pointer"
            onClick={() => setIsBabyDevModalOpen(true)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <Baby className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Your baby is the size of a</p>
                    <p className="text-foreground capitalize">{weekData.babySize}</p>
                  </div>
                </div>
                <div className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors">
                  <ChevronRight className="w-5 h-5 text-primary" />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">Height</p>
                  <p className="text-foreground">{weekData.babyHeight}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">Weight</p>
                  <p className="text-foreground">{weekData.babyWeight}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">Days Left</p>
                  <p className="text-foreground">{userData.daysLeft} days</p>
                </div>
              </div>

              <div className="pt-3 border-t border-primary/10">
                <p className="text-xs text-muted-foreground mb-1">This Week's Milestone</p>
                <p className="text-sm text-foreground">{weekData.milestone}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-4"
        >
          <h3 className="text-foreground">Your Care Tools</h3>
          <p className="text-sm text-muted-foreground">Essential features for your journey</p>
        </motion.div>

        {/* Feature Grid - Improved Layout */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid grid-cols-2 gap-3 sm:gap-4"
        >
          {featureCards.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ 
                duration: 0.4, 
                delay: 0.5 + index * 0.05,
                type: "spring",
                stiffness: 100
              }}
            >
              <Card 
                className="group relative overflow-hidden hover:shadow-lg transition-all duration-300 border-border/50 cursor-pointer hover:scale-[1.02] active:scale-[0.98] hover:border-primary/30"
                onClick={() => handleFeatureClick(feature)}
              >
                <CardContent className="p-4 text-center relative">
                  {/* Gradient Overlay Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {feature.comingSoon && (
                    <Badge 
                      variant="secondary" 
                      className="absolute -top-1 -right-1 text-xs px-2 py-0.5 bg-primary/10 text-primary border-primary/20 shadow-sm z-10"
                    >
                      Soon
                    </Badge>
                  )}
                  
                  {/* Icon Container with Animation */}
                  <div className={`w-14 h-14 ${feature.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-3 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-sm`}>
                    <feature.icon className={`w-6 h-6 ${feature.iconColor} transition-transform duration-300 group-hover:scale-110`} />
                  </div>
                  
                  {/* Text Content */}
                  <div className="relative z-10">
                    <h4 className="text-sm text-foreground mb-1 group-hover:text-primary transition-colors duration-200">{feature.title}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  {/* Bottom Accent Line */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Bottom Navigation handled by App.tsx */}

      {/* Feature Detail Modal */}
      <FeatureDetailModal
        feature={selectedFeature}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Header Menu */}
      <HeaderMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onNavigateToFood={onNavigateToFood}
        onNavigateToBabyTracker={onNavigateToBabyTracker}
        onNavigateToMarketplace={onNavigateToMarketplace}
        onNavigateToChildcare={onNavigateToChildcare}
        onNavigateToSettings={onNavigateToSettings}
        onNavigateToPhotos={onNavigateToPhotos}
        onNavigateToArticlesVideos={onNavigateToArticlesVideos}
        onNavigateToMedications={onNavigateToMedications}
        onNavigateToProviderPortal={onNavigateToProviderPortal}
        onSignOut={onSignOut}
        userName={userName}
      />

      <EnhancedBabyDevelopmentModal 
        isOpen={isBabyDevModalOpen}
        onClose={() => setIsBabyDevModalOpen(false)}
        currentWeek={userData.currentWeek}
        dueDate={userData.dueDate}
      />

      <PregnancyStageVisualization
        isOpen={isStageVizModalOpen}
        onClose={() => setIsStageVizModalOpen(false)}
        currentWeek={userData.currentWeek}
      />

      {/* Note Dialog */}
      <Dialog open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle>
              {selectedDayDate && `Note for ${selectedDayDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
            </DialogTitle>
            <DialogDescription>
              Add, edit, or delete your personal note for this day
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="note">Your note</Label>
              <Textarea
                id="note"
                placeholder="Add a note for this day..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="mt-2 min-h-[100px] rounded-2xl"
              />
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            {noteText && (
              <Button variant="destructive" onClick={handleDeleteNote} className="rounded-full">
                Delete
              </Button>
            )}
            <Button variant="outline" onClick={() => setIsNoteDialogOpen(false)} className="rounded-full">
              Cancel
            </Button>
            <Button onClick={handleSaveNote} className="rounded-full">
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}