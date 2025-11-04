import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, FileText, Shield, Download, CheckCircle, Upload, AlertCircle, CreditCard, Eye, Edit2, Trash2, Plus, File } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface DigitalServicesProps {
  onBack: () => void;
}

interface Document {
  id: string;
  name: string;
  type: string;
  status: 'uploaded' | 'verified' | 'pending';
  date: string;
  size?: string;
  url?: string;
}

export function DigitalServices({ onBack }: DigitalServicesProps) {
  const [activeTab, setActiveTab] = useState('certificate');
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      name: 'Birth Notification',
      type: 'birth_notification',
      status: 'verified',
      date: 'Oct 2, 2025',
      size: '245 KB'
    },
    {
      id: '2',
      name: 'Hospital Discharge Summary',
      type: 'discharge_summary',
      status: 'uploaded',
      date: 'Oct 3, 2025',
      size: '1.2 MB'
    },
    {
      id: '3',
      name: "Mother's National ID",
      type: 'mothers_id',
      status: 'verified',
      date: 'Oct 1, 2025',
      size: '156 KB'
    },
    {
      id: '4',
      name: "Father's National ID",
      type: 'fathers_id',
      status: 'verified',
      date: 'Oct 1, 2025',
      size: '178 KB'
    }
  ]);

  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [uploadDocType, setUploadDocType] = useState('');
  const [uploadFileName, setUploadFileName] = useState('');

  const certificateData = {
    childName: 'Achieng Akinyi',
    birthDate: 'October 1, 2025',
    birthTime: '3:45 AM',
    hospital: 'Kenyatta National Hospital',
    weight: '3.2 kg',
    motherName: 'Akinyi Odhiambo',
    fatherName: 'John Odhiambo',
    certNumber: 'BC/2025/KNH/10234',
    status: 'processing'
  };

  const shaData = {
    memberNumber: 'SHA-2025-45678',
    status: 'Active',
    coverage: 'Maternal & Child Care',
    expiryDate: 'December 31, 2025',
    tier: 'Essential Benefits Package',
    benefits: [
      'Antenatal Care (Full coverage)',
      'Delivery Services (Normal & C-Section)',
      'Postnatal Care (12 weeks)',
      'Newborn Care (Up to 1 year)',
      'Emergency Services (Full coverage)',
      'Family Planning Services',
      'Immunization Services'
    ]
  };

  const registrationSteps = [
    { step: 1, title: 'Birth Notification', status: 'completed', description: 'Hospital submitted notification' },
    { step: 2, title: 'Document Verification', status: 'completed', description: 'All documents verified' },
    { step: 3, title: 'Certificate Processing', status: 'in-progress', description: 'Expected: 5-7 business days' },
    { step: 4, title: 'Digital Certificate', status: 'pending', description: 'Available for download after processing' }
  ];

  const documentTypes = [
    { value: 'birth_notification', label: 'Birth Notification' },
    { value: 'discharge_summary', label: 'Hospital Discharge Summary' },
    { value: 'mothers_id', label: "Mother's National ID" },
    { value: 'fathers_id', label: "Father's National ID" },
    { value: 'marriage_cert', label: 'Marriage Certificate' },
    { value: 'medical_report', label: 'Medical Report' },
    { value: 'other', label: 'Other Document' }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadFileName(file.name);
    }
  };

  const handleUploadSubmit = () => {
    if (uploadDocType && uploadFileName) {
      const newDoc: Document = {
        id: Date.now().toString(),
        name: uploadFileName,
        type: uploadDocType,
        status: 'uploaded',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        size: '1.5 MB'
      };
      setDocuments([...documents, newDoc]);
      setIsUploadDialogOpen(false);
      setUploadDocType('');
      setUploadFileName('');
    }
  };

  const handleViewDocument = (doc: Document) => {
    setSelectedDocument(doc);
    setIsViewDialogOpen(true);
  };

  const handleEditDocument = (doc: Document) => {
    setSelectedDocument(doc);
    setIsEditDialogOpen(true);
  };

  const handleDeleteDocument = (docId: string) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      setDocuments(documents.filter(d => d.id !== docId));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'uploaded':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-white" />;
      case 'in-progress':
        return <div className="w-3 h-3 rounded-full bg-white animate-pulse" />;
      default:
        return <span className="text-white text-sm">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 flex items-center gap-4 p-4 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl text-foreground">Digital Services</h1>
          <p className="text-sm text-muted-foreground">Birth Certificate & SHA</p>
        </div>
        <Shield className="w-6 h-6 text-primary" />
      </div>

      <div className="pt-4 p-4 space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="certificate">Certificate</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="sha">SHA</TabsTrigger>
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
                          {getStatusIcon(item.status)}
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

            {/* Actions */}
            <div className="space-y-2">
              <Button className="w-full" disabled>
                <Download className="w-4 h-4 mr-2" />
                Download Certificate (Processing)
              </Button>
            </div>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-4 mt-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-foreground">My Documents</h2>
              <Button onClick={() => setIsUploadDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Upload
              </Button>
            </div>

            <Alert>
              <FileText className="w-4 h-4" />
              <AlertDescription>
                Keep all your pregnancy and birth-related documents safe in one place. You can view, edit, and manage them anytime.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              {documents.map((doc) => (
                <Card key={doc.id}>
                  <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                      <File className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-foreground truncate">{doc.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-muted-foreground">{doc.date}</p>
                          {doc.size && (
                            <>
                              <span className="text-xs text-muted-foreground">•</span>
                              <p className="text-xs text-muted-foreground">{doc.size}</p>
                            </>
                          )}
                        </div>
                        <Badge className={`${getStatusColor(doc.status)} text-xs mt-2`}>
                          {doc.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleViewDocument(doc)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEditDocument(doc)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDeleteDocument(doc.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* SHA Tab */}
          <TabsContent value="sha" className="space-y-4 mt-4">
            {/* SHA Status */}
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
                      <h3 className="mb-1">SHA Status</h3>
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 mb-2">
                        {shaData.status}
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        Valid until {shaData.expiryDate}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <Alert className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
              <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <AlertDescription className="text-blue-800 dark:text-blue-400">
                SHA (Social Health Authority) replaced NHIF in 2024. Your previous NHIF benefits are now covered under SHA with enhanced maternal care services.
              </AlertDescription>
            </Alert>

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
                    <p className="font-mono text-sm">{shaData.memberNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Coverage Plan</p>
                    <p className="text-sm">{shaData.coverage}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Benefit Package</p>
                    <p className="text-sm">{shaData.tier}</p>
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
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {shaData.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-foreground">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* SHA Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <h2 className="mb-4">Digital SHA Card</h2>
              <Card className="bg-gradient-to-br from-green-600 to-emerald-700 text-white overflow-hidden">
                <CardContent className="p-6 relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <Shield className="w-10 h-10" />
                      <p className="text-xs opacity-80">Social Health Authority</p>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs opacity-80 mb-1">Member Name</p>
                        <p className="">{certificateData.motherName}</p>
                      </div>
                      <div>
                        <p className="text-xs opacity-80 mb-1">Member Number</p>
                        <p className="font-mono tracking-wider">{shaData.memberNumber}</p>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-white/20">
                        <div>
                          <p className="text-xs opacity-80">Valid Until</p>
                          <p className="text-sm">{shaData.expiryDate}</p>
                        </div>
                        <Badge className="bg-white/20 text-white border-0">
                          {shaData.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Actions */}
            <div className="space-y-2">
              <Button className="w-full" variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download SHA Card
              </Button>
              <Button className="w-full" variant="outline">
                <CreditCard className="w-4 h-4 mr-2" />
                View Claims History
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              Add a new document to your digital records
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Document Type</Label>
              <Select value={uploadDocType} onValueChange={setUploadDocType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  {documentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Select File</Label>
              <Input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
              />
              {uploadFileName && (
                <p className="text-xs text-muted-foreground">Selected: {uploadFileName}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUploadSubmit} disabled={!uploadDocType || !uploadFileName}>
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>View Document</DialogTitle>
            <DialogDescription>
              {selectedDocument?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="aspect-[3/4] bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center space-y-2">
                <File className="w-16 h-16 text-muted-foreground mx-auto" />
                <p className="text-sm text-muted-foreground">Document Preview</p>
                <p className="text-xs text-muted-foreground">{selectedDocument?.size}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status:</span>
                <Badge className={getStatusColor(selectedDocument?.status || 'pending')}>
                  {selectedDocument?.status}
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Upload Date:</span>
                <span>{selectedDocument?.date}</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            <Button>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Document</DialogTitle>
            <DialogDescription>
              Update document information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Document Name</Label>
              <Input value={selectedDocument?.name || ''} />
            </div>
            <div className="space-y-2">
              <Label>Document Type</Label>
              <Select value={selectedDocument?.type || ''}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {documentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Replace File (Optional)</Label>
              <Input type="file" accept=".pdf,.jpg,.jpeg,.png" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsEditDialogOpen(false)}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
