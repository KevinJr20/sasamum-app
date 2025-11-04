/**
 * Shared Baby Development Data
 * Single source of truth for baby development information
 * Used by both BabyDevelopmentModal and EnhancedBabyDevelopmentModal
 */

export interface WeeklyDevelopmentData {
  week: number;
  babySize: string;
  babyWeight: string;
  babyHeight: string;
  milestone: string;
  details: string;
  developmentHighlights: string[];
  mamaBody: string[];
  emoji: string;
  trimester: number;
  importantNotes?: string[];
  dietTips?: string[];
  exerciseTips?: string[];
}

export const weeklyDevelopment: Record<number, WeeklyDevelopmentData> = {
  4: {
    week: 4,
    babySize: 'Poppy Seed',
    babyWeight: '<1g',
    babyHeight: '2mm',
    milestone: 'Neural tube developing',
    details: 'Your baby is just a tiny embryo, but amazing things are already happening! The foundation for your baby\'s brain and spinal cord is forming.',
    developmentHighlights: ['Heart begins to form', 'Neural tube closes', 'Placenta starts developing', 'Amniotic sac forms'],
    mamaBody: ['Missed period', 'Possible light spotting', 'Breast tenderness', 'Mild cramping'],
    emoji: '🌱',
    trimester: 1,
    dietTips: ['Take folic acid supplements (400mcg daily)', 'Eat leafy greens like sukuma wiki', 'Stay hydrated - 8 glasses of water daily'],
    exerciseTips: ['Light walking (15-20 minutes)', 'Gentle stretching', 'Avoid high-impact activities']
  },
  8: {
    week: 8,
    babySize: 'Raspberry',
    babyWeight: '1g',
    babyHeight: '1.6cm',
    milestone: 'Fingers and toes forming',
    details: 'Baby is moving constantly, though you can\'t feel it yet. All major organs are developing at an incredible pace.',
    developmentHighlights: ['Tiny fingers and toes', 'Heart beating strongly (150-170 bpm)', 'Facial features emerging', 'Eyelids forming'],
    mamaBody: ['Morning sickness may peak', 'Fatigue', 'Food aversions', 'Frequent urination'],
    emoji: '🫐',
    trimester: 1,
    dietTips: ['Eat small frequent meals', 'Ginger tea for nausea', 'Protein-rich foods (eggs, beans, fish)'],
    exerciseTips: ['Rest when tired', 'Short walks (10-15 minutes)', 'Prenatal yoga']
  },
  12: {
    week: 12,
    babySize: 'Lime',
    babyWeight: '14g',
    babyHeight: '5.4cm',
    milestone: 'All major organs formed',
    details: 'Your baby can open and close fingers, and may start to make sucking motions. This marks the end of the first trimester!',
    developmentHighlights: ['Reflexes developing', 'Vocal cords forming', 'Intestines in place', 'Bone tissue appearing'],
    mamaBody: ['Energy returning', 'Morning sickness easing', 'Baby bump starting', 'First ultrasound'],
    emoji: '🥝',
    trimester: 1,
    dietTips: ['Increase calcium intake', 'Eat colorful fruits and vegetables', 'Include whole grains like ugali'],
    exerciseTips: ['Swimming', '30-minute walks', 'Modified squats']
  },
  16: {
    week: 16,
    babySize: 'Avocado',
    babyWeight: '100g',
    babyHeight: '11.6cm',
    milestone: 'Baby can hear your voice',
    details: 'Your baby\'s eyes can move and they may be able to hear sounds from outside. Talk, sing, and read to your baby!',
    developmentHighlights: ['Hearing developing', 'Facial expressions', 'Grip reflex', 'Sensitive to light'],
    mamaBody: ['Feeling baby move soon', 'Glowing skin', 'Growing bump', 'Increased appetite'],
    emoji: '🥑',
    trimester: 2,
    dietTips: ['Omega-3 rich foods (fish, avocado)', 'Iron-rich foods to prevent anemia', 'Stay hydrated'],
    exerciseTips: ['Prenatal aerobics', 'Pelvic floor exercises', 'Light strength training']
  },
  20: {
    week: 20,
    babySize: 'Banana',
    babyWeight: '300g',
    babyHeight: '25.6cm',
    milestone: 'Halfway there!',
    details: 'You\'re halfway through! Baby is swallowing amniotic fluid and producing meconium. Their senses are developing rapidly.',
    developmentHighlights: ['Can hear your heartbeat', 'Sleeping and waking cycles', 'Taste buds forming', 'Hair growing'],
    mamaBody: ['Feeling definite kicks', 'Round ligament pain', 'Backache', 'Anatomy scan'],
    emoji: '🍌',
    trimester: 2,
    dietTips: ['Protein at every meal', 'Calcium-rich foods (milk, yogurt)', 'Vitamin D from sunlight'],
    exerciseTips: ['Walking 30-45 minutes', 'Swimming', 'Prenatal yoga']
  },
  24: {
    week: 24,
    babySize: 'Corn',
    babyWeight: '600g',
    babyHeight: '30cm',
    milestone: 'Viability milestone reached',
    details: 'Baby can respond to sound and touch. Their lungs are developing, preparing for breathing air.',
    developmentHighlights: ['Lungs developing rapidly', 'Brain growing fast', 'Skin less transparent', 'Regular sleep patterns'],
    mamaBody: ['Stronger kicks', 'Possible glucose test', 'Back pain increasing', 'Braxton Hicks contractions'],
    emoji: '🌽',
    trimester: 2,
    dietTips: ['Monitor blood sugar', 'Complex carbohydrates', 'Limit processed sugars'],
    exerciseTips: ['Pelvic tilts', 'Cat-cow stretches', 'Swimming']
  },
  28: {
    week: 28,
    babySize: 'Eggplant',
    babyWeight: '1000g',
    babyHeight: '37cm',
    milestone: 'Third trimester begins',
    details: 'Baby\'s eyes can open and close. They can blink and may be able to sense light and dark.',
    developmentHighlights: ['Eyes opening', 'Dreaming (REM sleep)', 'Adding fat layers', 'Recognizes voices'],
    mamaBody: ['Shortness of breath', 'Heartburn', 'Swollen feet', 'More frequent checkups'],
    emoji: '🍆',
    trimester: 3,
    dietTips: ['Small frequent meals', 'Stay upright after eating', 'Fiber-rich foods'],
    exerciseTips: ['Gentle walking', 'Stretching', 'Breathing exercises']
  },
  32: {
    week: 32,
    babySize: 'Coconut',
    babyWeight: '1700g',
    babyHeight: '42cm',
    milestone: 'Rapid brain development',
    details: 'Baby is practicing breathing movements and their bones are fully formed (but still soft and flexible).',
    developmentHighlights: ['All five senses working', 'Fingernails complete', 'Bones hardening', 'Gaining weight rapidly'],
    mamaBody: ['Frequent bathroom trips', 'Trouble sleeping', 'Pelvic pressure', 'Hospital tour recommended'],
    emoji: '🥥',
    trimester: 3,
    dietTips: ['Omega-3 for brain development', 'Iron supplements', 'Small nutritious meals'],
    exerciseTips: ['Side-lying stretches', 'Pelvic floor exercises', 'Short walks']
  },
  36: {
    week: 36,
    babySize: 'Papaya',
    babyWeight: '2600g',
    babyHeight: '47cm',
    milestone: 'Baby dropping into pelvis',
    details: 'Baby is getting ready for birth! They may drop into your pelvis (lightening), making breathing easier.',
    developmentHighlights: ['Fully developed immune system', 'Fat layers complete', 'Lungs maturing', 'Getting into position'],
    mamaBody: ['Easier breathing', 'More pelvic pressure', 'Frequent urination', 'Nesting instinct'],
    emoji: '🥭',
    trimester: 3,
    dietTips: ['Date fruits for easier labor', 'Stay well hydrated', 'Energy-rich foods'],
    exerciseTips: ['Perineal massage', 'Squats', 'Birth ball exercises']
  },
  40: {
    week: 40,
    babySize: 'Watermelon',
    babyWeight: '3400g',
    babyHeight: '51cm',
    milestone: 'Ready to meet you!',
    details: 'Your baby is fully developed and ready to be born! They\'re just waiting for the signal to start labor.',
    developmentHighlights: ['Fully developed', 'Strong reflexes', 'Coordinated movements', 'Ready for the world'],
    mamaBody: ['Contractions may start', 'Water may break', 'Cervix effacing', 'Excitement and nervousness'],
    emoji: '🍉',
    trimester: 3,
    importantNotes: ['Pack hospital bag', 'Know signs of labor', 'Have support person ready', 'Trust your body'],
    dietTips: ['Light, nutritious meals', 'Stay hydrated', 'Foods for energy during labor'],
    exerciseTips: ['Gentle walking to encourage labor', 'Breathing practice', 'Rest as much as possible']
  }
};

// Helper function to get development data for a specific week
export const getDevelopmentData = (week: number): WeeklyDevelopmentData => {
  // Round to nearest available week
  const availableWeeks = Object.keys(weeklyDevelopment).map(Number).sort((a, b) => a - b);
  const closestWeek = availableWeeks.reduce((prev, curr) => 
    Math.abs(curr - week) < Math.abs(prev - week) ? curr : prev
  );
  return weeklyDevelopment[closestWeek];
};

// Helper function to get trimester name
export const getTrimesterName = (trimester: number): string => {
  const names = {
    1: '1st Trimester',
    2: '2nd Trimester',
    3: '3rd Trimester'
  };
  return names[trimester as keyof typeof names] || '';
};

// Helper function to calculate weeks remaining
export const getWeeksRemaining = (currentWeek: number): number => {
  return Math.max(0, 40 - currentWeek);
};
