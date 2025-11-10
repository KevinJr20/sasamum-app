import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import {
  X, Bell, AlertTriangle, Calendar, FileText, Send, CheckCircle2,
  Clock, User, MessageCircle
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'urgent' | 'appointment' | 'lab' | 'referral' | 'message' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface ProviderNotificationsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProviderNotifications({ isOpen, onClose }: ProviderNotificationsProps) {
  const [notifications, setNotifications] = React.useState<Notification[]>([
    {
      id: '1',
      type: 'urgent',
      title: 'Urgent Patient Alert',
      message: 'Adhiambo Okello - Severe headache and visual disturbances reported',
      time: '5 minutes ago',
      read: false
    },
    {
      id: '2',
      type: 'appointment',
      title: 'Upcoming Appointment',
      message: 'Achieng Omondi - ANC visit scheduled for tomorrow at 10:00 AM',
      time: '1 hour ago',
      read: false
    },
    {
      id: '3',
      type: 'lab',
      title: 'Lab Results Ready',
      message: 'CBC results available for Awino Otieno',
      time: '2 hours ago',
      read: false
    },
    {
      id: '4',
      type: 'referral',
      title: 'Referral Accepted',
      message: 'Dr. Michael Onyango accepted referral for Adhiambo Okello',
      time: '3 hours ago',
      read: true
    },
    {
      id: '5',
      type: 'message',
      title: 'New Message',
      message: 'Anyango Ouma sent you a message',
      time: '5 hours ago',
      read: true
    },
    {
      id: '6',
      type: 'system',
      title: 'System Update',
      message: 'New features available in the provider portal',
      time: '1 day ago',
      read: true
    }
  ]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'urgent':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'appointment':
        return <Calendar className="w-5 h-5 text-blue-500" />;
      case 'lab':
        return <FileText className="w-5 h-5 text-green-500" />;
      case 'referral':
        return <Send className="w-5 h-5 text-purple-500" />;
      case 'message':
        return <MessageCircle className="w-5 h-5 text-orange-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNotificationBg = (type: string, read: boolean) => {
    if (read) return 'bg-muted/50';
    switch (type) {
      case 'urgent':
        return 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900';
      case 'appointment':
        return 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900';
      case 'lab':
        return 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900';
      case 'referral':
        return 'bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-900';
      default:
        return 'bg-muted';
    }
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 z-50 backdrop-blur-sm"
          />

          {/* Notification Panel */}
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-card border-l border-border shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Bell className="w-5 h-5 text-primary" />
                  <h3 className="text-foreground">Notifications</h3>
                  {unreadCount > 0 && (
                    <Badge className="bg-red-500 text-white">
                      {unreadCount}
                    </Badge>
                  )}
                </div>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  disabled={unreadCount === 0}
                  className="flex-1"
                >
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Mark All Read
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearAll}
                  disabled={notifications.length === 0}
                  className="flex-1"
                >
                  Clear All
                </Button>
              </div>
            </div>

            {/* Notifications List */}
            <ScrollArea className="flex-1">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <Bell className="w-12 h-12 text-muted-foreground mb-3 opacity-50" />
                  <p className="text-muted-foreground">No notifications</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    You're all caught up!
                  </p>
                </div>
              ) : (
                <div className="p-2 space-y-2">
                  {notifications.map((notification) => (
                    <Card
                      key={notification.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${getNotificationBg(notification.type, notification.read)} border`}
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-1">
                              <p className={`text-sm ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                                {notification.title}
                              </p>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 ml-2" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              <span>{notification.time}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
