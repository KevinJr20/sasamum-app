import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useScrollToTop } from './utils/useScrollToTop';
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
  Clock,
  ChefHat,
  ExternalLink,
  Bookmark,
  Share,
  Star,
  Users,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface FoodNutritionPageProps {
  onBack: () => void;
  userName?: string;
}

interface FoodItem {
  id: string;
  name: string;
  category: string;
  nutrients: string[];
  benefits: string;
  image: string;
  prepTime: string;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  trimester: number[];
  isAfricanCuisine: boolean;
  recipe?: string;
}

interface Article {
  id: string;
  title: string;
  summary: string;
  readTime: string;
  category: string;
  isExternal: boolean;
  url?: string;
  author: string;
  publishedAt: string;
}

export function FoodNutritionPage({ onBack, userName = "Brenda" }: FoodNutritionPageProps) {
  useScrollToTop();
  const [activeTab, setActiveTab] = useState<'foods' | 'recipes' | 'articles'>('foods');
  const [searchQuery, setSearchQuery] = useState('');

  // Essential pregnancy foods with African focus
  const pregnancyFoods: FoodItem[] = [
    {
      id: '1',
      name: 'Sweet Potatoes',
      category: 'Vegetables',
      nutrients: ['Beta-carotene', 'Folate', 'Potassium', 'Fiber'],
      benefits: 'Rich in beta-carotene for baby\'s development and fiber for healthy digestion',
      image: '/api/placeholder/80/80',
      prepTime: '30 min',
      servings: 4,
      difficulty: 'Easy',
      trimester: [1, 2, 3],
      isAfricanCuisine: true,
      recipe: 'Roasted African sweet potatoes with herbs'
    },
    {
      id: '2',
      name: 'Leafy Greens (Sukuma Wiki)',
      category: 'Vegetables',
      nutrients: ['Folate', 'Iron', 'Calcium', 'Vitamin K'],
      benefits: 'Essential for preventing birth defects and maintaining healthy blood',
      image: '/api/placeholder/80/80',
      prepTime: '15 min',
      servings: 3,
      difficulty: 'Easy',
      trimester: [1, 2, 3],
      isAfricanCuisine: true,
      recipe: 'Traditional sukuma wiki with onions and tomatoes'
    },
    {
      id: '3',
      name: 'Groundnuts (Peanuts)',
      category: 'Proteins',
      nutrients: ['Protein', 'Healthy Fats', 'Niacin', 'Folate'],
      benefits: 'High-quality protein for baby\'s growth and healthy brain development',
      image: '/api/placeholder/80/80',
      prepTime: '10 min',
      servings: 2,
      difficulty: 'Easy',
      trimester: [1, 2, 3],
      isAfricanCuisine: true,
      recipe: 'Groundnut sauce for pregnancy nutrition'
    },
    {
      id: '4',
      name: 'Fish (Tilapia)',
      category: 'Proteins',
      nutrients: ['Omega-3', 'Protein', 'DHA', 'Vitamin D'],
      benefits: 'Crucial for baby\'s brain and eye development',
      image: '/api/placeholder/80/80',
      prepTime: '25 min',
      servings: 2,
      difficulty: 'Medium',
      trimester: [1, 2, 3],
      isAfricanCuisine: true,
      recipe: 'Grilled tilapia with African spices'
    },
    {
      id: '5',
      name: 'Millet Porridge',
      category: 'Grains',
      nutrients: ['Iron', 'Magnesium', 'Fiber', 'B-vitamins'],
      benefits: 'Provides sustained energy and helps prevent anemia',
      image: '/api/placeholder/80/80',
      prepTime: '20 min',
      servings: 3,
      difficulty: 'Easy',
      trimester: [1, 2, 3],
      isAfricanCuisine: true,
      recipe: 'Traditional millet porridge with groundnuts'
    },
    {
      id: '6',
      name: 'Avocados',
      category: 'Fruits',
      nutrients: ['Healthy Fats', 'Folate', 'Potassium', 'Vitamin E'],
      benefits: 'Supports baby\'s brain development and prevents birth defects',
      image: '/api/placeholder/80/80',
      prepTime: '5 min',
      servings: 1,
      difficulty: 'Easy',
      trimester: [1, 2, 3],
      isAfricanCuisine: false,
      recipe: 'Avocado smoothie with African fruits'
    }
  ];

  // Nutrition articles and external resources
  const nutritionArticles: Article[] = [
    {
      id: '1',
      title: 'Traditional African Foods for a Healthy Pregnancy',
      summary: 'Discover the nutritional power of indigenous African foods during pregnancy',
      readTime: '8 min',
      category: 'Traditional Nutrition',
      isExternal: false,
      author: 'Dr. Amina Hassan',
      publishedAt: '2 days ago'
    },
    {
      id: '2',
      title: 'Managing Morning Sickness with African Remedies',
      summary: 'Natural remedies passed down through generations to ease pregnancy symptoms',
      readTime: '6 min',
      category: 'Natural Remedies',
      isExternal: false,
      author: 'Mama Grace Ochieng',
      publishedAt: '1 week ago'
    },
    {
      id: '3',
      title: 'WHO Guidelines: Nutrition During Pregnancy',
      summary: 'Official guidelines from the World Health Organization',
      readTime: '12 min',
      category: 'Medical Guidelines',
      isExternal: true,
      url: 'https://who.int/nutrition/pregnancy',
      author: 'World Health Organization',
      publishedAt: '1 month ago'
    },
    {
      id: '4',
      title: 'Iron-Rich Foods for Preventing Anemia',
      summary: 'Combat pregnancy anemia with culturally appropriate foods',
      readTime: '7 min',
      category: 'Health',
      isExternal: false,
      author: 'Dr. Fatima Mbeki',
      publishedAt: '3 days ago'
    }
  ];

  const filteredFoods = pregnancyFoods.filter(food =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    food.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    food.nutrients.some(nutrient => 
      nutrient.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const filteredArticles = nutritionArticles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <div className="sticky top-0 z-40 flex items-center justify-between p-4 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
        <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </Button>
        <h1 className="text-lg text-foreground">Nutrition & Food</h1>
        <Button variant="ghost" size="sm" className="p-2">
          <Bookmark className="w-6 h-6 text-foreground" />
        </Button>
      </div>

      {/* Search Bar */}
      <div className="p-4 bg-card border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search foods, recipes, or articles..."
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
            { id: 'foods', label: 'Essential Foods' },
            { id: 'recipes', label: 'Recipes' },
            { id: 'articles', label: 'Articles' }
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
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="pb-20">
        {/* Essential Foods Tab */}
        {activeTab === 'foods' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFoods.map((food, index) => (
              <motion.div
                key={food.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-border hover:shadow-md transition-shadow h-full">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <ImageWithFallback
                        src={food.image}
                        alt={food.name}
                        className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                      />
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-foreground">{food.name}</h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {food.category}
                              </Badge>
                              {food.isAfricanCuisine && (
                                <Badge className="text-xs bg-green-100 text-green-800">
                                  African
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Heart className="w-5 h-5 text-muted-foreground" />
                        </div>
                        
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {food.benefits}
                        </p>
                        
                        <div className="flex flex-wrap gap-1">
                          {food.nutrients.slice(0, 3).map((nutrient) => (
                            <span
                              key={nutrient}
                              className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                            >
                              {nutrient}
                            </span>
                          ))}
                          {food.nutrients.length > 3 && (
                            <span className="text-xs text-muted-foreground">
                              +{food.nutrients.length - 3} more
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{food.prepTime}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="w-3 h-3" />
                              <span>{food.servings} servings</span>
                            </div>
                          </div>
                          <Button size="sm" variant="outline" className="text-xs">
                            View Recipe
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            </div>{/* Close grid */}
          </motion.div>
        )}

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
                      <div className="flex items-start justify-between">
                        <h3 className="text-foreground leading-tight pr-2">
                          {article.title}
                        </h3>
                        {article.isExternal && (
                          <ExternalLink className="w-4 h-4 text-primary flex-shrink-0" />
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {article.summary}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Badge variant="outline" className="text-xs">
                            {article.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {article.readTime} read
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="ghost" className="p-1">
                            <Share className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="p-1">
                            <Bookmark className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="text-xs text-muted-foreground border-t border-border pt-2">
                        By {article.author} • {article.publishedAt}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            </div>{/* Close grid */}
          </motion.div>
        )}

        {/* Quick Tips Section */}
        <div className="p-4 bg-muted/50">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-3">
              <h4 className="text-foreground flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-primary" />
                <span>Daily Nutrition Tips</span>
              </h4>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  Eat at least 5 servings of fruits and vegetables daily
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  Include iron-rich foods like sukuma wiki and groundnuts
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  Stay hydrated with at least 8 glasses of water daily
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>{/* Close responsive wrapper */}
    </motion.div>
  );
}