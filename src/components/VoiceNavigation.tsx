import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Mic, MicOff, Volume2, VolumeX, Headphones, Play, Pause, SkipForward, Languages } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Switch } from './ui/switch';
import { Label } from './ui/label';

interface VoiceNavigationProps {
  onBack: () => void;
}

interface EducationalContent {
  title: string;
  category: string;
  duration: string;
  content: string;
}

export function VoiceNavigation({ onBack }: VoiceNavigationProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentCommand, setCurrentCommand] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [playingContent, setPlayingContent] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const languages = ['English', 'Kiswahili', 'Dholuo', 'Kikuyu'];

  const educationalContent: EducationalContent[] = [
    {
      title: 'Understanding Labor Signs',
      category: 'Labor & Delivery',
      duration: '3 min',
      content: 'Learn about the signs of labor and when to go to the hospital...'
    },
    {
      title: 'Nutrition During Pregnancy',
      category: 'Nutrition',
      duration: '5 min',
      content: 'Essential foods for you and your baby during pregnancy...'
    },
    {
      title: 'Breastfeeding Basics',
      category: 'Postpartum',
      duration: '4 min',
      content: 'Everything you need to know about breastfeeding your newborn...'
    },
    {
      title: 'Managing Morning Sickness',
      category: 'Symptoms',
      duration: '2 min',
      content: 'Tips and remedies for dealing with nausea and morning sickness...'
    }
  ];

  const recentCommands = [
    'Show my appointments',
    'Track baby movement',
    'Record symptoms',
    'Find nearby hospital',
    'Check medication reminder'
  ];

  useEffect(() => {
    if (playingContent) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setPlayingContent(null);
            setIsSpeaking(false);
            return 0;
          }
          return prev + 2;
        });
      }, 200);
      return () => clearInterval(interval);
    }
  }, [playingContent]);

  const handleVoiceCommand = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setCurrentCommand('Listening...');
      setTimeout(() => {
        setCurrentCommand('Show my appointments');
        setIsListening(false);
      }, 2000);
    }
  };

  const handlePlayContent = (title: string) => {
    if (playingContent === title) {
      setPlayingContent(null);
      setIsSpeaking(false);
      setProgress(0);
    } else {
      setPlayingContent(title);
      setIsSpeaking(true);
      setProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky-header">
        <div className="flex items-center gap-4 p-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl text-foreground">Voice Assistant</h1>
            <p className="text-sm text-muted-foreground">Speak or listen to navigate</p>
          </div>
          <Headphones className="w-6 h-6 text-primary" />
        </div>
      </div>

      <div className="pt-20 p-4 space-y-6">
        {/* Voice Control Center */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-primary/10 to-secondary/10">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <motion.button
                  onClick={handleVoiceCommand}
                  className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto ${
                    isListening ? 'bg-red-500' : 'bg-primary'
                  } shadow-lg`}
                  whileTap={{ scale: 0.95 }}
                  animate={isListening ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ repeat: isListening ? Infinity : 0, duration: 1 }}
                >
                  {isListening ? (
                    <MicOff className="w-10 h-10 text-white" />
                  ) : (
                    <Mic className="w-10 h-10 text-white" />
                  )}
                </motion.button>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {isListening ? 'Listening...' : 'Tap to speak'}
                  </p>
                  <AnimatePresence>
                    {currentCommand && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-background/50 rounded-lg p-3"
                      >
                        <p className="text-sm">"{currentCommand}"</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Voice Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Volume2 className="w-5 h-5 text-primary" />
                  <Label>Voice Guidance</Label>
                </div>
                <Switch checked={voiceEnabled} onCheckedChange={setVoiceEnabled} />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Languages className="w-4 h-4 text-primary" />
                  Language
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {languages.map((lang) => (
                    <Button
                      key={lang}
                      variant={selectedLanguage === lang ? 'default' : 'outline'}
                      onClick={() => setSelectedLanguage(lang)}
                      className="w-full"
                    >
                      {lang}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Commands */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <h2 className="mb-4">Quick Voice Commands</h2>
          <div className="space-y-2">
            {recentCommands.map((command, index) => (
              <motion.div
                key={command}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <Mic className="w-4 h-4 text-primary" />
                      <p className="text-sm flex-1">"{command}"</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Audio Education */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <h2 className="mb-4">Audio Health Tips</h2>
          <div className="space-y-3">
            {educationalContent.map((content, index) => (
              <motion.div
                key={content.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex-1">
                        <h3 className="mb-1">{content.title}</h3>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {content.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{content.duration}</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handlePlayContent(content.title)}
                      >
                        {playingContent === content.title ? (
                          <Pause className="w-5 h-5 text-primary" />
                        ) : (
                          <Play className="w-5 h-5 text-primary" />
                        )}
                      </Button>
                    </div>

                    {playingContent === content.title && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-2"
                      >
                        <Progress value={progress} className="h-1" />
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Volume2 className="w-3 h-3" />
                          <span>Playing in {selectedLanguage}</span>
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Help Guide */}
        <Card className="bg-primary/5">
          <CardHeader>
            <CardTitle>Voice Commands You Can Use</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              'Show my appointments',
              'Track baby movement',
              'Record symptoms',
              'Find nearest hospital',
              'Call emergency services',
              'Check medication schedule',
              'Read health tips'
            ].map((command, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <p className="text-sm">{command}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
