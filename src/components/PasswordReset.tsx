import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader } from './ui/card';
import { SasaMumLogo } from './SasaMum-Logo';
import { ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';

interface PasswordResetProps {
  onBack: () => void;
}

export function PasswordReset({ onBack }: PasswordResetProps) {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/30 p-4 flex flex-col">
      {/* Header */}
      <div className="page-header flex items-center justify-between p-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onBack}
          className="p-2"
        >
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </Button>
        <SasaMumLogo size="sm" />
        <div className="w-10" />
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {!isSubmitted ? (
            <Card className="border-border/50 bg-card/95 backdrop-blur-sm">
              <CardHeader className="space-y-2 pb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-center text-foreground">Reset Your Password</h2>
                <p className="text-center text-sm text-muted-foreground">
                  Enter your email address and we'll send you a link to reset your password
                </p>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email" className="text-foreground">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="reset-email"
                        type="email"
                        placeholder="mama@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="pl-10 bg-input-background border-border/50 focus:border-primary"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6"
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Sending...' : 'Send Reset Link'}
                  </Button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={onBack}
                      className="text-sm text-primary hover:underline"
                    >
                      Back to Sign In
                    </button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-border/50 bg-card/95 backdrop-blur-sm">
              <CardContent className="p-8 text-center space-y-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', duration: 0.6 }}
                  className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto"
                >
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </motion.div>

                <h3 className="text-foreground">Check Your Email</h3>
                <p className="text-sm text-muted-foreground">
                  We've sent a password reset link to <strong className="text-foreground">{email}</strong>
                </p>
                <p className="text-sm text-muted-foreground">
                  Click the link in the email to reset your password. The link will expire in 1 hour.
                </p>

                <div className="pt-4 space-y-2">
                  <Button
                    onClick={onBack}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Back to Sign In
                  </Button>
                  
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="text-sm text-primary hover:underline"
                  >
                    Didn't receive the email? Resend
                  </button>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>

      <div className="text-center pb-4">
        <p className="text-xs text-muted-foreground">
          If you continue to have issues, contact our support team
        </p>
      </div>
    </div>
  );
}
