import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { X, Save, Calendar, Clock } from 'lucide-react';

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: { text: string; date: Date; category: string }) => void;
  selectedDate: Date;
  editingNote?: { text: string; category: string } | null;
}

export function NoteModal({ isOpen, onClose, onSave, selectedDate, editingNote }: NoteModalProps) {
  const [noteText, setNoteText] = useState('');
  const [category, setCategory] = useState('health');

  // Update when editingNote changes
  React.useEffect(() => {
    if (editingNote) {
      setNoteText(editingNote.text);
      setCategory(editingNote.category);
    } else {
      setNoteText('');
      setCategory('health');
    }
  }, [editingNote, isOpen]);
  
  const categories = [
    { id: 'health', label: 'Health Tips', color: 'bg-primary' },
    { id: 'symptoms', label: 'Symptoms', color: 'bg-orange-500' },
    { id: 'appointments', label: 'Appointments', color: 'bg-blue-500' },
    { id: 'nutrition', label: 'Nutrition', color: 'bg-green-500' },
    { id: 'exercise', label: 'Exercise', color: 'bg-purple-500' },
    { id: 'mood', label: 'Mood', color: 'bg-pink-500' }
  ];

  const handleSave = () => {
    if (noteText.trim()) {
      onSave({
        text: noteText.trim(),
        date: selectedDate,
        category
      });
      setNoteText('');
      setCategory('health');
      onClose();
    }
  };

  const handleClose = () => {
    setNoteText('');
    setCategory('health');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-md bg-background rounded-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="h-full border-none shadow-none">
              <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border sticky top-0 bg-background z-10 rounded-t-2xl">
                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg text-foreground">{editingNote ? 'Edit Note' : 'Add Note'}</h3>
                  <div className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{selectedDate.toLocaleDateString('en-US', { 
                      weekday: 'short',
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    })}</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={handleClose} className="p-2 hover:bg-destructive/10">
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </CardHeader>

              <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* Category Selection */}
                <div className="space-y-3">
                  <Label className="text-sm sm:text-base text-foreground">Category</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setCategory(cat.id)}
                        className={`p-2 sm:p-3 rounded-lg border text-xs sm:text-sm transition-all duration-200 ${
                          category === cat.id
                            ? 'border-primary bg-primary/10 text-primary shadow-sm'
                            : 'border-border/50 text-muted-foreground hover:border-primary/30 hover:bg-accent/50'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${cat.color} rounded-full`} />
                          <span>{cat.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Note Text */}
                <div className="space-y-3">
                  <Label htmlFor="noteText" className="text-sm sm:text-base text-foreground">Your Note</Label>
                  <Textarea
                    id="noteText"
                    placeholder="Write your pregnancy note here... (e.g., 'Feeling great today, had my prenatal vitamins')"
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    maxLength={500}
                    className="min-h-[100px] sm:min-h-[120px] bg-background border-border focus:border-primary resize-none text-sm sm:text-base"
                  />
                  <div className="text-xs text-muted-foreground text-right">
                    {noteText.length}/500 characters
                  </div>
                </div>

                {/* Quick Templates */}
                <div className="space-y-2">
                  <Label className="text-sm text-foreground">Quick Templates</Label>
                  <div className="grid grid-cols-1 gap-1.5">
                    {[
                      "Took prenatal vitamins today",
                      "Feeling baby movements",
                      "Had a good night's sleep",
                      "Craving healthy foods today",
                      "Feeling energetic and happy"
                    ].map((template, index) => (
                      <button
                        key={index}
                        onClick={() => setNoteText(template)}
                        className="text-left p-2 text-xs text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-md transition-colors"
                      >
                        + {template}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-2 sticky bottom-0 bg-background">
                  <Button 
                    variant="outline" 
                    onClick={handleClose}
                    className="flex-1 border-border/50"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSave}
                    disabled={!noteText.trim()}
                    className="flex-1 bg-primary hover:bg-primary/90"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Note
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
