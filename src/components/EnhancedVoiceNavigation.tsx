import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useScrollToTop } from './utils/useScrollToTop';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { toast } from 'sonner@2.0.3';
import {
  ArrowLeft,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Headphones,
  Play,
  Pause,
  Languages,
  Calendar,
  MapPin,
  Heart,
  Baby,
  FileText,
  AlertCircle,
  Settings,
  Sparkles
} from 'lucide-react';

interface EnhancedVoiceNavigationProps {
  onBack: () => void;
  onNavigate?: (screen: string) => void;
}

export function EnhancedVoiceNavigation({ onBack, onNavigate }: EnhancedVoiceNavigationProps) {
  useScrollToTop();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentCommand, setCurrentCommand] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const recognitionRef = useRef<any>(null);

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'sw', name: 'Kiswahili', flag: '🇰🇪' },
    { code: 'luo', name: 'Dholuo', flag: '🇰🇪' },
    { code: 'luh', name: 'Luhya', flag: '🇰🇪' }
  ];

  const quickCommands = [
    {
      command: 'Show calendar',
      action: 'calendar',
      icon: Calendar,
      color: 'bg-blue-500',
      translations: {
        en: 'Show calendar',
        sw: 'Onyesha kalenda',
        luo: 'Nyis kalenda',
        luh: 'Onye kalenda'
      }
    },
    {
      command: 'Find hospitals',
      action: 'hospitals',
      icon: MapPin,
      color: 'bg-red-500',
      translations: {
        en: 'Find hospitals',
        sw: 'Tafuta hospitali',
        luo: 'Manye hospitali',
        luh: 'Tafuta esibukali'
      }
    },
    {
      command: 'Track symptoms',
      action: 'health-symptom-guide',
      icon: Heart,
      color: 'bg-pink-500',
      translations: {
        en: 'Track symptoms',
        sw: 'Fuatilia dalili',
        luo: 'Luwo ranyisi',
        luh: 'Lundisie obulosi'
      }
    },
    {
      command: 'Baby development',
      action: 'baby-tracker',
      icon: Baby,
      color: 'bg-purple-500',
      translations: {
        en: 'Baby development',
        sw: 'Ukuaji wa mtoto',
        luo: 'Dongo nyalo',
        luh: 'Omwana wefwa'
      }
    },
    {
      command: 'My appointments',
      action: 'appointments',
      icon: FileText,
      color: 'bg-green-500',
      translations: {
        en: 'My appointments',
        sw: 'Miadi yangu',
        luo: 'Tichna mag tera',
        luh: 'Ebitsalo byanje'
      }
    },
    {
      command: 'Emergency help',
      action: 'transport',
      icon: AlertCircle,
      color: 'bg-orange-500',
      translations: {
        en: 'Emergency help',
        sw: 'Msaada wa dharura',
        luo: 'Kony mapiyo',
        luh: 'Obwoni bwo bulayi'
      }
    }
  ];

  // Initialize Web Speech API
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = selectedLanguage === 'en' ? 'en-US' : 
                                     selectedLanguage === 'sw' ? 'sw-KE' : 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        setCurrentCommand(transcript);
        processVoiceCommand(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        setIsListening(false);
        
        // Handle different error types appropriately
        if (event.error === 'not-allowed') {
          toast.error('Microphone access denied. Please allow microphone access in your browser settings.');
        } else if (event.error === 'no-speech') {
          // Silently ignore no-speech errors
          return;
        } else if (event.error === 'audio-capture') {
          toast.error('No microphone found. Please connect a microphone and try again.');
        } else if (event.error === 'network') {
          toast.error('Network error. Please check your connection.');
        } else {
          // Generic error for other cases
          toast.error('Voice recognition error. Please try again.');
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [selectedLanguage]);

  const handleVoiceCommand = async () => {
    if (!isListening) {
      // Check if browser supports speech recognition
      if (!recognitionRef.current) {
        toast.error('Voice recognition not supported in this browser');
        return;
      }

      // Check microphone permission
      try {
        if (navigator.permissions) {
          const permissionStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });
          if (permissionStatus.state === 'denied') {
            toast.error('Microphone access denied. Please allow microphone access in your browser settings.', {
              duration: 5000,
            });
            return;
          }
        }
      } catch (err) {
        // Permission API might not be available, continue anyway
      }

      // Start listening
      try {
        recognitionRef.current.start();
        setIsListening(true);
        setCurrentCommand('Listening...');
        toast.info('Listening... Speak now');
      } catch (error) {
        toast.error('Could not start voice recognition. Please try again.');
      }
    } else {
      // Stop listening
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      setCurrentCommand('');
    }
  };

  const processVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    
    // Match commands
    if (lowerCommand.includes('calendar') || lowerCommand.includes('kalenda')) {
      executeCommand('calendar');
    } else if (lowerCommand.includes('hospital') || lowerCommand.includes('hospitali') || lowerCommand.includes('esibukali')) {
      executeCommand('hospitals');
    } else if (lowerCommand.includes('symptom') || lowerCommand.includes('dalili') || lowerCommand.includes('ranyisi') || lowerCommand.includes('obulosi')) {
      executeCommand('health-symptom-guide');
    } else if (lowerCommand.includes('baby') || lowerCommand.includes('mtoto') || lowerCommand.includes('dongo') || lowerCommand.includes('omwana')) {
      executeCommand('baby-tracker');
    } else if (lowerCommand.includes('appointment') || lowerCommand.includes('miadi') || lowerCommand.includes('tichna') || lowerCommand.includes('ebitsalo')) {
      executeCommand('appointments');
    } else if (lowerCommand.includes('emergency') || lowerCommand.includes('dharura') || lowerCommand.includes('kony') || lowerCommand.includes('obwoni')) {
      executeCommand('transport');
    } else if (lowerCommand.includes('profile') || lowerCommand.includes('wasifu')) {
      executeCommand('profile');
    } else if (lowerCommand.includes('chat') || lowerCommand.includes('message')) {
      executeCommand('chat');
    } else {
      toast.error('Command not recognized. Please try again.');
      speak('Sorry, I didn\'t understand that command.');
    }
  };

  const executeCommand = (action: string) => {
    toast.success(`Navigating to ${action.replace('-', ' ')}...`);
    speak(`Opening ${action.replace('-', ' ')}`);
    
    // Delay navigation slightly for UX
    setTimeout(() => {
      if (onNavigate) {
        onNavigate(action);
      }
    }, 1000);
  };

  const speak = (text: string) => {
    if (voiceEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = selectedLanguage === 'en' ? 'en-US' :
                       selectedLanguage === 'sw' ? 'sw-KE' : 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleQuickCommand = (command: any) => {
    const translation = command.translations[selectedLanguage] || command.command;
    setCurrentCommand(translation);
    speak(`Opening ${command.command}`);
    executeCommand(command.action);
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
      <div className="sticky top-0 z-40 flex items-center justify-between p-4 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
        <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </Button>
        <div className="flex-1 text-center">
          <h1 className="text-lg text-foreground">Voice Assistant</h1>
          <p className="text-xs text-muted-foreground">Speak or tap to navigate</p>
        </div>
        <Headphones className="w-6 h-6 text-primary" />
      </div>

      <div className="p-4 space-y-6">
        {/* Voice Control Center */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                {/* Microphone Button */}
                <motion.button
                  onClick={handleVoiceCommand}
                  className={`w-28 h-28 rounded-full flex items-center justify-center mx-auto shadow-2xl transition-colors ${
                    isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary/90'
                  }`}
                  whileTap={{ scale: 0.95 }}
                  animate={isListening ? {
                    boxShadow: [
                      '0 0 0 0 rgba(239, 68, 68, 0.7)',
                      '0 0 0 20px rgba(239, 68, 68, 0)',
                      '0 0 0 0 rgba(239, 68, 68, 0)'
                    ]
                  } : {}}
                  transition={{
                    repeat: isListening ? Infinity : 0,
                    duration: 1.5
                  }}
                >
                  {isListening ? (
                    <MicOff className="w-12 h-12 text-white" />
                  ) : (
                    <Mic className="w-12 h-12 text-white" />
                  )}
                </motion.button>

                {/* Status Text */}
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {isListening ? 'Listening...' : 'Tap microphone to speak'}
                  </p>
                  {currentCommand && !isListening && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-background rounded-lg"
                    >
                      <p className="text-sm text-foreground">"{currentCommand}"</p>
                    </motion.div>
                  )}
                </div>

                {/* Voice Feedback Indicator */}
                {isSpeaking && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-center space-x-2 text-primary"
                  >
                    <Volume2 className="w-5 h-5" />
                    <span className="text-sm">Speaking...</span>
                  </motion.div>
                )}
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
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Voice Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Language Selection */}
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Language</Label>
                <div className="grid grid-cols-2 gap-2">
                  {languages.map((lang) => (
                    <Button
                      key={lang.code}
                      variant={selectedLanguage === lang.code ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        setSelectedLanguage(lang.code);
                        toast.success(`Language changed to ${lang.name}`);
                      }}
                      className="justify-start"
                    >
                      <span className="mr-2">{lang.flag}</span>
                      {lang.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Voice Feedback Toggle */}
              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <Label>Voice Feedback</Label>
                  <p className="text-xs text-muted-foreground">Hear spoken responses</p>
                </div>
                <Switch
                  checked={voiceEnabled}
                  onCheckedChange={setVoiceEnabled}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Voice Commands */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Quick Voice Commands
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Tap a command or say it out loud
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {quickCommands.map((command, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleQuickCommand(command)}
                    className="p-4 rounded-xl border-2 border-border hover:border-primary transition-all bg-card hover:bg-accent group"
                  >
                    <div className="flex flex-col items-center space-y-2 text-center">
                      <div className={`p-3 rounded-full ${command.color}`}>
                        <command.icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-xs leading-tight">
                        {command.translations[selectedLanguage as keyof typeof command.translations] || command.command}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Voice Command Examples */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-900">
            <CardContent className="p-5">
              <div className="flex items-start space-x-3">
                <Languages className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <h4 className="text-foreground">Try saying:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• "Show my calendar"</li>
                    <li>• "Find nearby hospitals"</li>
                    <li>• "Track my symptoms"</li>
                    <li>• "Check baby development"</li>
                    <li>• "Emergency help"</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
