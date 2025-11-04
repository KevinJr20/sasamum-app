import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useScrollToTop } from './utils/useScrollToTop';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Slider } from './ui/slider';
import { 
  ArrowLeft,
  Plus,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Heart,
  ThermometerSun,
  Droplets,
  Moon,
  Utensils,
  Activity,
  Calendar,
  Clock
} from 'lucide-react';

interface SymptomTrackerProps {
  onBack: () => void;
  userName?: string;
}

interface Symptom {
  id: string;
  name: string;
  icon: any;
  color: string;
  severity: 1 | 2 | 3 | 4 | 5;
  category: 'common' | 'warning' | 'emergency';
  description: string;
  guidance: string;
  seekHelp: boolean;
}

interface SymptomEntry {
  id: string;
  symptomId: string;
  severity: number;
  notes: string;
  date: Date;
  week: number;
}

export function SymptomTracker({ onBack, userName = "Brenda" }: SymptomTrackerProps) {
  useScrollToTop();
  const [activeTab, setActiveTab] = useState<'today' | 'week' | 'month'>('today');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [isAddSymptomOpen, setIsAddSymptomOpen] = useState(false);
  const [selectedSymptom, setSelectedSymptom] = useState<Symptom | null>(null);
  const [symptomSeverity, setSymptomSeverity] = useState(3);
  const [symptomNotes, setSymptomNotes] = useState('');
  const [trackedSymptoms, setTrackedSymptoms] = useState<SymptomEntry[]>([]);

  // Common pregnancy symptoms with Kenyan context
  const symptoms: Symptom[] = [
    {
      id: 'nausea',
      name: 'Morning Sickness',
      icon: Utensils,
      color: 'text-orange-600',
      severity: 2,
      category: 'common',
      description: 'Nausea and vomiting, especially in the morning',
      guidance: 'Try ginger tea, eat small frequent meals. Consider sukuma wiki soup.',
      seekHelp: false
    },
    {
      id: 'fatigue',
      name: 'Fatigue',
      icon: Moon,
      color: 'text-blue-600',
      severity: 2,
      category: 'common',
      description: 'Feeling very tired and needing more rest',
      guidance: 'Rest when possible. Ensure iron-rich foods like spinach and beans.',
      seekHelp: false
    },
    {
      id: 'headache',
      name: 'Headaches',
      icon: ThermometerSun,
      color: 'text-red-600',
      severity: 3,
      category: 'warning',
      description: 'Persistent or severe headaches',
      guidance: 'Stay hydrated. Severe headaches may indicate high blood pressure.',
      seekHelp: true
    },
    {
      id: 'swelling',
      name: 'Swelling (Edema)',
      icon: Droplets,
      color: 'text-blue-500',
      severity: 2,
      category: 'common',
      description: 'Swelling in feet, ankles, or hands',
      guidance: 'Elevate feet when sitting. Sudden severe swelling needs medical attention.',
      seekHelp: false
    },
    {
      id: 'heartburn',
      name: 'Heartburn',
      icon: Heart,
      color: 'text-red-500',
      severity: 2,
      category: 'common',
      description: 'Burning sensation in chest after eating',
      guidance: 'Eat smaller meals, avoid spicy foods. Sleep with head elevated.',
      seekHelp: false
    },
    {
      id: 'bleeding',
      name: 'Vaginal Bleeding',
      icon: AlertTriangle,
      color: 'text-red-700',
      severity: 5,
      category: 'emergency',
      description: 'Any vaginal bleeding during pregnancy',
      guidance: 'SEEK IMMEDIATE MEDICAL ATTENTION. Call 1190 or go to nearest hospital.',
      seekHelp: true
    },
    {
      id: 'contractions',
      name: 'Contractions',
      icon: Activity,
      color: 'text-purple-600',
      severity: 4,
      category: 'warning',
      description: 'Regular tightening of the abdomen',
      guidance: 'Time contractions. If regular and before 37 weeks, seek medical help.',
      seekHelp: true
    },
    {
      id: 'fever',
      name: 'Fever',
      icon: ThermometerSun,
      color: 'text-orange-700',
      severity: 4,
      category: 'warning',
      description: 'Body temperature above 38°C (100.4°F)',
      guidance: 'Stay hydrated. Fever during pregnancy requires medical evaluation.',
      seekHelp: true
    }
  ];

  // Initialize with sample symptom entries
  React.useEffect(() => {
    const initialEntries: SymptomEntry[] = [
      {
        id: '1',
        symptomId: 'nausea',
        severity: 3,
        notes: 'Worse in the morning, ginger tea helped',
        date: new Date(2025, 9, 15),
        week: 16
      },
      {
        id: '2',
        symptomId: 'fatigue',
        severity: 2,
        notes: 'Feeling much better after afternoon rest',
        date: new Date(2025, 9, 14),
        week: 16
      },
      {
        id: '3',
        symptomId: 'heartburn',
        severity: 2,
        notes: 'After eating ugali, sleeping elevated helped',
        date: new Date(2025, 9, 13),
        week: 16
      }
    ];
    setTrackedSymptoms(initialEntries);
  }, []);

  const symptomEntries = trackedSymptoms;

  const currentWeek = 16;
  const emergencySymptoms = symptoms.filter(s => s.category === 'emergency');
  const warningSymptoms = symptoms.filter(s => s.category === 'warning');
  const commonSymptoms = symptoms.filter(s => s.category === 'common');

  const getTodaysEntries = () => {
    const today = new Date().toDateString();
    return symptomEntries.filter(entry => entry.date.toDateString() === today);
  };

  const getWeekEntries = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return symptomEntries.filter(entry => entry.date >= weekAgo);
  };

  const getSeverityColor = (severity: number) => {
    if (severity <= 2) return 'text-green-600 bg-green-100';
    if (severity <= 3) return 'text-yellow-600 bg-yellow-100';
    if (severity <= 4) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'emergency':
        return 'bg-destructive/10 text-destructive border-destructive/20 dark:bg-destructive/20';
      case 'warning':
        return 'bg-orange-100 dark:bg-orange-950/30 text-orange-800 dark:text-orange-400 border-orange-200 dark:border-orange-600/30';
      default:
        return 'bg-green-100 dark:bg-green-950/30 text-green-800 dark:text-green-400 border-green-200 dark:border-green-600/30';
    }
  };

  const handleAddSymptom = () => {
    if (selectedSymptom) {
      const newEntry: SymptomEntry = {
        id: Date.now().toString(),
        symptomId: selectedSymptom.id,
        severity: symptomSeverity,
        notes: symptomNotes,
        date: new Date(),
        week: currentWeek
      };
      setTrackedSymptoms([newEntry, ...trackedSymptoms]);
      setIsAddSymptomOpen(false);
      setSelectedSymptom(null);
      setSymptomNotes('');
      setSymptomSeverity(3);
    }
  };

  const handleSymptomSelect = (symptom: Symptom) => {
    setSelectedSymptom(symptom);
    setSymptomSeverity(symptom.severity);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-background w-full pb-20"
    >
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 flex items-center justify-between p-4 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
        <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </Button>
        <h1 className="text-lg text-foreground">Symptom Tracker</h1>
        <Button variant="ghost" size="sm" className="p-2" onClick={() => setIsAddSymptomOpen(true)}>
          <Plus className="w-6 h-6 text-foreground" />
        </Button>
      </div>

      {/* Emergency Notice */}
      <div className="p-4 bg-destructive/10 border-b border-destructive/20">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="text-destructive text-sm">Emergency Symptoms</h4>
            <p className="text-destructive/80 text-xs leading-relaxed">
              Bleeding, severe headaches, fever, or regular contractions require immediate medical attention.
              Call 1190 or visit your nearest hospital.
            </p>
          </div>
        </div>
      </div>

      {/* Current Week Summary */}
      <div className="p-4 bg-card border-b border-border">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-foreground">Week {currentWeek} Summary</h3>
              <Badge className="bg-primary/10 text-primary">
                {getWeekEntries().length} symptoms logged
              </Badge>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Mild</p>
                <p className="text-lg text-green-600">
                  {getWeekEntries().filter(e => e.severity <= 2).length}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Moderate</p>
                <p className="text-lg text-orange-600">
                  {getWeekEntries().filter(e => e.severity > 2 && e.severity <= 4).length}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Severe</p>
                <p className="text-lg text-red-600">
                  {getWeekEntries().filter(e => e.severity > 4).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="pb-20">
        {/* Quick Symptom Checker */}
        <div className="p-4 space-y-4">
          <h3 className="text-foreground">How are you feeling today?</h3>
          
          {/* Emergency Symptoms */}
          <div className="space-y-2">
            <h4 className="text-sm text-red-700 dark:text-red-400">🚨 Emergency Symptoms</h4>
            <div className="grid grid-cols-1 gap-2">
              {emergencySymptoms.map((symptom) => (
                <Card key={symptom.id} className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 hover:shadow-sm transition-shadow cursor-pointer">
                  <CardContent className="p-3">
                    <div className="flex items-center space-x-3">
                      <symptom.icon className="w-5 h-5 text-red-600 dark:text-red-400" />
                      <div className="flex-1">
                        <p className="text-sm text-foreground font-medium">{symptom.name}</p>
                        <p className="text-xs text-muted-foreground">{symptom.description}</p>
                      </div>
                      <Badge className={getCategoryBadge(symptom.category)}>
                        Emergency
                      </Badge>
                    </div>
                    <div className="mt-2 p-2 bg-red-100 dark:bg-red-900/40 rounded">
                      <p className="text-xs text-red-800 dark:text-red-200 font-medium">{symptom.guidance}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Warning Symptoms */}
          <div className="space-y-2">
            <h4 className="text-sm text-orange-700 dark:text-orange-400">⚠️ Warning Symptoms</h4>
            <div className="grid grid-cols-1 gap-2">
              {warningSymptoms.map((symptom) => (
                <Card key={symptom.id} className="border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/30 hover:shadow-sm transition-shadow cursor-pointer">
                  <CardContent className="p-3">
                    <div className="flex items-center space-x-3">
                      <symptom.icon className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                      <div className="flex-1">
                        <p className="text-sm text-foreground font-medium">{symptom.name}</p>
                        <p className="text-xs text-muted-foreground">{symptom.description}</p>
                      </div>
                      <Badge className={getCategoryBadge(symptom.category)}>
                        Monitor
                      </Badge>
                    </div>
                    <div className="mt-2 p-2 bg-orange-100 dark:bg-orange-900/40 rounded">
                      <p className="text-xs text-orange-800 dark:text-orange-200 font-medium">{symptom.guidance}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Common Symptoms */}
          <div className="space-y-2">
            <h4 className="text-sm text-green-700 dark:text-green-400">✅ Common Symptoms</h4>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
              {commonSymptoms.map((symptom) => (
                <Card key={symptom.id} className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30 hover:shadow-sm transition-shadow cursor-pointer">
                  <CardContent className="p-3">
                    <div className="text-center space-y-2">
                      <symptom.icon className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto" />
                      <p className="text-sm text-foreground font-medium">{symptom.name}</p>
                      <Badge className={getCategoryBadge(symptom.category)} size="sm">
                        Normal
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Entries */}
          <div className="space-y-3">
            <h4 className="text-foreground">Recent Entries</h4>
            {symptomEntries.slice(-3).map((entry) => {
              const symptom = symptoms.find(s => s.id === entry.symptomId);
              if (!symptom) return null;
              
              return (
                <Card key={entry.id} className="border-border">
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <symptom.icon className={`w-5 h-5 ${symptom.color}`} />
                        <div>
                          <p className="text-sm text-foreground">{symptom.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {entry.date.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge className={getSeverityColor(entry.severity)}>
                        Level {entry.severity}
                      </Badge>
                    </div>
                    {entry.notes && (
                      <p className="text-xs text-muted-foreground mt-2 ml-8">
                        {entry.notes}
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Quick Tips */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader className="pb-3">
              <h4 className="text-blue-800 flex items-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span>Quick Relief Tips</span>
              </h4>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-xs text-blue-700 space-y-1">
                <p>• Ginger tea for nausea (traditional Kenyan remedy)</p>
                <p>• Iron-rich sukuma wiki and beans for fatigue</p>
                <p>• Elevate feet for swelling</p>
                <p>• Small frequent meals for heartburn</p>
                <p>• Rest when possible - listen to your body</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Symptom Dialog */}
      <Dialog open={isAddSymptomOpen} onOpenChange={setIsAddSymptomOpen}>
        <DialogContent className="rounded-3xl max-w-md">
          <DialogHeader>
            <DialogTitle>Add Symptom</DialogTitle>
            <DialogDescription>
              Select a symptom you're experiencing and provide details
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>Select Symptom</Label>
              <div className="grid grid-cols-2 gap-2 mt-2 max-h-[200px] overflow-y-auto">
                {symptoms.map((symptom) => (
                  <button
                    key={symptom.id}
                    onClick={() => handleSymptomSelect(symptom)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      selectedSymptom?.id === symptom.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <symptom.icon className={`w-4 h-4 ${symptom.color}`} />
                      <span className="text-sm">{symptom.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {selectedSymptom && (
              <>
                <div>
                  <Label>Severity Level: {symptomSeverity}</Label>
                  <Slider
                    value={[symptomSeverity]}
                    onValueChange={(value) => setSymptomSeverity(value[0])}
                    min={1}
                    max={5}
                    step={1}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Mild</span>
                    <span>Moderate</span>
                    <span>Severe</span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="How are you feeling? Any remedies that helped?"
                    value={symptomNotes}
                    onChange={(e) => setSymptomNotes(e.target.value)}
                    className="mt-2 rounded-2xl"
                    rows={3}
                  />
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsAddSymptomOpen(false)}
              className="rounded-full"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddSymptom}
              disabled={!selectedSymptom}
              className="rounded-full"
            >
              Add Symptom
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}