import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollToTop } from './utils/useScrollToTop';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback } from './ui/avatar';
import { 
  ArrowLeft,
  Send,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Camera,
  Smile,
  User,
  Bell,
  BellOff,
  Search,
  Trash2,
  Ban,
  X,
  FileText,
  Image as ImageIcon,
  Wallpaper,
  Check,
  Info
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { toast } from 'sonner@2.0.3';
import { Textarea } from './ui/textarea';

interface ChatScreenProps {
  chatId: string;
  onBack: () => void;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: Date;
  isMe: boolean;
  type?: 'text' | 'image' | 'file';
  fileUrl?: string;
  fileName?: string;
}

export function ChatScreen({ chatId, onBack }: ChatScreenProps) {
  useScrollToTop();
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [showOptions, setShowOptions] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showCallDialog, setShowCallDialog] = useState(false);
  const [showVideoDialog, setShowVideoDialog] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showWallpaperPicker, setShowWallpaperPicker] = useState(false);
  const [showSearchInChat, setShowSearchInChat] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [wallpaper, setWallpaper] = useState('default');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  
  // Mock chat data
  const chatInfo = {
    id: chatId,
    name: chatId === '2' ? 'Faith Wanjiru' : chatId === '4' ? 'Grace Muthoni' : 'Sister Circle - Dec 2024',
    isGroup: chatId === '1' || chatId === '3' || chatId === '5',
    avatar: '/api/placeholder/40/40',
    isOnline: chatId === '2' || chatId === '1',
    lastSeen: new Date(),
    pregnancyWeek: 28,
    location: 'Nairobi',
    dueDate: 'March 15, 2025',
    bio: 'First-time mama, excited for this journey! 💕',
    phone: '+254 712 345 678'
  };

  // Available wallpapers
  const wallpapers = [
    { id: 'default', name: 'Default', gradient: 'bg-background' },
    { id: 'pink', name: 'Pink Bliss', gradient: 'bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950 dark:to-pink-900' },
    { id: 'purple', name: 'Purple Dream', gradient: 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900' },
    { id: 'blue', name: 'Ocean Blue', gradient: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900' },
    { id: 'green', name: 'Nature Green', gradient: 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900' },
    { id: 'warm', name: 'Warm Sunset', gradient: 'bg-gradient-to-br from-orange-50 to-red-100 dark:from-orange-950 dark:to-red-900' },
  ];

  // Common emojis
  const commonEmojis = ['😊', '❤️', '👍', '😂', '🙏', '😘', '💕', '🤗', '😍', '👏', '🥰', '💪', '🌟', '✨', '🎉', '🎊', '💐', '🌸', '🌺', '🌹', '🦋', '🌈', '☀️', '⭐'];

  // Initialize with mock messages
  useEffect(() => {
    const initialMessages: Message[] = [
      {
        id: '1',
        senderId: '2',
        senderName: chatInfo.name,
        text: 'Good morning, sister! How are you feeling today?',
        timestamp: new Date(Date.now() - 3600000),
        isMe: false,
        type: 'text'
      },
      {
        id: '2',
        senderId: 'me',
        senderName: 'You',
        text: 'Morning! I\'m feeling much better. The ginger tea really helped!',
        timestamp: new Date(Date.now() - 3500000),
        isMe: true,
        type: 'text'
      },
      {
        id: '3',
        senderId: '2',
        senderName: chatInfo.name,
        text: 'That\'s wonderful! Remember to stay hydrated too 💙',
        timestamp: new Date(Date.now() - 3400000),
        isMe: false,
        type: 'text'
      },
    ];
    setMessages(initialMessages);
  }, [chatId]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        senderId: 'me',
        senderName: 'You',
        text: newMessage,
        timestamp: new Date(),
        isMe: true,
        type: 'text'
      };
      setMessages([...messages, message]);
      setNewMessage('');
      
      // Simulate response after 2 seconds
      setTimeout(() => {
        const responses = [
          'Thank you for sharing! 💕',
          'That\'s great to hear!',
          'I understand how you feel',
          'You\'re doing amazing mama! 💪',
          'Let me know if you need anything'
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        const responseMessage: Message = {
          id: (Date.now() + 1).toString(),
          senderId: '2',
          senderName: chatInfo.name,
          text: randomResponse,
          timestamp: new Date(),
          isMe: false,
          type: 'text'
        };
        setMessages(prev => [...prev, responseMessage]);
      }, 2000);
    }
  };

  const handleVoiceCall = () => {
    if (chatInfo.isGroup) {
      toast.error('Voice calls are only available for individual chats');
      return;
    }
    setShowCallDialog(true);
    setTimeout(() => {
      setShowCallDialog(false);
      toast.success('Call connected');
    }, 3000);
  };

  const handleVideoCall = () => {
    if (chatInfo.isGroup) {
      toast.error('Video calls are only available for individual chats');
      return;
    }
    setShowVideoDialog(true);
    setTimeout(() => {
      setShowVideoDialog(false);
      toast.success('Video call connected');
    }, 3000);
  };

  const handleAttachment = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const message: Message = {
        id: Date.now().toString(),
        senderId: 'me',
        senderName: 'You',
        text: `📎 ${file.name}`,
        timestamp: new Date(),
        isMe: true,
        type: 'file',
        fileName: file.name,
        fileUrl: URL.createObjectURL(file)
      };
      setMessages([...messages, message]);
      toast.success('File attached successfully');
    }
  };

  const handleCameraClick = () => {
    imageInputRef.current?.click();
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const message: Message = {
        id: Date.now().toString(),
        senderId: 'me',
        senderName: 'You',
        text: '📷 Photo',
        timestamp: new Date(),
        isMe: true,
        type: 'image',
        fileUrl: URL.createObjectURL(file)
      };
      setMessages([...messages, message]);
      toast.success('Image sent successfully');
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleMuteChat = () => {
    setIsMuted(!isMuted);
    toast.success(isMuted ? 'Chat unmuted' : 'Chat muted');
    setShowOptions(false);
  };

  const handleBlockUser = () => {
    toast.success(`${chatInfo.name} has been blocked`);
    setShowOptions(false);
    setTimeout(() => onBack(), 1000);
  };

  const handleDeleteChat = () => {
    toast.success('Chat deleted');
    setShowOptions(false);
    setTimeout(() => onBack(), 1000);
  };

  const handleSearchInChat = () => {
    setShowSearchInChat(true);
    setShowOptions(false);
  };

  const handleCallFromProfile = () => {
    if (chatInfo.isGroup) {
      toast.error('Voice calls are only available for individual chats');
      return;
    }
    setShowProfile(false);
    window.location.href = `tel:${chatInfo.phone}`;
  };

  const handleVideoCallFromProfile = () => {
    if (chatInfo.isGroup) {
      toast.error('Video calls are only available for individual chats');
      return;
    }
    setShowProfile(false);
    handleVideoCall();
  };

  const handleSearchInChatFromProfile = () => {
    setShowProfile(false);
    setShowSearchInChat(true);
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  const currentWallpaper = wallpapers.find(w => w.id === wallpaper) || wallpapers[0];

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-background w-full flex flex-col"
    >
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 flex items-center justify-between p-4 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </Button>
          
          <div 
            className="flex items-center space-x-3 cursor-pointer hover:bg-accent/50 rounded-lg p-2 -ml-2 transition-colors"
            onClick={() => setShowProfile(true)}
          >
            <div className="relative">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {chatInfo.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {chatInfo.isOnline && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-card rounded-full" />
              )}
            </div>
            
            <div>
              <h3 className="text-foreground">{chatInfo.name}</h3>
              <p className="text-xs text-muted-foreground">
                {chatInfo.isOnline ? 'Online' : 'Last seen recently'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {!chatInfo.isGroup && (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-2 hover:bg-accent"
                onClick={handleVoiceCall}
              >
                <Phone className="w-5 h-5 text-foreground" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-2 hover:bg-accent"
                onClick={handleVideoCall}
              >
                <Video className="w-5 h-5 text-foreground" />
              </Button>
            </>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-2 hover:bg-accent"
            onClick={() => setShowOptions(true)}
          >
            <MoreVertical className="w-5 h-5 text-foreground" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${currentWallpaper.gradient}`}>
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[75%] ${message.isMe ? 'items-end' : 'items-start'} flex flex-col`}>
              {!message.isMe && chatInfo.isGroup && (
                <span className="text-xs text-muted-foreground mb-1 ml-3">
                  {message.senderName}
                </span>
              )}
              <div
                className={`rounded-2xl px-4 py-2 ${
                  message.isMe
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border'
                }`}
              >
                {message.type === 'image' && message.fileUrl && (
                  <img 
                    src={message.fileUrl} 
                    alt="Shared image" 
                    className="rounded-lg max-w-full mb-2"
                  />
                )}
                <p className="text-sm">{message.text}</p>
              </div>
              <span className="text-xs text-muted-foreground mt-1 mx-3">
                {formatTimestamp(message.timestamp)}
                {message.isMe && <Check className="w-3 h-3 inline ml-1" />}
              </span>
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input - Fixed at bottom */}
      <div className="sticky bottom-0 border-t border-border bg-card p-4 z-10">
        {/* Emoji Picker */}
        <AnimatePresence>
          {showEmojiPicker && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mb-3 p-3 bg-accent/50 rounded-lg"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Quick Emojis</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowEmojiPicker(false)}
                  className="h-6 w-6 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-8 gap-2">
                {commonEmojis.map((emoji, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleEmojiSelect(emoji)}
                    className="text-2xl hover:scale-125 transition-transform"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSendMessage} className="flex items-end space-x-2">
          <div className="flex space-x-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="flex-shrink-0"
              onClick={handleAttachment}
            >
              <Paperclip className="w-5 h-5 text-muted-foreground" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="flex-shrink-0"
              onClick={handleCameraClick}
            >
              <Camera className="w-5 h-5 text-muted-foreground" />
            </Button>
          </div>
          
          <div className="flex-1 relative">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              placeholder="Type a message..."
              className="pr-12 bg-input-background resize-none min-h-[44px] max-h-[120px]"
              rows={1}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 bottom-2 h-8 w-8"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <Smile className="w-5 h-5 text-muted-foreground" />
            </Button>
          </div>
          
          <Button
            type="submit"
            size="icon"
            className="flex-shrink-0 bg-primary hover:bg-primary/90 h-11 w-11"
            disabled={!newMessage.trim()}
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>

        {/* Hidden file inputs */}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileSelect}
          accept=".pdf,.doc,.docx,.txt"
        />
        <input
          ref={imageInputRef}
          type="file"
          className="hidden"
          onChange={handleImageSelect}
          accept="image/*"
        />
      </div>

      {/* Profile Dialog */}
      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Profile</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            View profile information and contact details
          </DialogDescription>
          <div className="space-y-4 pt-4">
            <div className="flex flex-col items-center space-y-3">
              <Avatar className="w-24 h-24">
                <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                  {chatInfo.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="text-lg text-foreground">{chatInfo.name}</h3>
                {!chatInfo.isGroup && (
                  <>
                    <p className="text-sm text-muted-foreground">Week {chatInfo.pregnancyWeek}</p>
                    <p className="text-sm text-muted-foreground">{chatInfo.location}</p>
                  </>
                )}
              </div>
            </div>
            
            {!chatInfo.isGroup && (
              <div className="space-y-3 pt-4 border-t">
                <div>
                  <p className="text-xs text-muted-foreground">Due Date</p>
                  <p className="text-sm text-foreground">{chatInfo.dueDate}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Bio</p>
                  <p className="text-sm text-foreground">{chatInfo.bio}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm text-foreground">{chatInfo.phone}</p>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-3 gap-2 pt-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex flex-col h-auto py-3"
                onClick={handleCallFromProfile}
                disabled={chatInfo.isGroup}
              >
                <Phone className="w-5 h-5 mb-1" />
                <span className="text-xs">Call</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex flex-col h-auto py-3"
                onClick={handleVideoCallFromProfile}
                disabled={chatInfo.isGroup}
              >
                <Video className="w-5 h-5 mb-1" />
                <span className="text-xs">Video</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex flex-col h-auto py-3"
                onClick={handleSearchInChatFromProfile}
              >
                <Search className="w-5 h-5 mb-1" />
                <span className="text-xs">Search</span>
              </Button>
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
            Manage this conversation and preferences
          </DialogDescription>
          <div className="space-y-2 pt-4">
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              onClick={() => {
                setShowOptions(false);
                setShowProfile(true);
              }}
            >
              <User className="w-4 h-4 mr-3" />
              View profile
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={handleSearchInChat}
            >
              <Search className="w-4 h-4 mr-3" />
              Search in chat
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => {
                setShowOptions(false);
                setShowWallpaperPicker(true);
              }}
            >
              <Wallpaper className="w-4 h-4 mr-3" />
              Change wallpaper
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={handleMuteChat}
            >
              {isMuted ? <Bell className="w-4 h-4 mr-3" /> : <BellOff className="w-4 h-4 mr-3" />}
              {isMuted ? 'Unmute notifications' : 'Mute notifications'}
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => {
                toast.info('Media viewer coming soon');
                setShowOptions(false);
              }}
            >
              <ImageIcon className="w-4 h-4 mr-3" />
              View media
            </Button>
            <div className="border-t pt-2 mt-2">
              {!chatInfo.isGroup && (
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-destructive hover:text-destructive"
                  onClick={handleBlockUser}
                >
                  <Ban className="w-4 h-4 mr-3" />
                  Block user
                </Button>
              )}
              <Button 
                variant="ghost" 
                className="w-full justify-start text-destructive hover:text-destructive"
                onClick={handleDeleteChat}
              >
                <Trash2 className="w-4 h-4 mr-3" />
                Delete chat
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Wallpaper Picker Dialog */}
      <Dialog open={showWallpaperPicker} onOpenChange={setShowWallpaperPicker}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Choose Chat Wallpaper</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Select a background for your chat
          </DialogDescription>
          <div className="grid grid-cols-2 gap-3 pt-4">
            {wallpapers.map((wp) => (
              <button
                key={wp.id}
                onClick={() => {
                  setWallpaper(wp.id);
                  toast.success(`Wallpaper changed to ${wp.name}`);
                  setShowWallpaperPicker(false);
                }}
                className={`relative h-24 rounded-lg border-2 transition-all ${
                  wallpaper === wp.id ? 'border-primary' : 'border-border'
                } ${wp.gradient} hover:scale-105`}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm px-2 py-1 bg-card/80 rounded">
                    {wp.name}
                  </span>
                </div>
                {wallpaper === wp.id && (
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Search in Chat Dialog */}
      <Dialog open={showSearchInChat} onOpenChange={setShowSearchInChat}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Search in Chat</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Find messages in this conversation
          </DialogDescription>
          <div className="space-y-4 pt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search messages..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              {searchQuery.trim() === '' ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Type to search messages
                </p>
              ) : (
                <div className="space-y-2">
                  {messages
                    .filter(m => m.text.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((message) => (
                      <Card 
                        key={message.id} 
                        className="border-border/50 cursor-pointer hover:bg-card/80"
                        onClick={() => {
                          setShowSearchInChat(false);
                          toast.info('Navigated to message');
                        }}
                      >
                        <CardContent className="p-3">
                          <p className="text-xs text-muted-foreground mb-1">{message.senderName}</p>
                          <p className="text-sm">{message.text}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatTimestamp(message.timestamp)}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  {messages.filter(m => m.text.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No messages found
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Voice Call Dialog */}
      <Dialog open={showCallDialog} onOpenChange={setShowCallDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="sr-only">Voice Call</DialogTitle>
          </DialogHeader>
          <DialogDescription className="sr-only">
            Voice call in progress
          </DialogDescription>
          <div className="flex flex-col items-center space-y-6 py-8">
            <Avatar className="w-32 h-32">
              <AvatarFallback className="bg-primary/10 text-primary text-4xl">
                {chatInfo.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h3 className="text-xl text-foreground">{chatInfo.name}</h3>
              <p className="text-muted-foreground mt-2">Calling...</p>
            </div>
            <div className="flex space-x-4 pt-4">
              <Button
                size="lg"
                variant="destructive"
                className="rounded-full w-16 h-16"
                onClick={() => setShowCallDialog(false)}
              >
                <Phone className="w-6 h-6 rotate-135" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Video Call Dialog */}
      <Dialog open={showVideoDialog} onOpenChange={setShowVideoDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="sr-only">Video Call</DialogTitle>
          </DialogHeader>
          <DialogDescription className="sr-only">
            Video call in progress
          </DialogDescription>
          <div className="flex flex-col items-center space-y-6 py-8">
            <Avatar className="w-32 h-32">
              <AvatarFallback className="bg-primary/10 text-primary text-4xl">
                {chatInfo.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h3 className="text-xl text-foreground">{chatInfo.name}</h3>
              <p className="text-muted-foreground mt-2">Starting video call...</p>
            </div>
            <div className="flex space-x-4 pt-4">
              <Button
                size="lg"
                variant="destructive"
                className="rounded-full w-16 h-16"
                onClick={() => setShowVideoDialog(false)}
              >
                <Video className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
