import React, { useState } from 'react';
import { motion } from "framer-motion";
import { useScrollToTop } from './utils/useScrollToTop';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { toast } from 'sonner@2.0.3';
import {
  ArrowLeft,
  Trophy,
  Star,
  Award,
  Flame,
  Book,
  CheckCircle,
  Lock,
  Play,
  Target,
  Zap,
  Gift,
  Crown,
  ChevronRight,
  Users,
  TrendingUp,
  Brain,
  Heart,
  Baby,
  Utensils,
  Activity,
  Sparkles
} from 'lucide-react';

interface SuperGamifiedEducationProps {
  onBack: () => void;
}

interface Module {
  id: string;
  title: string;
  category: string;
  progress: number;
  points: number;
  locked: boolean;
  lessons: Lesson[];
  icon: any;
  color: string;
}

interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  points: number;
}

interface Quiz {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  unlocked: boolean;
  date?: string;
  points: number;
}

export function SuperGamifiedEducation({ onBack }: SuperGamifiedEducationProps) {
  useScrollToTop();
  const [currentPoints, setCurrentPoints] = useState(1250);
  const [currentStreak, setCurrentStreak] = useState(7);
  const [level, setLevel] = useState(5);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [activeTab, setActiveTab] = useState<'learn' | 'achievements' | 'leaderboard'>('learn');

  const modules: Module[] = [
    {
      id: '1',
      title: 'First Trimester Essentials',
      category: 'Pregnancy Basics',
      progress: 100,
      points: 200,
      locked: false,
      icon: Heart,
      color: 'from-pink-500 to-rose-500',
      lessons: [
        { id: '1-1', title: 'Understanding Early Pregnancy', duration: '5 min', completed: true, points: 40 },
        { id: '1-2', title: 'Managing Morning Sickness', duration: '4 min', completed: true, points: 40 },
        { id: '1-3', title: 'First Prenatal Visit', duration: '6 min', completed: true, points: 40 },
        { id: '1-4', title: 'Nutrition in First Trimester', duration: '5 min', completed: true, points: 40 },
        { id: '1-5', title: 'First Trimester Quiz', duration: '3 min', completed: true, points: 40 }
      ]
    },
    {
      id: '2',
      title: 'Nutrition & Healthy Eating',
      category: 'Health & Wellness',
      progress: 75,
      points: 150,
      locked: false,
      icon: Utensils,
      color: 'from-green-500 to-emerald-500',
      lessons: [
        { id: '2-1', title: 'Essential Nutrients', duration: '5 min', completed: true, points: 30 },
        { id: '2-2', title: 'Foods to Avoid', duration: '4 min', completed: true, points: 30 },
        { id: '2-3', title: 'Meal Planning', duration: '6 min', completed: true, points: 30 },
        { id: '2-4', title: 'Hydration Guide', duration: '3 min', completed: true, points: 30 },
        { id: '2-5', title: 'Kenyan Superfoods', duration: '5 min', completed: false, points: 30 },
        { id: '2-6', title: 'Nutrition Quiz', duration: '3 min', completed: false, points: 30 }
      ]
    },
    {
      id: '3',
      title: 'Labor & Delivery Prep',
      category: 'Childbirth',
      progress: 40,
      points: 80,
      locked: false,
      icon: Activity,
      color: 'from-purple-500 to-violet-500',
      lessons: [
        { id: '3-1', title: 'Signs of Labor', duration: '5 min', completed: true, points: 25 },
        { id: '3-2', title: 'Pain Management Options', duration: '6 min', completed: true, points: 25 },
        { id: '3-3', title: 'Breathing Techniques', duration: '4 min', completed: true, points: 25 },
        { id: '3-4', title: 'Stages of Labor', duration: '7 min', completed: false, points: 25 },
        { id: '3-5', title: 'When to Go to Hospital', duration: '4 min', completed: false, points: 25 },
        { id: '3-6', title: 'C-Section Recovery', duration: '5 min', completed: false, points: 25 },
        { id: '3-7', title: 'Partner Support', duration: '4 min', completed: false, points: 25 },
        { id: '3-8', title: 'Labor & Delivery Quiz', duration: '3 min', completed: false, points: 25 }
      ]
    },
    {
      id: '4',
      title: 'Newborn Care',
      category: 'Postpartum',
      progress: 0,
      points: 0,
      locked: true,
      icon: Baby,
      color: 'from-blue-500 to-cyan-500',
      lessons: [
        { id: '4-1', title: 'First Days with Baby', duration: '6 min', completed: false, points: 20 },
        { id: '4-2', title: 'Breastfeeding Basics', duration: '7 min', completed: false, points: 20 },
        { id: '4-3', title: 'Diapering 101', duration: '4 min', completed: false, points: 20 },
        { id: '4-4', title: 'Baby Sleep Patterns', duration: '5 min', completed: false, points: 20 },
        { id: '4-5', title: 'Bathing Your Baby', duration: '5 min', completed: false, points: 20 },
        { id: '4-6', title: 'Recognizing Illness', duration: '6 min', completed: false, points: 20 },
        { id: '4-7', title: 'Bonding with Baby', duration: '4 min', completed: false, points: 20 },
        { id: '4-8', title: 'Postpartum Self-Care', duration: '5 min', completed: false, points: 20 },
        { id: '4-9', title: 'Vaccination Schedule', duration: '4 min', completed: false, points: 20 },
        { id: '4-10', title: 'Newborn Care Quiz', duration: '3 min', completed: false, points: 20 }
      ]
    }
  ];

  const quizzes: Quiz[] = [
    {
      question: 'What is the most important nutrient for fetal brain development?',
      options: ['Folic Acid', 'Iron', 'Calcium', 'Vitamin D'],
      correctAnswer: 0,
      explanation: 'Folic acid is crucial for preventing neural tube defects and supporting brain development in the first trimester.'
    },
    {
      question: 'How much water should a pregnant woman drink daily?',
      options: ['4 glasses', '6 glasses', '8-10 glasses', '12 glasses'],
      correctAnswer: 2,
      explanation: '8-10 glasses (about 2-2.5 liters) of water daily helps maintain amniotic fluid levels and prevents dehydration.'
    },
    {
      question: 'Which food is rich in iron and safe during pregnancy?',
      options: ['Raw fish', 'Sukuma wiki (kale)', 'Unpasteurized cheese', 'Raw eggs'],
      correctAnswer: 1,
      explanation: 'Sukuma wiki is an excellent source of iron and other nutrients. Always cook vegetables thoroughly during pregnancy.'
    },
    {
      question: 'When should you start feeling baby movements?',
      options: ['Week 8-10', 'Week 12-14', 'Week 16-25', 'Week 30-32'],
      correctAnswer: 2,
      explanation: 'Most women feel baby movements (quickening) between weeks 16-25, though first-time moms may notice it later.'
    },
    {
      question: 'What is a normal contraction pattern for active labor?',
      options: ['Every 10-15 mins', 'Every 5-10 mins', 'Every 3-5 mins', 'Every minute'],
      correctAnswer: 2,
      explanation: 'In active labor, contractions typically occur every 3-5 minutes, lasting 45-60 seconds each.'
    }
  ];

  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'First Steps',
      description: 'Complete your first lesson',
      icon: Star,
      unlocked: true,
      date: 'Oct 10, 2025',
      points: 50
    },
    {
      id: '2',
      title: 'Week Warrior',
      description: 'Maintain 7-day learning streak',
      icon: Flame,
      unlocked: true,
      date: 'Oct 16, 2025',
      points: 100
    },
    {
      id: '3',
      title: 'Module Master',
      description: 'Complete an entire module',
      icon: Award,
      unlocked: true,
      date: 'Oct 14, 2025',
      points: 200
    },
    {
      id: '4',
      title: 'Quiz Champion',
      description: 'Score 100% on a quiz',
      icon: Trophy,
      unlocked: false,
      points: 150
    },
    {
      id: '5',
      title: 'Knowledge Seeker',
      description: 'Earn 1000 points',
      icon: Brain,
      unlocked: true,
      date: 'Oct 15, 2025',
      points: 250
    },
    {
      id: '6',
      title: 'Community Leader',
      description: 'Help 5 other mothers',
      icon: Users,
      unlocked: false,
      points: 300
    }
  ];

  const leaderboard = [
    { rank: 1, name: 'Akinyi Atieno', points: 2450, avatar: '👑' },
    { rank: 2, name: 'You', points: 1250, avatar: '🌟', isCurrentUser: true },
    { rank: 3, name: 'Njeri Wanjiku', points: 1180, avatar: '⭐' },
    { rank: 4, name: 'Awino Adhiambo', points: 1050, avatar: '💫' },
    { rank: 5, name: 'Chebet Chepkoech', points: 980, avatar: '✨' }
  ];

  const handleStartLesson = (lesson: Lesson) => {
    if (lesson.completed) {
      toast.info('You\'ve already completed this lesson!');
      return;
    }
    
    setSelectedLesson(lesson);
    
    // Simulate lesson completion
    setTimeout(() => {
      if (lesson.title.includes('Quiz')) {
        setShowQuiz(true);
        setSelectedLesson(null);
      } else {
        completeLesson(lesson);
      }
    }, 1000);
  };

  const completeLesson = (lesson: Lesson) => {
    const pointsEarned = lesson.points;
    setCurrentPoints(prev => prev + pointsEarned);
    
    toast.success(`Lesson completed! +${pointsEarned} points`, {
      description: 'Keep up the great work!'
    });
    
    setSelectedLesson(null);
  };

  const handleQuizAnswer = (answerIndex: number) => {
    const currentQuiz = quizzes[currentQuizIndex];
    
    if (answerIndex === currentQuiz.correctAnswer) {
      setQuizScore(prev => prev + 1);
      toast.success('Correct! 🎉', {
        description: currentQuiz.explanation
      });
    } else {
      toast.error('Not quite right', {
        description: currentQuiz.explanation
      });
    }

    if (currentQuizIndex < quizzes.length - 1) {
      setTimeout(() => setCurrentQuizIndex(prev => prev + 1), 2000);
    } else {
      setTimeout(() => {
        setShowResults(true);
        const pointsEarned = quizScore * 20;
        setCurrentPoints(prev => prev + pointsEarned);
      }, 2000);
    }
  };

  const resetQuiz = () => {
    setShowQuiz(false);
    setCurrentQuizIndex(0);
    setQuizScore(0);
    setShowResults(false);
  };

  const getLevelProgress = () => {
    const pointsForNextLevel = level * 300;
    const currentLevelPoints = currentPoints % 300;
    return (currentLevelPoints / pointsForNextLevel) * 100;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-background pb-20"
    >
      {/* Header */}
      <div className="sticky top-0 z-40 bg-gradient-to-r from-pink-500/10 to-purple-500/10 backdrop-blur-md border-b border-border shadow-sm">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-lg">Learn & Earn</h1>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-100">
              <Trophy className="w-3 h-3 mr-1" />
              {currentPoints}
            </Badge>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="px-4 pb-4">
          <div className="grid grid-cols-3 gap-3">
            <Card className="border-none bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
              <CardContent className="p-3 text-center">
                <div className="flex items-center justify-center mb-1">
                  <Crown className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <p className="text-xl">Level {level}</p>
                <p className="text-xs text-muted-foreground">Current Level</p>
                <Progress value={getLevelProgress()} className="h-1 mt-2" />
              </CardContent>
            </Card>

            <Card className="border-none bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20">
              <CardContent className="p-3 text-center">
                <div className="flex items-center justify-center mb-1">
                  <Flame className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <p className="text-xl">{currentStreak}</p>
                <p className="text-xs text-muted-foreground">Day Streak</p>
              </CardContent>
            </Card>

            <Card className="border-none bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
              <CardContent className="p-3 text-center">
                <div className="flex items-center justify-center mb-1">
                  <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <p className="text-xl">{achievements.filter(a => a.unlocked).length}</p>
                <p className="text-xs text-muted-foreground">Achievements</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-t border-border">
          {[
            { id: 'learn', label: 'Learn', icon: Book },
            { id: 'achievements', label: 'Achievements', icon: Award },
            { id: 'leaderboard', label: 'Leaderboard', icon: TrendingUp }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 text-sm transition-all ${
                activeTab === tab.id
                  ? 'text-primary border-b-2 border-primary bg-primary/5'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Learn Tab */}
        {activeTab === 'learn' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {modules.map((module, index) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`border-2 ${module.locked ? 'opacity-50' : 'hover:shadow-lg transition-shadow'}`}>
                  <CardHeader className={`bg-gradient-to-r ${module.color} text-white rounded-t-lg`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                          <module.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <CardTitle className="text-white text-base">{module.title}</CardTitle>
                          <p className="text-xs text-white/80">{module.category}</p>
                        </div>
                      </div>
                      {module.locked ? (
                        <Lock className="w-5 h-5" />
                      ) : (
                        <Badge variant="secondary" className="bg-white/20 text-white border-0">
                          {module.points} pts
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="text-primary">{module.progress}%</span>
                      </div>
                      <Progress value={module.progress} className="h-2" />
                    </div>

                    {!module.locked && (
                      <div className="space-y-2">
                        {module.lessons.slice(0, 3).map((lesson) => (
                          <button
                            key={lesson.id}
                            onClick={() => handleStartLesson(lesson)}
                            className="w-full flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent transition-all"
                          >
                            <div className="flex items-center space-x-3">
                              {lesson.completed ? (
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              ) : (
                                <Play className="w-5 h-5 text-primary" />
                              )}
                              <div className="text-left">
                                <p className="text-sm">{lesson.title}</p>
                                <p className="text-xs text-muted-foreground">{lesson.duration}</p>
                              </div>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {lesson.points} pts
                            </Badge>
                          </button>
                        ))}
                        
                        {module.lessons.length > 3 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full"
                            onClick={() => setSelectedModule(module)}
                          >
                            View all {module.lessons.length} lessons
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        )}
                      </div>
                    )}

                    {module.locked && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Complete previous modules to unlock
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 gap-3"
          >
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={`${achievement.unlocked ? 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-900' : 'opacity-50'}`}>
                  <CardContent className="p-4 text-center space-y-2">
                    <div className={`p-3 rounded-full ${achievement.unlocked ? 'bg-amber-500' : 'bg-gray-300'} inline-block`}>
                      <achievement.icon className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-sm">{achievement.title}</h4>
                    <p className="text-xs text-muted-foreground">{achievement.description}</p>
                    {achievement.unlocked && achievement.date && (
                      <p className="text-xs text-amber-600 dark:text-amber-400">{achievement.date}</p>
                    )}
                    <Badge variant="secondary" className="text-xs">
                      {achievement.points} pts
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            {leaderboard.map((user, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={`${user.isCurrentUser ? 'border-primary border-2 bg-primary/5' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className={`text-2xl ${user.rank === 1 ? 'text-4xl' : ''}`}>
                        {user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : user.rank === 3 ? '🥉' : user.rank}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <p className={user.isCurrentUser ? 'text-primary' : ''}>{user.name}</p>
                          {user.isCurrentUser && <Badge variant="secondary">You</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">{user.points} points</p>
                      </div>
                      <div className="text-2xl">{user.avatar}</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-900">
              <CardContent className="p-4 text-center">
                <Sparkles className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                <h4 className="mb-2">Keep Learning!</h4>
                <p className="text-sm text-muted-foreground">
                  Complete more lessons to climb the leaderboard and earn rewards!
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Quiz Dialog */}
      <Dialog open={showQuiz} onOpenChange={setShowQuiz}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {showResults ? 'Quiz Complete!' : `Question ${currentQuizIndex + 1} of ${quizzes.length}`}
            </DialogTitle>
          </DialogHeader>
          
          {showResults ? (
            <div className="space-y-4 text-center py-6">
              <div className="text-6xl mb-4">
                {quizScore === quizzes.length ? '🎉' : quizScore >= quizzes.length * 0.7 ? '👏' : '💪'}
              </div>
              <h3 className="text-2xl">Score: {quizScore}/{quizzes.length}</h3>
              <p className="text-muted-foreground">
                {quizScore === quizzes.length && 'Perfect score! Amazing work!'}
                {quizScore >= quizzes.length * 0.7 && quizScore < quizzes.length && 'Great job! Keep learning!'}
                {quizScore < quizzes.length * 0.7 && 'Good effort! Try again to improve!'}
              </p>
              <div className="flex space-x-2">
                <Button onClick={resetQuiz} className="flex-1">
                  Try Again
                </Button>
                <Button onClick={() => { resetQuiz(); }} variant="outline" className="flex-1">
                  Close
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-accent rounded-lg">
                <p className="text-center">{quizzes[currentQuizIndex].question}</p>
              </div>
              
              <div className="space-y-2">
                {quizzes[currentQuizIndex].options.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-3"
                    onClick={() => handleQuizAnswer(index)}
                  >
                    <span className="mr-2 font-bold">{String.fromCharCode(65 + index)}.</span>
                    {option}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Module Detail Dialog */}
      <Dialog open={!!selectedModule} onOpenChange={() => setSelectedModule(null)}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          {selectedModule && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <selectedModule.icon className="w-5 h-5" />
                  <span>{selectedModule.title}</span>
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-3">
                {selectedModule.lessons.map((lesson) => (
                  <button
                    key={lesson.id}
                    onClick={() => {
                      setSelectedModule(null);
                      handleStartLesson(lesson);
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      {lesson.completed ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <Play className="w-5 h-5 text-primary" />
                      )}
                      <div className="text-left">
                        <p className="text-sm">{lesson.title}</p>
                        <p className="text-xs text-muted-foreground">{lesson.duration}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {lesson.points} pts
                    </Badge>
                  </button>
                ))}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Lesson Loading Dialog */}
      <Dialog open={!!selectedLesson} onOpenChange={() => setSelectedLesson(null)}>
        <DialogContent className="max-w-sm">
          <div className="text-center space-y-4 py-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="inline-block"
            >
              <Zap className="w-12 h-12 text-primary" />
            </motion.div>
            <h3>Loading Lesson...</h3>
            <p className="text-sm text-muted-foreground">{selectedLesson?.title}</p>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
