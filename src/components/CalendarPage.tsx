import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  User,
  Stethoscope
} from 'lucide-react';

interface CalendarPageProps {
  onBack: () => void;
  userName?: string;
}

export function CalendarPage({ onBack, userName = "Brenda" }: CalendarPageProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Sample appointments data
  const appointments = [
    {
      id: 1,
      date: new Date(2024, 11, 18),
      time: '10:00 AM',
      type: 'Prenatal Checkup',
      doctor: 'Dr. Amara Okoye',
      location: 'Women\'s Health Clinic',
      color: 'bg-primary'
    },
    {
      id: 2, 
      date: new Date(2024, 11, 22),
      time: '2:30 PM',
      type: 'Ultrasound Scan',
      doctor: 'Dr. Kemi Adebayo',
      location: 'Imaging Center',
      color: 'bg-blue-500'
    },
    {
      id: 3,
      date: new Date(2024, 11, 28),
      time: '11:15 AM', 
      type: 'Nutrition Consultation',
      doctor: 'Nutritionist Sarah',
      location: 'Virtual Meeting',
      color: 'bg-green-500'
    }
  ];

  // Generate calendar days
  const generateCalendarDays = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startingDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(currentYear, currentMonth, day));
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();
  const today = new Date();

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(apt => 
      apt.date.toDateString() === date.toDateString()
    );
  };

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.toDateString() === date2.toDateString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-background max-w-sm mx-auto"
    >
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 flex items-center justify-between p-4 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
        <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </Button>
        <h1 className="text-lg text-foreground">Calendar</h1>
        <Avatar className="w-8 h-8">
          <AvatarFallback className="bg-primary text-primary-foreground text-sm">
            {userName.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="px-4 pb-20">
        {/* Month Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex items-center justify-between mb-6"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth('prev')}
            className="p-2"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          
          <h2 className="text-xl text-foreground">
            {monthNames[currentMonth]} {currentYear}
          </h2>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth('next')}
            className="p-2"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </motion.div>

        {/* Calendar Grid */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6"
        >
          <Card className="border-border/50">
            <CardContent className="p-4">
              {/* Day headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                  <div key={index} className="text-center text-xs text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar days */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((date, index) => {
                  if (!date) {
                    return <div key={index} className="h-10" />;
                  }
                  
                  const dayAppointments = getAppointmentsForDate(date);
                  const isSelectedDate = selectedDate && isSameDay(date, selectedDate);
                  
                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedDate(date)}
                      className={`h-10 text-sm rounded-lg flex items-center justify-center relative transition-all duration-200 ${
                        isToday(date)
                          ? 'bg-primary text-primary-foreground font-medium'
                          : isSelectedDate
                          ? 'bg-accent text-foreground ring-2 ring-primary/30'
                          : 'text-foreground hover:bg-accent'
                      }`}
                    >
                      {date.getDate()}
                      {dayAppointments.length > 0 && (
                        <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
                          <div className="w-1 h-1 bg-primary rounded-full" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Upcoming Appointments */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg text-foreground">Upcoming Appointments</h3>
            <Button size="sm" variant="outline" className="p-2">
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-3">
            {appointments
              .filter(apt => apt.date >= today)
              .sort((a, b) => a.date.getTime() - b.date.getTime())
              .map((appointment) => (
                <Card key={appointment.id} className="border-border/50 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className={`w-3 h-12 ${appointment.color} rounded-full flex-shrink-0`} />
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-foreground">{appointment.type}</h4>
                          <Badge variant="outline" className="text-xs">
                            {appointment.date.toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </Badge>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>{appointment.time}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <User className="w-4 h-4" />
                            <span>{appointment.doctor}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Stethoscope className="w-4 h-4" />
                            <span>{appointment.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>

          {selectedDate && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-6"
            >
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader className="pb-3">
                  <h4 className="text-foreground flex items-center space-x-2">
                    <CalendarIcon className="w-4 h-4" />
                    <span>{selectedDate.toLocaleDateString('en-US', { 
                      weekday: 'long',
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </h4>
                </CardHeader>
                <CardContent className="pt-0">
                  {getAppointmentsForDate(selectedDate).length > 0 ? (
                    <div className="space-y-2">
                      {getAppointmentsForDate(selectedDate).map(apt => (
                        <div key={apt.id} className="text-sm text-muted-foreground">
                          {apt.time} - {apt.type}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      No appointments scheduled
                    </div>
                  )}
                  
                  <Button size="sm" variant="outline" className="mt-3 w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Appointment
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
