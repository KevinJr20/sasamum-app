import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import {
  User,
  Calendar,
  MapPin,
  Phone,
  Users,
  Heart,
  Baby,
  ArrowRight,
  ArrowLeft,
  Check,
  Activity,
  AlertTriangle
} from 'lucide-react';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';

interface UserOnboardingProps {
  onComplete: (data: UserData) => void;
  onSkip?: () => void;
}

export interface UserData {
  // Personal Info
  fullName: string;
  phone: string;
  location: string;
  dateOfBirth: string;
  
  // Pregnancy Info
  dueDate: string;
  currentWeek: number;
  isFirstPregnancy: boolean;
  numberOfPreviousPregnancies: number;
  
  // Emergency Contact
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  
  // Health Info
  bloodType: string;
  allergies: string;
  medicalConditions: string;
  currentWeight: string;
  height: string;
  
  // Preferences
  preferredLanguage: string;
  preferredHospital: string;
  
  // Risk Assessment
  riskFactors?: {
    hypertension?: boolean;
    diabetes?: boolean;
    previousMiscarriage?: boolean;
    previousCSection?: boolean;
    multiplePregnancies?: boolean;
    ageOver35?: boolean;
    ageUnder18?: boolean;
    anemia?: boolean;
    heartDisease?: boolean;
    kidneyDisease?: boolean;
    thyroidDisorder?: boolean;
    autoimmune?: boolean;
  };
  riskLevel?: 'low' | 'moderate' | 'high';
}

export function UserOnboarding({ onComplete, onSkip }: UserOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  
  const [formData, setFormData] = useState<UserData>({
    fullName: '',
    phone: '',
    location: '',
    dateOfBirth: '',
    dueDate: '',
    currentWeek: 0,
    isFirstPregnancy: true,
    numberOfPreviousPregnancies: 0,
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',
    bloodType: '',
    allergies: '',
    medicalConditions: '',
    currentWeight: '',
    height: '',
    preferredLanguage: 'English',
    preferredHospital: '',
    riskFactors: {},
    riskLevel: 'low'
  });

  const updateField = (field: keyof UserData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateRiskFactor = (factor: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      riskFactors: { ...prev.riskFactors, [factor]: value }
    }));
  };

  const calculateRiskLevel = (): 'low' | 'moderate' | 'high' => {
    const factors = formData.riskFactors || {};
    const riskCount = Object.values(factors).filter(Boolean).length;
    
    const highRiskConditions = [
      factors.hypertension,
      factors.diabetes,
      factors.heartDisease,
      factors.kidneyDisease,
      factors.multiplePregnancies
    ].filter(Boolean).length;

    if (highRiskConditions >= 2 || riskCount >= 5) return 'high';
    if (highRiskConditions >= 1 || riskCount >= 3) return 'moderate';
    return 'low';
  };

  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate risk level before completing
      const riskLevel = calculateRiskLevel();
      onComplete({ ...formData, riskLevel });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/30 p-4 flex flex-col">
      {/* Header */}
      <div className="pt-4 pb-6">
        <div className="max-w-md mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl text-foreground">Complete Your Profile</h2>
            {onSkip && (
              <button
                onClick={onSkip}
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Skip for now
              </button>
            )}
          </div>
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground text-center">
              Step {currentStep} of {totalSteps}
            </p>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-card/95 backdrop-blur-sm border-border/50 shadow-xl">
                <CardHeader className="text-center space-y-2">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg text-foreground">Personal Information</h3>
                  <p className="text-sm text-muted-foreground">Let's get to know you better, Mama</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => updateField('fullName', e.target.value)}
                      placeholder="Your beautiful name"
                      className="bg-input-background"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      placeholder="+254 7XX XXX XXX"
                      className="bg-input-background"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => updateField('location', e.target.value)}
                      placeholder="City, County"
                      className="bg-input-background"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => updateField('dateOfBirth', e.target.value)}
                      className="bg-input-background"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-card/95 backdrop-blur-sm border-border/50 shadow-xl">
                <CardHeader className="text-center space-y-2">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Baby className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg text-foreground">Pregnancy Details</h3>
                  <p className="text-sm text-muted-foreground">Help us support your journey</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Expected Due Date *</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => updateField('dueDate', e.target.value)}
                      className="bg-input-background"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="currentWeek">Current Week of Pregnancy</Label>
                    <Input
                      id="currentWeek"
                      type="number"
                      min="0"
                      max="42"
                      value={formData.currentWeek || ''}
                      onChange={(e) => updateField('currentWeek', parseInt(e.target.value) || 0)}
                      placeholder="e.g., 12"
                      className="bg-input-background"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Is this your first pregnancy?</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        type="button"
                        variant={formData.isFirstPregnancy ? "default" : "outline"}
                        onClick={() => updateField('isFirstPregnancy', true)}
                        className={formData.isFirstPregnancy ? "bg-primary" : ""}
                      >
                        Yes, First Time
                      </Button>
                      <Button
                        type="button"
                        variant={!formData.isFirstPregnancy ? "default" : "outline"}
                        onClick={() => updateField('isFirstPregnancy', false)}
                        className={!formData.isFirstPregnancy ? "bg-primary" : ""}
                      >
                        No
                      </Button>
                    </div>
                  </div>
                  
                  {!formData.isFirstPregnancy && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="space-y-2"
                    >
                      <Label htmlFor="previousPregnancies">Number of Previous Pregnancies</Label>
                      <Input
                        id="previousPregnancies"
                        type="number"
                        min="1"
                        value={formData.numberOfPreviousPregnancies || ''}
                        onChange={(e) => updateField('numberOfPreviousPregnancies', parseInt(e.target.value) || 0)}
                        className="bg-input-background"
                      />
                    </motion.div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="height">Height (cm)</Label>
                      <Input
                        id="height"
                        type="number"
                        value={formData.height}
                        onChange={(e) => updateField('height', e.target.value)}
                        placeholder="e.g., 165"
                        className="bg-input-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currentWeight">Weight (kg)</Label>
                      <Input
                        id="currentWeight"
                        type="number"
                        value={formData.currentWeight}
                        onChange={(e) => updateField('currentWeight', e.target.value)}
                        placeholder="e.g., 65"
                        className="bg-input-background"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-card/95 backdrop-blur-sm border-border/50 shadow-xl">
                <CardHeader className="text-center space-y-2">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg text-foreground">Emergency Contact</h3>
                  <p className="text-sm text-muted-foreground">Someone we can reach in case of emergency</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContactName">Contact Name *</Label>
                    <Input
                      id="emergencyContactName"
                      value={formData.emergencyContactName}
                      onChange={(e) => updateField('emergencyContactName', e.target.value)}
                      placeholder="Full name"
                      className="bg-input-background"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContactPhone">Contact Phone *</Label>
                    <Input
                      id="emergencyContactPhone"
                      type="tel"
                      value={formData.emergencyContactPhone}
                      onChange={(e) => updateField('emergencyContactPhone', e.target.value)}
                      placeholder="+254 7XX XXX XXX"
                      className="bg-input-background"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContactRelation">Relationship *</Label>
                    <Select
                      value={formData.emergencyContactRelation}
                      onValueChange={(value) => updateField('emergencyContactRelation', value)}
                    >
                      <SelectTrigger className="bg-input-background">
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="spouse">Spouse/Partner</SelectItem>
                        <SelectItem value="mother">Mother</SelectItem>
                        <SelectItem value="father">Father</SelectItem>
                        <SelectItem value="sister">Sister</SelectItem>
                        <SelectItem value="brother">Brother</SelectItem>
                        <SelectItem value="friend">Friend</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-card/95 backdrop-blur-sm border-border/50 shadow-xl">
                <CardHeader className="text-center space-y-2">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Heart className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg text-foreground">Health Information</h3>
                  <p className="text-sm text-muted-foreground">Help us provide better care</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bloodType">Blood Type</Label>
                    <Select
                      value={formData.bloodType}
                      onValueChange={(value) => updateField('bloodType', value)}
                    >
                      <SelectTrigger className="bg-input-background">
                        <SelectValue placeholder="Select blood type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="allergies">Allergies (if any)</Label>
                    <Input
                      id="allergies"
                      value={formData.allergies}
                      onChange={(e) => updateField('allergies', e.target.value)}
                      placeholder="e.g., Penicillin, Peanuts"
                      className="bg-input-background"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="medicalConditions">Pre-existing Medical Conditions</Label>
                    <Input
                      id="medicalConditions"
                      value={formData.medicalConditions}
                      onChange={(e) => updateField('medicalConditions', e.target.value)}
                      placeholder="e.g., Diabetes, Hypertension"
                      className="bg-input-background"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="preferredHospital">Preferred Hospital</Label>
                    <Input
                      id="preferredHospital"
                      value={formData.preferredHospital}
                      onChange={(e) => updateField('preferredHospital', e.target.value)}
                      placeholder="Your preferred delivery hospital"
                      className="bg-input-background"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="preferredLanguage">Preferred Language</Label>
                    <Select
                      value={formData.preferredLanguage}
                      onValueChange={(value) => updateField('preferredLanguage', value)}
                    >
                      <SelectTrigger className="bg-input-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Kiswahili">Kiswahili</SelectItem>
                        <SelectItem value="Both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {currentStep === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-card/95 backdrop-blur-sm border-border/50 shadow-xl">
                <CardHeader className="text-center space-y-2">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Activity className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg text-foreground">Medical History Assessment</h3>
                  <p className="text-sm text-muted-foreground">Help us personalize your care</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Select any conditions that apply to you. This helps us provide tailored health tips and alerts.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {[
                      { id: 'hypertension', label: 'High blood pressure (Hypertension)', severity: 'high' },
                      { id: 'diabetes', label: 'Diabetes (Type 1 or 2)', severity: 'high' },
                      { id: 'previousMiscarriage', label: 'Previous miscarriage(s)', severity: 'moderate' },
                      { id: 'previousCSection', label: 'Previous C-Section', severity: 'moderate' },
                      { id: 'multiplePregnancies', label: 'Twins/Multiple pregnancy', severity: 'high' },
                      { id: 'ageOver35', label: 'Age over 35 years', severity: 'moderate' },
                      { id: 'ageUnder18', label: 'Age under 18 years', severity: 'moderate' },
                      { id: 'anemia', label: 'Anemia / Low iron', severity: 'moderate' },
                      { id: 'heartDisease', label: 'Heart disease', severity: 'high' },
                      { id: 'kidneyDisease', label: 'Kidney disease', severity: 'high' },
                      { id: 'thyroidDisorder', label: 'Thyroid disorder', severity: 'moderate' },
                      { id: 'autoimmune', label: 'Autoimmune condition', severity: 'moderate' },
                    ].map((condition) => (
                      <div
                        key={condition.id}
                        className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                          formData.riskFactors?.[condition.id as keyof typeof formData.riskFactors]
                            ? 'bg-primary/10 border-primary/30'
                            : 'bg-muted/30 border-border/50'
                        }`}
                      >
                        <Checkbox
                          id={condition.id}
                          checked={formData.riskFactors?.[condition.id as keyof typeof formData.riskFactors] || false}
                          onCheckedChange={(checked) => updateRiskFactor(condition.id, checked as boolean)}
                        />
                        <div className="flex-1">
                          <Label htmlFor={condition.id} className="cursor-pointer text-foreground">
                            {condition.label}
                          </Label>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-primary" />
                      <span className="text-sm text-foreground">Your Risk Profile</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Estimated Level:</span>
                      <Badge
                        variant={
                          calculateRiskLevel() === 'high'
                            ? 'destructive'
                            : calculateRiskLevel() === 'moderate'
                            ? 'warning'
                            : 'success'
                        }
                      >
                        {calculateRiskLevel().toUpperCase()} RISK
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {calculateRiskLevel() === 'high' && 'You may need closer monitoring. We\'ll provide specialized care recommendations.'}
                      {calculateRiskLevel() === 'moderate' && 'Some additional monitoring may be recommended. You\'ll receive tailored health tips.'}
                      {calculateRiskLevel() === 'low' && 'Your pregnancy appears low-risk. Continue with regular prenatal care.'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="mt-6 flex gap-3">
          {currentStep > 1 && (
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
          <Button
            onClick={handleNext}
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            {currentStep === totalSteps ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Complete
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
