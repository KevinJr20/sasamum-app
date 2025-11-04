import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { PatientDetailModal } from './PatientDetailModal';
import { 
  ArrowLeft,
  Stethoscope,
  Users,
  Calendar,
  MessageCircle,
  Phone,
  Video,
  AlertTriangle,
  FileText,
  BarChart3,
  Settings,
  Bell,
  Search,
  Plus,
  Activity,
  Heart,
  Baby,
  Clock,
  MapPin,
  Shield,
  Award
} from 'lucide-react';

interface HealthcareProviderPortalProps {
  onBack: () => void;
  providerName?: string;
  providerType?: 'doctor' | 'midwife' | 'nurse' | 'specialist';
}

interface Patient {
  id: string;
  name: string;
  avatar: string;
  currentWeek: number;
  dueDate: string;
  riskLevel: 'low' | 'medium' | 'high';
  lastVisit: string;
  nextAppointment?: string;
  recentConcerns: string[];
  location: string;
  phone: string;
  emergencyContact: string;
}

interface Appointment {
  id: string;
  patientName: string;
  patientId: string;
  time: string;
  type: 'checkup' | 'emergency' | 'consultation' | 'ultrasound';
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  notes?: string;
}

interface Alert {
  id: string;
  patientName: string;
  type: 'emergency' | 'reminder' | 'lab-result' | 'symptom';
  message: string;
  time: string;
  severity: 'low' | 'medium' | 'high';
}

export function HealthcareProviderPortal({ 
  onBack, 
  providerName: providedName,
  providerType: providedType
}: HealthcareProviderPortalProps) {
  // Get provider data from localStorage
  const providerData = JSON.parse(localStorage.getItem('providerData') || '{}');
  const providerName = providedName || providerData.name || "Dr. Carol Odhiambo";
  const providerType = providedType || (providerData.facilityName ? "doctor" : "midwife");
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'patients' | 'appointments' | 'alerts'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);

  const handlePatientClick = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsPatientModalOpen(true);
  };

  // Mock data for healthcare provider dashboard
  const patients: Patient[] = [
    {
      id: '1',
      name: 'Achieng Omondi',
      avatar: '/api/placeholder/60/60',
      currentWeek: 16,
      dueDate: '2025-05-15',
      riskLevel: 'low',
      lastVisit: '2025-10-10',
      nextAppointment: '2025-10-25',
      recentConcerns: ['Morning sickness', 'Back pain'],
      location: 'Kileleshwa, Nairobi',
      phone: '+254 722 123 456',
      emergencyContact: '+254 733 456 789',
      bloodPressure: '115/75',
      weight: '68kg',
      hemoglobin: '12.5 g/dL',
      notes: 'Patient is doing well. Baby development on track. Recommended prenatal vitamins continued.'
    },
    {
      id: '2',
      name: 'Awino Otieno',
      avatar: '/api/placeholder/60/60',
      currentWeek: 32,
      dueDate: '2025-12-20',
      riskLevel: 'medium',
      lastVisit: '2025-10-08',
      nextAppointment: '2025-10-22',
      recentConcerns: ['High blood pressure', 'Swelling', 'Mild headaches'],
      location: 'Westlands, Nairobi',
      phone: '+254 744 567 890',
      emergencyContact: '+254 755 678 901',
      bloodPressure: '128/82',
      weight: '72kg',
      hemoglobin: '11.2 g/dL',
      notes: 'Monitoring blood pressure. Advised to increase iron intake. Follow-up needed for headaches.'
    },
    {
      id: '3',
      name: 'Adhiambo Okello',
      avatar: '/api/placeholder/60/60',
      currentWeek: 38,
      dueDate: '2025-11-25',
      riskLevel: 'high',
      lastVisit: '2025-10-14',
      nextAppointment: '2025-10-20',
      recentConcerns: ['Decreased fetal movement', 'Headaches', 'Protein in urine'],
      location: 'Karen, Nairobi',
      phone: '+254 766 789 012',
      emergencyContact: '+254 777 890 123',
      bloodPressure: '145/95',
      weight: '78kg',
      hemoglobin: '10.8 g/dL',
      notes: 'Pre-eclampsia risk. Close monitoring required. Weekly checkups scheduled. Bed rest recommended.'
    },
    {
      id: '4',
      name: 'Anyango Ouma',
      avatar: '/api/placeholder/60/60',
      currentWeek: 20,
      dueDate: '2025-06-10',
      riskLevel: 'low',
      lastVisit: '2025-10-12',
      nextAppointment: '2025-10-28',
      recentConcerns: ['Feeling baby movements', 'Good energy'],
      location: 'Lavington, Nairobi',
      phone: '+254 745 678 901',
      emergencyContact: '+254 756 789 012',
      bloodPressure: '118/76',
      weight: '65kg',
      hemoglobin: '12.8 g/dL',
      notes: 'Ultrasound scheduled for next visit. All vitals normal. Patient very engaged and following care plan.'
    }
  ];

  const appointments: Appointment[] = [
    {
      id: '1',
      patientName: 'Achieng Omondi',
      patientId: '1',
      time: '09:00 AM',
      type: 'checkup',
      status: 'scheduled'
    },
    {
      id: '2',
      patientName: 'Awino Otieno',
      patientId: '2',
      time: '10:30 AM',
      type: 'ultrasound',
      status: 'scheduled'
    },
    {
      id: '3',
      patientName: 'Adhiambo Okello',
      patientId: '3',
      time: '02:00 PM',
      type: 'emergency',
      status: 'in-progress'
    }
  ];

  const alerts: Alert[] = [
    {
      id: '1',
      patientName: 'Adhiambo Okello',
      type: 'emergency',
      message: 'Patient reports decreased fetal movement - requires immediate attention',
      time: '10 minutes ago',
      severity: 'high'
    },
    {
      id: '2',
      patientName: 'Awino Otieno',
      type: 'lab-result',
      message: 'Blood pressure reading: 140/90 - requires monitoring',
      time: '2 hours ago',
      severity: 'medium'
    },
    {
      id: '3',
      patientName: 'Achieng Omondi',
      type: 'reminder',
      message: 'Due for glucose screening test',
      time: '1 day ago',
      severity: 'low'
    }
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-red-100 dark:bg-red-950/30 text-red-800 dark:text-red-400';
      case 'medium': return 'bg-orange-100 dark:bg-orange-950/30 text-orange-800 dark:text-orange-400';
      default: return 'bg-green-100 dark:bg-green-950/30 text-green-800 dark:text-green-400';
    }
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'border-red-300 dark:border-red-900 bg-red-50 dark:bg-red-950/20';
      case 'medium': return 'border-orange-300 dark:border-orange-900 bg-orange-50 dark:bg-orange-950/20';
      default: return 'border-blue-300 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/20';
    }
  };

  const getAppointmentIcon = (type: string) => {
    switch (type) {
      case 'emergency': return AlertTriangle;
      case 'ultrasound': return Baby;
      case 'consultation': return MessageCircle;
      default: return Stethoscope;
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <div className="flex items-center space-x-2">
          <Shield className="w-6 h-6 text-primary" />
          <h1 className="text-lg text-foreground">Provider Portal</h1>
        </div>
        <Button variant="ghost" size="sm" className="p-2 relative">
          <Bell className="w-6 h-6 text-foreground" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
        </Button>
      </div>

      {/* Provider Info */}
      <div className="p-4 bg-primary/5 border-b border-border">
        <div className="flex items-center space-x-3">
          <Avatar className="w-12 h-12">
            <AvatarFallback className="bg-primary/10 text-primary">
              {providerName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-foreground">{providerName}</h3>
            <div className="flex items-center space-x-2">
              <Badge className="text-xs bg-blue-100 dark:bg-blue-950/30 text-blue-800 dark:text-blue-400">
                {providerType.charAt(0).toUpperCase() + providerType.slice(1)}
              </Badge>
              <Badge className="text-xs bg-green-100 dark:bg-green-950/30 text-green-800 dark:text-green-400">
                Verified Provider
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Tabs */}
      <div className="sticky top-[73px] z-30 bg-card border-b border-border">
        <div className="flex overflow-x-auto">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'patients', label: 'Patients', icon: Users },
            { id: 'appointments', label: 'Appointments', icon: Calendar },
            { id: 'alerts', label: 'Alerts', icon: Bell }
          ].map((tab) => (
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
              {tab.id === 'alerts' && alerts.length > 0 && (
                <Badge className="bg-red-500 text-white text-xs px-1.5 py-0.5 min-w-[18px] h-4">
                  {alerts.length}
                </Badge>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="pb-20">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 space-y-4"
          >
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="border-border">
                <CardContent className="p-4 text-center">
                  <Users className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-2xl text-foreground">{patients.length}</p>
                  <p className="text-sm text-muted-foreground">Active Patients</p>
                </CardContent>
              </Card>
              
              <Card className="border-border">
                <CardContent className="p-4 text-center">
                  <Calendar className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-2xl text-foreground">{appointments.length}</p>
                  <p className="text-sm text-muted-foreground">Today's Appointments</p>
                </CardContent>
              </Card>
              
              <Card className="border-border">
                <CardContent className="p-4 text-center">
                  <AlertTriangle className="w-6 h-6 text-red-600 mx-auto mb-2" />
                  <p className="text-2xl text-foreground">
                    {patients.filter(p => p.riskLevel === 'high').length}
                  </p>
                  <p className="text-sm text-muted-foreground">High Risk</p>
                </CardContent>
              </Card>
              
              <Card className="border-border">
                <CardContent className="p-4 text-center">
                  <Bell className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                  <p className="text-2xl text-foreground">{alerts.length}</p>
                  <p className="text-sm text-muted-foreground">Pending Alerts</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Alerts */}
            <div>
              <h4 className="text-foreground mb-3">Recent Alerts</h4>
              {alerts.slice(0, 3).map((alert) => (
                <Card key={alert.id} className={`mb-3 ${getAlertColor(alert.severity)}`}>
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h5 className="text-sm text-foreground">{alert.patientName}</h5>
                          <Badge className={`text-xs ${
                            alert.severity === 'high' ? 'bg-red-100 dark:bg-red-950/30 text-red-800 dark:text-red-400' :
                            alert.severity === 'medium' ? 'bg-orange-100 dark:bg-orange-950/30 text-orange-800 dark:text-orange-400' :
                            'bg-blue-100 dark:bg-blue-950/30 text-blue-800 dark:text-blue-400'
                          }`}>
                            {alert.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{alert.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                      </div>
                      <Button size="sm" variant="outline" className="px-2">
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* Patients Tab */}
        {activeTab === 'patients' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Search */}
            <div className="p-4 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search patients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPatients.map((patient) => (
                <Card 
                  key={patient.id} 
                  className="border-border hover:shadow-md transition-all cursor-pointer hover:border-primary/50"
                  onClick={() => handlePatientClick(patient)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Patient Info */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={patient.avatar} />
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {patient.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="text-foreground">{patient.name}</h4>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <span>Week {patient.currentWeek}</span>
                              <span>•</span>
                              <span>Due: {new Date(patient.dueDate).toLocaleDateString('en-KE')}</span>
                            </div>
                          </div>
                        </div>
                        
                        <Badge className={`text-xs ${getRiskColor(patient.riskLevel)}`}>
                          {patient.riskLevel} risk
                        </Badge>
                      </div>

                      {/* Recent Concerns */}
                      {patient.recentConcerns.length > 0 && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Recent concerns:</p>
                          <div className="flex flex-wrap gap-1">
                            {patient.recentConcerns.map((concern, index) => (
                              <span
                                key={index}
                                className="text-xs bg-orange-100 dark:bg-orange-950/30 text-orange-800 dark:text-orange-400 px-2 py-1 rounded"
                              >
                                {concern}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          size="sm" 
                          className="col-span-2 bg-primary hover:bg-primary/90"
                          onClick={(e) => {
                            e.stopPropagation();
                            alert('Opening in-app chat with ' + patient.name);
                          }}
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Chat In-App
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="bg-green-600 hover:bg-green-700 text-white border-green-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = `tel:${patient.phone}`;
                          }}
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          Call
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="bg-green-500 hover:bg-green-600 text-white border-green-500"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(`https://wa.me/${patient.phone.replace(/[^0-9]/g, '')}`, '_blank');
                          }}
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          WhatsApp
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 pt-4 space-y-3"
          >
            {appointments.map((appointment) => {
              const AppointmentIcon = getAppointmentIcon(appointment.type);
              
              return (
                <Card key={appointment.id} className="border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          appointment.type === 'emergency' ? 'bg-red-100' :
                          appointment.type === 'ultrasound' ? 'bg-blue-100' :
                          'bg-primary/10'
                        }`}>
                          <AppointmentIcon className={`w-5 h-5 ${
                            appointment.type === 'emergency' ? 'text-red-600' :
                            appointment.type === 'ultrasound' ? 'text-blue-600' :
                            'text-primary'
                          }`} />
                        </div>
                        <div>
                          <h4 className="text-foreground">{appointment.patientName}</h4>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>{appointment.time}</span>
                            <span>•</span>
                            <span>{appointment.type}</span>
                          </div>
                        </div>
                      </div>
                      
                      <Badge className={`text-xs ${
                        appointment.status === 'scheduled' ? 'bg-blue-100 dark:bg-blue-950/30 text-blue-800 dark:text-blue-400' :
                        appointment.status === 'in-progress' ? 'bg-green-100 dark:bg-green-950/30 text-green-800 dark:text-green-400' :
                        appointment.status === 'completed' ? 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-400' :
                        'bg-red-100 dark:bg-red-950/30 text-red-800 dark:text-red-400'
                      }`}>
                        {appointment.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </motion.div>
        )}

        {/* Alerts Tab */}
        {activeTab === 'alerts' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 pt-4 space-y-3"
          >
            {alerts.map((alert) => (
              <Card key={alert.id} className={`${getAlertColor(alert.severity)}`}>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-foreground">{alert.patientName}</h4>
                      <Badge className={`text-xs ${
                        alert.severity === 'high' ? 'bg-red-100 dark:bg-red-950/30 text-red-800 dark:text-red-400' :
                        alert.severity === 'medium' ? 'bg-orange-100 dark:bg-orange-950/30 text-orange-800 dark:text-orange-400' :
                        'bg-blue-100 dark:bg-blue-950/30 text-blue-800 dark:text-blue-400'
                      }`}>
                        {alert.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{alert.message}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{alert.time}</span>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="px-2">
                          <Phone className="w-4 h-4" />
                        </Button>
                        <Button size="sm" className="bg-primary hover:bg-primary/90">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Respond
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        )}
      </div>

      {/* Patient Detail Modal */}
      <PatientDetailModal 
        patient={selectedPatient}
        isOpen={isPatientModalOpen}
        onClose={() => {
          setIsPatientModalOpen(false);
          setSelectedPatient(null);
        }}
      />
    </motion.div>
  );
}