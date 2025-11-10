import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Progress } from './ui/progress';
import { toast } from 'sonner@2.0.3';
import { 
  ArrowLeft,
  Users,
  Heart,
  MessageCircle,
  MapPin,
  Calendar,
  Baby,
  Star,
  Gift,
  Coffee,
  Phone,
  Video,
  UserPlus,
  Filter,
  Search,
  Crown,
  Award,
  Zap
} from 'lucide-react';

interface PregnancyBuddySystemProps {
  onBack: () => void;
  userName?: string;
}

interface BuddyProfile {
  id: string;
  name: string;
  avatar: string;
  location: string;
  currentWeek: number;
  dueDate: string;
  isFirstTime: boolean;
  interests: string[];
  bio: string;
  languages: string[];
  matchScore: number;
  isOnline: boolean;
  lastSeen: string;
  pregnancyJourney: {
    totalWeeks: number;
    milestones: string[];
    challenges: string[];
  };
  personality: {
    supportStyle: 'Cheerleader' | 'Advisor' | 'Listener' | 'Motivator';
    communicationStyle: 'Daily' | 'Weekly' | 'As-needed';
    preferredTopics: string[];
  };
}

interface BuddyRequest {
  id: string;
  from: BuddyProfile;
  message: string;
  sentAt: string;
  status: 'pending' | 'accepted' | 'declined';
}

export function PregnancyBuddySystem({ onBack, userName = "Brenda" }: PregnancyBuddySystemProps) {
  const [activeTab, setActiveTab] = useState<'discover' | 'my-buddies' | 'requests'>('discover');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  // Mock buddy profiles with African names and contexts
  const potentialBuddies: BuddyProfile[] = [
    {
      id: '1',
      name: 'Amara Okafor',
      avatar: '/api/placeholder/60/60',
      location: 'Lagos, Nigeria',
      currentWeek: 15,
      dueDate: '2024-12-20',
      isFirstTime: true,
      interests: ['yoga', 'nutrition', 'reading', 'cooking'],
      bio: 'First-time mama excited about this journey! Love traditional foods and staying active. Looking for someone to share the ups and downs with! 🌟',
      languages: ['English', 'Igbo', 'French'],
      matchScore: 95,
      isOnline: true,
      lastSeen: 'now',
      pregnancyJourney: {
        totalWeeks: 15,
        milestones: ['First heartbeat', 'Gender reveal', 'Feeling kicks'],
        challenges: ['Morning sickness', 'Food aversions']
      },
      personality: {
        supportStyle: 'Cheerleader',
        communicationStyle: 'Daily',
        preferredTopics: ['nutrition', 'exercise', 'mental health']
      }
    },
    {
      id: '2',
      name: 'Fatima Kone',
      avatar: '/api/placeholder/60/60',
      location: 'Nairobi, Kenya',
      currentWeek: 18,
      dueDate: '2024-11-25',
      isFirstTime: false,
      interests: ['meditation', 'traditional music', 'herbs', 'community'],
      bio: 'Second pregnancy, loving every moment! I believe in Ubuntu and supporting each other. Happy to share wisdom and learn new things too! 💕',
      languages: ['English', 'Swahili', 'Arabic'],
      matchScore: 88,
      isOnline: false,
      lastSeen: '2 hours ago',
      pregnancyJourney: {
        totalWeeks: 18,
        milestones: ['Anatomy scan', 'Baby shower planning', 'Nursery setup'],
        challenges: ['Backaches', 'Sleep issues']
      },
      personality: {
        supportStyle: 'Advisor',
        communicationStyle: 'Weekly',
        preferredTopics: ['traditional practices', 'family preparation', 'self-care']
      }
    },
    {
      id: '3',
      name: 'Grace Mwangi',
      avatar: '/api/placeholder/60/60',
      location: 'Kampala, Uganda',
      currentWeek: 14,
      dueDate: '2025-01-10',
      isFirstTime: true,
      interests: ['photography', 'journaling', 'nature', 'spirituality'],
      bio: 'Documenting this beautiful journey through photos and words. Looking for a kindred spirit to share the wonder of creating life! ✨',
      languages: ['English', 'Luganda'],
      matchScore: 82,
      isOnline: true,
      lastSeen: 'now',
      pregnancyJourney: {
        totalWeeks: 14,
        milestones: ['First scan', 'Sharing news', 'Maternity photos'],
        challenges: ['Emotional ups and downs', 'Body changes']
      },
      personality: {
        supportStyle: 'Listener',
        communicationStyle: 'As-needed',
        preferredTopics: ['emotional support', 'photography', 'spiritual growth']
      }
    }
  ];

  const currentBuddies: BuddyProfile[] = [
    {
      id: '4',
      name: 'Zara Alhassan',
      avatar: '/api/placeholder/60/60',
      location: 'Accra, Ghana',
      currentWeek: 16,
      dueDate: '2024-12-18',
      isFirstTime: true,
      interests: ['fitness', 'cooking', 'music', 'dancing'],
      bio: 'Your buddy since week 8! 💃🏾',
      languages: ['English', 'Twi'],
      matchScore: 92,
      isOnline: true,
      lastSeen: 'now',
      pregnancyJourney: {
        totalWeeks: 16,
        milestones: ['Buddy matching', 'Weekly check-ins', 'Recipe sharing'],
        challenges: ['Cravings', 'Energy levels']
      },
      personality: {
        supportStyle: 'Motivator',
        communicationStyle: 'Daily',
        preferredTopics: ['fitness', 'nutrition', 'positive mindset']
      }
    }
  ];

  const buddyRequests: BuddyRequest[] = [
    {
      id: '1',
      from: potentialBuddies[0],
      message: 'Hi sister! I saw we\'re at similar stages and love the same things. Would love to be pregnancy buddies! 🤗',
      sentAt: '2 hours ago',
      status: 'pending'
    }
  ];

  const calculateWeeksDifference = (week1: number, week2: number) => {
    return Math.abs(week1 - week2);
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-orange-600 bg-orange-100';
    return 'text-gray-600 bg-gray-100';
  };

  const handleSendBuddyRequest = (buddyId: string) => {
    // In real app, would send request to backend
    toast.success('Buddy request sent!');
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-background w-full pb-20"
    >
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 flex items-center justify-between p-4 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
        <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </Button>
        <h1 className="text-lg text-foreground">Pregnancy Buddies</h1>
        <Button variant="ghost" size="sm" className="p-2">
          <Search className="w-6 h-6 text-foreground" />
        </Button>
      </div>

      {/* Hero Section */}
      <div className="p-4 bg-primary/5 border-b border-border">
        <Card className="border-primary/20">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Users className="w-6 h-6 text-primary" />
              <Heart className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-foreground mb-2">SasaMum Pregnancy Buddies</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Connect with mothers at similar stages for mutual support, 
              shared experiences, and lifelong friendships.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="bg-card border-b border-border">
        <div className="flex">
          {[
            { id: 'discover', label: 'Discover', count: potentialBuddies.length },
            { id: 'my-buddies', label: 'My Buddies', count: currentBuddies.length },
            { id: 'requests', label: 'Requests', count: buddyRequests.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-4 px-2 text-sm transition-colors relative ${
                activeTab === tab.id
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 min-w-[20px] h-5">
                  {tab.count}
                </Badge>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="pb-20">
        {/* Discover Tab */}
        {activeTab === 'discover' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 space-y-4"
          >
            <div className="text-center mb-4">
              <h3 className="text-foreground mb-1">Find Your Perfect Buddy</h3>
              <p className="text-sm text-muted-foreground">
                We match you based on pregnancy stage, location, interests, and personality
              </p>
            </div>

            {potentialBuddies.map((buddy, index) => (
              <motion.div
                key={buddy.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-border hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-start space-x-3">
                        <div className="relative">
                          <Avatar className="w-14 h-14">
                            <AvatarImage src={buddy.avatar} />
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {buddy.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          {buddy.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-card rounded-full" />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-foreground">{buddy.name}</h4>
                            <Badge className={`text-xs ${getMatchScoreColor(buddy.matchScore)}`}>
                              {buddy.matchScore}% match
                            </Badge>
                          </div>
                          
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                            <MapPin className="w-3 h-3" />
                            <span>{buddy.location}</span>
                            <span>•</span>
                            <Calendar className="w-3 h-3" />
                            <span>Week {buddy.currentWeek}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2 mt-1">
                            {buddy.isFirstTime && (
                              <Badge variant="outline" className="text-xs">First Time</Badge>
                            )}
                            <Badge className="text-xs bg-primary/10 text-primary">
                              {buddy.personality.supportStyle}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Bio */}
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {buddy.bio}
                      </p>

                      {/* Match Details */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Pregnancy Timeline</span>
                          <span className="text-foreground">
                            {calculateWeeksDifference(16, buddy.currentWeek)} weeks apart
                          </span>
                        </div>
                        <Progress 
                          value={100 - (calculateWeeksDifference(16, buddy.currentWeek) * 10)} 
                          className="h-1"
                        />
                      </div>

                      {/* Interests */}
                      <div className="flex flex-wrap gap-1">
                        {buddy.interests.slice(0, 4).map((interest) => (
                          <Badge key={interest} variant="outline" className="text-xs">
                            {interest}
                          </Badge>
                        ))}
                        {buddy.interests.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{buddy.interests.length - 4} more
                          </Badge>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex space-x-2 pt-2">
                        <Button 
                          size="sm" 
                          className="flex-1 bg-primary hover:bg-primary/90"
                          onClick={() => handleSendBuddyRequest(buddy.id)}
                        >
                          <UserPlus className="w-4 h-4 mr-2" />
                          Send Request
                        </Button>
                        <Button size="sm" variant="outline" className="px-3">
                          <Heart className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="px-3">
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* My Buddies Tab */}
        {activeTab === 'my-buddies' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 space-y-4"
          >
            {currentBuddies.map((buddy, index) => (
              <Card key={buddy.id} className="border-border">
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={buddy.avatar} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {buddy.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-card rounded-full" />
                        <div className="absolute -top-1 -right-1">
                          <Award className="w-4 h-4 text-yellow-500" />
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-foreground">{buddy.name}</h4>
                          <Badge className="text-xs bg-green-100 text-green-800">
                            Active Buddy
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{buddy.bio}</p>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
                          <Calendar className="w-3 h-3" />
                          <span>Week {buddy.currentWeek}</span>
                          <span>•</span>
                          <Zap className="w-3 h-3" />
                          <span>8 weeks together</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      <Button size="sm" variant="outline" className="p-2">
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="p-2">
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="p-2">
                        <Video className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="p-2">
                        <Gift className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {currentBuddies.length === 0 && (
              <div className="text-center py-8 space-y-3">
                <Users className="w-12 h-12 text-muted-foreground mx-auto" />
                <div>
                  <p className="text-foreground">No buddies yet</p>
                  <p className="text-sm text-muted-foreground">
                    Start by sending requests to potential buddies
                  </p>
                </div>
                <Button 
                  onClick={() => setActiveTab('discover')}
                  className="bg-primary hover:bg-primary/90"
                >
                  Find Buddies
                </Button>
              </div>
            )}
          </motion.div>
        )}

        {/* Requests Tab */}
        {activeTab === 'requests' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 space-y-4"
          >
            {buddyRequests.map((request, index) => (
              <Card key={request.id} className="border-border">
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={request.from.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {request.from.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-foreground">{request.from.name}</h4>
                          <span className="text-xs text-muted-foreground">{request.sentAt}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          <span>{request.from.location}</span>
                          <span>•</span>
                          <Calendar className="w-3 h-3" />
                          <span>Week {request.from.currentWeek}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-sm text-foreground italic">"{request.message}"</p>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90">
                        <Heart className="w-4 h-4 mr-2" />
                        Accept
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        Decline
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {buddyRequests.length === 0 && (
              <div className="text-center py-8 space-y-3">
                <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto" />
                <div>
                  <p className="text-foreground">No requests yet</p>
                  <p className="text-sm text-muted-foreground">
                    Buddy requests will appear here
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
