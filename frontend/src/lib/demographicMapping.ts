// ==================== TYPES ====================

export interface QuizAnswers {
  interests: string[];      // up to 3
  lifeSituation: string[];  // up to 2
}

export interface QuizQuestion {
  id: string;
  label: string;
  subtitle: string;
  icon: string;
  maxSelect: number;        // 1 = single, 2+ = multi
  options: { value: string; label: string; icon: string }[];
}

// ==================== QUESTIONS ====================

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'interests',
    label: 'מה הכי חשוב לך לעקוב אחריו עכשיו?',
    subtitle: 'בחר עד 3',
    icon: '🎯',
    maxSelect: 3,
    options: [
      { value: 'cost_of_living', label: 'יוקר מחיה ומסים', icon: '💰' },
      { value: 'housing', label: 'דיור ושכירות', icon: '🏠' },
      { value: 'health', label: 'בריאות', icon: '🏥' },
      { value: 'education', label: 'חינוך', icon: '📚' },
      { value: 'transport', label: 'תחבורה', icon: '🚌' },
      { value: 'security', label: 'ביטחון אישי', icon: '🛡️' },
      { value: 'religion_state', label: 'דת ומדינה', icon: '🕊️' },
      { value: 'tech_privacy', label: 'טכנולוגיה ופרטיות', icon: '💻' },
      { value: 'environment', label: 'סביבה', icon: '🌿' },
      { value: 'workers_rights', label: 'זכויות עובדים', icon: '👷' },
    ],
  },
  {
    id: 'lifeSituation',
    label: 'איזה תיאור הכי קרוב למצב החיים שלך עכשיו?',
    subtitle: 'בחר עד 2',
    icon: '👤',
    maxSelect: 2,
    options: [
      { value: 'parent', label: 'הורה לילדים', icon: '👨‍👩‍👧' },
      { value: 'renter', label: 'שוכר דירה', icon: '🏠' },
      { value: 'business_owner', label: 'בעל עסק או עצמאי', icon: '💼' },
      { value: 'student_soldier', label: 'סטודנט או חייל', icon: '🎓' },
      { value: 'retiree', label: 'גמלאי', icon: '🌅' },
      { value: 'reservist', label: 'מילואים פעיל', icon: '🎖️' },
      { value: 'chronic_caregiver', label: 'מטופל כרוני / בן משפחה מטפל', icon: '❤️‍🩹' },
      { value: 'other', label: 'אחר', icon: '✨' },
    ],
  },
];

// ==================== INTEREST → CATEGORIES/TERMS MAPPING ====================

const INTEREST_MAPPING: Record<string, { categories: string[]; searchTerms: string[] }> = {
  cost_of_living: { categories: ['כלכלה', 'צרכנות'], searchTerms: ['מסים', 'יוקר', 'מע"מ', 'אגרה'] },
  housing: { categories: ['דיור'], searchTerms: ['שכירות', 'דיור', 'משכנתא', 'בנייה'] },
  health: { categories: ['בריאות'], searchTerms: ['בריאות', 'רפואה', 'ביטוח בריאות'] },
  education: { categories: ['חינוך'], searchTerms: ['חינוך', 'בית ספר', 'אוניברסיטה'] },
  transport: { categories: ['תחבורה'], searchTerms: ['תחבורה', 'רכב', 'רכבת'] },
  security: { categories: ['ביטחון'], searchTerms: ['ביטחון', 'משטרה'] },
  religion_state: { categories: [], searchTerms: ['דת', 'כשרות', 'שבת', 'נישואין'] },
  tech_privacy: { categories: ['טכנולוגיה'], searchTerms: ['פרטיות', 'מידע', 'סייבר', 'טכנולוגיה'] },
  environment: { categories: ['סביבה'], searchTerms: ['סביבה', 'זיהום', 'אקלים'] },
  workers_rights: { categories: ['רווחה'], searchTerms: ['עובדים', 'שכר', 'פיטורים', 'זכויות'] },
};

const LIFE_SITUATION_MAPPING: Record<string, { categories: string[]; searchTerms: string[] }> = {
  parent: { categories: ['חינוך', 'רווחה'], searchTerms: ['ילדים', 'משפחה', 'הורים'] },
  renter: { categories: ['דיור'], searchTerms: ['שכירות', 'דיור'] },
  business_owner: { categories: ['כלכלה', 'תעשייה'], searchTerms: ['עסקים', 'עצמאי', 'מע"מ'] },
  student_soldier: { categories: ['חינוך'], searchTerms: ['סטודנטים', 'גיוס', 'שכר לימוד'] },
  retiree: { categories: ['רווחה', 'בריאות'], searchTerms: ['פנסיה', 'קשישים', 'סיעוד'] },
  reservist: { categories: ['ביטחון'], searchTerms: ['מילואים', 'חיילים'] },
  chronic_caregiver: { categories: ['בריאות', 'רווחה'], searchTerms: ['חולים', 'סיעוד', 'נכות'] },
  other: { categories: [], searchTerms: [] },
};

// ==================== INTEREST LABELS (for display) ====================

export const INTEREST_LABELS: Record<string, string> = {
  cost_of_living: 'יוקר מחיה ומסים',
  housing: 'דיור ושכירות',
  health: 'בריאות',
  education: 'חינוך',
  transport: 'תחבורה',
  security: 'ביטחון אישי',
  religion_state: 'דת ומדינה',
  tech_privacy: 'טכנולוגיה ופרטיות',
  environment: 'סביבה',
  workers_rights: 'זכויות עובדים',
};

export const LIFE_LABELS: Record<string, string> = {
  parent: 'הורה לילדים',
  renter: 'שוכר דירה',
  business_owner: 'בעל עסק / עצמאי',
  student_soldier: 'סטודנט / חייל',
  retiree: 'גמלאי',
  reservist: 'מילואים פעיל',
  chronic_caregiver: 'מטופל כרוני / מטפל',
  other: 'אחר',
};


// ==================== "WHY HERE" MAPPING ====================

/** Given a bill's categories and the user's answers, produce a "why here" reason */
export function getWhyHereReason(billCategories: string[], answers: QuizAnswers): string | null {
  // Check interests first
  for (const interest of answers.interests) {
    const mapping = INTEREST_MAPPING[interest];
    if (!mapping) continue;
    for (const cat of mapping.categories) {
      if (billCategories.includes(cat)) {
        return `מופיע כי בחרת ${INTEREST_LABELS[interest] || interest}`;
      }
    }
  }
  // Check life situations
  for (const life of answers.lifeSituation) {
    const mapping = LIFE_SITUATION_MAPPING[life];
    if (!mapping) continue;
    for (const cat of mapping.categories) {
      if (billCategories.includes(cat)) {
        return `מופיע כי בחרת ${LIFE_LABELS[life] || life}`;
      }
    }
  }
  return null;
}

// ==================== BUILD API QUERIES ====================

export function buildBillQueries(answers: QuizAnswers): Record<string, string>[] {
  const categories = new Set<string>();
  const searchTerms = new Set<string>();

  // Map interests
  for (const interest of answers.interests) {
    const mapping = INTEREST_MAPPING[interest];
    if (mapping) {
      mapping.categories.forEach(c => categories.add(c));
      mapping.searchTerms.forEach(t => searchTerms.add(t));
    }
  }

  // Map life situations
  for (const life of answers.lifeSituation) {
    const mapping = LIFE_SITUATION_MAPPING[life];
    if (mapping) {
      mapping.categories.forEach(c => categories.add(c));
      mapping.searchTerms.forEach(t => searchTerms.add(t));
    }
  }

  const queries: Record<string, string>[] = [];

  // Category queries (top 4)
  Array.from(categories).slice(0, 4).forEach(cat => {
    queries.push({ category: cat, limit: '5', sort: 'newest' });
  });

  // Top 2 search terms
  Array.from(searchTerms).slice(0, 2).forEach(term => {
    queries.push({ search: term, limit: '3', sort: 'newest' });
  });

  // Fallback: newest bills
  queries.push({ limit: '6', sort: 'newest' });

  return queries;
}

// Query for "most discussed" bills (high view/comment count)
export function buildTrendingQuery(): Record<string, string> {
  return { limit: '5', sort: 'popular' };
}

// Query for bills in upcoming stages
export function buildUpcomingQuery(): Record<string, string> {
  return { limit: '5', sort: 'newest' };
}

// ==================== LOCALSTORAGE ====================

const STORAGE_KEY = 'hukit-quiz-answers-v2';

export function saveQuizAnswers(answers: QuizAnswers): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
  } catch {}
}

export function loadQuizAnswers(): QuizAnswers | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Validate format (interests + lifeSituation are required)
      if (Array.isArray(parsed.interests) && Array.isArray(parsed.lifeSituation)) {
        return parsed;
      }
    }
  } catch {}
  return null;
}

export function clearQuizAnswers(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    // Also clear old format
    localStorage.removeItem('hukit-demographic-answers');
  } catch {}
}
