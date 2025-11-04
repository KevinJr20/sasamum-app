import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, FileText, Shield, Download, CheckCircle, Upload, AlertCircle, CreditCard } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';

interface DigitalBirthCertificateProps {
  onBack: () => void;
}

export function DigitalBirthCertificate({ onBack }: DigitalBirthCertificateProps) {
  const [activeTab, setActiveTab] = useState('certificate');
  const [nhifStatus, setNhifStatus] = useState('active');

  const certificateData = {
    childName: 'Achieng Akinyi',
    birthDate: 'October 1, 2025',
    birthTime: '3:45 AM',
    hospital: 'Kenyatta National Hospital',
    weight: '3.2 kg',
    motherName: 'Akinyi Odhiambo',
    fatherName: 'John Odhiambo',
    certNumber: 'BC/2025/KNH/10234',
    status: 'verified'
  };

  const nhifData = {
    memberNumber: 'NHIF-2025-45678',
    status: 'Active',
    coverage: 'Maternal & Child Care',
    expiryDate: 'December 31, 2025',
    benefits: [
      'Antenatal Care (Full coverage)',
      'Delivery Services (Up to KES 30,000)',
      'Postnatal Care (6 weeks)',
      'Newborn Care (Up to 6 months)',
      'Emergency Services (Full coverage)'
    ]
  };

  const documents = [
    {
      name: 'Birth Notification',
      status: 'Submitted',
      date: 'Oct 2, 2025',
      icon: FileText
    },
    {
      name: 'Hospital Discharge Summary',
      status: 'Uploaded',
      date: 'Oct 3, 2025',
      icon: FileText
    },
    {
      name: 'Mother\'s ID Copy',
      status: 'Verified',
      date: 'Oct 1, 2025',
      icon: Shield
    },
    {
      name: 'Father\'s ID Copy',
      status: 'Verified',
      date: 'Oct 1, 2025',
      icon: Shield
    }
  ];

  const registrationSteps = [
    { step: 1, title: 'Birth Notification', status: 'completed', description: 'Hospital submitted notification' },
    { step: 2, title: 'Document Verification', status: 'completed', description: 'All documents verified' },
    { step: 3, title: 'Certificate Processing', status: 'in-progress', description: 'Expected: 5-7 business days' },
    { step: 4, title: 'Digital Certificate', status: 'pending', description: 'Available for download after processing' }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky-header">
        <div className="flex items-center gap-4 p-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl text-foreground">Digital Services</h1>
            <p className="text-sm text-muted-foreground">Birth Certificate & NHIF</p>
          </div>
          <Shield className="w-6 h-6 text-primary" />
        </div>
      </div>

      <div className="pt-20 p-4 space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="certificate">Birth Certificate</TabsTrigger>
            <TabsTrigger value="nhif">NHIF Integration</TabsTrigger>
          </TabsList>

          {/* Birth Certificate Tab */}
          <TabsContent value="certificate" className="space-y-4 mt-4">
            {/* Status Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-gradient-to-br from-primary/10 to-secondary/10">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="mb-1">Certificate Status</h3>
                      <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 mb-2">
                        Processing
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        Expected completion: October 20, 2025
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Registration Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <h2 className="mb-4">Registration Progress</h2>
              <Card>
                <CardContent className="p-4 space-y-4">
                  {registrationSteps.map((item, index) => (
                    <div key={item.step} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          item.status === 'completed' ? 'bg-green-500' :
                          item.status === 'in-progress' ? 'bg-yellow-500' :
                          'bg-gray-300'
                        }`}>
                          {item.status === 'completed' ? (
                            <CheckCircle className="w-5 h-5 text-white" />
                          ) : (
                            <span className="text-white text-sm">{item.step}</span>
                          )}
                        </div>
                        {index < registrationSteps.length - 1 && (
                          <div className={`w-0.5 h-12 ${
                            item.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                          }`} />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <h4 className="mb-1">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Birth Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <h2 className="mb-4">Birth Details</h2>
              <Card>
                <CardContent className="p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Child's Name</p>
                      <p className="text-sm">{certificateData.childName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Birth Date</p>
                      <p className="text-sm">{certificateData.birthDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Birth Time</p>
                      <p className="text-sm">{certificateData.birthTime}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Weight</p>
                      <p className="text-sm">{certificateData.weight}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground mb-1">Hospital</p>
                      <p className="text-sm">{certificateData.hospital}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Mother</p>
                      <p className="text-sm">{certificateData.motherName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Father</p>
                      <p className="text-sm">{certificateData.fatherName}</p>
                    </div>
                  </div>
                  <div className="pt-3 border-t">
                    <p className="text-sm text-muted-foreground mb-1">Certificate Number</p>
                    <p className="text-sm font-mono">{certificateData.certNumber}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Documents */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <h2 className="mb-4">Uploaded Documents</h2>
              <div className="space-y-2">
                {documents.map((doc, index) => (
                  <Card key={index}>
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        <doc.icon className="w-5 h-5 text-primary" />
                        <div className="flex-1">
                          <p className="text-sm">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">{doc.date}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {doc.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>

            {/* Actions */}
            <div className="space-y-2">
              <Button className="w-full" variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Upload Additional Documents
              </Button>
              <Button className="w-full" disabled>
                <Download className="w-4 h-4 mr-2" />
                Download Certificate (Processing)
              </Button>
            </div>
          </TabsContent>

          {/* NHIF Tab */}
          <TabsContent value="nhif" className="space-y-4 mt-4">
            {/* NHIF Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-gradient-to-br from-green-500/10 to-emerald-600/10">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="mb-1">NHIF Status</h3>
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 mb-2">
                        {nhifData.status}
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        Valid until {nhifData.expiryDate}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Member Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Member Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Member Number</p>
                    <p className="font-mono text-sm">{nhifData.memberNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Coverage Type</p>
                    <p className="text-sm">{nhifData.coverage}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <h2 className="mb-4">Your Benefits</h2>
              <Card>
                <CardContent className="p-4 space-y-3">
                  {nhifData.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm">{benefit}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <div className="space-y-2">
              <Button className="w-full" variant="outline">
                <CreditCard className="w-4 h-4 mr-2" />
                View Claims History
              </Button>
              <Button className="w-full" variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download NHIF Card
              </Button>
            </div>

            {/* Info Alert */}
            <Alert>
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>
                Your NHIF coverage includes full maternity benefits. Present your member card at any NHIF-accredited facility.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
