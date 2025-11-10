import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { toast } from 'sonner@2.0.3';
import {
  ArrowLeft, Bell, Moon, Sun, Globe, Lock, Shield, LogOut,
  Smartphone, Mail, Clock, AlertTriangle, Download, Trash2,
  CheckCircle2, Info, Settings as SettingsIcon
} from 'lucide-react';

interface ProviderSettingsPageProps {
  onBack: () => void;
  onSignOut: () => void;
}

export function ProviderSettingsPage({ onBack, onSignOut }: ProviderSettingsPageProps) {
  const [settings, setSettings] = useState({
    // Notifications
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    urgentAlerts: true,
    appointmentReminders: true,
    labResultNotifications: true,
    
    // Appearance
    theme: 'system',
    language: 'en',
    
    // Privacy & Security
    twoFactorAuth: false,
    sessionTimeout: '30',
    
    // Working Hours
    startTime: '08:00',
    endTime: '17:00',
    
    // Auto-response
    autoResponse: false,
    autoResponseMessage: 'Thank you for your message. I will respond as soon as possible during my working hours (8 AM - 5 PM).'
  });

  const handleSave = () => {
    localStorage.setItem('providerSettings', JSON.stringify(settings));
    toast.success('Settings saved successfully');
  };

  const handleSignOut = () => {
    if (confirm('Are you sure you want to sign out?')) {
      localStorage.clear();
      onSignOut();
    }
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      toast.error('Account deletion requested. Please contact support to proceed.');
    }
  };

  const handleExportData = () => {
    toast.info('Exporting your data... This may take a few moments.');
    setTimeout(() => {
      toast.success('Data export ready for download');
    }, 2000);
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
              <h1 className="text-foreground">Settings</h1>
              <p className="text-xs text-muted-foreground">Manage your preferences</p>
            </div>
          </div>
          <Button onClick={handleSave} className="bg-primary">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Notifications */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="w-5 h-5 mr-2 text-primary" />
              Notifications
            </CardTitle>
            <CardDescription>Manage how you receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-foreground">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive updates via email</p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-foreground">SMS Notifications</p>
                <p className="text-sm text-muted-foreground">Receive text message alerts</p>
              </div>
              <Switch
                checked={settings.smsNotifications}
                onCheckedChange={(checked) => setSettings({ ...settings, smsNotifications: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-foreground">Push Notifications</p>
                <p className="text-sm text-muted-foreground">Receive in-app notifications</p>
              </div>
              <Switch
                checked={settings.pushNotifications}
                onCheckedChange={(checked) => setSettings({ ...settings, pushNotifications: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <div>
                  <p className="text-foreground">Urgent Patient Alerts</p>
                  <p className="text-sm text-muted-foreground">Critical condition notifications</p>
                </div>
              </div>
              <Switch
                checked={settings.urgentAlerts}
                onCheckedChange={(checked) => setSettings({ ...settings, urgentAlerts: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-foreground">Appointment Reminders</p>
                <p className="text-sm text-muted-foreground">Get reminded about upcoming appointments</p>
              </div>
              <Switch
                checked={settings.appointmentReminders}
                onCheckedChange={(checked) => setSettings({ ...settings, appointmentReminders: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-foreground">Lab Result Notifications</p>
                <p className="text-sm text-muted-foreground">Alerts when lab results are ready</p>
              </div>
              <Switch
                checked={settings.labResultNotifications}
                onCheckedChange={(checked) => setSettings({ ...settings, labResultNotifications: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sun className="w-5 h-5 mr-2 text-primary" />
              Appearance
            </CardTitle>
            <CardDescription>Customize how the app looks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Theme</Label>
              <Select value={settings.theme} onValueChange={(value) => setSettings({ ...settings, theme: value })}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">
                    <div className="flex items-center">
                      <Sun className="w-4 h-4 mr-2" />
                      Light
                    </div>
                  </SelectItem>
                  <SelectItem value="dark">
                    <div className="flex items-center">
                      <Moon className="w-4 h-4 mr-2" />
                      Dark
                    </div>
                  </SelectItem>
                  <SelectItem value="system">
                    <div className="flex items-center">
                      <Smartphone className="w-4 h-4 mr-2" />
                      Follow System
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Language</Label>
              <Select value={settings.language} onValueChange={(value) => setSettings({ ...settings, language: value })}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">
                    <div className="flex items-center">
                      <Globe className="w-4 h-4 mr-2" />
                      English
                    </div>
                  </SelectItem>
                  <SelectItem value="sw">Kiswahili</SelectItem>
                  <SelectItem value="luo">Dholuo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Working Hours */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2 text-primary" />
              Working Hours
            </CardTitle>
            <CardDescription>Set your availability hours</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Time</Label>
                <Input
                  type="time"
                  value={settings.startTime}
                  onChange={(e) => setSettings({ ...settings, startTime: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>End Time</Label>
                <Input
                  type="time"
                  value={settings.endTime}
                  onChange={(e) => setSettings({ ...settings, endTime: e.target.value })}
                  className="mt-2"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-foreground">Auto-Response</p>
                <p className="text-sm text-muted-foreground">Send automatic replies outside working hours</p>
              </div>
              <Switch
                checked={settings.autoResponse}
                onCheckedChange={(checked) => setSettings({ ...settings, autoResponse: checked })}
              />
            </div>
            {settings.autoResponse && (
              <div>
                <Label>Auto-Response Message</Label>
                <Input
                  value={settings.autoResponseMessage}
                  onChange={(e) => setSettings({ ...settings, autoResponseMessage: e.target.value })}
                  className="mt-2"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2 text-primary" />
              Privacy & Security
            </CardTitle>
            <CardDescription>Manage your security preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-foreground">Two-Factor Authentication</p>
                <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
              </div>
              <Switch
                checked={settings.twoFactorAuth}
                onCheckedChange={(checked) => setSettings({ ...settings, twoFactorAuth: checked })}
              />
            </div>
            <Separator />
            <div>
              <Label>Session Timeout</Label>
              <Select value={settings.sessionTimeout} onValueChange={(value) => setSettings({ ...settings, sessionTimeout: value })}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="never">Never</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Separator />
            <div>
              <Button variant="outline" onClick={handleExportData} className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Export My Data
              </Button>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Download a copy of your data for your records
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Account Management */}
        <Card className="border-border border-red-200 dark:border-red-900">
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Account Management
            </CardTitle>
            <CardDescription>Manage your account settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="w-full border-orange-200 dark:border-orange-900 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/20"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Sign out from this device
              </p>
            </div>
            <Separator />
            <div>
              <Button
                variant="outline"
                onClick={handleDeleteAccount}
                className="w-full border-red-200 dark:border-red-900 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
              <p className="text-xs text-red-600 mt-2 text-center">
                ⚠️ This action is permanent and cannot be undone
              </p>
            </div>
          </CardContent>
        </Card>

        {/* App Information */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Info className="w-5 h-5 mr-2 text-primary" />
              App Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between py-2">
              <span className="text-muted-foreground">Version</span>
              <span className="text-foreground">2.5.0</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between py-2">
              <span className="text-muted-foreground">Last Updated</span>
              <span className="text-foreground">October 16, 2025</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between py-2">
              <span className="text-muted-foreground">Platform</span>
              <span className="text-foreground">SasaMum Provider Portal</span>
            </div>
          </CardContent>
        </Card>

        {/* Legal & Support */}
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" size="sm">Terms of Service</Button>
              <Button variant="outline" size="sm">Privacy Policy</Button>
              <Button variant="outline" size="sm">Help Center</Button>
              <Button variant="outline" size="sm">Contact Support</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
