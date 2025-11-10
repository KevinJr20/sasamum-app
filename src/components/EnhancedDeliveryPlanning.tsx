import React, { useState } from 'react';
import { motion } from "framer-motion";
import { useScrollToTop } from './utils/useScrollToTop';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { toast } from 'sonner@2.0.3';
import { generateBirthPlanPDF } from './utils/pdfGenerator';
import { 
  ArrowLeft, MapPin, Hospital, AlertTriangle, CheckCircle, 
  Navigation, Phone, Baby, Edit, Save, X, Calendar,
  Users, Heart, FileText, MapPinned, Ambulance
} from 'lucide-react';

interface EnhancedDeliveryPlanningProps {
  onBack: () => void;
}

interface Hospital {
  name: string;
  distance: string;
  riskMatch: number;
  facilities: string[];
  available: boolean;
  phone: string;
  address: string;
  coordinates: { lat: number; lng: number };
}

interface ChecklistItem {
  id: string;
  item: string;
  done: boolean;
}

interface BirthPlanItem {
  category: string;
  preferences: string[];
}

export function EnhancedDeliveryPlanning({ onBack }: EnhancedDeliveryPlanningProps) {
  useScrollToTop();
  const [estimatedDate] = useState('February 15, 2026');
  const [isEditingChecklist, setIsEditingChecklist] = useState(false);
  const [isEditingBirthPlan, setIsEditingBirthPlan] = useState(false);
  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [showAddItemDialog, setShowAddItemDialog] = useState(false);

  // Risk Profile with dynamic calculation
  const [riskProfile] = useState({
    level: 'Medium Risk',
    score: 45,
    factors: [
      { factor: 'Age over 35', impact: 'medium' as const },
      { factor: 'First pregnancy', impact: 'low' as const },
      { factor: 'Previous C-section', impact: 'medium' as const }
    ],
    recommendations: [
      'Facility with NICU Level 2 or higher required',
      'Specialist obstetrician consultation recommended',
      'Blood bank access essential within 30 minutes',
      'Emergency cesarean capability required'
    ]
  });

  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { id: '1', item: 'Hospital bag packed (mother)', done: true },
    { id: '2', item: 'Hospital bag packed (baby)', done: true },
    { id: '3', item: 'Transport arranged', done: true },
    { id: '4', item: 'Birth partner briefed', done: false },
    { id: '5', item: 'Emergency contacts updated', done: true },
    { id: '6', item: 'Hospital pre-registration completed', done: false },
    { id: '7', item: 'SHA/Insurance verified', done: true },
    { id: '8', item: 'Home prepared for baby arrival', done: false }
  ]);

  const [birthPlan, setBirthPlan] = useState<BirthPlanItem[]>([
    {
      category: 'Labor Preferences',
      preferences: [
        'Natural delivery preferred',
        'Epidural available if needed',
        'Freedom to move during labor',
        'Dim lighting and calm environment'
      ]
    },
    {
      category: 'Delivery Preferences',
      preferences: [
        'Skin-to-skin immediately after birth',
        'Delayed cord clamping',
        'Birth partner present throughout',
        'Photos/videos allowed'
      ]
    },
    {
      category: 'Postpartum Preferences',
      preferences: [
        'Breastfeeding within first hour',
        'Rooming-in with baby',
        'Lactation consultant support',
        'Limited visitors initially'
      ]
    }
  ]);

  const recommendedHospitals: Hospital[] = [
    {
      name: 'Kenyatta National Hospital',
      distance: '4.2 km',
      riskMatch: 95,
      facilities: ['NICU Level 3', 'Blood Bank', 'Emergency Theatre', 'Specialist OB/GYN'],
      available: true,
      phone: '+254 20 2726300',
      address: 'Hospital Road, Upper Hill, Nairobi',
      coordinates: { lat: -1.3008, lng: 36.8070 }
    },
    {
      name: 'Nairobi Women\'s Hospital',
      distance: '6.8 km',
      riskMatch: 90,
      facilities: ['NICU Level 2', 'Blood Bank', '24/7 Theatre', 'Lactation Support'],
      available: true,
      phone: '+254 20 3750800',
      address: 'Argwings Kodhek Road, Nairobi',
      coordinates: { lat: -1.2992, lng: 36.7933 }
    },
    {
      name: 'Aga Khan University Hospital',
      distance: '8.1 km',
      riskMatch: 88,
      facilities: ['NICU Level 3', 'Blood Bank', 'Emergency Care', 'Private Wards'],
      available: true,
      phone: '+254 20 3662000',
      address: 'Third Parklands Avenue, Nairobi',
      coordinates: { lat: -1.2631, lng: 36.8073 }
    }
  ];

  const toggleChecklistItem = (id: string) => {
    setChecklist(prev => prev.map(item => 
      item.id === id ? { ...item, done: !item.done } : item
    ));
  };

  const addChecklistItem = () => {
    if (newChecklistItem.trim()) {
      const newItem: ChecklistItem = {
        id: Date.now().toString(),
        item: newChecklistItem.trim(),
        done: false
      };
      setChecklist(prev => [...prev, newItem]);
      setNewChecklistItem('');
      setShowAddItemDialog(false);
      toast.success('Item added to checklist');
    }
  };

  const removeChecklistItem = (id: string) => {
    setChecklist(prev => prev.filter(item => item.id !== id));
    toast.success('Item removed from checklist');
  };

  const handleGetDirections = (hospital: Hospital) => {
    const { lat, lng } = hospital.coordinates;
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(mapsUrl, '_blank');
    toast.success(`Opening directions to ${hospital.name}`);
  };

  const handleCallHospital = (hospital: Hospital) => {
    window.location.href = `tel:${hospital.phone}`;
    toast.info(`Calling ${hospital.name}...`);
  };

  const getMatchColor = (match: number) => {
    if (match >= 90) return 'text-green-600 dark:text-green-400';
    if (match >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getMatchBg = (match: number) => {
    if (match >= 90) return 'bg-green-100 dark:bg-green-900/20';
    if (match >= 70) return 'bg-yellow-100 dark:bg-yellow-900/20';
    return 'bg-red-100 dark:bg-red-900/20';
  };

  const calculatePreparedness = () => {
    const completed = checklist.filter(item => item.done).length;
    return Math.round((completed / checklist.length) * 100);
  };

  const daysToGo = () => {
    const due = new Date(estimatedDate);
    const now = new Date('2025-10-16'); // Current date
    const diffTime = due.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-background pb-20"
    >
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 flex items-center justify-between p-4 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
        <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </Button>
        <div className="flex-1 text-center">
          <h1 className="text-lg text-foreground">Delivery Planning</h1>
          <p className="text-xs text-muted-foreground">AI-powered recommendations</p>
        </div>
        <Baby className="w-6 h-6 text-primary" />
      </div>

      <div className="p-4 space-y-6">
        {/* Estimated Delivery Date */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
            <CardContent className="p-6 text-center">
              <Calendar className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="mb-2 text-muted-foreground">Estimated Delivery Date</h3>
              <div className="text-2xl text-primary mb-1">{estimatedDate}</div>
              <p className="text-sm text-muted-foreground">{daysToGo()} days to go</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Risk Profile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                AI Risk Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">{riskProfile.level}</span>
                  <Badge variant="secondary" className="text-xs">
                    {riskProfile.score}% Risk Score
                  </Badge>
                </div>
                <Progress value={riskProfile.score} className="h-2" />
              </div>

              <div className="space-y-2">
                <p className="text-sm">Identified Risk Factors:</p>
                {riskProfile.factors.map((factor, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className={`w-2 h-2 rounded-full ${
                      factor.impact === 'high' ? 'bg-red-500' :
                      factor.impact === 'medium' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`} />
                    <span>{factor.factor}</span>
                    <Badge variant="outline" className="text-xs ml-auto">
                      {factor.impact} impact
                    </Badge>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t space-y-2">
                <p className="text-sm">AI Recommendations:</p>
                {riskProfile.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{rec}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recommended Facilities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <h2 className="mb-4 flex items-center gap-2">
            <Hospital className="w-5 h-5 text-primary" />
            Recommended Facilities
          </h2>
          <div className="space-y-3">
            {recommendedHospitals.map((hospital, index) => (
              <motion.div
                key={hospital.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="mb-1 flex items-center gap-2">
                          {hospital.name}
                          {index === 0 && (
                            <Badge className="bg-primary/20 text-primary text-xs">
                              Best Match
                            </Badge>
                          )}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <MapPin className="w-3 h-3" />
                          <span>{hospital.distance} away</span>
                          <span>•</span>
                          <span>{hospital.address}</span>
                        </div>
                      </div>
                      <Badge className={getMatchBg(hospital.riskMatch)}>
                        <span className={getMatchColor(hospital.riskMatch)}>
                          {hospital.riskMatch}% Match
                        </span>
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {hospital.facilities.map((facility, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {facility}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="default"
                        className="flex-1"
                        onClick={() => handleGetDirections(hospital)}
                      >
                        <Navigation className="w-4 h-4 mr-2" />
                        Directions
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleCallHospital(hospital)}
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Call
                      </Button>
                    </div>

                    {!hospital.available && (
                      <div className="mt-3 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Limited availability - call to confirm
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Preparedness Checklist */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  Preparedness Checklist
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddItemDialog(true)}
                >
                  Add Item
                </Button>
              </div>
              <div className="mt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    {checklist.filter(item => item.done).length} of {checklist.length} completed
                  </span>
                  <span className="text-sm text-primary">{calculatePreparedness()}%</span>
                </div>
                <Progress value={calculatePreparedness()} className="h-2" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {checklist.map((item) => (
                <div key={item.id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3 flex-1">
                    <Checkbox
                      id={item.id}
                      checked={item.done}
                      onCheckedChange={() => toggleChecklistItem(item.id)}
                    />
                    <Label
                      htmlFor={item.id}
                      className={`text-sm cursor-pointer ${
                        item.done ? 'line-through text-muted-foreground' : 'text-foreground'
                      }`}
                    >
                      {item.item}
                    </Label>
                  </div>
                  {isEditingChecklist && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeChecklistItem(item.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4 text-destructive" />
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Birth Plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  My Birth Plan
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingBirthPlan(!isEditingBirthPlan)}
                >
                  {isEditingBirthPlan ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {birthPlan.map((section, index) => (
                <div key={index} className="space-y-2">
                  <h4 className="text-sm text-muted-foreground">{section.category}</h4>
                  <ul className="space-y-2">
                    {section.preferences.map((pref, prefIndex) => (
                      <li key={prefIndex} className="flex items-start gap-2 text-sm">
                        <Heart className="w-4 h-4 text-pink-500 flex-shrink-0 mt-0.5" />
                        <span>{pref}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {isEditingBirthPlan && (
                <div className="pt-4 border-t space-y-3">
                  <p className="text-xs text-muted-foreground">
                    Note: These preferences can be discussed with your healthcare provider
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={async () => {
                      try {
                        await generateBirthPlanPDF(birthPlan, 'Akinyi Atieno', '2026-02-15');
                        toast.success('Birth plan downloaded successfully! Open the file in your browser and print as PDF.');
                      } catch (error) {
                        toast.error('Failed to download birth plan');
                      }
                    }}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Download Birth Plan PDF
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Emergency Transport Ready */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 border-red-200 dark:border-red-900">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                  <Ambulance className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div className="flex-1">
                  <h4 className="mb-1">Emergency Transport</h4>
                  <p className="text-sm text-muted-foreground">
                    Kenya Emergency Services: 1190 / 112
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    window.location.href = 'tel:1190';
                    toast.info('Calling Kenya Emergency Services 1190...');
                  }}
                >
                  Call Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Add Checklist Item Dialog */}
      <Dialog open={showAddItemDialog} onOpenChange={setShowAddItemDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Checklist Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-item">Item Description</Label>
              <Input
                id="new-item"
                placeholder="e.g., Pack baby clothes"
                value={newChecklistItem}
                onChange={(e) => setNewChecklistItem(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addChecklistItem()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddItemDialog(false)}>
              Cancel
            </Button>
            <Button onClick={addChecklistItem}>Add Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
