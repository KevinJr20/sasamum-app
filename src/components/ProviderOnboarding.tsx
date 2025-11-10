import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner@2.0.3';
import { 
  Stethoscope,
  User,
  Building,
  Phone,
  Mail,
  MapPin,
  Award,
  FileText,
  Calendar,
  ChevronRight,
  ChevronLeft,
  Check,
  Hospital
} from 'lucide-react';

export interface ProviderData {
  // Personal Information
  fullName: string;
  email: string;
  phone: string;
  
  // Professional Information
  specialty: string;
  subSpecialty?: string;
  licenseNumber: string;
  yearsOfExperience: number;
  
  // Facility Information
  facilityName: string;
  facilityType: string;
  facilityAddress: string;
  facilityCity: string;
  facilityCounty: string;
  
  // Additional Information
  languages: string[];
  consultationTypes: string[];
  availability: string;
  bio: string;
  
  // Professional Documents (in real app, these would be file uploads)
  hasLicense: boolean;
  hasCertification: boolean;
}

interface ProviderOnboardingProps {
  onComplete: (data: ProviderData) => void;
  onSkip?: () => void;
}

export function ProviderOnboarding({ onComplete, onSkip }: ProviderOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<Partial<ProviderData>>({
    languages: [],
    consultationTypes: []
  });

  const specialties = [
    'Obstetrician/Gynecologist',
    'Midwife',
    'Maternal-Fetal Medicine Specialist',
    'Neonatologist',
    'Pediatrician',
    'Nurse Practitioner',
    'Doula',
    'Lactation Consultant',
    'Nutritionist',
    'Mental Health Counselor',
    'Other'
  ];

  const facilityTypes = [
    'Public Hospital',
    'Private Hospital',
    'Clinic',
    'Health Center',
    'Maternity Home',
    'Private Practice',
    'Mobile Clinic',
    'Other'
  ];

  const languageOptions = ['English', 'Swahili', 'Kikuyu', 'Luo', 'Kamba', 'Luhya', 'French'];
  const consultationOptions = ['In-Person', 'Telemedicine', 'Home Visits', 'Emergency On-Call'];

  const steps = [
    {
      title: 'Personal Information',
      icon: User,
      description: 'Tell us about yourself'
    },
    {
      title: 'Professional Details',
      icon: Stethoscope,
      description: 'Your qualifications and experience'
    },
    {
      title: 'Facility Information',
      icon: Hospital,
      description: 'Where you practice'
    },
    {
      title: 'Service Details',
      icon: FileText,
      description: 'Your services and availability'
    }
  ];

  const updateData = (field: string, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: 'languages' | 'consultationTypes', item: string) => {
    const array = data[field] || [];
    if (array.includes(item)) {
      updateData(field, array.filter(i => i !== item));
    } else {
      updateData(field, [...array, item]);
    }
  };

  const validateStep = () => {
    if (currentStep === 0) {
      if (!data.fullName || !data.email || !data.phone) {
        toast.error('Please fill in all required fields');
        return false;
      }
      // Basic email validation
      if (!/\S+@\S+\.\S+/.test(data.email)) {
        toast.error('Please enter a valid email address');
        return false;
      }
    }
    
    if (currentStep === 1) {
      if (!data.specialty || !data.licenseNumber || !data.yearsOfExperience) {
        toast.error('Please fill in all required fields');
        return false;
      }
    }
    
    if (currentStep === 2) {
      if (!data.facilityName || !data.facilityType || !data.facilityCity || !data.facilityCounty) {
        toast.error('Please fill in all required fields');
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep === steps.length - 1) {
        // Complete onboarding
        onComplete(data as ProviderData);
      } else {
        setCurrentStep(prev => prev + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background flex flex-col"
    >
      {/* Header */}
      <div className="bg-card/95 backdrop-blur-md border-b border-border p-4">
        <div className="flex items-center space-x-3 mb-4">
          <Stethoscope className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-lg text-foreground">Provider Registration</h1>
            <p className="text-xs text-muted-foreground">Join SasaMum as a healthcare provider</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index < currentStep
                      ? 'bg-primary text-white'
                      : index === currentStep
                      ? 'bg-primary text-white'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {index < currentStep ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <step.icon className="w-4 h-4" />
                  )}
                </div>
                <p className="text-xs mt-1 text-center hidden sm:block text-muted-foreground">
                  {step.title}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-1 flex-1 ${
                    index < currentStep ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <AnimatePresence mode="wait">
          {/* Step 0: Personal Information */}
          {currentStep === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <h2 className="text-foreground mb-2">{steps[0].title}</h2>
                <p className="text-sm text-muted-foreground">{steps[0].description}</p>
              </div>

              <Card className="border-border">
                <CardContent className="p-6 space-y-4">
                  <div>
                    <Label>Full Name *</Label>
                    <Input
                      value={data.fullName || ''}
                      onChange={(e) => updateData('fullName', e.target.value)}
                      placeholder="Dr. Sarah Wanjiru"
                    />
                  </div>

                  <div>
                    <Label>Email Address *</Label>
                    <Input
                      value={data.email || ''}
                      onChange={(e) => updateData('email', e.target.value)}
                      placeholder="doctor@hospital.co.ke"
                      type="email"
                    />
                  </div>

                  <div>
                    <Label>Phone Number *</Label>
                    <Input
                      value={data.phone || ''}
                      onChange={(e) => updateData('phone', e.target.value)}
                      placeholder="+254 712 345 678"
                      type="tel"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 1: Professional Details */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <h2 className="text-foreground mb-2">{steps[1].title}</h2>
                <p className="text-sm text-muted-foreground">{steps[1].description}</p>
              </div>

              <Card className="border-border">
                <CardContent className="p-6 space-y-4">
                  <div>
                    <Label>Specialty *</Label>
                    <select
                      value={data.specialty || ''}
                      onChange={(e) => updateData('specialty', e.target.value)}
                      className="w-full p-2 bg-input-background border border-border rounded-md text-foreground"
                    >
                      <option value="">Select your specialty</option>
                      {specialties.map((spec) => (
                        <option key={spec} value={spec}>{spec}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label>Sub-Specialty (Optional)</Label>
                    <Input
                      value={data.subSpecialty || ''}
                      onChange={(e) => updateData('subSpecialty', e.target.value)}
                      placeholder="e.g., High-Risk Pregnancies"
                    />
                  </div>

                  <div>
                    <Label>License Number *</Label>
                    <Input
                      value={data.licenseNumber || ''}
                      onChange={(e) => updateData('licenseNumber', e.target.value)}
                      placeholder="Medical License Number"
                    />
                  </div>

                  <div>
                    <Label>Years of Experience *</Label>
                    <Input
                      value={data.yearsOfExperience || ''}
                      onChange={(e) => updateData('yearsOfExperience', parseInt(e.target.value) || 0)}
                      placeholder="10"
                      type="number"
                      min="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Professional Verification</Label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={data.hasLicense || false}
                        onChange={(e) => updateData('hasLicense', e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-foreground">I have a valid medical license</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={data.hasCertification || false}
                        onChange={(e) => updateData('hasCertification', e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-foreground">I have relevant certifications</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 2: Facility Information */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <h2 className="text-foreground mb-2">{steps[2].title}</h2>
                <p className="text-sm text-muted-foreground">{steps[2].description}</p>
              </div>

              <Card className="border-border">
                <CardContent className="p-6 space-y-4">
                  <div>
                    <Label>Facility Name *</Label>
                    <Input
                      value={data.facilityName || ''}
                      onChange={(e) => updateData('facilityName', e.target.value)}
                      placeholder="Nairobi Women's Hospital"
                    />
                  </div>

                  <div>
                    <Label>Facility Type *</Label>
                    <select
                      value={data.facilityType || ''}
                      onChange={(e) => updateData('facilityType', e.target.value)}
                      className="w-full p-2 bg-input-background border border-border rounded-md text-foreground"
                    >
                      <option value="">Select facility type</option>
                      {facilityTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label>Address (Optional)</Label>
                    <Input
                      value={data.facilityAddress || ''}
                      onChange={(e) => updateData('facilityAddress', e.target.value)}
                      placeholder="Street address"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>City *</Label>
                      <Input
                        value={data.facilityCity || ''}
                        onChange={(e) => updateData('facilityCity', e.target.value)}
                        placeholder="Nairobi"
                      />
                    </div>

                    <div>
                      <Label>County *</Label>
                      <Input
                        value={data.facilityCounty || ''}
                        onChange={(e) => updateData('facilityCounty', e.target.value)}
                        placeholder="Nairobi"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 3: Service Details */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <h2 className="text-foreground mb-2">{steps[3].title}</h2>
                <p className="text-sm text-muted-foreground">{steps[3].description}</p>
              </div>

              <Card className="border-border">
                <CardContent className="p-6 space-y-4">
                  <div>
                    <Label>Languages Spoken</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {languageOptions.map((lang) => (
                        <button
                          key={lang}
                          onClick={() => toggleArrayItem('languages', lang)}
                          className={`p-2 text-sm rounded-md border transition-colors ${
                            data.languages?.includes(lang)
                              ? 'bg-primary text-white border-primary'
                              : 'bg-background border-border text-foreground hover:border-primary/50'
                          }`}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Consultation Types</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {consultationOptions.map((type) => (
                        <button
                          key={type}
                          onClick={() => toggleArrayItem('consultationTypes', type)}
                          className={`p-2 text-sm rounded-md border transition-colors ${
                            data.consultationTypes?.includes(type)
                              ? 'bg-primary text-white border-primary'
                              : 'bg-background border-border text-foreground hover:border-primary/50'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Availability</Label>
                    <Input
                      value={data.availability || ''}
                      onChange={(e) => updateData('availability', e.target.value)}
                      placeholder="e.g., Mon-Fri 9AM-5PM, Sat 9AM-1PM"
                    />
                  </div>

                  <div>
                    <Label>Professional Bio</Label>
                    <Textarea
                      value={data.bio || ''}
                      onChange={(e) => updateData('bio', e.target.value)}
                      placeholder="Tell mothers about your experience and approach to care..."
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="bg-card border-t border-border p-4">
        <div className="flex space-x-3">
          {currentStep > 0 && (
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex-1"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
          <Button
            onClick={handleNext}
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            {currentStep === steps.length - 1 ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Complete Registration
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
        {onSkip && currentStep === 0 && (
          <Button
            variant="ghost"
            onClick={onSkip}
            className="w-full mt-2 text-muted-foreground"
          >
            Skip for now
          </Button>
        )}
      </div>
    </motion.div>
  );
}
