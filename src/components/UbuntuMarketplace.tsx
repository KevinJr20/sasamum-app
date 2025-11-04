import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  ArrowLeft,
  Search,
  Heart,
  MapPin,
  Clock,
  DollarSign,
  Gift,
  Users,
  Star,
  MessageCircle,
  Share,
  Filter,
  Plus
} from 'lucide-react';

interface UbuntuMarketplaceProps {
  onBack: () => void;
  userName?: string;
}

interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  price: number;
  type: 'sell' | 'donate' | 'request' | 'service';
  category: string;
  condition: 'new' | 'like-new' | 'good' | 'fair';
  images: string[];
  seller: {
    name: string;
    avatar: string;
    rating: number;
    location: string;
    isVerified: boolean;
  };
  postedAt: Date;
  status: 'available' | 'reserved' | 'sold';
  likes: number;
  isUrgent?: boolean;
}

interface BuyingCircle {
  id: string;
  name: string;
  description: string;
  targetAmount: number;
  currentMembers: number;
  maxMembers: number;
  savings: number;
  nextPurchase: string;
  organizer: string;
}

export function UbuntuMarketplace({ onBack, userName = "Brenda" }: UbuntuMarketplaceProps) {
  const [activeTab, setActiveTab] = useState<'marketplace' | 'circles' | 'support'>('marketplace');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Mock marketplace items
  const marketplaceItems: MarketplaceItem[] = [
    {
      id: '1',
      title: 'Baby Crib - Excellent Condition',
      description: 'Beautiful wooden baby crib, barely used. Perfect for newborn to 2 years.',
      price: 15000,
      type: 'sell',
      category: 'Furniture',
      condition: 'like-new',
      images: ['/api/placeholder/200/200'],
      seller: {
        name: 'Mama Sarah',
        avatar: '/api/placeholder/40/40',
        rating: 4.8,
        location: 'Westlands, Nairobi',
        isVerified: true
      },
      postedAt: new Date('2024-12-10'),
      status: 'available',
      likes: 12
    },
    {
      id: '2',
      title: 'Maternity Clothes Bundle',
      description: 'Size M maternity clothes - dresses, tops, pants. All in great condition!',
      price: 0,
      type: 'donate',
      category: 'Clothing',
      condition: 'good',
      images: ['/api/placeholder/200/200'],
      seller: {
        name: 'Grace Wanjiku',
        avatar: '/api/placeholder/40/40',
        rating: 4.9,
        location: 'Kileleshwa, Nairobi',
        isVerified: true
      },
      postedAt: new Date('2024-12-08'),
      status: 'available',
      likes: 25,
      isUrgent: false
    },
    {
      id: '3',
      title: 'Urgent: Baby Formula & Diapers',
      description: 'New mother in need of formula and diapers. Any help appreciated. 🙏',
      price: 0,
      type: 'request',
      category: 'Essentials',
      condition: 'new',
      images: [],
      seller: {
        name: 'Mercy Akinyi',
        avatar: '/api/placeholder/40/40',
        rating: 4.7,
        location: 'Kayole, Nairobi',
        isVerified: true
      },
      postedAt: new Date('2024-12-12'),
      status: 'available',
      likes: 8,
      isUrgent: true
    },
    {
      id: '4',
      title: 'Lactation Consultant Services',
      description: 'Certified lactation consultant offering home visits and virtual consultations.',
      price: 3000,
      type: 'service',
      category: 'Health Services',
      condition: 'new',
      images: ['/api/placeholder/200/200'],
      seller: {
        name: 'Dr. Amina Hassan',
        avatar: '/api/placeholder/40/40',
        rating: 5.0,
        location: 'Karen, Nairobi',
        isVerified: true
      },
      postedAt: new Date('2024-12-05'),
      status: 'available',
      likes: 18
    }
  ];

  // Mock buying circles
  const buyingCircles: BuyingCircle[] = [
    {
      id: '1',
      name: 'Organic Baby Food Circle',
      description: 'Bulk buying organic baby food to get better prices for our little ones',
      targetAmount: 50000,
      currentMembers: 8,
      maxMembers: 15,
      savings: 25,
      nextPurchase: 'Dec 20, 2024',
      organizer: 'Mama Jennifer'
    },
    {
      id: '2',
      name: 'Cloth Diaper Collective',
      description: 'Eco-friendly moms buying cloth diapers in bulk for sustainability and savings',
      targetAmount: 75000,
      currentMembers: 12,
      maxMembers: 20,
      savings: 30,
      nextPurchase: 'Jan 5, 2025',
      organizer: 'Susan Njeri'
    },
    {
      id: '3',
      name: 'Educational Toys Group',
      description: 'Investing in quality educational toys through group purchasing',
      targetAmount: 40000,
      currentMembers: 6,
      maxMembers: 12,
      savings: 20,
      nextPurchase: 'Dec 25, 2024',
      organizer: 'Mama Ruth'
    }
  ];

  const categories = ['all', 'Furniture', 'Clothing', 'Essentials', 'Toys', 'Health Services', 'Education'];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'sell': return 'bg-blue-100 text-blue-800';
      case 'donate': return 'bg-green-100 text-green-800';
      case 'request': return 'bg-orange-100 text-orange-800';
      case 'service': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredItems = marketplaceItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
        <h1 className="text-lg text-foreground">Toto's Marketplace</h1>
        <Button variant="ghost" size="sm" className="p-2">
          <Plus className="w-6 h-6 text-foreground" />
        </Button>
      </div>

      {/* Sticky Tabs */}
      <div className="sticky top-[73px] z-30 bg-card border-b border-border">
        <div className="flex">
          {[
            { id: 'marketplace', label: 'Marketplace', icon: Heart },
            { id: 'circles', label: 'Buying Circles', icon: Users },
            { id: 'support', label: 'Support Fund', icon: Gift }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-4 px-2 flex items-center justify-center space-x-2 text-sm transition-colors ${
                activeTab === tab.id
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="pb-20">
        {/* Marketplace Tab */}
        {activeTab === 'marketplace' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Search and Filter */}
            <div className="p-4 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background border-border focus:border-primary"
                />
              </div>
              
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${
                      selectedCategory === category
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-accent'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Marketplace Items */}
            <div className="px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map((item) => (
                <Card key={item.id} className="border-border hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-start space-x-2 mb-2">
                            <h3 className="text-foreground leading-tight flex-1">{item.title}</h3>
                            {item.isUrgent && (
                              <Badge className="bg-red-100 text-red-800 text-xs">Urgent</Badge>
                            )}
                          </div>
                          <Badge className={`text-xs ${getTypeColor(item.type)}`}>
                            {item.type === 'sell' ? 'For Sale' :
                             item.type === 'donate' ? 'Free' :
                             item.type === 'request' ? 'Needed' : 'Service'}
                          </Badge>
                        </div>
                        <Button variant="ghost" size="sm" className="p-1">
                          <Heart className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Images */}
                      {item.images.length > 0 && (
                        <div className="w-full h-40 bg-muted rounded-lg overflow-hidden">
                          <ImageWithFallback
                            src={item.images[0]}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      {/* Description */}
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>

                      {/* Price */}
                      {item.type !== 'request' && (
                        <div className="flex items-center space-x-2">
                          {item.price > 0 ? (
                            <>
                              <DollarSign className="w-4 h-4 text-primary" />
                              <span className="text-lg text-foreground">
                                KSh {item.price.toLocaleString()}
                              </span>
                            </>
                          ) : (
                            <span className="text-lg text-green-600">FREE</span>
                          )}
                        </div>
                      )}

                      {/* Seller Info */}
                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {item.seller.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center space-x-1">
                              <p className="text-sm text-foreground">{item.seller.name}</p>
                              {item.seller.isVerified && (
                                <div className="w-3 h-3 bg-green-500 rounded-full" />
                              )}
                            </div>
                            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                              <MapPin className="w-3 h-3" />
                              <span>{item.seller.location}</span>
                              <div className="flex items-center space-x-1">
                                <Star className="w-3 h-3 fill-current text-yellow-500" />
                                <span>{item.seller.rating}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <Button size="sm" variant="outline" className="p-2">
                            <MessageCircle className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="p-2">
                            <Share className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Action Button */}
                      <Button className="w-full bg-primary hover:bg-primary/90">
                        {item.type === 'sell' ? 'Contact Seller' :
                         item.type === 'donate' ? 'Request Item' :
                         item.type === 'request' ? 'Offer Help' : 'Book Service'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* Buying Circles Tab */}
        {activeTab === 'circles' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 space-y-4"
          >
            <div className="text-center space-y-2 mb-6">
              <h3 className="text-foreground">Join a Buying Circle</h3>
              <p className="text-sm text-muted-foreground">
                Pool resources with other mothers for bulk buying discounts
              </p>
            </div>

            {buyingCircles.map((circle) => (
              <Card key={circle.id} className="border-border">
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-foreground">{circle.name}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {circle.description}
                        </p>
                      </div>
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        {circle.savings}% savings
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Members</span>
                        <span className="text-foreground">
                          {circle.currentMembers}/{circle.maxMembers}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${(circle.currentMembers / circle.maxMembers) * 100}%` 
                          }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Target Amount</p>
                        <p className="text-foreground">KSh {circle.targetAmount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Next Purchase</p>
                        <p className="text-foreground">{circle.nextPurchase}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <div className="text-xs text-muted-foreground">
                        Organized by {circle.organizer}
                      </div>
                      <Button size="sm" className="bg-primary hover:bg-primary/90">
                        Join Circle
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        )}

        {/* Support Fund Tab */}
        {activeTab === 'support' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 space-y-4"
          >
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="pb-3">
                <h4 className="text-foreground flex items-center space-x-2">
                  <Gift className="w-5 h-5 text-primary" />
                  <span>Ubuntu Support Fund</span>
                </h4>
                <p className="text-sm text-muted-foreground">
                  Community fund to support mothers in need
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-2xl text-foreground">KSh 247,830</p>
                  <p className="text-sm text-muted-foreground">Available for emergency support</p>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button className="bg-primary hover:bg-primary/90">
                    Donate
                  </Button>
                  <Button variant="outline" className="border-primary text-primary">
                    Request Help
                  </Button>
                </div>
                
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">
                    This month: 23 mothers helped • 156 donations received
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <h4 className="text-foreground">Recent Support Stories</h4>
              
              <Card className="border-border">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-sm text-foreground">Emergency support provided</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      "Thanks to the Ubuntu fund, I was able to get emergency formula for my baby 
                      when I couldn't breastfeed. The sisterhood saved us!" - Anonymous
                    </p>
                    <div className="text-xs text-muted-foreground">2 days ago</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span className="text-sm text-foreground">Baby clothes donated</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      "Received beautiful baby clothes through the marketplace. 
                      The generosity of our sisters is overwhelming!" - Mary K.
                    </p>
                    <div className="text-xs text-muted-foreground">1 week ago</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}