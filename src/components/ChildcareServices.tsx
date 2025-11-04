import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  ArrowLeft,
  Search,
  Star,
  MapPin,
  Clock,
  Heart,
  Phone,
  MessageCircle,
  Users,
  Baby,
  GraduationCap,
  Shield,
  Award,
  Filter,
  BookOpen,
  Home,
  Building,
  Verified
} from 'lucide-react';

interface ChildcareServicesProps {
  onBack: () => void;
  userName?: string;
}

interface CareProvider {
  id: string;
  name: string;
  type: 'nanny' | 'nurse' | 'daycare' | 'babysitter';
  avatar: string;
  location: string;
  experience: string;
  rating: number;
  reviews: number;
  hourlyRate?: number;
  monthlyRate?: number;
  description: string;
  specialties: string[];
  qualifications: string[];
  languages: string[];
  availability: string;
  isVerified: boolean;
  hasFirstAid: boolean;
  hasReferences: boolean;
  ageGroups: string[];
  workType: 'live-in' | 'live-out' | 'flexible';
}

interface DaycareCenter {
  id: string;
  name: string;
  location: string;
  ageRange: string;
  capacity: number;
  currentEnrollment: number;
  monthlyFee: number;
  rating: number;
  reviews: number;
  description: string;
  programs: string[];
  facilities: string[];
  operatingHours: string;
  isLicensed: boolean;
  hasNursery: boolean;
  contactPhone: string;
  images: string[];
}

export function ChildcareServices({ onBack, userName = "Grace" }: ChildcareServicesProps) {
  const [activeTab, setActiveTab] = useState<'providers' | 'daycares'>('providers');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock care providers with Kenyan names and context
  const careProviders: CareProvider[] = [
    {
      id: '1',
      name: 'Mary Wanjiku',
      type: 'nanny',
      avatar: '/api/placeholder/60/60',
      location: 'Kileleshwa, Nairobi',
      experience: '8 years',
      rating: 4.9,
      reviews: 23,
      hourlyRate: 300,
      monthlyRate: 25000,
      description: 'Experienced nanny with love for children. I speak English, Kikuyu and Swahili. Great with newborns and toddlers.',
      specialties: ['Newborn Care', 'Toddler Development', 'Sleep Training', 'Nutrition'],
      qualifications: ['Child Development Certificate', 'First Aid Certified', 'CPR Training'],
      languages: ['English', 'Kikuyu', 'Swahili'],
      availability: 'Monday - Friday, 7AM - 6PM',
      isVerified: true,
      hasFirstAid: true,
      hasReferences: true,
      ageGroups: ['0-6 months', '6-12 months', '1-3 years'],
      workType: 'live-out'
    },
    {
      id: '2',
      name: 'Jane Akinyi',
      type: 'nurse',
      avatar: '/api/placeholder/60/60',
      location: 'Westlands, Nairobi',
      experience: '12 years',
      rating: 5.0,
      reviews: 31,
      hourlyRate: 500,
      monthlyRate: 40000,
      description: 'Registered nurse specializing in newborn and infant care. Available for overnight stays and postnatal support.',
      specialties: ['Postnatal Care', 'Breastfeeding Support', 'Baby Health Monitoring', 'New Mom Support'],
      qualifications: ['Registered Nurse', 'Midwifery Certificate', 'Lactation Consultant'],
      languages: ['English', 'Luo', 'Swahili'],
      availability: 'Flexible, including nights',
      isVerified: true,
      hasFirstAid: true,
      hasReferences: true,
      ageGroups: ['0-6 months', '6-12 months'],
      workType: 'flexible'
    },
    {
      id: '3',
      name: 'Susan Njeri',
      type: 'nanny',
      avatar: '/api/placeholder/60/60',
      location: 'Karen, Nairobi',
      experience: '6 years',
      rating: 4.7,
      reviews: 18,
      hourlyRate: 350,
      monthlyRate: 28000,
      description: 'Loving nanny who treats every child like family. Experience with twins and premature babies.',
      specialties: ['Twins Care', 'Premature Baby Care', 'Educational Activities', 'Meal Preparation'],
      qualifications: ['Early Childhood Development', 'First Aid Certificate'],
      languages: ['English', 'Kikuyu'],
      availability: 'Monday - Saturday, flexible hours',
      isVerified: true,
      hasFirstAid: true,
      hasReferences: true,
      ageGroups: ['0-6 months', '6-12 months', '1-3 years', '3-5 years'],
      workType: 'live-in'
    },
    {
      id: '4',
      name: 'Faith Muthoni',
      type: 'babysitter',
      avatar: '/api/placeholder/60/60',
      location: 'Lavington, Nairobi',
      experience: '3 years',
      rating: 4.5,
      reviews: 12,
      hourlyRate: 250,
      description: 'Part-time babysitter available for evenings and weekends. Great with active toddlers!',
      specialties: ['Evening Care', 'Weekend Sitting', 'Play Activities', 'Light Housework'],
      qualifications: ['High School Certificate', 'First Aid Training'],
      languages: ['English', 'Swahili'],
      availability: 'Evenings and weekends',
      isVerified: false,
      hasFirstAid: true,
      hasReferences: true,
      ageGroups: ['1-3 years', '3-5 years'],
      workType: 'live-out'
    }
  ];

  // Mock daycare centers
  const daycareCenters: DaycareCenter[] = [
    {
      id: '1',
      name: 'Little Angels Daycare',
      location: 'Kilimani, Nairobi',
      ageRange: '6 months - 5 years',
      capacity: 40,
      currentEnrollment: 35,
      monthlyFee: 15000,
      rating: 4.8,
      reviews: 45,
      description: 'A warm, nurturing environment where children learn through play. Licensed and experienced staff.',
      programs: ['Infant Care', 'Toddler Program', 'Pre-K Preparation', 'After School Care'],
      facilities: ['Indoor Playground', 'Outdoor Garden', 'Nap Rooms', 'Kitchen', 'Sick Bay'],
      operatingHours: '7:00 AM - 6:00 PM',
      isLicensed: true,
      hasNursery: true,
      contactPhone: '+254 722 123 456',
      images: ['/api/placeholder/200/150']
    },
    {
      id: '2',
      name: 'Sunshine Kids Center',
      location: 'Westlands, Nairobi',
      ageRange: '3 months - 4 years',
      capacity: 60,
      currentEnrollment: 52,
      monthlyFee: 18000,
      rating: 4.6,
      reviews: 38,
      description: 'Montessori-inspired learning with focus on individual child development and cultural awareness.',
      programs: ['Baby Room', 'Toddler Learning', 'Montessori Program', 'Cultural Studies'],
      facilities: ['Montessori Materials', 'Art Studio', 'Music Room', 'Library', 'CCTV'],
      operatingHours: '6:30 AM - 7:00 PM',
      isLicensed: true,
      hasNursery: true,
      contactPhone: '+254 733 456 789',
      images: ['/api/placeholder/200/150']
    },
    {
      id: '3',
      name: 'Happy Tots Nursery',
      location: 'Karen, Nairobi',
      ageRange: '6 months - 3 years',
      capacity: 25,
      currentEnrollment: 20,
      monthlyFee: 22000,
      rating: 4.9,
      reviews: 28,
      description: 'Small, family-style nursery with low teacher-to-child ratios. Organic meals provided.',
      programs: ['Baby Care', 'Toddler Development', 'Early Learning', 'Organic Nutrition'],
      facilities: ['Organic Garden', 'Sensory Room', 'Baby Pool', 'Kitchen', 'Parent Lounge'],
      operatingHours: '7:00 AM - 5:30 PM',
      isLicensed: true,
      hasNursery: true,
      contactPhone: '+254 744 567 890',
      images: ['/api/placeholder/200/150']
    }
  ];

  const providerTypes = [
    { id: 'all', label: 'All', icon: Users },
    { id: 'nanny', label: 'Nannies', icon: Heart },
    { id: 'nurse', label: 'Nurses', icon: Shield },
    { id: 'babysitter', label: 'Babysitters', icon: Baby }
  ];

  const filteredProviders = careProviders.filter(provider => {
    const matchesType = selectedType === 'all' || provider.type === selectedType;
    const matchesSearch = provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         provider.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         provider.specialties.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const filteredDaycares = daycareCenters.filter(daycare =>
    daycare.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    daycare.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    daycare.programs.some(program => program.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'nurse': return Shield;
      case 'babysitter': return Baby;
      default: return Heart;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'nurse': return 'bg-blue-100 text-blue-800';
      case 'babysitter': return 'bg-green-100 text-green-800';
      default: return 'bg-primary/10 text-primary';
    }
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
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </Button>
        <h1 className="text-lg text-foreground">Childcare Services</h1>
        <Button variant="ghost" size="sm" className="p-2">
          <Filter className="w-6 h-6 text-foreground" />
        </Button>
      </div>

      <div className="max-w-7xl mx-auto w-full">
      {/* Search Bar */}
      <div className="p-4 bg-card border-b border-border">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search by name, location, or specialty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background border-border focus:border-primary"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-card border-b border-border">
        <div className="flex">
          {[
            { id: 'providers', label: 'Care Providers', count: careProviders.length },
            { id: 'daycares', label: 'Daycare Centers', count: daycareCenters.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-4 px-2 text-sm transition-colors ${
                activeTab === tab.id
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      <div className="pb-20">
        {/* Care Providers Tab */}
        {activeTab === 'providers' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Provider Type Filter */}
            <div className="p-4 border-b border-border">
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {providerTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                      selectedType === type.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-accent'
                    }`}
                  >
                    <type.icon className="w-4 h-4" />
                    <span>{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="px-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProviders.map((provider, index) => {
                const TypeIcon = getTypeIcon(provider.type);
                
                return (
                  <motion.div
                    key={provider.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="border-border hover:shadow-md transition-shadow h-full">
                      <CardContent className="p-4">
                        <div className="space-y-4">
                          {/* Header */}
                          <div className="flex items-start space-x-3">
                            <div className="relative">
                              <Avatar className="w-14 h-14">
                                <AvatarImage src={provider.avatar} />
                                <AvatarFallback className="bg-primary/10 text-primary">
                                  {provider.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              {provider.isVerified && (
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                  <Verified className="w-3 h-3 text-white" />
                                </div>
                              )}
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h3 className="text-foreground">{provider.name}</h3>
                                <div className="flex items-center space-x-1">
                                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                  <span className="text-sm text-foreground">{provider.rating}</span>
                                  <span className="text-xs text-muted-foreground">({provider.reviews})</span>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge className={`text-xs ${getTypeBadge(provider.type)}`}>
                                  {provider.type}
                                </Badge>
                                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                  <MapPin className="w-3 h-3" />
                                  <span>{provider.location}</span>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {provider.experience} experience
                                </Badge>
                                {provider.hasFirstAid && (
                                  <Badge variant="outline" className="text-xs text-green-600">
                                    First Aid
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Description */}
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {provider.description}
                          </p>

                          {/* Specialties */}
                          <div>
                            <p className="text-xs text-muted-foreground mb-2">Specialties:</p>
                            <div className="flex flex-wrap gap-1">
                              {provider.specialties.slice(0, 3).map((specialty) => (
                                <span
                                  key={specialty}
                                  className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                                >
                                  {specialty}
                                </span>
                              ))}
                              {provider.specialties.length > 3 && (
                                <span className="text-xs text-muted-foreground">
                                  +{provider.specialties.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Languages */}
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <BookOpen className="w-3 h-3" />
                            <span>Speaks: {provider.languages.join(', ')}</span>
                          </div>

                          {/* Pricing */}
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            {provider.hourlyRate && (
                              <div>
                                <p className="text-muted-foreground">Hourly Rate</p>
                                <p className="text-foreground">KSh {provider.hourlyRate.toLocaleString()}</p>
                              </div>
                            )}
                            {provider.monthlyRate && (
                              <div>
                                <p className="text-muted-foreground">Monthly Rate</p>
                                <p className="text-foreground">KSh {provider.monthlyRate.toLocaleString()}</p>
                              </div>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex space-x-2 pt-2">
                            <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90">
                              <MessageCircle className="w-4 h-4 mr-2" />
                              Contact
                            </Button>
                            <Button size="sm" variant="outline" className="px-3 bg-green-600 hover:bg-green-700 text-white border-0">
                              <Phone className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="px-3">
                              <Heart className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
              </div>{/* Close grid */}
            </div>
          </motion.div>
        )}

        {/* Daycare Centers Tab */}
        {activeTab === 'daycares' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 space-y-4 pt-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDaycares.map((daycare, index) => (
              <motion.div
                key={daycare.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-border hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="text-foreground">{daycare.name}</h3>
                            {daycare.isLicensed && (
                              <Shield className="w-4 h-4 text-green-600" />
                            )}
                          </div>
                          <div className="flex items-center space-x-1 text-sm text-muted-foreground mt-1">
                            <MapPin className="w-3 h-3" />
                            <span>{daycare.location}</span>
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className="text-xs bg-blue-100 text-blue-800">
                              {daycare.ageRange}
                            </Badge>
                            {daycare.hasNursery && (
                              <Badge className="text-xs bg-purple-100 text-purple-800">
                                Nursery
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm text-foreground">{daycare.rating}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">({daycare.reviews} reviews)</p>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {daycare.description}
                      </p>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Monthly Fee</p>
                          <p className="text-foreground">KSh {daycare.monthlyFee.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Capacity</p>
                          <p className="text-foreground">{daycare.currentEnrollment}/{daycare.capacity}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Hours</p>
                          <p className="text-foreground text-xs">{daycare.operatingHours}</p>
                        </div>
                      </div>

                      {/* Programs */}
                      <div>
                        <p className="text-xs text-muted-foreground mb-2">Programs:</p>
                        <div className="flex flex-wrap gap-1">
                          {daycare.programs.slice(0, 3).map((program) => (
                            <Badge key={program} variant="outline" className="text-xs">
                              {program}
                            </Badge>
                          ))}
                          {daycare.programs.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{daycare.programs.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Facilities */}
                      <div>
                        <p className="text-xs text-muted-foreground mb-2">Facilities:</p>
                        <div className="flex flex-wrap gap-1">
                          {daycare.facilities.slice(0, 4).map((facility) => (
                            <span
                              key={facility}
                              className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded"
                            >
                              {facility}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-2 pt-2">
                        <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                          <Phone className="w-4 h-4 mr-2" />
                          Call Center
                        </Button>
                        <Button size="sm" variant="outline" className="px-3">
                          <MapPin className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="px-3">
                          <Heart className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            </div>{/* Close grid */}
          </motion.div>
        )}
      </div>
      </div>{/* Close responsive wrapper */}
    </motion.div>
  );
}