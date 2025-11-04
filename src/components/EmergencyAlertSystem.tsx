import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, AlertTriangle, Phone, MapPin, Users, Clock, Send, CheckCircle, Activity } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { toast } from 'sonner@2.0.3';

interface EmergencyAlertSystemProps {
  onBack: () => void;
}

interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  isPrimary: boolean;
}

const RED_FLAG_SYMPTOMS = [
  { id: 'bleeding', label: 'Heavy vaginal bleeding', severity: 'critical' },
  { id: 'severe-pain', label: 'Severe abdominal pain', severity: 'critical' },
  { id: 'no-movement', label: 'No fetal movement for 12+ hours', severity: 'critical' },
  { id: 'vision-changes', label: 'Blurred vision or seeing spots', severity: 'high' },
  { id: 'severe-headache', label: 'Severe headache that won\'t go away', severity: 'high' },
  { id: 'chest-pain', label: 'Chest pain or difficulty breathing', severity: 'critical' },
  { id: 'dizziness', label: 'Severe dizziness or fainting', severity: 'high' },
  { id: 'high-fever', label: 'High fever (>38.5°C / 101.3°F)', severity: 'high' },
  { id: 'swelling', label: 'Sudden swelling of face/hands', severity: 'high' },
  { id: 'contractions', label: 'Regular contractions before 37 weeks', severity: 'high' },
  { id: 'water-break', label: 'Water breaking/fluid leaking', severity: 'critical' },
  { id: 'vomiting', label: 'Persistent vomiting', severity: 'moderate' },
];

export function EmergencyAlertSystem({ onBack }: EmergencyAlertSystemProps) {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [alertSent, setAlertSent] = useState(false);

  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([
    { id: '1', name: 'Akinyi Odhiambo', relationship: 'Husband', phone: '+254 712 345 678', isPrimary: true },
    { id: '2', name: 'Mama Grace', relationship: 'Mother', phone: '+254 723 456 789', isPrimary: false },
    { id: '3', name: 'Dr. Adhiambo', relationship: 'Doctor', phone: '+254 734 567 890', isPrimary: false },
  ]);

  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [newContact, setNewContact] = useState<Partial<EmergencyContact>>({});

  const handleSymptomToggle = (symptomId: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptomId)
        ? prev.filter(id => id !== symptomId)
        : [...prev, symptomId]
    );
  };

  const handleReportSymptoms = () => {
    if (selectedSymptoms.length === 0) {
      toast.error('Please select at least one symptom');
      return;
    }

    const hasCritical = selectedSymptoms.some(id => {
      const symptom = RED_FLAG_SYMPTOMS.find(s => s.id === id);
      return symptom?.severity === 'critical';
    });

    if (hasCritical) {
      setIsSOSActive(true);
      toast.error('CRITICAL SYMPTOMS DETECTED! Activating emergency alert...', {
        duration: 10000,
      });
    } else {
      toast.warning('Important symptoms reported. Your healthcare provider will be notified.', {
        duration: 7000,
      });
    }

    // Simulate sending alert
    setTimeout(() => {
      setAlertSent(true);
      toast.success('Alert sent to your emergency contacts and healthcare provider');
    }, 2000);
  };

  const handleSOSActivation = () => {
    setIsSOSActive(true);
    setAlertSent(false);

    // Get user location (simulated)
    const location = 'Nairobi, Kenya (Approximate)';
    
    toast.error('🚨 EMERGENCY SOS ACTIVATED!', {
      duration: 15000,
    });

    // Simulate sending SOS
    setTimeout(() => {
      setAlertSent(true);
      toast.success(`Emergency alert sent to all contacts with your location: ${location}`);
    }, 3000);
  };

  const handleAddContact = () => {
    if (!newContact.name || !newContact.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    const contact: EmergencyContact = {
      id: Date.now().toString(),
      name: newContact.name,
      relationship: newContact.relationship || 'Other',
      phone: newContact.phone,
      isPrimary: false,
    };

    setEmergencyContacts([...emergencyContacts, contact]);
    setNewContact({});
    setIsAddContactOpen(false);
    toast.success('Emergency contact added successfully');
  };

  const criticalSymptomsCount = selectedSymptoms.filter(id => {
    const symptom = RED_FLAG_SYMPTOMS.find(s => s.id === id);
    return symptom?.severity === 'critical';
  }).length;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky-header">
        <div className="flex items-center gap-4 p-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-foreground">Emergency Alert System</h1>
            <p className="text-sm text-muted-foreground">Report symptoms & get help fast</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6 page-with-header">
        {/* SOS Button */}
        <Card className="p-6 bg-gradient-to-br from-destructive/20 to-destructive/10 border-destructive/30">
          <div className="text-center space-y-4">
            <AlertTriangle className="w-12 h-12 text-destructive mx-auto" />
            <div>
              <h2 className="text-foreground mb-2">Emergency SOS</h2>
              <p className="text-sm text-muted-foreground">
                Press this button if you need immediate help. It will alert all your emergency contacts with your location.
              </p>
            </div>
            <Button
              onClick={handleSOSActivation}
              disabled={isSOSActive && !alertSent}
              className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground py-6"
              size="lg"
            >
              {isSOSActive && !alertSent ? (
                <>
                  <Activity className="w-5 h-5 mr-2 animate-pulse" />
                  Sending Emergency Alert...
                </>
              ) : alertSent ? (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Alert Sent Successfully
                </>
              ) : (
                <>
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Activate Emergency SOS
                </>
              )}
            </Button>
            {isSOSActive && (
              <div className="text-sm space-y-2">
                <p className="text-destructive">Emergency services: 999 / 112</p>
                <p className="text-destructive">Ambulance: 999</p>
              </div>
            )}
          </div>
        </Card>

        {/* Symptom Checker */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-primary" />
            <h2 className="text-foreground">Report Red Flag Symptoms</h2>
          </div>
          
          {criticalSymptomsCount > 0 && (
            <div className="mb-4 p-3 bg-destructive/20 border border-destructive/30 rounded-lg">
              <p className="text-sm text-destructive">
                ⚠️ {criticalSymptomsCount} critical symptom(s) selected. Immediate medical attention required!
              </p>
            </div>
          )}

          <div className="space-y-3 mb-4">
            {RED_FLAG_SYMPTOMS.map((symptom) => (
              <div
                key={symptom.id}
                className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                  selectedSymptoms.includes(symptom.id)
                    ? 'bg-primary/10 border-primary/30'
                    : 'bg-card border-border/50'
                }`}
              >
                <Checkbox
                  id={symptom.id}
                  checked={selectedSymptoms.includes(symptom.id)}
                  onCheckedChange={() => handleSymptomToggle(symptom.id)}
                />
                <div className="flex-1">
                  <Label htmlFor={symptom.id} className="cursor-pointer text-foreground">
                    {symptom.label}
                  </Label>
                  <Badge
                    variant={
                      symptom.severity === 'critical'
                        ? 'destructive'
                        : symptom.severity === 'high'
                        ? 'warning'
                        : 'secondary'
                    }
                    className="ml-2 text-xs"
                  >
                    {symptom.severity}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2 mb-4">
            <Label>Additional Notes (Optional)</Label>
            <Textarea
              placeholder="Describe any other symptoms or concerns..."
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              rows={3}
            />
          </div>

          <Button
            onClick={handleReportSymptoms}
            className="w-full"
            disabled={selectedSymptoms.length === 0}
          >
            <Send className="w-4 h-4 mr-2" />
            Report Symptoms
          </Button>
        </Card>

        {/* Emergency Contacts */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <h2 className="text-foreground">Emergency Contacts</h2>
            </div>
            <Button size="sm" variant="outline" onClick={() => setIsAddContactOpen(true)}>
              Add Contact
            </Button>
          </div>

          <div className="space-y-3">
            {emergencyContacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-start justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-foreground">{contact.name}</h3>
                    {contact.isPrimary && (
                      <Badge variant="default" className="text-xs">Primary</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{contact.relationship}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Phone className="w-3 h-3 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">{contact.phone}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(`tel:${contact.phone}`)}
                >
                  Call
                </Button>
              </div>
            ))}
          </div>

          {emergencyContacts.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              No emergency contacts added yet. Add your first contact to get started.
            </p>
          )}
        </Card>

        {/* Quick Access Numbers */}
        <Card className="p-4">
          <h2 className="text-foreground mb-4">Kenya Emergency Numbers</h2>
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-between"
              onClick={() => window.open('tel:999')}
            >
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>Police / Ambulance</span>
              </div>
              <span>999</span>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-between"
              onClick={() => window.open('tel:112')}
            >
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>Emergency Hotline</span>
              </div>
              <span>112</span>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-between"
              onClick={() => window.open('tel:1199')}
            >
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>St. John Ambulance</span>
              </div>
              <span>1199</span>
            </Button>
          </div>
        </Card>

        {/* Safety Tips */}
        <Card className="p-4 bg-primary/10 border-primary/20">
          <h3 className="text-foreground mb-3">When to Seek Emergency Care</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Heavy bleeding that soaks through a pad in an hour</li>
            <li>• Severe pain that doesn't improve with rest</li>
            <li>• No fetal movement for more than 12 hours</li>
            <li>• Sudden severe headache with vision changes</li>
            <li>• Difficulty breathing or chest pain</li>
            <li>• Signs of labor before 37 weeks</li>
          </ul>
        </Card>
      </div>

      {/* Add Contact Dialog */}
      <Dialog open={isAddContactOpen} onOpenChange={setIsAddContactOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Emergency Contact</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input
                placeholder="Contact name"
                value={newContact.name || ''}
                onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Relationship</Label>
              <Input
                placeholder="e.g., Husband, Mother, Doctor"
                value={newContact.relationship || ''}
                onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Phone Number *</Label>
              <Input
                type="tel"
                placeholder="+254 712 345 678"
                value={newContact.phone || ''}
                onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
              />
            </div>
            <Button onClick={handleAddContact} className="w-full">
              Add Contact
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
