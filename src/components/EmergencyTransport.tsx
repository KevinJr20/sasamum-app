import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useScrollToTop } from './utils/useScrollToTop';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { toast } from 'sonner@2.0.3';
import { 
  ArrowLeft,
  Truck,
  Plane,
  Phone,
  MapPin,
  Clock,
  AlertTriangle,
  Heart,
  Navigation,
  Users,
  Zap,
  Star,
  Shield
} from 'lucide-react';

interface EmergencyTransportProps {
  onBack: () => void;
  userName?: string;
}

interface TransportService {
  id: string;
  name: string;
  type: 'ambulance' | 'flying-doctor' | 'hospital-transport' | 'private';
  phone: string;
  coverage: string[];
  responseTime: string;
  cost: string;
  features: string[];
  rating: number;
  isPartner: boolean;
  available24_7: boolean;
  hasNICU: boolean;
  specializations: string[];
}

export function EmergencyTransport({ onBack, userName = "Grace" }: EmergencyTransportProps) {
  useScrollToTop();
  const [selectedType, setSelectedType] = useState<string>('all');
  const [userLocation] = useState('Nairobi');

  const transportServices: TransportService[] = [
    {
      id: '1',
      name: 'Kenya National Ambulance Service',
      type: 'ambulance',
      phone: '1190',
      coverage: ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret'],
      responseTime: '8-15 min',
      cost: 'Free',
      features: ['Life Support', 'Trained Paramedics', 'GPS Tracking'],
      rating: 4.2,
      isPartner: true,
      available24_7: true,
      hasNICU: false,
      specializations: ['Emergency', 'Maternity']
    },
    {
      id: '2',
      name: 'AMREF Flying Doctors',
      type: 'flying-doctor',
      phone: '+254 20 315 0000',
      coverage: ['All Kenya', 'Remote Areas', 'Cross-border'],
      responseTime: '45-90 min',
      cost: 'KSh 150,000 - 500,000',
      features: ['Air Ambulance', 'Critical Care', 'Remote Access'],
      rating: 4.8,
      isPartner: true,
      available24_7: true,
      hasNICU: true,
      specializations: ['High-risk Pregnancy', 'NICU Transport', 'Critical Care']
    },
    {
      id: '3',
      name: 'St. John Ambulance Kenya',
      type: 'ambulance',
      phone: '+254 20 270 0000',
      coverage: ['Nairobi', 'Central Kenya', 'Coast'],
      responseTime: '10-20 min',
      cost: 'KSh 3,000 - 8,000',
      features: ['First Aid', 'Basic Life Support', 'Maternity Care'],
      rating: 4.5,
      isPartner: true,
      available24_7: true,
      hasNICU: false,
      specializations: ['Maternity', 'Emergency Response']
    },
    {
      id: '4',
      name: 'Aga Khan Hospital Ambulance',
      type: 'hospital-transport',
      phone: '+254 20 366 2000',
      coverage: ['Nairobi', 'Mombasa', 'Kisumu'],
      responseTime: '5-12 min',
      cost: 'KSh 5,000 - 12,000',
      features: ['Advanced Life Support', 'Incubator', 'Specialist Nurses'],
      rating: 4.9,
      isPartner: true,
      available24_7: true,
      hasNICU: true,
      specializations: ['High-risk Maternity', 'NICU', 'Emergency Surgery']
    },
    {
      id: '5',
      name: 'Nairobi Women\'s Hospital Transport',
      type: 'hospital-transport',
      phone: '+254 20 272 0000',
      coverage: ['Nairobi Metropolitan'],
      responseTime: '5-10 min',
      cost: 'KSh 4,000 - 10,000',
      features: ['Maternity Specialist', 'Newborn Care', 'Emergency OB'],
      rating: 4.7,
      isPartner: true,
      available24_7: true,
      hasNICU: true,
      specializations: ['Maternity Emergency', 'C-Section Transport', 'High-risk Delivery']
    },
    {
      id: '6',
      name: 'AAR Healthcare Ambulance',
      type: 'private',
      phone: '+254 703 091 000',
      coverage: ['Nairobi', 'Nakuru', 'Eldoret'],
      responseTime: '8-15 min',
      cost: 'KSh 6,000 - 15,000',
      features: ['Premium Service', 'Family Support', 'Insurance Coverage'],
      rating: 4.6,
      isPartner: false,
      available24_7: true,
      hasNICU: false,
      specializations: ['Private Care', 'Insurance Patients']
    }
  ];

  const serviceTypes = [
    { id: 'all', label: 'All Services', icon: Heart },
    { id: 'ambulance', label: 'Ambulances', icon: Truck },
    { id: 'flying-doctor', label: 'Flying Doctors', icon: Plane },
    { id: 'hospital-transport', label: 'Hospital Transport', icon: Navigation }
  ];

  const filteredServices = selectedType === 'all' 
    ? transportServices 
    : transportServices.filter(service => service.type === selectedType);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'flying-doctor': return Plane;
      case 'hospital-transport': return Navigation;
      case 'private': return Star;
      default: return Truck;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'flying-doctor': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'hospital-transport': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'private': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      default: return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    }
  };

  const callService = (phone: string, serviceName: string) => {
    // In production, this would trigger actual phone call
    window.location.href = `tel:${phone}`;
    toast.success(`Calling ${serviceName}...`, {
      description: `Connecting to ${phone}`
    });
  };

  const getDirections = (serviceName: string) => {
    // In production, open maps with service location
    toast.info('Opening directions...', {
      description: `Getting directions to ${serviceName}`
    });
    // window.open(`https://maps.google.com?q=${encodeURIComponent(serviceName)}`, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-background w-full"
    >
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 flex items-center justify-between p-4 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
        <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
        </Button>
        <h1 className="text-base sm:text-lg md:text-xl text-foreground">Emergency Transport</h1>
        <Button variant="ghost" size="sm" className="p-2">
          <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
        </Button>
      </div>

      {/* Quick Emergency Button */}
      <div className="p-4 bg-red-50 dark:bg-red-950/20 border-b border-red-200 dark:border-red-900/30">
        <Card className="border-red-300 dark:border-red-800 bg-red-100 dark:bg-red-900/30">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center space-x-3 mb-3">
              <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 dark:text-red-400" />
              <div>
                <h3 className="text-red-800 dark:text-red-300 text-sm sm:text-base md:text-lg">Medical Emergency</h3>
                <p className="text-red-700 dark:text-red-400 text-xs sm:text-sm">Need immediate help?</p>
              </div>
            </div>
            <Button 
              className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white text-sm sm:text-base"
              size="lg"
              onClick={() => callService('1190', 'Emergency Services')}
            >
              <Phone className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Call 1190 - FREE Emergency Line
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Location Info */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Your location: {userLocation}</span>
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 ml-auto text-xs">GPS Active</Badge>
        </div>
      </div>

      {/* Service Type Filter */}
      <div className="p-4 border-b border-border">
        <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300">
          {serviceTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-full text-xs sm:text-sm whitespace-nowrap transition-colors ${
                selectedType === type.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-accent'
              }`}
            >
              <type.icon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="pb-20 p-4">
        {/* Transport Services */}
        <div className="space-y-4">
          {filteredServices.map((service, index) => {
            const TypeIcon = getTypeIcon(service.type);
            
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-border hover:shadow-md transition-shadow">
                  <CardContent className="p-4 sm:p-6">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between flex-wrap gap-2">
                        <div className="flex items-center space-x-3">
                          <TypeIcon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="text-foreground text-sm sm:text-base md:text-lg">{service.name}</h3>
                              {service.isPartner && (
                                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
                              )}
                            </div>
                            <div className="flex items-center space-x-2 mt-1 flex-wrap gap-1">
                              <Badge className={`text-xs ${getTypeBadge(service.type)}`}>
                                {service.type.replace('-', ' ')}
                              </Badge>
                              {service.available24_7 && (
                                <Badge className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">24/7</Badge>
                              )}
                              {service.hasNICU && (
                                <Badge className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">NICU</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 fill-current" />
                            <span className="text-sm text-foreground">{service.rating}</span>
                          </div>
                        </div>
                      </div>

                      {/* Service Info */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="flex items-center space-x-1 text-muted-foreground mb-1">
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>Response Time</span>
                          </div>
                          <p className="text-foreground">{service.responseTime}</p>
                        </div>
                        
                        <div>
                          <div className="flex items-center space-x-1 text-muted-foreground mb-1">
                            <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>Cost</span>
                          </div>
                          <p className="text-foreground">{service.cost}</p>
                        </div>
                      </div>

                      {/* Coverage */}
                      <div>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-1">Coverage Areas:</p>
                        <div className="flex flex-wrap gap-1">
                          {service.coverage.slice(0, 3).map((area) => (
                            <Badge key={area} variant="outline" className="text-xs">
                              {area}
                            </Badge>
                          ))}
                          {service.coverage.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{service.coverage.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Features */}
                      <div>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-1">Features:</p>
                        <div className="flex flex-wrap gap-1">
                          {service.features.slice(0, 3).map((feature) => (
                            <span key={feature} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Specializations */}
                      {service.specializations.length > 0 && (
                        <div>
                          <p className="text-xs sm:text-sm text-muted-foreground mb-1">Specializations:</p>
                          <div className="flex flex-wrap gap-1">
                            {service.specializations.map((spec) => (
                              <Badge key={spec} className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                {spec}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex space-x-2 pt-2 flex-wrap gap-2">
                        <Button 
                          className="flex-1 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white text-sm sm:text-base min-w-[120px]"
                          onClick={() => callService(service.phone, service.name)}
                        >
                          <Phone className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                          Call Now
                        </Button>
                        <Button 
                          variant="outline" 
                          className="px-3 border-primary text-primary hover:bg-primary/10"
                          onClick={() => getDirections(service.name)}
                          title="Get directions"
                        >
                          <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                        </Button>
                        <Button variant="outline" className="px-3" title="Add to favorites">
                          <Star className="w-4 h-4 sm:w-5 sm:h-5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Important Information */}
        <div className="mt-6">
          <Card className="border-blue-300 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20">
            <CardContent className="p-4 sm:p-6">
              <h4 className="text-blue-800 dark:text-blue-300 mb-2 text-sm sm:text-base md:text-lg flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Emergency Maternity Situations
              </h4>
              <div className="text-xs sm:text-sm text-blue-700 dark:text-blue-400 space-y-1">
                <p>• Call 1190 immediately for severe bleeding</p>
                <p>• Water breaks and contractions start</p>
                <p>• Severe headaches or vision problems</p>
                <p>• Baby movements stop or decrease significantly</p>
                <p>• Any situation that feels wrong or scary</p>
              </div>
              <div className="mt-3 p-2 bg-blue-200 dark:bg-blue-900/30 rounded">
                <p className="text-xs sm:text-sm text-blue-800 dark:text-blue-300">
                  <strong>Remember:</strong> It's better to call for help early than wait too long. 
                  Your instincts matter!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
