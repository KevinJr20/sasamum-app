import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, Clock, MapPin, Hospital, Bell, CheckCircle, AlertCircle, Video, Activity, Apple } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Calendar as CalendarUI } from './ui/calendar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface SmartAppointmentSchedulerProps {
  onBack: () => void;
}

interface Appointment {
  id: string;
  type: string;
  date: string;
  time: string;
  facility: string;
  doctor: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  reminder: boolean;
}

export function SmartAppointmentScheduler({ onBack }: SmartAppointmentSchedulerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [showBooking, setShowBooking] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [selectedFacility, setSelectedFacility] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const appointments: Appointment[] = [
    {
      id: '1',
      type: 'ANC Checkup',
      date: 'Oct 18, 2025',
      time: '10:00 AM',
      facility: 'Kenyatta National Hospital',
      doctor: 'Dr. Atieno Ouma',
      status: 'upcoming',
      reminder: true
    },
    {
      id: '2',
      type: 'Ultrasound Scan',
      date: 'Oct 25, 2025',
      time: '2:00 PM',
      facility: 'Nairobi Women\'s Hospital',
      doctor: 'Dr. Akinyi Okech',
      status: 'upcoming',
      reminder: true
    },
    {
      id: '3',
      type: 'Counseling Session',
      date: 'Oct 12, 2025',
      time: '11:00 AM',
      facility: 'Virtual Meeting',
      doctor: 'Counselor Awino Adhiambo',
      status: 'completed',
      reminder: false
    }
  ];

  const appointmentTypes = [
    { value: 'anc', label: 'ANC Checkup', icon: Hospital },
    { value: 'ultrasound', label: 'Ultrasound Scan', icon: Activity },
    { value: 'counseling', label: 'Counseling', icon: Video },
    { value: 'lab', label: 'Lab Tests', icon: AlertCircle },
    { value: 'nutrition', label: 'Nutrition Consult', icon: Apple }
  ];

  const facilities = [
    'Kenyatta National Hospital',
    'Nairobi Women\'s Hospital',
    'Pumwani Maternity Hospital',
    'Aga Khan Hospital',
    'MP Shah Hospital'
  ];

  const timeSlots = [
    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/20">Upcoming</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20">Completed</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-700 dark:bg-red-900/20">Cancelled</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky-header">
        <div className="flex items-center gap-4 p-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl text-foreground">Appointments</h1>
            <p className="text-sm text-muted-foreground">Book & manage visits</p>
          </div>
          <Calendar className="w-6 h-6 text-primary" />
        </div>
      </div>

      <div className="pt-20 p-4 space-y-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Dialog open={showBooking} onOpenChange={setShowBooking}>
            <DialogTrigger asChild>
              <Button className="w-full" size="lg">
                <Calendar className="w-5 h-5 mr-2" />
                Book New Appointment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Book Appointment</DialogTitle>
                <DialogDescription>
                  Schedule your next visit with automatic reminders
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label className="text-sm">Appointment Type</label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type..." />
                    </SelectTrigger>
                    <SelectContent>
                      {appointmentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm">Health Facility</label>
                  <Select value={selectedFacility} onValueChange={setSelectedFacility}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select facility..." />
                    </SelectTrigger>
                    <SelectContent>
                      {facilities.map((facility) => (
                        <SelectItem key={facility} value={facility}>
                          {facility}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm">Date</label>
                  <CalendarUI
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm">Preferred Time</label>
                  <Select value={selectedTime} onValueChange={setSelectedTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time..." />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full" onClick={() => setShowBooking(false)}>
                  Confirm Booking
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Upcoming Appointments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <h2 className="mb-4">Your Appointments</h2>
          <div className="space-y-3">
            {appointments.map((appointment, index) => (
              <motion.div
                key={appointment.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="mb-1">{appointment.type}</h3>
                        {getStatusBadge(appointment.status)}
                      </div>
                      {appointment.reminder && appointment.status === 'upcoming' && (
                        <Bell className="w-5 h-5 text-primary" />
                      )}
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{appointment.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{appointment.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{appointment.facility}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Hospital className="w-4 h-4" />
                        <span>{appointment.doctor}</span>
                      </div>
                    </div>

                    {appointment.status === 'upcoming' && (
                      <div className="mt-4 flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          Reschedule
                        </Button>
                        <Button variant="destructive" size="sm" className="flex-1">
                          Cancel
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Reminders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                Smart Reminders
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm">SMS reminder 24 hours before appointment</p>
                  <p className="text-xs text-muted-foreground">Active for all upcoming visits</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm">Push notification 2 hours before</p>
                  <p className="text-xs text-muted-foreground">With directions to facility</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
