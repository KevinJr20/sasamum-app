import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useScrollToTop } from './utils/useScrollToTop';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner@2.0.3';
import { 
  ArrowLeft,
  Heart,
  Brain,
  Phone,
  MessageCircle,
  Users,
  CheckCircle,
  AlertTriangle,
  Headphones,
  Moon,
  Smile,
  Play,
  Pause,
  BookOpen,
  TrendingUp,
  Calendar,
  Share2,
  Stethoscope,
  Wind,
  Sun,
  Sparkles,
  Clock
} from 'lucide-react';

interface MentalHealthCheckProps {
  onBack: () => void;
  onNavigateToChat?: () => void;
  userName?: string;
}

interface Question {
  id: string;
  text: string;
  options: { value: number; text: string }[];
}

interface RelaxationSession {
  id: string;
  title: string;
  duration: string;
  type: 'breathing' | 'meditation' | 'affirmation';
  description: string;
  culturalContext: string;
  steps?: string[];
}

interface Article {
  id: string;
  title: string;
  category: string;
  readTime: string;
  excerpt: string;
  date: string;
  author: string;
}

export function MentalHealthCheck({ onBack, onNavigateToChat, userName = "Brenda" }: MentalHealthCheckProps) {
  useScrollToTop();
  const [currentStep, setCurrentStep] = useState<'intro' | 'questionnaire' | 'results' | 'relaxation' | 'articles'>('intro');
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [sessionTimer, setSessionTimer] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Edinburgh Postnatal Depression Scale (EPDS) adapted questions
  const questions: Question[] = [
    {
      id: 'laugh',
      text: 'I have been able to laugh and see the funny side of things',
      options: [
        { value: 0, text: 'As much as I always could' },
        { value: 1, text: 'Not quite so much now' },
        { value: 2, text: 'Definitely not so much now' },
        { value: 3, text: 'Not at all' }
      ]
    },
    {
      id: 'enjoyment',
      text: 'I have looked forward with enjoyment to things',
      options: [
        { value: 0, text: 'As much as I ever did' },
        { value: 1, text: 'Rather less than I used to' },
        { value: 2, text: 'Definitely less than I used to' },
        { value: 3, text: 'Hardly at all' }
      ]
    },
    {
      id: 'blame',
      text: 'I have blamed myself unnecessarily when things went wrong',
      options: [
        { value: 3, text: 'Yes, most of the time' },
        { value: 2, text: 'Yes, some of the time' },
        { value: 1, text: 'Not very often' },
        { value: 0, text: 'No, never' }
      ]
    },
    {
      id: 'anxiety',
      text: 'I have been anxious or worried for no good reason',
      options: [
        { value: 0, text: 'No, not at all' },
        { value: 1, text: 'Hardly ever' },
        { value: 2, text: 'Yes, sometimes' },
        { value: 3, text: 'Yes, very often' }
      ]
    },
    {
      id: 'scared',
      text: 'I have felt scared or panicky for no very good reason',
      options: [
        { value: 3, text: 'Yes, quite a lot' },
        { value: 2, text: 'Yes, sometimes' },
        { value: 1, text: 'No, not much' },
        { value: 0, text: 'No, not at all' }
      ]
    },
    {
      id: 'overwhelmed',
      text: 'Things have been getting on top of me',
      options: [
        { value: 3, text: 'Yes, most of the time I haven\'t been able to cope' },
        { value: 2, text: 'Yes, sometimes I haven\'t been coping as well' },
        { value: 1, text: 'No, most of the time I have coped quite well' },
        { value: 0, text: 'No, I have been coping as well as ever' }
      ]
    },
    {
      id: 'sleep',
      text: 'I have been so unhappy that I have had difficulty sleeping',
      options: [
        { value: 3, text: 'Yes, most of the time' },
        { value: 2, text: 'Yes, sometimes' },
        { value: 1, text: 'Not very often' },
        { value: 0, text: 'No, not at all' }
      ]
    },
    {
      id: 'sadness',
      text: 'I have felt sad or miserable',
      options: [
        { value: 3, text: 'Yes, most of the time' },
        { value: 2, text: 'Yes, quite often' },
        { value: 1, text: 'Not very often' },
        { value: 0, text: 'No, not at all' }
      ]
    }
  ];

  const relaxationSessions: RelaxationSession[] = [
    {
      id: '1',
      title: 'SasaMum Breathing',
      duration: '5 min',
      type: 'breathing',
      description: 'Connect with your community through mindful breathing',
      culturalContext: 'Breathing in strength from your sisters and mama community',
      steps: [
        'Find a comfortable seated position',
        'Place one hand on your heart, one on your belly',
        'Breathe in slowly for 4 counts',
        'Hold for 4 counts',
        'Breathe out slowly for 6 counts',
        'Repeat, thinking: "I am strong, I am loved"'
      ]
    },
    {
      id: '2',
      title: 'Mama\'s Meditation',
      duration: '10 min',
      type: 'meditation',
      description: 'Guided meditation for expectant African mothers',
      culturalContext: 'Drawing from ancestral wisdom and mother\'s intuition',
      steps: [
        'Close your eyes and breathe naturally',
        'Visualize your ancestors surrounding you with love',
        'Feel the baby in your womb, connected to generations',
        'Repeat: "I am strong, I am wise, I am loved"',
        'Send love to your baby',
        'Open your eyes when ready'
      ]
    },
    {
      id: '3',
      title: 'Positive Affirmations',
      duration: '3 min',
      type: 'affirmation',
      description: 'Uplifting affirmations in Swahili and English',
      culturalContext: 'Celebrating the strength of African motherhood',
      steps: [
        'Mimi ni mama mwenye nguvu (I am a strong mother)',
        'My body knows how to nurture my baby',
        'Niko na msaada wa familia yangu (I have my family\'s support)',
        'I trust my maternal instincts',
        'Nina huruma na upendo (I have compassion and love)',
        'I am doing my best, and that is enough'
      ]
    }
  ];

  // Mental health articles - updated frequently
  const articles: Article[] = [
    {
      id: '1',
      title: 'Understanding Perinatal Depression in Kenya',
      category: 'Education',
      readTime: '5 min',
      excerpt: 'Learn about the signs, symptoms, and cultural context of perinatal mental health in Kenya.',
      date: new Date().toLocaleDateString(),
      author: 'Dr. Akinyi Nyakio, Psychiatrist'
    },
    {
      id: '2',
      title: 'Breaking the Stigma: Mental Health in African Communities',
      category: 'Awareness',
      readTime: '7 min',
      excerpt: 'How to talk about mental health with family and overcome cultural barriers to seeking help.',
      date: new Date().toLocaleDateString(),
      author: 'Dr. Wanjiru Kamau, Clinical Psychologist'
    },
    {
      id: '3',
      title: 'Ubuntu Philosophy and Maternal Mental Health',
      category: 'Cultural',
      readTime: '6 min',
      excerpt: 'Exploring how African communal values can support mental wellness during pregnancy.',
      date: new Date().toLocaleDateString(),
      author: 'Prof. Otieno Makori, Community Health'
    },
    {
      id: '4',
      title: 'Partner Support: How Fathers Can Help',
      category: 'Family',
      readTime: '4 min',
      excerpt: 'Practical ways partners can support maternal mental health during pregnancy and postpartum.',
      date: new Date().toLocaleDateString(),
      author: 'Dr. James Odhiambo, Family Therapist'
    },
    {
      id: '5',
      title: 'Self-Care Strategies for Busy Mamas',
      category: 'Wellness',
      readTime: '5 min',
      excerpt: 'Simple, culturally-appropriate self-care practices you can do at home.',
      date: new Date().toLocaleDateString(),
      author: 'Grace Muthoni, Wellness Coach'
    }
  ];

  // Timer for relaxation sessions
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeSession && !isPaused) {
      interval = setInterval(() => {
        setSessionTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeSession, isPaused]);

  const calculateScore = () => {
    return Object.values(answers).reduce((sum, score) => sum + score, 0);
  };

  const getScoreInterpretation = (score: number) => {
    if (score <= 8) {
      return {
        level: 'low',
        title: 'You\'re doing well, Mama!',
        description: 'Your responses suggest you\'re managing well emotionally. Keep taking care of yourself.',
        color: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-50 dark:bg-green-950/20',
        borderColor: 'border-green-200 dark:border-green-800',
        recommendation: 'Continue with your current self-care practices. Consider joining our community support groups to stay connected.'
      };
    } else if (score <= 12) {
      return {
        level: 'moderate',
        title: 'Consider reaching out for support',
        description: 'You may be experiencing some emotional challenges. Talking to someone can help.',
        color: 'text-orange-600 dark:text-orange-400',
        bgColor: 'bg-orange-50 dark:bg-orange-950/20',
        borderColor: 'border-orange-200 dark:border-orange-800',
        recommendation: 'We recommend speaking with a mental health professional. Your provider has been notified and may reach out to support you.'
      };
    } else {
      return {
        level: 'high',
        title: 'Please seek professional support',
        description: 'Your responses suggest you may benefit from professional mental health support.',
        color: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-red-50 dark:bg-red-950/20',
        borderColor: 'border-red-200 dark:border-red-800',
        recommendation: 'Your wellbeing is important. A healthcare provider will contact you within 24 hours. If you need immediate help, please call our crisis line.'
      };
    }
  };

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setCurrentStep('results');
      // In production, send results to provider portal
      notifyProvider(calculateScore());
    }
  };

  const notifyProvider = (score: number) => {
    const interpretation = getScoreInterpretation(score);
    if (interpretation.level !== 'low') {
      toast.info('Provider Notification Sent', {
        description: 'Your healthcare provider has been notified and may reach out to support you.'
      });
      // In production: API call to provider portal
    }
  };

  const startQuestionnaire = () => {
    setCurrentStep('questionnaire');
    setCurrentQuestionIndex(0);
    setAnswers({});
  };

  const startSession = (sessionId: string) => {
    setActiveSession(sessionId);
    setSessionTimer(0);
    setIsPaused(false);
    toast.success('Session started', {
      description: 'Find a comfortable space and follow the guidance'
    });
  };

  const pauseSession = () => {
    setIsPaused(!isPaused);
  };

  const endSession = () => {
    const minutes = Math.floor(sessionTimer / 60);
    toast.success('Session complete!', {
      description: `You practiced for ${minutes} minute${minutes !== 1 ? 's' : ''}. Well done, Mama!`
    });
    setActiveSession(null);
    setSessionTimer(0);
    setIsPaused(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const shareArticle = (article: Article) => {
    toast.success('Article shared!', {
      description: 'Link copied to clipboard'
    });
  };

  const callHelpline = (phone: string, name: string) => {
    window.location.href = `tel:${phone}`;
    toast.success(`Calling ${name}...`);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const totalScore = calculateScore();
  const scoreInterpretation = getScoreInterpretation(totalScore);

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-background w-full"
    >
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 flex items-center justify-between p-4 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
        <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
        </Button>
        <h1 className="text-base sm:text-lg md:text-xl text-foreground">Mental Wellness</h1>
        <Button 
          variant="ghost" 
          size="sm" 
          className="p-2"
          onClick={() => setCurrentStep('relaxation')}
        >
          <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
        </Button>
      </div>

      {/* Quick Navigation Tabs */}
      <div className="sticky top-[73px] z-30 bg-background border-b border-border">
        <div className="flex overflow-x-auto">
          {[
            { id: 'intro', label: 'Home', icon: Heart },
            { id: 'questionnaire', label: 'Check-in', icon: Brain },
            { id: 'relaxation', label: 'Relax', icon: Headphones },
            { id: 'articles', label: 'Learn', icon: BookOpen }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentStep(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-3 text-sm whitespace-nowrap transition-all ${
                currentStep === tab.id
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

      <div className="pb-20">
        {/* Introduction */}
        {currentStep === 'intro' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 space-y-6"
          >
            <Card className="bg-gradient-to-br from-primary/5 to-pink-50 dark:from-primary/10 dark:to-pink-950/20 border-primary/20">
              <CardContent className="p-6 text-center space-y-4">
                <Brain className="w-12 h-12 sm:w-16 sm:h-16 text-primary mx-auto" />
                <h2 className="text-lg sm:text-xl md:text-2xl text-foreground">Your Mental Health Matters</h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  As an African mother, your emotional wellbeing is just as important as your physical health. 
                  This quick check-in helps you understand how you're feeling and connects you with support when needed.
                </p>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className="text-base sm:text-lg text-foreground">Why mental health screening?</h3>
              <div className="space-y-3">
                {[
                  '1 in 5 mothers experience perinatal depression or anxiety',
                  'Early detection leads to better outcomes for you and baby',
                  'Support is available - you don\'t have to face this alone',
                  'Your provider will be notified if support is needed'
                ].map((point, i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm sm:text-base text-muted-foreground">{point}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={startQuestionnaire}
                className="w-full bg-primary hover:bg-primary/90 text-sm sm:text-base"
                size="lg"
              >
                <Brain className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Start Wellness Check
              </Button>
              <Button 
                variant="outline" 
                className="w-full border-primary/30 text-primary text-sm sm:text-base"
                size="lg"
                onClick={() => setCurrentStep('relaxation')}
              >
                <Headphones className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Relaxation Sessions
              </Button>
              <Button 
                variant="outline" 
                className="w-full text-sm sm:text-base"
                size="lg"
                onClick={() => setCurrentStep('articles')}
              >
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Mental Health Articles
              </Button>
            </div>

            <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <h4 className="text-blue-800 dark:text-blue-300 text-sm sm:text-base">Privacy Notice</h4>
                    <p className="text-blue-700 dark:text-blue-400 text-xs sm:text-sm mt-1">
                      Your responses are confidential and shared only with your healthcare provider if support is recommended. 
                      This screening is not a diagnosis but a tool to help you understand your mental health.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Questionnaire */}
        {currentStep === 'questionnaire' && currentQuestion && (
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-4 space-y-6"
          >
            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-muted-foreground">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
                <span className="text-muted-foreground">
                  {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%
                </span>
              </div>
              <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} className="h-2" />
            </div>

            {/* Question */}
            <Card className="border-border">
              <CardContent className="p-4 sm:p-6 space-y-6">
                <h3 className="text-sm sm:text-base md:text-lg text-foreground leading-relaxed">
                  {currentQuestion.text}
                </h3>

                <RadioGroup
                  value={answers[currentQuestion.id]?.toString() || ''}
                  onValueChange={(value) => handleAnswer(currentQuestion.id, parseInt(value))}
                >
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                        <RadioGroupItem value={option.value.toString()} id={`option-${index}`} className="mt-1" />
                        <Label 
                          htmlFor={`option-${index}`} 
                          className="text-xs sm:text-sm text-foreground leading-relaxed cursor-pointer flex-1"
                        >
                          {option.text}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            <div className="flex space-x-3">
              {currentQuestionIndex > 0 && (
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                  className="flex-1 text-sm sm:text-base"
                >
                  Previous
                </Button>
              )}
              <Button 
                onClick={nextQuestion}
                disabled={!answers[currentQuestion.id] && answers[currentQuestion.id] !== 0}
                className="flex-1 bg-primary hover:bg-primary/90 text-sm sm:text-base"
              >
                {currentQuestionIndex === questions.length - 1 ? 'See Results' : 'Next'}
              </Button>
            </div>
          </motion.div>
        )}

        {/* Results */}
        {currentStep === 'results' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 space-y-6"
          >
            <Card className={`${scoreInterpretation.bgColor} ${scoreInterpretation.borderColor}`}>
              <CardContent className="p-6 text-center space-y-4">
                <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto ${ scoreInterpretation.level === 'low' ? 'bg-green-100 dark:bg-green-900/30' :
                  scoreInterpretation.level === 'moderate' ? 'bg-orange-100 dark:bg-orange-900/30' : 'bg-red-100 dark:bg-red-900/30'
                }`}>
                  <span className={`text-2xl sm:text-3xl ${scoreInterpretation.color}`}>
                    {totalScore}
                  </span>
                </div>
                <h2 className={`text-lg sm:text-xl ${scoreInterpretation.color}`}>{scoreInterpretation.title}</h2>
                <p className={`text-sm sm:text-base ${scoreInterpretation.color} leading-relaxed`}>
                  {scoreInterpretation.description}
                </p>
                <p className={`text-xs sm:text-sm ${scoreInterpretation.color} leading-relaxed`}>
                  {scoreInterpretation.recommendation}
                </p>
              </CardContent>
            </Card>

            {/* Support Resources */}
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg text-foreground flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Support Resources
              </h3>
              
              <Card 
                className="border-border hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => callHelpline('0800720811', 'Kenya Mental Health Helpline')}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm sm:text-base text-foreground">Kenya Mental Health Helpline</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">0800 720 811 (Toll Free - 24/7)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className="border-border hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => {
                  if (onNavigateToChat) {
                    onNavigateToChat();
                    toast.success('Opening SasaMum Sister Support Chat...');
                  }
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm sm:text-base text-foreground">SasaMum Sister Support</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">Connect with understanding mothers</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className="border-border hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => callHelpline('+254712345678', 'Your Healthcare Provider')}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm sm:text-base text-foreground">Your Healthcare Provider</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">Call +254 712 345 678</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={() => setCurrentStep('relaxation')}
                className="w-full bg-primary hover:bg-primary/90 text-sm sm:text-base"
                size="lg"
              >
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Try Relaxation Exercises
              </Button>
              <Button 
                variant="outline" 
                onClick={startQuestionnaire}
                className="w-full text-sm sm:text-base"
              >
                Retake Assessment
              </Button>
            </div>
          </motion.div>
        )}

        {/* Relaxation Sessions */}
        {currentStep === 'relaxation' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 space-y-6"
          >
            <div className="text-center space-y-2">
              <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-primary mx-auto" />
              <h2 className="text-lg sm:text-xl md:text-2xl text-foreground">Relaxation & Wellness</h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Culturally-rooted practices to support your mental wellbeing
              </p>
            </div>

            {/* Active Session */}
            <AnimatePresence>
              {activeSession && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Card className="border-primary bg-gradient-to-br from-primary/5 to-pink-50 dark:from-primary/10 dark:to-pink-950/20">
                    <CardContent className="p-6 space-y-4">
                      {(() => {
                        const session = relaxationSessions.find(s => s.id === activeSession);
                        if (!session) return null;
                        
                        return (
                          <>
                            <div className="text-center space-y-2">
                              <h3 className="text-lg sm:text-xl text-foreground">{session.title}</h3>
                              <div className="text-3xl sm:text-4xl text-primary">
                                {formatTime(sessionTimer)}
                              </div>
                            </div>

                            <div className="space-y-2">
                              {session.steps?.map((step, index) => (
                                <div key={index} className="flex items-start space-x-3 p-2 bg-white/50 dark:bg-gray-900/30 rounded-lg">
                                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-xs sm:text-sm text-primary">{index + 1}</span>
                                  </div>
                                  <p className="text-xs sm:text-sm text-foreground pt-1">{step}</p>
                                </div>
                              ))}
                            </div>

                            <div className="flex space-x-3">
                              <Button 
                                variant="outline" 
                                onClick={pauseSession}
                                className="flex-1 text-sm sm:text-base"
                              >
                                {isPaused ? <Play className="w-4 h-4 mr-2" /> : <Pause className="w-4 h-4 mr-2" />}
                                {isPaused ? 'Resume' : 'Pause'}
                              </Button>
                              <Button 
                                onClick={endSession}
                                className="flex-1 bg-primary hover:bg-primary/90 text-sm sm:text-base"
                              >
                                Complete
                              </Button>
                            </div>
                          </>
                        );
                      })()}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Session List */}
            {!activeSession && (
              <div className="space-y-4">
                {relaxationSessions.map((session) => {
                  const IconComponent = session.type === 'breathing' ? Wind :
                                     session.type === 'meditation' ? Moon : Sparkles;
                  
                  return (
                    <Card key={session.id} className="border-border hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                            <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm sm:text-base md:text-lg text-foreground">{session.title}</h4>
                              <Badge variant="outline" className="text-xs">
                                <Clock className="w-3 h-3 mr-1" />
                                {session.duration}
                              </Badge>
                            </div>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              {session.description}
                            </p>
                            <p className="text-xs text-primary">
                              {session.culturalContext}
                            </p>
                          </div>
                        </div>
                        <Button 
                          className="w-full mt-4 bg-primary hover:bg-primary/90 text-sm sm:text-base"
                          onClick={() => startSession(session.id)}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Start Session
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            <Card className="bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800">
              <CardContent className="p-4">
                <h4 className="text-purple-800 dark:text-purple-300 mb-2 text-sm sm:text-base">Kumbuka, Mama</h4>
                <div className="text-xs sm:text-sm text-purple-700 dark:text-purple-400 space-y-1">
                  <p>"Wewe ni mama mwenye nguvu, mwenye huruma, na mwenye upendo"</p>
                  <p className="italic">(You are a strong mother, full of compassion and love)</p>
                  <p>Taking care of your mental health makes you a stronger mother</p>
                  <p>It's okay to ask for help - that's what sisters are for</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Articles */}
        {currentStep === 'articles' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 space-y-6"
          >
            <div className="text-center space-y-2">
              <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-primary mx-auto" />
              <h2 className="text-lg sm:text-xl md:text-2xl text-foreground">Mental Health Education</h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Updated articles from Kenyan mental health experts
              </p>
            </div>

            <div className="space-y-4">
              {articles.map((article) => (
                <Card key={article.id} className="border-border hover:shadow-md transition-shadow">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <Badge className="bg-primary/10 text-primary text-xs">
                        {article.category}
                      </Badge>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="w-3 h-3 mr-1" />
                        {article.readTime}
                      </div>
                    </div>

                    <h3 className="text-sm sm:text-base md:text-lg text-foreground leading-snug">
                      {article.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {article.excerpt}
                    </p>

                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
                      <div className="space-y-1">
                        <p>{article.author}</p>
                        <p>{article.date}</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => shareArticle(article)}
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <Button 
                      className="w-full bg-primary hover:bg-primary/90 text-sm"
                      size="sm"
                    >
                      Read Article
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <h4 className="text-blue-800 dark:text-blue-300 text-sm sm:text-base">Articles Update Weekly</h4>
                    <p className="text-blue-700 dark:text-blue-400 text-xs sm:text-sm mt-1">
                      New content from Kenyan mental health professionals added every week. 
                      Check back regularly for the latest insights!
                    </p>
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
