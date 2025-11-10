import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  ArrowLeft,
  Send,
  Mic,
  MicOff,
  Brain,
  Stethoscope,
  Baby,
  Heart,
  Lightbulb,
  AlertTriangle,
  BookOpen,
  Camera,
  Clock,
  Zap,
  Sparkles
} from 'lucide-react';

interface AIPregnancyAssistantProps {
  onBack: () => void;
  userName?: string;
  currentWeek?: number;
}

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  hasImage?: boolean;
  urgency?: 'low' | 'medium' | 'high';
  category?: 'health' | 'nutrition' | 'symptoms' | 'general' | 'emergency';
}

interface AICapability {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  examples: string[];
}

export function AIPregnancyAssistant({ 
  onBack, 
  userName = "Grace", 
  currentWeek = 16 
}: AIPregnancyAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: `Habari ${userName}! I'm your AI pregnancy assistant. I can help answer questions about your pregnancy, analyze symptoms, suggest healthy meals, and provide personalized guidance based on your current stage (Week ${currentWeek}). How can I help you today?`,
      timestamp: new Date(),
      category: 'general'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const aiCapabilities: AICapability[] = [
    {
      id: 'symptoms',
      title: 'Symptom Analysis',
      description: 'Analyze symptoms and provide guidance',
      icon: Stethoscope,
      color: 'bg-red-100 text-red-800',
      examples: ['I have morning sickness', 'My back hurts', 'Feeling dizzy']
    },
    {
      id: 'nutrition',
      title: 'Nutrition Guidance',
      description: 'Personalized meal plans and food advice',
      icon: Heart,
      color: 'bg-green-100 text-green-800',
      examples: ['What should I eat?', 'Foods to avoid?', 'Healthy recipes']
    },
    {
      id: 'development',
      title: 'Baby Development',
      description: 'Track your baby\'s weekly development',
      icon: Baby,
      color: 'bg-blue-100 text-blue-800',
      examples: ['Baby development week 16', 'When will I feel kicks?']
    },
    {
      id: 'wellness',
      title: 'Wellness Tips',
      description: 'Exercise, sleep, and mental health',
      icon: Sparkles,
      color: 'bg-purple-100 text-purple-800',
      examples: ['Safe exercises', 'Sleep better', 'Reduce stress']
    }
  ];

  const quickQuestions = [
    'How is my baby developing this week?',
    'What Kenyan foods are best for pregnancy?',
    'Traditional remedies for morning sickness?',
    'Free antenatal care in Kenya',
    'When should I go to the hospital?',
    'Safe traditional practices during pregnancy',
    'Blending modern and traditional care',
    'Emergency signs I should watch for'
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(content);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): Message => {
    const input = userInput.toLowerCase();
    
    // Enhanced Kenyan cultural knowledge base
    const kenyanKnowledge = {
      traditionalFoods: ['sukuma wiki', 'ugali', 'githeri', 'terere', 'managu', 'kunde', 'mchicha'],
      traditionalMedicine: ['ginger tea', 'lemon grass', 'mint tea', 'honey', 'traditional herbs'],
      culturalPractices: ['postpartum rest', 'community support', 'traditional massage', 'herbal steams'],
      hospitals: ['Kenyatta National Hospital', 'Aga Khan Hospital', 'Nairobi Women\'s Hospital', 'Gertrudes Hospital'],
      emergencyNumbers: ['1190', '0800 720 811']
    };
    
    // Enhanced symptom analysis with Kenyan context
    if (input.includes('nausea') || input.includes('morning sickness')) {
      return {
        id: Date.now().toString(),
        type: 'ai',
        content: `Morning sickness is very common at week ${currentWeek}. Here are proven remedies that work well for Kenyan mothers:\n\n🫖 **Traditional Remedies:**\n• Ginger tea (tangawizi) - boil fresh ginger root\n• Lemon grass tea - helps settle the stomach\n• Mint tea with honey - soothing and natural\n\n🥘 **Foods that Help:**\n• Plain ugali or rice\n• Dry arrowroot biscuits\n• Small portions of githeri\n• Fresh passion fruit juice (diluted)\n\n⚠️ **When to seek help:**\n• Vomiting more than 3 times daily\n• Unable to keep water down\n• Severe dehydration\n• Call your local hospital or 0800 720 811 (free maternal health line)\n\n💡 Many Kenyan mothers find traditional ginger tea works better than modern medications!`,
        timestamp: new Date(),
        suggestions: ['Traditional ginger tea recipe', 'Safe local foods', 'Find nearest clinic'],
        category: 'symptoms',
        urgency: 'medium'
      };
    }

    // Enhanced baby development with cultural context
    if (input.includes('development') || (input.includes('baby') && input.includes('week'))) {
      const developmentStages = {
        16: { size: 'avocado', length: '11cm', features: ['Can hear your voice', 'Moving arms and legs', 'Practicing breathing'] },
        20: { size: 'banana', length: '16cm', features: ['You can feel movements', 'Gender can be determined', 'Hearing is developing'] },
        24: { size: 'corn cob', length: '21cm', features: ['Viable outside womb', 'Brain development rapid', 'Skin is translucent'] },
        28: { size: 'eggplant', length: '25cm', features: ['Eyes can open', 'Can respond to light', 'Regular sleep patterns'] },
        32: { size: 'squash', length: '28cm', features: ['Bones hardening', 'Gaining weight rapidly', 'Practicing breathing'] },
        36: { size: 'papaya', length: '32cm', features: ['Lungs maturing', 'Head down position', 'Ready for birth soon'] }
      };
      
      const currentStage = developmentStages[currentWeek] || developmentStages[16];
      
      return {
        id: Date.now().toString(),
        type: 'ai',
        content: `At week ${currentWeek}, your baby is amazing! Here's what's happening:\n\n🌟 **Size**: About the size of a ${currentStage.size} (${currentStage.length})\n\n**This Week's Milestones:**\n${currentStage.features.map(f => `• ${f}`).join('\n')}\n\n🇰🇪 **Cultural Note**: In Kenyan tradition, this is when many families begin preparing the baby's space and gathering community support. Your baby can now hear traditional songs and your voice!\n\n💝 **Bonding Tips:**\n• Talk or sing to your baby in Kikuyu, Luo, or Swahili\n• Play gentle traditional music\n• Include your partner in conversations with baby\n• Start thinking about your birth plan\n\n⚠️ **Watch for**: Decreased movement, severe cramping, or unusual discharge - call your clinic immediately.`,
        timestamp: new Date(),
        suggestions: ['Traditional songs for baby', 'Birth planning in Kenya', 'Partner involvement tips'],
        category: 'health'
      };
    }

    // Enhanced nutrition with detailed Kenyan foods
    if (input.includes('food') || input.includes('eat') || input.includes('nutrition')) {
      return {
        id: Date.now().toString(),
        type: 'ai',
        content: `Excellent nutrition for week ${currentWeek}! Here's your Kenyan pregnancy guide:\n\n🥬 **Iron-Rich Local Foods (Prevent Anemia):**\n• Sukuma wiki (collard greens) - cook with onions and tomatoes\n• Terere (amaranth) - excellent source of iron\n• Managu (African nightshade) - traditional leafy green\n• Lean nyama (meat) - beef, goat, or chicken\n• Maharagwe (beans) - kidney beans or black beans\n\n🥛 **Calcium for Strong Bones:**\n• Fresh milk from local dairies\n• Mala (cultured milk) - traditional fermented milk\n• Small fish like dagaa\n• Sesame seeds (sim sim)\n\n🌾 **Energy Foods:**\n• Ugali made from fortified flour\n• Sweet potatoes (viazi vitamu)\n• Brown rice or millet porridge\n• Githeri (mixed beans and maize)\n\n🥭 **Local Superfruits:**\n• Mangoes - high in vitamins A & C\n• Passion fruit - folate and vitamin C\n• Baobab fruit powder - incredible nutrition\n• Avocados - healthy fats for baby's brain\n\n⚠️ **Foods to Limit/Avoid:**\n• Raw or undercooked meat\n• Unpasteurized milk products\n• Excessive tea/coffee (limit to 2 cups daily)\n• Alcohol completely\n• Raw fish or shellfish\n\n💊 **Supplements in Kenya:**\n• Iron + Folic acid tablets (free at government clinics)\n• Calcium if milk intake is low\n• Talk to your nurse about what's available locally`,
        timestamp: new Date(),
        suggestions: ['Traditional sukuma wiki recipe', 'Free supplements at clinic', 'Safe fish options in Kenya'],
        category: 'nutrition'
      };
    }

    // Exercise
    if (input.includes('exercise') || input.includes('workout')) {
      return {
        id: Date.now().toString(),
        type: 'ai',
        content: `Safe exercises for week ${currentWeek}:\n\n🚶‍♀️ **Walking**: 30 minutes daily, great for circulation\n🏊‍♀️ **Swimming**: Low-impact, supports your weight\n🧘‍♀️ **Prenatal yoga**: Improves flexibility and relaxation\n💪 **Light strength training**: With doctor approval\n🤰 **Pelvic exercises**: Prepare for delivery\n\n⚠️ **Avoid**: Contact sports, lying flat on back, overheating\n\nAlways listen to your body and stop if you feel dizzy or uncomfortable.`,
        timestamp: new Date(),
        suggestions: ['Prenatal yoga videos', 'Walking routes', 'Pelvic exercises'],
        category: 'health'
      };
    }

    // Emergency detection
    const emergencyKeywords = ['bleeding', 'blood', 'pain', 'dizzy', 'faint', 'headache', 'vomit', 'fever', 'baby not moving', 'no movement'];
    if (emergencyKeywords.some(keyword => input.includes(keyword))) {
      return {
        id: Date.now().toString(),
        type: 'ai',
        content: `⚠️ **This sounds like it might need immediate attention.**\n\n🚨 **Call immediately if you have:**\n• Heavy bleeding (soaking a pad in 1 hour)\n• Severe headache with blurred vision\n• High fever (over 38°C)\n• Severe abdominal pain\n• Baby movements have stopped or decreased significantly\n• Persistent vomiting\n• Dizziness or fainting\n\n📞 **Emergency Contacts:**\n• **1190** - Kenya National Ambulance (FREE)\n• **0800 720 811** - Free Maternal Health Helpline\n• Your nearest hospital: Call ahead if possible\n\n🏥 **Major Nairobi Hospitals:**\n• Kenyatta National Hospital: +254 20 272 6300\n• Aga Khan Hospital: +254 20 366 2000\n• Nairobi Women's Hospital: +254 20 272 0000\n\n💡 **Trust your instincts** - if something feels wrong, seek help immediately. It's better to be safe!`,
        timestamp: new Date(),
        suggestions: ['Call 1190 now', 'Find nearest hospital', 'Emergency transport'],
        category: 'emergency',
        urgency: 'high'
      };
    }

    // Traditional practices and cultural guidance
    if (input.includes('traditional') || input.includes('culture') || input.includes('family')) {
      return {
        id: Date.now().toString(),
        type: 'ai',
        content: `🇰🇪 **Kenyan Pregnancy Traditions & Modern Care**\n\nMany beautiful traditions support pregnancy in Kenya. Here's how to blend traditional wisdom with modern care:\n\n🌿 **Beneficial Traditional Practices:**\n• Community support from other mothers\n• Gentle traditional massage (after 12 weeks)\n• Eating traditional nutritious foods\n• Herbal teas like ginger and lemon grass\n• Rest and reduced heavy work\n\n✅ **Modern Care to Include:**\n• Regular antenatal checkups (free at government clinics)\n• Taking iron and folic acid supplements\n• Vaccinations (tetanus, others as recommended)\n• HIV and other health screenings\n• Planning for skilled birth attendance\n\n🤝 **Combining Both Approaches:**\n• Keep taking traditional nutritious foods\n• Add modern supplements as needed\n• Involve your partner and family in care\n• Plan for delivery at a health facility\n• Continue cultural support systems\n\n👵 **Working with Elders:**\n• Respect traditional advice while prioritizing safety\n• Explain modern care benefits to family\n• Find healthcare providers who respect culture\n• Include traditional supporters in hospital visits\n\nRemember: The best pregnancy care combines the wisdom of our mothers with the safety of modern medicine! 💕`,
        timestamp: new Date(),
        suggestions: ['Traditional foods guide', 'Free antenatal care', 'Cultural birth planning'],
        category: 'general'
      };
    }

    // General response with enhanced cultural awareness
    return {
      id: Date.now().toString(),
      type: 'ai',
      content: `Asante for reaching out! At week ${currentWeek}, I'm here to support you with culturally-aware, evidence-based guidance. I can help with:\n\n🍽️ **Nutrition**: Kenyan foods perfect for pregnancy\n👶 **Baby Development**: What's happening this week\n💊 **Health**: Symptoms, medications, checkups\n🏥 **Healthcare**: Finding services, understanding costs\n🌿 **Traditional Care**: Blending culture with modern medicine\n🚨 **Emergencies**: When to seek immediate help\n\nWhat would you like to know more about? I'm specifically trained on:\n• Kenyan healthcare system\n• Local foods and nutrition\n• Cultural practices and pregnancy\n• Free government services available\n• Traditional remedies (safe ones)\n\nFeel free to ask me anything in English, and I'll provide guidance that respects both traditional wisdom and modern medical knowledge! 🇰🇪💕`,
      timestamp: new Date(),
      suggestions: quickQuestions.slice(0, 3),
      category: 'general'
    };
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    // In real app, would implement speech recognition
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'symptoms': return Stethoscope;
      case 'nutrition': return Heart;
      case 'health': return Baby;
      case 'emergency': return AlertTriangle;
      default: return Brain;
    }
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'symptoms': return 'text-red-600';
      case 'nutrition': return 'text-green-600';
      case 'health': return 'text-blue-600';
      case 'emergency': return 'text-red-800';
      default: return 'text-purple-600';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-background w-full flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-card border-b border-border">
        <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </Button>
        <div className="flex items-center space-x-2">
          <Brain className="w-6 h-6 text-primary" />
          <h1 className="text-lg text-foreground">AI Assistant</h1>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs text-muted-foreground">Online</span>
        </div>
      </div>

      {/* AI Capabilities */}
      <div className="p-4 bg-primary/5 border-b border-border">
        <h3 className="text-sm text-muted-foreground mb-3">I can help with:</h3>
        <div className="grid grid-cols-2 gap-2">
          {aiCapabilities.map((capability) => (
            <div
              key={capability.id}
              className="flex items-center space-x-2 p-2 rounded-lg bg-card border border-border"
            >
              <capability.icon className="w-4 h-4 text-primary" />
              <span className="text-xs text-foreground">{capability.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((message) => {
          const CategoryIcon = getCategoryIcon(message.category);
          
          return (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                {message.type === 'ai' && (
                  <div className="flex items-center space-x-2 mb-2">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        AI
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">SasaMum AI</span>
                    <CategoryIcon className={`w-3 h-3 ${getCategoryColor(message.category)}`} />
                  </div>
                )}
                
                <Card className={`border ${
                  message.type === 'user' 
                    ? 'bg-primary text-primary-foreground border-primary' 
                    : 'bg-card border-border'
                } ${message.urgency === 'high' ? 'border-red-300 bg-red-50' : ''}`}>
                  <CardContent className="p-3">
                    <p className={`text-sm leading-relaxed whitespace-pre-line ${
                      message.type === 'user' ? 'text-primary-foreground' : 'text-foreground'
                    }`}>
                      {message.content}
                    </p>
                    
                    {message.suggestions && (
                      <div className="mt-3 space-y-2">
                        <p className="text-xs text-muted-foreground">Quick follow-ups:</p>
                        {message.suggestions.map((suggestion, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="text-xs h-auto p-2 mr-2"
                            onClick={() => sendMessage(suggestion)}
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">
                        {message.timestamp.toLocaleTimeString('en-KE', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                      {message.urgency === 'high' && (
                        <Badge className="text-xs bg-red-100 text-red-800">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Urgent
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="flex items-center space-x-2">
              <Avatar className="w-6 h-6">
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  AI
                </AvatarFallback>
              </Avatar>
              <Card className="bg-card border-border">
                <CardContent className="p-3">
                  <div className="flex space-x-1">
                    {[0, 1, 2].map((dot) => (
                      <motion.div
                        key={dot}
                        animate={{ y: [0, -5, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: dot * 0.2
                        }}
                        className="w-2 h-2 bg-primary rounded-full"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions */}
      {messages.length === 1 && (
        <div className="p-4 border-t border-border bg-muted/30">
          <h4 className="text-sm text-muted-foreground mb-3">Popular questions:</h4>
          <div className="space-y-2">
            {quickQuestions.slice(0, 3).map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="w-full justify-start text-left text-xs h-auto p-3"
                onClick={() => sendMessage(question)}
              >
                <Lightbulb className="w-3 h-3 mr-2 text-primary" />
                {question}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 bg-card border-t border-border">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask me anything about your pregnancy..."
              className="pr-20"
              onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputText)}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
              <Button
                size="sm"
                variant="ghost"
                className="p-1 h-auto"
                onClick={toggleVoiceInput}
              >
                {isListening ? (
                  <MicOff className="w-4 h-4 text-red-500" />
                ) : (
                  <Mic className="w-4 h-4 text-muted-foreground" />
                )}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="p-1 h-auto"
              >
                <Camera className="w-4 h-4 text-muted-foreground" />
              </Button>
            </div>
          </div>
          <Button
            onClick={() => sendMessage(inputText)}
            disabled={!inputText.trim()}
            className="bg-primary hover:bg-primary/90"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
