import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Checkbox } from './ui/checkbox';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { toast } from 'sonner@2.0.3';
import { 
  ArrowLeft, Stethoscope, Users, Calendar, MessageCircle, Phone, Video,
  AlertTriangle, FileText, BarChart3, Settings, Bell, Search, Plus,
  Activity, Heart, Baby, Clock, MapPin, Shield, Award, Download,
  Upload, Filter, MoreVertical, Pill, Apple, Brain, Droplet, Zap,
  TrendingUp, TrendingDown, CheckCircle2, XCircle, ChevronRight,
  FileCheck, BookOpen, UserCheck, Siren, Thermometer, Scale,
  Clipboard, Archive, Eye, Edit, Trash2, Send, Calendar as CalendarIcon,
  RefreshCw, AlertCircle, Info, ChevronDown, ExternalLink, Printer,
  DollarSign, Building, Home, Repeat, Mail
} from 'lucide-react';

interface EnhancedHealthcareProviderPortalProps {
  onBack: () => void;
  onNavigateToCHWPortal?: () => void;
  providerName?: string;
  providerType?: 'doctor' | 'midwife' | 'nurse' | 'specialist' | 'nutritionist';
}

// Extended Patient Interface
interface Patient {
  id: string;
  name: string;
  avatar: string;
  age: number;
  currentWeek: number;
  trimester: number;
  dueDate: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskFactors: string[];
  lastVisit: string;
  nextAppointment?: string;
  recentConcerns: string[];
  location: string;
  phone: string;
  emergencyContact: string;
  bloodPressure: string;
  weight: number;
  hemoglobin: string;
  bloodType: string;
  notes: string;
  medications: Medication[];
  vitals: VitalReading[];
  nutritionPlan?: NutritionPlan;
  mentalHealthScore?: number;
  complications: string[];
  pastPregnancies: number;
  labResults: LabResult[];
  symptoms: Symptom[];
  appointments: AppointmentRecord[];
  consentGiven: boolean;
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  prescribedBy: string;
  status: 'active' | 'completed' | 'stopped';
  sideEffects?: string[];
}

interface VitalReading {
  id: string;
  date: string;
  bloodPressure: string;
  weight: number;
  temperature?: number;
  heartRate?: number;
  oxygenSaturation?: number;
  recordedBy: string;
}

interface NutritionPlan {
  id: string;
  createdDate: string;
  trimester: number;
  calorieTarget: number;
  proteinTarget: number;
  ironTarget: number;
  calciumTarget: number;
  recommendations: string[];
  restrictions: string[];
  culturalPreferences: string[];
  mealSuggestions: MealSuggestion[];
}

interface MealSuggestion {
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  ingredients: string[];
  nutrients: {
    calories: number;
    protein: number;
    iron: number;
    calcium: number;
  };
}

interface LabResult {
  id: string;
  date: string;
  type: string;
  result: string;
  status: 'normal' | 'abnormal' | 'pending';
  notes?: string;
}

interface Symptom {
  id: string;
  date: string;
  description: string;
  severity: 'mild' | 'moderate' | 'severe';
  status: 'active' | 'resolved';
}

interface AppointmentRecord {
  id: string;
  date: string;
  time: string;
  type: 'checkup' | 'emergency' | 'consultation' | 'ultrasound' | 'nutrition' | 'mental-health';
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show' | 'rescheduled';
  provider: string;
  notes?: string;
  recurring?: boolean;
  recurringPattern?: string;
}

interface Facility {
  id: string;
  name: string;
  type: 'hospital' | 'clinic' | 'health-center';
  location: string;
  phone: string;
  email: string;
  services: string[];
  bedsAvailable: number;
  totalBeds: number;
  emergencyAvailable: boolean;
}

interface ClinicalRule {
  id: string;
  condition: string;
  recommendation: string;
  severity: 'info' | 'warning' | 'urgent';
  source: 'WHO' | 'MOH' | 'ACOG';
}

export function EnhancedHealthcareProviderPortal({ 
  onBack,
  onNavigateToCHWPortal,
  providerName: providedName,
  providerType: providedType
}: EnhancedHealthcareProviderPortalProps) {
  const providerData = JSON.parse(localStorage.getItem('providerData') || '{}');
  const providerName = providedName || providerData.name || "Dr. Carol Odhiambo";
  const providerType = providedType || (providerData.facilityName ? "doctor" : "midwife");
  
  // State Management
  const [activeTab, setActiveTab] = useState<'dashboard' | 'patients' | 'appointments' | 'nutrition' | 'analytics' | 'facilities'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isPatientDetailOpen, setIsPatientDetailOpen] = useState(false);
  const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false);
  const [isNutritionDialogOpen, setIsNutritionDialogOpen] = useState(false);
  const [isMedicationDialogOpen, setIsMedicationDialogOpen] = useState(false);
  const [isReferralDialogOpen, setIsReferralDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedAppointmentType, setSelectedAppointmentType] = useState('');
  const [appointmentNotes, setAppointmentNotes] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [clinicalAlerts, setClinicalAlerts] = useState<ClinicalRule[]>([]);

  // Mock Data
  const mockPatients: Patient[] = [
    {
      id: '1',
      name: 'Achieng Omondi',
      avatar: '/api/placeholder/60/60',
      age: 28,
      currentWeek: 16,
      trimester: 2,
      dueDate: '2025-05-15',
      riskLevel: 'low',
      riskFactors: [],
      lastVisit: '2025-10-10',
      nextAppointment: '2025-10-25',
      recentConcerns: ['Morning sickness', 'Back pain'],
      location: 'Kileleshwa, Nairobi',
      phone: '+254 722 123 456',
      emergencyContact: '+254 733 456 789',
      bloodPressure: '115/75',
      weight: 68,
      hemoglobin: '12.5 g/dL',
      bloodType: 'O+',
      notes: 'Patient is doing well. Baby development on track.',
      medications: [
        {
          id: 'm1',
          name: 'Folic Acid',
          dosage: '400mcg',
          frequency: 'Once daily',
          startDate: '2025-06-01',
          prescribedBy: 'Dr. Carol Odhiambo',
          status: 'active'
        },
        {
          id: 'm2',
          name: 'Iron Supplement',
          dosage: '65mg',
          frequency: 'Once daily',
          startDate: '2025-08-01',
          prescribedBy: 'Dr. Carol Odhiambo',
          status: 'active'
        }
      ],
      vitals: [
        {
          id: 'v1',
          date: '2025-10-10',
          bloodPressure: '115/75',
          weight: 68,
          temperature: 37.0,
          heartRate: 78,
          recordedBy: 'Nurse Jane'
        }
      ],
      nutritionPlan: {
        id: 'n1',
        createdDate: '2025-10-01',
        trimester: 2,
        calorieTarget: 2200,
        proteinTarget: 70,
        ironTarget: 27,
        calciumTarget: 1000,
        recommendations: [
          'Increase protein intake with eggs, beans, and fish',
          'Include iron-rich foods like spinach and red meat',
          'Take prenatal vitamins daily'
        ],
        restrictions: ['Limit caffeine to 200mg/day', 'Avoid raw fish'],
        culturalPreferences: ['Ugali', 'Sukuma wiki', 'Githeri'],
        mealSuggestions: [
          {
            name: 'Ugali with Sukuma Wiki and Fish',
            type: 'lunch',
            ingredients: ['Maize flour', 'Kale', 'Tilapia', 'Tomatoes'],
            nutrients: { calories: 550, protein: 32, iron: 4.5, calcium: 150 }
          }
        ]
      },
      mentalHealthScore: 85,
      complications: [],
      pastPregnancies: 0,
      labResults: [
        {
          id: 'l1',
          date: '2025-10-05',
          type: 'Hemoglobin',
          result: '12.5 g/dL',
          status: 'normal'
        },
        {
          id: 'l2',
          date: '2025-10-05',
          type: 'Blood Sugar (Fasting)',
          result: '88 mg/dL',
          status: 'normal'
        }
      ],
      symptoms: [],
      appointments: [
        {
          id: 'a1',
          date: '2025-10-25',
          time: '10:00 AM',
          type: 'checkup',
          status: 'scheduled',
          provider: 'Dr. Carol Odhiambo'
        }
      ],
      consentGiven: true
    },
    {
      id: '2',
      name: 'Awino Otieno',
      avatar: '/api/placeholder/60/60',
      age: 32,
      currentWeek: 32,
      trimester: 3,
      dueDate: '2025-12-20',
      riskLevel: 'medium',
      riskFactors: ['Gestational Hypertension', 'Advanced Maternal Age'],
      lastVisit: '2025-10-08',
      nextAppointment: '2025-10-22',
      recentConcerns: ['High blood pressure', 'Swelling', 'Mild headaches'],
      location: 'Westlands, Nairobi',
      phone: '+254 744 567 890',
      emergencyContact: '+254 755 678 901',
      bloodPressure: '138/88',
      weight: 72,
      hemoglobin: '11.2 g/dL',
      bloodType: 'A+',
      notes: 'Monitoring blood pressure closely. Weekly appointments recommended.',
      medications: [
        {
          id: 'm3',
          name: 'Methyldopa',
          dosage: '250mg',
          frequency: 'Twice daily',
          startDate: '2025-09-15',
          prescribedBy: 'Dr. Carol Odhiambo',
          status: 'active',
          sideEffects: ['Drowsiness (mild)']
        },
        {
          id: 'm4',
          name: 'Iron + Folic Acid',
          dosage: '65mg + 400mcg',
          frequency: 'Once daily',
          startDate: '2025-06-01',
          prescribedBy: 'Dr. Carol Odhiambo',
          status: 'active'
        }
      ],
      vitals: [
        {
          id: 'v2',
          date: '2025-10-08',
          bloodPressure: '138/88',
          weight: 72,
          temperature: 37.2,
          heartRate: 82,
          recordedBy: 'Nurse Jane'
        }
      ],
      nutritionPlan: {
        id: 'n2',
        createdDate: '2025-09-01',
        trimester: 3,
        calorieTarget: 2400,
        proteinTarget: 75,
        ironTarget: 27,
        calciumTarget: 1000,
        recommendations: [
          'Low sodium diet to manage blood pressure',
          'Increase potassium-rich foods (bananas, sweet potatoes)',
          'Adequate hydration (8-10 glasses of water daily)'
        ],
        restrictions: ['Limit salt intake', 'Avoid processed foods', 'No caffeine'],
        culturalPreferences: ['Ugali', 'Millet porridge', 'Pumpkin leaves'],
        mealSuggestions: [
          {
            name: 'Millet Porridge with Bananas',
            type: 'breakfast',
            ingredients: ['Millet flour', 'Bananas', 'Milk', 'Honey'],
            nutrients: { calories: 350, protein: 12, iron: 2.5, calcium: 200 }
          }
        ]
      },
      mentalHealthScore: 72,
      complications: ['Gestational Hypertension'],
      pastPregnancies: 1,
      labResults: [
        {
          id: 'l3',
          date: '2025-10-08',
          type: 'Hemoglobin',
          result: '11.2 g/dL',
          status: 'normal'
        },
        {
          id: 'l4',
          date: '2025-10-08',
          type: 'Urine Protein',
          result: 'Trace',
          status: 'abnormal',
          notes: 'Monitor for pre-eclampsia'
        }
      ],
      symptoms: [
        {
          id: 's1',
          date: '2025-10-15',
          description: 'Headaches',
          severity: 'moderate',
          status: 'active'
        },
        {
          id: 's2',
          date: '2025-10-14',
          description: 'Swelling in feet',
          severity: 'moderate',
          status: 'active'
        }
      ],
      appointments: [
        {
          id: 'a2',
          date: '2025-10-22',
          time: '2:00 PM',
          type: 'checkup',
          status: 'scheduled',
          provider: 'Dr. Carol Odhiambo',
          recurring: true,
          recurringPattern: 'Weekly'
        }
      ],
      consentGiven: true
    },
    {
      id: '3',
      name: 'Adhiambo Okello',
      avatar: '/api/placeholder/60/60',
      age: 35,
      currentWeek: 38,
      trimester: 3,
      dueDate: '2025-11-25',
      riskLevel: 'high',
      riskFactors: ['Pre-eclampsia Risk', 'Advanced Maternal Age', 'Low Hemoglobin'],
      lastVisit: '2025-10-14',
      nextAppointment: '2025-10-18',
      recentConcerns: ['Decreased fetal movement', 'Severe headaches', 'Protein in urine'],
      location: 'Karen, Nairobi',
      phone: '+254 766 789 012',
      emergencyContact: '+254 777 890 123',
      bloodPressure: '152/98',
      weight: 78,
      hemoglobin: '10.2 g/dL',
      bloodType: 'B+',
      notes: 'High-risk pregnancy. Requires close monitoring. Consider early delivery if condition worsens.',
      medications: [
        {
          id: 'm5',
          name: 'Labetalol',
          dosage: '200mg',
          frequency: 'Twice daily',
          startDate: '2025-10-10',
          prescribedBy: 'Dr. Carol Odhiambo',
          status: 'active'
        },
        {
          id: 'm6',
          name: 'Aspirin (Low-dose)',
          dosage: '75mg',
          frequency: 'Once daily',
          startDate: '2025-10-10',
          prescribedBy: 'Dr. Carol Odhiambo',
          status: 'active'
        },
        {
          id: 'm7',
          name: 'Iron IV Infusion',
          dosage: '200mg',
          frequency: 'Weekly',
          startDate: '2025-10-05',
          prescribedBy: 'Dr. Carol Odhiambo',
          status: 'active'
        }
      ],
      vitals: [
        {
          id: 'v3',
          date: '2025-10-14',
          bloodPressure: '152/98',
          weight: 78,
          temperature: 37.1,
          heartRate: 88,
          oxygenSaturation: 97,
          recordedBy: 'Nurse Jane'
        }
      ],
      nutritionPlan: {
        id: 'n3',
        createdDate: '2025-10-10',
        trimester: 3,
        calorieTarget: 2300,
        proteinTarget: 80,
        ironTarget: 45,
        calciumTarget: 1200,
        recommendations: [
          'High iron diet (liver, red meat, spinach)',
          'Low sodium diet',
          'Increase vitamin C for iron absorption',
          'Bed rest recommended'
        ],
        restrictions: ['Strict salt restriction', 'No strenuous activity'],
        culturalPreferences: ['Fish', 'Beans', 'Green vegetables'],
        mealSuggestions: [
          {
            name: 'Spinach and Bean Stew with Fish',
            type: 'lunch',
            ingredients: ['Spinach', 'Kidney beans', 'Tilapia', 'Tomatoes', 'Onions'],
            nutrients: { calories: 450, protein: 38, iron: 8.5, calcium: 180 }
          }
        ]
      },
      mentalHealthScore: 58,
      complications: ['Pre-eclampsia', 'Anemia'],
      pastPregnancies: 2,
      labResults: [
        {
          id: 'l5',
          date: '2025-10-14',
          type: 'Hemoglobin',
          result: '10.2 g/dL',
          status: 'abnormal',
          notes: 'Severe anemia - IV iron therapy initiated'
        },
        {
          id: 'l6',
          date: '2025-10-14',
          type: 'Urine Protein (24hr)',
          result: '450mg',
          status: 'abnormal',
          notes: 'Indicative of pre-eclampsia'
        },
        {
          id: 'l7',
          date: '2025-10-14',
          type: 'Liver Function',
          result: 'Elevated enzymes',
          status: 'abnormal',
          notes: 'Monitor closely'
        }
      ],
      symptoms: [
        {
          id: 's3',
          date: '2025-10-15',
          description: 'Severe headaches',
          severity: 'severe',
          status: 'active'
        },
        {
          id: 's4',
          date: '2025-10-15',
          description: 'Visual disturbances',
          severity: 'moderate',
          status: 'active'
        },
        {
          id: 's5',
          date: '2025-10-15',
          description: 'Decreased fetal movement',
          severity: 'severe',
          status: 'active'
        }
      ],
      appointments: [
        {
          id: 'a3',
          date: '2025-10-18',
          time: '9:00 AM',
          type: 'emergency',
          status: 'scheduled',
          provider: 'Dr. Carol Odhiambo',
          notes: 'Urgent follow-up for pre-eclampsia monitoring'
        }
      ],
      consentGiven: true
    }
  ];

  const mockFacilities: Facility[] = [
    {
      id: 'f1',
      name: 'Kenyatta National Hospital',
      type: 'hospital',
      location: 'Upper Hill, Nairobi',
      phone: '+254 20 2726300',
      email: 'info@knh.or.ke',
      services: ['Maternity Ward', 'NICU', 'Emergency', 'Ultrasound', 'Lab Services'],
      bedsAvailable: 12,
      totalBeds: 45,
      emergencyAvailable: true
    },
    {
      id: 'f2',
      name: 'Aga Khan University Hospital',
      type: 'hospital',
      location: 'Parklands, Nairobi',
      phone: '+254 20 3662000',
      email: 'info@aku.edu',
      services: ['Maternity Ward', 'NICU', 'High-Risk Pregnancy Unit', 'Ultrasound'],
      bedsAvailable: 8,
      totalBeds: 30,
      emergencyAvailable: true
    },
    {
      id: 'f3',
      name: 'Jamaa Mission Hospital',
      type: 'hospital',
      location: 'Ngong Road, Nairobi',
      phone: '+254 20 3884000',
      email: 'info@jamaamission.org',
      services: ['Maternity Ward', 'Nutrition Counseling', 'ANC Clinic'],
      bedsAvailable: 5,
      totalBeds: 20,
      emergencyAvailable: false
    }
  ];

  // Clinical Decision Support Rules
  const clinicalRules: ClinicalRule[] = [
    {
      id: 'r1',
      condition: 'Blood Pressure >= 140/90',
      recommendation: 'Monitor closely for pre-eclampsia. Consider antihypertensive therapy if persistent.',
      severity: 'warning',
      source: 'WHO'
    },
    {
      id: 'r2',
      condition: 'Hemoglobin < 11 g/dL',
      recommendation: 'Start or increase iron supplementation. Consider IV iron if severe (<9 g/dL).',
      severity: 'warning',
      source: 'WHO'
    },
    {
      id: 'r3',
      condition: 'Protein in urine + High BP',
      recommendation: 'URGENT: Possible pre-eclampsia. Immediate specialist consultation required.',
      severity: 'urgent',
      source: 'ACOG'
    },
    {
      id: 'r4',
      condition: 'Decreased fetal movement',
      recommendation: 'URGENT: Perform NST (Non-Stress Test) immediately. Consider ultrasound.',
      severity: 'urgent',
      source: 'ACOG'
    },
    {
      id: 'r5',
      condition: 'Week 38+ with complications',
      recommendation: 'Consider delivery planning. Assess Bishop score and discuss induction vs C-section.',
      severity: 'warning',
      source: 'MOH'
    }
  ];

  // Filter patients based on search and risk level
  const filteredPatients = mockPatients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         patient.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterRisk === 'all' || patient.riskLevel === filterRisk;
    return matchesSearch && matchesFilter;
  });

  // Get Clinical Alerts for selected patient
  const getPatientAlerts = (patient: Patient): ClinicalRule[] => {
    const alerts: ClinicalRule[] = [];
    
    // Check blood pressure
    const [systolic, diastolic] = patient.bloodPressure.split('/').map(Number);
    if (systolic >= 140 || diastolic >= 90) {
      alerts.push(clinicalRules[0]);
    }
    
    // Check hemoglobin
    const hgb = parseFloat(patient.hemoglobin);
    if (hgb < 11) {
      alerts.push(clinicalRules[1]);
    }
    
    // Check for pre-eclampsia
    const hasProteinuria = patient.labResults.some(r => r.type.includes('Protein') && r.status === 'abnormal');
    if (hasProteinuria && (systolic >= 140 || diastolic >= 90)) {
      alerts.push(clinicalRules[2]);
    }
    
    // Check for decreased fetal movement
    const hasDecreasedMovement = patient.symptoms.some(s => 
      s.description.toLowerCase().includes('fetal movement') && s.status === 'active'
    );
    if (hasDecreasedMovement) {
      alerts.push(clinicalRules[3]);
    }
    
    // Check gestational age with complications
    if (patient.currentWeek >= 38 && patient.complications.length > 0) {
      alerts.push(clinicalRules[4]);
    }
    
    return alerts;
  };

  // Utility Functions
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'bg-red-600 dark:bg-red-900 text-white';
      case 'high': return 'bg-red-100 dark:bg-red-950/30 text-red-800 dark:text-red-400';
      case 'medium': return 'bg-orange-100 dark:bg-orange-950/30 text-orange-800 dark:text-orange-400';
      default: return 'bg-green-100 dark:bg-green-950/30 text-green-800 dark:text-green-400';
    }
  };

  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case 'urgent': return 'border-red-500 bg-red-50 dark:bg-red-950/20';
      case 'warning': return 'border-orange-500 bg-orange-50 dark:bg-orange-950/20';
      default: return 'border-blue-500 bg-blue-50 dark:bg-blue-950/20';
    }
  };

  const handlePatientClick = (patient: Patient) => {
    setSelectedPatient(patient);
    const alerts = getPatientAlerts(patient);
    setClinicalAlerts(alerts);
    setIsPatientDetailOpen(true);
  };

  const handleScheduleAppointment = () => {
    if (!selectedPatient || !selectedDate || !selectedAppointmentType) {
      toast.error('Please fill in all required fields');
      return;
    }

    toast.success(`Appointment scheduled for ${selectedPatient.name} on ${selectedDate}`);
    setIsAppointmentDialogOpen(false);
    setSelectedDate('');
    setSelectedAppointmentType('');
    setAppointmentNotes('');
    setIsRecurring(false);
  };

  const handleCreateNutritionPlan = () => {
    if (!selectedPatient) return;
    
    toast.success(`Nutrition plan created for ${selectedPatient.name}`);
    setIsNutritionDialogOpen(false);
  };

  const handlePrescribeMedication = () => {
    if (!selectedPatient) return;
    
    toast.success(`Medication prescribed for ${selectedPatient.name}`);
    setIsMedicationDialogOpen(false);
  };

  const handleReferPatient = () => {
    if (!selectedPatient) return;
    
    toast.success(`Referral sent for ${selectedPatient.name}`);
    setIsReferralDialogOpen(false);
  };

  const exportPatientData = (patient: Patient) => {
    const data = {
      patientInfo: {
        name: patient.name,
        age: patient.age,
        currentWeek: patient.currentWeek,
        dueDate: patient.dueDate,
        riskLevel: patient.riskLevel
      },
      vitals: patient.vitals,
      medications: patient.medications,
      labResults: patient.labResults,
      appointments: patient.appointments,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${patient.name.replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Patient data exported successfully');
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
        <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </Button>
        <div className="flex items-center space-x-2">
          <Shield className="w-6 h-6 text-primary" />
          <h1 className="text-lg text-foreground">Enhanced Provider Portal</h1>
        </div>
        <Button variant="ghost" size="sm" className="p-2 relative">
          <Bell className="w-6 h-6 text-foreground" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
        </Button>
      </div>

      {/* Provider Info */}
      <div className="p-4 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-12 h-12">
              <AvatarFallback className="bg-primary text-primary-foreground">
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
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {onNavigateToCHWPortal && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={onNavigateToCHWPortal}
                className="text-xs"
              >
                <Users className="w-4 h-4 mr-1" />
                CHW Portal
              </Button>
            )}
            <Button variant="ghost" size="sm">
              <Settings className="w-5 h-5 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
        <div className="sticky top-[73px] z-30 bg-card border-b border-border">
          <TabsList className="w-full justify-start rounded-none h-auto p-0 bg-transparent">
            <TabsTrigger 
              value="dashboard" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger 
              value="patients"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              <Users className="w-4 h-4 mr-2" />
              Patients
            </TabsTrigger>
            <TabsTrigger 
              value="appointments"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Appointments
            </TabsTrigger>
            <TabsTrigger 
              value="nutrition"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              <Apple className="w-4 h-4 mr-2" />
              Nutrition
            </TabsTrigger>
            <TabsTrigger 
              value="analytics"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger 
              value="facilities"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              <Building className="w-4 h-4 mr-2" />
              Facilities
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="p-4 space-y-4 m-0">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl text-foreground">{mockPatients.length}</p>
                    <p className="text-sm text-muted-foreground">Active Patients</p>
                  </div>
                  <Users className="w-8 h-8 text-primary opacity-50" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl text-foreground">
                      {mockPatients.filter(p => p.riskLevel === 'high' || p.riskLevel === 'critical').length}
                    </p>
                    <p className="text-sm text-muted-foreground">High Risk</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-red-500 opacity-50" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl text-foreground">
                      {mockPatients.flatMap(p => p.appointments.filter(a => a.status === 'scheduled')).length}
                    </p>
                    <p className="text-sm text-muted-foreground">Appointments</p>
                  </div>
                  <Calendar className="w-8 h-8 text-primary opacity-50" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl text-foreground">
                      {mockPatients.filter(p => p.mentalHealthScore && p.mentalHealthScore < 70).length}
                    </p>
                    <p className="text-sm text-muted-foreground">Mental Health</p>
                  </div>
                  <Brain className="w-8 h-8 text-purple-500 opacity-50" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Critical Alerts */}
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-foreground">Critical Alerts</h3>
                <Badge className="bg-red-500 text-white">
                  {mockPatients.filter(p => p.riskLevel === 'high' || p.riskLevel === 'critical').length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockPatients
                .filter(p => p.riskLevel === 'high' || p.riskLevel === 'critical')
                .map(patient => {
                  const alerts = getPatientAlerts(patient);
                  return (
                    <Card 
                      key={patient.id}
                      className="border-red-300 dark:border-red-900 bg-red-50 dark:bg-red-950/20 cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handlePatientClick(patient)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={patient.avatar} />
                              <AvatarFallback>{patient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-foreground">{patient.name}</p>
                              <p className="text-sm text-muted-foreground">Week {patient.currentWeek}</p>
                            </div>
                          </div>
                          <Badge className={getRiskColor(patient.riskLevel)}>
                            {patient.riskLevel.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          {alerts.slice(0, 2).map(alert => (
                            <div key={alert.id} className="flex items-start space-x-2 text-sm">
                              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                              <p className="text-foreground">{alert.recommendation}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
            </CardContent>
          </Card>

          {/* Today's Schedule */}
          <Card className="border-border">
            <CardHeader>
              <h3 className="text-foreground">Today's Schedule</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockPatients
                .flatMap(p => p.appointments.map(a => ({ ...a, patient: p })))
                .filter(a => a.status === 'scheduled')
                .map(appointment => (
                  <Card key={appointment.id} className="border-border">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            appointment.type === 'emergency' ? 'bg-red-100 dark:bg-red-950/30' :
                            appointment.type === 'ultrasound' ? 'bg-blue-100 dark:bg-blue-950/30' :
                            'bg-green-100 dark:bg-green-950/30'
                          }`}>
                            {appointment.type === 'emergency' && <AlertTriangle className="w-6 h-6 text-red-600" />}
                            {appointment.type === 'ultrasound' && <Baby className="w-6 h-6 text-blue-600" />}
                            {appointment.type === 'checkup' && <Stethoscope className="w-6 h-6 text-green-600" />}
                          </div>
                          <div>
                            <p className="text-foreground">{appointment.patient.name}</p>
                            <p className="text-sm text-muted-foreground">{appointment.time} • {appointment.type}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Patients Tab */}
        <TabsContent value="patients" className="p-4 space-y-4 m-0">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search patients by name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-full"
              />
            </div>
            <Select value={filterRisk} onValueChange={setFilterRisk}>
              <SelectTrigger className="w-full sm:w-[180px] rounded-full">
                <SelectValue placeholder="Filter by risk" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Patients</SelectItem>
                <SelectItem value="low">Low Risk</SelectItem>
                <SelectItem value="medium">Medium Risk</SelectItem>
                <SelectItem value="high">High Risk</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Patient List */}
          <div className="space-y-3">
            {filteredPatients.map(patient => (
              <Card 
                key={patient.id}
                className="border-border cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handlePatientClick(patient)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={patient.avatar} />
                        <AvatarFallback>{patient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-foreground">{patient.name}</p>
                        <p className="text-sm text-muted-foreground">{patient.age} years • Week {patient.currentWeek}</p>
                      </div>
                    </div>
                    <Badge className={getRiskColor(patient.riskLevel)}>
                      {patient.riskLevel}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="flex items-center space-x-2 text-sm">
                      <Activity className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">BP: {patient.bloodPressure}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Droplet className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Hgb: {patient.hemoglobin}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{patient.location.split(',')[0]}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Last: {new Date(patient.lastVisit).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {patient.riskFactors.length > 0 && (
                    <div className="pt-3 border-t border-border">
                      <div className="flex flex-wrap gap-2">
                        {patient.riskFactors.map((factor, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {factor}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Appointments Tab */}
        <TabsContent value="appointments" className="p-4 space-y-4 m-0">
          <div className="flex justify-between items-center">
            <h3 className="text-foreground">Appointment Management</h3>
            <Button 
              onClick={() => {
                setSelectedPatient(mockPatients[0]);
                setIsAppointmentDialogOpen(true);
              }}
              size="sm"
              className="rounded-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Appointment
            </Button>
          </div>

          {/* Appointment Calendar View */}
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-foreground">October 2025</h3>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {['Today', 'Tomorrow', 'This Week', 'Next Week'].map((timeframe, idx) => (
                <div key={idx}>
                  <p className="text-sm text-muted-foreground mb-2">{timeframe}</p>
                  {mockPatients
                    .flatMap(p => p.appointments.map(a => ({ ...a, patient: p })))
                    .filter(a => a.status === 'scheduled')
                    .slice(idx, idx + 2)
                    .map(appointment => (
                      <Card key={appointment.id} className="border-border mb-2">
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                appointment.type === 'emergency' ? 'bg-red-100 dark:bg-red-950/30' :
                                'bg-primary/10'
                              }`}>
                                <CalendarIcon className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <p className="text-sm text-foreground">{appointment.patient.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {appointment.time} • {appointment.type}
                                  {appointment.recurring && <Repeat className="inline w-3 h-3 ml-1" />}
                                </p>
                              </div>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {appointment.status}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Nutrition Tab */}
        <TabsContent value="nutrition" className="p-4 space-y-4 m-0">
          <div className="flex justify-between items-center">
            <h3 className="text-foreground">Nutrition Management</h3>
            <Button 
              onClick={() => {
                setSelectedPatient(mockPatients[0]);
                setIsNutritionDialogOpen(true);
              }}
              size="sm"
              className="rounded-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Plan
            </Button>
          </div>

          {/* Nutrition Plans */}
          {mockPatients.filter(p => p.nutritionPlan).map(patient => (
            <Card key={patient.id} className="border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={patient.avatar} />
                      <AvatarFallback>{patient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-foreground">{patient.name}</p>
                      <p className="text-sm text-muted-foreground">Trimester {patient.trimester} • Week {patient.currentWeek}</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {patient.nutritionPlan && (
                  <>
                    {/* Nutrition Targets */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-primary/5 rounded-lg">
                        <p className="text-sm text-muted-foreground">Calories/day</p>
                        <p className="text-lg text-foreground">{patient.nutritionPlan.calorieTarget}</p>
                      </div>
                      <div className="p-3 bg-primary/5 rounded-lg">
                        <p className="text-sm text-muted-foreground">Protein (g)</p>
                        <p className="text-lg text-foreground">{patient.nutritionPlan.proteinTarget}</p>
                      </div>
                      <div className="p-3 bg-primary/5 rounded-lg">
                        <p className="text-sm text-muted-foreground">Iron (mg)</p>
                        <p className="text-lg text-foreground">{patient.nutritionPlan.ironTarget}</p>
                      </div>
                      <div className="p-3 bg-primary/5 rounded-lg">
                        <p className="text-sm text-muted-foreground">Calcium (mg)</p>
                        <p className="text-lg text-foreground">{patient.nutritionPlan.calciumTarget}</p>
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Recommendations</p>
                      <div className="space-y-2">
                        {patient.nutritionPlan.recommendations.map((rec, idx) => (
                          <div key={idx} className="flex items-start space-x-2 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <p className="text-foreground">{rec}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Cultural Preferences */}
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Cultural Food Preferences</p>
                      <div className="flex flex-wrap gap-2">
                        {patient.nutritionPlan.culturalPreferences.map((food, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {food}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="p-4 space-y-4 m-0">
          <h3 className="text-foreground">Analytics & Reporting</h3>

          {/* Population Health Insights */}
          <Card className="border-border">
            <CardHeader>
              <h3 className="text-foreground">Population Health Insights</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-primary/5 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">Anemia Cases</p>
                    <TrendingUp className="w-4 h-4 text-red-500" />
                  </div>
                  <p className="text-2xl text-foreground">
                    {mockPatients.filter(p => parseFloat(p.hemoglobin) < 11).length}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {Math.round((mockPatients.filter(p => parseFloat(p.hemoglobin) < 11).length / mockPatients.length) * 100)}% of patients
                  </p>
                </div>

                <div className="p-4 bg-primary/5 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">Hypertension</p>
                    <TrendingDown className="w-4 h-4 text-orange-500" />
                  </div>
                  <p className="text-2xl text-foreground">
                    {mockPatients.filter(p => {
                      const [sys] = p.bloodPressure.split('/').map(Number);
                      return sys >= 140;
                    }).length}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {Math.round((mockPatients.filter(p => {
                      const [sys] = p.bloodPressure.split('/').map(Number);
                      return sys >= 140;
                    }).length / mockPatients.length) * 100)}% of patients
                  </p>
                </div>
              </div>

              <Separator />

              {/* Risk Distribution */}
              <div>
                <p className="text-sm text-muted-foreground mb-3">Risk Level Distribution</p>
                <div className="space-y-2">
                  {['low', 'medium', 'high', 'critical'].map(risk => {
                    const count = mockPatients.filter(p => p.riskLevel === risk).length;
                    const percentage = (count / mockPatients.length) * 100;
                    return (
                      <div key={risk}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="capitalize text-foreground">{risk} Risk</span>
                          <span className="text-muted-foreground">{count} ({Math.round(percentage)}%)</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              risk === 'critical' ? 'bg-red-600' :
                              risk === 'high' ? 'bg-red-500' :
                              risk === 'medium' ? 'bg-orange-500' :
                              'bg-green-500'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <Separator />

              {/* Export Options */}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Export to Excel
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Mental Health Overview */}
          <Card className="border-border">
            <CardHeader>
              <h3 className="text-foreground">Mental Health Overview</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockPatients.filter(p => p.mentalHealthScore).map(patient => (
                <div key={patient.id} className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={patient.avatar} />
                      <AvatarFallback>{patient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm text-foreground">{patient.name}</p>
                      <p className="text-xs text-muted-foreground">Mental Health Score</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg ${
                      patient.mentalHealthScore! >= 80 ? 'text-green-600' :
                      patient.mentalHealthScore! >= 60 ? 'text-orange-600' :
                      'text-red-600'
                    }`}>
                      {patient.mentalHealthScore}
                    </p>
                    <p className="text-xs text-muted-foreground">/100</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Facilities Tab */}
        <TabsContent value="facilities" className="p-4 space-y-4 m-0">
          <div className="flex justify-between items-center">
            <h3 className="text-foreground">Healthcare Facilities</h3>
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>

          {/* Facilities List */}
          {mockFacilities.map(facility => (
            <Card key={facility.id} className="border-border">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Building className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-foreground">{facility.name}</p>
                      <p className="text-sm text-muted-foreground capitalize">{facility.type}</p>
                    </div>
                  </div>
                  {facility.emergencyAvailable && (
                    <Badge className="bg-red-100 dark:bg-red-950/30 text-red-800 dark:text-red-400">
                      <Siren className="w-3 h-3 mr-1" />
                      24/7 Emergency
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">{facility.location}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">{facility.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">{facility.email}</span>
                </div>

                <Separator />

                {/* Bed Availability */}
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Bed Availability</span>
                    <span className="text-foreground">{facility.bedsAvailable} / {facility.totalBeds}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        (facility.bedsAvailable / facility.totalBeds) > 0.5 ? 'bg-green-500' :
                        (facility.bedsAvailable / facility.totalBeds) > 0.2 ? 'bg-orange-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${(facility.bedsAvailable / facility.totalBeds) * 100}%` }}
                    />
                  </div>
                </div>

                <Separator />

                {/* Services */}
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Services Available</p>
                  <div className="flex flex-wrap gap-2">
                    {facility.services.map((service, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => {
                      setSelectedPatient(mockPatients[0]);
                      setIsReferralDialogOpen(true);
                    }}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Refer Patient
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Patient Detail Modal */}
      <Dialog open={isPatientDetailOpen} onOpenChange={setIsPatientDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto rounded-3xl">
          <DialogHeader>
            <DialogTitle>Patient Details</DialogTitle>
          </DialogHeader>
          {selectedPatient && (
            <div className="space-y-4">
              {/* Patient Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={selectedPatient.avatar} />
                    <AvatarFallback>{selectedPatient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-foreground">{selectedPatient.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedPatient.age} years • Week {selectedPatient.currentWeek} • {selectedPatient.bloodType}
                    </p>
                    <div className="flex gap-2 mt-1">
                      <Badge className={getRiskColor(selectedPatient.riskLevel)}>
                        {selectedPatient.riskLevel}
                      </Badge>
                      {selectedPatient.consentGiven && (
                        <Badge variant="outline" className="text-xs">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Consent Given
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportPatientData(selectedPatient)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>

              {/* Clinical Alerts */}
              {clinicalAlerts.length > 0 && (
                <Card className="border-red-300 dark:border-red-900 bg-red-50 dark:bg-red-950/20">
                  <CardHeader>
                    <h3 className="text-foreground flex items-center">
                      <AlertCircle className="w-5 h-5 mr-2 text-red-600" />
                      Clinical Decision Support
                    </h3>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {clinicalAlerts.map(alert => (
                      <div key={alert.id} className={`p-3 rounded-lg border ${getAlertSeverityColor(alert.severity)}`}>
                        <div className="flex items-start justify-between mb-1">
                          <p className="text-sm text-foreground">{alert.condition}</p>
                          <Badge variant="outline" className="text-xs">
                            {alert.source}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{alert.recommendation}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Timeline Tabs */}
              <Tabs defaultValue="vitals" className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger value="vitals" className="flex-1">Vitals</TabsTrigger>
                  <TabsTrigger value="medications" className="flex-1">Medications</TabsTrigger>
                  <TabsTrigger value="labs" className="flex-1">Lab Results</TabsTrigger>
                  <TabsTrigger value="history" className="flex-1">History</TabsTrigger>
                </TabsList>

                <TabsContent value="vitals" className="space-y-3">
                  {selectedPatient.vitals.map(vital => (
                    <Card key={vital.id} className="border-border">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm text-muted-foreground">{new Date(vital.date).toLocaleDateString()}</p>
                          <p className="text-xs text-muted-foreground">by {vital.recordedBy}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-xs text-muted-foreground">Blood Pressure</p>
                            <p className="text-foreground">{vital.bloodPressure} mmHg</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Weight</p>
                            <p className="text-foreground">{vital.weight} kg</p>
                          </div>
                          {vital.temperature && (
                            <div>
                              <p className="text-xs text-muted-foreground">Temperature</p>
                              <p className="text-foreground">{vital.temperature}°C</p>
                            </div>
                          )}
                          {vital.heartRate && (
                            <div>
                              <p className="text-xs text-muted-foreground">Heart Rate</p>
                              <p className="text-foreground">{vital.heartRate} bpm</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="medications" className="space-y-3">
                  {selectedPatient.medications.map(med => (
                    <Card key={med.id} className="border-border">
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="text-foreground">{med.name}</p>
                            <p className="text-sm text-muted-foreground">{med.dosage} • {med.frequency}</p>
                          </div>
                          <Badge variant={med.status === 'active' ? 'default' : 'outline'} className="text-xs">
                            {med.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">Prescribed by: {med.prescribedBy}</p>
                        {med.sideEffects && med.sideEffects.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-border">
                            <p className="text-xs text-muted-foreground">Side effects reported:</p>
                            <p className="text-xs text-foreground">{med.sideEffects.join(', ')}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="labs" className="space-y-3">
                  {selectedPatient.labResults.map(lab => (
                    <Card key={lab.id} className={`border-border ${
                      lab.status === 'abnormal' ? 'border-orange-300 dark:border-orange-900' : ''
                    }`}>
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between mb-1">
                          <p className="text-foreground">{lab.type}</p>
                          <Badge variant={lab.status === 'normal' ? 'default' : 'destructive'} className="text-xs">
                            {lab.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{lab.result}</p>
                        <p className="text-xs text-muted-foreground">{new Date(lab.date).toLocaleDateString()}</p>
                        {lab.notes && (
                          <div className="mt-2 pt-2 border-t border-border">
                            <p className="text-xs text-foreground">{lab.notes}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="history" className="space-y-3">
                  <div className="p-3 bg-primary/5 rounded-lg">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Past Pregnancies</p>
                        <p className="text-foreground">{selectedPatient.pastPregnancies}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Complications</p>
                        <p className="text-foreground">{selectedPatient.complications.length || 'None'}</p>
                      </div>
                    </div>
                  </div>
                  {selectedPatient.complications.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Current Complications</p>
                      <div className="space-y-2">
                        {selectedPatient.complications.map((comp, idx) => (
                          <div key={idx} className="flex items-center space-x-2 p-2 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                            <AlertCircle className="w-4 h-4 text-orange-600" />
                            <p className="text-sm text-foreground">{comp}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  onClick={() => {
                    setIsPatientDetailOpen(false);
                    setIsAppointmentDialogOpen(true);
                  }}
                  variant="outline"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule
                </Button>
                <Button 
                  onClick={() => {
                    setIsPatientDetailOpen(false);
                    setIsMedicationDialogOpen(true);
                  }}
                  variant="outline"
                >
                  <Pill className="w-4 h-4 mr-2" />
                  Prescribe
                </Button>
                <Button 
                  onClick={() => {
                    setIsPatientDetailOpen(false);
                    setIsNutritionDialogOpen(true);
                  }}
                  variant="outline"
                >
                  <Apple className="w-4 h-4 mr-2" />
                  Nutrition
                </Button>
                <Button 
                  onClick={() => {
                    setIsPatientDetailOpen(false);
                    setIsReferralDialogOpen(true);
                  }}
                  variant="outline"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Refer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Appointment Dialog */}
      <Dialog open={isAppointmentDialogOpen} onOpenChange={setIsAppointmentDialogOpen}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle>Schedule Appointment</DialogTitle>
            <DialogDescription>
              Create a new appointment for {selectedPatient?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Date</Label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label>Appointment Type</Label>
              <Select value={selectedAppointmentType} onValueChange={setSelectedAppointmentType}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="checkup">Routine Checkup</SelectItem>
                  <SelectItem value="ultrasound">Ultrasound</SelectItem>
                  <SelectItem value="consultation">Consultation</SelectItem>
                  <SelectItem value="nutrition">Nutrition Counseling</SelectItem>
                  <SelectItem value="mental-health">Mental Health</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea
                value={appointmentNotes}
                onChange={(e) => setAppointmentNotes(e.target.value)}
                placeholder="Add any notes for this appointment..."
                className="mt-2"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="recurring"
                checked={isRecurring}
                onCheckedChange={(checked) => setIsRecurring(checked as boolean)}
              />
              <Label htmlFor="recurring">Recurring appointment (Weekly ANC visits)</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAppointmentDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleScheduleAppointment}>
              Schedule Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Nutrition Plan Dialog */}
      <Dialog open={isNutritionDialogOpen} onOpenChange={setIsNutritionDialogOpen}>
        <DialogContent className="rounded-3xl max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Nutrition Plan</DialogTitle>
            <DialogDescription>
              Design a personalized nutrition plan for {selectedPatient?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Daily Calories</Label>
                <Input type="number" placeholder="2200" className="mt-2" />
              </div>
              <div>
                <Label>Protein (g/day)</Label>
                <Input type="number" placeholder="70" className="mt-2" />
              </div>
              <div>
                <Label>Iron (mg/day)</Label>
                <Input type="number" placeholder="27" className="mt-2" />
              </div>
              <div>
                <Label>Calcium (mg/day)</Label>
                <Input type="number" placeholder="1000" className="mt-2" />
              </div>
            </div>
            <div>
              <Label>Dietary Recommendations</Label>
              <Textarea
                placeholder="List recommended foods and meal suggestions..."
                className="mt-2"
                rows={4}
              />
            </div>
            <div>
              <Label>Restrictions</Label>
              <Textarea
                placeholder="List any dietary restrictions..."
                className="mt-2"
                rows={3}
              />
            </div>
            <div>
              <Label>Cultural Food Preferences</Label>
              <Input placeholder="e.g., Ugali, Sukuma wiki, Githeri" className="mt-2" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNutritionDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateNutritionPlan}>
              Create Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Medication Dialog */}
      <Dialog open={isMedicationDialogOpen} onOpenChange={setIsMedicationDialogOpen}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle>Prescribe Medication</DialogTitle>
            <DialogDescription>
              Add medication for {selectedPatient?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Medication Name</Label>
              <Input placeholder="e.g., Iron Supplement" className="mt-2" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Dosage</Label>
                <Input placeholder="e.g., 65mg" className="mt-2" />
              </div>
              <div>
                <Label>Frequency</Label>
                <Select>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="once">Once daily</SelectItem>
                    <SelectItem value="twice">Twice daily</SelectItem>
                    <SelectItem value="thrice">Three times daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Duration</Label>
              <Input type="date" className="mt-2" />
            </div>
            <div>
              <Label>Special Instructions</Label>
              <Textarea
                placeholder="e.g., Take with food, avoid dairy..."
                className="mt-2"
                rows={3}
              />
            </div>
            <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-900">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-foreground mb-1">Drug Interaction Check</p>
                  <p className="text-xs text-muted-foreground">
                    No known interactions detected with current medications
                  </p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMedicationDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handlePrescribeMedication}>
              <Printer className="w-4 h-4 mr-2" />
              Prescribe & Print
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Referral Dialog */}
      <Dialog open={isReferralDialogOpen} onOpenChange={setIsReferralDialogOpen}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle>Refer Patient</DialogTitle>
            <DialogDescription>
              Send referral for {selectedPatient?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Facility</Label>
              <Select>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select facility" />
                </SelectTrigger>
                <SelectContent>
                  {mockFacilities.map(facility => (
                    <SelectItem key={facility.id} value={facility.id}>
                      {facility.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Specialist/Department</Label>
              <Select>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select specialist" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="obgyn">OB/GYN Specialist</SelectItem>
                  <SelectItem value="cardio">Cardiologist</SelectItem>
                  <SelectItem value="endo">Endocrinologist</SelectItem>
                  <SelectItem value="nutrition">Nutritionist</SelectItem>
                  <SelectItem value="mental">Mental Health Counselor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Reason for Referral</Label>
              <Textarea
                placeholder="Describe the reason for this referral..."
                className="mt-2"
                rows={4}
              />
            </div>
            <div>
              <Label>Urgency</Label>
              <Select>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="routine">Routine</SelectItem>
                  <SelectItem value="urgent">Urgent (within 24 hours)</SelectItem>
                  <SelectItem value="emergency">Emergency (immediate)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="share-records" defaultChecked />
              <Label htmlFor="share-records">Share patient records with receiving facility</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReferralDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleReferPatient}>
              <Send className="w-4 h-4 mr-2" />
              Send Referral
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
