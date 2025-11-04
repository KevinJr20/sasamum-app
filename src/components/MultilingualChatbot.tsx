import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Send, Bot, User, Languages, Volume2, Mic } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';

interface MultilingualChatbotProps {
  onBack: () => void;
}

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  language: string;
}

export function MultilingualChatbot({ onBack }: MultilingualChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Habari mama! Ninaweza kukusaidia vipi leo?',
      timestamp: new Date(),
      language: 'Kiswahili'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('Kiswahili');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'sw', name: 'Kiswahili' },
    { code: 'luo', name: 'Dholuo' },
    { code: 'ki', name: 'Kikuyu' }
  ];

  const quickReplies = {
    Kiswahili: [
      'Ninaumwa tumbo',
      'Ni lini niende hospitali?',
      'Chakula gani nizile?',
      'Je, mtoto wangu anaendelea vizuri?'
    ],
    English: [
      'I have stomach pain',
      'When should I go to hospital?',
      'What foods should I eat?',
      'Is my baby developing well?'
    ],
    Dholuo: [
      'An gi rem e iya',
      'Adhi e hospital karang\'o?',
      'Chiemo mane anyalo chamo?',
      'Nyathi dongo dhi maber?'
    ],
    Kikuyu: [
      'Ndĩ na ruo nda',
      'Nĩ rĩ nginya thiĩ hithĩini?',
      'Irio cia mũthemba ũrĩkũ nginya rĩe?',
      'Kaana kaguo gatũũra gwega?'
    ]
  };

  const getBotResponse = (userMessage: string, language: string): string => {
    const responses: Record<string, Record<string, string>> = {
      pain: {
        Kiswahili: 'Maumivu ni kawaida wakati wa ujauzito, lakini kama ni makali sana au yanaongezeka, tafadhali wasiliana na daktari wako haraka.',
        English: 'Pain is common during pregnancy, but if it\'s severe or increasing, please contact your doctor immediately.',
        Dholuo: 'Rem en gima kawinja e ndalo mag ich, to ka ochalo ahinya kata medore, luong jagweth piyo.',
        Kikuyu: 'Ruo nĩ ũndũ wa kawaida hĩndĩ ya nda, no rĩngĩkorwo nĩ rũnene mũno kana nĩrũrakũra, geria mũruti wa ũgima o rĩmwe.'
      },
      hospital: {
        Kiswahili: 'Enda hospitali kama una: damu nyingi, maumivu makali, homa, au kama mtoto hakuvunji.',
        English: 'Go to hospital if you have: heavy bleeding, severe pain, fever, or if baby isn\'t moving.',
        Dholuo: 'Dhi e hithĩni ka in gi: remb mangʼeny, rem malit, midhusi, kata ka nyathi ok wuoth.',
        Kikuyu: 'Thiĩ hithĩini ũngĩkorwo ũrĩ na: thakame nyingĩ, rũrĩa rũnene, mbiriru, kana kaana gaku gatikũhĩnjio.'
      },
      food: {
        Kiswahili: 'Kula vyakula vyenye madini: mboga za majani, nyama nyekundu, kunde, na mahindi. Kunywa maji mengi.',
        English: 'Eat iron-rich foods: leafy vegetables, red meat, beans, and fortified cereals. Drink plenty of water.',
        Dholuo: 'Cham chiemo man gi nyinyo: alode, ring, ogunde, gi bel. Math pi mangʼeny.',
        Kikuyu: 'Rĩa irio irĩ na nyinyo: nyeni cia mathagĩĩri, nyama ndune, njahĩ, na ngano irĩ na nyinyo. Nyua maaĩ maingĩ.'
      },
      baby: {
        Kiswahili: 'Mtoto wako anakua vizuri! Utasikia mapatano zaidi sasa. Endelea kula vizuri na kwenda kliniki.',
        English: 'Your baby is developing well! You\'ll feel more movements now. Continue eating well and attending clinic.',
        Dholuo: 'Nyathi dongo dhi maber! Ibiro winjo kaka owuotho mangʼeny sani. Dhi nyime gi chiemo maber gi dhi e klinik.',
        Kikuyu: 'Kaana gaku garakũra wega! Nĩũkona kahĩnjo maingĩ rĩu. Thiiaga na mbere ũkĩrĩa wega na ũgĩthiĩ kĩanĩki.'
      }
    };

    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('pain') || lowerMessage.includes('umwa') || lowerMessage.includes('rem') || lowerMessage.includes('ruo')) {
      return responses.pain[language];
    } else if (lowerMessage.includes('hospital') || lowerMessage.includes('hospitali') || lowerMessage.includes('hithĩni')) {
      return responses.hospital[language];
    } else if (lowerMessage.includes('food') || lowerMessage.includes('chakula') || lowerMessage.includes('chiemo') || lowerMessage.includes('irio')) {
      return responses.food[language];
    } else if (lowerMessage.includes('baby') || lowerMessage.includes('mtoto') || lowerMessage.includes('nyathi') || lowerMessage.includes('kaana')) {
      return responses.baby[language];
    }

    const defaultResponses: Record<string, string> = {
      Kiswahili: 'Asante kwa swali lako. Je, unaweza kunieleza zaidi kuhusu tatizo lako?',
      English: 'Thank you for your question. Can you tell me more about your concern?',
      Dholuo: 'Erokamano kuom penjoni. Bende inyalo nyisa mangʼeny kuom chandruok mari?',
      Kikuyu: 'Nĩngũcookia ngaatho nĩ ũndũ wa kĩuria gĩaku. Wahota kũnjĩĩra ũhoro ũngĩ ũkoniĩ ũrĩa ũrĩ na?'
    };

    return defaultResponses[language] || defaultResponses['English'];
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
      language: selectedLanguage
    };

    setMessages([...messages, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: getBotResponse(inputMessage, selectedLanguage),
        timestamp: new Date(),
        language: selectedLanguage
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickReply = (reply: string) => {
    setInputMessage(reply);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="sticky-header">
        <div className="flex items-center gap-4 p-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl text-foreground">AI Health Assistant</h1>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <p className="text-sm text-muted-foreground">Available 24/7</p>
            </div>
          </div>
          <Bot className="w-6 h-6 text-primary" />
        </div>

        {/* Language Selector */}
        <div className="px-4 pb-3">
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="w-full">
              <div className="flex items-center gap-2">
                <Languages className="w-4 h-4" />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.name}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pt-32 pb-32">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.type === 'bot' && (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
              )}
              <div className={`max-w-[75%] ${message.type === 'user' ? 'order-first' : ''}`}>
                <Card className={message.type === 'user' ? 'bg-primary text-primary-foreground' : ''}>
                  <CardContent className="p-3">
                    <p className="text-sm">{message.content}</p>
                  </CardContent>
                </Card>
                <div className="flex items-center gap-2 mt-1 px-1">
                  <p className="text-xs text-muted-foreground">
                    {message.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  {message.type === 'bot' && (
                    <Button variant="ghost" size="icon" className="w-6 h-6">
                      <Volume2 className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </div>
              {message.type === 'user' && (
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-secondary-foreground" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary" />
            </div>
            <Card>
              <CardContent className="p-3">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-muted-foreground rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{
                        duration: 0.6,
                        delay: i * 0.2,
                        repeat: Infinity
                      }}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      {quickReplies[selectedLanguage as keyof typeof quickReplies] && (
        <div className="px-4 py-2 bg-muted/30 border-t">
          <p className="text-xs text-muted-foreground mb-2">Quick questions:</p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {quickReplies[selectedLanguage as keyof typeof quickReplies].map((reply, index) => (
              <Badge
                key={index}
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors whitespace-nowrap"
                onClick={() => handleQuickReply(reply)}
              >
                {reply}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="sticky bottom-0 p-4 bg-background border-t">
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Mic className="w-5 h-5" />
          </Button>
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={
              selectedLanguage === 'Kiswahili' ? 'Andika ujumbe...' :
              selectedLanguage === 'Dholuo' ? 'Ndik ote...' :
              selectedLanguage === 'Kikuyu' ? 'Andĩka ndũmĩrĩri...' :
              'Type a message...'
            }
            className="flex-1"
          />
          <Button onClick={handleSendMessage} size="icon">
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
