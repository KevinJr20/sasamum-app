import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { Progress } from './ui/progress';
import { ScrollArea } from './ui/scroll-area';
import {
  X,
  Baby,
  Heart,
  Activity,
  Ruler,
  Weight,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Eye,
  Ear,
  Hand,
  Brain,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Info,
  Footprints,
  Apple,
  Stethoscope,
  Zap,
  Smile,
  BookOpen,
  Share2
} from 'lucide-react';

interface BabyDevelopmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentWeek: number;
  dueDate: string;
  babySize: string;
  babyWeight: string;
  babyHeight: string;
}

// Enhanced pregnancy milestones with comprehensive data
const weeklyDevelopment: Record<number, {
  week: number;
  babySize: string;
  babyWeight: string;
  babyHeight: string;
  milestone: string;
  details: string;
  developmentHighlights: string[];
  mamaBody: string[];
  emoji: string;
  trimester: number;
  importantNotes?: string[];
  dietTips?: string[];
  exerciseTips?: string[];
}> = {
  4: {
    week: 4,
    babySize: 'Poppy Seed',
    babyWeight: '<1g',
    babyHeight: '2mm',
    milestone: 'Neural tube developing',
    details: 'Your baby is just a tiny embryo, but amazing things are already happening! The foundation for your baby\'s brain and spinal cord is forming.',
    developmentHighlights: ['Heart begins to form', 'Neural tube closes', 'Placenta starts developing', 'Amniotic sac forms'],
    mamaBody: ['Missed period', 'Possible light spotting', 'Breast tenderness', 'Mild cramping'],
    emoji: '🌱',
    trimester: 1,
    dietTips: ['Take folic acid supplements', 'Eat leafy greens', 'Stay hydrated'],
    exerciseTips: ['Light walking', 'Gentle stretching', 'Avoid high-impact activities']
  },
  8: {
    week: 8,
    babySize: 'Raspberry',
    babyWeight: '1g',
    babyHeight: '1.6cm',
    milestone: 'Fingers and toes forming',
    details: 'Baby is moving constantly, though you can\'t feel it yet. All major organs are developing at an incredible pace.',
    developmentHighlights: ['Tiny fingers and toes', 'Heart beating strongly (150-170 bpm)', 'Facial features emerging', 'Eyelids forming'],
    mamaBody: ['Morning sickness may peak', 'Fatigue', 'Food aversions', 'Frequent urination'],
    emoji: '🫐',
    trimester: 1,
    dietTips: ['Eat small frequent meals', 'Ginger tea for nausea', 'Protein-rich foods'],
    exerciseTips: ['Rest when tired', 'Short walks', 'Prenatal yoga']
  },
  12: {
    week: 12,
    babySize: 'Lime',
    babyWeight: '14g',
    babyHeight: '5.4cm',
    milestone: 'All major organs formed',
    details: 'Your baby can open and close fingers, and may start to make sucking motions. This marks the end of the first trimester!',
    developmentHighlights: ['Reflexes developing', 'Vocal cords forming', 'Intestines in place', 'Bone tissue appearing'],
    mamaBody: ['Energy returning', 'Morning sickness easing', 'Baby bump starting', 'First ultrasound'],
    emoji: '🥝',
    trimester: 1,
    dietTips: ['Increase calcium intake', 'Whole grains', 'Fresh fruits'],
    exerciseTips: ['Swimming is safe', 'Prenatal classes', 'Pelvic floor exercises']
  },
  16: {
    week: 16,
    babySize: 'Avocado',
    babyWeight: '100g',
    babyHeight: '11.6cm',
    milestone: 'Baby can hear your voice',
    details: 'Your baby\'s eyes can move and they may be able to hear sounds from outside. Talk, sing, and read to your baby!',
    developmentHighlights: ['Hearing developing', 'Facial expressions', 'Grip reflex', 'Sucking and swallowing'],
    mamaBody: ['Feeling baby move soon', 'Glowing skin', 'Growing bump', 'Round ligament pain'],
    emoji: '🥑',
    trimester: 2,
    dietTips: ['Iron-rich foods (sukuma wiki)', 'Omega-3 fatty acids', 'Vitamin D'],
    exerciseTips: ['Walking 30 mins daily', 'Prenatal yoga', 'Swimming']
  },
  20: {
    week: 20,
    babySize: 'Banana',
    babyWeight: '300g',
    babyHeight: '25.6cm',
    milestone: 'Halfway there!',
    details: 'You\'re at the halfway mark! Baby is very active and you can definitely feel those movements now.',
    developmentHighlights: ['Swallowing amniotic fluid', 'Producing meconium', 'Sensory development', 'Sleep-wake patterns'],
    mamaBody: ['Regular baby movements', 'Round ligament pain', 'Growing appetite', 'Anatomy scan'],
    emoji: '🍌',
    trimester: 2,
    dietTips: ['Eat protein at every meal', 'Healthy snacks', 'Avoid processed foods'],
    exerciseTips: ['Moderate cardio', 'Strength training', 'Kegel exercises']
  },
  24: {
    week: 24,
    babySize: 'Corn',
    babyWeight: '600g',
    babyHeight: '30cm',
    milestone: 'Baby can hear and respond to sounds',
    details: 'Baby is viable now! Their lungs are developing and they\'re gaining weight. They can hear your voice clearly.',
    developmentHighlights: ['Lung development', 'Sleep-wake cycles', 'Taste buds working', 'Footprints forming'],
    mamaBody: ['Braxton Hicks contractions', 'Back pain', 'Glucose screening', 'Visible kicks'],
    emoji: '🌽',
    trimester: 2,
    dietTips: ['Monitor blood sugar', 'Complex carbohydrates', 'Frequent small meals'],
    exerciseTips: ['Prenatal swimming', 'Walking', 'Avoid lying flat on back']
  },
  28: {
    week: 28,
    babySize: 'Eggplant',
    babyWeight: '1000g',
    babyHeight: '37.6cm',
    milestone: 'Eyes can open and close',
    details: 'Welcome to the third trimester! Baby is getting stronger every day and can now blink and dream.',
    developmentHighlights: ['Eyes opening', 'Brain development rapid', 'Can dream', 'Eyelashes growing'],
    mamaBody: ['Feeling heavier', 'Shortness of breath', 'Frequent urination', 'Third trimester begins'],
    emoji: '🍆',
    trimester: 3,
    dietTips: ['Small frequent meals', 'Avoid spicy foods', 'Stay hydrated'],
    exerciseTips: ['Gentle walking', 'Prenatal yoga', 'Rest frequently']
  },
  32: {
    week: 32,
    babySize: 'Butternut Squash',
    babyWeight: '1700g',
    babyHeight: '42cm',
    milestone: 'Practicing breathing movements',
    details: 'Baby is perfecting essential skills like breathing, sucking, and swallowing. Almost ready to meet you!',
    developmentHighlights: ['Breathing practice', 'Soft bones hardening', 'Fat accumulating', 'Immune system developing'],
    mamaBody: ['Braxton Hicks increasing', 'Nesting instinct', 'Difficulty sleeping', 'Swelling'],
    emoji: '🥒',
    trimester: 3,
    dietTips: ['Calcium for bones', 'Healthy fats', 'Avoid salt'],
    exerciseTips: ['Gentle stretching', 'Short walks', 'Birthing ball exercises']
  },
  36: {
    week: 36,
    babySize: 'Papaya',
    babyWeight: '2600g',
    babyHeight: '47cm',
    milestone: 'Almost ready!',
    details: 'Baby is getting into position for birth. Most organ systems are mature and ready for the outside world.',
    developmentHighlights: ['Head engaging', 'Immune system building', 'Gaining weight', 'Liver and kidneys working'],
    mamaBody: ['Frequent bathroom trips', 'Pelvic pressure', 'Preparation for labor', 'Weekly checkups'],
    emoji: '🍈',
    trimester: 3,
    dietTips: ['High-energy foods', 'Date fruits', 'Stay hydrated'],
    exerciseTips: ['Walking to encourage descent', 'Squatting', 'Breathing exercises']
  },
  40: {
    week: 40,
    babySize: 'Watermelon',
    babyWeight: '3400g',
    babyHeight: '51cm',
    milestone: 'Full term!',
    details: 'Your baby is ready to meet you! All systems are go for the big day. You\'re doing amazing, mama!',
    developmentHighlights: ['Fully developed', 'Strong reflexes', 'Ready for birth', 'Vernix shedding'],
    mamaBody: ['Labor signs', 'Excitement and nerves', 'Ready to meet baby', 'Contractions may start'],
    emoji: '🍉',
    trimester: 3,
    dietTips: ['Light nutritious meals', 'Stay hydrated', 'Energy-rich snacks'],
    exerciseTips: ['Walking', 'Pelvic exercises', 'Rest and conserve energy']
  }
};

export function BabyDevelopmentModal({ 
  isOpen, 
  onClose, 
  currentWeek,
  dueDate,
  babySize,
  babyWeight,
  babyHeight
}: BabyDevelopmentModalProps) {
  const [selectedWeek, setSelectedWeek] = useState(currentWeek);
  const [activeTab, setActiveTab] = useState('baby');

  // Find closest available week data
  const getWeekData = (week: number) => {
    const availableWeeks = Object.keys(weeklyDevelopment).map(Number).sort((a, b) => a - b);
    let closestWeek = availableWeeks[0];
    
    for (const availableWeek of availableWeeks) {
      if (availableWeek <= week) {
        closestWeek = availableWeek;
      } else {
        break;
      }
    }
    
    return weeklyDevelopment[closestWeek];
  };

  const currentData = getWeekData(selectedWeek);
  const progress = (selectedWeek / 40) * 100;
  const daysLeft = Math.max(0, Math.ceil((new Date(dueDate).getTime() - new Date('2025-10-16').getTime()) / (1000 * 60 * 60 * 24)));

  const handlePreviousWeek = () => {
    if (selectedWeek > 4) {
      const availableWeeks = Object.keys(weeklyDevelopment).map(Number).sort((a, b) => a - b);
      const currentIndex = availableWeeks.findIndex(w => w >= selectedWeek);
      if (currentIndex > 0) {
        setSelectedWeek(availableWeeks[currentIndex - 1]);
      }
    }
  };

  const handleNextWeek = () => {
    if (selectedWeek < 40) {
      const availableWeeks = Object.keys(weeklyDevelopment).map(Number).sort((a, b) => a - b);
      const currentIndex = availableWeeks.findIndex(w => w >= selectedWeek);
      if (currentIndex < availableWeeks.length - 1) {
        setSelectedWeek(availableWeeks[currentIndex + 1]);
      }
    }
  };

  const handleShare = () => {
    const shareText = `Week ${selectedWeek}: ${currentData.milestone}\n\nBaby is the size of a ${currentData.babySize}! 👶✨\n\n#SasaMum #PregnancyJourney`;
    
    if (navigator.share) {
      navigator.share({
        title: `Week ${selectedWeek} Update`,
        text: shareText
      }).catch(() => {
        // Fallback to clipboard
        navigator.clipboard.writeText(shareText);
        alert('Information copied to clipboard!');
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Information copied to clipboard!');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-4 sm:inset-6 md:inset-8 z-50 flex items-center justify-center"
            onClick={onClose}
          >
            <Card 
              className="w-full max-w-4xl max-h-[90vh] bg-background border-border shadow-2xl rounded-2xl overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <ScrollArea className="flex-1">
                <CardContent className="p-0">
                  {/* Header - Fixed with solid background */}
                  <div className="sticky top-0 bg-gradient-to-r from-primary to-pink-500 backdrop-blur-xl p-4 sm:p-6 z-20 shadow-md">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                          <Baby className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg sm:text-xl text-white">Baby Development</h3>
                          <p className="text-sm text-white/90">Week by week journey</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleShare}
                          className="rounded-full bg-white/10 hover:bg-white/20 text-white"
                        >
                          <Share2 className="w-5 h-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={onClose}
                          className="rounded-full bg-white/10 hover:bg-white/20 text-white"
                        >
                          <X className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-white/90">
                        <span>Week {selectedWeek} of 40</span>
                        <span>{Math.round(progress)}% Complete</span>
                      </div>
                      <Progress value={progress} className="h-2 bg-white/20" />
                      <div className="flex justify-between text-xs text-white/80">
                        <span>Trimester {currentData.trimester}</span>
                        <span>{daysLeft} days to go</span>
                      </div>
                    </div>
                  </div>

                  {/* Week Navigation */}
                  <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30 sticky top-[140px] sm:top-[156px] z-10 backdrop-blur-md">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePreviousWeek}
                      disabled={selectedWeek <= 4}
                      className="h-9"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Previous
                    </Button>
                    <div className="text-center">
                      <p className="text-3xl mb-1">{currentData.emoji}</p>
                      <Badge variant="secondary" className="text-sm">Week {selectedWeek}</Badge>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextWeek}
                      disabled={selectedWeek >= 40}
                      className="h-9"
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-6 space-y-6">
                    {/* Baby Size Visualization */}
                    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-900 rounded-2xl">
                      <CardContent className="p-4 sm:p-6">
                        <div className="text-center space-y-3">
                          <div className="text-5xl sm:text-6xl mb-2">👶</div>
                          <h4 className="text-base sm:text-lg text-foreground">Size of a {currentData.babySize}</h4>
                          <p className="text-sm text-muted-foreground max-w-md mx-auto">{currentData.details}</p>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mt-4">
                            <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-3">
                              <Ruler className="w-5 h-5 text-primary mx-auto mb-1" />
                              <p className="text-xs text-muted-foreground">Length</p>
                              <p className="text-sm sm:text-base text-foreground">{currentData.babyHeight}</p>
                            </div>
                            <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-3">
                              <Weight className="w-5 h-5 text-primary mx-auto mb-1" />
                              <p className="text-xs text-muted-foreground">Weight</p>
                              <p className="text-sm sm:text-base text-foreground">{currentData.babyWeight}</p>
                            </div>
                            <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-3 col-span-2 sm:col-span-1">
                              <Calendar className="w-5 h-5 text-primary mx-auto mb-1" />
                              <p className="text-xs text-muted-foreground">Trimester</p>
                              <p className="text-sm sm:text-base text-foreground">{currentData.trimester} of 3</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Milestone */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-5 h-5 text-amber-500" />
                        <h4 className="text-sm sm:text-base text-foreground">This Week's Milestone</h4>
                      </div>
                      <Card className="bg-accent/50 rounded-xl">
                        <CardContent className="p-4">
                          <p className="text-base sm:text-lg text-foreground mb-2">{currentData.milestone}</p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Tabs for Development Details */}
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                      <TabsList className="grid w-full grid-cols-4 h-auto">
                        <TabsTrigger value="baby" className="text-xs sm:text-sm py-2">
                          <Baby className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
                          <span className="hidden sm:inline">Baby</span>
                        </TabsTrigger>
                        <TabsTrigger value="mama" className="text-xs sm:text-sm py-2">
                          <Heart className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
                          <span className="hidden sm:inline">You</span>
                        </TabsTrigger>
                        <TabsTrigger value="diet" className="text-xs sm:text-sm py-2">
                          <Apple className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
                          <span className="hidden sm:inline">Diet</span>
                        </TabsTrigger>
                        <TabsTrigger value="exercise" className="text-xs sm:text-sm py-2">
                          <Activity className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
                          <span className="hidden sm:inline">Exercise</span>
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="baby" className="space-y-3 mt-4">
                        <Card>
                          <CardContent className="p-4 space-y-3">
                            <div className="flex items-center space-x-2 mb-3">
                              <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                              <h4 className="text-sm sm:text-base text-foreground">Development Highlights</h4>
                            </div>
                            {currentData.developmentHighlights.map((highlight, index) => (
                              <div key={index} className="flex items-start space-x-3">
                                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-foreground">{highlight}</p>
                              </div>
                            ))}
                          </CardContent>
                        </Card>

                        {/* Sensory Development */}
                        {selectedWeek >= 16 && (
                          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-200 dark:border-blue-900">
                            <CardContent className="p-4">
                              <h4 className="mb-3 flex items-center space-x-2 text-sm sm:text-base">
                                <Brain className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                <span>Sensory Development</span>
                              </h4>
                              <div className="grid grid-cols-2 gap-3">
                                {selectedWeek >= 16 && (
                                  <div className="flex items-center space-x-2 text-sm">
                                    <Ear className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                    <span>Can hear sounds</span>
                                  </div>
                                )}
                                {selectedWeek >= 20 && (
                                  <div className="flex items-center space-x-2 text-sm">
                                    <Hand className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                    <span>Touch sensitive</span>
                                  </div>
                                )}
                                {selectedWeek >= 28 && (
                                  <div className="flex items-center space-x-2 text-sm">
                                    <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                    <span>Eyes can open</span>
                                  </div>
                                )}
                                {selectedWeek >= 24 && (
                                  <div className="flex items-center space-x-2 text-sm">
                                    <Smile className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                    <span>Taste developing</span>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </TabsContent>

                      <TabsContent value="mama" className="space-y-3 mt-4">
                        <Card>
                          <CardContent className="p-4 space-y-3">
                            <div className="flex items-center space-x-2 mb-3">
                              <Heart className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                              <h4 className="text-sm sm:text-base text-foreground">What You Might Experience</h4>
                            </div>
                            {currentData.mamaBody.map((symptom, index) => (
                              <div key={index} className="flex items-start space-x-3">
                                <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-foreground">{symptom}</p>
                              </div>
                            ))}
                          </CardContent>
                        </Card>

                        {/* Tips Card */}
                        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-900">
                          <CardContent className="p-4">
                            <div className="flex items-start space-x-3">
                              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                              <div className="space-y-2">
                                <h4 className="text-sm sm:text-base text-foreground">Tips for This Week</h4>
                                <p className="text-sm text-muted-foreground">
                                  {currentData.trimester === 1 && "Rest when tired, stay hydrated, and take prenatal vitamins. Morning sickness should ease soon."}
                                  {currentData.trimester === 2 && "Start prenatal exercises, monitor baby movements, eat iron-rich foods. This is the 'golden trimester'!"}
                                  {currentData.trimester === 3 && "Pack hospital bag, practice breathing exercises, rest as much as possible. You're almost there!"}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="diet" className="space-y-3 mt-4">
                        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-900">
                          <CardContent className="p-4 space-y-3">
                            <div className="flex items-center space-x-2 mb-3">
                              <Apple className="w-5 h-5 text-green-600 dark:text-green-400" />
                              <h4 className="text-sm sm:text-base text-foreground">Nutrition Recommendations</h4>
                            </div>
                            {currentData.dietTips && currentData.dietTips.map((tip, index) => (
                              <div key={index} className="flex items-start space-x-3">
                                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-foreground">{tip}</p>
                              </div>
                            ))}
                          </CardContent>
                        </Card>

                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-start space-x-3">
                              <Stethoscope className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                              <div className="space-y-2">
                                <h4 className="text-sm sm:text-base text-foreground">Important Note</h4>
                                <p className="text-sm text-muted-foreground">
                                  Every pregnancy is unique. Consult your healthcare provider for personalized nutrition advice.
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="exercise" className="space-y-3 mt-4">
                        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-900">
                          <CardContent className="p-4 space-y-3">
                            <div className="flex items-center space-x-2 mb-3">
                              <Activity className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                              <h4 className="text-sm sm:text-base text-foreground">Safe Exercise Tips</h4>
                            </div>
                            {currentData.exerciseTips && currentData.exerciseTips.map((tip, index) => (
                              <div key={index} className="flex items-start space-x-3">
                                <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-foreground">{tip}</p>
                              </div>
                            ))}
                          </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 border-red-200 dark:border-red-900">
                          <CardContent className="p-4">
                            <div className="flex items-start space-x-3">
                              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                              <div className="space-y-2">
                                <h4 className="text-sm sm:text-base text-foreground">Stop Exercising If You Experience:</h4>
                                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                                  <li>Vaginal bleeding or fluid leakage</li>
                                  <li>Chest pain or difficulty breathing</li>
                                  <li>Dizziness or headache</li>
                                  <li>Painful contractions</li>
                                </ul>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </Tabs>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-3">
                      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl">
                        <CardContent className="p-3 sm:p-4 text-center">
                          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mx-auto mb-2" />
                          <p className="text-xs text-muted-foreground">Due Date</p>
                          <p className="text-xs sm:text-sm text-foreground">{new Date(dueDate).toLocaleDateString()}</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-xl">
                        <CardContent className="p-3 sm:p-4 text-center">
                          <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mx-auto mb-2" />
                          <p className="text-xs text-muted-foreground">Trimester</p>
                          <p className="text-xs sm:text-sm text-foreground">{currentData.trimester} of 3</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20 rounded-xl">
                        <CardContent className="p-3 sm:p-4 text-center">
                          <Baby className="w-4 h-4 sm:w-5 sm:h-5 text-pink-600 mx-auto mb-2" />
                          <p className="text-xs text-muted-foreground">Days Left</p>
                          <p className="text-xs sm:text-sm text-foreground">{daysLeft}</p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => setSelectedWeek(currentWeek)}
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        Current Week
                      </Button>
                      <Button
                        variant="default"
                        className="flex-1 bg-primary"
                        onClick={onClose}
                      >
                        Close
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </ScrollArea>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
