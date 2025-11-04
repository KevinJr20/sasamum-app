import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, MapPin, Hospital, AlertTriangle, CheckCircle, Navigation, Phone, Baby } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';

interface DeliveryPlanningProps {
  onBack: () => void;
}

interface Hospital {
  name: string;
  distance: string;
  riskMatch: number;
  facilities: string[];
  available: boolean;
}

export function DeliveryPlanning({ onBack }: DeliveryPlanningProps) {
  const [estimatedDate] = useState('November 15, 2025');
  const [riskLevel] = useState('medium');

  const riskProfile = {
    level: 'Medium Risk',
    score: 45,
    factors: [
      { factor: 'Age over 35', impact: 'medium' },
      { factor: 'First pregnancy', impact: 'low' },
      { factor: 'Gestational diabetes', impact: 'medium' }
    ],
    recommendations: [
      'Facility with NICU required',
      'Specialist obstetrician recommended',
      'Blood bank access essential'
    ]
  };

  const recommendedHospitals: Hospital[] = [
    {
      name: 'Kenyatta National Hospital',
      distance: '4.2 km',
      riskMatch: 95,
      facilities: ['NICU Level 3', 'Blood Bank', 'Emergency Theatre', 'Specialist OB/GYN'],
      available: true
    },
    {
      name: 'Nairobi Women\'s Hospital',
      distance: '6.8 km',
      riskMatch: 90,
      facilities: ['NICU Level 2', 'Blood Bank', '24/7 Theatre', 'Lactation Support'],
      available: true
    },
    {
      name: 'Aga Khan Hospital',
      distance: '8.1 km',
      riskMatch: 88,
      facilities: ['NICU Level 3', 'Blood Bank', 'Emergency Care', 'Private Wards'],
      available: false
    }
  ];

  const birthPlan = {
    preferredFacility: 'Kenyatta National Hospital',
    backupFacility: 'Nairobi Women\'s Hospital',
    transportPlan: 'Ambulance on standby',
    birthPartner: 'John Odhiambo (Husband)',
    birthPreferences: [
      'Natural delivery preferred',
      'Epidural available if needed',
      'Skin-to-skin immediately after birth',
      'Breastfeeding within first hour'
    ]
  };

  const preparednessChecklist = [
    { item: 'Hospital bag packed', done: true },
    { item: 'Transport arranged', done: true },
    { item: 'Birth partner briefed', done: false },
    { item: 'Emergency contacts updated', done: true },
    { item: 'Hospital pre-registration', done: false },
    { item: 'Insurance verified', done: true }
  ];

  const getMatchColor = (match: number) => {
    if (match >= 90) return 'text-green-600';
    if (match >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMatchBg = (match: number) => {
    if (match >= 90) return 'bg-green-100 dark:bg-green-900/20';
    if (match >= 70) return 'bg-yellow-100 dark:bg-yellow-900/20';
    return 'bg-red-100 dark:bg-red-900/20';
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
            <h1 className="text-xl text-foreground">Delivery Planning</h1>
            <p className="text-sm text-muted-foreground">AI-powered recommendations</p>
          </div>
          <Baby className="w-6 h-6 text-primary" />
        </div>
      </div>

      <div className="pt-20 p-4 space-y-6">
        {/* Estimated Delivery Date */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-primary/10 to-secondary/10">
            <CardContent className="p-6 text-center">
              <h3 className="mb-2">Estimated Delivery Date</h3>
              <div className="text-2xl text-primary mb-1">{estimatedDate}</div>
              <p className="text-sm text-muted-foreground">29 days to go</p>
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
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                Risk Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">{riskProfile.level}</span>
                  <span className="text-sm text-muted-foreground">{riskProfile.score}%</span>
                </div>
                <Progress value={riskProfile.score} className="h-2" />
              </div>

              <div className="space-y-2">
                <p className="text-sm">Risk Factors:</p>
                {riskProfile.factors.map((factor, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className={`w-2 h-2 rounded-full ${
                      factor.impact === 'high' ? 'bg-red-500' :
                      factor.impact === 'medium' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`} />
                    <span>{factor.factor}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t space-y-2">
                <p className="text-sm">Requirements:</p>
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
          <h2 className="mb-4">Recommended Facilities</h2>
          <div className="space-y-3">
            {recommendedHospitals.map((hospital, index) => (
              <motion.div
                key={hospital.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className={!hospital.available ? 'opacity-60' : ''}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="mb-1">{hospital.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span>{hospital.distance} away</span>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className={`text-lg ${getMatchColor(hospital.riskMatch)}`}>
                          {hospital.riskMatch}%
                        </div>
                        <Badge className={`${getMatchBg(hospital.riskMatch)} text-xs`}>
                          <span className={getMatchColor(hospital.riskMatch)}>Match</span>
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2 mb-3">
                      <p className="text-sm">Available Facilities:</p>
                      <div className="flex flex-wrap gap-2">
                        {hospital.facilities.map((facility, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {facility}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {hospital.available ? (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Navigation className="w-4 h-4 mr-1" />
                          Directions
                        </Button>
                        <Button size="sm" className="flex-1">
                          <Phone className="w-4 h-4 mr-1" />
                          Contact
                        </Button>
                      </div>
                    ) : (
                      <Alert className="mt-3">
                        <AlertTriangle className="w-4 h-4" />
                        <AlertDescription className="text-xs">
                          Currently at capacity. Consider backup options.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Birth Plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Your Birth Plan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Preferred Facility</p>
                <p className="text-sm">{birthPlan.preferredFacility}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Backup Facility</p>
                <p className="text-sm">{birthPlan.backupFacility}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Birth Partner</p>
                <p className="text-sm">{birthPlan.birthPartner}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Birth Preferences</p>
                <div className="space-y-2">
                  {birthPlan.birthPreferences.map((pref, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{pref}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Button variant="outline" className="w-full">
                Edit Birth Plan
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Preparedness Checklist */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Preparedness Checklist</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">4 of 6 completed</span>
                  <span className="text-sm text-muted-foreground">67%</span>
                </div>
                <Progress value={67} className="h-2" />
              </div>

              {preparednessChecklist.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    item.done ? 'bg-green-50 dark:bg-green-900/10' : 'bg-muted/30'
                  }`}
                >
                  {item.done ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-muted-foreground" />
                  )}
                  <span className={`text-sm flex-1 ${item.done ? 'line-through text-muted-foreground' : ''}`}>
                    {item.item}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
