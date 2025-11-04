import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  X,
  Phone,
  MessageCircle,
  Calendar,
  MapPin,
  Activity,
  Heart,
  AlertTriangle,
  User,
  FileText
} from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  avatar: string;
  currentWeek: number;
  dueDate: string;
  riskLevel: 'low' | 'medium' | 'high';
  lastVisit: string;
  nextAppointment: string;
  recentConcerns: string[];
  location: string;
  phone: string;
  emergencyContact: string;
  bloodPressure?: string;
  weight?: string;
  hemoglobin?: string;
  notes?: string;
}

interface PatientDetailModalProps {
  patient: Patient | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PatientDetailModal({ patient, isOpen, onClose }: PatientDetailModalProps) {
  if (!patient) return null;

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-red-100 dark:bg-red-950/30 text-red-800 dark:text-red-400';
      case 'medium': return 'bg-orange-100 dark:bg-orange-950/30 text-orange-800 dark:text-orange-400';
      default: return 'bg-green-100 dark:bg-green-950/30 text-green-800 dark:text-green-400';
    }
  };

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
            className="fixed inset-4 md:inset-10 z-50 overflow-y-auto"
          >
            <Card className="max-w-3xl mx-auto bg-card border-border shadow-2xl">
              <CardContent className="p-0">
                {/* Header */}
                <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between z-10">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-foreground">{patient.name}</h3>
                      <p className="text-sm text-muted-foreground">Week {patient.currentWeek} • {patient.location}</p>
                    </div>
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

                {/* Content */}
                <div className="p-6 space-y-6">
                  {/* Risk Level */}
                  <div>
                    <h4 className="text-sm text-muted-foreground mb-2">Risk Level</h4>
                    <Badge className={getRiskColor(patient.riskLevel)}>
                      {patient.riskLevel.toUpperCase()} RISK
                    </Badge>
                  </div>

                  {/* Vital Information Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="bg-accent/50">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2 mb-1">
                          <Activity className="w-4 h-4 text-primary" />
                          <p className="text-xs text-muted-foreground">Blood Pressure</p>
                        </div>
                        <p className="text-foreground">{patient.bloodPressure || 'N/A'}</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-accent/50">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2 mb-1">
                          <Activity className="w-4 h-4 text-primary" />
                          <p className="text-xs text-muted-foreground">Weight</p>
                        </div>
                        <p className="text-foreground">{patient.weight || 'N/A'}</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-accent/50">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2 mb-1">
                          <Heart className="w-4 h-4 text-red-500" />
                          <p className="text-xs text-muted-foreground">Hemoglobin</p>
                        </div>
                        <p className="text-foreground">{patient.hemoglobin || 'N/A'}</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-accent/50">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2 mb-1">
                          <Calendar className="w-4 h-4 text-primary" />
                          <p className="text-xs text-muted-foreground">Due Date</p>
                        </div>
                        <p className="text-foreground">{new Date(patient.dueDate).toLocaleDateString()}</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Appointment Info */}
                  <div className="space-y-3">
                    <h4 className="text-sm text-muted-foreground">Appointments</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
                        <CardContent className="p-3">
                          <p className="text-xs text-muted-foreground mb-1">Last Visit</p>
                          <p className="text-sm text-foreground">{new Date(patient.lastVisit).toLocaleDateString()}</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900">
                        <CardContent className="p-3">
                          <p className="text-xs text-muted-foreground mb-1">Next Appointment</p>
                          <p className="text-sm text-foreground">{new Date(patient.nextAppointment).toLocaleDateString()}</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Recent Concerns */}
                  <div>
                    <h4 className="text-sm text-muted-foreground mb-3">Recent Concerns & Symptoms</h4>
                    <div className="space-y-2">
                      {patient.recentConcerns.map((concern, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5" />
                          <p className="text-sm text-foreground">{concern}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Clinical Notes */}
                  {patient.notes && (
                    <div>
                      <h4 className="text-sm text-muted-foreground mb-2 flex items-center space-x-2">
                        <FileText className="w-4 h-4" />
                        <span>Clinical Notes</span>
                      </h4>
                      <Card className="bg-accent/30">
                        <CardContent className="p-4">
                          <p className="text-sm text-foreground leading-relaxed">{patient.notes}</p>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Contact Information */}
                  <div>
                    <h4 className="text-sm text-muted-foreground mb-3">Contact Information</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">{patient.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-red-500" />
                        <span className="text-sm text-foreground">Emergency: {patient.emergencyContact}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">{patient.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3 pt-4">
                    <Button 
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => window.location.href = `tel:${patient.phone}`}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call Patient
                    </Button>
                    <Button 
                      className="bg-green-500 hover:bg-green-600 text-white"
                      onClick={() => window.open(`https://wa.me/${patient.phone.replace(/[^0-9]/g, '')}`, '_blank')}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      WhatsApp
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => alert('Opening in-app chat with ' + patient.name)}
                      className="col-span-2"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Chat In-App
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
