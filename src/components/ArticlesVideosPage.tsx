import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import TopBar from './TopBar';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  ArrowLeft,
  Search,
  ExternalLink,
  Clock,
  Eye,
  Bookmark,
  Share,
  Play,
  Calendar,
  User,
  RefreshCw,
  Star,
  Download
} from 'lucide-react';

interface ArticlesVideosPageProps {
  onBack: () => void;
  userName?: string;
}

interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  publishedAt: string;
  readTime: string;
  category: string;
  isExternal: boolean;
  url?: string;
  imageUrl: string;
  views: number;
  likes: number;
  tags: string[];
}

interface Video {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: string;
  thumbnail: string;
  views: number;
  publishedAt: string;
  author: string;
  isForPregnant: boolean;
  isForPostpartum: boolean;
  url: string;
}

export function ArticlesVideosPage({ onBack, userName = "Brenda" }: ArticlesVideosPageProps) {
  const [activeTab, setActiveTab] = useState<'articles' | 'videos'>('articles');
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Mock function to simulate fetching updated articles
  const fetchLatestContent = async () => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock updated articles with African maternal health focus
    const latestArticles: Article[] = [
      {
        id: '1',
        title: 'Traditional African Remedies for Morning Sickness',
        summary: 'Discover time-tested remedies from across Africa that have helped generations of mothers.',
        content: 'Ginger, lemon grass, and traditional teas...',
        author: 'Dr. Amara Okafor',
        publishedAt: new Date().toISOString(),
        readTime: '6 min',
        category: 'Traditional Medicine',
        isExternal: false,
        imageUrl: '/api/placeholder/300/200',
        views: 1247,
        likes: 89,
        tags: ['morning-sickness', 'natural-remedies', 'african-medicine']
      },
      {
        id: '2',
        title: 'Nutrition During Pregnancy: African Superfoods',
        summary: 'Learn about nutrient-rich indigenous African foods perfect for pregnancy.',
        content: 'Baobab fruit, moringa leaves, and traditional grains...',
        author: 'Nutritionist Sarah Mbeki',
        publishedAt: new Date(Date.now() - 86400000).toISOString(),
        readTime: '8 min',
        category: 'Nutrition',
        isExternal: false,
        imageUrl: '/api/placeholder/300/200',
        views: 2156,
        likes: 134,
        tags: ['nutrition', 'african-foods', 'pregnancy-diet']
      },
      {
        id: '3',
        title: 'WHO Guidelines: Maternal Health in Sub-Saharan Africa',
        summary: 'Latest WHO recommendations specifically for African maternal healthcare.',
        content: 'External content...',
        author: 'World Health Organization',
        publishedAt: new Date(Date.now() - 172800000).toISOString(),
        readTime: '12 min',
        category: 'Medical Guidelines',
        isExternal: true,
        url: 'https://who.int/maternal-health-africa',
        imageUrl: '/api/placeholder/300/200',
        views: 3420,
        likes: 256,
        tags: ['who-guidelines', 'maternal-health', 'africa']
      },
      {
        id: '4',
        title: 'Mental Health Support for African Mothers',
        summary: 'Addressing postpartum depression and anxiety in African communities.',
        content: 'Community support, traditional healing...',
        author: 'Dr. Fatima Hassan',
        publishedAt: new Date(Date.now() - 259200000).toISOString(),
        readTime: '10 min',
        category: 'Mental Health',
        isExternal: false,
        imageUrl: '/api/placeholder/300/200',
        views: 1876,
        likes: 98,
        tags: ['mental-health', 'postpartum', 'community-support']
      }
    ];

    // Mock updated videos
    const latestVideos: Video[] = [
      {
        id: '1',
        title: 'Prenatal Yoga for African Mothers',
        description: 'Gentle yoga exercises adapted for pregnancy, incorporating African dance movements.',
        duration: '25:30',
        category: 'Exercise',
        thumbnail: '/api/placeholder/300/200',
        views: 12540,
        publishedAt: new Date().toISOString(),
        author: 'Mama Zara Fitness',
        isForPregnant: true,
        isForPostpartum: false,
        url: 'https://youtube.com/watch?v=example1'
      },
      {
        id: '2',
        title: 'Breastfeeding Techniques and Tips',
        description: 'Expert guidance on successful breastfeeding from African lactation consultants.',
        duration: '18:45',
        category: 'Breastfeeding',
        thumbnail: '/api/placeholder/300/200',
        views: 8934,
        publishedAt: new Date(Date.now() - 86400000).toISOString(),
        author: 'Dr. Grace Nyong',
        isForPregnant: true,
        isForPostpartum: true,
        url: 'https://youtube.com/watch?v=example2'
      },
      {
        id: '3',
        title: 'African Birth Stories: Strength and Joy',
        description: 'Inspiring birth stories from mothers across Africa sharing their experiences.',
        duration: '32:15',
        category: 'Birth Stories',
        thumbnail: '/api/placeholder/300/200',
        views: 15620,
        publishedAt: new Date(Date.now() - 172800000).toISOString(),
        author: 'Ubuntu Mothers Community',
        isForPregnant: true,
        isForPostpartum: true,
        url: 'https://youtube.com/watch?v=example3'
      },
      {
        id: '4',
        title: 'Postpartum Recovery: African Wisdom',
        description: 'Traditional postpartum care practices and modern medical advice.',
        duration: '22:10',
        category: 'Postpartum',
        thumbnail: '/api/placeholder/300/200',
        views: 6789,
        publishedAt: new Date(Date.now() - 259200000).toISOString(),
        author: 'Mama Adunni',
        isForPregnant: false,
        isForPostpartum: true,
        url: 'https://youtube.com/watch?v=example4'
      },
      {
        id: '5',
        title: 'Baby Development Milestones 0-12 Months',
        description: 'Understanding your baby\'s development with pediatric expert insights.',
        duration: '28:50',
        category: 'Baby Development',
        thumbnail: '/api/placeholder/300/200',
        views: 9876,
        publishedAt: new Date(Date.now() - 345600000).toISOString(),
        author: 'Dr. Kemi Pediatrics',
        isForPregnant: false,
        isForPostpartum: true,
        url: 'https://youtube.com/watch?v=example5'
      }
    ];

    setArticles(latestArticles);
    setVideos(latestVideos);
    setLastUpdated(new Date());
    setIsLoading(false);
  };

  // Auto-update content every 6 hours
  useEffect(() => {
    fetchLatestContent();
    
    const interval = setInterval(fetchLatestContent, 6 * 60 * 60 * 1000); // 6 hours
    return () => clearInterval(interval);
  }, []);

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-background w-full"
    >
      <div className="max-w-7xl mx-auto w-full">{/* Responsive wrapper */}
      {/* Sticky Header */}
      <TopBar
        title="Articles & Videos"
        onBack={onBack}
        right={(
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchLatestContent}
            disabled={isLoading}
            className="p-2"
          >
            <RefreshCw className={`w-5 h-5 text-foreground ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        )}
        sticky
      />

      {/* Search Bar */}
      <div className="p-4 bg-card border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search articles and videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background border-border focus:border-primary"
          />
        </div>
        <div className="mt-2 text-xs text-muted-foreground text-center">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-card border-b border-border">
        <div className="flex">
          {[
            { id: 'articles', label: 'Articles', count: articles.length },
            { id: 'videos', label: 'Videos', count: videos.length }
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
        {/* Articles Tab */}
        {activeTab === 'articles' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredArticles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-border hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Image */}
                      <div className="w-full h-32 bg-muted rounded-lg overflow-hidden">
                        <ImageWithFallback
                          src={article.imageUrl}
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <h3 className="text-foreground leading-tight pr-2 flex-1">
                          {article.title}
                        </h3>
                        {article.isExternal && (
                          <ExternalLink className="w-4 h-4 text-primary flex-shrink-0" />
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {article.summary}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        {article.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      {/* Stats */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{article.readTime}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="w-3 h-3" />
                            <span>{article.views.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3" />
                            <span>{article.likes}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="ghost" className="p-1">
                            <Bookmark className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="p-1">
                            <Share className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="text-xs text-muted-foreground border-t border-border pt-2">
                        By {article.author} • {formatTimeAgo(article.publishedAt)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            </div>{/* Close grid */}
          </motion.div>
        )}

        {/* Videos Tab */}
        {activeTab === 'videos' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVideos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-border hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Thumbnail */}
                      <div className="relative w-full h-32 bg-muted rounded-lg overflow-hidden">
                        <ImageWithFallback
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <Play className="w-8 h-8 text-white" />
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          {video.duration}
                        </div>
                      </div>

                      {/* Video Info */}
                      <div>
                        <h3 className="text-foreground leading-tight">{video.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                          {video.description}
                        </p>
                      </div>

                      {/* Badges */}
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-xs">
                          {video.category}
                        </Badge>
                        {video.isForPregnant && (
                          <Badge className="text-xs bg-primary/10 text-primary">
                            Pregnancy
                          </Badge>
                        )}
                        {video.isForPostpartum && (
                          <Badge className="text-xs bg-green-100 text-green-800">
                            Postpartum
                          </Badge>
                        )}
                      </div>
                      
                      {/* Stats */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1">
                            <Eye className="w-3 h-3" />
                            <span>{video.views.toLocaleString()}</span>
                          </div>
                          <span>•</span>
                          <span>{formatTimeAgo(video.publishedAt)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="ghost" className="p-1">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="p-1">
                            <Share className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="text-xs text-muted-foreground border-t border-border pt-2">
                        By {video.author}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            </div>{/* Close grid */}
          </motion.div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-6 h-6 text-primary animate-spin mr-2" />
            <span className="text-muted-foreground">Updating content...</span>
          </div>
        )}
      </div>
      </div>{/* Close responsive wrapper */}
    </motion.div>
  );
}
