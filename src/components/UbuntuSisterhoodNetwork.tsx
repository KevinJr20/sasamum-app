import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { 
  ArrowLeft,
  Search,
  Users,
  Heart,
  MapPin,
  Calendar,
  MessageCircle,
  Star,
  Crown,
  Baby,
  Home,
  User,
  MoreHorizontal,
  Plus
} from 'lucide-react';

interface SasaMumSisterhoodNetworkProps {
  onBack: () => void;
  userName?: string;
}

interface SisterMember {
  id: string;
  name: string;
  age: number;
  week: number;
  dueDate: string;
  location: string;
  distance: string;
  avatar: string;
  role: 'sister' | 'mentor' | 'keeper';
  specialties?: string[];
  isOnline: boolean;
  mutualConnections: number;
  bio: string;
}

export function SasaMumSisterhoodNetwork({ onBack, userName = "Brenda" }: SasaMumSisterhoodNetworkProps) {
  const [activeTab, setActiveTab] = useState<'sisters' | 'mentors' | 'keepers'>('sisters');
  const [searchQuery, setSearchQuery] = useState('');

  const sisters: SisterMember[] = [
    {
      id: '1',
      name: 'Amara Okafor',
      age: 28,
      week: 15,
      dueDate: 'March 2025',
      location: 'Nairobi, Kenya',
      distance: '2.5 km',
      avatar: '/api/placeholder/40/40',
      role: 'sister',
      isOnline: true,
      mutualConnections: 3,
      bio: 'First-time mama excited to connect with other mothers in my area! 💕'
    },
    {
      id: '2',
      name: 'Zara Mwangi',
      age: 26,
      week: 18,
      dueDate: 'February 2025',
      location: 'Westlands, Nairobi',
      distance: '4.1 km',
      avatar: '/api/placeholder/40/40',
      role: 'sister',
      isOnline: false,
      mutualConnections: 5,
      bio: 'Loving this pregnancy journey! Looking for walking buddies 🚶‍♀️'
    },
    {
      id: '3',
      name: 'Fatima Hassan',
      age: 24,
      week: 16,
      dueDate: 'March 2025',
      location: 'South C, Nairobi',
      distance: '6.2 km',
      avatar: '/api/placeholder/40/40',
      role: 'sister',
      isOnline: true,
      mutualConnections: 2,
      bio: 'Expecting baby #1, would love to share experiences with other mamas'
    }
  ];

  const mentors: SisterMember[] = [
    {
      id: '4',
      name: 'Dr. Grace Njeri',
      age: 35,
      week: 0,
      dueDate: '',
      location: 'Upper Hill, Nairobi',
      distance: '3.8 km',
      avatar: '/api/placeholder/40/40',
      role: 'mentor',
      specialties: ['Breastfeeding', 'Newborn Care', 'Postpartum'],
      isOnline: true,
      mutualConnections: 12,
      bio: 'Mother of 3, here to support new mamas through their beautiful journey 🌟'
    },
    {
      id: '5',
      name: 'Sarah Wanjiku',
      age: 32,
      week: 0,
      dueDate: '',
      location: 'Karen, Nairobi',
      distance: '8.5 km',
      avatar: '/api/placeholder/40/40',
      role: 'mentor',
      specialties: ['Natural Birth', 'Pregnancy Nutrition', 'Mental Health'],
      isOnline: false,
      mutualConnections: 8,
      bio: 'Experienced mama passionate about natural pregnancy and childbirth'
    }
  ];

  const keepers: SisterMember[] = [
    {
      id: '6',
      name: 'Mama Rose Nyong\'o',
      age: 68,
      week: 0,
      dueDate: '',
      location: 'Kibera, Nairobi',
      distance: '5.5 km',
      avatar: '/api/placeholder/40/40',
      role: 'keeper',
      specialties: ['Traditional Remedies', 'Cultural Rituals', 'Ancestral Wisdom'],
      isOnline: true,
      mutualConnections: 25,
      bio: 'Grandmother of 12, keeper of traditional pregnancy wisdom and herbs 🌿'
    },
    {
      id: '7',
      name: 'Mama Esther Kimani',
      age: 62,
      week: 0,
      dueDate: '',
      location: 'Eastlands, Nairobi', 
      distance: '7.2 km',
      avatar: '/api/placeholder/40/40',
      role: 'keeper',
      specialties: ['Birth Stories', 'Community Support', 'Spiritual Guidance'],
      isOnline: false,
      mutualConnections: 18,
      bio: 'Traditional birth attendant sharing generations of motherhood wisdom'
    }
  ];

  const getCurrentMembers = () => {
    switch (activeTab) {
      case 'sisters': return sisters;
      case 'mentors': return mentors;
      case 'keepers': return keepers;
      default: return sisters;
    }
  };

  const filteredMembers = getCurrentMembers().filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (member.specialties && member.specialties.some(specialty => 
      specialty.toLowerCase().includes(searchQuery.toLowerCase())
    ))
  );

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'sister': return <Heart className="w-4 h-4" />;
      case 'mentor': return <Star className="w-4 h-4" />;
      case 'keeper': return <Crown className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'sister': return 'bg-pink-100 text-pink-700';
      case 'mentor': return 'bg-blue-100 text-blue-700';
      case 'keeper': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

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
      className="min-h-screen bg-background max-w-sm mx-auto"
    >
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 flex items-center justify-between p-4 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
        <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </Button>
        <h1 className="text-lg text-foreground">SasaMum Sisterhood</h1>
        <Button variant="ghost" size="sm" className="p-2">
          <MoreHorizontal className="w-6 h-6 text-foreground" />
        </Button>
      </div>

      <div className="px-4 pb-20">
        {/* Ubuntu Philosophy Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6"
        >
          <Card className="bg-gradient-to-r from-primary/10 via-purple/10 to-pink/10 border-primary/20">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Users className="w-6 h-6 text-primary" />
                <h3 className="text-foreground">SasaMum: "I am because we are"</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Connect with sisters, learn from mentors, and receive wisdom from keepers in your community
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6"
        >
          <div className="flex space-x-1 bg-muted rounded-lg p-1">
            {[
              { key: 'sisters', label: 'Sisters', count: sisters.length },
              { key: 'mentors', label: 'Mentors', count: mentors.length },
              { key: 'keepers', label: 'Keepers', count: keepers.length }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex-1 px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                  activeTab === tab.key
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-6"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-border/50 focus:border-primary"
            />
          </div>
        </motion.div>

        {/* Members List */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-4"
        >
          {filteredMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="border-border/50 hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-[1.02]">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      {member.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>

                    {/* Member Info */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="text-foreground">{member.name}</h4>
                            <Badge className={`text-xs px-2 py-0.5 ${getRoleColor(member.role)}`}>
                              {getRoleIcon(member.role)}
                              <span className="ml-1 capitalize">{member.role}</span>
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                            <span>{member.age} years</span>
                            {member.week > 0 && <span>{member.week} weeks</span>}
                            <span>{member.distance}</span>
                          </div>
                        </div>
                      </div>

                      {/* Bio */}
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {member.bio}
                      </p>

                      {/* Specialties (for mentors and keepers) */}
                      {member.specialties && (
                        <div className="flex flex-wrap gap-1">
                          {member.specialties.slice(0, 3).map((specialty, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs px-2 py-0.5">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Location and Mutual Connections */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-1 text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          <span>{member.location}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-muted-foreground">
                          <Users className="w-3 h-3" />
                          <span>{member.mutualConnections} mutual</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center space-x-2 pt-2">
                        <Button size="sm" variant="outline" className="flex-1 text-xs">
                          <MessageCircle className="w-3 h-3 mr-1" />
                          Message
                        </Button>
                        <Button size="sm" className="flex-1 text-xs bg-primary hover:bg-primary/90">
                          <Plus className="w-3 h-3 mr-1" />
                          Connect
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {filteredMembers.length === 0 && (
            <div className="text-center py-8 space-y-3">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <Users className="w-8 h-8 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-foreground">No {activeTab} found</p>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search or check back later
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
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm bg-white border-t border-border/50 px-4 py-3"
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
    </motion.div>
  );
}
