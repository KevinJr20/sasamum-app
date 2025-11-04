import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  Info
} from 'lucide-react';

interface EnhancedBabyDevelopmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentWeek: number;
  dueDate: string;
}

// Enhanced pregnancy milestones with more comprehensive data
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
}> = {
  4: {
    week: 4,
    babySize: 'Poppy Seed',
    babyWeight: '<1g',
    babyHeight: '2mm',
    milestone: 'Neural tube developing',
    details: 'Your baby is just a tiny embryo, but amazing things are already happening!',
    developmentHighlights: ['Heart begins to form', 'Neural tube closes', 'Placenta starts developing'],
    mamaBody: ['Missed period', 'Possible light spotting', 'Breast tenderness'],
    emoji: '🌱',
    trimester: 1
  },
  8: {
    week: 8,
    babySize: 'Raspberry',
    babyWeight: '1g',
    babyHeight: '1.6cm',
    milestone: 'Fingers and toes forming',
    details: 'Baby is moving constantly, though you can\'t feel it yet. All major organs are developing.',
    developmentHighlights: ['Tiny fingers and toes', 'Heart beating strongly', 'Facial features emerging'],
    mamaBody: ['Morning sickness may peak', 'Fatigue', 'Food aversions'],
    emoji: '🫐',
    trimester: 1
  },
  12: {
    week: 12,
    babySize: 'Lime',
    babyWeight: '14g',
    babyHeight: '5.4cm',
    milestone: 'All major organs formed',
    details: 'Your baby can open and close fingers, and may start to make sucking motions.',
    developmentHighlights: ['Reflexes developing', 'Vocal cords forming', 'Intestines in place'],
    mamaBody: ['Energy returning', 'Morning sickness easing', 'Baby bump starting'],
    emoji: '🥝',
    trimester: 1
  },
  16: {
    week: 16,
    babySize: 'Avocado',
    babyWeight: '100g',
    babyHeight: '11.6cm',
    milestone: 'Baby can hear your voice',
    details: 'Your baby\'s eyes can move and they may be able to hear sounds from outside.',
    developmentHighlights: ['Hearing developing', 'Facial expressions', 'Grip reflex'],
    mamaBody: ['Feeling baby move soon', 'Glowing skin', 'Growing bump'],
    emoji: '🥑',
    trimester: 2
  },
  20: {
    week: 20,
    babySize: 'Banana',
    babyWeight: '300g',
    babyHeight: '25.6cm',
    milestone: 'Halfway there!',
    details: 'You\'re at the halfway mark! Baby is very active and you can feel those movements.',
    developmentHighlights: ['Swallowing amniotic fluid', 'Producing meconium', 'Sensory development'],
    mamaBody: ['Regular baby movements', 'Round ligament pain', 'Growing appetite'],
    emoji: '🍌',
    trimester: 2
  },
  24: {
    week: 24,
    babySize: 'Corn',
    babyWeight: '600g',
    babyHeight: '30cm',
    milestone: 'Baby can hear and respond to sounds',
    details: 'Baby is viable now! Their lungs are developing and they\'re gaining weight.',
    developmentHighlights: ['Lung development', 'Sleep-wake cycles', 'Taste buds working'],
    mamaBody: ['Braxton Hicks contractions', 'Back pain', 'Glucose screening'],
    emoji: '🌽',
    trimester: 2
  },
  28: {
    week: 28,
    babySize: 'Eggplant',
    babyWeight: '1000g',
    babyHeight: '37.6cm',
    milestone: 'Eyes can open and close',
    details: 'Welcome to the third trimester! Baby is getting stronger every day.',
    developmentHighlights: ['Eyes opening', 'Brain development rapid', 'Can dream'],
    mamaBody: ['Feeling heavier', 'Shortness of breath', 'Frequent urination'],
    emoji: '🍆',
    trimester: 3
  },
  32: {
    week: 32,
    babySize: 'Butternut Squash',
    babyWeight: '1700g',
    babyHeight: '42cm',
    milestone: 'Practicing breathing movements',
    details: 'Baby is perfecting essential skills like breathing, sucking, and swallowing.',
    developmentHighlights: ['Breathing practice', 'Soft bones hardening', 'Fat accumulating'],
    mamaBody: ['Braxton Hicks increasing', 'Nesting instinct', 'Difficulty sleeping'],
    emoji: '🥒',
    trimester: 3
  },
  36: {
    week: 36,
    babySize: 'Papaya',
    babyWeight: '2600g',
    babyHeight: '47cm',
    milestone: 'Almost ready!',
    details: 'Baby is getting into position for birth. Most organ systems are mature.',
    developmentHighlights: ['Head engaging', 'Immune system building', 'Gaining weight'],
    mamaBody: ['Frequent bathroom trips', 'Pelvic pressure', 'Preparation for labor'],
    emoji: '🍈',
    trimester: 3
  },
  40: {
    week: 40,
    babySize: 'Watermelon',
    babyWeight: '3400g',
    babyHeight: '51cm',
    milestone: 'Full term!',
    details: 'Your baby is ready to meet you! All systems are go for the big day.',
    developmentHighlights: ['Fully developed', 'Strong reflexes', 'Ready for birth'],
    mamaBody: ['Labor signs', 'Excitement and nerves', 'Ready to meet baby'],
    emoji: '🍉',
    trimester: 3
  }
};

// Find closest week with data
const getClosestWeekData = (week: number) => {
  const availableWeeks = Object.keys(weeklyDevelopment).map(Number).sort((a, b) => a - b);
  const closestWeek = availableWeeks.reduce((prev, curr) => 
    Math.abs(curr - week) < Math.abs(prev - week) ? curr : prev
  );
  return weeklyDevelopment[closestWeek];
};

export function EnhancedBabyDevelopmentModal({
  isOpen,
  onClose,
  currentWeek,
  dueDate
}: EnhancedBabyDevelopmentModalProps) {
  const [selectedWeek, setSelectedWeek] = useState(currentWeek);
  const weekData = getClosestWeekData(selectedWeek);

  const calculateDaysLeft = () => {
    const due = new Date(dueDate);
    const now = new Date(); // Use current date for real-time countdown
    const diffTime = due.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };

  const progressPercentage = (selectedWeek / 40) * 100;
  const daysLeft = calculateDaysLeft();

  const navigateWeek = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && selectedWeek > 4) {
      setSelectedWeek(prev => Math.max(4, prev - 4));
    } else if (direction === 'next' && selectedWeek < 40) {
      setSelectedWeek(prev => Math.min(40, prev + 4));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-2xl max-h-[90vh] overflow-hidden bg-background rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <ScrollArea className="h-[90vh]">
              <div className="relative">
                {/* Header */}
                <div className="sticky top-0 z-10 bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-950 dark:to-purple-950 backdrop-blur-xl p-6 border-b border-border shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-primary/20 rounded-full">
                        <Baby className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-2xl">Baby Development</h2>
                        <p className="text-sm text-muted-foreground">Week {selectedWeek} of 40</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={onClose} className="p-2">
                      <X className="w-5 h-5" />
                    </Button>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Pregnancy Progress</span>
                      <span className="text-primary">{Math.round(progressPercentage)}% Complete</span>
                    </div>
                    <Progress value={progressPercentage} className="h-3" />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Week {selectedWeek}</span>
                      <span>{daysLeft} days to go</span>
                    </div>
                  </div>

                  {/* Week Navigator */}
                  <div className="flex items-center justify-between mt-4 bg-background/50 backdrop-blur-sm rounded-xl p-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigateWeek('prev')}
                      disabled={selectedWeek <= 4}
                      className="p-2"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <div className="text-center">
                      <Badge variant="secondary" className="text-sm px-4 py-1">
                        Week {selectedWeek}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigateWeek('next')}
                      disabled={selectedWeek >= 40}
                      className="p-2"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  {/* Baby Size Comparison */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
                      <CardContent className="p-6 text-center">
                        <div className="text-6xl mb-4">{weekData.emoji}</div>
                        <h3 className="text-xl mb-2">Size of a {weekData.babySize}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{weekData.details}</p>
                        
                        <div className="grid grid-cols-3 gap-4 mt-4">
                          <div className="space-y-1">
                            <div className="p-2 bg-background rounded-lg">
                              <Ruler className="w-5 h-5 text-primary mx-auto mb-1" />
                              <p className="text-xs text-muted-foreground">Length</p>
                              <p className="text-sm">{weekData.babyHeight}</p>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="p-2 bg-background rounded-lg">
                              <Weight className="w-5 h-5 text-primary mx-auto mb-1" />
                              <p className="text-xs text-muted-foreground">Weight</p>
                              <p className="text-sm">{weekData.babyWeight}</p>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="p-2 bg-background rounded-lg">
                              <Calendar className="w-5 h-5 text-primary mx-auto mb-1" />
                              <p className="text-xs text-muted-foreground">Trimester</p>
                              <p className="text-sm">{weekData.trimester === 1 ? '1st' : weekData.trimester === 2 ? '2nd' : '3rd'}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Milestone */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Card>
                      <CardContent className="p-5">
                        <div className="flex items-center space-x-2 mb-3">
                          <Sparkles className="w-5 h-5 text-amber-500" />
                          <h4 className="text-foreground">This Week's Milestone</h4>
                        </div>
                        <p className="text-sm text-muted-foreground pl-7">{weekData.milestone}</p>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Tabs for detailed information */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Tabs defaultValue="baby" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="baby">
                          <Baby className="w-4 h-4 mr-2" />
                          Baby's Development
                        </TabsTrigger>
                        <TabsTrigger value="mama">
                          <Heart className="w-4 h-4 mr-2" />
                          Your Body
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="baby" className="space-y-3">
                        <Card>
                          <CardContent className="p-5 space-y-3">
                            <div className="flex items-center space-x-2 mb-3">
                              <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                              <h4 className="text-foreground">Development Highlights</h4>
                            </div>
                            {weekData.developmentHighlights.map((highlight, index) => (
                              <div key={index} className="flex items-start space-x-3">
                                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                <p className="text-sm">{highlight}</p>
                              </div>
                            ))}
                          </CardContent>
                        </Card>

                        {/* Sensory Development */}
                        {selectedWeek >= 16 && (
                          <Card>
                            <CardContent className="p-5">
                              <h4 className="mb-3 flex items-center space-x-2">
                                <Brain className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                <span>Sensory Development</span>
                              </h4>
                              <div className="grid grid-cols-2 gap-3">
                                {selectedWeek >= 16 && (
                                  <div className="flex items-center space-x-2 text-sm">
                                    <Ear className="w-4 h-4 text-muted-foreground" />
                                    <span>Can hear sounds</span>
                                  </div>
                                )}
                                {selectedWeek >= 20 && (
                                  <div className="flex items-center space-x-2 text-sm">
                                    <Hand className="w-4 h-4 text-muted-foreground" />
                                    <span>Touch sensitive</span>
                                  </div>
                                )}
                                {selectedWeek >= 28 && (
                                  <div className="flex items-center space-x-2 text-sm">
                                    <Eye className="w-4 h-4 text-muted-foreground" />
                                    <span>Eyes can open</span>
                                  </div>
                                )}
                                {selectedWeek >= 24 && (
                                  <div className="flex items-center space-x-2 text-sm">
                                    <Activity className="w-4 h-4 text-muted-foreground" />
                                    <span>Taste developing</span>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </TabsContent>

                      <TabsContent value="mama" className="space-y-3">
                        <Card>
                          <CardContent className="p-5 space-y-3">
                            <div className="flex items-center space-x-2 mb-3">
                              <Heart className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                              <h4 className="text-foreground">What You Might Experience</h4>
                            </div>
                            {weekData.mamaBody.map((symptom, index) => (
                              <div key={index} className="flex items-start space-x-3">
                                <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                <p className="text-sm">{symptom}</p>
                              </div>
                            ))}
                          </CardContent>
                        </Card>

                        {/* Tips Card */}
                        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-900">
                          <CardContent className="p-5">
                            <div className="flex items-start space-x-3">
                              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                              <div className="space-y-2">
                                <h4 className="text-foreground">Tips for This Week</h4>
                                <p className="text-sm text-muted-foreground">
                                  {weekData.trimester === 1 && "Rest when tired, stay hydrated, and take prenatal vitamins."}
                                  {weekData.trimester === 2 && "Start prenatal exercises, monitor baby movements, eat iron-rich foods."}
                                  {weekData.trimester === 3 && "Pack hospital bag, practice breathing exercises, rest as much as possible."}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </Tabs>
                  </motion.div>

                  {/* Action Buttons */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex gap-3 pt-2"
                  >
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setSelectedWeek(currentWeek)}
                    >
                      Back to Current Week
                    </Button>
                    <Button
                      variant="default"
                      className="flex-1"
                      onClick={onClose}
                    >
                      Close
                    </Button>
                  </motion.div>
                </div>
              </div>
            </ScrollArea>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
