import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useScrollToTop } from './utils/useScrollToTop';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Slider } from './ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  ArrowLeft,
  Plus,
  AlertTriangle,
  CheckCircle,
  Phone,
  Clock,
  MapPin,
  Heart,
  Activity,
  Thermometer,
  Droplets,
  Baby,
  Navigation,
  TrendingUp,
  Moon,
  Utensils,
  Calendar,
  Download,
  Share2
} from 'lucide-react';

interface HealthSymptomGuideProps {
  onBack: () => void;
  userName?: string;
}

interface EmergencyScenario {
  id: string;
  title: string;
  icon: any;
  severity: 'high' | 'medium';
  symptoms: string[];
  immediateActions: string[];
  whenToCall: string;
  hotlines: { name: string; number: string; description: string }[];
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
  symptomName: string;
  severity: number;
  notes: string;
  date: Date;
  week: number;
}

export function HealthSymptomGuide({ onBack, userName = "Brenda" }: HealthSymptomGuideProps) {
  useScrollToTop();
  const [activeTab, setActiveTab] = useState<'tracker' | 'emergency' | 'history'>('tracker');
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [isAddSymptomOpen, setIsAddSymptomOpen] = useState(false);
  const [selectedSymptom, setSelectedSymptom] = useState<Symptom | null>(null);
  const [symptomSeverity, setSymptomSeverity] = useState(3);
  const [symptomNotes, setSymptomNotes] = useState('');
  const [trackedSymptoms, setTrackedSymptoms] = useState<SymptomEntry[]>([
    {
      id: '1',
      symptomId: 'nausea',
      symptomName: 'Morning Sickness',
      severity: 3,
      notes: 'Felt nauseous after breakfast',
      date: new Date(2025, 9, 15),
      week: 12
    },
    {
      id: '2',
      symptomId: 'fatigue',
      symptomName: 'Fatigue',
      severity: 4,
      notes: 'Very tired in the afternoon',
      date: new Date(2025, 9, 15),
      week: 12
    }
  ]);

  const emergencyScenarios: EmergencyScenario[] = [
    {
      id: 'bleeding',
      title: 'Vaginal Bleeding',
      icon: Droplets,
      severity: 'high',
      symptoms: [
        'Heavy bleeding (soaking a pad in 1 hour)',
        'Bright red blood',
        'Clots larger than golf ball',
        'Severe cramping'
      ],
      immediateActions: [
        'Call ambulance immediately (1190)',
        'Lie down with feet elevated',
        'Do not insert anything vaginally',
        'Save any tissue that passes'
      ],
      whenToCall: 'ANY vaginal bleeding during pregnancy requires immediate attention',
      hotlines: [
        { name: 'Emergency Ambulance', number: '1190', description: 'Free emergency ambulance service' },
        { name: 'Mama Lucy Hospital', number: '0702 811 000', description: '24hr maternity emergency' }
      ]
    },
    {
      id: 'preterm-labor',
      title: 'Preterm Labor',
      icon: Activity,
      severity: 'high',
      symptoms: [
        'Regular contractions before 37 weeks',
        'Lower back pain',
        'Pelvic pressure',
        'Fluid leaking from vagina'
      ],
      immediateActions: [
        'Time contractions (frequency and duration)',
        'Drink water and rest on left side',
        'Call healthcare provider immediately',
        'Prepare for hospital transport'
      ],
      whenToCall: 'Contractions every 10 minutes or less before 37 weeks',
      hotlines: [
        { name: 'Emergency Ambulance', number: '1190', description: 'Free emergency ambulance service' },
        { name: 'Kenyatta National Hospital', number: '020 2726300', description: 'Major referral hospital' }
      ]
    },
    {
      id: 'severe-headache',
      title: 'Severe Headache',
      icon: Thermometer,
      severity: 'high',
      symptoms: [
        'Sudden severe headache',
        'Vision changes or blurred vision',
        'Swelling in face/hands',
        'Upper abdominal pain'
      ],
      immediateActions: [
        'Check blood pressure if possible',
        'Rest in dark, quiet room',
        'Call healthcare provider immediately',
        'Monitor for worsening symptoms'
      ],
      whenToCall: 'Severe headache with vision changes or swelling',
      hotlines: [
        { name: 'Emergency Ambulance', number: '1190', description: 'Free emergency ambulance service' },
        { name: 'Aga Khan Hospital', number: '020 3740000', description: '24hr emergency services' }
      ]
    },
    {
      id: 'decreased-movement',
      title: 'Decreased Baby Movement',
      icon: Baby,
      severity: 'medium',
      symptoms: [
        'Less than 10 movements in 2 hours after 28 weeks',
        'Significant change in movement pattern',
        'No movement after meals or stimulation'
      ],
      immediateActions: [
        'Drink cold water and lie on left side',
        'Count movements for 2 hours',
        'Eat something sweet',
        'Call healthcare provider if still concerned'
      ],
      whenToCall: 'Less than 10 movements in 2 hours after trying stimulation',
      hotlines: [
        { name: 'Maternal Emergency', number: '0800 720 811', description: 'Free maternal health helpline' },
        { name: 'Your Clinic', number: 'Contact Number', description: 'Your regular healthcare provider' }
      ]
    },
    {
      id: 'fever',
      title: 'High Fever',
      icon: Thermometer,
      severity: 'medium',
      symptoms: [
        'Temperature above 38°C (100.4°F)',
        'Chills and shaking',
        'Severe body aches',
        'Difficulty breathing'
      ],
      immediateActions: [
        'Take temperature regularly',
        'Increase fluid intake',
        'Rest and avoid overheating',
        'Take paracetamol if recommended by doctor'
      ],
      whenToCall: 'Fever above 38°C lasting more than 24 hours',
      hotlines: [
        { name: 'Kenya Health Helpline', number: '719', description: 'Free health information' },
        { name: 'Your Healthcare Provider', number: 'Contact Number', description: 'Your regular clinic or doctor' }
      ]
    },
    {
      id: 'severe-swelling',
      title: 'Severe Swelling',
      icon: Droplets,
      severity: 'high',
      symptoms: [
        'Sudden swelling of face/hands',
        'Rapid weight gain (more than 2kg in a week)',
        'Swelling that doesn\'t reduce with rest',
        'Accompanied by headache or vision changes'
      ],
      immediateActions: [
        'Lie down on left side',
        'Monitor blood pressure if possible',
        'Contact healthcare provider immediately',
        'Reduce salt intake'
      ],
      whenToCall: 'Sudden facial/hand swelling with headache or visual changes',
      hotlines: [
        { name: 'Emergency Ambulance', number: '1190', description: 'Free emergency ambulance service' },
        { name: 'MP Shah Hospital', number: '020 4285000', description: '24hr emergency care' }
      ]
    }
  ];

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
      icon: Thermometer,
      color: 'text-red-600',
      severity: 3,
      category: 'warning',
      description: 'Persistent or severe headaches',
      guidance: 'Stay hydrated. Severe headaches may indicate high blood pressure.',
      seekHelp: true
    },
    {
      id: 'backache',
      name: 'Back Pain',
      icon: Activity,
      color: 'text-purple-600',
      severity: 2,
      category: 'common',
      description: 'Lower back pain, especially in later pregnancy',
      guidance: 'Practice good posture, try prenatal yoga. Use warm compress.',
      seekHelp: false
    },
    {
      id: 'swelling',
      name: 'Swelling (Edema)',
      icon: Droplets,
      color: 'text-cyan-600',
      severity: 3,
      category: 'warning',
      description: 'Swelling in feet, ankles, or hands',
      guidance: 'Elevate feet, reduce salt. Call doctor if sudden or in face.',
      seekHelp: true
    },
    {
      id: 'heartburn',
      name: 'Heartburn',
      icon: Heart,
      color: 'text-red-500',
      severity: 2,
      category: 'common',
      description: 'Burning sensation in chest, acid reflux',
      guidance: 'Eat smaller meals, avoid spicy foods. Sleep with head elevated.',
      seekHelp: false
    },
    {
      id: 'cramping',
      name: 'Abdominal Cramping',
      icon: AlertTriangle,
      color: 'text-red-700',
      severity: 4,
      category: 'emergency',
      description: 'Severe or persistent abdominal pain',
      guidance: 'Severe cramping with bleeding requires immediate attention.',
      seekHelp: true
    },
    {
      id: 'contractions',
      name: 'Contractions',
      icon: Activity,
      color: 'text-pink-600',
      severity: 4,
      category: 'warning',
      description: 'Regular tightening of the uterus',
      guidance: 'Time contractions. Call if regular before 37 weeks.',
      seekHelp: true
    }
  ];

  const handleAddSymptom = () => {
    if (selectedSymptom) {
      const newEntry: SymptomEntry = {
        id: Date.now().toString(),
        symptomId: selectedSymptom.id,
        symptomName: selectedSymptom.name,
        severity: symptomSeverity,
        notes: symptomNotes,
        date: new Date(),
        week: 12 // In real app, calculate from pregnancy data
      };
      setTrackedSymptoms([newEntry, ...trackedSymptoms]);
      setIsAddSymptomOpen(false);
      setSelectedSymptom(null);
      setSymptomNotes('');
      setSymptomSeverity(3);
    }
  };

  const handleCallHotline = (number: string) => {
    window.open(`tel:${number}`, '_self');
  };

  const selectedScenarioData = emergencyScenarios.find(s => s.id === selectedScenario);

  const getSeverityColor = (severity: number) => {
    if (severity <= 2) return 'bg-green-500';
    if (severity <= 3) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getSeverityText = (severity: number) => {
    if (severity <= 2) return 'Mild';
    if (severity <= 3) return 'Moderate';
    return 'Severe';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-background w-full pb-20"
    >
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 flex items-center justify-between p-4 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => selectedScenario ? setSelectedScenario(null) : onBack()} 
          className="p-2"
        >
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </Button>
        <h1 className="text-lg text-foreground">Health & Symptom Guide</h1>
        <Button variant="ghost" size="sm" className="p-2" onClick={() => handleCallHotline('1190')}>
          <Phone className="w-6 h-6 text-green-600" />
        </Button>
      </div>

      {/* Emergency Alert Banner */}
      <div className="p-4 bg-destructive/10 border-b border-destructive/20">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="text-destructive text-sm">Emergency? Call Immediately</h4>
            <div className="mt-2 flex flex-wrap gap-2">
              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleCallHotline('1190')}>
                <Phone className="w-3 h-3 mr-1" />
                1190 Ambulance
              </Button>
              <Button size="sm" variant="outline" className="border-destructive/30 text-destructive hover:bg-destructive/10">
                <Navigation className="w-3 h-3 mr-1" />
                Nearest Hospital
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="pb-20">
        {!selectedScenario ? (
          <>
            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
              <div className="sticky top-[73px] z-30 bg-background border-b border-border">
                <TabsList className="grid w-full grid-cols-3 rounded-none h-auto">
                  <TabsTrigger value="tracker" className="data-[state=active]:bg-primary/10">
                    <Activity className="w-4 h-4 mr-2" />
                    Track
                  </TabsTrigger>
                  <TabsTrigger value="emergency" className="data-[state=active]:bg-destructive/10">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Emergency
                  </TabsTrigger>
                  <TabsTrigger value="history" className="data-[state=active]:bg-primary/10">
                    <Calendar className="w-4 h-4 mr-2" />
                    History
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Symptom Tracker Tab */}
              <TabsContent value="tracker" className="mt-0">
                <div className="p-4 space-y-6">
                  {/* Add Symptom Button */}
                  <Button onClick={() => setIsAddSymptomOpen(true)} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Track New Symptom
                  </Button>

                  {/* Today's Symptoms */}
                  {trackedSymptoms.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-foreground">Today's Symptoms</h3>
                      {trackedSymptoms.slice(0, 3).map((entry) => (
                        <Card key={entry.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="text-foreground">{entry.symptomName}</h4>
                                <p className="text-xs text-muted-foreground">
                                  {entry.date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                              <Badge className={`${getSeverityColor(entry.severity)} text-white border-0`}>
                                {getSeverityText(entry.severity)}
                              </Badge>
                            </div>
                            {entry.notes && (
                              <p className="text-sm text-muted-foreground mt-2">{entry.notes}</p>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  {/* Common Symptoms Quick Reference */}
                  <div className="space-y-3">
                    <h3 className="text-foreground">Common Pregnancy Symptoms</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {symptoms.filter(s => s.category === 'common').map((symptom) => (
                        <Card 
                          key={symptom.id}
                          className="cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => {
                            setSelectedSymptom(symptom);
                            setIsAddSymptomOpen(true);
                          }}
                        >
                          <CardContent className="p-3">
                            <symptom.icon className={`w-8 h-8 ${symptom.color} mb-2`} />
                            <p className="text-sm">{symptom.name}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Warning Symptoms */}
                  <div className="space-y-3">
                    <h3 className="text-orange-600 dark:text-orange-400">⚠️ Monitor These Symptoms</h3>
                    <div className="space-y-2">
                      {symptoms.filter(s => s.category === 'warning').map((symptom) => (
                        <Card 
                          key={symptom.id}
                          className="border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/20"
                        >
                          <CardContent className="p-3">
                            <div className="flex items-start space-x-3">
                              <symptom.icon className={`w-5 h-5 ${symptom.color} mt-0.5`} />
                              <div className="flex-1">
                                <h4 className="text-sm">{symptom.name}</h4>
                                <p className="text-xs text-muted-foreground mt-1">{symptom.guidance}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Emergency Guide Tab */}
              <TabsContent value="emergency" className="mt-0">
                <div className="p-4 space-y-6">
                  <div className="text-center space-y-2">
                    <AlertTriangle className="w-12 h-12 text-destructive mx-auto" />
                    <h2 className="text-foreground">Pregnancy Emergency Guide</h2>
                    <p className="text-sm text-muted-foreground">
                      Quick reference for pregnancy emergencies. When in doubt, always call for help.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-destructive">🚨 High Priority Emergencies</h3>
                    {emergencyScenarios
                      .filter(s => s.severity === 'high')
                      .map((scenario) => (
                        <Card 
                          key={scenario.id}
                          className="border-2 border-destructive/30 bg-destructive/5 hover:border-destructive/50 cursor-pointer transition-all hover:shadow-lg"
                          onClick={() => setSelectedScenario(scenario.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-destructive/10 dark:bg-destructive/20">
                                <scenario.icon className="w-6 h-6 text-destructive" />
                              </div>
                              <div className="flex-1">
                                <h3 className="text-foreground">{scenario.title}</h3>
                                <Badge className="mt-1 bg-destructive/10 text-destructive border-destructive/20">
                                  High Priority
                                </Badge>
                              </div>
                              <ArrowLeft className="w-5 h-5 text-muted-foreground rotate-180" />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-orange-600 dark:text-orange-400">⚠️ Monitor & Contact Provider</h3>
                    {emergencyScenarios
                      .filter(s => s.severity === 'medium')
                      .map((scenario) => (
                        <Card 
                          key={scenario.id}
                          className="border-2 border-orange-300 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-600/30 hover:border-orange-400 dark:hover:border-orange-500 cursor-pointer transition-all hover:shadow-lg"
                          onClick={() => setSelectedScenario(scenario.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-orange-100 dark:bg-orange-900/30">
                                <scenario.icon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                              </div>
                              <div className="flex-1">
                                <h3 className="text-foreground">{scenario.title}</h3>
                                <Badge className="mt-1 bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-300 dark:border-orange-600/30">
                                  Monitor Closely
                                </Badge>
                              </div>
                              <ArrowLeft className="w-5 h-5 text-muted-foreground rotate-180" />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>

                  {/* Important Numbers */}
                  <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
                    <CardHeader className="pb-3">
                      <h4 className="text-blue-800 dark:text-blue-400 flex items-center space-x-2">
                        <Phone className="w-5 h-5" />
                        <span>Important Numbers</span>
                      </h4>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-1 gap-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-blue-700 dark:text-blue-300">Emergency Ambulance</span>
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => handleCallHotline('1190')}
                          >
                            1190
                          </Button>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-blue-700 dark:text-blue-300">Health Helpline</span>
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => handleCallHotline('719')}
                          >
                            719
                          </Button>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-blue-700 dark:text-blue-300">Mental Health Support</span>
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => handleCallHotline('0800720811')}
                          >
                            0800 720 811
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* History Tab */}
              <TabsContent value="history" className="mt-0">
                <div className="p-4 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-foreground">Symptom History</h3>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>

                  {trackedSymptoms.length > 0 ? (
                    <div className="space-y-3">
                      {trackedSymptoms.map((entry) => (
                        <Card key={entry.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="text-foreground">{entry.symptomName}</h4>
                                <p className="text-xs text-muted-foreground">
                                  {entry.date.toLocaleDateString('en-US', { 
                                    month: 'short', 
                                    day: 'numeric',
                                    year: 'numeric'
                                  })} at {entry.date.toLocaleTimeString('en-US', { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                  })}
                                </p>
                                <Badge variant="outline" className="mt-1 text-xs">
                                  Week {entry.week}
                                </Badge>
                              </div>
                              <Badge className={`${getSeverityColor(entry.severity)} text-white border-0`}>
                                {getSeverityText(entry.severity)}
                              </Badge>
                            </div>
                            {entry.notes && (
                              <p className="text-sm text-muted-foreground mt-2">{entry.notes}</p>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground">No symptoms tracked yet</p>
                        <Button 
                          className="mt-4" 
                          onClick={() => {
                            setActiveTab('tracker');
                            setIsAddSymptomOpen(true);
                          }}
                        >
                          Track Your First Symptom
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          // Emergency Scenario Detail
          selectedScenarioData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 space-y-6"
            >
              {/* Scenario Header */}
              <Card className={`border-2 ${
                selectedScenarioData.severity === 'high' 
                  ? 'border-destructive bg-destructive/5' 
                  : 'border-orange-400 dark:border-orange-600 bg-orange-50 dark:bg-orange-950/20'
              }`}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                      selectedScenarioData.severity === 'high' 
                        ? 'bg-destructive/20' 
                        : 'bg-orange-100 dark:bg-orange-900/50'
                    }`}>
                      <selectedScenarioData.icon className={`w-8 h-8 ${
                        selectedScenarioData.severity === 'high' 
                          ? 'text-destructive' 
                          : 'text-orange-600 dark:text-orange-400'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-foreground mb-1">{selectedScenarioData.title}</h2>
                      <Badge className={
                        selectedScenarioData.severity === 'high' 
                          ? 'bg-destructive text-white' 
                          : 'bg-orange-500 text-white'
                      }>
                        {selectedScenarioData.severity === 'high' ? 'EMERGENCY' : 'URGENT ATTENTION NEEDED'}
                      </Badge>
                    </div>
                  </div>

                  {selectedScenarioData.severity === 'high' && (
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => handleCallHotline('1190')}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call 1190 Emergency Now
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Symptoms */}
              <Card>
                <CardHeader>
                  <h3 className="text-foreground">⚠️ Symptoms to Watch For</h3>
                </CardHeader>
                <CardContent className="space-y-2">
                  {selectedScenarioData.symptoms.map((symptom, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground">{symptom}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Immediate Actions */}
              <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <h3 className="text-blue-800 dark:text-blue-400">📋 What To Do Right Now</h3>
                </CardHeader>
                <CardContent className="space-y-2">
                  {selectedScenarioData.immediateActions.map((action, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs flex-shrink-0">
                        {index + 1}
                      </div>
                      <span className="text-sm text-blue-900 dark:text-blue-300">{action}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* When to Call */}
              <Card className="bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-yellow-700 dark:text-yellow-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-yellow-800 dark:text-yellow-400 mb-1">When to Call for Help</h4>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">{selectedScenarioData.whenToCall}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Hotlines */}
              <Card>
                <CardHeader>
                  <h3 className="text-foreground flex items-center space-x-2">
                    <Phone className="w-5 h-5 text-green-600" />
                    <span>Emergency Contacts</span>
                  </h3>
                </CardHeader>
                <CardContent className="space-y-3">
                  {selectedScenarioData.hotlines.map((hotline, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                    >
                      <div className="flex-1">
                        <h4 className="text-foreground">{hotline.name}</h4>
                        <p className="text-xs text-muted-foreground">{hotline.description}</p>
                      </div>
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700 text-white ml-3"
                        onClick={() => handleCallHotline(hotline.number.replace(/\s/g, ''))}
                      >
                        <Phone className="w-3 h-3 mr-1" />
                        {hotline.number}
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )
        )}
      </div>

      {/* Add Symptom Dialog */}
      <Dialog open={isAddSymptomOpen} onOpenChange={setIsAddSymptomOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Track Symptom</DialogTitle>
            <DialogDescription>
              Record your symptom to help monitor your pregnancy health
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {!selectedSymptom ? (
              <>
                <Label>Select Symptom</Label>
                <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                  {symptoms.map((symptom) => (
                    <Card
                      key={symptom.id}
                      className="cursor-pointer hover:border-primary transition-colors"
                      onClick={() => setSelectedSymptom(symptom)}
                    >
                      <CardContent className="p-3 text-center">
                        <symptom.icon className={`w-6 h-6 ${symptom.color} mx-auto mb-1`} />
                        <p className="text-xs">{symptom.name}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                  <selectedSymptom.icon className={`w-8 h-8 ${selectedSymptom.color}`} />
                  <div>
                    <h4 className="text-foreground">{selectedSymptom.name}</h4>
                    <p className="text-xs text-muted-foreground">{selectedSymptom.description}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Severity: {getSeverityText(symptomSeverity)}</Label>
                  <Slider
                    value={[symptomSeverity]}
                    onValueChange={(v) => setSymptomSeverity(v[0])}
                    min={1}
                    max={5}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Mild</span>
                    <span>Moderate</span>
                    <span>Severe</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Notes (Optional)</Label>
                  <Textarea
                    placeholder="Add any additional details..."
                    value={symptomNotes}
                    onChange={(e) => setSymptomNotes(e.target.value)}
                    rows={3}
                  />
                </div>

                {selectedSymptom.seekHelp && (
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <p className="text-sm text-yellow-800 dark:text-yellow-400">
                      ⚠️ {selectedSymptom.guidance}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsAddSymptomOpen(false);
                setSelectedSymptom(null);
              }}
            >
              Cancel
            </Button>
            {selectedSymptom && (
              <Button onClick={handleAddSymptom}>
                Save Symptom
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
