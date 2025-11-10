import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner@2.0.3';
import { ProviderAIAssistant } from './ProviderAIAssistant';
import { EnhancedPatientDetailModal } from './EnhancedPatientDetailModal';
import { ProviderProfilePage } from './ProviderProfilePage';
import { ProviderSettingsPage } from './ProviderSettingsPage';
import { ProviderNotifications } from './ProviderNotifications';
import { NutritionPlanCreator } from './NutritionPlanCreator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from './ui/dropdown-menu';
import {
  ArrowLeft, Users, Calendar, Activity, Brain, Send, FileText, TrendingUp,
  Bell, Search, Phone, MessageCircle, Video, AlertTriangle, Filter,
  MoreVertical, Download, RefreshCw, Plus, Building, Shield, Menu,
  X, Heart, Baby, Pill, BarChart3, Clock, MapPin, Stethoscope,
  UserCheck, AlertCircle, CheckCircle2, ChevronDown, Eye, Star,
  Settings, LogOut, Home, Zap, Target, Award, BookOpen, User, Apple
} from 'lucide-react';

interface RevampedProviderPortalProps {
  onBack: () => void;
  providerName?: string;
  providerType?: string;
}

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

interface Referral {
  id: string;
  patientName: string;
  patientId: string;
  fromProvider: string;
  toProvider: string;
  facility: string;
  reason: string;
  urgency: 'routine' | 'urgent' | 'emergency';
  status: 'pending' | 'accepted' | 'completed' | 'rejected';
  date: string;
  notes: string;
}

export function RevampedProviderPortal({ onBack, providerName: providedName, providerType: providedType }: RevampedProviderPortalProps) {
  const providerData = JSON.parse(localStorage.getItem('providerData') || '{}');
  const providerName = providedName || providerData.name || providerData.fullName || "Dr. Carol Odhiambo";
  const providerType = providedType || providerData.specialty || "Obstetrician/Gynecologist";
  
  // State management
  const [activeTab, setActiveTab] = useState<'dashboard' | 'patients' | 'ai-assistant' | 'referrals' | 'analytics' | 'profile' | 'settings'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRisk, setFilterRisk] = useState('all');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isPatientDetailOpen, setIsPatientDetailOpen] = useState(false);
  const [isReferralDialogOpen, setIsReferralDialogOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isNutritionPlanOpen, setIsNutritionPlanOpen] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState<Referral | null>(null);
  const [isViewReferralOpen, setIsViewReferralOpen] = useState(false);
  
  // Referral form state
  const [referralForm, setReferralForm] = useState({
    facility: '',
    toProvider: '',
    specialist: '',
    reason: '',
    urgency: 'routine' as 'routine' | 'urgent' | 'emergency',
    notes: ''
  });

  // Mock data - patients
  const mockPatients: Patient[] = [
    {
      id: '1',
      name: 'Achieng Omondi',
      avatar: 'https://images.unsplash.com/photo-1646913508331-5ef3f22ba677?w=400',
      age: 28,
      currentWeek: 16,
      dueDate: '2025-05-15',
      riskLevel: 'low',
      lastVisit: '2025-10-10',
      nextAppointment: '2025-10-25',
      bloodPressure: '115/75',
      weight: 68,
      hemoglobin: '12.5 g/dL',
      phone: '+254 722 123 456',
      location: 'Kileleshwa, Nairobi',
      recentConcerns: ['Morning sickness', 'Back pain'],
      complications: [],
      medications: [
        { name: 'Folic Acid', dosage: '400mcg', frequency: 'Daily' },
        { name: 'Iron Supplement', dosage: '65mg', frequency: 'Daily' }
      ],
      pastPregnancies: 0
    },
    {
      id: '2',
      name: 'Awino Otieno',
      avatar: 'https://images.unsplash.com/photo-1646913508331-5ef3f22ba677?w=400',
      age: 32,
      currentWeek: 32,
      dueDate: '2025-12-20',
      riskLevel: 'medium',
      lastVisit: '2025-10-08',
      nextAppointment: '2025-10-22',
      bloodPressure: '138/88',
      weight: 72,
      hemoglobin: '11.2 g/dL',
      phone: '+254 744 567 890',
      location: 'Westlands, Nairobi',
      recentConcerns: ['High blood pressure', 'Swelling', 'Headaches'],
      complications: ['Gestational Hypertension'],
      medications: [
        { name: 'Methyldopa', dosage: '250mg', frequency: 'Twice daily' },
        { name: 'Iron + Folic Acid', dosage: '65mg + 400mcg', frequency: 'Daily' }
      ],
      pastPregnancies: 1
    },
    {
      id: '3',
      name: 'Adhiambo Okello',
      avatar: 'https://images.unsplash.com/photo-1646913508331-5ef3f22ba677?w=400',
      age: 35,
      currentWeek: 38,
      dueDate: '2025-11-25',
      riskLevel: 'high',
      lastVisit: '2025-10-14',
      nextAppointment: '2025-10-18',
      bloodPressure: '152/98',
      weight: 78,
      hemoglobin: '10.2 g/dL',
      phone: '+254 766 789 012',
      location: 'Karen, Nairobi',
      recentConcerns: ['Decreased fetal movement', 'Severe headaches', 'Visual disturbances'],
      complications: ['Pre-eclampsia', 'Anemia'],
      medications: [
        { name: 'Labetalol', dosage: '200mg', frequency: 'Twice daily' },
        { name: 'Low-dose Aspirin', dosage: '75mg', frequency: 'Daily' },
        { name: 'IV Iron', dosage: '200mg', frequency: 'Weekly' }
      ],
      pastPregnancies: 2
    },
    {
      id: '4',
      name: 'Anyango Ouma',
      avatar: 'https://images.unsplash.com/photo-1646913508331-5ef3f22ba677?w=400',
      age: 25,
      currentWeek: 20,
      dueDate: '2025-06-10',
      riskLevel: 'low',
      lastVisit: '2025-10-12',
      nextAppointment: '2025-10-28',
      bloodPressure: '118/76',
      weight: 65,
      hemoglobin: '12.8 g/dL',
      phone: '+254 745 678 901',
      location: 'Lavington, Nairobi',
      recentConcerns: ['Feeling baby movements - all good'],
      complications: [],
      medications: [
        { name: 'Prenatal Vitamins', dosage: 'Standard', frequency: 'Daily' }
      ],
      pastPregnancies: 0
    }
  ];

  // Mock referrals
  const mockReferrals: Referral[] = [
    {
      id: 'r1',
      patientName: 'Adhiambo Okello',
      patientId: '3',
      fromProvider: providerName,
      toProvider: 'Dr. Michael Onyango (MFM Specialist)',
      facility: 'Aga Khan University Hospital',
      reason: 'Pre-eclampsia management - requires maternal-fetal medicine consultation',
      urgency: 'urgent',
      status: 'pending',
      date: '2025-10-16',
      notes: 'Patient at 38 weeks with severe pre-eclampsia features. BP 152/98, proteinuria, headaches. Consider early delivery planning.'
    },
    {
      id: 'r2',
      patientName: 'Awino Otieno',
      patientId: '2',
      fromProvider: providerName,
      toProvider: 'Nutritionist - Sarah Akinyi',
      facility: 'Jamaa Mission Hospital',
      reason: 'Gestational hypertension dietary management',
      urgency: 'routine',
      status: 'accepted',
      date: '2025-10-15',
      notes: 'Low-sodium diet counseling needed. Patient motivated and cooperative.'
    }
  ];

  // Filter patients
  const filteredPatients = mockPatients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          patient.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterRisk === 'all' || patient.riskLevel === filterRisk;
    return matchesSearch && matchesFilter;
  });

  // Statistics
  const stats = {
    totalPatients: mockPatients.length,
    highRisk: mockPatients.filter(p => p.riskLevel === 'high' || p.riskLevel === 'critical').length,
    appointmentsToday: 3,
    pendingReferrals: mockReferrals.filter(r => r.status === 'pending').length
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-red-100 dark:bg-red-950/30 text-red-800 dark:text-red-400';
      case 'medium': return 'bg-orange-100 dark:bg-orange-950/30 text-orange-800 dark:text-orange-400';
      default: return 'bg-green-100 dark:bg-green-950/30 text-green-800 dark:text-green-400';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'emergency': return 'bg-red-600 text-white';
      case 'urgent': return 'bg-orange-600 text-white';
      default: return 'bg-blue-600 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 dark:bg-green-950/30 text-green-800 dark:text-green-400';
      case 'accepted': return 'bg-blue-100 dark:bg-blue-950/30 text-blue-800 dark:text-blue-400';
      case 'rejected': return 'bg-red-100 dark:bg-red-950/30 text-red-800 dark:text-red-400';
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-400';
    }
  };

  const handlePatientClick = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsPatientDetailOpen(true);
  };

  const handleReferPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsReferralDialogOpen(true);
  };

  const handleSubmitReferral = () => {
    if (!selectedPatient || !referralForm.facility || !referralForm.toProvider || !referralForm.reason) {
      toast.error('Please fill in all required fields');
      return;
    }

    toast.success(`Referral sent for ${selectedPatient.name}`);
    setIsReferralDialogOpen(false);
    setReferralForm({ facility: '', toProvider: '', specialist: '', reason: '', urgency: 'routine', notes: '' });
  };

  const handleViewReferral = (referral: Referral) => {
    setSelectedReferral(referral);
    setIsViewReferralOpen(true);
  };

  const handleFollowUpReferral = (referral: Referral) => {
    toast.info(`Following up on referral for ${referral.patientName}`);
    // Add follow-up logic here
  };

  const handleCreateNutritionPlan = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsNutritionPlanOpen(true);
  };

  const handleSaveNutritionPlan = (plan: any) => {
    toast.success('Nutrition plan saved successfully');
    // Save logic here
  };

  // Specialist list for referrals
  const specialists = [
    'Maternal-Fetal Medicine Specialist',
    'Perinatologist',
    'Neonatologist',
    'Endocrinologist',
    'Cardiologist',
    'Nutritionist',
    'Mental Health Counselor',
    'Physical Therapist',
    'Hematologist',
    'Urologist'
  ];

  const navigationTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'referrals', label: 'Referrals', icon: Send },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            {activeTab !== 'dashboard' && (
              <Button variant="ghost" size="sm" onClick={() => setActiveTab('dashboard')} className="p-2">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}
            <div className="hidden sm:flex items-center space-x-2">
              <Shield className="w-6 h-6 text-primary" />
              <div>
                <h1 className="text-foreground">SasaMum Provider</h1>
                <p className="text-xs text-muted-foreground">Professional Portal</p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigationTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="text-sm">{tab.label}</span>
                {tab.id === 'referrals' && stats.pendingReferrals > 0 && (
                  <Badge className="bg-red-500 text-white text-xs px-1.5 py-0 min-w-[18px] h-4">
                    {stats.pendingReferrals}
                  </Badge>
                )}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="p-2 relative"
              onClick={() => setIsNotificationsOpen(true)}
            >
              <Bell className="w-5 h-5" />
              <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            </Button>
            
            {/* Quick Actions Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2 hidden md:flex">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => setActiveTab('profile')}>
                  <User className="w-4 h-4 mr-2" />
                  My Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTab('settings')}>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setActiveTab('referrals')}>
                  <Send className="w-4 h-4 mr-2" />
                  Referrals
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsAIOpen(true)}>
                  <Brain className="w-4 h-4 mr-2" />
                  AI Assistant
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => window.print()}>
                  <Download className="w-4 h-4 mr-2" />
                  Export Reports
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-t border-border"
            >
              <div className="p-2 space-y-1">
                {navigationTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as any);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <tab.icon className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </div>
                    {tab.id === 'referrals' && stats.pendingReferrals > 0 && (
                      <Badge className="bg-red-500 text-white">
                        {stats.pendingReferrals}
                      </Badge>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Provider Info Banner */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-b border-border p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
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
                  {providerType}
                </Badge>
                <Badge className="text-xs bg-green-100 dark:bg-green-950/30 text-green-800 dark:text-green-400">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              </div>
            </div>
          </div>
          <Button
            onClick={() => setIsAIOpen(true)}
            className="bg-primary hover:bg-primary/90 hidden sm:flex"
          >
            <Brain className="w-4 h-4 mr-2" />
            AI Assistant
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 pb-20">
        <AnimatePresence mode="wait">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Quick Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-border">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Patients</p>
                        <p className="text-3xl text-foreground mt-1">{stats.totalPatients}</p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center">
                        <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">High Risk</p>
                        <p className="text-3xl text-foreground mt-1">{stats.highRisk}</p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/30 flex items-center justify-center">
                        <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Today's Visits</p>
                        <p className="text-3xl text-foreground mt-1">{stats.appointmentsToday}</p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-950/30 flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Pending Referrals</p>
                        <p className="text-3xl text-foreground mt-1">{stats.pendingReferrals}</p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-950/30 flex items-center justify-center">
                        <Send className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-primary" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Button
                      variant="outline"
                      className="h-auto py-4 flex-col space-y-2"
                      onClick={() => setActiveTab('patients')}
                    >
                      <Users className="w-6 h-6" />
                      <span className="text-sm">View Patients</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto py-4 flex-col space-y-2"
                      onClick={() => setIsAIOpen(true)}
                    >
                      <Brain className="w-6 h-6" />
                      <span className="text-sm">AI Assistant</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto py-4 flex-col space-y-2"
                      onClick={() => setActiveTab('referrals')}
                    >
                      <Send className="w-6 h-6" />
                      <span className="text-sm">Referrals</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto py-4 flex-col space-y-2"
                      onClick={() => setActiveTab('analytics')}
                    >
                      <TrendingUp className="w-6 h-6" />
                      <span className="text-sm">Analytics</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* High Priority Patients */}
              <Card className="border-border">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                    High Priority Patients
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab('patients')}>
                    View All
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockPatients.filter(p => p.riskLevel === 'high' || p.riskLevel === 'critical').map((patient) => (
                      <div
                        key={patient.id}
                        onClick={() => handlePatientClick(patient)}
                        className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/70 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={patient.avatar} />
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {patient.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="text-foreground">{patient.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Week {patient.currentWeek} • {patient.complications.join(', ')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={`text-xs ${getRiskColor(patient.riskLevel)}`}>
                            {patient.riskLevel}
                          </Badge>
                          <Button size="sm" variant="ghost">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-primary" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-foreground">Appointment completed with Achieng Omondi</p>
                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-950/30 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-foreground">Lab results received for Awino Otieno</p>
                        <p className="text-xs text-muted-foreground">4 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-950/30 flex items-center justify-center flex-shrink-0">
                        <Send className="w-4 h-4 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-foreground">Referral accepted for Adhiambo Okello</p>
                        <p className="text-xs text-muted-foreground">Yesterday</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Patients Tab */}
          {activeTab === 'patients' && (
            <motion.div
              key="patients"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Search and Filter */}
              <Card className="border-border">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        placeholder="Search patients by name or location..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={filterRisk} onValueChange={setFilterRisk}>
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Risk Levels</SelectItem>
                        <SelectItem value="low">Low Risk</SelectItem>
                        <SelectItem value="medium">Medium Risk</SelectItem>
                        <SelectItem value="high">High Risk</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Patient Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPatients.map((patient) => (
                  <Card
                    key={patient.id}
                    className="border-border hover:shadow-lg transition-all cursor-pointer hover:border-primary/50"
                    onClick={() => handlePatientClick(patient)}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {/* Patient Header */}
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
                              <p className="text-sm text-muted-foreground">
                                {patient.age} years • Week {patient.currentWeek}
                              </p>
                            </div>
                          </div>
                          <Badge className={`text-xs ${getRiskColor(patient.riskLevel)}`}>
                            {patient.riskLevel}
                          </Badge>
                        </div>

                        {/* Vitals */}
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <Heart className="w-4 h-4 text-red-600" />
                            <span className="text-muted-foreground">BP: {patient.bloodPressure}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Activity className="w-4 h-4 text-blue-600" />
                            <span className="text-muted-foreground">Hgb: {patient.hemoglobin}</span>
                          </div>
                        </div>

                        {/* Concerns */}
                        {patient.recentConcerns.length > 0 && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Recent concerns:</p>
                            <div className="flex flex-wrap gap-1">
                              {patient.recentConcerns.slice(0, 2).map((concern, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs bg-orange-100 dark:bg-orange-950/30 text-orange-800 dark:text-orange-400 px-2 py-1 rounded"
                                >
                                  {concern}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="grid grid-cols-3 gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-green-600 hover:bg-green-700 text-white border-green-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.location.href = `tel:${patient.phone}`;
                            }}
                          >
                            <Phone className="w-3 h-3 mr-1" />
                            Call
                          </Button>
                          <Button
                            size="sm"
                            className="bg-primary hover:bg-primary/90"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReferPatient(patient);
                            }}
                          >
                            <Send className="w-3 h-3 mr-1" />
                            Refer
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCreateNutritionPlan(patient);
                            }}
                          >
                            <Apple className="w-3 h-3 mr-1" />
                            Diet
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredPatients.length === 0 && (
                <Card className="border-border">
                  <CardContent className="p-12 text-center">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No patients found matching your criteria</p>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}



          {/* Referrals Tab */}
          {activeTab === 'referrals' && (
            <motion.div
              key="referrals"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl text-foreground">Patient Referrals</h2>
                <Button onClick={() => {
                  setSelectedPatient(mockPatients[0]);
                  setIsReferralDialogOpen(true);
                }} className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  New Referral
                </Button>
              </div>

              <div className="space-y-3">
                {mockReferrals.map((referral) => (
                  <Card key={referral.id} className="border-border">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="text-foreground">{referral.patientName}</h4>
                              <Badge className={`text-xs ${getUrgencyColor(referral.urgency)}`}>
                                {referral.urgency}
                              </Badge>
                              <Badge className={`text-xs ${getStatusColor(referral.status)}`}>
                                {referral.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              To: {referral.toProvider} at {referral.facility}
                            </p>
                            <p className="text-sm text-foreground mb-2">
                              <span className="text-muted-foreground">Reason:</span> {referral.reason}
                            </p>
                            {referral.notes && (
                              <p className="text-sm text-muted-foreground italic">
                                Notes: {referral.notes}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Sent: {new Date(referral.date).toLocaleDateString('en-KE')}</span>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" onClick={() => handleViewReferral(referral)}>
                              <Eye className="w-3 h-3 mr-1" />
                              View
                            </Button>
                            {referral.status === 'pending' && (
                              <Button size="sm" variant="outline" onClick={() => handleFollowUpReferral(referral)}>
                                <RefreshCw className="w-3 h-3 mr-1" />
                                Follow Up
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h2 className="text-xl text-foreground">Practice Analytics</h2>

              {/* Patient Risk Distribution */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Patient Risk Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-foreground">Low Risk</span>
                        <span className="text-sm text-muted-foreground">
                          {mockPatients.filter(p => p.riskLevel === 'low').length} patients
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${(mockPatients.filter(p => p.riskLevel === 'low').length / mockPatients.length) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-foreground">Medium Risk</span>
                        <span className="text-sm text-muted-foreground">
                          {mockPatients.filter(p => p.riskLevel === 'medium').length} patients
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-orange-500 h-2 rounded-full"
                          style={{ width: `${(mockPatients.filter(p => p.riskLevel === 'medium').length / mockPatients.length) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-foreground">High Risk</span>
                        <span className="text-sm text-muted-foreground">
                          {mockPatients.filter(p => p.riskLevel === 'high').length} patients
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-red-500 h-2 rounded-full"
                          style={{ width: `${(mockPatients.filter(p => p.riskLevel === 'high').length / mockPatients.length) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Common Complications */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Common Complications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-foreground">Gestational Hypertension</span>
                      <Badge>1 patient</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-foreground">Pre-eclampsia</span>
                      <Badge>1 patient</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-foreground">Anemia</span>
                      <Badge>1 patient</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-base">Patient Satisfaction</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2">
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      <span className="ml-2 text-sm text-muted-foreground">4.9/5.0</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Based on 24 reviews</p>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-base">Response Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline space-x-2">
                      <p className="text-3xl text-foreground">12</p>
                      <p className="text-sm text-muted-foreground">minutes avg</p>
                    </div>
                    <p className="text-xs text-green-600 mt-2">↓ 15% from last month</p>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed inset-0 bg-background z-50"
            >
              <ProviderProfilePage onBack={() => setActiveTab('dashboard')} />
            </motion.div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed inset-0 bg-background z-50"
            >
              <ProviderSettingsPage onBack={() => setActiveTab('dashboard')} onSignOut={onBack} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Enhanced Patient Detail Modal */}
      <EnhancedPatientDetailModal
        patient={selectedPatient}
        isOpen={isPatientDetailOpen}
        onClose={() => setIsPatientDetailOpen(false)}
        onAIAnalysis={() => {
          setIsPatientDetailOpen(false);
          setIsAIOpen(true);
        }}
      />

      {/* Notifications Panel */}
      <ProviderNotifications
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      {/* Nutrition Plan Creator */}
      {isNutritionPlanOpen && selectedPatient && (
        <NutritionPlanCreator
          patient={selectedPatient}
          onClose={() => setIsNutritionPlanOpen(false)}
          onSave={handleSaveNutritionPlan}
        />
      )}

      {/* View Referral Dialog */}
      <Dialog open={isViewReferralOpen} onOpenChange={setIsViewReferralOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Referral Details</DialogTitle>
          </DialogHeader>
          {selectedReferral && (
            <div className="space-y-4">
              <div>
                <Label className="text-xs text-muted-foreground">Patient</Label>
                <p className="text-foreground">{selectedReferral.patientName}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Referred To</Label>
                <p className="text-foreground">{selectedReferral.toProvider} at {selectedReferral.facility}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Reason</Label>
                <p className="text-foreground">{selectedReferral.reason}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Notes</Label>
                <p className="text-foreground">{selectedReferral.notes}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={getUrgencyColor(selectedReferral.urgency)}>
                  {selectedReferral.urgency}
                </Badge>
                <Badge className={getStatusColor(selectedReferral.status)}>
                  {selectedReferral.status}
                </Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Old Patient Detail Modal - Removed, using Enhanced version above */}
      <Dialog open={isPatientDetailOpen} onOpenChange={setIsPatientDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Patient Details</DialogTitle>
          </DialogHeader>
          {selectedPatient && (
            <div className="space-y-6">
              {/* Patient Header */}
              <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={selectedPatient.avatar} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {selectedPatient.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-foreground text-lg">{selectedPatient.name}</h3>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <span>{selectedPatient.age} years</span>
                    <span>•</span>
                    <span>Week {selectedPatient.currentWeek}</span>
                    <span>•</span>
                    <span>Due: {new Date(selectedPatient.dueDate).toLocaleDateString('en-KE')}</span>
                  </div>
                  <Badge className={`text-xs mt-2 ${getRiskColor(selectedPatient.riskLevel)}`}>
                    {selectedPatient.riskLevel} Risk
                  </Badge>
                </div>
              </div>

              {/* Vitals */}
              <div>
                <h4 className="text-sm mb-2 text-muted-foreground">Current Vitals</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground">Blood Pressure</p>
                    <p className="text-foreground">{selectedPatient.bloodPressure}</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground">Weight</p>
                    <p className="text-foreground">{selectedPatient.weight} kg</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground">Hemoglobin</p>
                    <p className="text-foreground">{selectedPatient.hemoglobin}</p>
                  </div>
                </div>
              </div>

              {/* Medications */}
              <div>
                <h4 className="text-sm mb-2 text-muted-foreground">Current Medications</h4>
                <div className="space-y-2">
                  {selectedPatient.medications.map((med, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="text-foreground">{med.name}</p>
                        <p className="text-xs text-muted-foreground">{med.dosage} - {med.frequency}</p>
                      </div>
                      <Pill className="w-4 h-4 text-primary" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="bg-green-600 hover:bg-green-700 text-white border-green-600"
                  onClick={() => window.location.href = `tel:${selectedPatient.phone}`}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Patient
                </Button>
                <Button
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => {
                    setIsPatientDetailOpen(false);
                    setIsAIOpen(true);
                  }}
                >
                  <Brain className="w-4 h-4 mr-2" />
                  AI Analysis
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Referral Dialog */}
      <Dialog open={isReferralDialogOpen} onOpenChange={setIsReferralDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Referral</DialogTitle>
            <DialogDescription>
              Refer {selectedPatient?.name} to another healthcare provider
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Facility *</Label>
              <Select value={referralForm.facility} onValueChange={(value) => setReferralForm(prev => ({ ...prev, facility: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select facility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kenyatta">Kenyatta National Hospital</SelectItem>
                  <SelectItem value="agakhan">Aga Khan University Hospital</SelectItem>
                  <SelectItem value="jamaa">Jamaa Mission Hospital</SelectItem>
                  <SelectItem value="nairobi-womens">Nairobi Women's Hospital</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Specialist Type *</Label>
              <Select value={referralForm.specialist} onValueChange={(value) => setReferralForm(prev => ({ ...prev, specialist: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select specialist type" />
                </SelectTrigger>
                <SelectContent>
                  {specialists.map((spec) => (
                    <SelectItem key={spec} value={spec}>
                      {spec}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Referring To (Name) *</Label>
              <Input
                value={referralForm.toProvider}
                onChange={(e) => setReferralForm(prev => ({ ...prev, toProvider: e.target.value }))}
                placeholder="e.g., Dr. Michael Onyango"
              />
            </div>

            <div>
              <Label>Urgency *</Label>
              <Select value={referralForm.urgency} onValueChange={(value: any) => setReferralForm(prev => ({ ...prev, urgency: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="routine">Routine</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Reason for Referral *</Label>
              <Textarea
                value={referralForm.reason}
                onChange={(e) => setReferralForm(prev => ({ ...prev, reason: e.target.value }))}
                placeholder="Describe the reason for referral..."
                rows={3}
              />
            </div>

            <div>
              <Label>Additional Notes</Label>
              <Textarea
                value={referralForm.notes}
                onChange={(e) => setReferralForm(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Any additional information..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReferralDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitReferral} className="bg-primary hover:bg-primary/90">
              <Send className="w-4 h-4 mr-2" />
              Send Referral
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AI Assistant Full Screen Dialog */}
      <Dialog open={isAIOpen} onOpenChange={setIsAIOpen}>
        <DialogContent className="max-w-4xl h-[85vh] max-h-[85vh] p-0 overflow-hidden flex flex-col">
          <ProviderAIAssistant patientData={selectedPatient} onClose={() => setIsAIOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
