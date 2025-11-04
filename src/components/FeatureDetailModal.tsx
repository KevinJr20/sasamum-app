import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { X, Clock } from 'lucide-react';
import { FeatureCardData } from './PregnancyData';

interface FeatureDetailModalProps {
  feature: FeatureCardData | null;
  isOpen: boolean;
  onClose: () => void;
}

export function FeatureDetailModal({ feature, isOpen, onClose }: FeatureDetailModalProps) {
  if (!feature) return null;

  const featureContent = {
    medicines: {
      items: [
        { name: "Folic Acid", dosage: "400mcg daily", time: "Morning", status: "taken" },
        { name: "Iron Supplement", dosage: "27mg daily", time: "Afternoon", status: "pending" },
        { name: "Calcium", dosage: "1000mg daily", time: "Evening", status: "pending" },
        { name: "Vitamin D", dosage: "600 IU daily", time: "Morning", status: "taken" }
      ],
      tips: [
        "Take iron supplements with vitamin C for better absorption",
        "Don't take calcium and iron supplements together",
        "Always consult your doctor before starting new supplements"
      ]
    },
    exercises: {
      items: [
        { name: "Prenatal Yoga", duration: "20 min", difficulty: "Beginner", category: "Flexibility" },
        { name: "Walking", duration: "30 min", difficulty: "Easy", category: "Cardio" },
        { name: "Swimming", duration: "25 min", difficulty: "Moderate", category: "Full Body" },
        { name: "Pelvic Floor Exercises", duration: "10 min", difficulty: "Easy", category: "Strength" }
      ],
      tips: [
        "Listen to your body and don't overexert",
        "Stay hydrated during workouts",
        "Avoid exercises lying flat on your back after first trimester"
      ]
    },
    articles: {
      items: [
        { title: "Week 16: Your Baby's Development", readTime: "5 min", category: "Development" },
        { title: "Managing Morning Sickness", readTime: "3 min", category: "Symptoms" },
        { title: "Preparing for Your Anatomy Scan", readTime: "7 min", category: "Appointments" },
        { title: "Nutrition in Second Trimester", readTime: "6 min", category: "Nutrition" }
      ],
      tips: [
        "Stay informed but don't overwhelm yourself",
        "Discuss any concerns with your healthcare provider",
        "Join pregnancy communities for support"
      ]
    },
    food: {
      items: [
        { name: "African Sweet Potato Stew", nutrients: "Iron, Folate", servings: "4", prep: "30 min" },
        { name: "Quinoa Spinach Salad", nutrients: "Protein, Calcium", servings: "2", prep: "15 min" },
        { name: "Grilled Salmon & Vegetables", nutrients: "Omega-3, DHA", servings: "2", prep: "25 min" },
        { name: "Banana Oat Smoothie", nutrients: "Potassium, Fiber", servings: "1", prep: "5 min" }
      ],
      tips: [
        "Eat small, frequent meals to avoid nausea",
        "Include colorful fruits and vegetables",
        "Stay hydrated with plenty of water"
      ]
    }
  };

  const currentContent = featureContent[feature.id as keyof typeof featureContent];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end max-w-sm mx-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-full bg-background rounded-t-3xl max-h-[85vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="h-full border-none shadow-none">
              <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/50">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${feature.bgColor} rounded-xl flex items-center justify-center`}>
                    <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="text-lg text-foreground">{feature.title}</h3>
                    {feature.comingSoon && (
                      <Badge variant="secondary" className="text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        Coming Soon
                      </Badge>
                    )}
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={onClose} className="p-2">
                  <X className="w-5 h-5" />
                </Button>
              </CardHeader>

              <CardContent className="p-0 overflow-y-auto max-h-[calc(85vh-120px)]">
                <div className="p-6 space-y-6">
                  <p className="text-muted-foreground">{feature.description}</p>

                  {feature.comingSoon ? (
                    <div className="text-center py-12 space-y-4">
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                        <Clock className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-foreground">Coming Soon!</h4>
                        <p className="text-sm text-muted-foreground">
                          We're working hard to bring you this feature. Stay tuned for updates!
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Notify Me When Ready
                      </Button>
                    </div>
                  ) : currentContent ? (
                    <>
                      <div className="space-y-4">
                        <h4 className="text-foreground">
                          {feature.id === 'medicines' ? 'Your Daily Supplements' :
                           feature.id === 'exercises' ? 'Recommended Exercises' :
                           feature.id === 'articles' ? 'Latest Articles' :
                           'Nutritious Recipes'}
                        </h4>
                        <div className="space-y-3">
                          {currentContent.items.map((item, index) => (
                            <Card key={index} className="border-border/50 hover:shadow-sm transition-shadow">
                              <CardContent className="p-4">
                                {feature.id === 'medicines' && (
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="text-foreground">{item.name}</p>
                                      <p className="text-sm text-muted-foreground">
                                        {item.dosage} • {item.time}
                                      </p>
                                    </div>
                                    <div className={`w-3 h-3 rounded-full ${
                                      item.status === 'taken' ? 'bg-green-500' : 'bg-orange-500'
                                    }`} />
                                  </div>
                                )}
                                
                                {feature.id === 'exercises' && (
                                  <div>
                                    <div className="flex justify-between items-start mb-2">
                                      <p className="text-foreground">{item.name}</p>
                                      <Badge variant="outline" className="text-xs">
                                        {item.difficulty}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                      {item.duration} • {item.category}
                                    </p>
                                  </div>
                                )}

                                {feature.id === 'articles' && (
                                  <div>
                                    <p className="text-foreground mb-1">{item.title}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {item.readTime} read • {item.category}
                                    </p>
                                  </div>
                                )}

                                {feature.id === 'food' && (
                                  <div>
                                    <p className="text-foreground mb-1">{item.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                      Rich in {item.nutrients} • Serves {item.servings} • {item.prep}
                                    </p>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-foreground">Tips for You</h4>
                        <div className="space-y-2">
                          {currentContent.tips.map((tip, index) => (
                            <div key={index} className="flex items-start space-x-3">
                              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                              <p className="text-sm text-muted-foreground leading-relaxed">{tip}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}