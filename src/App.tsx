import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeProvider } from "./components/ThemeProvider";
import { LanguageProvider } from "./components/LanguageProvider";
import { Toaster } from "./components/ui/sonner";
import { FloatingElements } from "./components/FloatingElements";
import { SasaMumLogo } from "./components/SasaMum-Logo";
import type { UserData as OnboardUserData } from "./components/UserOnboarding";
import type { ProviderData as ProviderOnboardData } from "./components/ProviderOnboarding";
import { WelcomeCarousel } from "./components/WelcomeCarousel";
import { AuthForms } from "./components/AuthForms";
import { PasswordReset } from "./components/PasswordReset";
import { UserOnboarding } from "./components/UserOnboarding";
import { ProviderOnboarding } from "./components/ProviderOnboarding";
import { Dashboard } from "./components/Dashboard";
import { DetailedCalendarPage } from "./components/DetailedCalendarPage";
import { HospitalsMap } from "./components/HospitalsMap";
import { ChatList } from "./components/ChatList";
import { ChatScreen } from "./components/ChatScreen";
import { SuperEnhancedProfilePage } from "./components/SuperEnhancedProfilePage";
import { PhotoJournal } from "./components/PhotoJournal";
import { FoodNutritionPage } from "./components/FoodNutritionPage";
import { BabyTracker } from "./components/BabyTracker";
import { SasaMumMarketplace } from "./components/SasaMumMarketplace";
import { HealthSymptomGuide } from "./components/HealthSymptomGuide";
import { MentalHealthCheck } from "./components/MentalHealthCheck";
import { ArticlesVideosPage } from "./components/ArticlesVideosPage";
import { SettingsPage } from "./components/SettingsPage";
import { PregnancyBuddySystem } from "./components/PregnancyBuddySystem";
import { ContractionMonitor } from "./components/ContractionMonitor";
import { EmergencyTransport } from "./components/EmergencyTransport";
import { ChildcareServices } from "./components/ChildcareServices";
import { RevampedProviderPortal } from "./components/RevampedProviderPortal";
import { MedicationReminders } from "./components/MedicationReminders";
import { PregnancyComplicationsSupport } from "./components/PregnancyComplicationsSupport";
import { VitalsTracking } from "./components/VitalsTracking";
import { EmergencyAlertSystem } from "./components/EmergencyAlertSystem";
import { BirthPreparednessToolkit } from "./components/BirthPreparednessToolkit";
import { AIRiskPrediction } from "./components/AIRiskPrediction";
import { EnhancedVoiceNavigation } from "./components/EnhancedVoiceNavigation";
import { CHWPortal } from "./components/CHWPortal";
import { SmartAppointmentScheduler } from "./components/SmartAppointmentScheduler";
import { SuperGamifiedEducation } from "./components/SuperGamifiedEducation";
import { DigitalServices } from "./components/DigitalServices";
import { EnhancedDeliveryPlanning } from "./components/EnhancedDeliveryPlanning";
import { WearablesIntegration } from "./components/WearablesIntegration";
import { ImpactTracker } from "./components/ImpactTracker";
import { SasaMumAI } from "./components/SasaMumAI";
import { BottomNavigation } from "./components/BottomNavigation";
import { Button } from "./components/ui/button";
import { Heart, Sparkles } from "lucide-react";

// Use onboarding types from the onboarding components to keep shapes consistent

type AppScreen =
  | "splash"
  | "welcome"
  | "auth"
  | "password-reset"
  | "onboarding"
  | "provider-onboarding"
  | "provider-auth"
  | "dashboard"
  | "calendar"
  | "hospitals"
  | "chat"
  | "chat-screen"
  | "profile"
  | "photos"
  | "food"
  | "baby-tracker"
  | "marketplace"
  | "health-symptom-guide"
  | "mental-health"
  | "articles-videos"
  | "settings"
  | "buddy-system"
  | "contractions"
  | "transport"
  | "childcare"
  | "provider-portal"
  | "medications"
  | "complications"
  | "vitals"
  | "emergency-alert"
  | "birth-preparedness"
  | "ai-risk"
  | "voice-nav"
  | "chw-portal"
  | "appointments"
  | "gamified-edu"
  | "digital-services"
  | "delivery-plan"
  | "wearables"
  | "impact";

export default function App() {
  const [currentScreen, setCurrentScreen] =
    useState<AppScreen>("splash");
  const [selectedChatId, setSelectedChatId] =
    useState<string>("");
  const [screenHistory, setScreenHistory] = useState<
    AppScreen[]
  >([]);
  const scrollContainerRef = React.useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Whenever the screen changes, make sure the scroll container is at top.
    try {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ top: 0, left: 0 });
      } else {
        window.scrollTo(0, 0);
      }
    } catch (e) {}

    // Auto-advance from splash to welcome after 10 seconds
    if (currentScreen === "splash") {
      const timer = setTimeout(() => {
        // If there's an existing session token, skip straight into the app
        const token = localStorage.getItem("sasa_token");
        if (token) {
          const userType = localStorage.getItem("userType");
          const hasCompletedOnboarding = localStorage.getItem(
            "hasCompletedOnboarding",
          );
          const hasCompletedProviderOnboarding = localStorage.getItem(
            "hasCompletedProviderOnboarding",
          );

          if (userType === "provider") {
            if (hasCompletedProviderOnboarding) setCurrentScreen("provider-portal");
            else setCurrentScreen("provider-onboarding");
          } else if (hasCompletedOnboarding) {
            setCurrentScreen("dashboard");
          } else {
            setCurrentScreen("onboarding");
          }
        } else {
          setCurrentScreen("welcome");
        }
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  const handleGetStarted = () => {
    setCurrentScreen("auth");
  };

  const handleBackToWelcome = () => {
    setCurrentScreen("welcome");
  };

  const handleForgotPassword = () => {
    setCurrentScreen("password-reset");
  };

  const handleBackToAuth = () => {
    setCurrentScreen("auth");
  };

  const handleLoginSuccess = () => {
    // Check if user has completed onboarding
    const userType = localStorage.getItem("userType");
    const hasCompletedOnboarding = localStorage.getItem(
      "hasCompletedOnboarding",
    );
    const hasCompletedProviderOnboarding = localStorage.getItem(
      "hasCompletedProviderOnboarding",
    );

    if (userType === "provider") {
      if (hasCompletedProviderOnboarding) {
        setCurrentScreen("provider-portal");
      } else {
        setCurrentScreen("provider-onboarding");
      }
    } else if (hasCompletedOnboarding) {
      setCurrentScreen("dashboard");
    } else {
      setCurrentScreen("onboarding");
    }
  };

  const handleOnboardingComplete = (data: OnboardUserData) => {
    // Save user data
    localStorage.setItem("userData", JSON.stringify(data));
    localStorage.setItem("hasCompletedOnboarding", "true");
    setCurrentScreen("dashboard");
  };

  const handleOnboardingSkip = () => {
    localStorage.setItem("hasCompletedOnboarding", "true");
    setCurrentScreen("dashboard");
  };

  const handleProviderLogin = () => {
    localStorage.setItem("userType", "provider");
    const hasCompletedProviderOnboarding = localStorage.getItem(
      "hasCompletedProviderOnboarding",
    );
    if (hasCompletedProviderOnboarding) {
      setCurrentScreen("provider-portal");
    } else {
      setCurrentScreen("provider-onboarding");
    }
  };

  const handleProviderOnboardingComplete = (
    data: ProviderOnboardData,
  ) => {
    localStorage.setItem("providerData", JSON.stringify(data));
    localStorage.setItem(
      "hasCompletedProviderOnboarding",
      "true",
    );
    setCurrentScreen("provider-portal");
  };

  const handleProviderOnboardingSkip = () => {
    localStorage.setItem(
      "hasCompletedProviderOnboarding",
      "true",
    );
    setCurrentScreen("provider-portal");
  };

  const handleNavigateToCalendar = () => {
    setCurrentScreen("calendar");
  };

  const handleNavigateToChat = () => {
    setCurrentScreen("chat");
  };

  const handleNavigateToProfile = () => {
    setCurrentScreen("profile");
  };

  const handleNavigateToPhotos = () => {
    setCurrentScreen("photos");
  };

  const handleNavigateToFood = () => {
    setCurrentScreen("food");
  };

  const handleNavigateToBabyTracker = () => {
    setCurrentScreen("baby-tracker");
  };

  const handleNavigateToMarketplace = () => {
    setCurrentScreen("marketplace");
  };

  const handleNavigateToSymptoms = () => {
    setCurrentScreen("health-symptom-guide");
  };

  const handleNavigateToMentalHealth = () => {
    setCurrentScreen("mental-health");
  };

  const handleNavigateToEmergency = () => {
    setCurrentScreen("health-symptom-guide");
  };

  const handleNavigateToArticlesVideos = () => {
    setCurrentScreen("articles-videos");
  };

  const handleNavigateToSettings = () => {
    setCurrentScreen("settings");
  };

  const handleNavigateToBuddySystem = () => {
    setCurrentScreen("buddy-system");
  };

  const handleNavigateToContractions = () => {
    setCurrentScreen("contractions");
  };

  const handleNavigateToTransport = () => {
    setCurrentScreen("transport");
  };

  const handleNavigateToChildcare = () => {
    setCurrentScreen("childcare");
  };

  const handleNavigateToAIAssistant = () => {
    // AI Assistant is now a FAB - no navigation needed
    // setCurrentScreen('ai-assistant');
  };

  const handleNavigateToProviderPortal = () => {
    setCurrentScreen("provider-portal");
  };

  const handleNavigateToMedications = () => {
    setCurrentScreen("medications");
  };

  const handleNavigateToComplications = () => {
    setCurrentScreen("complications");
  };

  const handleNavigateToVitals = () => {
    setCurrentScreen("vitals");
  };

  const handleNavigateToEmergencyAlert = () => {
    setCurrentScreen("emergency-alert");
  };

  const handleNavigateToBirthPreparedness = () => {
    setCurrentScreen("birth-preparedness");
  };

  const handleNavigateToAIRisk = () => {
    setCurrentScreen("ai-risk");
  };

  const handleNavigateToVoiceNav = () => {
    setCurrentScreen("voice-nav");
  };

  const handleNavigateToCHWPortal = () => {
    setCurrentScreen("chw-portal");
  };

  const handleNavigateToAppointments = () => {
    setCurrentScreen("appointments");
  };

  const handleNavigateToGamifiedEdu = () => {
    setCurrentScreen("gamified-edu");
  };

  const handleNavigateToBirthCert = () => {
    setCurrentScreen("digital-services");
  };

  const handleNavigateToDeliveryPlan = () => {
    setCurrentScreen("delivery-plan");
  };

  const handleNavigateToWearables = () => {
    setCurrentScreen("wearables");
  };

  const handleNavigateToImpact = () => {
    setCurrentScreen("impact");
  };

  const handleNavigateToChatbot = () => {
    // Chatbot is now part of SasaMum AI FAB
    // setCurrentScreen('chatbot');
  };

  const handleSignOut = () => {
    // Clear any user session data here if needed
    setCurrentScreen("auth");
  };

  const handleBackToDashboard = () => {
    setCurrentScreen("dashboard");
  };

  const navigateWithHistory = (screen: AppScreen) => {
    setScreenHistory([...screenHistory, currentScreen]);
    setCurrentScreen(screen);
  };

  // Use navigation helper to compute back target and pop history
  const handleBack = () => {
    // lazy-import to avoid circular issues in type-only contexts
    const { getBackTarget, popHistory } = require('./lib/navigation');
    const target = getBackTarget(screenHistory, 'dashboard');
    if (screenHistory.length > 0) {
      setScreenHistory(popHistory(screenHistory));
    }
    setCurrentScreen(target as AppScreen);
  };

  // Direct navigation handlers for bottom nav
  const handleNavigateToHome = () => {
    setCurrentScreen("dashboard");
  };

  const handleNavigateToHospitals = () => {
    setCurrentScreen("hospitals");
  };

  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId);
    setCurrentScreen("chat-screen");
  };

  const handleBackToChat = () => {
    setCurrentScreen("chat");
  };

  return (
    <ThemeProvider>
      <LanguageProvider>
        <Toaster />
        <div className="relative min-h-screen w-full bg-background overflow-hidden">
          <div className="w-full max-w-[480px] sm:max-w-[640px] md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1280px] mx-auto">
            {currentScreen !== "dashboard" && (
              <FloatingElements />
            )}

            {/* Make the app content scrollable while headers remain sticky. */}
            <div ref={scrollContainerRef} className="page-with-header h-screen overflow-y-auto">
              <AnimatePresence mode="wait">
              {currentScreen === "splash" && (
                <SplashScreen key="splash" />
              )}

              {currentScreen === "welcome" && (
                <WelcomeScreen
                  key="welcome"
                  onGetStarted={handleGetStarted}
                />
              )}

              {currentScreen === "auth" && (
                <AuthForms
                  key="auth"
                  onBack={handleBackToWelcome}
                  onLoginSuccess={handleLoginSuccess}
                  onForgotPassword={handleForgotPassword}
                  onProviderLogin={handleProviderLogin}
                />
              )}

              {currentScreen === "password-reset" && (
                <PasswordReset
                  key="password-reset"
                  onBack={handleBackToAuth}
                />
              )}

              {currentScreen === "onboarding" && (
                <UserOnboarding
                  key="onboarding"
                  onComplete={handleOnboardingComplete}
                  onSkip={handleOnboardingSkip}
                />
              )}

              {currentScreen === "provider-onboarding" && (
                <ProviderOnboarding
                  key="provider-onboarding"
                  onComplete={handleProviderOnboardingComplete}
                  onSkip={handleProviderOnboardingSkip}
                />
              )}

              {currentScreen === "dashboard" && (
                <Dashboard
                  key="dashboard"
                  onNavigateToCalendar={
                    handleNavigateToCalendar
                  }
                  onNavigateToHospitals={
                    handleNavigateToHospitals
                  }
                  onNavigateToChat={handleNavigateToChat}
                  onNavigateToProfile={handleNavigateToProfile}
                  onNavigateToPhotos={handleNavigateToPhotos}
                  onNavigateToFood={handleNavigateToFood}
                  onNavigateToBabyTracker={
                    handleNavigateToBabyTracker
                  }
                  onNavigateToMarketplace={
                    handleNavigateToMarketplace
                  }
                  onNavigateToSymptoms={
                    handleNavigateToSymptoms
                  }
                  onNavigateToMentalHealth={
                    handleNavigateToMentalHealth
                  }
                  onNavigateToEmergency={
                    handleNavigateToEmergency
                  }
                  onNavigateToContractions={
                    handleNavigateToContractions
                  }
                  onNavigateToTransport={
                    handleNavigateToTransport
                  }
                  onNavigateToChildcare={
                    handleNavigateToChildcare
                  }
                  onNavigateToSettings={
                    handleNavigateToSettings
                  }
                  onNavigateToAIAssistant={
                    handleNavigateToAIAssistant
                  }
                  onNavigateToProviderPortal={
                    handleNavigateToProviderPortal
                  }
                  onNavigateToBuddySystem={
                    handleNavigateToBuddySystem
                  }
                  onNavigateToArticlesVideos={
                    handleNavigateToArticlesVideos
                  }
                  onNavigateToMedications={
                    handleNavigateToMedications
                  }
                  onNavigateToComplications={
                    handleNavigateToComplications
                  }
                  onNavigateToVitals={handleNavigateToVitals}
                  onNavigateToEmergencyAlert={
                    handleNavigateToEmergencyAlert
                  }
                  onNavigateToBirthPreparedness={
                    handleNavigateToBirthPreparedness
                  }
                  onNavigateToAIRisk={handleNavigateToAIRisk}
                  onNavigateToVoiceNav={
                    handleNavigateToVoiceNav
                  }
                  onNavigateToCHWPortal={
                    handleNavigateToCHWPortal
                  }
                  onNavigateToAppointments={
                    handleNavigateToAppointments
                  }
                  onNavigateToGamifiedEdu={
                    handleNavigateToGamifiedEdu
                  }
                  onNavigateToBirthCert={
                    handleNavigateToBirthCert
                  }
                  onNavigateToDeliveryPlan={
                    handleNavigateToDeliveryPlan
                  }
                  onNavigateToWearables={
                    handleNavigateToWearables
                  }
                  onNavigateToImpact={handleNavigateToImpact}
                  onNavigateToChatbot={handleNavigateToChatbot}
                  onSignOut={handleSignOut}
                />
              )}

              {currentScreen === "calendar" && (
                <DetailedCalendarPage
                  key="calendar"
                  onBack={handleBack}
                />
              )}

              {currentScreen === "hospitals" && (
                <HospitalsMap
                  key="hospitals"
                  onBack={handleBack}
                  onNavigate={(screen) =>
                    setCurrentScreen(screen as AppScreen)
                  }
                />
              )}

              {currentScreen === "chat" && (
                <ChatList
                  key="chat"
                  onBack={handleBack}
                  onChatSelect={handleChatSelect}
                />
              )}

              {currentScreen === "chat-screen" && (
                <ChatScreen
                  key="chat-screen"
                  chatId={selectedChatId}
                  onBack={handleBackToChat}
                />
              )}

              {currentScreen === "profile" && (
                <SuperEnhancedProfilePage
                  key="profile"
                  onBack={handleBack}
                />
              )}

              {currentScreen === "photos" && (
                <PhotoJournal
                  key="photos"
                  onBack={handleBack}
                />
              )}

              {currentScreen === "food" && (
                <FoodNutritionPage
                  key="food"
                  onBack={handleBack}
                />
              )}

              {currentScreen === "baby-tracker" && (
                <BabyTracker
                  key="baby-tracker"
                  onBack={handleBack}
                />
              )}

              {currentScreen === "marketplace" && (
                <SasaMumMarketplace
                  key="marketplace"
                  onBack={handleBack}
                />
              )}

              {currentScreen === "health-symptom-guide" && (
                <HealthSymptomGuide
                  key="health-symptom-guide"
                  onBack={handleBack}
                />
              )}

              {currentScreen === "mental-health" && (
                <MentalHealthCheck
                  key="mental-health"
                  onBack={handleBack}
                  onNavigateToChat={handleNavigateToChat}
                />
              )}

              {currentScreen === "articles-videos" && (
                <ArticlesVideosPage
                  key="articles-videos"
                  onBack={handleBack}
                />
              )}

              {currentScreen === "settings" && (
                <SettingsPage
                  key="settings"
                  onBack={handleBack}
                  onSignOut={handleSignOut}
                />
              )}

              {currentScreen === "buddy-system" && (
                <PregnancyBuddySystem
                  key="buddy-system"
                  onBack={handleBack}
                />
              )}

              {currentScreen === "contractions" && (
                <ContractionMonitor
                  key="contractions"
                  onBack={handleBack}
                />
              )}

              {currentScreen === "transport" && (
                <EmergencyTransport
                  key="transport"
                  onBack={handleBack}
                />
              )}

              {currentScreen === "childcare" && (
                <ChildcareServices
                  key="childcare"
                  onBack={handleBack}
                />
              )}

              {currentScreen === "provider-portal" && (
                <RevampedProviderPortal
                  key="provider-portal"
                  onBack={handleSignOut}
                />
              )}

              {currentScreen === "medications" && (
                <MedicationReminders
                  key="medications"
                  onBack={handleBack}
                />
              )}

              {currentScreen === "complications" && (
                <PregnancyComplicationsSupport
                  key="complications"
                  onBack={handleBack}
                />
              )}

              {currentScreen === "vitals" && (
                <VitalsTracking
                  key="vitals"
                  onBack={handleBack}
                />
              )}

              {currentScreen === "emergency-alert" && (
                <EmergencyAlertSystem
                  key="emergency-alert"
                  onBack={handleBack}
                />
              )}

              {currentScreen === "birth-preparedness" && (
                <BirthPreparednessToolkit
                  key="birth-preparedness"
                  onBack={handleBack}
                />
              )}

              {currentScreen === "ai-risk" && (
                <AIRiskPrediction
                  key="ai-risk"
                  onBack={handleBack}
                />
              )}

              {currentScreen === "voice-nav" && (
                <EnhancedVoiceNavigation
                  key="voice-nav"
                  onBack={handleBack}
                  onNavigate={(screen) =>
                    setCurrentScreen(screen as AppScreen)
                  }
                />
              )}

              {currentScreen === "chw-portal" && (
                <CHWPortal
                  key="chw-portal"
                  onBack={handleBack}
                />
              )}

              {currentScreen === "appointments" && (
                <SmartAppointmentScheduler
                  key="appointments"
                  onBack={handleBack}
                />
              )}

              {currentScreen === "gamified-edu" && (
                <SuperGamifiedEducation
                  key="gamified-edu"
                  onBack={handleBack}
                />
              )}

              {currentScreen === "digital-services" && (
                <DigitalServices
                  key="digital-services"
                  onBack={handleBack}
                />
              )}

              {currentScreen === "delivery-plan" && (
                <EnhancedDeliveryPlanning
                  key="delivery-plan"
                  onBack={handleBack}
                />
              )}

              {currentScreen === "wearables" && (
                <WearablesIntegration
                  key="wearables"
                  onBack={handleBack}
                />
              )}

              {currentScreen === "impact" && (
                <ImpactTracker
                  key="impact"
                  onBack={handleBack}
                />
              )}
            </AnimatePresence>
          </div>

            {/* SasaMum AI FAB - Show on all screens except splash, welcome, auth, chat screens, and provider screens */}
            {![
              "splash",
              "welcome",
              "auth",
              "password-reset",
              "onboarding",
              "provider-onboarding",
              "provider-portal",
              "chat",
              "chat-screen",
            ].includes(currentScreen) && (
              <SasaMumAI 
                currentScreen={currentScreen}
              />
            )}

            {/* Bottom Navigation - Only show on main screens for mothers, not for providers */}
            {[
              "dashboard",
              "calendar",
              "chat",
              "profile",
            ].includes(currentScreen) &&
              localStorage.getItem("userType") !==
                "provider" && (
                <BottomNavigation
                  currentScreen={currentScreen}
                  onNavigateToHome={handleNavigateToHome}
                  onNavigateToCalendar={
                    handleNavigateToCalendar
                  }
                  onNavigateToChat={handleNavigateToChat}
                  onNavigateToProfile={handleNavigateToProfile}
                />
              )}
          </div>
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}

function SplashScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.8 }}
      className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/20 via-secondary/30 to-accent/40 p-8"
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          duration: 1.2,
          delay: 0.3,
          type: "spring",
          stiffness: 100,
        }}
        className="mb-8"
      >
        <SasaMumLogo size="xl" className="justify-center" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="text-center space-y-4"
      >
        <h1 className="text-2xl text-foreground leading-tight max-w-xs">
          Celebrating motherhood with
          <span className="text-primary block">
            Kenyan Love
          </span>
        </h1>
      </motion.div>

      {/* Creator Attribution */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 4 }}
        className="absolute bottom-16 left-1/2 -translate-x-1/2"
      >
        <p className="text-sm text-muted-foreground">
          Made by{" "}
          <span className="text-primary font-medium">
            K3V0JR1
          </span>
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-primary rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                delay: i * 0.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

function WelcomeScreen({
  onGetStarted,
}: {
  onGetStarted: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
      className="h-screen flex flex-col"
    >
      {/* Main Carousel Area */}
      <div className="flex-1 relative">
        <WelcomeCarousel />
      </div>

      {/* Bottom Action Area */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="bg-card/95 backdrop-blur-sm p-6 space-y-4 border-t border-border/20"
      >
        <div className="text-center space-y-2">
          <h3 className="text-lg text-foreground">
            Ready to embrace your journey?
          </h3>
          <p className="text-sm text-muted-foreground">
            Join our sisterhood of strong, beautiful Kenyan
            mothers
          </p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={onGetStarted}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6"
            size="lg"
          >
            <Heart className="w-5 h-5 mr-2" />
            Begin My Journey
          </Button>

          <Button
            variant="outline"
            className="w-full border-primary/30 text-primary hover:bg-primary/5 py-6"
            size="lg"
            onClick={() =>
              window.open("https://sasamum.ke", "_blank")
            }
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Learn More About SasaMum
          </Button>
        </div>

        <div className="text-center pt-2">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Supporting you through every step of your motherhood
            journey
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
