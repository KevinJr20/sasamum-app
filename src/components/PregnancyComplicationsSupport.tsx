import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  ArrowLeft,
  Heart,
  AlertTriangle,
  Baby,
  Clock,
  Phone,
  MessageCircle,
  BookOpen,
  Users,
  Flower2,
  Shield,
  Stethoscope,
  Info,
  ExternalLink,
  HeartHandshake,
  Lightbulb,
  Activity
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { toast } from 'sonner';

interface PregnancyComplicationsSupportProps {
  onBack: () => void;
}

interface ComplicationInfo {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  warningSign: string[];
  whatToDo: string[];
  emotionalSupport: string[];
  resources: { title: string; description: string; }[];
}

export function PregnancyComplicationsSupport({ onBack }: PregnancyComplicationsSupportProps) {
  const [selectedComplication, setSelectedComplication] = useState<ComplicationInfo | null>(null);
  const [showMemorial, setShowMemorial] = useState(false);

  const complications: ComplicationInfo[] = [
    {
      id: 'ectopic',
      title: 'Ectopic Pregnancy',
      icon: <AlertTriangle className="w-6 h-6" />,
      color: 'text-orange-500',
      description: 'An ectopic pregnancy occurs when a fertilized egg implants outside the uterus, usually in the fallopian tube. This is a medical emergency that requires immediate attention.',
      warningSign: [
        'Sharp or stabbing pain in the abdomen or pelvis',
        'Vaginal bleeding (lighter or heavier than normal period)',
        'Shoulder pain (referred pain from internal bleeding)',
        'Dizziness, fainting, or weakness',
        'Rectal pressure or bowel discomfort',
        'Positive pregnancy test with abnormal symptoms'
      ],
      whatToDo: [
        'Seek immediate emergency medical care',
        'Call emergency services or go to nearest hospital',
        'Do not eat or drink (you may need surgery)',
        'Have someone accompany you if possible',
        'Bring any medical records or pregnancy test results'
      ],
      emotionalSupport: [
        'Remember this is not your fault - ectopic pregnancies cannot be prevented',
        'Allow yourself to grieve - this was a real pregnancy and loss',
        'Seek counseling or support groups for pregnancy loss',
        'Take time to heal physically and emotionally',
        'Future pregnancies are often possible with proper care'
      ],
      resources: [
        {
          title: 'Emergency Care',
          description: 'Contact nearest hospital with emergency services immediately'
        },
        {
          title: 'Follow-up Care',
          description: 'Regular monitoring of hCG levels after treatment'
        },
        {
          title: 'Future Pregnancy Planning',
          description: 'Consult with OB-GYN about risk factors and planning'
        }
      ]
    },
    {
      id: 'miscarriage',
      title: 'Miscarriage (Pregnancy Loss)',
      icon: <Heart className="w-6 h-6" />,
      color: 'text-pink-500',
      description: 'Miscarriage is the loss of pregnancy before 20 weeks. It affects 10-20% of known pregnancies and is often due to chromosomal abnormalities. You are not alone.',
      warningSign: [
        'Vaginal bleeding (from spotting to heavy)',
        'Severe cramping or abdominal pain',
        'Passing tissue or clots from the vagina',
        'Sudden decrease in pregnancy symptoms',
        'Lower back pain or pressure',
        'Fluid discharge from vagina'
      ],
      whatToDo: [
        'Contact your healthcare provider immediately',
        'Keep track of bleeding amount (pads per hour)',
        'Save any tissue passed in a clean container',
        'Rest and avoid strenuous activity',
        'Seek emergency care if bleeding is very heavy or you have severe pain',
        'Have emotional support available'
      ],
      emotionalSupport: [
        'Your grief is valid - this was your baby and your loss matters',
        'There is no "right" way to feel or grieve',
        'Join support groups - many Kenyan mothers have experienced this',
        'Consider counseling services for grief processing',
        'Take time off work if needed to heal',
        'Include your partner in the grieving process if applicable'
      ],
      resources: [
        {
          title: 'Medical Follow-up',
          description: 'D&C or medication may be needed; follow provider instructions'
        },
        {
          title: 'Grief Counseling',
          description: 'Professional support for processing pregnancy loss'
        },
        {
          title: 'Support Groups',
          description: 'Connect with other mothers who have experienced loss'
        },
        {
          title: 'When to Try Again',
          description: 'Discuss timing with your doctor - usually 1-3 cycles'
        }
      ]
    },
    {
      id: 'stillbirth',
      title: 'Stillbirth',
      icon: <Flower2 className="w-6 h-6" />,
      color: 'text-purple-500',
      description: 'Stillbirth is the loss of a baby after 20 weeks of pregnancy. This devastating loss requires comprehensive medical and emotional support. Your baby mattered.',
      warningSign: [
        'Absence of fetal movement after previously feeling movement',
        'No fetal heartbeat detected',
        'Cramping and bleeding',
        'Sudden decrease in pregnancy symptoms',
        'Feeling that something is wrong'
      ],
      whatToDo: [
        'Contact your healthcare provider or go to hospital immediately',
        'Ultrasound will be performed to check heartbeat',
        'Labor may be induced or C-section performed',
        'Ask about memory-making opportunities (photos, handprints, footprints)',
        'Discuss autopsy and testing options to understand cause',
        'Arrange for emotional support during and after delivery'
      ],
      emotionalSupport: [
        'Take time to hold and say goodbye to your baby',
        'Name your baby if you wish',
        'Create memories - photos, keepsakes, memorial service',
        'Grief counseling is essential - this is profound loss',
        'Support groups for stillbirth can provide understanding',
        'Lactation suppression support if needed',
        'Allow yourself to grieve without timeline',
        'Your baby\'s life mattered, no matter how brief'
      ],
      resources: [
        {
          title: 'Hospital Support',
          description: 'Specialized bereavement care and memory-making'
        },
        {
          title: 'Grief Counseling',
          description: 'Professional therapy for profound loss'
        },
        {
          title: 'Memorial Services',
          description: 'Options for honoring and remembering your baby'
        },
        {
          title: 'Subsequent Pregnancy Care',
          description: 'Enhanced monitoring and support for future pregnancies'
        },
        {
          title: 'Support Organizations',
          description: 'Connect with stillbirth support groups in Kenya'
        }
      ]
    },
    {
      id: 'preterm',
      title: 'Preterm Labor & Delivery',
      icon: <Clock className="w-6 h-6" />,
      color: 'text-blue-500',
      description: 'Preterm labor occurs before 37 weeks. Babies born early may need special care in NICU. Early recognition can sometimes prevent early delivery.',
      warningSign: [
        'Regular contractions before 37 weeks',
        'Pelvic pressure or low back pain',
        'Cramping like menstrual cramps',
        'Fluid leaking from vagina',
        'Vaginal bleeding',
        'Change in vaginal discharge',
        'Feeling that baby has "dropped"'
      ],
      whatToDo: [
        'Call your healthcare provider immediately',
        'Lie down on your left side and drink water',
        'Time contractions (frequency and duration)',
        'Do not ignore warning signs - early action is crucial',
        'Go to hospital if instructed',
        'Ask about medications to stop labor or mature baby\'s lungs'
      ],
      emotionalSupport: [
        'Stay calm - many preterm babies do very well',
        'Learn about NICU care and what to expect',
        'Connect with other NICU parents',
        'Practice skin-to-skin (kangaroo care) when allowed',
        'Pump breast milk even if baby can\'t nurse yet',
        'Celebrate small milestones in baby\'s progress',
        'Ask for support - NICU journey can be exhausting'
      ],
      resources: [
        {
          title: 'NICU Preparation',
          description: 'Understanding neonatal intensive care'
        },
        {
          title: 'Hospitals with NICU',
          description: 'Facilities in Kenya with specialized preterm care'
        },
        {
          title: 'Breastfeeding Support',
          description: 'Pumping and feeding premature babies'
        },
        {
          title: 'Financial Assistance',
          description: 'NHIF coverage and support programs for NICU care'
        }
      ]
    },
    {
      id: 'postterm',
      title: 'Post-term Pregnancy',
      icon: <Activity className="w-6 h-6" />,
      color: 'text-green-500',
      description: 'Post-term pregnancy extends beyond 42 weeks. While often safe, careful monitoring is essential to ensure baby and mother remain healthy.',
      warningSign: [
        'Pregnancy beyond 41-42 weeks',
        'Decreased fetal movement',
        'Reduced amniotic fluid',
        'Signs of fetal distress on monitoring',
        'Placenta may age and function less effectively'
      ],
      whatToDo: [
        'Attend all scheduled monitoring appointments',
        'Non-stress tests (NST) to check baby\'s wellbeing',
        'Ultrasound to check fluid levels and placenta',
        'Count fetal movements daily',
        'Discuss induction options with your provider',
        'Report any concerns immediately',
        'Stay hydrated and well-nourished'
      ],
      emotionalSupport: [
        'Waiting past due date can be frustrating and anxious',
        'Trust your medical team\'s monitoring',
        'Rest as much as possible',
        'Stay connected with support system',
        'Ask questions about induction timing and process',
        'Remember that every pregnancy is different'
      ],
      resources: [
        {
          title: 'Fetal Monitoring',
          description: 'Regular NST and ultrasound assessments'
        },
        {
          title: 'Induction Information',
          description: 'Understanding when and how labor may be induced'
        },
        {
          title: 'Risk Assessment',
          description: 'Discussing benefits and risks of waiting vs induction'
        }
      ]
    }
  ];

  const emergencyContacts = [
    { name: 'Emergency Hotline', number: '999/112', icon: <Phone className="w-5 h-5" /> },
    { name: 'Kenyatta National Hospital', number: '020 2726300', icon: <Stethoscope className="w-5 h-5" /> },
    { name: 'Nairobi Hospital', number: '020 2845000', icon: <Stethoscope className="w-5 h-5" /> },
    { name: 'Aga Khan Hospital', number: '020 3740000', icon: <Stethoscope className="w-5 h-5" /> }
  ];

  const supportResources = [
    {
      title: 'Kenya Hospice & Palliative Care',
      description: 'Grief counseling and support services',
      contact: '020 2717676'
    },
    {
      title: 'Pregnancy Loss Support Kenya',
      description: 'Online and in-person support groups',
      contact: 'info@pregnancyloss.co.ke'
    },
    {
      title: 'Family Health Options Kenya',
      description: 'Reproductive health counseling',
      contact: '020 3860331'
    }
  ];

  const handleCallEmergency = (number: string) => {
    window.location.href = `tel:${number}`;
    toast.success('Calling emergency services...');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky-header border-b border-border/40"
      >
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="hover:bg-primary/10"
          >
            <ArrowLeft className="w-5 h-5 text-primary" />
          </Button>
          <h1 className="text-foreground">Pregnancy Support & Care</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleCallEmergency('999')}
            className="hover:bg-destructive/10"
          >
            <Phone className="w-5 h-5 text-destructive" />
          </Button>
        </div>
      </motion.header>

      <div className="page-with-header pb-6 px-4 space-y-6 max-w-4xl mx-auto">
        {/* Important Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <p className="text-sm text-foreground">
                    <strong>Important:</strong> Pregnancy complications can happen to anyone. They are not your fault. 
                    This section provides information and support for difficult pregnancy experiences.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    If you're experiencing a medical emergency, call <span className="text-destructive font-bold">999 or 112</span> immediately.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Complications Cards */}
        <div className="space-y-4">
          <h2 className="text-foreground">Pregnancy Complications & Support</h2>
          <div className="grid gap-4">
            {complications.map((complication, index) => (
              <motion.div
                key={complication.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className="cursor-pointer hover:shadow-lg transition-all hover:border-primary/50"
                  onClick={() => setSelectedComplication(complication)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`${complication.color} bg-current/10 rounded-lg p-2.5`}>
                        {complication.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-foreground mb-1">{complication.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {complication.description}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" className="flex-shrink-0">
                        <ExternalLink className="w-4 h-4 text-primary" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Emergency Contacts */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-destructive" />
              <h3 className="text-foreground">Emergency Contacts</h3>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {emergencyContacts.map((contact, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-between hover:bg-destructive/5 hover:border-destructive/50"
                onClick={() => handleCallEmergency(contact.number)}
              >
                <span className="flex items-center gap-2">
                  {contact.icon}
                  {contact.name}
                </span>
                <span className="text-destructive font-medium">{contact.number}</span>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Support Resources */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-primary" />
              <h3 className="text-foreground">Support & Counseling Services</h3>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {supportResources.map((resource, index) => (
              <div key={index} className="p-3 bg-muted/30 rounded-lg">
                <h4 className="text-foreground mb-1">{resource.title}</h4>
                <p className="text-sm text-muted-foreground mb-2">{resource.description}</p>
                <p className="text-sm text-primary font-medium">{resource.contact}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Memorial & Remembrance */}
        <Card className="border-purple-500/30">
          <CardContent className="p-6 text-center space-y-4">
            <Flower2 className="w-12 h-12 text-purple-500 mx-auto" />
            <div>
              <h3 className="text-foreground mb-2">Remembrance & Healing</h3>
              <p className="text-sm text-muted-foreground mb-4">
                For mothers who have experienced pregnancy loss or stillbirth
              </p>
              <Button
                variant="outline"
                className="border-purple-500/50 text-purple-600 hover:bg-purple-500/10"
                onClick={() => setShowMemorial(true)}
              >
                <Flower2 className="w-4 h-4 mr-2" />
                Visit Memorial Space
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Complication Detail Dialog */}
      <Dialog open={!!selectedComplication} onOpenChange={() => setSelectedComplication(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedComplication && (
            <div className="space-y-6">
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`${selectedComplication.color} bg-current/10 rounded-lg p-2.5`}>
                    {selectedComplication.icon}
                  </div>
                  <DialogTitle>{selectedComplication.title}</DialogTitle>
                </div>
                <p className="text-sm text-muted-foreground pt-2">
                  {selectedComplication.description}
                </p>
              </DialogHeader>

              <Tabs defaultValue="warning" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="warning">Warning Signs</TabsTrigger>
                  <TabsTrigger value="action">What To Do</TabsTrigger>
                  <TabsTrigger value="support">Support</TabsTrigger>
                  <TabsTrigger value="resources">Resources</TabsTrigger>
                </TabsList>

                <TabsContent value="warning" className="space-y-3 mt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    <h4 className="text-foreground">Warning Signs to Watch For</h4>
                  </div>
                  <ul className="space-y-2">
                    {selectedComplication.warningSign.map((sign, index) => (
                      <li key={index} className="flex gap-2 text-sm">
                        <span className="text-orange-500">•</span>
                        <span className="text-foreground">{sign}</span>
                      </li>
                    ))}
                  </ul>
                </TabsContent>

                <TabsContent value="action" className="space-y-3 mt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="w-5 h-5 text-blue-500" />
                    <h4 className="text-foreground">Immediate Actions</h4>
                  </div>
                  <ul className="space-y-2">
                    {selectedComplication.whatToDo.map((action, index) => (
                      <li key={index} className="flex gap-2 text-sm">
                        <span className="text-blue-500">•</span>
                        <span className="text-foreground">{action}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 p-3 bg-destructive/10 rounded-lg border border-destructive/30">
                    <p className="text-sm text-foreground">
                      <strong>Emergency:</strong> If you experience severe symptoms, call <span className="text-destructive font-bold">999 or 112</span> immediately.
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="support" className="space-y-3 mt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Heart className="w-5 h-5 text-pink-500" />
                    <h4 className="text-foreground">Emotional Support & Healing</h4>
                  </div>
                  <ul className="space-y-2">
                    {selectedComplication.emotionalSupport.map((support, index) => (
                      <li key={index} className="flex gap-2 text-sm">
                        <span className="text-pink-500">•</span>
                        <span className="text-foreground">{support}</span>
                      </li>
                    ))}
                  </ul>
                </TabsContent>

                <TabsContent value="resources" className="space-y-3 mt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="w-5 h-5 text-primary" />
                    <h4 className="text-foreground">Additional Resources</h4>
                  </div>
                  <div className="space-y-3">
                    {selectedComplication.resources.map((resource, index) => (
                      <div key={index} className="p-3 bg-muted/30 rounded-lg">
                        <h5 className="text-foreground mb-1">{resource.title}</h5>
                        <p className="text-sm text-muted-foreground">{resource.description}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleCallEmergency('999')}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Emergency Call
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => {
                    toast.success('Opening chat with healthcare provider...');
                    setSelectedComplication(null);
                  }}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact Provider
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Memorial Space Dialog */}
      <Dialog open={showMemorial} onOpenChange={setShowMemorial}>
        <DialogContent className="max-w-lg">
          <div className="text-center space-y-6 py-6">
            <Flower2 className="w-16 h-16 text-purple-500 mx-auto" />
            <div className="space-y-3">
              <DialogTitle className="text-2xl">A Space of Remembrance</DialogTitle>
              <p className="text-sm text-muted-foreground leading-relaxed">
                This is a sacred space to honor and remember babies who left too soon. 
                Your baby's life mattered, no matter how brief. You are not alone in your grief.
              </p>
            </div>

            <div className="space-y-4 text-left bg-muted/20 p-4 rounded-lg">
              <p className="text-sm text-foreground italic">
                "Grief is love with nowhere to go. Your love for your baby is eternal."
              </p>
              <div className="space-y-2">
                <p className="text-sm text-foreground">Ways to Remember:</p>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Light a candle in memory</li>
                  <li>• Write a letter to your baby</li>
                  <li>• Create a memory box</li>
                  <li>• Plant a tree or flowers</li>
                  <li>• Join a support group</li>
                  <li>• Participate in remembrance events</li>
                </ul>
              </div>
            </div>

            <div className="space-y-2">
              <Button
                className="w-full"
                onClick={() => {
                  toast.success('Connecting you with grief support services...');
                  setShowMemorial(false);
                }}
              >
                <Users className="w-4 h-4 mr-2" />
                Connect with Support Group
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowMemorial(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
