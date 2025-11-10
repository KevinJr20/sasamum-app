import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { toast } from 'sonner@2.0.3';
import {
  ArrowLeft, Camera, Save, Shield, Award, MapPin, Phone,
  Mail, Calendar, FileText, Upload, CheckCircle2, Edit
} from 'lucide-react';

interface ProviderProfilePageProps {
  onBack: () => void;
}

export function ProviderProfilePage({ onBack }: ProviderProfilePageProps) {
  const providerData = JSON.parse(localStorage.getItem('providerData') || '{}');
  
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: providerData.fullName || providerData.name || 'Dr. Carol Odhiambo',
    specialization: providerData.specialty || 'Obstetrician/Gynecologist',
    licenseNumber: providerData.licenseNumber || 'KMP-2015-12345',
    facility: providerData.facility || 'Kenyatta National Hospital',
    phone: providerData.contactNumber || providerData.phone || '+254 722 123 456',
    email: providerData.email || 'carol.odhiambo@sasamum.ke',
    experience: '10 years',
    education: 'MBChB, MMed (OB/GYN) - University of Nairobi',
    about: 'Dedicated obstetrician with over 10 years of experience in maternal healthcare. Passionate about improving maternal outcomes in Kenya.',
    certifications: ['Fellow of Kenya Obstetrical & Gynaecological Society', 'Advanced Life Support in Obstetrics (ALSO)', 'Ultrasound in Obstetrics Certification'],
    documents: []
  });

  const handleSave = () => {
    localStorage.setItem('providerData', JSON.stringify({
      ...providerData,
      ...profileData
    }));
    toast.success('Profile updated successfully');
    setIsEditing(false);
  };

  const handleImageUpload = () => {
    toast.info('Image upload functionality would connect to file storage');
  };

  const handleDocumentUpload = () => {
    toast.info('Document upload for verification would be processed here');
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-foreground">My Profile</h1>
              <p className="text-xs text-muted-foreground">Manage your professional information</p>
            </div>
          </div>
          <Button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className={isEditing ? 'bg-primary' : ''}
            variant={isEditing ? 'default' : 'outline'}
          >
            {isEditing ? (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            ) : (
              <>
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Profile Header Card */}
        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              <div className="relative">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={providerData.avatar} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                    {profileData.fullName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button
                    size="icon"
                    className="absolute bottom-0 right-0 rounded-full w-8 h-8"
                    onClick={handleImageUpload}
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <div className="flex-1 text-center md:text-left">
                {isEditing ? (
                  <div className="space-y-3">
                    <div>
                      <Label>Full Name</Label>
                      <Input
                        value={profileData.fullName}
                        onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Specialization</Label>
                      <Input
                        value={profileData.specialization}
                        onChange={(e) => setProfileData({ ...profileData, specialization: e.target.value })}
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl text-foreground mb-1">{profileData.fullName}</h2>
                    <p className="text-muted-foreground mb-3">{profileData.specialization}</p>
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                      <Badge className="bg-blue-100 dark:bg-blue-950/30 text-blue-800 dark:text-blue-400">
                        <Shield className="w-3 h-3 mr-1" />
                        Verified Provider
                      </Badge>
                      <Badge className="bg-green-100 dark:bg-green-950/30 text-green-800 dark:text-green-400">
                        <Award className="w-3 h-3 mr-1" />
                        {profileData.experience} Experience
                      </Badge>
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Professional Information */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2 text-primary" />
              Professional Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>License Number</Label>
                {isEditing ? (
                  <Input
                    value={profileData.licenseNumber}
                    onChange={(e) => setProfileData({ ...profileData, licenseNumber: e.target.value })}
                  />
                ) : (
                  <div className="flex items-center space-x-2 mt-2">
                    <p className="text-foreground">{profileData.licenseNumber}</p>
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  </div>
                )}
              </div>
              <div>
                <Label>Facility/Hospital</Label>
                {isEditing ? (
                  <Input
                    value={profileData.facility}
                    onChange={(e) => setProfileData({ ...profileData, facility: e.target.value })}
                  />
                ) : (
                  <div className="flex items-center space-x-2 mt-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <p className="text-foreground">{profileData.facility}</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label>Education & Qualifications</Label>
              {isEditing ? (
                <Textarea
                  value={profileData.education}
                  onChange={(e) => setProfileData({ ...profileData, education: e.target.value })}
                  rows={2}
                />
              ) : (
                <p className="text-foreground mt-2">{profileData.education}</p>
              )}
            </div>

            <div>
              <Label>About</Label>
              {isEditing ? (
                <Textarea
                  value={profileData.about}
                  onChange={(e) => setProfileData({ ...profileData, about: e.target.value })}
                  rows={3}
                />
              ) : (
                <p className="text-foreground mt-2">{profileData.about}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Phone Number</Label>
                {isEditing ? (
                  <Input
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  />
                ) : (
                  <div className="flex items-center space-x-2 mt-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <p className="text-foreground">{profileData.phone}</p>
                  </div>
                )}
              </div>
              <div>
                <Label>Email Address</Label>
                {isEditing ? (
                  <Input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  />
                ) : (
                  <div className="flex items-center space-x-2 mt-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <p className="text-foreground">{profileData.email}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Certifications */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="w-5 h-5 mr-2 text-primary" />
              Certifications & Training
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {profileData.certifications.map((cert, idx) => (
                <div key={idx} className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <p className="text-sm text-foreground">{cert}</p>
                </div>
              ))}
            </div>
            {isEditing && (
              <Button variant="outline" size="sm" className="mt-3">
                <FileText className="w-3 h-3 mr-2" />
                Add Certification
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Verification Documents */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2 text-primary" />
              Verification Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-3">
                  Upload verification documents (License, Certificates, etc.)
                </p>
                <Button onClick={handleDocumentUpload} variant="outline" size="sm">
                  <Upload className="w-3 h-3 mr-2" />
                  Upload Documents
                </Button>
              </div>

              {/* Uploaded Documents */}
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm text-foreground">Medical License.pdf</p>
                      <p className="text-xs text-muted-foreground">Verified • Uploaded Oct 1, 2025</p>
                    </div>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm text-foreground">OB/GYN Certification.pdf</p>
                      <p className="text-xs text-muted-foreground">Verified • Uploaded Oct 1, 2025</p>
                    </div>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Practice Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-3xl text-primary mb-1">4</p>
                <p className="text-sm text-muted-foreground">Active Patients</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-3xl text-primary mb-1">24</p>
                <p className="text-sm text-muted-foreground">Consultations</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-3xl text-primary mb-1">4.9</p>
                <p className="text-sm text-muted-foreground">Rating</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-3xl text-primary mb-1">100%</p>
                <p className="text-sm text-muted-foreground">Success Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
