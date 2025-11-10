import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Separator } from './ui/separator';
import { toast } from 'sonner@2.0.3';
import { 
  Stethoscope, Shield, Mail, Lock, User, Phone, Building, Award,
  Eye, EyeOff, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle
} from 'lucide-react';

interface ProviderAuthFlowProps {
  onComplete: (providerData: any) => void;
  onBack: () => void;
}

export function ProviderAuthFlow({ onComplete, onBack }: ProviderAuthFlowProps) {
  const [mode, setMode] = useState<'choice' | 'login' | 'signup'>('choice');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    specialty: '',
    licenseNumber: '',
    facilityName: '',
    agreeToTerms: false
  });

  const specialties = [
    'Obstetrician/Gynecologist',
    'Midwife',
    'Maternal-Fetal Medicine Specialist',
    'Pediatrician',
    'Nurse Practitioner',
    'Nutritionist',
    'Mental Health Counselor'
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleSocialAuth = (provider: string) => {
    setLoading(true);
    toast.info(`${provider} authentication would be handled here`);
    
    // Simulate social auth
    setTimeout(() => {
      const mockProviderData = {
        fullName: 'Dr. Carol Odhiambo',
        email: 'carol.odhiambo@hospital.co.ke',
        phone: '+254 722 123 456',
        specialty: 'Obstetrician/Gynecologist',
        facilityName: 'Kenyatta National Hospital',
        licenseNumber: 'KEN-DOC-2018-1234',
        verified: true,
        authProvider: provider
      };
      
      localStorage.setItem('providerData', JSON.stringify(mockProviderData));
      localStorage.setItem('userType', 'provider');
      toast.success(`Successfully authenticated with ${provider}`);
      setLoading(false);
      onComplete(mockProviderData);
    }, 1500);
  };

  const handleLogin = () => {
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!validateEmail(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    
    // Simulate login
    setTimeout(() => {
      const mockProviderData = {
        fullName: 'Dr. Carol Odhiambo',
        email: formData.email,
        phone: '+254 722 123 456',
        specialty: 'Obstetrician/Gynecologist',
        facilityName: 'Kenyatta National Hospital',
        licenseNumber: 'KEN-DOC-2018-1234',
        verified: true
      };
      
      localStorage.setItem('providerData', JSON.stringify(mockProviderData));
      localStorage.setItem('userType', 'provider');
      toast.success('Login successful!');
      setLoading(false);
      onComplete(mockProviderData);
    }, 1500);
  };

  const handleSignup = () => {
    if (!formData.fullName || !formData.email || !formData.phone || 
        !formData.password || !formData.specialty || !formData.licenseNumber || 
        !formData.facilityName) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!validateEmail(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (!validatePassword(formData.password)) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!formData.agreeToTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }

    setLoading(true);
    
    // Simulate signup
    setTimeout(() => {
      const newProviderData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        specialty: formData.specialty,
        facilityName: formData.facilityName,
        licenseNumber: formData.licenseNumber,
        verified: false, // Requires verification
        newAccount: true
      };
      
      localStorage.setItem('providerData', JSON.stringify(newProviderData));
      localStorage.setItem('userType', 'provider');
      toast.success('Account created! Please verify your credentials.');
      setLoading(false);
      onComplete(newProviderData);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center p-4"
    >
      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          {/* Choice Screen */}
          {mode === 'choice' && (
            <motion.div
              key="choice"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center space-y-3">
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Shield className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <h1 className="text-2xl text-foreground">Healthcare Provider Portal</h1>
                <p className="text-sm text-muted-foreground">
                  Join SasaMum to provide quality maternal healthcare to Kenyan mothers
                </p>
              </div>

              <Card className="border-border">
                <CardContent className="p-6 space-y-4">
                  <Button
                    onClick={() => setMode('login')}
                    className="w-full bg-primary hover:bg-primary/90 h-12"
                  >
                    <Stethoscope className="w-5 h-5 mr-2" />
                    Sign In as Provider
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">Or</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => setMode('signup')}
                    variant="outline"
                    className="w-full h-12"
                  >
                    <User className="w-5 h-5 mr-2" />
                    Create Provider Account
                  </Button>

                  <Button
                    onClick={onBack}
                    variant="ghost"
                    className="w-full text-muted-foreground"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Main Login
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Login Screen */}
          {mode === 'login' && (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Stethoscope className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <h2 className="text-xl text-foreground">Provider Sign In</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Access your provider dashboard
                </p>
              </div>

              <Card className="border-border">
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-3">
                    <Label>Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="doctor@hospital.co.ke"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        placeholder="Enter your password"
                        className="pl-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                    {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <Button
                      variant="outline"
                      onClick={() => handleSocialAuth('Google')}
                      disabled={loading}
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleSocialAuth('Facebook')}
                      disabled={loading}
                    >
                      <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleSocialAuth('X')}
                      disabled={loading}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{' '}
                  <button
                    onClick={() => setMode('signup')}
                    className="text-primary hover:underline"
                  >
                    Sign up
                  </button>
                </p>
                <button
                  onClick={() => setMode('choice')}
                  className="text-sm text-muted-foreground hover:text-foreground mt-2"
                >
                  <ArrowLeft className="w-3 h-3 inline mr-1" />
                  Back
                </button>
              </div>
            </motion.div>
          )}

          {/* Signup Screen */}
          {mode === 'signup' && (
            <motion.div
              key="signup"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <h2 className="text-xl text-foreground">Create Provider Account</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Join the SasaMum healthcare network
                </p>
              </div>

              <Card className="border-border max-h-[70vh] overflow-y-auto">
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-3">
                    <Label>Full Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        placeholder="Dr. Sarah Wanjiru"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Email Address *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="doctor@hospital.co.ke"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Phone Number *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+254 712 345 678"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Specialty *</Label>
                    <div className="relative">
                      <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
                      <select
                        value={formData.specialty}
                        onChange={(e) => handleInputChange('specialty', e.target.value)}
                        className="w-full h-10 pl-10 pr-3 bg-background border border-border rounded-md text-foreground appearance-none"
                      >
                        <option value="">Select specialty</option>
                        {specialties.map(spec => (
                          <option key={spec} value={spec}>{spec}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Medical License Number *</Label>
                    <div className="relative">
                      <Award className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        value={formData.licenseNumber}
                        onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                        placeholder="KEN-DOC-2020-1234"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Facility Name *</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        value={formData.facilityName}
                        onChange={(e) => handleInputChange('facilityName', e.target.value)}
                        placeholder="Kenyatta National Hospital"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Password *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        placeholder="Minimum 8 characters"
                        className="pl-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Confirm Password *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        placeholder="Re-enter password"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="flex items-start space-x-2 pt-2">
                    <Checkbox
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked)}
                      className="mt-1"
                    />
                    <label className="text-sm text-muted-foreground leading-tight">
                      I agree to the Terms of Service and Privacy Policy. I confirm that I am a licensed healthcare provider.
                    </label>
                  </div>

                  <Button
                    onClick={handleSignup}
                    disabled={loading}
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    {loading ? 'Creating account...' : 'Create Account'}
                    {!loading && <CheckCircle2 className="w-4 h-4 ml-2" />}
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">Or sign up with</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <Button
                      variant="outline"
                      onClick={() => handleSocialAuth('Google')}
                      disabled={loading}
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleSocialAuth('Facebook')}
                      disabled={loading}
                    >
                      <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleSocialAuth('X')}
                      disabled={loading}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <button
                    onClick={() => setMode('login')}
                    className="text-primary hover:underline"
                  >
                    Sign in
                  </button>
                </p>
                <button
                  onClick={() => setMode('choice')}
                  className="text-sm text-muted-foreground hover:text-foreground mt-2"
                >
                  <ArrowLeft className="w-3 h-3 inline mr-1" />
                  Back
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
