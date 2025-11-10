// Pregnancy data and tracking utilities
export interface PregnancyWeekData {
  week: number;
  babySize: string;
  babyWeight: string;
  babyHeight: string;
  milestone: string;
  tips: string[];
  symptoms: string[];
}

export interface UserPregnancyData {
  name: string;
  dueDate: string;
  currentWeek: number;
  daysLeft: number;
  startDate: string;
  email: string;
}

// Mock pregnancy data by week
export const pregnancyWeekData: Record<number, PregnancyWeekData> = {
  1: {
    week: 1,
    babySize: "poppy seed",
    babyWeight: "0.1 gr",
    babyHeight: "0.1 cm",
    milestone: "Conception begins",
    tips: ["Take folic acid", "Maintain healthy diet"],
    symptoms: ["No symptoms yet"]
  },
  4: {
    week: 4,
    babySize: "chia seed",
    babyWeight: "0.5 gr", 
    babyHeight: "0.4 cm",
    milestone: "Neural tube develops",
    tips: ["Continue folic acid", "Avoid alcohol"],
    symptoms: ["Missed period", "Light cramping"]
  },
  8: {
    week: 8,
    babySize: "raspberry",
    babyWeight: "1 gr",
    babyHeight: "1.6 cm", 
    milestone: "Heart begins beating",
    tips: ["Schedule first prenatal visit", "Get plenty of rest"],
    symptoms: ["Morning sickness", "Breast tenderness"]
  },
  12: {
    week: 12,
    babySize: "plum",
    babyWeight: "14 gr",
    babyHeight: "5.4 cm",
    milestone: "First trimester milestone",
    tips: ["Consider sharing the news", "Stay hydrated"],
    symptoms: ["Energy may return", "Less nausea"]
  },
  16: {
    week: 16,
    babySize: "pear",
    babyWeight: "110 gr",
    babyHeight: "17 cm",
    milestone: "Gender may be determined",
    tips: ["Consider prenatal yoga", "Plan balanced meals"],
    symptoms: ["Feeling baby movements", "Glowing skin"]
  },
  20: {
    week: 20,
    babySize: "mango",
    babyWeight: "300 gr",
    babyHeight: "25 cm",
    milestone: "Halfway point!",
    tips: ["Schedule anatomy scan", "Start thinking about names"],
    symptoms: ["Stronger kicks", "Growing belly"]
  },
  24: {
    week: 24,
    babySize: "corn",
    babyWeight: "600 gr",
    babyHeight: "30 cm",
    milestone: "Viability milestone",
    tips: ["Monitor kicks", "Prepare nursery"],
    symptoms: ["Back pain", "Leg cramps"]
  },
  28: {
    week: 28,
    babySize: "eggplant",
    babyWeight: "1000 gr",
    babyHeight: "37 cm",
    milestone: "Third trimester begins",
    tips: ["Start childbirth classes", "Monitor blood pressure"],
    symptoms: ["Heartburn", "Shortness of breath"]
  },
  32: {
    week: 32,
    babySize: "coconut",
    babyWeight: "1700 gr",
    babyHeight: "42 cm",
    milestone: "Rapid brain development",
    tips: ["Pack hospital bag", "Finalize birth plan"],
    symptoms: ["Frequent urination", "Braxton Hicks"]
  },
  36: {
    week: 36,
    babySize: "papaya",
    babyWeight: "2500 gr",
    babyHeight: "47 cm",
    milestone: "Baby is considered full-term soon",
    tips: ["Weekly doctor visits", "Install car seat"],
    symptoms: ["Pelvic pressure", "Nesting instinct"]
  },
  40: {
    week: 40,
    babySize: "watermelon",
    babyWeight: "3400 gr",
    babyHeight: "51 cm",
    milestone: "Due date arrives!",
    tips: ["Stay calm", "Watch for labor signs"],
    symptoms: ["Ready to meet baby", "Mixed emotions"]
  }
};

// Calculate current week based on due date
export function calculateCurrentWeek(dueDate: string): number {
  const due = new Date(dueDate);
  const now = new Date();
  const diffTime = due.getTime() - now.getTime();
  const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
  return Math.max(1, Math.min(40, 40 - diffWeeks));
}

// Calculate days left until due date
export function calculateDaysLeft(dueDate: string): number {
  const due = new Date(dueDate);
  const now = new Date();
  const diffTime = due.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

// Get current week data
export function getCurrentWeekData(week: number): PregnancyWeekData {
  // Find the closest week data available
  const availableWeeks = Object.keys(pregnancyWeekData).map(Number).sort((a, b) => a - b);
  let closestWeek = availableWeeks[0];
  
  for (const availableWeek of availableWeeks) {
    if (availableWeek <= week) {
      closestWeek = availableWeek;
    } else {
      break;
    }
  }
  
  return pregnancyWeekData[closestWeek];
}

// Mock user data (in a real app, this would come from authentication/database)
export const mockUserData: UserPregnancyData = {
  name: "Akinyi",
  email: "akinyi@example.com",
  dueDate: "2026-02-15", // Due date
  currentWeek: 16,
  daysLeft: 168,
  startDate: "2025-06-01"
};

// Feature card data with enhanced information
export interface FeatureCardData {
  id: string;
  title: string;
  icon: any;
  bgColor: string;
  iconColor: string;
  description: string;
  comingSoon?: boolean;
}

export const featureCardsData: FeatureCardData[] = [
  {
    id: 'medications',
    title: 'Medications',
    icon: null,
    bgColor: 'bg-purple-100 dark:bg-purple-950/30',
    iconColor: 'text-purple-600 dark:text-purple-400',
    description: 'Medication reminders & appointments',
    comingSoon: false
  },
  {
    id: 'contractions',
    title: 'Labor Monitor',
    icon: null,
    bgColor: 'bg-red-100 dark:bg-red-950/30',
    iconColor: 'text-red-600 dark:text-red-400',
    description: 'Track contractions and labor progress',
    comingSoon: false
  },
  {
    id: 'transport',
    title: 'Emergency Transport',
    icon: null,
    bgColor: 'bg-orange-100 dark:bg-orange-950/30',
    iconColor: 'text-orange-600 dark:text-orange-400',
    description: 'Ambulance & emergency services',
    comingSoon: false
  },
  {
    id: 'mental-health',
    title: 'Mental Wellness',
    icon: null,
    bgColor: 'bg-pink-100 dark:bg-pink-950/30',
    iconColor: 'text-pink-600 dark:text-pink-400',
    description: 'Mental health support & check-ins',
    comingSoon: false
  },
  {
    id: 'buddy-system',
    title: 'Pregnancy Buddy',
    icon: null,
    bgColor: 'bg-green-100 dark:bg-green-950/30',
    iconColor: 'text-green-600 dark:text-green-400',
    description: 'Connect with other mothers',
    comingSoon: false
  },
  {
    id: 'hospitals',
    title: 'Hospitals',
    icon: null,
    bgColor: 'bg-primary/10',
    iconColor: 'text-primary', 
    description: 'Find nearby maternal healthcare',
    comingSoon: false
  },
  {
    id: 'emergency',
    title: 'Health & Symptom Guide',
    icon: null,
    bgColor: 'bg-red-100 dark:bg-red-950/30',
    iconColor: 'text-red-600 dark:text-red-400',
    description: 'Track symptoms & emergency protocols',
    comingSoon: false
  },
  {
    id: 'complications',
    title: 'Pregnancy Support',
    icon: null,
    bgColor: 'bg-purple-100 dark:bg-purple-950/30',
    iconColor: 'text-purple-600 dark:text-purple-400',
    description: 'Support for pregnancy complications & loss',
    comingSoon: false
  },
  {
    id: 'ai-risk',
    title: 'AI Risk Prediction',
    icon: 'BrainCircuit',
    bgColor: 'bg-indigo-100 dark:bg-indigo-950/30',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    description: 'ML-powered health risk analysis',
    comingSoon: false
  },
  {
    id: 'voice-nav',
    title: 'Voice Assistant',
    icon: 'Mic',
    bgColor: 'bg-cyan-100 dark:bg-cyan-950/30',
    iconColor: 'text-cyan-600 dark:text-cyan-400',
    description: 'Voice-enabled navigation & education',
    comingSoon: false
  },
  {
    id: 'appointments',
    title: 'Smart Appointments',
    icon: 'CalendarCheck',
    bgColor: 'bg-teal-100 dark:bg-teal-950/30',
    iconColor: 'text-teal-600 dark:text-teal-400',
    description: 'AI-powered appointment scheduling',
    comingSoon: false
  },
  {
    id: 'gamified-edu',
    title: 'Learn & Earn',
    icon: 'GraduationCap',
    bgColor: 'bg-yellow-100 dark:bg-yellow-950/30',
    iconColor: 'text-yellow-600 dark:text-yellow-400',
    description: 'Gamified health education',
    comingSoon: false
  },
  {
    id: 'birth-cert',
    title: 'Digital Services',
    icon: 'FileCheck',
    bgColor: 'bg-emerald-100 dark:bg-emerald-950/30',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    description: 'Birth certificate & NHIF integration',
    comingSoon: false
  },
  {
    id: 'delivery-plan',
    title: 'Delivery Planning',
    icon: 'Compass',
    bgColor: 'bg-rose-100 dark:bg-rose-950/30',
    iconColor: 'text-rose-600 dark:text-rose-400',
    description: 'AI-powered facility recommendations',
    comingSoon: false
  },
  {
    id: 'wearables',
    title: 'Wearables Sync',
    icon: 'Watch',
    bgColor: 'bg-violet-100 dark:bg-violet-950/30',
    iconColor: 'text-violet-600 dark:text-violet-400',
    description: 'Connect smartwatch & health devices',
    comingSoon: false
  },
  {
    id: 'impact',
    title: 'Impact Tracker',
    icon: 'TrendingUp',
    bgColor: 'bg-lime-100 dark:bg-lime-950/30',
    iconColor: 'text-lime-600 dark:text-lime-400',
    description: 'Track your health journey progress',
    comingSoon: false
  },

];
