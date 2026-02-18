// ==================== TYPES ====================

export interface QuizAnswers {
  age: string;
  gender: string;
  city: string;
  religiosity: string;
}

export interface QuizQuestion {
  id: keyof QuizAnswers;
  label: string;
  icon: string;
  type: 'buttons' | 'autocomplete';
  options?: { value: string; label: string }[];
  placeholder?: string;
}

// ==================== QUESTIONS ====================

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'age',
    label: 'מה הגיל שלך?',
    icon: '🎂',
    type: 'buttons',
    options: [
      { value: '18-24', label: '18-24' },
      { value: '25-34', label: '25-34' },
      { value: '35-44', label: '35-44' },
      { value: '45-54', label: '45-54' },
      { value: '55-64', label: '55-64' },
      { value: '65+', label: '65+' },
    ],
  },
  {
    id: 'gender',
    label: 'מגדר',
    icon: '👤',
    type: 'buttons',
    options: [
      { value: 'זכר', label: 'זכר' },
      { value: 'נקבה', label: 'נקבה' },
    ],
  },
  {
    id: 'city',
    label: 'עיר מגורים',
    icon: '🏙️',
    type: 'autocomplete',
    placeholder: 'הקלידו שם עיר...',
  },
  {
    id: 'religiosity',
    label: 'איך את/ה מגדיר/ה את עצמך?',
    icon: '🕊️',
    type: 'buttons',
    options: [
      { value: 'חרדי', label: 'חרדי/ת' },
      { value: 'דתי', label: 'דתי/ה' },
      { value: 'מסורתי', label: 'מסורתי/ת' },
      { value: 'חילוני', label: 'חילוני/ת' },
    ],
  },
];

// ==================== ISRAELI CITIES ====================

export const ISRAELI_CITIES = [
  'תל אביב-יפו', 'ירושלים', 'חיפה', 'באר שבע', 'ראשון לציון',
  'פתח תקווה', 'אשדוד', 'נתניה', 'בני ברק', 'חולון',
  'רמת גן', 'אשקלון', 'בת ים', 'הרצליה', 'כפר סבא',
  'רעננה', 'מודיעין-מכבים-רעות', 'לוד', 'רמלה', 'נצרת',
  'עכו', 'אילת', 'טבריה', 'צפת', 'דימונה',
  'ערד', 'קריית שמונה', 'קריית גת', 'אור יהודה',
  'יבנה', 'עפולה', 'כרמיאל', 'נהריה', 'רהט',
  'אום אל-פחם', 'טייבה', 'סכנין', 'שפרעם',
  'מעלה אדומים', 'אריאל', 'ביתר עילית', 'אלעד',
  'גבעתיים', 'רמת השרון', 'הוד השרון', 'נס ציונה',
  'קריית אתא', 'קריית ביאליק', 'קריית מוצקין',
  'טירת כרמל', 'יהוד-מונוסון', 'גבעת שמואל',
  'עראבה', 'באקה אל-גרבייה', 'קלנסווה',
  'אור עקיבא', 'נשר', 'מגדל העמק', 'יקנעם',
  'שדרות', 'אופקים', 'נתיבות', 'ירוחם',
  'כפר קאסם', 'טמרה', 'דאלית אל-כרמל',
  'בית שמש', 'בית שאן', 'עראד', 'מצפה רמון',
];

// ==================== CITY → REGION MAPPING ====================

const CITY_REGIONS: Record<string, string[]> = {
  // South
  'באר שבע': ['נגב', 'פריפריה'],
  'אשדוד': ['דרום'],
  'אשקלון': ['דרום', 'עוטף עזה'],
  'דימונה': ['נגב', 'פריפריה'],
  'ערד': ['נגב', 'פריפריה'],
  'עראד': ['נגב', 'פריפריה'],
  'אילת': ['אילת', 'תיירות', 'פריפריה'],
  'שדרות': ['עוטף עזה', 'פריפריה'],
  'אופקים': ['נגב', 'פריפריה'],
  'נתיבות': ['נגב', 'פריפריה'],
  'ירוחם': ['נגב', 'פריפריה'],
  'מצפה רמון': ['נגב', 'פריפריה'],
  'קריית גת': ['דרום'],
  'רהט': ['נגב', 'בדואים'],
  // North
  'חיפה': ['צפון'],
  'נצרת': ['גליל', 'ערבי'],
  'צפת': ['גליל', 'פריפריה'],
  'טבריה': ['גליל', 'פריפריה'],
  'עכו': ['גליל'],
  'קריית שמונה': ['גליל', 'פריפריה', 'גבול'],
  'כרמיאל': ['גליל'],
  'נהריה': ['גליל'],
  'עפולה': ['עמק יזרעאל'],
  'מגדל העמק': ['גליל', 'פריפריה'],
  'בית שאן': ['עמק', 'פריפריה'],
  'סכנין': ['גליל', 'ערבי'],
  'שפרעם': ['גליל', 'ערבי'],
  'טמרה': ['גליל', 'ערבי'],
  'עראבה': ['גליל', 'ערבי'],
  'אום אל-פחם': ['ערבי'],
  'טייבה': ['משולש', 'ערבי'],
  'באקה אל-גרבייה': ['משולש', 'ערבי'],
  'קלנסווה': ['משולש', 'ערבי'],
  'כפר קאסם': ['ערבי'],
  'דאלית אל-כרמל': ['דרוזי'],
  // Center
  'תל אביב-יפו': ['תחבורה', 'דיור'],
  'ראשון לציון': ['מרכז'],
  'פתח תקווה': ['מרכז'],
  'נתניה': ['שרון'],
  'חולון': ['מרכז'],
  'רמת גן': ['מרכז'],
  'בת ים': ['מרכז'],
  'הרצליה': ['שרון'],
  'כפר סבא': ['שרון'],
  'רעננה': ['שרון'],
  'גבעתיים': ['מרכז'],
  'בני ברק': ['חרדי'],
  'לוד': ['מרכז'],
  'רמלה': ['מרכז'],
  // Jerusalem
  'ירושלים': ['ירושלים'],
  'מעלה אדומים': ['יהודה ושומרון'],
  'ביתר עילית': ['חרדי', 'יהודה ושומרון'],
  'אריאל': ['יהודה ושומרון'],
  'בית שמש': ['ירושלים'],
  'מודיעין-מכבים-רעות': ['מרכז'],
  'אלעד': ['חרדי'],
};

// ==================== MAPPING LOGIC ====================

interface MappingResult {
  categories: string[];
  searchTerms: string[];
}

export function getRelevantMapping(answers: QuizAnswers): MappingResult {
  const categories = new Set<string>();
  const searchTerms = new Set<string>();

  // === Age-based mapping ===
  const ageMap: Record<string, { cats: string[]; terms: string[] }> = {
    '18-24': { cats: ['דיור', 'חינוך', 'כלכלה'], terms: ['סטודנטים'] },
    '25-34': { cats: ['דיור', 'כלכלה', 'טכנולוגיה'], terms: ['דיור'] },
    '35-44': { cats: ['חינוך', 'בריאות', 'כלכלה'], terms: ['ילדים'] },
    '45-54': { cats: ['כלכלה', 'בריאות', 'ביטחון'], terms: ['מיסוי'] },
    '55-64': { cats: ['רווחה', 'בריאות', 'כלכלה'], terms: ['פנסיה'] },
    '65+':   { cats: ['בריאות', 'רווחה'], terms: ['קשישים', 'סיעוד'] },
  };
  const ageCfg = ageMap[answers.age];
  if (ageCfg) {
    ageCfg.cats.forEach(c => categories.add(c));
    ageCfg.terms.forEach(t => searchTerms.add(t));
  }

  // === Religiosity-based mapping ===
  const religMap: Record<string, { cats: string[]; terms: string[] }> = {
    'חרדי':   { cats: ['חינוך'], terms: ['חרדי', 'גיוס'] },
    'דתי':    { cats: ['חינוך'], terms: ['דתי'] },
    'מסורתי': { cats: [], terms: [] },
    'חילוני':  { cats: ['טכנולוגיה', 'סביבה'], terms: ['תחבורה'] },
  };
  const relCfg = religMap[answers.religiosity];
  if (relCfg) {
    relCfg.cats.forEach(c => categories.add(c));
    relCfg.terms.forEach(t => searchTerms.add(t));
  }

  // === City-based mapping ===
  const cityTerms = CITY_REGIONS[answers.city];
  if (cityTerms) {
    cityTerms.forEach(t => searchTerms.add(t));
  }

  return {
    categories: Array.from(categories),
    searchTerms: Array.from(searchTerms),
  };
}

// ==================== BUILD API QUERIES ====================

export function buildBillQueries(answers: QuizAnswers): Record<string, string>[] {
  const { categories, searchTerms } = getRelevantMapping(answers);
  const queries: Record<string, string>[] = [];

  // Top 3 category queries
  categories.slice(0, 3).forEach(cat => {
    queries.push({ category: cat, limit: '3', sort: 'newest' });
  });

  // Top search term
  if (searchTerms.length > 0) {
    queries.push({ search: searchTerms[0], limit: '3', sort: 'newest' });
  }

  // Fallback: always include newest bills as backup
  queries.push({ limit: '5', sort: 'newest' });

  return queries;
}

// ==================== LOCALSTORAGE ====================

const STORAGE_KEY = 'hukit-demographic-answers';

export function saveQuizAnswers(answers: QuizAnswers): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
  } catch {}
}

export function loadQuizAnswers(): QuizAnswers | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

export function clearQuizAnswers(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}
