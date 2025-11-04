import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Trophy, Star, Award, Flame, Book, CheckCircle, Lock, Play } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';

interface GamifiedEducationProps {
  onBack: () => void;
}

interface Module {
  id: string;
  title: string;
  category: string;
  progress: number;
  points: number;
  locked: boolean;
  lessons: number;
  completed: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  unlocked: boolean;
  date?: string;
}

export function GamifiedEducation({ onBack }: GamifiedEducationProps) {
  const [currentPoints, setCurrentPoints] = useState(1250);
  const [currentStreak, setCurrentStreak] = useState(7);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);

  const modules: Module[] = [
    {
      id: '1',
      title: 'First Trimester Essentials',
      category: 'Pregnancy Basics',
      progress: 100,
      points: 200,
      locked: false,
      lessons: 5,
      completed: 5
    },
    {
      id: '2',
      title: 'Nutrition & Diet',
      category: 'Health & Wellness',
      progress: 75,
      points: 150,
      locked: false,
      lessons: 6,
      completed: 4
    },
    {
      id: '3',
      title: 'Labor & Delivery',
      category: 'Childbirth',
      progress: 40,
      points: 80,
      locked: false,
      lessons: 8,
      completed: 3
    },
    {
      id: '4',
      title: 'Newborn Care',
      category: 'Postpartum',
      progress: 0,
      points: 0,
      locked: true,
      lessons: 10,
      completed: 0
    }
  ];

  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'Quick Learner',
      description: 'Complete your first module',
      icon: Star,
      unlocked: true,
      date: 'Oct 10, 2025'
    },
    {
      id: '2',
      title: 'Week Warrior',
      description: 'Maintain 7-day learning streak',
      icon: Flame,
      unlocked: true,
      date: 'Oct 16, 2025'
    },
    {
      id: '3',
      title: 'Knowledge Seeker',
      description: 'Earn 1000 points',
      icon: Trophy,
      unlocked: true,
      date: 'Oct 15, 2025'
    },
    {
      id: '4',
      title: 'Master Student',
      description: 'Complete all modules',
      icon: Award,
      unlocked: false
    }
  ];

  const leaderboard = [
    { rank: 1, name: 'Akinyi Odhiambo', points: 2450, avatar: 'AO' },
    { rank: 2, name: 'You', points: 1250, avatar: 'ME', isCurrentUser: true },
    { rank: 3, name: 'Awino Otieno', points: 1180, avatar: 'AO' },
    { rank: 4, name: 'Adhiambo Omondi', points: 980, avatar: 'AO' },
    { rank: 5, name: 'Atieno Okoth', points: 870, avatar: 'AO' }
  ];

  const quizQuestions = [
    {
      question: 'What is the recommended daily water intake during pregnancy?',
      options: ['4 glasses', '6 glasses', '8-10 glasses', '12 glasses'],
      correct: 2
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky-header">
        <div className="flex items-center gap-4 p-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl text-foreground">Learn & Earn</h1>
            <p className="text-sm text-muted-foreground">Gamified education</p>
          </div>
          <Book className="w-6 h-6 text-primary" />
        </div>
      </div>

      <div className="pt-20 p-4 space-y-6">
        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-3 gap-3"
        >
          <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10">
            <CardContent className="p-4 text-center">
              <Trophy className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl mb-1">{currentPoints}</div>
              <p className="text-xs text-muted-foreground">Points</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500/10 to-red-600/10">
            <CardContent className="p-4 text-center">
              <Flame className="w-6 h-6 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl mb-1">{currentStreak}</div>
              <p className="text-xs text-muted-foreground">Day Streak</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10">
            <CardContent className="p-4 text-center">
              <Award className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl mb-1">3</div>
              <p className="text-xs text-muted-foreground">Badges</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Learning Modules */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <h2 className="mb-4">Learning Paths</h2>
          <div className="space-y-3">
            {modules.map((module, index) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className={`${module.locked ? 'opacity-60' : 'hover:shadow-md cursor-pointer'} transition-all`}
                  onClick={() => !module.locked && setSelectedModule(module)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3>{module.title}</h3>
                          {module.locked && <Lock className="w-4 h-4 text-muted-foreground" />}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {module.category}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-yellow-600">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-sm">{module.points}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{module.completed}/{module.lessons} lessons</span>
                        <span>{module.progress}%</span>
                      </div>
                      <Progress value={module.progress} className="h-2" />
                    </div>

                    {!module.locked && module.progress < 100 && (
                      <Button className="w-full mt-3" size="sm">
                        <Play className="w-4 h-4 mr-2" />
                        Continue Learning
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <h2 className="mb-4">Achievements</h2>
          <div className="grid grid-cols-2 gap-3">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className={`${achievement.unlocked ? 'bg-primary/5' : 'opacity-60'}`}>
                  <CardContent className="p-4 text-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                      achievement.unlocked ? 'bg-yellow-100 dark:bg-yellow-900/20' : 'bg-muted'
                    }`}>
                      <achievement.icon className={`w-6 h-6 ${
                        achievement.unlocked ? 'text-yellow-600' : 'text-muted-foreground'
                      }`} />
                    </div>
                    <h4 className="text-sm mb-1">{achievement.title}</h4>
                    <p className="text-xs text-muted-foreground">{achievement.description}</p>
                    {achievement.unlocked && achievement.date && (
                      <p className="text-xs text-primary mt-2">{achievement.date}</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                Community Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {leaderboard.map((user, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    user.isCurrentUser ? 'bg-primary/10' : 'bg-muted/30'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    index === 0 ? 'bg-yellow-500 text-white' :
                    index === 1 ? 'bg-gray-400 text-white' :
                    index === 2 ? 'bg-orange-600 text-white' :
                    'bg-primary/20 text-primary'
                  }`}>
                    {user.rank}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{user.name}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Star className="w-3 h-3 fill-current text-yellow-600" />
                      <span>{user.points} points</span>
                    </div>
                  </div>
                  {user.isCurrentUser && (
                    <Badge variant="outline">You</Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Daily Challenge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-primary/10 to-secondary/10">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-1">Daily Challenge</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Complete today's quiz to earn 50 bonus points!
                  </p>
                  <Button size="sm" onClick={() => setShowQuiz(true)}>
                    Take Quiz
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quiz Dialog */}
      <Dialog open={showQuiz} onOpenChange={setShowQuiz}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Daily Quiz Challenge</DialogTitle>
            <DialogDescription>
              Answer correctly to earn 50 points!
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <p className="text-sm">{quizQuestions[0].question}</p>
            <div className="space-y-2">
              {quizQuestions[0].options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    if (index === quizQuestions[0].correct) {
                      setCurrentPoints(currentPoints + 50);
                      setShowQuiz(false);
                    }
                  }}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
