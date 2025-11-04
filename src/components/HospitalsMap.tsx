import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useScrollToTop } from './utils/useScrollToTop';
import { HeaderMenu } from './HeaderMenu';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  ArrowLeft,
  Search,
  MapPin,
  Navigation,
  Phone,
  Clock,
  Star,
  Home,
  Calendar,
  MessageCircle,
  User,
  MoreHorizontal,
  Menu
} from 'lucide-react';

interface HospitalsMapProps {
  onBack: () => void;
  onNavigate?: (screen: string) => void;
  userName?: string;
}

interface Hospital {
  id: string;
  name: string;
  address: string;
  distance: string;
  rating: number;
  reviews: number;
  phone: string;
  specialties: string[];
  openHours: string;
  image: string;
  isPartner: boolean;
  coordinates: { lat: number; lng: number };
}

export function HospitalsMap({ onBack, onNavigate, userName = "Brenda" }: HospitalsMapProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [showMenu, setShowMenu] = useState(false);

  // Mock hospital data with African hospital names and locations
  const hospitals: Hospital[] = [
    {
      id: '1',
      name: 'Aga Khan University Hospital',
      address: '3rd Parklands Avenue, Nairobi',
      distance: '2.1 km',
      rating: 4.8,
      reviews: 342,
      phone: '+254-20-3740000',
      specialties: ['Maternity', 'NICU', 'Pediatrics'],
      openHours: '24/7',
      image: '/api/placeholder/60/60',
      isPartner: true,
      coordinates: { lat: -1.2675, lng: 36.8107 }
    },
    {
      id: '2',
      name: 'Nairobi Women\'s Hospital',
      address: 'Argwings Kodhek Road, Hurlingham',
      distance: '3.5 km',
      rating: 4.6,
      reviews: 256,
      phone: '+254-20-2729000',
      specialties: ['Women\'s Health', 'Maternity', 'Fertility'],
      openHours: '24/7',
      image: '/api/placeholder/60/60',
      isPartner: true,
      coordinates: { lat: -1.2921, lng: 36.7872 }
    },
    {
      id: '3',
      name: 'Kenyatta National Hospital',
      address: 'Hospital Road, Upper Hill',
      distance: '4.2 km',
      rating: 4.3,
      reviews: 189,
      phone: '+254-20-2726300',
      specialties: ['Maternity', 'Emergency', 'General'],
      openHours: '24/7',
      image: '/api/placeholder/60/60',
      isPartner: false,
      coordinates: { lat: -1.3013, lng: 36.8073 }
    },
    {
      id: '4',
      name: 'MP Shah Hospital',
      address: 'Shivaji Road, Parklands',
      distance: '5.1 km',
      rating: 4.5,
      reviews: 198,
      phone: '+254-20-3742763',
      specialties: ['Maternity', 'Cardiology', 'Oncology'],
      openHours: '24/7',
      image: '/api/placeholder/60/60',
      isPartner: true,
      coordinates: { lat: -1.2646, lng: 36.8217 }
    }
  ];

  const filteredHospitals = hospitals.filter(hospital =>
    hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hospital.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hospital.specialties.some(specialty => 
      specialty.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const bottomNavItems = [
    { icon: Home, isActive: false },
    { icon: Calendar, isActive: false },
    { icon: MessageCircle, isActive: false },
    { icon: User, isActive: false }
  ];

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
        <h1 className="text-lg text-foreground">Hospitals</h1>
        <div className="w-10" />
      </div>

      {/* HeaderMenu */}
      <HeaderMenu 
        isOpen={showMenu}
        onClose={() => setShowMenu(false)}
        onNavigateToPhotos={() => {}}
        onNavigateToArticlesVideos={() => {}}
        onNavigateToBabyTracker={() => {}}
        onNavigateToMarketplace={() => {}}
        onNavigateToFood={() => {}}
        onNavigateToChildcare={() => {}}
        onNavigateToSettings={() => {}}
        onSignOut={() => {}}
        userName={userName}
      />

      <div className="max-w-7xl mx-auto w-full">{/* Wrapper for responsive content */}

      {/* Map Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="relative h-64 bg-muted mx-4 rounded-xl overflow-hidden mb-4"
      >
        {/* Mock Map Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-blue-50 to-green-50">
          {/* Map Elements */}
          <div className="absolute inset-0">
            {/* Roads */}
            <div className="absolute top-16 left-8 w-32 h-1 bg-gray-300 rounded transform rotate-45"></div>
            <div className="absolute top-32 left-16 w-24 h-1 bg-gray-300 rounded transform -rotate-12"></div>
            <div className="absolute bottom-20 right-12 w-28 h-1 bg-gray-300 rounded transform rotate-12"></div>
            
            {/* Water/River */}
            <div className="absolute bottom-8 left-4 w-40 h-3 bg-blue-200 rounded-full transform rotate-6"></div>
            
            {/* Green Areas */}
            <div className="absolute top-8 right-8 w-16 h-12 bg-green-200 rounded-lg"></div>
            <div className="absolute bottom-16 left-8 w-20 h-8 bg-green-200 rounded-lg"></div>
            
            {/* Hospital Markers */}
            {hospitals.slice(0, 3).map((hospital, index) => (
              <button
                key={hospital.id}
                onClick={() => setSelectedHospital(hospital)}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${30 + index * 25}%`,
                  top: `${40 + index * 15}%`
                }}
              >
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Your Location Indicator */}
        <div className="absolute bottom-4 left-4 flex items-center space-x-2 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg">
          <Navigation className="w-4 h-4 text-primary" />
          <span className="text-sm text-foreground">Your Location</span>
        </div>

        {/* Location Button */}
        <Button
          size="sm"
          className="absolute bottom-4 right-4 w-10 h-10 p-0 bg-white shadow-lg hover:bg-white/90"
          variant="secondary"
        >
          <Navigation className="w-5 h-5 text-foreground" />
        </Button>
      </motion.div>

      <div className="px-4 pb-20">
        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search hospitals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-border/50 focus:border-primary"
            />
          </div>
        </motion.div>

        {/* Hospitals List */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-4"
        >
          {filteredHospitals.map((hospital, index) => (
            <motion.div
              key={hospital.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="border-border/50 hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-[1.02]">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    {/* Hospital Image */}
                    <div className="relative flex-shrink-0">
                      <ImageWithFallback
                        src={hospital.image}
                        alt={hospital.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      {hospital.isPartner && (
                        <Badge className="absolute -top-1 -right-1 text-xs px-1.5 py-0.5 bg-primary text-primary-foreground">
                          Partner
                        </Badge>
                      )}
                    </div>

                    {/* Hospital Info */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-foreground line-clamp-1">{hospital.name}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-1">{hospital.address}</p>
                        </div>
                        <div className="flex items-center space-x-1 text-right">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{hospital.distance}</span>
                        </div>
                      </div>

                      {/* Rating and Reviews */}
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm text-foreground">{hospital.rating}</span>
                          <span className="text-sm text-muted-foreground">({hospital.reviews})</span>
                        </div>
                        <div className="flex items-center space-x-1 text-green-600">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">{hospital.openHours}</span>
                        </div>
                      </div>

                      {/* Specialties */}
                      <div className="flex items-center space-x-2">
                        {hospital.specialties.slice(0, 2).map((specialty, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs px-2 py-0.5">
                            {specialty}
                          </Badge>
                        ))}
                        {hospital.specialties.length > 2 && (
                          <span className="text-xs text-muted-foreground">
                            +{hospital.specialties.length - 2} more
                          </span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center space-x-2 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 text-xs"
                          onClick={() => window.location.href = `tel:${hospital.phone}`}
                        >
                          <Phone className="w-3 h-3 mr-1" />
                          Call
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 text-xs bg-primary hover:bg-primary/90"
                          onClick={() => {
                            const { lat, lng } = hospital.coordinates;
                            window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
                          }}
                        >
                          <Navigation className="w-3 h-3 mr-1" />
                          Directions
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {filteredHospitals.length === 0 && (
            <div className="text-center py-8 space-y-3">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-foreground">No hospitals found</p>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search terms
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm bg-card border-t border-border px-4 py-3"
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
                } else if (item.icon === Calendar && onNavigate) {
                  onNavigate('calendar');
                } else if (item.icon === MessageCircle && onNavigate) {
                  onNavigate('chat');
                } else if (item.icon === User && onNavigate) {
                  onNavigate('profile');
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
      </div>{/* Close responsive wrapper */}
    </motion.div>
  );
}