import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ChevronLeft, ChevronRight, Calendar, Heart, Baby, X, BookOpen, Sparkles, Info } from 'lucide-react';
import { toast } from 'sonner';

interface PregnancyStageVisualizationProps {
  isOpen: boolean;
  onClose: () => void;
  currentWeek: number;
}

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Baby visualization data showing growth through trimesters
const babyVisualizationByWeek: Record<number, {
  svg: React.ReactNode;
  description: string;
  size: string;
}> = {
  4: {
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="50" r="3" fill="currentColor" className="text-pink-400" />
      </svg>
    ),
    description: "Tiny embryo",
    size: "Poppy seed"
  },
  8: {
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <ellipse cx="50" cy="50" rx="6" ry="8" fill="currentColor" className="text-pink-400" />
        <circle cx="48" cy="48" r="1.5" fill="currentColor" className="text-pink-600" />
        <circle cx="52" cy="48" r="1.5" fill="currentColor" className="text-pink-600" />
      </svg>
    ),
    description: "Beginning to form",
    size: "Raspberry"
  },
  12: {
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <ellipse cx="50" cy="45" rx="8" ry="12" fill="currentColor" className="text-pink-400" />
        <ellipse cx="50" cy="60" rx="6" ry="8" fill="currentColor" className="text-pink-400" />
        <circle cx="47" cy="42" r="2" fill="currentColor" className="text-pink-600" />
        <circle cx="53" cy="42" r="2" fill="currentColor" className="text-pink-600" />
      </svg>
    ),
    description: "Fully formed",
    size: "Lime"
  },
  16: {
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <ellipse cx="50" cy="40" rx="12" ry="15" fill="currentColor" className="text-pink-400" />
        <ellipse cx="50" cy="65" rx="10" ry="15" fill="currentColor" className="text-pink-400" />
        <ellipse cx="38" cy="65" rx="3" ry="8" fill="currentColor" className="text-pink-400" />
        <ellipse cx="62" cy="65" rx="3" ry="8" fill="currentColor" className="text-pink-400" />
        <circle cx="46" cy="38" r="2.5" fill="currentColor" className="text-pink-600" />
        <circle cx="54" cy="38" r="2.5" fill="currentColor" className="text-pink-600" />
      </svg>
    ),
    description: "Moving & hearing",
    size: "Avocado"
  },
  20: {
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <ellipse cx="50" cy="38" rx="14" ry="16" fill="currentColor" className="text-pink-400" />
        <ellipse cx="50" cy="65" rx="12" ry="20" fill="currentColor" className="text-pink-400" />
        <ellipse cx="36" cy="55" rx="4" ry="12" fill="currentColor" className="text-pink-400" />
        <ellipse cx="64" cy="55" rx="4" ry="12" fill="currentColor" className="text-pink-400" />
        <ellipse cx="38" cy="80" rx="4" ry="10" fill="currentColor" className="text-pink-400" />
        <ellipse cx="62" cy="80" rx="4" ry="10" fill="currentColor" className="text-pink-400" />
        <circle cx="46" cy="36" r="3" fill="currentColor" className="text-pink-600" />
        <circle cx="54" cy="36" r="3" fill="currentColor" className="text-pink-600" />
      </svg>
    ),
    description: "Halfway there!",
    size: "Banana"
  },
  24: {
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <ellipse cx="50" cy="35" rx="15" ry="18" fill="currentColor" className="text-pink-400" />
        <ellipse cx="50" cy="65" rx="14" ry="22" fill="currentColor" className="text-pink-400" />
        <ellipse cx="34" cy="55" rx="5" ry="14" fill="currentColor" className="text-pink-400" />
        <ellipse cx="66" cy="55" rx="5" ry="14" fill="currentColor" className="text-pink-400" />
        <ellipse cx="38" cy="85" rx="5" ry="12" fill="currentColor" className="text-pink-400" />
        <ellipse cx="62" cy="85" rx="5" ry="12" fill="currentColor" className="text-pink-400" />
        <circle cx="45" cy="33" r="3" fill="currentColor" className="text-pink-600" />
        <circle cx="55" cy="33" r="3" fill="currentColor" className="text-pink-600" />
      </svg>
    ),
    description: "Viable & growing",
    size: "Corn"
  },
  28: {
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <ellipse cx="50" cy="32" rx="16" ry="20" fill="currentColor" className="text-pink-400" />
        <ellipse cx="50" cy="65" rx="15" ry="24" fill="currentColor" className="text-pink-400" />
        <ellipse cx="32" cy="55" rx="6" ry="16" fill="currentColor" className="text-pink-400" />
        <ellipse cx="68" cy="55" rx="6" ry="16" fill="currentColor" className="text-pink-400" />
        <ellipse cx="36" cy="88" rx="6" ry="14" fill="currentColor" className="text-pink-400" />
        <ellipse cx="64" cy="88" rx="6" ry="14" fill="currentColor" className="text-pink-400" />
        <circle cx="45" cy="30" r="3.5" fill="currentColor" className="text-pink-600" />
        <circle cx="55" cy="30" r="3.5" fill="currentColor" className="text-pink-600" />
      </svg>
    ),
    description: "Opening eyes",
    size: "Eggplant"
  },
  32: {
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <ellipse cx="50" cy="30" rx="17" ry="22" fill="currentColor" className="text-pink-400" />
        <ellipse cx="50" cy="65" rx="16" ry="26" fill="currentColor" className="text-pink-400" />
        <ellipse cx="30" cy="55" rx="7" ry="18" fill="currentColor" className="text-pink-400" />
        <ellipse cx="70" cy="55" rx="7" ry="18" fill="currentColor" className="text-pink-400" />
        <ellipse cx="35" cy="90" rx="7" ry="16" fill="currentColor" className="text-pink-400" />
        <ellipse cx="65" cy="90" rx="7" ry="16" fill="currentColor" className="text-pink-400" />
        <circle cx="44" cy="28" r="4" fill="currentColor" className="text-pink-600" />
        <circle cx="56" cy="28" r="4" fill="currentColor" className="text-pink-600" />
      </svg>
    ),
    description: "Practicing breathing",
    size: "Butternut squash"
  },
  36: {
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <ellipse cx="50" cy="28" rx="18" ry="24" fill="currentColor" className="text-pink-400" />
        <ellipse cx="50" cy="68" rx="17" ry="28" fill="currentColor" className="text-pink-400" />
        <ellipse cx="28" cy="58" rx="8" ry="20" fill="currentColor" className="text-pink-400" />
        <ellipse cx="72" cy="58" rx="8" ry="20" fill="currentColor" className="text-pink-400" />
        <ellipse cx="34" cy="92" rx="8" ry="18" fill="currentColor" className="text-pink-400" />
        <ellipse cx="66" cy="92" rx="8" ry="18" fill="currentColor" className="text-pink-400" />
        <circle cx="44" cy="26" r="4" fill="currentColor" className="text-pink-600" />
        <circle cx="56" cy="26" r="4" fill="currentColor" className="text-pink-600" />
      </svg>
    ),
    description: "Almost ready",
    size: "Papaya"
  },
  40: {
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <ellipse cx="50" cy="26" rx="20" ry="26" fill="currentColor" className="text-pink-400" />
        <ellipse cx="50" cy="68" rx="18" ry="30" fill="currentColor" className="text-pink-400" />
        <ellipse cx="26" cy="58" rx="9" ry="22" fill="currentColor" className="text-pink-400" />
        <ellipse cx="74" cy="58" rx="9" ry="22" fill="currentColor" className="text-pink-400" />
        <ellipse cx="32" cy="95" rx="9" ry="20" fill="currentColor" className="text-pink-400" />
        <ellipse cx="68" cy="95" rx="9" ry="20" fill="currentColor" className="text-pink-400" />
        <circle cx="43" cy="24" r="4.5" fill="currentColor" className="text-pink-600" />
        <circle cx="57" cy="24" r="4.5" fill="currentColor" className="text-pink-600" />
        <path d="M 43 31 Q 50 34 57 31" stroke="currentColor" strokeWidth="1.5" fill="none" className="text-pink-600" />
      </svg>
    ),
    description: "Ready to meet you!",
    size: "Watermelon"
  }
};

export function PregnancyStageVisualization({ isOpen, onClose, currentWeek }: PregnancyStageVisualizationProps) {
  const [selectedWeek, setSelectedWeek] = useState(currentWeek);
  const currentDate = new Date(); // Current date - will always be up to date
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Calculate pregnancy progress
  const progressPercentage = (selectedWeek / 40) * 100;
  const circumference = 2 * Math.PI * 85;
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  // Generate calendar for current month
  const generateCalendarDays = (): (number | null)[] => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7; // Make Monday = 0
    const daysInMonth = lastDay.getDate();
    
    const days: (number | null)[] = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();
  const isToday = (day: number | null) => {
    if (!day) return false;
    return day === currentDate.getDate();
  };

  // Get closest baby visualization
  const getClosestVisualization = (week: number) => {
    const weeks = [4, 8, 12, 16, 20, 24, 28, 32, 36, 40];
    const closest = weeks.reduce((prev, curr) => 
      Math.abs(curr - week) < Math.abs(prev - week) ? curr : prev
    );
    return babyVisualizationByWeek[closest];
  };

  const visualization = getClosestVisualization(selectedWeek);

  const handleWeekChange = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && selectedWeek > 1) {
      setSelectedWeek(selectedWeek - 1);
    } else if (direction === 'next' && selectedWeek < 40) {
      setSelectedWeek(selectedWeek + 1);
    }
  };

  const handleCalendarClick = () => {
    setSelectedWeek(currentWeek);
    toast.success('Returned to current week');
  };

  const handleHeartClick = () => {
    toast.success('Baby loves you! ❤️', {
      description: `Your baby at ${selectedWeek} weeks can feel your love and hear your voice!`
    });
  };

  const handleBabyInfoClick = () => {
    const trimester = selectedWeek <= 13 ? '1st' : selectedWeek <= 27 ? '2nd' : '3rd';
    toast.info(`Week ${selectedWeek} Info`, {
      description: `You're in your ${trimester} trimester. Baby is the size of a ${visualization.size}!`
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 gap-0 rounded-3xl overflow-hidden max-h-[95vh] overflow-y-auto">
        <DialogHeader className="sr-only">
          <DialogTitle>Pregnancy Stage Visualization</DialogTitle>
          <DialogDescription>
            View your pregnancy progress and milestones with interactive calendar and week navigation
          </DialogDescription>
        </DialogHeader>
        
        {/* Header with close button - Always visible */}
        <div className="sticky top-0 z-50 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-950 dark:to-pink-950 backdrop-blur-xl p-4 border-b border-border shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Baby className="w-5 h-5 text-primary" />
              <h3 className="text-sm text-foreground">Pregnancy Journey</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="rounded-full w-8 h-8 p-0 hover:bg-white/20 dark:hover:bg-black/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Mini Calendar */}
          <Card className="p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-md">
            <div className="text-center mb-3">
              <h3 className="text-sm text-muted-foreground">{monthNames[currentMonth]}, {currentYear}</h3>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                <div key={i} className="text-center text-xs text-muted-foreground mb-1">
                  {day}
                </div>
              ))}
              {calendarDays.map((day, index) => (
                <div
                  key={index}
                  className={`aspect-square flex items-center justify-center text-xs rounded-full transition-all ${
                    day && isToday(day)
                      ? 'bg-gradient-to-br from-primary to-pink-400 text-white shadow-md scale-110'
                      : day
                      ? 'text-foreground hover:bg-primary/10'
                      : ''
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>
          </Card>

          {/* Baby Growth Visualization - Circular Progress */}
          <div className="relative flex items-center justify-center">
            <svg className="w-56 h-56 sm:w-64 sm:h-64" viewBox="0 0 200 200">
              {/* Background circle */}
              <circle
                cx="100"
                cy="100"
                r="85"
                fill="none"
                stroke="currentColor"
                strokeWidth="12"
                className="text-gray-200 dark:text-gray-700"
              />
              {/* Progress circle with gradient */}
              <circle
                cx="100"
                cy="100"
                r="85"
                fill="none"
                stroke="url(#pregnancyGradient)"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-500"
                style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
              />
              <defs>
                <linearGradient id="pregnancyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#e06b75" />
                  <stop offset="50%" stopColor="#f4a5b9" />
                  <stop offset="100%" stopColor="#c8a2c8" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Center content with baby visualization */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.div
                key={selectedWeek}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, type: "spring" }}
                className="w-20 h-20 sm:w-24 sm:h-24 mb-2"
              >
                {visualization.svg}
              </motion.div>
              <div className="text-center">
                <p className="text-2xl sm:text-3xl text-foreground">{selectedWeek}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">weeks</p>
              </div>
              <Badge variant="secondary" className="mt-2 bg-primary/20 text-primary text-xs">
                {Math.round(progressPercentage)}% Complete
              </Badge>
              <p className="text-xs text-muted-foreground mt-1 max-w-[120px] text-center">
                {visualization.description}
              </p>
            </div>
          </div>

          {/* Week Navigation */}
          <div className="flex items-center justify-center gap-3 sm:gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleWeekChange('prev')}
              disabled={selectedWeek <= 1}
              className="rounded-full w-10 h-10 p-0 shadow-md"
              title="Previous week"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <div className="flex items-center gap-2">
              <Button
                variant={selectedWeek === currentWeek ? 'default' : 'outline'}
                size="sm"
                className="rounded-full w-10 h-10 p-0 shadow-md"
                onClick={handleCalendarClick}
                title="Go to current week"
              >
                <Calendar className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full w-10 h-10 p-0 shadow-md hover:bg-pink-100 dark:hover:bg-pink-900/20"
                onClick={handleHeartClick}
                title="Send love to baby"
              >
                <Heart className="w-4 h-4 text-pink-500" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full w-10 h-10 p-0 shadow-md hover:bg-blue-100 dark:hover:bg-blue-900/20"
                onClick={handleBabyInfoClick}
                title="Baby info"
              >
                <Info className="w-4 h-4 text-blue-500" />
              </Button>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleWeekChange('next')}
              disabled={selectedWeek >= 40}
              className="rounded-full w-10 h-10 p-0 shadow-md"
              title="Next week"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Week Info */}
          <Card className="p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-md">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Trimester</span>
                <Badge variant="secondary">
                  {selectedWeek <= 13 ? '1st' : selectedWeek <= 27 ? '2nd' : '3rd'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Weeks Remaining</span>
                <span className="text-sm text-foreground">{40 - selectedWeek} weeks</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Days to Due Date</span>
                <span className="text-sm text-foreground">{(40 - selectedWeek) * 7} days</span>
              </div>
              <div className="pt-2 border-t border-border">
                <div className="flex items-start space-x-2">
                  <Sparkles className="w-4 h-4 text-primary mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Baby Size</p>
                    <p className="text-sm text-foreground">{visualization.size}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
