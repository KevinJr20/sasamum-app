import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { toast } from 'sonner@2.0.3';
import { 
  ArrowLeft,
  Pill,
  Calendar,
  Clock,
  Plus,
  Phone,
  MapPin,
  AlertCircle,
  CheckCircle2,
  Bell,
  Hospital,
  User,
  Trash2,
  Edit,
  Save,
  X,
  RefreshCw,
  Stethoscope,
  Video,
  MessageSquare
} from 'lucide-react';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  times: string[];
  startDate: string;
  endDate?: string;
  refillDate?: string;
  instructions?: string;
  prescribedBy?: string;
}

interface Appointment {
  id: string;
  type: string;
  date: string;
  time: string;
  provider: string;
  location: string;
  notes?: string;
  isVirtual?: boolean;
}

interface HealthcareProvider {
  id: string;
  name: string;
  specialty: string;
  phone: string;
  facility: string;
  email?: string;
  isPrimary?: boolean;
}

interface MedicationRemindersProps {
  onBack: () => void;
}

export function MedicationReminders({ onBack }: MedicationRemindersProps) {
  const [activeTab, setActiveTab] = useState<'medications' | 'appointments' | 'providers'>('medications');
  const [showMedicationDialog, setShowMedicationDialog] = useState(false);
  const [showAppointmentDialog, setShowAppointmentDialog] = useState(false);
  const [showProviderDialog, setShowProviderDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const [medications, setMedications] = useState<Medication[]>([
    {
      id: '1',
      name: 'Prenatal Vitamins',
      dosage: '1 tablet',
      frequency: 'Once daily',
      times: ['08:00'],
      startDate: '2024-01-01',
      instructions: 'Take with food',
      prescribedBy: 'Dr. Sarah Wanjiru'
    },
    {
      id: '2',
      name: 'Folic Acid',
      dosage: '400mcg',
      frequency: 'Once daily',
      times: ['08:00'],
      startDate: '2024-01-01',
      refillDate: '2024-12-25',
      prescribedBy: 'Dr. Sarah Wanjiru'
    },
    {
      id: '3',
      name: 'Iron Supplement',
      dosage: '65mg',
      frequency: 'Twice daily',
      times: ['08:00', '20:00'],
      startDate: '2024-02-15',
      instructions: 'Take with vitamin C for better absorption',
      prescribedBy: 'Dr. Sarah Wanjiru'
    }
  ]);

  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      type: 'Prenatal Checkup',
      date: '2024-12-20',
      time: '10:00',
      provider: 'Dr. Sarah Wanjiru',
      location: 'Nairobi Women\'s Hospital',
      notes: 'Routine checkup - Week 20 scan'
    },
    {
      id: '2',
      type: 'Ultrasound',
      date: '2024-12-22',
      time: '14:30',
      provider: 'Dr. James Mwangi',
      location: 'Aga Khan Hospital',
      notes: 'Anatomy scan'
    },
    {
      id: '3',
      type: 'Nutrition Consultation',
      date: '2024-12-28',
      time: '11:00',
      provider: 'Nutritionist Mary Kamau',
      location: 'Virtual Consultation',
      isVirtual: true,
      notes: 'Diet planning for third trimester'
    }
  ]);

  const [providers, setProviders] = useState<HealthcareProvider[]>([
    {
      id: '1',
      name: 'Dr. Sarah Wanjiru',
      specialty: 'Obstetrician/Gynecologist',
      phone: '+254 712 345 678',
      facility: 'Nairobi Women\'s Hospital',
      email: 'dr.wanjiru@nwh.co.ke',
      isPrimary: true
    },
    {
      id: '2',
      name: 'Dr. James Mwangi',
      specialty: 'Radiologist',
      phone: '+254 722 123 456',
      facility: 'Aga Khan Hospital',
      email: 'dr.mwangi@akhospital.co.ke'
    },
    {
      id: '3',
      name: 'Nutritionist Mary Kamau',
      specialty: 'Maternal Nutrition Specialist',
      phone: '+254 733 987 654',
      facility: 'Healthy Mama Clinic',
      email: 'mary@healthymama.co.ke'
    }
  ]);

  const [newMedication, setNewMedication] = useState<Partial<Medication>>({
    times: ['08:00']
  });

  const [newAppointment, setNewAppointment] = useState<Partial<Appointment>>({});
  const [newProvider, setNewProvider] = useState<Partial<HealthcareProvider>>({});

  const getTodaysMedications = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    return medications.filter(med => {
      return med.times.some(time => {
        const [hour, minute] = time.split(':').map(Number);
        return hour === currentHour && minute >= currentMinute - 30 && minute <= currentMinute + 30;
      });
    });
  };

  const getUpcomingAppointments = () => {
    const now = new Date();
    return appointments
      .filter(apt => new Date(apt.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3);
  };

  const getMedicationsNeedingRefill = () => {
    const now = new Date();
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return medications.filter(med => {
      if (med.refillDate) {
        const refillDate = new Date(med.refillDate);
        return refillDate >= now && refillDate <= weekFromNow;
      }
      return false;
    });
  };

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleAddMedication = () => {
    if (!newMedication.name || !newMedication.dosage) {
      toast.error('Please fill in all required fields');
      return;
    }

    const medication: Medication = {
      id: Date.now().toString(),
      name: newMedication.name,
      dosage: newMedication.dosage,
      frequency: newMedication.frequency || 'Once daily',
      times: newMedication.times || ['08:00'],
      startDate: newMedication.startDate || new Date().toISOString().split('T')[0],
      endDate: newMedication.endDate,
      refillDate: newMedication.refillDate,
      instructions: newMedication.instructions,
      prescribedBy: newMedication.prescribedBy
    };

    setMedications([...medications, medication]);
    setNewMedication({ times: ['08:00'] });
    setShowMedicationDialog(false);
    toast.success('Medication added successfully');
  };

  const handleAddAppointment = () => {
    if (!newAppointment.type || !newAppointment.date || !newAppointment.time) {
      toast.error('Please fill in all required fields');
      return;
    }

    const appointment: Appointment = {
      id: Date.now().toString(),
      type: newAppointment.type,
      date: newAppointment.date,
      time: newAppointment.time,
      provider: newAppointment.provider || '',
      location: newAppointment.location || '',
      notes: newAppointment.notes,
      isVirtual: newAppointment.isVirtual
    };

    setAppointments([...appointments, appointment]);
    setNewAppointment({});
    setShowAppointmentDialog(false);
    toast.success('Appointment added successfully');
  };

  const handleAddProvider = () => {
    if (!newProvider.name || !newProvider.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    const provider: HealthcareProvider = {
      id: Date.now().toString(),
      name: newProvider.name,
      specialty: newProvider.specialty || '',
      phone: newProvider.phone,
      facility: newProvider.facility || '',
      email: newProvider.email,
      isPrimary: newProvider.isPrimary
    };

    setProviders([...providers, provider]);
    setNewProvider({});
    setShowProviderDialog(false);
    toast.success('Provider added successfully');
  };

  const handleDeleteMedication = (id: string) => {
    setMedications(medications.filter(med => med.id !== id));
    toast.success('Medication deleted');
  };

  const handleDeleteAppointment = (id: string) => {
    setAppointments(appointments.filter(apt => apt.id !== id));
    toast.success('Appointment deleted');
  };

  const handleDeleteProvider = (id: string) => {
    setProviders(providers.filter(prov => prov.id !== id));
    toast.success('Provider deleted');
  };

  const tabs = [
    { id: 'medications', label: 'Medications', icon: Pill },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'providers', label: 'Providers', icon: Stethoscope }
  ];

  const todaysMeds = getTodaysMedications();
  const upcomingApts = getUpcomingAppointments();
  const refillNeeded = getMedicationsNeedingRefill();

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
        <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </Button>
        <h1 className="text-lg text-foreground">Health Reminders</h1>
        <div className="w-10" />
      </div>

      {/* Quick Stats */}
      <div className="p-4 space-y-3">
        {todaysMeds.length > 0 && (
          <Card className="bg-primary/10 border-primary/30">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-primary" />
                <div className="flex-1">
                  <p className="text-sm text-foreground">
                    {todaysMeds.length} medication{todaysMeds.length > 1 ? 's' : ''} due soon
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {todaysMeds.map(m => m.name).join(', ')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {upcomingApts.length > 0 && (
          <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div className="flex-1">
                  <p className="text-sm text-foreground">
                    Next appointment: {upcomingApts[0].type}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(upcomingApts[0].date).toLocaleDateString()} at {upcomingApts[0].time}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {refillNeeded.length > 0 && (
          <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <RefreshCw className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <div className="flex-1">
                  <p className="text-sm text-foreground">
                    {refillNeeded.length} medication{refillNeeded.length > 1 ? 's' : ''} need refill soon
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {refillNeeded.map(m => m.name).join(', ')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Tabs */}
      <div className="sticky top-[73px] z-30 bg-card border-b border-border">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-3 text-sm whitespace-nowrap transition-colors ${
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

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Medications Tab */}
        {activeTab === 'medications' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <Button 
              onClick={() => setShowMedicationDialog(true)}
              className="w-full bg-primary hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Medication
            </Button>

            {medications.length === 0 ? (
              <Card className="border-border">
                <CardContent className="p-8 text-center">
                  <Pill className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No medications added yet</p>
                </CardContent>
              </Card>
            ) : (
              medications.map((med) => (
                <Card key={med.id} className="border-border">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="text-foreground">{med.name}</h4>
                        <p className="text-sm text-muted-foreground">{med.dosage}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteMedication(med.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{med.frequency} - {med.times.join(', ')}</span>
                      </div>
                      
                      {med.instructions && (
                        <div className="flex items-start space-x-2 text-muted-foreground">
                          <AlertCircle className="w-4 h-4 mt-0.5" />
                          <span>{med.instructions}</span>
                        </div>
                      )}

                      {med.prescribedBy && (
                        <div className="flex items-center space-x-2 text-muted-foreground">
                          <User className="w-4 h-4" />
                          <span>Prescribed by {med.prescribedBy}</span>
                        </div>
                      )}

                      {med.refillDate && (
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                          <span className="text-muted-foreground">Refill by:</span>
                          <Badge variant="outline">
                            {new Date(med.refillDate).toLocaleDateString()}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </motion.div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <Button 
              onClick={() => setShowAppointmentDialog(true)}
              className="w-full bg-primary hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Appointment
            </Button>

            {appointments.length === 0 ? (
              <Card className="border-border">
                <CardContent className="p-8 text-center">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No appointments scheduled</p>
                </CardContent>
              </Card>
            ) : (
              appointments
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map((apt) => (
                  <Card 
                    key={apt.id} 
                    className={`border-border ${
                      new Date(apt.date) < new Date() ? 'opacity-50' : ''
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="text-foreground">{apt.type}</h4>
                            {apt.isVirtual && (
                              <Badge variant="secondary" className="text-xs">
                                <Video className="w-3 h-3 mr-1" />
                                Virtual
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-primary">
                            {new Date(apt.date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteAppointment(apt.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{apt.time}</span>
                        </div>

                        {apt.provider && (
                          <div className="flex items-center space-x-2 text-muted-foreground">
                            <User className="w-4 h-4" />
                            <span>{apt.provider}</span>
                          </div>
                        )}

                        {apt.location && (
                          <div className="flex items-center space-x-2 text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>{apt.location}</span>
                          </div>
                        )}

                        {apt.notes && (
                          <div className="mt-3 pt-3 border-t border-border">
                            <p className="text-muted-foreground italic">{apt.notes}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
            )}
          </motion.div>
        )}

        {/* Providers Tab */}
        {activeTab === 'providers' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <Button 
              onClick={() => setShowProviderDialog(true)}
              className="w-full bg-primary hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Healthcare Provider
            </Button>

            {providers.length === 0 ? (
              <Card className="border-border">
                <CardContent className="p-8 text-center">
                  <Stethoscope className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No providers added yet</p>
                </CardContent>
              </Card>
            ) : (
              providers.map((provider) => (
                <Card key={provider.id} className="border-border">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="text-foreground">{provider.name}</h4>
                          {provider.isPrimary && (
                            <Badge className="text-xs bg-primary">Primary</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{provider.specialty}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteProvider(provider.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <Hospital className="w-4 h-4" />
                        <span>{provider.facility}</span>
                      </div>

                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        <span>{provider.phone}</span>
                      </div>

                      {provider.email && (
                        <div className="flex items-center space-x-2 text-muted-foreground">
                          <MessageSquare className="w-4 h-4" />
                          <span>{provider.email}</span>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        onClick={() => handleCall(provider.phone)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                        size="sm"
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Call
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.location.href = `mailto:${provider.email}`}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Email
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </motion.div>
        )}
      </div>

      {/* Add Medication Dialog */}
      <Dialog open={showMedicationDialog} onOpenChange={setShowMedicationDialog}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Medication</DialogTitle>
            <DialogDescription>
              Track your medications and set reminders
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Medication Name *</Label>
              <Input
                value={newMedication.name || ''}
                onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
                placeholder="e.g., Prenatal Vitamins"
              />
            </div>

            <div>
              <Label>Dosage *</Label>
              <Input
                value={newMedication.dosage || ''}
                onChange={(e) => setNewMedication({ ...newMedication, dosage: e.target.value })}
                placeholder="e.g., 1 tablet, 400mcg"
              />
            </div>

            <div>
              <Label>Frequency</Label>
              <Input
                value={newMedication.frequency || ''}
                onChange={(e) => setNewMedication({ ...newMedication, frequency: e.target.value })}
                placeholder="e.g., Once daily, Twice daily"
              />
            </div>

            <div>
              <Label>Time(s)</Label>
              <Input
                value={newMedication.times?.[0] || ''}
                onChange={(e) => setNewMedication({ ...newMedication, times: [e.target.value] })}
                type="time"
              />
            </div>

            <div>
              <Label>Start Date</Label>
              <Input
                value={newMedication.startDate || ''}
                onChange={(e) => setNewMedication({ ...newMedication, startDate: e.target.value })}
                type="date"
              />
            </div>

            <div>
              <Label>Refill Date (Optional)</Label>
              <Input
                value={newMedication.refillDate || ''}
                onChange={(e) => setNewMedication({ ...newMedication, refillDate: e.target.value })}
                type="date"
              />
            </div>

            <div>
              <Label>Instructions (Optional)</Label>
              <Input
                value={newMedication.instructions || ''}
                onChange={(e) => setNewMedication({ ...newMedication, instructions: e.target.value })}
                placeholder="e.g., Take with food"
              />
            </div>

            <div>
              <Label>Prescribed By (Optional)</Label>
              <Input
                value={newMedication.prescribedBy || ''}
                onChange={(e) => setNewMedication({ ...newMedication, prescribedBy: e.target.value })}
                placeholder="e.g., Dr. Sarah Wanjiru"
              />
            </div>

            <div className="flex space-x-2 pt-4">
              <Button 
                onClick={handleAddMedication}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Medication
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  setShowMedicationDialog(false);
                  setNewMedication({ times: ['08:00'] });
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Appointment Dialog */}
      <Dialog open={showAppointmentDialog} onOpenChange={setShowAppointmentDialog}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Appointment</DialogTitle>
            <DialogDescription>
              Schedule your prenatal checkups and clinic visits
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Appointment Type *</Label>
              <Input
                value={newAppointment.type || ''}
                onChange={(e) => setNewAppointment({ ...newAppointment, type: e.target.value })}
                placeholder="e.g., Prenatal Checkup, Ultrasound"
              />
            </div>

            <div>
              <Label>Date *</Label>
              <Input
                value={newAppointment.date || ''}
                onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                type="date"
              />
            </div>

            <div>
              <Label>Time *</Label>
              <Input
                value={newAppointment.time || ''}
                onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                type="time"
              />
            </div>

            <div>
              <Label>Healthcare Provider</Label>
              <Input
                value={newAppointment.provider || ''}
                onChange={(e) => setNewAppointment({ ...newAppointment, provider: e.target.value })}
                placeholder="e.g., Dr. Sarah Wanjiru"
              />
            </div>

            <div>
              <Label>Location</Label>
              <Input
                value={newAppointment.location || ''}
                onChange={(e) => setNewAppointment({ ...newAppointment, location: e.target.value })}
                placeholder="e.g., Nairobi Women's Hospital"
              />
            </div>

            <div>
              <Label>Notes (Optional)</Label>
              <Input
                value={newAppointment.notes || ''}
                onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })}
                placeholder="Additional information"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={newAppointment.isVirtual || false}
                onChange={(e) => setNewAppointment({ ...newAppointment, isVirtual: e.target.checked })}
                className="w-4 h-4"
              />
              <Label>Virtual Appointment</Label>
            </div>

            <div className="flex space-x-2 pt-4">
              <Button 
                onClick={handleAddAppointment}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Appointment
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  setShowAppointmentDialog(false);
                  setNewAppointment({});
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Provider Dialog */}
      <Dialog open={showProviderDialog} onOpenChange={setShowProviderDialog}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Healthcare Provider</DialogTitle>
            <DialogDescription>
              Save your provider's contact information for quick access
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Provider Name *</Label>
              <Input
                value={newProvider.name || ''}
                onChange={(e) => setNewProvider({ ...newProvider, name: e.target.value })}
                placeholder="e.g., Dr. Sarah Wanjiru"
              />
            </div>

            <div>
              <Label>Specialty</Label>
              <Input
                value={newProvider.specialty || ''}
                onChange={(e) => setNewProvider({ ...newProvider, specialty: e.target.value })}
                placeholder="e.g., Obstetrician/Gynecologist"
              />
            </div>

            <div>
              <Label>Phone Number *</Label>
              <Input
                value={newProvider.phone || ''}
                onChange={(e) => setNewProvider({ ...newProvider, phone: e.target.value })}
                placeholder="+254 712 345 678"
                type="tel"
              />
            </div>

            <div>
              <Label>Facility/Clinic</Label>
              <Input
                value={newProvider.facility || ''}
                onChange={(e) => setNewProvider({ ...newProvider, facility: e.target.value })}
                placeholder="e.g., Nairobi Women's Hospital"
              />
            </div>

            <div>
              <Label>Email (Optional)</Label>
              <Input
                value={newProvider.email || ''}
                onChange={(e) => setNewProvider({ ...newProvider, email: e.target.value })}
                placeholder="doctor@hospital.co.ke"
                type="email"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={newProvider.isPrimary || false}
                onChange={(e) => setNewProvider({ ...newProvider, isPrimary: e.target.checked })}
                className="w-4 h-4"
              />
              <Label>Set as Primary Provider</Label>
            </div>

            <div className="flex space-x-2 pt-4">
              <Button 
                onClick={handleAddProvider}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Provider
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  setShowProviderDialog(false);
                  setNewProvider({});
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
