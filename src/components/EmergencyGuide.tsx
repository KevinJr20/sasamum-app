import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  ArrowLeft,
  Phone,
  AlertTriangle,
  Clock,
  MapPin,
  Heart,
  Activity,
  Thermometer,
  Droplets,
  Baby,
  Car,
  Navigation
} from 'lucide-react';

interface EmergencyGuideProps {
  onBack: () => void;
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

export function EmergencyGuide({ onBack }: EmergencyGuideProps) {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);

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
    }
  ];

  const getScenarioCard = (scenario: EmergencyScenario) => (
    <Card 
      key={scenario.id}
      className={`border-2 cursor-pointer transition-all hover:shadow-lg ${
        scenario.severity === 'high' 
          ? 'border-destructive/30 bg-destructive/5 hover:border-destructive/50' 
          : 'border-orange-300 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-600/30 hover:border-orange-400 dark:hover:border-orange-500'
      }`}
      onClick={() => setSelectedScenario(scenario.id)}
    >
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            scenario.severity === 'high' 
              ? 'bg-destructive/10 dark:bg-destructive/20' 
              : 'bg-orange-100 dark:bg-orange-900/30'
          }`}>
            <scenario.icon className={`w-6 h-6 ${
              scenario.severity === 'high' 
                ? 'text-destructive' 
                : 'text-orange-600 dark:text-orange-400'
            }`} />
          </div>
          <div className="flex-1">
            <h3 className="text-foreground">{scenario.title}</h3>
            <Badge 
              className={`mt-1 ${
                scenario.severity === 'high' 
                  ? 'bg-destructive/10 text-destructive border-destructive/20' 
                  : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-300 dark:border-orange-600/30'
              }`}
            >
              {scenario.severity === 'high' ? 'High Priority' : 'Monitor Closely'}
            </Badge>
          </div>
          <ArrowLeft className="w-5 h-5 text-muted-foreground rotate-180" />
        </div>
      </CardContent>
    </Card>
  );

  const selectedScenarioData = emergencyScenarios.find(s => s.id === selectedScenario);

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
        <h1 className="text-lg text-foreground">Emergency Guide</h1>
        <Button variant="ghost" size="sm" className="p-2">
          <Phone className="w-6 h-6 text-green-600" />
        </Button>
      </div>

      {/* Quick Emergency Actions */}
      <div className="p-4 bg-destructive/10 border-b border-destructive/20">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="text-destructive text-sm font-medium">Emergency? Call Immediately</h4>
            <div className="mt-2 space-y-1">
              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white mr-2">
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
          // Emergency Scenarios List
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 space-y-6"
          >
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
                .map(getScenarioCard)}
            </div>

            <div className="space-y-4">
              <h3 className="text-orange-600 dark:text-orange-400">⚠️ Monitor & Contact Provider</h3>
              {emergencyScenarios
                .filter(s => s.severity === 'medium')
                .map(getScenarioCard)}
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
                  <div className="flex justify-between">
                    <span className="text-blue-700 dark:text-blue-300">Emergency Ambulance</span>
                    <span className="text-blue-800 dark:text-blue-200 font-medium">1190</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700 dark:text-blue-300">Health Helpline</span>
                    <span className="text-blue-800 dark:text-blue-200 font-medium">719</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700 dark:text-blue-300">Mental Health Support</span>
                    <span className="text-blue-800 dark:text-blue-200 font-medium">0800 720 811</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preparation Tips */}
            <Card className="bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800">
              <CardHeader className="pb-3">
                <h4 className="text-green-800 dark:text-green-400">Emergency Preparedness</h4>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm text-green-700 dark:text-green-300 space-y-1">
                  <p>• Keep important numbers saved in your phone</p>
                  <p>• Know the quickest route to your hospital</p>
                  <p>• Have emergency bag ready after 32 weeks</p>
                  <p>• Share this info with your partner/family</p>
                  <p>• Keep transportation money readily available</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          // Detailed Emergency Scenario
          selectedScenarioData && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 space-y-6"
            >
              {/* Scenario Header */}
              <Card className={`${
                selectedScenarioData.severity === 'high' 
                  ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800' 
                  : 'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800'
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      selectedScenarioData.severity === 'high' 
                        ? 'bg-red-100 dark:bg-red-900/40' 
                        : 'bg-orange-100 dark:bg-orange-900/40'
                    }`}>
                      <selectedScenarioData.icon className={`w-6 h-6 ${
                        selectedScenarioData.severity === 'high' 
                          ? 'text-red-600 dark:text-red-400' 
                          : 'text-orange-600 dark:text-orange-400'
                      }`} />
                    </div>
                    <div>
                      <h2 className="text-foreground font-medium">{selectedScenarioData.title}</h2>
                      <Badge className={`${
                        selectedScenarioData.severity === 'high' 
                          ? 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200' 
                          : 'bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-200'
                      }`}>
                        {selectedScenarioData.severity === 'high' ? 'High Priority' : 'Monitor Closely'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* When to Call */}
              <Card className="border-border bg-card">
                <CardHeader className="pb-3">
                  <h4 className="text-foreground flex items-center space-x-2 font-medium">
                    <Clock className="w-5 h-5 text-primary" />
                    <span>When to Seek Help</span>
                  </h4>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground leading-relaxed font-medium">
                    {selectedScenarioData.whenToCall}
                  </p>
                </CardContent>
              </Card>

              {/* Symptoms */}
              <Card className="border-border bg-card">
                <CardHeader className="pb-3">
                  <h4 className="text-foreground font-medium">Warning Signs</h4>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedScenarioData.symptoms.map((symptom, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <p className="text-sm text-foreground">{symptom}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Immediate Actions */}
              <Card className="border-border bg-card">
                <CardHeader className="pb-3">
                  <h4 className="text-foreground font-medium">What to Do Right Now</h4>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedScenarioData.immediateActions.map((action, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs flex-shrink-0 font-medium">
                          {index + 1}
                        </div>
                        <p className="text-sm text-foreground">{action}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Contacts */}
              <Card className="border-border bg-card">
                <CardHeader className="pb-3">
                  <h4 className="text-foreground flex items-center space-x-2 font-medium">
                    <Phone className="w-5 h-5 text-primary" />
                    <span>Emergency Contacts</span>
                  </h4>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedScenarioData.hotlines.map((hotline, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex-1 min-w-0 mr-3">
                          <p className="text-foreground font-medium">{hotline.name}</p>
                          <p className="text-xs text-muted-foreground">{hotline.description}</p>
                        </div>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white flex-shrink-0">
                          <Phone className="w-3 h-3 mr-1" />
                          Call
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-3">
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <Phone className="w-4 h-4 mr-2" />
                  Call 1190
                </Button>
                <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                  <Car className="w-4 h-4 mr-2" />
                  Get Transport
                </Button>
              </div>
            </motion.div>
          )
        )}
      </div>
    </motion.div>
  );
}