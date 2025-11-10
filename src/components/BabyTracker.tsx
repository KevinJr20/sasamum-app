import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  ArrowLeft,
  Baby,
  Calendar,
  TrendingUp,
  Weight,
  Ruler,
  Heart,
  Activity,
  Bell,
  Plus,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';

interface BabyTrackerProps {
  onBack: () => void;
  userName?: string;
}

interface VaccineRecord {
  id: string;
  name: string;
  scheduledDate: Date;
  completedDate?: Date;
  ageInWeeks: number;
  status: 'completed' | 'due' | 'overdue' | 'upcoming';
  description: string;
}

interface GrowthRecord {
  id: string;
  date: Date;
  ageInWeeks: number;
  weight: number; // in kg
  length: number; // in cm
  headCircumference?: number; // in cm
  notes?: string;
}

export function BabyTracker({ onBack, userName = "Brenda" }: BabyTrackerProps) {
  const [activeTab, setActiveTab] = useState<'growth' | 'vaccines' | 'milestones'>('growth');
  
  // Mock baby data
  const babyInfo = {
    name: "Baby Aiden",
    birthDate: new Date('2024-11-01'),
    currentAgeWeeks: 6,
    lastWeight: 4.2,
    lastLength: 55,
    gender: 'boy'
  };

  // Kenyan immunization schedule
  const vaccineSchedule: VaccineRecord[] = [
    {
      id: '1',
      name: 'BCG',
      scheduledDate: new Date('2024-11-01'),
      completedDate: new Date('2024-11-01'),
      ageInWeeks: 0,
      status: 'completed',
      description: 'Protection against tuberculosis'
    },
    {
      id: '2',
      name: 'OPV 0 (Birth dose)',
      scheduledDate: new Date('2024-11-01'),
      completedDate: new Date('2024-11-01'),
      ageInWeeks: 0,
      status: 'completed',
      description: 'Oral Polio Vaccine - birth dose'
    },
    {
      id: '3',
      name: 'Pentavalent 1',
      scheduledDate: new Date('2024-12-06'),
      ageInWeeks: 6,
      status: 'due',
      description: 'DPT-HepB-Hib combination vaccine'
    },
    {
      id: '4',
      name: 'OPV 1',
      scheduledDate: new Date('2024-12-06'),
      ageInWeeks: 6,
      status: 'due',
      description: 'Oral Polio Vaccine - first dose'
    },
    {
      id: '5',
      name: 'PCV 1',
      scheduledDate: new Date('2024-12-06'),
      ageInWeeks: 6,
      status: 'due',
      description: 'Pneumococcal Conjugate Vaccine'
    },
    {
      id: '6',
      name: 'Rotavirus 1',
      scheduledDate: new Date('2024-12-06'),
      ageInWeeks: 6,
      status: 'due',
      description: 'Protection against rotavirus diarrhea'
    },
    {
      id: '7',
      name: 'Pentavalent 2',
      scheduledDate: new Date('2025-01-03'),
      ageInWeeks: 10,
      status: 'upcoming',
      description: 'DPT-HepB-Hib combination vaccine - second dose'
    }
  ];

  const growthRecords: GrowthRecord[] = [
    {
      id: '1',
      date: new Date('2024-11-01'),
      ageInWeeks: 0,
      weight: 3.2,
      length: 50,
      headCircumference: 34,
      notes: 'Birth measurements'
    },
    {
      id: '2',
      date: new Date('2024-11-08'),
      ageInWeeks: 1,
      weight: 3.4,
      length: 51,
      headCircumference: 34.5,
      notes: 'Good weight gain'
    },
    {
      id: '3',
      date: new Date('2024-11-22'),
      ageInWeeks: 3,
      weight: 3.8,
      length: 53,
      headCircumference: 35.5,
      notes: 'Healthy growth pattern'
    },
    {
      id: '4',
      date: new Date('2024-12-06'),
      ageInWeeks: 5,
      weight: 4.2,
      length: 55,
      headCircumference: 36.2,
      notes: 'Meeting growth milestones'
    }
  ];

  const upcomingVaccines = vaccineSchedule.filter(v => v.status === 'due' || v.status === 'overdue');
  const completedVaccines = vaccineSchedule.filter(v => v.status === 'completed');

  const getVaccineStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'due': return 'text-orange-600 bg-orange-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      case 'upcoming': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-background w-full"
    >
      <div className="max-w-7xl mx-auto w-full">{/* Responsive wrapper */}
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 flex items-center justify-between p-4 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
        <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </Button>
        <h1 className="text-lg text-foreground">Baby Tracker</h1>
        <Button variant="ghost" size="sm" className="p-2">
          <Plus className="w-6 h-6 text-foreground" />
        </Button>
      </div>

      {/* Baby Info Card */}
      <div className="p-4 bg-card border-b border-border">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                <Baby className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-foreground">{babyInfo.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {babyInfo.currentAgeWeeks} weeks old
                </p>
                <div className="flex items-center space-x-4 mt-2 text-sm">
                  <div className="flex items-center space-x-1">
                    <Weight className="w-4 h-4 text-primary" />
                    <span className="text-foreground">{babyInfo.lastWeight} kg</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Ruler className="w-4 h-4 text-primary" />
                    <span className="text-foreground">{babyInfo.lastLength} cm</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="bg-card border-b border-border">
        <div className="flex">
          {[
            { id: 'growth', label: 'Growth', icon: TrendingUp },
            { id: 'vaccines', label: 'Vaccines', icon: Calendar },
            { id: 'milestones', label: 'Milestones', icon: Heart }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-4 px-2 flex items-center justify-center space-x-2 text-sm transition-colors ${
                activeTab === tab.id
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="pb-20">
        {/* Growth Tab */}
        {activeTab === 'growth' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 space-y-4"
          >
            {/* Growth Chart Summary */}
            <Card className="border-border">
              <CardHeader className="pb-3">
                <h4 className="text-foreground">Growth Progress</h4>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <Weight className="w-6 h-6 text-primary mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Weight</p>
                    <p className="text-lg text-foreground">{babyInfo.lastWeight} kg</p>
                    <p className="text-xs text-green-600">+0.4kg this week</p>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <Ruler className="w-6 h-6 text-primary mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Length</p>
                    <p className="text-lg text-foreground">{babyInfo.lastLength} cm</p>
                    <p className="text-xs text-green-600">+2cm this week</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Weight Percentile</span>
                    <span className="text-foreground">65th percentile</span>
                  </div>
                  <Progress value={65} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    Your baby is growing well and is in the healthy range
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Growth Records */}
            <div className="space-y-3">
              <h4 className="text-foreground">Growth History</h4>
              {growthRecords.slice().reverse().map((record, index) => (
                <Card key={record.id} className="border-border">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="text-sm text-foreground">
                          Week {record.ageInWeeks}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {record.date.toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="flex items-center space-x-3 text-sm">
                          <span className="text-foreground">{record.weight}kg</span>
                          <span className="text-foreground">{record.length}cm</span>
                        </div>
                        {record.notes && (
                          <p className="text-xs text-muted-foreground">
                            {record.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* Vaccines Tab */}
        {activeTab === 'vaccines' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 space-y-4"
          >
            {/* Upcoming Vaccines Alert */}
            {upcomingVaccines.length > 0 && (
              <Card className="border-orange-200 bg-orange-50">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Bell className="w-5 h-5 text-orange-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-orange-800">Vaccines Due</h4>
                      <p className="text-sm text-orange-700 mt-1">
                        {upcomingVaccines.length} vaccine(s) are due for {babyInfo.name}
                      </p>
                      <Button size="sm" className="mt-2 bg-orange-600 hover:bg-orange-700">
                        Schedule Appointment
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Vaccine Progress */}
            <Card className="border-border">
              <CardHeader className="pb-3">
                <h4 className="text-foreground">Immunization Progress</h4>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Completed</span>
                    <span className="text-foreground">
                      {completedVaccines.length} of {vaccineSchedule.length}
                    </span>
                  </div>
                  <Progress 
                    value={(completedVaccines.length / vaccineSchedule.length) * 100} 
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Vaccine Schedule */}
            <div className="space-y-3">
              <h4 className="text-foreground">Vaccine Schedule</h4>
              {vaccineSchedule.map((vaccine) => (
                <Card key={vaccine.id} className="border-border">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className={`w-3 h-3 rounded-full mt-2 ${
                        vaccine.status === 'completed' ? 'bg-green-500' :
                        vaccine.status === 'due' ? 'bg-orange-500' :
                        vaccine.status === 'overdue' ? 'bg-red-500' :
                        'bg-gray-300'
                      }`} />
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h5 className="text-foreground">{vaccine.name}</h5>
                            <p className="text-sm text-muted-foreground">
                              {vaccine.description}
                            </p>
                          </div>
                          <Badge className={`text-xs ${getVaccineStatusColor(vaccine.status)}`}>
                            {vaccine.status}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>
                              {vaccine.status === 'completed' && vaccine.completedDate
                                ? `Given ${vaccine.completedDate.toLocaleDateString()}`
                                : `Due ${vaccine.scheduledDate.toLocaleDateString()}`
                              }
                            </span>
                          </div>
                          <span>Week {vaccine.ageInWeeks}</span>
                        </div>

                        {vaccine.status === 'completed' && (
                          <div className="flex items-center space-x-1 mt-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-xs text-green-600">Completed</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* Milestones Tab */}
        {activeTab === 'milestones' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 space-y-4"
          >
            <Card className="border-border">
              <CardHeader className="pb-3">
                <h4 className="text-foreground">Development Milestones</h4>
                <p className="text-sm text-muted-foreground">
                  Track your baby's important developmental achievements
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-8">
                  <Baby className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">
                    Milestone tracking coming soon!
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    We're working on comprehensive milestone tracking features
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
      </div>{/* Close responsive wrapper */}
    </motion.div>
  );
}
