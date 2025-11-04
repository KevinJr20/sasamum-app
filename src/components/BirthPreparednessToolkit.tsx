import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Package, MapPin, DollarSign, AlertTriangle, CheckCircle, Home, Ambulance, Heart, Baby, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { toast } from 'sonner@2.0.3';

interface BirthPreparednessToolkitProps {
  onBack: () => void;
}

const HOSPITAL_BAG_ITEMS = {
  'For Mother': [
    { id: '1', item: 'National ID / Hospital Card', checked: false },
    { id: '2', item: 'NHIF/Linda Mama Card', checked: false },
    { id: '3', item: 'Antenatal records', checked: false },
    { id: '4', item: 'Comfortable nightdresses (2-3)', checked: false },
    { id: '5', item: 'Maternity pads (heavy flow)', checked: false },
    { id: '6', item: 'Underwear (disposable or old)', checked: false },
    { id: '7', item: 'Toiletries & towels', checked: false },
    { id: '8', item: 'Slippers / sandals', checked: false },
    { id: '9', item: 'Phone charger', checked: false },
    { id: '10', item: 'Snacks & drinking water', checked: false },
  ],
  'For Baby': [
    { id: '11', item: 'Baby clothes (3-4 sets)', checked: false },
    { id: '12', item: 'Baby blankets (2-3)', checked: false },
    { id: '13', item: 'Diapers (newborn size)', checked: false },
    { id: '14', item: 'Baby wipes', checked: false },
    { id: '15', item: 'Baby hat & mittens', checked: false },
    { id: '16', item: 'Going home outfit', checked: false },
  ],
  'Important Documents': [
    { id: '17', item: 'Birth notification form', checked: false },
    { id: '18', item: 'Contact list (family, doctor)', checked: false },
    { id: '19', item: 'Insurance documents', checked: false },
  ],
};

const DANGER_SIGNS = [
  { id: '1', sign: 'Heavy bleeding (soaking pad in 1 hour)', category: 'During Labor' },
  { id: '2', sign: 'Severe abdominal pain', category: 'During Labor' },
  { id: '3', sign: 'Water breaks with green/brown color', category: 'During Labor' },
  { id: '4', sign: 'Baby stops moving during labor', category: 'During Labor' },
  { id: '5', sign: 'Severe headache with blurred vision', category: 'During Labor' },
  { id: '6', sign: 'Heavy bleeding after delivery', category: 'After Birth' },
  { id: '7', sign: 'Fever above 38.5°C', category: 'After Birth' },
  { id: '8', sign: 'Foul-smelling discharge', category: 'After Birth' },
  { id: '9', sign: 'Breast becomes red, hot, painful', category: 'After Birth' },
  { id: '10', sign: 'Difficulty breathing', category: 'Both' },
];

export function BirthPreparednessToolkit({ onBack }: BirthPreparednessToolkitProps) {
  const [bagItems, setBagItems] = useState(HOSPITAL_BAG_ITEMS);
  const [selectedFacility, setSelectedFacility] = useState('');
  const [transportPlan, setTransportPlan] = useState('');
  const [emergencyFunds, setEmergencyFunds] = useState('');
  const [birthCompanion, setBirthCompanion] = useState('');

  const handleItemToggle = (category: string, itemId: string) => {
    setBagItems(prev => ({
      ...prev,
      [category]: prev[category as keyof typeof prev].map(item =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      ),
    }));
  };

  const getTotalItems = () => {
    return Object.values(bagItems).reduce((total, category) => total + category.length, 0);
  };

  const getCheckedItems = () => {
    return Object.values(bagItems).reduce(
      (total, category) => total + category.filter(item => item.checked).length,
      0
    );
  };

  const getProgress = () => {
    return (getCheckedItems() / getTotalItems()) * 100;
  };

  const nearbyFacilities = [
    {
      name: 'Kenyatta National Hospital',
      level: 'Level 6 (National)',
      services: ['C-Section', 'ICU', 'NICU', '24/7 Emergency'],
      distance: '3.2 km',
      nhif: true,
    },
    {
      name: 'Pumwani Maternity Hospital',
      level: 'Level 5 (County)',
      services: ['Normal Delivery', 'C-Section', 'Special Care Baby Unit'],
      distance: '2.8 km',
      nhif: true,
    },
    {
      name: 'Nairobi Women\'s Hospital',
      level: 'Private Hospital',
      services: ['Normal Delivery', 'C-Section', 'NICU', 'Private Rooms'],
      distance: '4.5 km',
      nhif: true,
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky-header">
        <div className="flex items-center gap-4 p-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-foreground">Birth Preparedness</h1>
            <p className="text-sm text-muted-foreground">Be ready for your big day!</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6 page-with-header">
        {/* Progress Overview */}
        <Card className="p-4 bg-gradient-to-br from-primary/20 to-primary/10">
          <div className="flex items-center gap-3 mb-3">
            <Package className="w-6 h-6 text-primary" />
            <div className="flex-1">
              <h2 className="text-foreground">Preparedness Progress</h2>
              <p className="text-sm text-muted-foreground">
                {getCheckedItems()} of {getTotalItems()} items ready
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl text-foreground">{Math.round(getProgress())}%</span>
            </div>
          </div>
          <Progress value={getProgress()} className="h-2" />
        </Card>

        <Tabs defaultValue="checklist" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="checklist">
              <Package className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="facility">
              <MapPin className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="danger-signs">
              <AlertTriangle className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="finances">
              <DollarSign className="w-4 h-4" />
            </TabsTrigger>
          </TabsList>

          {/* Hospital Bag Checklist */}
          <TabsContent value="checklist" className="space-y-6">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-5 h-5 text-primary" />
                <h2 className="text-foreground">Hospital Bag Checklist</h2>
              </div>

              {Object.entries(bagItems).map(([category, items]) => (
                <div key={category} className="mb-6">
                  <h3 className="text-foreground mb-3">{category}</h3>
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/30"
                      >
                        <Checkbox
                          id={item.id}
                          checked={item.checked}
                          onCheckedChange={() => handleItemToggle(category, item.id)}
                        />
                        <Label
                          htmlFor={item.id}
                          className={`flex-1 cursor-pointer ${
                            item.checked ? 'line-through text-muted-foreground' : 'text-foreground'
                          }`}
                        >
                          {item.item}
                        </Label>
                        {item.checked && (
                          <CheckCircle className="w-4 h-4 text-primary" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {getProgress() === 100 && (
                <div className="mt-4 p-4 bg-primary/20 border border-primary/30 rounded-lg text-center">
                  <CheckCircle className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-foreground">All items packed! You're ready! 🎉</p>
                </div>
              )}
            </Card>

            {/* Birth Plan Basics */}
            <Card className="p-4">
              <h2 className="text-foreground mb-4">Birth Plan Essentials</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Birth Companion</Label>
                  <Input
                    placeholder="Name of person accompanying you"
                    value={birthCompanion}
                    onChange={(e) => setBirthCompanion(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Transport Plan</Label>
                  <Input
                    placeholder="How will you get to the hospital?"
                    value={transportPlan}
                    onChange={(e) => setTransportPlan(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Consider having a backup plan in case of emergencies
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Facility Readiness */}
          <TabsContent value="facility" className="space-y-4">
            <Card className="p-4 bg-primary/10 border-primary/20">
              <div className="flex gap-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-foreground mb-1">Choose Your Birth Facility</h3>
                  <p className="text-sm text-muted-foreground">
                    Select a facility that offers the services you need and is accessible 24/7
                  </p>
                </div>
              </div>
            </Card>

            {nearbyFacilities.map((facility, index) => (
              <Card
                key={index}
                className={`p-4 cursor-pointer transition-all ${
                  selectedFacility === facility.name
                    ? 'border-primary bg-primary/10'
                    : 'border-border'
                }`}
                onClick={() => setSelectedFacility(facility.name)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="text-foreground mb-1">{facility.name}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{facility.level}</Badge>
                      {facility.nhif && <Badge variant="outline">NHIF/Linda Mama</Badge>}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <MapPin className="w-3 h-3" />
                      <span>{facility.distance} away</span>
                    </div>
                  </div>
                  {selectedFacility === facility.name && (
                    <CheckCircle className="w-5 h-5 text-primary" />
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Services Available:</p>
                  <div className="flex flex-wrap gap-2">
                    {facility.services.map((service, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-muted rounded-full">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            ))}

            <Card className="p-4">
              <h3 className="text-foreground mb-3">Facility Visit Checklist</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5" />
                  <span>Visit the facility before your due date</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5" />
                  <span>Know the location of the maternity ward</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5" />
                  <span>Confirm they accept NHIF/Linda Mama</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5" />
                  <span>Ask about their emergency protocols</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5" />
                  <span>Save their emergency contact number</span>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Danger Signs */}
          <TabsContent value="danger-signs" className="space-y-4">
            <Card className="p-4 bg-destructive/10 border-destructive/30">
              <div className="flex gap-3">
                <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-foreground mb-1">Know the Danger Signs</h3>
                  <p className="text-sm text-muted-foreground">
                    If you experience any of these signs, seek immediate medical attention
                  </p>
                </div>
              </div>
            </Card>

            {['During Labor', 'After Birth', 'Both'].map((category) => {
              const signs = DANGER_SIGNS.filter(s => s.category === category);
              if (signs.length === 0) return null;

              return (
                <Card key={category} className="p-4">
                  <h3 className="text-foreground mb-3">{category}</h3>
                  <div className="space-y-2">
                    {signs.map((sign) => (
                      <div key={sign.id} className="flex items-start gap-3 p-3 bg-destructive/5 rounded-lg">
                        <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0 mt-1" />
                        <span className="text-sm text-foreground">{sign.sign}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              );
            })}

            <Card className="p-4 bg-primary/10 border-primary/20">
              <h3 className="text-foreground mb-3">Emergency Action Plan</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
                    1
                  </div>
                  <div>
                    <p className="text-foreground">Stay Calm</p>
                    <p className="text-sm text-muted-foreground">Take deep breaths and don't panic</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
                    2
                  </div>
                  <div>
                    <p className="text-foreground">Call for Help</p>
                    <p className="text-sm text-muted-foreground">Contact your healthcare provider or call 999</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
                    3
                  </div>
                  <div>
                    <p className="text-foreground">Go to Hospital</p>
                    <p className="text-sm text-muted-foreground">Don't wait - get to the nearest facility immediately</p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Financial Preparedness */}
          <TabsContent value="finances" className="space-y-4">
            <Card className="p-4 bg-primary/10 border-primary/20">
              <div className="flex gap-3">
                <DollarSign className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-foreground mb-1">Financial Preparedness</h3>
                  <p className="text-sm text-muted-foreground">
                    Planning for delivery costs helps reduce stress when the time comes
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="text-foreground mb-4">Linda Mama / NHIF Benefits</h3>
              <div className="space-y-3">
                <div className="p-3 bg-muted/30 rounded-lg">
                  <h4 className="text-foreground mb-2">Linda Mama Programme</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Free maternity services at public health facilities
                  </p>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p>✓ Antenatal care (4 visits)</p>
                    <p>✓ Normal delivery or C-section</p>
                    <p>✓ Postnatal care</p>
                    <p>✓ Newborn care</p>
                  </div>
                </div>

                <div className="p-3 bg-muted/30 rounded-lg">
                  <h4 className="text-foreground mb-2">NHIF Maternity Cover</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Coverage at accredited facilities
                  </p>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p>• Normal delivery: Up to KES 10,000</p>
                    <p>• C-section: Up to KES 30,000</p>
                    <p>• Complications covered</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="text-foreground mb-4">Emergency Funds Tracker</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Target Emergency Fund</Label>
                  <Input
                    type="number"
                    placeholder="e.g., 20000"
                    value={emergencyFunds}
                    onChange={(e) => setEmergencyFunds(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Recommended: KES 15,000 - 30,000 for emergencies
                  </p>
                </div>

                <div className="p-3 bg-primary/10 rounded-lg">
                  <h4 className="text-foreground mb-2">What to Budget For:</h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>• Transport to hospital</p>
                    <p>• Medications not covered by insurance</p>
                    <p>• Extra nights at hospital if needed</p>
                    <p>• Baby items (if not already purchased)</p>
                    <p>• Postnatal care supplies</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="text-foreground mb-3">Cost-Saving Tips</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>💡 Register for Linda Mama at your local facility</p>
                <p>💡 Ensure NHIF contributions are up to date</p>
                <p>💡 Ask family/friends for support with baby items</p>
                <p>💡 Buy essentials gradually during pregnancy</p>
                <p>💡 Consider public hospitals for quality free care</p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
