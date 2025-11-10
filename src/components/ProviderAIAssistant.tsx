import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { toast } from 'sonner@2.0.3';
import {
  Brain, Send, AlertTriangle, CheckCircle2, Info, Lightbulb,
  FileText, Pill, Activity, TrendingUp, Shield, BookOpen,
  X, Sparkles, MessageCircle, ChevronDown, ChevronUp
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  clinicalGuidance?: ClinicalGuidance;
}

interface ClinicalGuidance {
  condition: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  recommendations: string[];
  medications?: string[];
  tests?: string[];
  referral?: string;
  guidelines?: string;
}

interface ProviderAIAssistantProps {
  patientData?: any;
  onClose?: () => void;
}

export function ProviderAIAssistant({ patientData, onClose }: ProviderAIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: `Hello! I'm your AI Clinical Decision Support Assistant. I can help you with:

• Evidence-based treatment recommendations
• Medication dosage calculations
• Risk assessment and stratification
• WHO/ACOG guideline references
• Differential diagnosis support
• Lab result interpretation

How can I assist you today?`,
      timestamp: new Date(),
      suggestions: [
        'Analyze patient vitals',
        'Pre-eclampsia risk assessment',
        'Anemia management',
        'Gestational diabetes screening'
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [expandedMessages, setExpandedMessages] = useState<Set<string>>(new Set());

  const quickQueries = [
    { icon: Activity, label: 'Vital Signs Analysis', query: 'Analyze current vital signs' },
    { icon: Pill, label: 'Medication Review', query: 'Review current medications' },
    { icon: AlertTriangle, label: 'Risk Assessment', query: 'Assess pregnancy risks' },
    { icon: FileText, label: 'Treatment Plan', query: 'Suggest treatment plan' },
    { icon: TrendingUp, label: 'Trend Analysis', query: 'Analyze patient trends' },
    { icon: BookOpen, label: 'Guidelines', query: 'Show WHO guidelines' }
  ];

  const toggleMessageExpansion = (messageId: string) => {
    const newExpanded = new Set(expandedMessages);
    if (newExpanded.has(messageId)) {
      newExpanded.delete(messageId);
    } else {
      newExpanded.add(messageId);
    }
    setExpandedMessages(newExpanded);
  };

  const generateAIResponse = (query: string): Message => {
    const lowerQuery = query.toLowerCase();
    
    // Pre-eclampsia assessment
    if (lowerQuery.includes('pre-eclampsia') || lowerQuery.includes('preeclampsia') || lowerQuery.includes('blood pressure')) {
      return {
        id: Date.now().toString(),
        type: 'ai',
        content: 'Based on the clinical data, here\'s my assessment for pre-eclampsia risk:',
        timestamp: new Date(),
        clinicalGuidance: {
          condition: 'Pre-eclampsia Risk Assessment',
          severity: 'high',
          recommendations: [
            'Immediate blood pressure monitoring (target <140/90 mmHg)',
            ' 24-hour urine protein collection',
            'Weekly fetal monitoring (NST and biophysical profile)',
            'Patient education on warning signs (severe headache, visual changes, epigastric pain)',
            'Consider hospitalization if BP ≥160/110 or symptoms worsen'
          ],
          medications: [
            'Methyldopa 250mg PO BID (first-line antihypertensive)',
            'Labetalol 100-200mg PO BID (alternative)',
            'Low-dose Aspirin 75mg daily (if <16 weeks)',
            'Magnesium Sulfate 4-6g IV loading dose for seizure prophylaxis if severe'
          ],
          tests: [
            'Complete Blood Count (CBC)',
            'Liver Function Tests (AST, ALT)',
            'Serum Creatinine',
            'Platelet count',
            'Uric acid levels',
            'Fetal ultrasound for growth assessment'
          ],
          referral: 'Consider maternal-fetal medicine specialist referral for severe features or early-onset (<34 weeks)',
          guidelines: 'WHO Guidelines: Hypertensive Disorders in Pregnancy (2011) | ACOG Practice Bulletin No. 222'
        },
        suggestions: [
          'Calculate delivery timing',
          'Review magnesium sulfate protocol',
          'Assess for HELLP syndrome'
        ]
      };
    }

    // Anemia management
    if (lowerQuery.includes('anemia') || lowerQuery.includes('hemoglobin') || lowerQuery.includes('iron')) {
      return {
        id: Date.now().toString(),
        type: 'ai',
        content: 'Anemia management recommendations based on current guidelines:',
        timestamp: new Date(),
        clinicalGuidance: {
          condition: 'Anemia in Pregnancy',
          severity: 'medium',
          recommendations: [
            'Determine severity: Mild (10-10.9 g/dL), Moderate (7-9.9 g/dL), Severe (<7 g/dL)',
            'Investigate cause: Iron deficiency vs. other causes',
            'Dietary counseling: Iron-rich foods (red meat, beans, dark leafy greens)',
            'Vitamin C co-administration to enhance iron absorption',
            'Monitor hemoglobin every 2-4 weeks after starting treatment'
          ],
          medications: [
            'Oral Iron: Ferrous sulfate 65mg elemental iron daily (or BID)',
            'Folic Acid: 400-800mcg daily (continue throughout pregnancy)',
            'IV Iron: Consider if Hb <9 g/dL and oral intolerance or non-response',
            'Blood transfusion: Only if Hb <7 g/dL or symptomatic severe anemia'
          ],
          tests: [
            'Complete Blood Count (CBC) with indices',
            'Serum ferritin',
            'Peripheral blood smear',
            'Stool for occult blood (if appropriate)',
            'Hemoglobin electrophoresis (if suspected hemoglobinopathy)'
          ],
          guidelines: 'WHO: Haemoglobin concentrations for the diagnosis of anaemia (2011)'
        },
        suggestions: [
          'Calculate iron dosage',
          'Review side effects management',
          'Assess for IV iron candidacy'
        ]
      };
    }

    // Vital signs analysis
    if (lowerQuery.includes('vital') || lowerQuery.includes('analyze')) {
      const bp = patientData?.bloodPressure || '120/80';
      const [systolic, diastolic] = bp.split('/').map(Number);
      const weight = patientData?.weight || 65;
      const hgb = parseFloat(patientData?.hemoglobin || '12.0');
      
      let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';
      let findings: string[] = [];
      
      if (systolic >= 160 || diastolic >= 110) {
        severity = 'critical';
        findings.push(`⚠️ SEVERE HYPERTENSION: BP ${bp} requires immediate intervention`);
      } else if (systolic >= 140 || diastolic >= 90) {
        severity = 'high';
        findings.push(`⚠️ Hypertension: BP ${bp} - Monitor closely`);
      } else {
        findings.push(`✓ Blood pressure within normal range: ${bp}`);
      }
      
      if (hgb < 9) {
        severity = severity === 'critical' ? 'critical' : 'high';
        findings.push(`⚠️ SEVERE ANEMIA: Hgb ${hgb} g/dL - Consider IV iron or transfusion`);
      } else if (hgb < 11) {
        severity = severity === 'critical' || severity === 'high' ? severity : 'medium';
        findings.push(`⚠️ Anemia: Hgb ${hgb} g/dL - Start oral iron supplementation`);
      } else {
        findings.push(`✓ Hemoglobin adequate: ${hgb} g/dL`);
      }

      if (patientData?.currentWeek) {
        findings.push(`Gestational age: ${patientData.currentWeek} weeks`);
      }

      return {
        id: Date.now().toString(),
        type: 'ai',
        content: 'Vital Signs Analysis Complete',
        timestamp: new Date(),
        clinicalGuidance: {
          condition: 'Vital Signs Assessment',
          severity: severity,
          recommendations: findings,
          tests: ['Repeat vitals in 4 hours', 'Daily BP monitoring if elevated', 'Weekly Hgb if anemic']
        },
        suggestions: [
          'Generate treatment plan',
          'Review medications',
          'Schedule follow-up'
        ]
      };
    }

    // Medication review
    if (lowerQuery.includes('medication') || lowerQuery.includes('drug')) {
      return {
        id: Date.now().toString(),
        type: 'ai',
        content: 'Medication review for safe prescribing in pregnancy:',
        timestamp: new Date(),
        clinicalGuidance: {
          condition: 'Medication Safety Review',
          severity: 'low',
          recommendations: [
            '✓ Always check FDA pregnancy category or newer PLLR system',
            '✓ Use lowest effective dose for shortest duration',
            '✓ Avoid medications in first trimester when possible',
            '✓ Consider timing of delivery if using medications near term',
            '✓ Document patient counseling on risks/benefits'
          ],
          medications: [
            'SAFE: Acetaminophen, Methyldopa, Insulin, Penicillins, Cephalosporins',
            'CAUTION: Aspirin (low-dose OK), Labetalol, Nifedipine',
            'AVOID: NSAIDs (after 30 weeks), ACE inhibitors, ARBs, Statins, Warfarin',
            'CONSULT: Any new medication - check drug reference database'
          ],
          guidelines: 'FDA Pregnancy and Lactation Labeling Rule (PLLR) | WHO Essential Medicines in Pregnancy'
        },
        suggestions: [
          'Check drug interactions',
          'Dosage calculations',
          'Alternative medications'
        ]
      };
    }

    // Risk assessment
    if (lowerQuery.includes('risk')) {
      const riskFactors: string[] = [];
      if (patientData?.age && patientData.age >= 35) riskFactors.push('Advanced maternal age (≥35 years)');
      if (patientData?.pastPregnancies > 0) riskFactors.push(`Multiparous (${patientData.pastPregnancies} previous pregnancies)`);
      if (patientData?.riskLevel === 'high' || patientData?.riskLevel === 'critical') {
        riskFactors.push('High-risk pregnancy designation');
      }
      if (patientData?.complications && patientData.complications.length > 0) {
        patientData.complications.forEach((comp: string) => riskFactors.push(comp));
      }

      const severity = riskFactors.length >= 3 ? 'high' : riskFactors.length >= 1 ? 'medium' : 'low';

      return {
        id: Date.now().toString(),
        type: 'ai',
        content: 'Comprehensive risk assessment completed:',
        timestamp: new Date(),
        clinicalGuidance: {
          condition: 'Pregnancy Risk Stratification',
          severity: severity,
          recommendations: [
            riskFactors.length === 0 ? '✓ Low-risk pregnancy - routine ANC schedule' : '⚠️ Identified risk factors require enhanced monitoring',
            ...riskFactors.map(rf => `• ${rf}`),
            severity === 'high' ? 'Recommend weekly visits after 32 weeks' : 'Standard ANC visits appropriate',
            'Continuous risk reassessment at each visit',
            'Patient education on warning signs specific to identified risks'
          ],
          referral: severity === 'high' ? 'Consider maternal-fetal medicine consultation' : undefined,
          guidelines: 'WHO ANC Guidelines (2016) | Kenya MOH Maternal Health Guidelines'
        },
        suggestions: [
          'Create monitoring schedule',
          'Patient education materials',
          'Referral letter if needed'
        ]
      };
    }

    // Treatment plan
    if (lowerQuery.includes('treatment') || lowerQuery.includes('plan')) {
      return {
        id: Date.now().toString(),
        type: 'ai',
        content: 'Comprehensive treatment plan recommendation:',
        timestamp: new Date(),
        clinicalGuidance: {
          condition: 'Treatment Plan Development',
          severity: patientData?.riskLevel || 'low',
          recommendations: [
            '1. IMMEDIATE: Address any acute concerns or abnormal findings',
            '2. MEDICATIONS: Prenatal vitamins, Iron supplementation if anemic, Any condition-specific medications',
            '3. MONITORING: Regular BP checks, Fetal movement counting, Weekly visits if high-risk',
            '4. LIFESTYLE: Adequate rest, Balanced nutrition, Moderate exercise if no contraindications',
            '5. EDUCATION: Warning signs, When to seek emergency care, Birth preparedness',
            '6. FOLLOW-UP: Schedule next visit, Labs as indicated, Ultrasound per protocol'
          ],
          medications: [
            'Prenatal vitamins with folic acid 400-800mcg daily',
            'Iron supplementation if Hgb <11 g/dL',
            'Condition-specific medications as needed'
          ],
          tests: [
            'Regular ANC labs per trimester',
            'Ultrasound per schedule',
            'Additional tests based on risk factors'
          ],
          guidelines: 'WHO Antenatal Care Guidelines | Kenya MOH Standards'
        },
        suggestions: [
          'Print treatment plan',
          'Schedule appointments',
          'Medication prescriptions'
        ]
      };
    }

    // WHO Guidelines
    if (lowerQuery.includes('guideline') || lowerQuery.includes('who')) {
      return {
        id: Date.now().toString(),
        type: 'ai',
        content: 'Key WHO and evidence-based guidelines for maternal care:',
        timestamp: new Date(),
        clinicalGuidance: {
          condition: 'Clinical Practice Guidelines',
          severity: 'low',
          recommendations: [
            '📚 WHO ANC Guidelines (2016): Minimum 8 contacts during pregnancy',
            '📚 WHO Hypertension Guidelines: BP monitoring and management protocols',
            '📚 WHO Nutrition Guidelines: Iron, folic acid, calcium supplementation',
            '📚 ACOG Practice Bulletins: Evidence-based US guidelines',
            '📚 Kenya MOH Guidelines: Localized protocols for Kenyan context',
            '📚 FIGO Recommendations: International maternal health standards'
          ],
          guidelines: 'All guidelines available through WHO Reproductive Health Library and UpToDate'
        },
        suggestions: [
          'Search specific guideline',
          'Download PDF protocols',
          'Recent updates'
        ]
      };
    }

    // Default response
    return {
      id: Date.now().toString(),
      type: 'ai',
      content: `I can help you with clinical decision support. Here are some things I can assist with:

• **Vital Signs Analysis**: Analyze and interpret patient vital signs
• **Risk Assessment**: Comprehensive pregnancy risk stratification
• **Medication Review**: Safe prescribing and drug interactions
• **Treatment Plans**: Evidence-based care planning
• **Clinical Guidelines**: WHO, ACOG, and MOH protocol references

Please ask a specific question or use one of the quick query buttons.`,
      timestamp: new Date(),
      suggestions: [
        'Analyze patient vitals',
        'Assess pregnancy risks',
        'Review medications',
        'Show WHO guidelines'
      ]
    };
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickQuery = (query: string) => {
    setInputMessage(query);
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
    setTimeout(() => handleSendMessage(), 100);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 dark:bg-red-950/30 text-red-800 dark:text-red-400 border-red-300 dark:border-red-900';
      case 'high': return 'bg-orange-100 dark:bg-orange-950/30 text-orange-800 dark:text-orange-400 border-orange-300 dark:border-orange-900';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-950/30 text-yellow-800 dark:text-yellow-400 border-yellow-300 dark:border-yellow-900';
      default: return 'bg-blue-100 dark:bg-blue-950/30 text-blue-800 dark:text-blue-400 border-blue-300 dark:border-blue-900';
    }
  };

  return (
    <div className="flex flex-col h-full max-h-full overflow-hidden">
      {/* Header - Only show close button if onClose is provided */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-primary/10 to-primary/5 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Brain className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-foreground flex items-center">
              AI Clinical Assistant
              <Sparkles className="w-4 h-4 ml-2 text-primary" />
            </h3>
            <p className="text-xs text-muted-foreground">Evidence-based decision support</p>
          </div>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>

      {/* Quick Query Buttons */}
      <div className="p-4 border-b border-border bg-muted/20 flex-shrink-0">
        <p className="text-xs text-muted-foreground mb-2">Quick Queries:</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {quickQueries.map((query, idx) => (
            <Button
              key={idx}
              variant="outline"
              size="sm"
              onClick={() => handleQuickQuery(query.query)}
              className="justify-start text-xs h-auto py-2"
            >
              <query.icon className="w-3 h-3 mr-2" />
              {query.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="space-y-4">
            {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                <div
                  className={`rounded-lg p-3 ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                  
                  {/* Clinical Guidance Card */}
                  {message.clinicalGuidance && (
                    <Card className={`mt-3 border ${getSeverityColor(message.clinicalGuidance.severity)}`}>
                      <CardHeader className="p-3 pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm flex items-center">
                            {message.clinicalGuidance.severity === 'critical' && <AlertTriangle className="w-4 h-4 mr-2" />}
                            {message.clinicalGuidance.severity === 'high' && <AlertTriangle className="w-4 h-4 mr-2" />}
                            {message.clinicalGuidance.severity === 'medium' && <Info className="w-4 h-4 mr-2" />}
                            {message.clinicalGuidance.severity === 'low' && <CheckCircle2 className="w-4 h-4 mr-2" />}
                            {message.clinicalGuidance.condition}
                          </CardTitle>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleMessageExpansion(message.id)}
                            className="h-6 w-6 p-0"
                          >
                            {expandedMessages.has(message.id) ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </CardHeader>
                      
                      <AnimatePresence>
                        {expandedMessages.has(message.id) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                          >
                            <CardContent className="p-3 pt-0 space-y-3 text-sm">
                              {message.clinicalGuidance.recommendations.length > 0 && (
                                <div>
                                  <p className="font-medium mb-1 flex items-center">
                                    <Lightbulb className="w-3 h-3 mr-1" />
                                    Recommendations:
                                  </p>
                                  <ul className="space-y-1 text-xs">
                                    {message.clinicalGuidance.recommendations.map((rec, idx) => (
                                      <li key={idx} className="ml-4">{rec}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {message.clinicalGuidance.medications && (
                                <div>
                                  <p className="font-medium mb-1 flex items-center">
                                    <Pill className="w-3 h-3 mr-1" />
                                    Medications:
                                  </p>
                                  <ul className="space-y-1 text-xs">
                                    {message.clinicalGuidance.medications.map((med, idx) => (
                                      <li key={idx} className="ml-4">• {med}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {message.clinicalGuidance.tests && (
                                <div>
                                  <p className="font-medium mb-1 flex items-center">
                                    <Activity className="w-3 h-3 mr-1" />
                                    Tests/Monitoring:
                                  </p>
                                  <ul className="space-y-1 text-xs">
                                    {message.clinicalGuidance.tests.map((test, idx) => (
                                      <li key={idx} className="ml-4">• {test}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {message.clinicalGuidance.referral && (
                                <div className="bg-orange-50 dark:bg-orange-950/20 p-2 rounded">
                                  <p className="font-medium mb-1 flex items-center text-xs">
                                    <Shield className="w-3 h-3 mr-1" />
                                    Referral Needed:
                                  </p>
                                  <p className="text-xs">{message.clinicalGuidance.referral}</p>
                                </div>
                              )}

                              {message.clinicalGuidance.guidelines && (
                                <div className="bg-blue-50 dark:bg-blue-950/20 p-2 rounded">
                                  <p className="font-medium mb-1 flex items-center text-xs">
                                    <BookOpen className="w-3 h-3 mr-1" />
                                    Guidelines:
                                  </p>
                                  <p className="text-xs italic">{message.clinicalGuidance.guidelines}</p>
                                </div>
                              )}
                            </CardContent>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  )}

                  <p className="text-xs opacity-70 mt-2">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                {/* Suggestions */}
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {message.suggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg p-3 max-w-[85%]">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border bg-card flex-shrink-0">
        <div className="flex space-x-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask about diagnosis, treatment, guidelines..."
            className="flex-1"
          />
          <Button onClick={handleSendMessage} className="bg-primary hover:bg-primary/90">
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          AI-powered suggestions based on WHO, ACOG, and MOH guidelines
        </p>
      </div>
    </div>
  );
}
