import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useScrollToTop } from './utils/useScrollToTop';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { NoteModal } from './NoteModal';
import exampleImage from 'figma:asset/56d88be94251bec22ea4a67f42596ef5239a9d51.png';
import { 
  ArrowLeft,
  Menu, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Home,
  Calendar,
  MessageCircle,
  User,
  MoreHorizontal,
  Edit2,
  Trash2
} from 'lucide-react';

interface DetailedCalendarPageProps {
  onBack: () => void;
  userName?: string;
}

interface CalendarNote {
  id: string;
  date: Date;
  text: string;
  color: string;
  category: string;
}

export function DetailedCalendarPage({ onBack, userName = "Brenda" }: DetailedCalendarPageProps) {
  useScrollToTop();
  const [currentDate, setCurrentDate] = useState(new Date()); // Current date - always up to date
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<CalendarNote | null>(null);
  const [notes, setNotes] = useState<CalendarNote[]>([]);
  
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  // Initialize with sample pregnancy notes/journal entries
  useState(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const dayAfter = new Date(today);
    dayAfter.setDate(today.getDate() + 2);
    
    const initialNotes: CalendarNote[] = [
      {
        id: '1',
        date: new Date(today),
        text: 'Eat foods high in fiber, and drink fluids',
        color: 'bg-primary',
        category: 'health'
      },
      {
        id: '2', 
        date: new Date(today),
        text: 'Eat foods high in fiber, and drink plenty water to avoid constipation.',
        color: 'bg-primary',
        category: 'health'
      },
      {
        id: '3',
        date: new Date(today), 
        text: 'Doctor appointment at 2 PM',
        color: 'bg-blue-500',
        category: 'appointments'
      },
      {
        id: '4',
        date: tomorrow,
        text: 'Prenatal yoga class', 
        color: 'bg-purple-500',
        category: 'exercise'
      },
      {
        id: '5',
        date: dayAfter,
        text: 'Feeling energetic today!',
        color: 'bg-pink-500',
        category: 'mood'
      }
    ];
    setNotes(initialNotes);
  });

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Generate calendar days
  const generateCalendarDays = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7; // Make Monday = 0
    const daysInMonth = lastDay.getDate();
    
    const days = [];
    
    // Add days from previous month
    const prevMonth = new Date(currentYear, currentMonth, 0);
    const prevMonthDays = prevMonth.getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(currentYear, currentMonth - 1, prevMonthDays - i),
        isCurrentMonth: false
      });
    }
    
    // Add days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        date: new Date(currentYear, currentMonth, day),
        isCurrentMonth: true
      });
    }
    
    // Add days from next month to fill the grid
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        date: new Date(currentYear, currentMonth + 1, day),
        isCurrentMonth: false
      });
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();

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

  const handleDateClick = (date: Date, isCurrentMonth: boolean) => {
    // If the clicked date is not in the current month, navigate to that month
    if (!isCurrentMonth) {
      setCurrentDate(new Date(date.getFullYear(), date.getMonth(), 1));
      setSelectedDate(date);
      return;
    }
    
    // If clicking the same date again, open note modal
    if (selectedDate && date.toDateString() === selectedDate.toDateString()) {
      setIsNoteModalOpen(true);
    } else {
      // First click just selects the date
      setSelectedDate(date);
    }
  };

  const isSelectedDate = (date: Date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  const getNotesForDate = (date: Date) => {
    return notes.filter(note => 
      note.date.toDateString() === date.toDateString()
    );
  };

  const handleAddNote = (noteData: { text: string; date: Date; category: string }) => {
    if (editingNote) {
      // Update existing note
      setNotes(prev => prev.map(note => 
        note.id === editingNote.id 
          ? { ...note, text: noteData.text, category: noteData.category, color: getCategoryColor(noteData.category) }
          : note
      ));
      setEditingNote(null);
    } else {
      // Add new note
      const newNote: CalendarNote = {
        id: Date.now().toString(),
        text: noteData.text,
        date: noteData.date,
        category: noteData.category,
        color: getCategoryColor(noteData.category)
      };
      setNotes(prev => [...prev, newNote]);
    }
  };

  const handleEditNote = (note: CalendarNote) => {
    setEditingNote(note);
    setSelectedDate(note.date);
    setIsNoteModalOpen(true);
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      health: 'bg-primary',
      symptoms: 'bg-orange-500',
      appointments: 'bg-blue-500',
      nutrition: 'bg-green-500',
      exercise: 'bg-purple-500',
      mood: 'bg-pink-500'
    };
    return colors[category] || 'bg-primary';
  };

  const bottomNavItems = [
    { icon: Home, isActive: false },
    { icon: Calendar, isActive: true },
    { icon: MessageCircle, isActive: false },
    { icon: User, isActive: false }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-background w-full pb-20"
    >
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 flex items-center justify-between p-4 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
        <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </Button>
        <h1 className="text-lg text-foreground">Calendar</h1>
        <Button 
          variant="ghost" 
          size="sm" 
          className="p-2"
          onClick={() => setIsNoteModalOpen(true)}
        >
          <Plus className="w-6 h-6 text-foreground" />
        </Button>
      </div>

      <div className="px-4 pb-20">
        {/* Month Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="flex items-center justify-between mb-6"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth('prev')}
            className="p-2"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </Button>
          
          <h2 className="text-lg text-primary">
            {selectedDate.getDate()} {monthNames[currentMonth]} {currentYear}
          </h2>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth('next')}
            className="p-2"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </Button>
        </motion.div>

        {/* Calendar Grid */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mb-8"
        >
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              {/* Day headers */}
              <div className="grid grid-cols-7 gap-1 mb-3">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                  <div key={index} className="text-center text-sm text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar days */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((dayInfo, index) => {
                  const { date, isCurrentMonth } = dayInfo;
                  const isSelected = isSelectedDate(date);
                  const hasNotes = getNotesForDate(date).length > 0;
                  
                  return (
                    <button
                      key={index}
                      onClick={() => handleDateClick(date, isCurrentMonth)}
                      className={`h-10 text-sm rounded-lg flex items-center justify-center relative transition-all duration-200 ${
                        !isCurrentMonth
                          ? 'text-muted-foreground/40'
                          : isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'text-foreground hover:bg-accent'
                      }`}
                    >
                      {date.getDate()}
                      {hasNotes && (
                        <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
                          <div className={`w-1 h-1 rounded-full ${isCurrentMonth ? 'bg-primary' : 'bg-muted-foreground/40'}`} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notes Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg text-foreground">Notes Created</h3>
            <Button variant="ghost" size="sm" className="p-1">
              <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
            </Button>
          </div>

          <div className="space-y-3">
            {getNotesForDate(selectedDate).map((note) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="flex items-start space-x-3 group"
              >
                <div className={`w-3 h-3 ${note.color} rounded-full mt-2 flex-shrink-0`} />
                <div className="flex-1">
                  <p className="text-sm text-foreground leading-relaxed">
                    {note.text}
                  </p>
                  <Badge variant="outline" className="text-xs mt-1 capitalize">
                    {note.category}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-1 h-7 w-7"
                    onClick={() => handleEditNote(note)}
                  >
                    <Edit2 className="w-3 h-3" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-1 h-7 w-7 text-destructive hover:text-destructive"
                    onClick={() => handleDeleteNote(note.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </motion.div>
            ))}

            {getNotesForDate(selectedDate).length === 0 && (
              <div className="text-center py-8 space-y-3">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <Calendar className="w-6 h-6 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-foreground">No notes for this date</p>
                  <p className="text-xs text-muted-foreground">
                    Tap the + button to add your first note
                  </p>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => setIsNoteModalOpen(true)}
                  className="mt-3"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Note
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm bg-white border-t border-border/50 px-4 py-3"
      >
        <div className="flex justify-around">
          {bottomNavItems.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={() => {
                if (item.icon === Home) {
                  onBack();
                }
              }}
              className={`p-3 transition-all duration-200 ${
                item.isActive 
                  ? 'text-primary bg-primary/10 scale-110' 
                  : 'text-muted-foreground hover:text-foreground hover:scale-105'
              }`}
            >
              <item.icon className="w-6 h-6" />
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Note Modal */}
      <NoteModal
        isOpen={isNoteModalOpen}
        onClose={() => {
          setIsNoteModalOpen(false);
          setEditingNote(null);
        }}
        onSave={handleAddNote}
        selectedDate={selectedDate}
        editingNote={editingNote}
      />
    </motion.div>
  );
}