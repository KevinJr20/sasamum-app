import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import {
  X, Phone, MessageCircle, Calendar, MapPin, Activity, Heart,
  AlertTriangle, User, FileText, Pill, TrendingUp, Brain,
  Video, Stethoscope, ClipboardList, History
} from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  avatar: string;
  age: number;
  currentWeek: number;
  dueDate: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  lastVisit: string;
  nextAppointment?: string;
  bloodPressure: string;
  weight: number;
  hemoglobin: string;
  phone: string;
  location: string;
  recentConcerns: string[];
  complications: string[];
  medications: any[];
  pastPregnancies: number;
}

interface EnhancedPatientDetailModalProps {
  patient: Patient | null;
  isOpen: boolean;
  onClose: () => void;
  onAIAnalysis?: () => void;
}

export function EnhancedPatientDetailModal({
  patient,
  isOpen,
  onClose,
  onAIAnalysis
}: EnhancedPatientDetailModalProps) {
  const [activeTab, setActiveTab] = useState('vitals');

  if (!patient) return null;

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical':
        return 'bg-red-600 text-white';
      case 'high':
        return 'bg-red-100 dark:bg-red-950/30 text-red-800 dark:text-red-400';
      case 'medium':
        return 'bg-orange-100 dark:bg-orange-950/30 text-orange-800 dark:text-orange-400';
      default:
        return 'bg-green-100 dark:bg-green-950/30 text-green-800 dark:text-green-400';
    }
  };

  // Mock lab reports
  const labReports = [
    {
      date: '2025-10-10',
      type: 'Complete Blood Count (CBC)',
      results: [
        { test: 'Hemoglobin', value: patient.hemoglobin, normal: '11-14 g/dL', status: 'normal' },
        { test: 'White Blood Cells', value: '7.5 x10³/μL', normal: '4-11 x10³/μL', status: 'normal' },
        { test: 'Platelets', value: '250 x10³/μL', normal: '150-400 x10³/μL', status: 'normal' }
      ]
    },
    {
      date: '2025-10-05',
      type: 'Liver Function Tests',
      results: [
        { test: 'ALT', value: '28 U/L', normal: '7-56 U/L', status: 'normal' },
        { test: 'AST', value: '32 U/L', normal: '10-40 U/L', status: 'normal' },
        { test: 'Albumin', value: '4.2 g/dL', normal: '3.5-5.5 g/dL', status: 'normal' }
      ]
    }
  ];

  // Mock visit history
  const visitHistory = [
    {
      date: patient.lastVisit,
      type: 'Regular ANC Visit',
      complaints: patient.recentConcerns,
      diagnosis: patient.complications.length > 0 ? patient.complications.join(', ') : 'Normal pregnancy',
      notes: 'Patient doing well. Fetal movements regular. No warning signs.'
    },
    {
      date: '2025-10-01',
      type: 'Regular ANC Visit',
      complaints: ['Routine checkup'],
      diagnosis: 'Normal pregnancy',
      notes: 'All parameters within normal range. Continue current regimen.'
    },
    {
      date: '2025-09-17',
      type: 'Initial Visit',
      complaints: ['Pregnancy confirmation'],
      diagnosis: 'Intrauterine pregnancy',
      notes: 'Dating scan done. Estimated gestational age confirmed.'
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 z-50 overflow-hidden"
          >
            <Card className="h-full bg-card border-border shadow-2xl flex flex-col">
              {/* Header */}
              <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between z-10">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-foreground">{patient.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {patient.age} years • Week {patient.currentWeek} • {patient.location}
                    </p>
                  </div>
                  <Badge className={getRiskColor(patient.riskLevel)}>
                    {patient.riskLevel.toUpperCase()} RISK
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="rounded-full"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Tabs */}
              <div className="flex-1 overflow-hidden">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                  <TabsList className="w-full justify-start border-b rounded-none bg-transparent px-4">
                    <TabsTrigger value="vitals" className="flex items-center space-x-2">
                      <Activity className="w-4 h-4" />
                      <span>Vitals</span>
                    </TabsTrigger>
                    <TabsTrigger value="labs" className="flex items-center space-x-2">
                      <ClipboardList className="w-4 h-4" />
                      <span>Lab Reports</span>
                    </TabsTrigger>
                    <TabsTrigger value="history" className="flex items-center space-x-2">
                      <History className="w-4 h-4" />
                      <span>History</span>
                    </TabsTrigger>
                    <TabsTrigger value="medications" className="flex items-center space-x-2">
                      <Pill className="w-4 h-4" />
                      <span>Medications</span>
                    </TabsTrigger>
                  </TabsList>

                  {/* Vitals Tab */}
                  <TabsContent value="vitals" className="flex-1 overflow-hidden m-0">
                    <ScrollArea className="h-full">
                      <div className="p-6 space-y-6">
                        {/* Current Vitals */}
                        <div>
                          <h4 className="text-sm text-muted-foreground mb-3">Current Vitals</h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <Card className="bg-accent/50">
                              <CardContent className="p-4">
                                <div className="flex items-center space-x-2 mb-1">
                                  <Activity className="w-4 h-4 text-primary" />
                                  <p className="text-xs text-muted-foreground">Blood Pressure</p>
                                </div>
                                <p className="text-xl text-foreground">{patient.bloodPressure}</p>
                                <p className="text-xs text-muted-foreground mt-1">mmHg</p>
                              </CardContent>
                            </Card>

                            <Card className="bg-accent/50">
                              <CardContent className="p-4">
                                <div className="flex items-center space-x-2 mb-1">
                                  <TrendingUp className="w-4 h-4 text-blue-500" />
                                  <p className="text-xs text-muted-foreground">Weight</p>
                                </div>
                                <p className="text-xl text-foreground">{patient.weight}</p>
                                <p className="text-xs text-muted-foreground mt-1">kg</p>
                              </CardContent>
                            </Card>

                            <Card className="bg-accent/50">
                              <CardContent className="p-4">
                                <div className="flex items-center space-x-2 mb-1">
                                  <Heart className="w-4 h-4 text-red-500" />
                                  <p className="text-xs text-muted-foreground">Hemoglobin</p>
                                </div>
                                <p className="text-xl text-foreground">{patient.hemoglobin}</p>
                              </CardContent>
                            </Card>

                            <Card className="bg-accent/50">
                              <CardContent className="p-4">
                                <div className="flex items-center space-x-2 mb-1">
                                  <Calendar className="w-4 h-4 text-green-500" />
                                  <p className="text-xs text-muted-foreground">Due Date</p>
                                </div>
                                <p className="text-sm text-foreground">
                                  {new Date(patient.dueDate).toLocaleDateString('en-KE')}
                                </p>
                              </CardContent>
                            </Card>

                            <Card className="bg-accent/50">
                              <CardContent className="p-4">
                                <div className="flex items-center space-x-2 mb-1">
                                  <Stethoscope className="w-4 h-4 text-purple-500" />
                                  <p className="text-xs text-muted-foreground">Gestational Age</p>
                                </div>
                                <p className="text-xl text-foreground">{patient.currentWeek}</p>
                                <p className="text-xs text-muted-foreground mt-1">weeks</p>
                              </CardContent>
                            </Card>

                            <Card className="bg-accent/50">
                              <CardContent className="p-4">
                                <div className="flex items-center space-x-2 mb-1">
                                  <User className="w-4 h-4 text-orange-500" />
                                  <p className="text-xs text-muted-foreground">Past Pregnancies</p>
                                </div>
                                <p className="text-xl text-foreground">{patient.pastPregnancies}</p>
                              </CardContent>
                            </Card>
                          </div>
                        </div>

                        {/* Recent Concerns */}
                        {patient.recentConcerns.length > 0 && (
                          <div>
                            <h4 className="text-sm text-muted-foreground mb-3">Recent Concerns & Symptoms</h4>
                            <div className="space-y-2">
                              {patient.recentConcerns.map((concern, index) => (
                                <div key={index} className="flex items-start space-x-2 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                                  <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5" />
                                  <p className="text-sm text-foreground">{concern}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Complications */}
                        {patient.complications.length > 0 && (
                          <div>
                            <h4 className="text-sm text-muted-foreground mb-3">Active Complications</h4>
                            <div className="space-y-2">
                              {patient.complications.map((complication, index) => (
                                <div key={index} className="flex items-start space-x-2 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-900">
                                  <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                                  <div>
                                    <p className="text-sm text-foreground">{complication}</p>
                                    <p className="text-xs text-muted-foreground mt-1">Requires close monitoring</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  {/* Lab Reports Tab */}
                  <TabsContent value="labs" className="flex-1 overflow-hidden m-0">
                    <ScrollArea className="h-full">
                      <div className="p-6 space-y-4">
                        {labReports.map((report, idx) => (
                          <Card key={idx} className="border-border">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <h4 className="text-foreground">{report.type}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {new Date(report.date).toLocaleDateString('en-KE')}
                                  </p>
                                </div>
                                <Button size="sm" variant="outline">
                                  <FileText className="w-3 h-3 mr-1" />
                                  View Full
                                </Button>
                              </div>
                              <div className="space-y-2">
                                {report.results.map((result, resultIdx) => (
                                  <div
                                    key={resultIdx}
                                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                                  >
                                    <div className="flex-1">
                                      <p className="text-sm text-foreground">{result.test}</p>
                                      <p className="text-xs text-muted-foreground">Normal: {result.normal}</p>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-sm text-foreground">{result.value}</p>
                                      <Badge
                                        className={
                                          result.status === 'normal'
                                            ? 'bg-green-100 dark:bg-green-950/30 text-green-800 dark:text-green-400 text-xs'
                                            : 'bg-red-100 dark:bg-red-950/30 text-red-800 dark:text-red-400 text-xs'
                                        }
                                      >
                                        {result.status}
                                      </Badge>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  {/* History Tab */}
                  <TabsContent value="history" className="flex-1 overflow-hidden m-0">
                    <ScrollArea className="h-full">
                      <div className="p-6 space-y-4">
                        {visitHistory.map((visit, idx) => (
                          <Card key={idx} className="border-border">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h4 className="text-foreground">{visit.type}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {new Date(visit.date).toLocaleDateString('en-KE', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric'
                                    })}
                                  </p>
                                </div>
                              </div>
                              <div className="space-y-3">
                                <div>
                                  <p className="text-xs text-muted-foreground mb-1">Chief Complaints:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {visit.complaints.map((complaint, compIdx) => (
                                      <Badge key={compIdx} variant="outline" className="text-xs">
                                        {complaint}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground mb-1">Diagnosis:</p>
                                  <p className="text-sm text-foreground">{visit.diagnosis}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground mb-1">Clinical Notes:</p>
                                  <p className="text-sm text-foreground">{visit.notes}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  {/* Medications Tab */}
                  <TabsContent value="medications" className="flex-1 overflow-hidden m-0">
                    <ScrollArea className="h-full">
                      <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-sm text-muted-foreground">Current Medications</h4>
                          <Button size="sm" variant="outline">
                            <Pill className="w-3 h-3 mr-1" />
                            Add New
                          </Button>
                        </div>
                        {patient.medications.map((med, idx) => (
                          <Card key={idx} className="border-border">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-3">
                                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <Pill className="w-5 h-5 text-primary" />
                                  </div>
                                  <div>
                                    <h4 className="text-foreground">{med.name}</h4>
                                    <p className="text-sm text-muted-foreground mt-1">
                                      Dosage: <span className="text-foreground">{med.dosage}</span>
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      Frequency: <span className="text-foreground">{med.frequency}</span>
                                    </p>
                                    <Badge className="mt-2 text-xs bg-green-100 dark:bg-green-950/30 text-green-800 dark:text-green-400">
                                      Active
                                    </Badge>
                                  </div>
                                </div>
                                <Button size="sm" variant="ghost">
                                  Edit
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Footer Actions */}
              <div className="border-t border-border p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => window.location.href = `tel:${patient.phone}`}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call
                  </Button>
                  <Button
                    className="bg-green-500 hover:bg-green-600 text-white"
                    onClick={() =>
                      window.open(
                        `https://wa.me/${patient.phone.replace(/[^0-9]/g, '')}`,
                        '_blank'
                      )
                    }
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp
                  </Button>
                  <Button variant="outline">
                    <Video className="w-4 h-4 mr-2" />
                    Video Call
                  </Button>
                  <Button
                    className="bg-primary hover:bg-primary/90"
                    onClick={() => {
                      onClose();
                      onAIAnalysis?.();
                    }}
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    AI Analysis
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
