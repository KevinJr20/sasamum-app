import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useScrollToTop } from './utils/useScrollToTop';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { toast } from 'sonner@2.0.3';
import { 
  ArrowLeft,
  Camera,
  Grid,
  List,
  Heart,
  MessageCircle,
  Share,
  Calendar,
  MapPin,
  Plus,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Archive,
  X,
  Share2
} from 'lucide-react';

interface PhotoJournalProps {
  onBack: () => void;
  userName?: string;
}

interface PhotoEntry {
  id: string;
  image: string;
  caption: string;
  week: number;
  date: Date;
  location?: string;
  isPublic: boolean;
  likes: number;
  comments: number;
  tags: string[];
}

export function PhotoJournal({ onBack, userName = "Brenda" }: PhotoJournalProps) {
  useScrollToTop();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoEntry | null>(null);
  const [showPhotoDialog, setShowPhotoDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [photos, setPhotos] = useState<PhotoEntry[]>([
    {
      id: '1',
      image: '/api/placeholder/300/300',
      caption: 'First bump photo! So excited to start this journey 💕',
      week: 12,
      date: new Date('2024-09-15'),
      location: 'Nairobi, Kenya',
      isPublic: true,
      likes: 24,
      comments: 8,
      tags: ['first-bump', 'excitement', 'journey-begins']
    },
    {
      id: '2',
      image: '/api/placeholder/300/300',
      caption: 'Baby shower with my SasaMum sisters! So much love and support 🎉',
      week: 24,
      date: new Date('2024-11-02'),
      location: 'Karen, Nairobi',
      isPublic: true,
      likes: 45,
      comments: 12,
      tags: ['baby-shower', 'sasamum-sisters', 'support']
    },
    {
      id: '3',
      image: '/api/placeholder/300/300',
      caption: 'Preparing traditional foods for baby. Mama\'s recipes are the best!',
      week: 28,
      date: new Date('2024-11-20'),
      location: 'Home Kitchen',
      isPublic: false,
      likes: 18,
      comments: 5,
      tags: ['traditional-food', 'preparation', 'heritage']
    },
    {
      id: '4',
      image: '/api/placeholder/300/300',
      caption: 'Hospital bag ready! Can\'t wait to meet our little one 👶',
      week: 36,
      date: new Date('2024-12-08'),
      isPublic: true,
      likes: 32,
      comments: 15,
      tags: ['hospital-bag', 'ready', 'almost-time']
    },
    {
      id: '5',
      image: '/api/placeholder/300/300',
      caption: 'Nursery is finally complete! African-inspired with love ❤️',
      week: 32,
      date: new Date('2024-12-01'),
      isPublic: true,
      likes: 67,
      comments: 23,
      tags: ['nursery', 'african-inspired', 'home-ready']
    },
    {
      id: '6',
      image: '/api/placeholder/300/300',
      caption: 'Sunset walk with baby bump. Feeling grateful for this blessing 🌅',
      week: 20,
      date: new Date('2024-10-18'),
      location: 'Uhuru Park',
      isPublic: true,
      likes: 28,
      comments: 7,
      tags: ['sunset', 'walk', 'gratitude', 'blessing']
    }
  ]);

  const filters = [
    { id: 'all', label: 'All Photos' },
    { id: 'public', label: 'Public' },
    { id: 'private', label: 'Private' },
    { id: 'recent', label: 'Recent' }
  ];

  const handlePhotoClick = (photo: PhotoEntry) => {
    setSelectedPhoto(photo);
    setShowPhotoDialog(true);
  };

  const handleShare = async (photo: PhotoEntry) => {
    const shareText = `${photo.caption}\n\nWeek ${photo.week} of my pregnancy journey 💕\nShared from SasaMum`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Pregnancy Journey',
          text: shareText
        });
        toast.success('Shared successfully! 💕');
      } catch (err) {
        // User cancelled
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(shareText);
      toast.success('Copied to clipboard! Share with your loved ones 💕');
    }
  };

  const handleLike = (photo: PhotoEntry) => {
    setPhotos(photos.map(p => 
      p.id === photo.id 
        ? { ...p, likes: p.likes + 1 }
        : p
    ));
    if (selectedPhoto?.id === photo.id) {
      setSelectedPhoto({ ...photo, likes: photo.likes + 1 });
    }
    toast.success('Liked! ❤️');
  };

  const handleComment = (photo: PhotoEntry) => {
    toast.info('Comment feature - Share your thoughts with the community!');
  };

  const handleEdit = (photo: PhotoEntry) => {
    setSelectedPhoto(photo);
    setShowPhotoDialog(false);
    // In a real app, open edit dialog
    toast.info('Edit functionality - Update caption, tags, privacy settings');
  };

  const handleDelete = (photo: PhotoEntry) => {
    if (window.confirm(`Are you sure you want to delete this photo from Week ${photo.week}?`)) {
      setPhotos(photos.filter(p => p.id !== photo.id));
      toast.success('Photo deleted from journal');
      setShowPhotoDialog(false);
    }
  };

  const handleArchive = (photo: PhotoEntry) => {
    toast.success('Photo archived! Find it in your archived photos.');
    setShowPhotoDialog(false);
  };

  const filteredPhotos = photos.filter(photo => {
    switch (selectedFilter) {
      case 'public':
        return photo.isPublic;
      case 'private':
        return !photo.isPublic;
      case 'recent':
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return photo.date >= oneWeekAgo;
      default:
        return true;
    }
  }).sort((a, b) => b.date.getTime() - a.date.getTime());

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
        <h1 className="text-lg text-foreground">Photo Journal</h1>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="p-2" onClick={() => setShowAddDialog(true)}>
            <Camera className="w-5 h-5 text-foreground" />
          </Button>
          <Button variant="ghost" size="sm" className="p-2">
            <MoreHorizontal className="w-5 h-5 text-foreground" />
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="p-4 bg-card border-b border-border">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg text-foreground">{photos.length}</p>
            <p className="text-xs text-muted-foreground">Photos</p>
          </div>
          <div>
            <p className="text-lg text-foreground">
              {photos.reduce((sum, photo) => sum + photo.likes, 0)}
            </p>
            <p className="text-xs text-muted-foreground">Likes</p>
          </div>
          <div>
            <p className="text-lg text-foreground">36</p>
            <p className="text-xs text-muted-foreground">Weeks</p>
          </div>
        </div>
      </div>

      {/* Filters and View Toggle */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex space-x-2 overflow-x-auto">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${
                  selectedFilter === filter.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-accent'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
          
          <div className="flex items-center space-x-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="p-2"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="p-2"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Photo Grid/List */}
      <div className="pb-20">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 gap-2 p-4 sm:grid-cols-3 md:grid-cols-4">
            {filteredPhotos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="relative aspect-square cursor-pointer"
                onClick={() => handlePhotoClick(photo)}
              >
                <Card className="h-full border-border overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-full">
                    <ImageWithFallback
                      src={photo.image}
                      alt={photo.caption}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-end">
                      <div className="p-3 text-white">
                        <p className="text-xs leading-tight line-clamp-2">
                          {photo.caption}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <div className="flex items-center space-x-1">
                            <Heart className="w-3 h-3" />
                            <span className="text-xs">{photo.likes}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="w-3 h-3" />
                            <span className="text-xs">{photo.comments}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Week Badge */}
                    <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs">
                      Week {photo.week}
                    </Badge>

                    {/* Privacy Badge */}
                    {!photo.isPublic && (
                      <Badge className="absolute top-2 right-2 bg-muted text-muted-foreground text-xs">
                        Private
                      </Badge>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {filteredPhotos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card 
                  className="border-border hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handlePhotoClick(photo)}
                >
                  <CardContent className="p-4">
                    <div className="flex space-x-4">
                      <div className="relative w-20 h-20 flex-shrink-0 sm:w-24 sm:h-24">
                        <ImageWithFallback
                          src={photo.image}
                          alt={photo.caption}
                          className="w-full h-full rounded-lg object-cover"
                        />
                        <Badge className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs">
                          {photo.week}
                        </Badge>
                      </div>
                      
                      <div className="flex-1 space-y-2 min-w-0">
                        <p className="text-sm text-foreground leading-relaxed">
                          {photo.caption}
                        </p>
                        
                        <div className="flex items-center flex-wrap gap-2 text-xs text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{photo.date.toLocaleDateString()}</span>
                          </div>
                          {photo.location && (
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-3 h-3" />
                              <span className="truncate">{photo.location}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {photo.tags.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-1 hover:text-primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLike(photo);
                              }}
                            >
                              <div className="flex items-center space-x-1 text-xs">
                                <Heart className="w-3 h-3" />
                                <span>{photo.likes}</span>
                              </div>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-1 hover:text-primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleComment(photo);
                              }}
                            >
                              <div className="flex items-center space-x-1 text-xs">
                                <MessageCircle className="w-3 h-3" />
                                <span>{photo.comments}</span>
                              </div>
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="p-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleShare(photo);
                              }}
                            >
                              <Share className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* FAB - Add Photo Button */}
        <div className="fixed bottom-24 right-4 z-30">
          <Button 
            className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg"
            onClick={() => setShowAddDialog(true)}
          >
            <Plus className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Photo Detail Dialog */}
      <Dialog open={showPhotoDialog} onOpenChange={setShowPhotoDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Week {selectedPhoto?.week}</DialogTitle>
            <DialogDescription>
              {selectedPhoto?.date.toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          
          {selectedPhoto && (
            <div className="space-y-4">
              <div className="relative aspect-square rounded-lg overflow-hidden">
                <ImageWithFallback
                  src={selectedPhoto.image}
                  alt={selectedPhoto.caption}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="space-y-3">
                <p className="text-sm text-foreground">{selectedPhoto.caption}</p>
                
                {selectedPhoto.location && (
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{selectedPhoto.location}</span>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-2">
                  {selectedPhoto.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center space-x-4 pt-2 border-y border-border py-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLike(selectedPhoto)}
                    className="flex-1 hover:bg-primary/10"
                  >
                    <Heart className="w-4 h-4 text-primary mr-2" />
                    <span className="text-sm">{selectedPhoto.likes} likes</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleComment(selectedPhoto)}
                    className="flex-1 hover:bg-primary/10"
                  >
                    <MessageCircle className="w-4 h-4 text-primary mr-2" />
                    <span className="text-sm">{selectedPhoto.comments} comments</span>
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare(selectedPhoto)}
                    className="w-full"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(selectedPhoto)}
                    className="w-full"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleArchive(selectedPhoto)}
                    className="w-full"
                  >
                    <Archive className="w-4 h-4 mr-2" />
                    Archive
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(selectedPhoto)}
                    className="w-full text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Photo Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Photo</DialogTitle>
            <DialogDescription>
              Capture a moment from your pregnancy journey
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Photo</Label>
              <Button variant="outline" className="w-full h-32 border-dashed">
                <div className="text-center">
                  <Camera className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Click to upload photo</p>
                </div>
              </Button>
            </div>
            
            <div className="space-y-2">
              <Label>Caption</Label>
              <Textarea 
                placeholder="Share your thoughts about this moment..."
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Week</Label>
                <Input type="number" placeholder="Week" />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input placeholder="Optional" />
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <Label className="text-sm">Make public?</Label>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">Private</Button>
                <Button variant="default" size="sm">Public</Button>
              </div>
            </div>
            
            <div className="flex space-x-2 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowAddDialog(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-primary hover:bg-primary/90"
                onClick={() => {
                  toast.success('Photo added to your journey! 📸💕');
                  setShowAddDialog(false);
                }}
              >
                Add Photo
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
