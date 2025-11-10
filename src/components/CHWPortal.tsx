import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, UserPlus, Activity, AlertCircle, CheckCircle, MapPin, Phone, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback } from './ui/avatar';

interface CHWPortalProps {
  onBack: () => void;
}

interface Patient {
  id: string;
  name: string;
  age: number;
  week: number;
  location: string;
  phone: string;
  lastVisit: string;
  status: 'normal' | 'attention' | 'urgent';
  notes: string;
}

export function CHWPortal({ onBack }: CHWPortalProps) {
  const [activeTab, setActiveTab] = useState('patients');
  const [searchQuery, setSearchQuery] = useState('');

  const patients: Patient[] = [
    {
      id: '1',
      name: 'Akinyi Odhiambo',
      age: 28,
      week: 32,
      location: 'Kibera, Nairobi',
      phone: '+254 712 345 678',
      lastVisit: 'Oct 14, 2025',
      status: 'normal',
      notes: 'Regular checkup scheduled'
    },
    {
      id: '2',
      name: 'Awino Otieno',
      age: 22,
      week: 38,
      location: 'Mathare, Nairobi',
      phone: '+254 723 456 789',
      lastVisit: 'Oct 15, 2025',
      status: 'attention',
      notes: 'High BP - needs monitoring'
    },
    {
      id: '3',
      name: 'Adhiambo Omondi',
      age: 35,
      week: 28,
      location: 'Kawangware, Nairobi',
      phone: '+254 734 567 890',
      lastVisit: 'Oct 10, 2025',
      status: 'urgent',
      notes: 'Missed last 2 appointments'
    },
    {
      id: '4',
      name: 'Atieno Okoth',
      age: 26,
      week: 20,
      location: 'Mukuru, Nairobi',
      phone: '+254 745 678 901',
      lastVisit: 'Oct 16, 2025',
      status: 'normal',
      notes: 'First pregnancy, doing well'
    }
  ];

  const todaySchedule = [
    { time: '9:00 AM', patient: 'Akinyi Odhiambo', type: 'Home Visit', location: 'Kibera' },
    { time: '11:00 AM', patient: 'Awino Otieno', type: 'BP Check', location: 'Mathare' },
    { time: '2:00 PM', patient: 'Adhiambo Omondi', type: 'Follow-up', location: 'Kawangware' },
    { time: '4:00 PM', patient: 'Atieno Okoth', type: 'ANC Visit', location: 'Mukuru' }
  ];

  const stats = [
    { label: 'Active Patients', value: '47', icon: Users, color: 'text-blue-600' },
    { label: 'Visits Today', value: '4', icon: Calendar, color: 'text-green-600' },
    { label: 'Urgent Cases', value: '3', icon: AlertCircle, color: 'text-red-600' },
    { label: 'Referrals', value: '2', icon: Activity, color: 'text-yellow-600' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'attention': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'urgent': return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky-header">
        <div className="flex items-center gap-4 p-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl text-foreground">CHW Portal</h1>
            <p className="text-sm text-muted-foreground">Community Health Worker</p>
          </div>
          <Users className="w-6 h-6 text-primary" />
        </div>
      </div>

      <div className="pt-20 p-4 space-y-6">
        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-2 gap-3"
        >
          {stats.map((stat, index) => (
            <Card key={stat.label}>
              <CardContent className="p-4">
                <stat.icon className={`w-5 h-5 mb-2 ${stat.color}`} />
                <div className="text-2xl mb-1">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="patients">Patients</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            {/* Patients Tab */}
            <TabsContent value="patients" className="space-y-4 mt-4">
              <div className="relative">
                <Input
                  placeholder="Search patients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                <Users className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              </div>

              <div className="space-y-3">
                {filteredPatients.map((patient, index) => (
                  <motion.div
                    key={patient.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3 mb-3">
                          <Avatar>
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {patient.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h3 className="mb-1">{patient.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{patient.age} years</span>
                              <span>•</span>
                              <span>Week {patient.week}</span>
                            </div>
                          </div>
                          <Badge className={getStatusColor(patient.status)}>
                            {patient.status}
                          </Badge>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>{patient.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone className="w-4 h-4" />
                            <span>{patient.phone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>Last visit: {patient.lastVisit}</span>
                          </div>
                        </div>

                        <div className="mt-3 p-2 bg-muted/50 rounded-lg">
                          <p className="text-sm">{patient.notes}</p>
                        </div>

                        <div className="mt-3 flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Phone className="w-4 h-4 mr-1" />
                            Call
                          </Button>
                          <Button size="sm" className="flex-1">
                            <Activity className="w-4 h-4 mr-1" />
                            Record Visit
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Schedule Tab */}
            <TabsContent value="schedule" className="space-y-4 mt-4">
              <Card className="bg-gradient-to-br from-primary/10 to-secondary/10">
                <CardHeader>
                  <CardTitle>Today's Schedule - October 16, 2025</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{todaySchedule.length} visits planned</p>
                </CardContent>
              </Card>

              <div className="space-y-3">
                {todaySchedule.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="text-center min-w-[60px]">
                            <div className="text-sm text-primary">{item.time}</div>
                          </div>
                          <div className="flex-1">
                            <h3 className="mb-1">{item.patient}</h3>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{item.type}</Badge>
                              <span className="text-sm text-muted-foreground">{item.location}</span>
                            </div>
                          </div>
                          <CheckCircle className="w-5 h-5 text-muted-foreground" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-primary" />
                    Register New Mother
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm">Full Name</label>
                    <Input placeholder="Enter mother's name" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label className="text-sm">Age</label>
                      <Input type="number" placeholder="Age" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm">Pregnancy Week</label>
                      <Input type="number" placeholder="Week" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm">Phone Number</label>
                    <Input placeholder="+254 7XX XXX XXX" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm">Location</label>
                    <Input placeholder="Area, County" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm">Notes</label>
                    <Input placeholder="Any important notes..." />
                  </div>

                  <Button className="w-full" size="lg">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Register Mother
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-primary/5">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-sm">
                      After registration, the mother will receive an SMS with instructions to download SasaMum and complete her profile.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
