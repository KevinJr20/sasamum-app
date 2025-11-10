import React, { useState } from 'react';
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader } from "./ui/card";
import { SasaMumLogo } from "./SasaMum-Logo";
import api from "../lib/api";
import { useAuth } from "../contexts/AuthContext";
import AuthDebug from "./AuthDebug";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Calendar,
  ArrowLeft,
} from "lucide-react";

interface AuthFormsProps {
  onBack: () => void;
  onLoginSuccess: () => void;
  onForgotPassword: () => void;
  onProviderLogin?: () => void;
}

export function AuthForms({
  onBack,
  onLoginSuccess,
  onForgotPassword,
  onProviderLogin,
}: AuthFormsProps) {
  const auth = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [isProviderMode, setIsProviderMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    dueDate: "",
    facilityName: "",
    licenseNumber: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // If login mode, call backend
    if (isLogin) {
      api.post('/auth/login', { email: formData.email, password: formData.password })
        .then((resp) => {
          const data = resp.data || {};
          const token = data.token;
          const refresh = data.refreshToken || data.refresh;
          const user = data.user || null;

          if (token) {
            try { localStorage.setItem('userType', isProviderMode ? 'provider' : 'mother'); } catch (e) {}
            // Persist tokens and notify context
            try { localStorage.setItem('sasa_refresh', refresh || ''); } catch (e) {}
            auth.login(token, user, refresh);
          }

          // Continue app flow
          if (isProviderMode && onProviderLogin) onProviderLogin();
          else onLoginSuccess();
        })
        .catch((err) => {
          console.error('Login failed', err);
          // Fallback to simulated success if backend unreachable
          setTimeout(() => {
            try { localStorage.setItem('userType', isProviderMode ? 'provider' : 'mother'); } catch (e) {}
            if (isProviderMode && onProviderLogin) onProviderLogin();
            else onLoginSuccess();
          }, 700);
        });
      return;
    }

    // Registration / signup (still simulated for now)
    setTimeout(() => {
      if (isProviderMode && onProviderLogin) {
        // Store provider status in localStorage
        localStorage.setItem('userType', 'provider');
        localStorage.setItem('providerData', JSON.stringify({
          name: formData.name,
          email: formData.email,
          facilityName: formData.facilityName,
          licenseNumber: formData.licenseNumber
        }));
        onProviderLogin();
      } else {
        localStorage.setItem('userType', 'mother');
        onLoginSuccess();
      }
    }, 1000);
  };

  const handleGoogleLogin = () => {
    // In production, this would trigger Google OAuth
    localStorage.setItem('userType', isProviderMode ? 'provider' : 'mother');
    window.open('https://accounts.google.com/signin', '_blank', 'width=500,height=600');
    // Simulate success after OAuth
    setTimeout(() => {
      if (isProviderMode) {
        onProviderLogin?.();
      } else {
        onLoginSuccess();
      }
    }, 2000);
  };

  const handleFacebookLogin = () => {
    // In production, this would trigger Facebook OAuth
    localStorage.setItem('userType', isProviderMode ? 'provider' : 'mother');
    window.open('https://www.facebook.com/login', '_blank', 'width=500,height=600');
    // Simulate success after OAuth
    setTimeout(() => {
      if (isProviderMode) {
        onProviderLogin?.();
      } else {
        onLoginSuccess();
      }
    }, 2000);
  };

  const handleXLogin = () => {
    // In production, this would trigger X/Twitter OAuth
    localStorage.setItem('userType', isProviderMode ? 'provider' : 'mother');
    window.open('https://twitter.com/i/flow/login', '_blank', 'width=500,height=600');
    // Simulate success after OAuth
    setTimeout(() => {
      if (isProviderMode) {
        onProviderLogin?.();
      } else {
        onLoginSuccess();
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/30 p-4 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pt-2 pb-8">
        <button
          onClick={onBack}
          className="w-10 h-10 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center text-foreground hover:bg-card transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <SasaMumLogo size="sm" />
        <div className="w-10" /> {/* Spacer */}
      </div>

      {/* Form Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full"
      >
        <Card className="bg-card/95 backdrop-blur-sm border-border/50 shadow-xl">
          <CardHeader className="text-center space-y-4 pb-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-2xl text-foreground">
                {isProviderMode 
                  ? (isLogin ? "Welcome, Doctor" : "Healthcare Provider Registration")
                  : "Welcome, Mama"}
              </h2>
              <p className="text-muted-foreground mt-2">
                {isProviderMode
                  ? (isLogin ? "Access your healthcare provider portal" : "Join as a healthcare provider")
                  : (isLogin ? "Continue your beautiful journey with us" : "Begin your pregnancy journey with love and support")}
              </p>
              
              {/* Provider Toggle */}
              <div className="pt-3">
                <button
                  type="button"
                  onClick={() => setIsProviderMode(!isProviderMode)}
                  className="text-sm text-primary hover:underline"
                >
                  {isProviderMode ? "Sign in as a mother" : "I'm a healthcare provider"}
                </button>
              </div>
            </motion.div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="text-foreground"
                    >
                      {isProviderMode ? "Full Name" : "Your Beautiful Name"}
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange(
                            "name",
                            e.target.value,
                          )
                        }
                        className="pl-10 bg-input-background border-border/50 focus:border-primary"
                      />
                    </div>
                  </div>

                  {isProviderMode && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="facilityName" className="text-foreground">
                          Facility/Clinic Name
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <Input
                            id="facilityName"
                            type="text"
                            placeholder="Enter facility name"
                            value={formData.facilityName}
                            onChange={(e) =>
                              handleInputChange("facilityName", e.target.value)
                            }
                            className="pl-10 bg-input-background border-border/50 focus:border-primary"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="licenseNumber" className="text-foreground">
                          Medical License Number
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <Input
                            id="licenseNumber"
                            type="text"
                            placeholder="Enter license number"
                            value={formData.licenseNumber}
                            onChange={(e) =>
                              handleInputChange("licenseNumber", e.target.value)
                            }
                            className="pl-10 bg-input-background border-border/50 focus:border-primary"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              )}

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-foreground"
                >
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="mama@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      handleInputChange("email", e.target.value)
                    }
                    className="pl-10 bg-input-background border-border/50 focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-foreground"
                >
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange(
                        "password",
                        e.target.value,
                      )
                    }
                    className="pl-10 pr-10 bg-input-background border-border/50 focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="space-y-2"
                >
                  <Label
                    htmlFor="dueDate"
                    className="text-foreground"
                  >
                    Expected Due Date
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="dueDate"
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) =>
                        handleInputChange(
                          "dueDate",
                          e.target.value,
                        )
                      }
                      className="pl-10 bg-input-background border-border/50 focus:border-primary"
                    />
                  </div>
                </motion.div>
              )}

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6"
                size="lg"
              >
                {isProviderMode 
                  ? (isLogin ? "Access Provider Portal" : "Register as Provider")
                  : (isLogin ? "Welcome Home, Mama" : "Begin My Journey")}
              </Button>
            </form>

            {isLogin && (
              <div className="text-center">
                <button 
                  type="button"
                  onClick={onForgotPassword}
                  className="text-sm text-primary hover:underline"
                >
                  Forgot your password?
                </button>
              </div>
            )}

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-card px-4 text-muted-foreground">
                  or continue with
                </span>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="w-14 h-14 rounded-full border-2 hover:scale-110 transition-transform"
                onClick={handleGoogleLogin}
              >
                <svg
                  className="w-7 h-7"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="w-14 h-14 rounded-full border-2 hover:scale-110 transition-transform"
                onClick={handleFacebookLogin}
              >
                <svg
                  className="w-7 h-7"
                  fill="#1877F2"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="w-14 h-14 rounded-full border-2 hover:scale-110 transition-transform"
                onClick={handleXLogin}
              >
                <svg
                  className="w-7 h-7"
                  fill="#000000"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {isLogin
                  ? "New to our family? "
                  : "Already part of our family? "}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary hover:underline"
                >
                  {isLogin ? "Join us here" : "Sign in here"}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Bottom Message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-center pt-6 pb-4"
      >
        <p className="text-sm text-muted-foreground">
          "It takes a village to raise a child. Let us be your
          village." 💝
        </p>
      </motion.div>
    </div>
  );
}
