import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { 
  ArrowLeft,
  Search,
  Plus,
  MoreHorizontal,
  Users,
  UserPlus,
  Heart,
  MessageCirclePlus,
  X,
  Trash2,
  MailOpen,
  CheckCircle2
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { toast } from 'sonner@2.0.3';

interface ChatListProps {
  onBack: () => void;
  onChatSelect: (chatId: string) => void;
  userName?: string;
}

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  avatar: string;
  isOnline: boolean;
  isGroup: boolean;
  pregnancyWeek?: number;
  location?: string;
}

interface User {
  id: string;
  name: string;
  week?: number;
  location: string;
  avatar: string;
  isOnline: boolean;
}

export function ChatList({ onBack, onChatSelect, userName = "Brenda" }: ChatListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewCircle, setShowNewCircle] = useState(false);
  const [showFindSisters, setShowFindSisters] = useState(false);
  const [showFindMentors, setShowFindMentors] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedChats, setSelectedChats] = useState<string[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [newChatSearch, setNewChatSearch] = useState('');
  const [circleName, setCircleName] = useState('');
  const [circleDescription, setCircleDescription] = useState('');

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Initialize chats
  useEffect(() => {
    const initialChats: Chat[] = [
      {
        id: '1',
        name: 'Sister Circle - Dec 2024',
        lastMessage: 'Aisha: Anyone else feeling those strong kicks? 😊',
        timestamp: '2 min ago',
        unreadCount: 3,
        avatar: '/api/placeholder/40/40',
        isOnline: true,
        isGroup: true,
      },
      {
        id: '2',
        name: 'Faith Wanjiru',
        lastMessage: 'Thank you for the nutrition tips!',
        timestamp: '15 min ago',
        unreadCount: 1,
        avatar: '/api/placeholder/40/40',
        isOnline: true,
        isGroup: false,
        pregnancyWeek: 28,
        location: 'Nairobi',
      },
      {
        id: '3',
        name: 'First-Time Mamas',
        lastMessage: 'Mary: Just had my first ultrasound! 🥰',
        timestamp: '1 hour ago',
        unreadCount: 0,
        avatar: '/api/placeholder/40/40',
        isOnline: false,
        isGroup: true,
      },
      {
        id: '4',
        name: 'Grace Muthoni',
        lastMessage: 'See you at the clinic tomorrow!',
        timestamp: '3 hours ago',
        unreadCount: 0,
        avatar: '/api/placeholder/40/40',
        isOnline: false,
        isGroup: false,
        pregnancyWeek: 22,
        location: 'Kiambu',
      },
      {
        id: '5',
        name: 'Mentor: Dr. Sarah',
        lastMessage: 'Remember to stay hydrated mama',
        timestamp: 'Yesterday',
        unreadCount: 0,
        avatar: '/api/placeholder/40/40',
        isOnline: false,
        isGroup: false,
      },
    ];
    setChats(initialChats);
  }, []);

  // Mock suggested sisters
  const suggestedSisters: User[] = [
    { id: '6', name: 'Amina Hassan', week: 24, location: 'Mombasa', avatar: '/api/placeholder/40/40', isOnline: true },
    { id: '7', name: 'Lucy Atieno', week: 26, location: 'Kisumu', avatar: '/api/placeholder/40/40', isOnline: false },
    { id: '8', name: 'Rose Njeri', week: 25, location: 'Nakuru', avatar: '/api/placeholder/40/40', isOnline: true },
  ];

  // Mock mentors
  const availableMentors: User[] = [
    { id: '9', name: 'Dr. Sarah Kimani', location: 'Obstetrician', avatar: '/api/placeholder/40/40', isOnline: true },
    { id: '10', name: 'Midwife Jane', location: 'Certified Midwife', avatar: '/api/placeholder/40/40', isOnline: false },
    { id: '11', name: 'Mama Grace', location: 'Experienced Mother of 3', avatar: '/api/placeholder/40/40', isOnline: true },
  ];

  // All available users for search
  const allUsers: User[] = [
    ...suggestedSisters,
    ...availableMentors,
    { id: '12', name: 'Akinyi Odhiambo', week: 30, location: 'Eldoret', avatar: '/api/placeholder/40/40', isOnline: true },
    { id: '13', name: 'Njeri Kamau', week: 18, location: 'Thika', avatar: '/api/placeholder/40/40', isOnline: false },
    { id: '14', name: 'Wambui Kariuki', week: 32, location: 'Nairobi', avatar: '/api/placeholder/40/40', isOnline: true },
  ];

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = allUsers.filter(user =>
    user.name.toLowerCase().includes(newChatSearch.toLowerCase()) ||
    user.location.toLowerCase().includes(newChatSearch.toLowerCase())
  );

  const handleChatClick = (chatId: string) => {
    if (selectionMode) {
      toggleChatSelection(chatId);
    } else {
      onChatSelect(chatId);
    }
  };

  const toggleChatSelection = (chatId: string) => {
    setSelectedChats(prev =>
      prev.includes(chatId) ? prev.filter(id => id !== chatId) : [...prev, chatId]
    );
  };

  const handleMarkAsUnread = () => {
    setChats(prev =>
      prev.map(chat =>
        selectedChats.includes(chat.id) ? { ...chat, unreadCount: chat.unreadCount === 0 ? 1 : chat.unreadCount } : chat
      )
    );
    toast.success(`${selectedChats.length} chat(s) marked as unread`);
    setSelectionMode(false);
    setSelectedChats([]);
  };

  const handleDeleteChats = () => {
    setChats(prev => prev.filter(chat => !selectedChats.includes(chat.id)));
    toast.success(`${selectedChats.length} chat(s) deleted`);
    setSelectionMode(false);
    setSelectedChats([]);
  };

  const handleMarkAllAsRead = () => {
    setChats(prev => prev.map(chat => ({ ...chat, unreadCount: 0 })));
    toast.success('All chats marked as read');
    setShowOptions(false);
  };

  const handleCreateCircle = () => {
    if (!circleName.trim()) {
      toast.error('Please enter a circle name');
      return;
    }
    const newCircle: Chat = {
      id: Date.now().toString(),
      name: circleName,
      lastMessage: 'Circle created',
      timestamp: 'Just now',
      unreadCount: 0,
      avatar: '/api/placeholder/40/40',
      isOnline: true,
      isGroup: true,
    };
    setChats(prev => [newCircle, ...prev]);
    toast.success(`${circleName} created successfully!`);
    setCircleName('');
    setCircleDescription('');
    setShowNewCircle(false);
  };

  const handleConnectUser = (user: User) => {
    const existingChat = chats.find(chat => chat.name === user.name);
    if (existingChat) {
      toast.info('You already have a chat with this person');
      onChatSelect(existingChat.id);
      setShowFindSisters(false);
      setShowFindMentors(false);
      return;
    }
    
    const newChat: Chat = {
      id: Date.now().toString(),
      name: user.name,
      lastMessage: 'Say hello! 👋',
      timestamp: 'Just now',
      unreadCount: 0,
      avatar: user.avatar,
      isOnline: user.isOnline,
      isGroup: false,
      pregnancyWeek: user.week,
      location: user.location,
    };
    setChats(prev => [newChat, ...prev]);
    toast.success(`Connected with ${user.name}!`);
    setShowFindSisters(false);
    setShowFindMentors(false);
  };

  const handleStartChat = (user: User) => {
    const existingChat = chats.find(chat => chat.name === user.name);
    if (existingChat) {
      onChatSelect(existingChat.id);
      setShowNewChat(false);
      return;
    }
    
    const newChat: Chat = {
      id: Date.now().toString(),
      name: user.name,
      lastMessage: 'Say hello! 👋',
      timestamp: 'Just now',
      unreadCount: 0,
      avatar: user.avatar,
      isOnline: user.isOnline,
      isGroup: false,
      pregnancyWeek: user.week,
      location: user.location,
    };
    setChats(prev => [newChat, ...prev]);
    toast.success(`Chat started with ${user.name}!`);
    setShowNewChat(false);
    onChatSelect(newChat.id);
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
        <h1 className="text-lg text-foreground">
          {selectionMode ? `${selectedChats.length} Selected` : 'SasaMum Community'}
        </h1>
        <div className="flex space-x-2">
          {selectionMode ? (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-2"
                onClick={() => {
                  setSelectionMode(false);
                  setSelectedChats([]);
                }}
              >
                <X className="w-5 h-5 text-foreground" />
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-2"
                onClick={() => setShowNewChat(true)}
              >
                <Plus className="w-5 h-5 text-foreground" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-2"
                onClick={() => setShowOptions(true)}
              >
                <MoreHorizontal className="w-5 h-5 text-foreground" />
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="px-4 pb-20">
        {/* Selection Mode Actions */}
        {selectionMode && selectedChats.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 mt-4 flex gap-2"
          >
            <Button
              onClick={handleMarkAsUnread}
              className="flex-1 bg-primary"
              size="sm"
            >
              <MailOpen className="w-4 h-4 mr-2" />
              Mark Unread
            </Button>
            <Button
              onClick={handleDeleteChats}
              variant="destructive"
              className="flex-1"
              size="sm"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </motion.div>
        )}

        {/* Search Bar */}
        {!selectionMode && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6 mt-4"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-input-background border-border/50"
              />
            </div>
          </motion.div>
        )}

        {/* Quick Actions */}
        {!selectionMode && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6 grid grid-cols-3 gap-3"
          >
            <Button
              variant="outline"
              className="flex flex-col items-center space-y-2 h-auto py-4 border-primary/30"
              onClick={() => setShowNewCircle(true)}
            >
              <Users className="w-6 h-6 text-primary" />
              <span className="text-xs">New Circle</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center space-y-2 h-auto py-4 border-primary/30"
              onClick={() => setShowFindSisters(true)}
            >
              <UserPlus className="w-6 h-6 text-primary" />
              <span className="text-xs">Find Sisters</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center space-y-2 h-auto py-4 border-primary/30"
              onClick={() => setShowFindMentors(true)}
            >
              <Heart className="w-6 h-6 text-primary" />
              <span className="text-xs">Find Mentors</span>
            </Button>
          </motion.div>
        )}

        {/* Chat List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-2"
        >
          {filteredChats.length > 0 ? (
            filteredChats.map((chat, index) => (
              <motion.div
                key={chat.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
              >
                <Card
                  className={`bg-card/50 border-border/50 hover:bg-card/80 transition-colors cursor-pointer ${
                    selectedChats.includes(chat.id) ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => handleChatClick(chat.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      {selectionMode && (
                        <Checkbox
                          checked={selectedChats.includes(chat.id)}
                          onCheckedChange={() => toggleChatSelection(chat.id)}
                          className="mt-2"
                        />
                      )}
                      <div className="relative">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={chat.avatar} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {chat.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        {chat.isOnline && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-card rounded-full" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="text-foreground truncate">
                            {chat.name}
                          </h3>
                          <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                            {chat.timestamp}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate mb-1">
                          {chat.lastMessage}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {chat.pregnancyWeek && (
                              <Badge variant="secondary" className="text-xs">
                                Week {chat.pregnancyWeek}
                              </Badge>
                            )}
                            {chat.location && (
                              <span className="text-xs text-muted-foreground">
                                {chat.location}
                              </span>
                            )}
                          </div>
                          {chat.unreadCount > 0 && (
                            <Badge className="bg-primary text-primary-foreground">
                              {chat.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No conversations found</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Floating Action Button */}
      {!selectionMode && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
          onClick={() => setShowNewChat(true)}
          className="fixed bottom-24 right-6 w-14 h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg flex items-center justify-center z-40 hover:scale-110 transition-transform"
        >
          <MessageCirclePlus className="w-6 h-6" />
        </motion.button>
      )}

      {/* Selection Mode Toggle FAB */}
      {!selectionMode && chats.length > 0 && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
          onClick={() => setSelectionMode(true)}
          className="fixed bottom-24 left-6 w-12 h-12 bg-card hover:bg-card/80 text-foreground rounded-full shadow-lg flex items-center justify-center z-40 hover:scale-110 transition-transform border border-border"
        >
          <CheckCircle2 className="w-5 h-5" />
        </motion.button>
      )}

      {/* New Circle Dialog */}
      <Dialog open={showNewCircle} onOpenChange={setShowNewCircle}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Sister Circle</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Create a support group with mamas at similar stages
          </DialogDescription>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm">Circle Name</label>
              <Input 
                placeholder="e.g., March 2025 Mamas" 
                value={circleName}
                onChange={(e) => setCircleName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm">Description</label>
              <Input 
                placeholder="What's this circle about?" 
                value={circleDescription}
                onChange={(e) => setCircleDescription(e.target.value)}
              />
            </div>
            <Button 
              className="w-full bg-primary"
              onClick={handleCreateCircle}
            >
              Create Circle
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Find Sisters Dialog */}
      <Dialog open={showFindSisters} onOpenChange={setShowFindSisters}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Find Pregnancy Sisters</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Connect with mamas at similar pregnancy stages
          </DialogDescription>
          <div className="space-y-3 pt-4 max-h-[400px] overflow-y-auto">
            {suggestedSisters.map((sister) => (
              <Card key={sister.id} className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={sister.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {sister.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {sister.isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-card rounded-full" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-foreground">{sister.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Week {sister.week} • {sister.location}
                      </p>
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-primary"
                      onClick={() => handleConnectUser(sister)}
                    >
                      Connect
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Find Mentors Dialog */}
      <Dialog open={showFindMentors} onOpenChange={setShowFindMentors}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Find a Mentor</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Get guidance from healthcare providers and experienced mamas
          </DialogDescription>
          <div className="space-y-3 pt-4 max-h-[400px] overflow-y-auto">
            {availableMentors.map((mentor) => (
              <Card key={mentor.id} className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={mentor.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {mentor.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {mentor.isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-card rounded-full" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-foreground">{mentor.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {mentor.location}
                      </p>
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-primary"
                      onClick={() => handleConnectUser(mentor)}
                    >
                      Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* New Chat Dialog */}
      <Dialog open={showNewChat} onOpenChange={setShowNewChat}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Start New Chat</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Search for a sister to start chatting
          </DialogDescription>
          <div className="space-y-4 pt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or location..."
                className="pl-10"
                value={newChatSearch}
                onChange={(e) => setNewChatSearch(e.target.value)}
              />
            </div>
            <div className="max-h-[300px] overflow-y-auto space-y-2">
              {newChatSearch.trim() === '' ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Type to search for users
                </p>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <Card 
                    key={user.id} 
                    className="border-border/50 cursor-pointer hover:bg-card/80 transition-colors"
                    onClick={() => handleStartChat(user)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          {user.isOnline && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-card rounded-full" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-foreground">{user.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {user.week ? `Week ${user.week} • ` : ''}{user.location}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No users found
                </p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Options Dialog */}
      <Dialog open={showOptions} onOpenChange={setShowOptions}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chat Options</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Manage your chat settings and preferences
          </DialogDescription>
          <div className="space-y-2 pt-4">
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={handleMarkAllAsRead}
            >
              <MailOpen className="w-4 h-4 mr-3" />
              Mark all as read
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => {
                toast.info('Notifications muted for 8 hours');
                setShowOptions(false);
              }}
            >
              Mute notifications
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => {
                toast.info('Archived chats feature coming soon');
                setShowOptions(false);
              }}
            >
              Archived chats
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => {
                toast.info('Blocked users feature coming soon');
                setShowOptions(false);
              }}
            >
              Blocked users
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-muted-foreground"
              onClick={() => {
                toast.info('Chat settings feature coming soon');
                setShowOptions(false);
              }}
            >
              Chat settings
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
