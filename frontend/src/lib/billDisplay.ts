/**
 * Smart bill display utilities.
 * Transforms dry Knesset legal titles into catchy, human-readable headlines
 * with topic detection for icons and colors.
 */

// ==================== TOPIC DETECTION ====================

export interface BillTopic {
  icon: string;
  label: string;
  color: string;       // tailwind bg color
  textColor: string;   // tailwind text color
  gradient: string;    // tailwind gradient for card accent
}

const TOPIC_RULES: { keywords: string[]; topic: BillTopic }[] = [
  {
    keywords: ['ביטוח לאומי', 'מילואים', 'גמלה', 'קצבה', 'פנסיה', 'נכות'],
    topic: { icon: '🛡️', label: 'ביטוח לאומי', color: 'bg-purple-100', textColor: 'text-purple-700', gradient: 'from-purple-500 to-purple-600' },
  },
  {
    keywords: ['תכנון ובנייה', 'בנייה', 'תכנית', 'היתר בנייה', 'מבנה', 'דירה', 'דיור', 'שכירות', 'משכנתא'],
    topic: { icon: '🏗️', label: 'דיור ובנייה', color: 'bg-orange-100', textColor: 'text-orange-700', gradient: 'from-orange-500 to-orange-600' },
  },
  {
    keywords: ['תשתית', 'תשתיות', 'כביש', 'רכבת', 'תחבורה', 'תעבורה'],
    topic: { icon: '🚧', label: 'תשתיות', color: 'bg-amber-100', textColor: 'text-amber-700', gradient: 'from-amber-500 to-amber-600' },
  },
  {
    keywords: ['מס ', 'מסים', 'מע"מ', 'הטבות מס', 'תקציב', 'כלכלי', 'כלכלה', 'בנקים', 'רווחי'],
    topic: { icon: '💰', label: 'כלכלה ומסים', color: 'bg-green-100', textColor: 'text-green-700', gradient: 'from-green-500 to-green-600' },
  },
  {
    keywords: ['עונשין', 'פלילי', 'עבירה', 'מאסר', 'עונש'],
    topic: { icon: '⚖️', label: 'משפט פלילי', color: 'bg-red-100', textColor: 'text-red-700', gradient: 'from-red-500 to-red-600' },
  },
  {
    keywords: ['חינוך', 'השכלה', 'אוניברסיטה', 'בית ספר', 'לימוד', 'סטודנט'],
    topic: { icon: '📚', label: 'חינוך', color: 'bg-blue-100', textColor: 'text-blue-700', gradient: 'from-blue-500 to-blue-600' },
  },
  {
    keywords: ['בריאות', 'רפואה', 'חולים', 'סיעוד'],
    topic: { icon: '🏥', label: 'בריאות', color: 'bg-teal-100', textColor: 'text-teal-700', gradient: 'from-teal-500 to-teal-600' },
  },
  {
    keywords: ['ביטחון', 'צבא', 'שירות לאומי', 'עוין', 'טרור', 'פלסטינ'],
    topic: { icon: '🔒', label: 'ביטחון', color: 'bg-slate-100', textColor: 'text-slate-700', gradient: 'from-slate-500 to-slate-600' },
  },
  {
    keywords: ['רשות מקומית', 'מועצה מקומית', 'בחירות', 'עירייה', 'ראש עיר'],
    topic: { icon: '🏛️', label: 'שלטון מקומי', color: 'bg-indigo-100', textColor: 'text-indigo-700', gradient: 'from-indigo-500 to-indigo-600' },
  },
  {
    keywords: ['חשמל', 'אנרגיה', 'גז', 'סביבה', 'זיהום', 'אקלים', 'פסולת'],
    topic: { icon: '⚡', label: 'אנרגיה וסביבה', color: 'bg-yellow-100', textColor: 'text-yellow-700', gradient: 'from-yellow-500 to-yellow-600' },
  },
  {
    keywords: ['קדוש', 'דת', 'תפילה', 'רבנות', 'כשרות', 'שבת'],
    topic: { icon: '🕊️', label: 'דת ומדינה', color: 'bg-violet-100', textColor: 'text-violet-700', gradient: 'from-violet-500 to-violet-600' },
  },
  {
    keywords: ['צעירים', 'סיוע', 'רווחה', 'נזקקים', 'עורף משפחתי'],
    topic: { icon: '❤️', label: 'רווחה וסיוע', color: 'bg-rose-100', textColor: 'text-rose-700', gradient: 'from-rose-500 to-rose-600' },
  },
  {
    keywords: ['נכס', 'מקרקעין', 'קרקע', 'שימוש', 'שידור', 'תקשורת'],
    topic: { icon: '📡', label: 'תקשורת ונכסים', color: 'bg-cyan-100', textColor: 'text-cyan-700', gradient: 'from-cyan-500 to-cyan-600' },
  },
  {
    keywords: ['קבלנ', 'עבודות הנדסה', 'עיצום כספי'],
    topic: { icon: '👷', label: 'בנייה ורגולציה', color: 'bg-orange-100', textColor: 'text-orange-700', gradient: 'from-orange-500 to-orange-600' },
  },
  {
    keywords: ['הוצאה לפועל', 'חוב', 'פשיטת רגל'],
    topic: { icon: '📋', label: 'הוצאה לפועל', color: 'bg-gray-100', textColor: 'text-gray-700', gradient: 'from-gray-500 to-gray-600' },
  },
  {
    keywords: ['עזה', 'תקומה', 'שיקום', 'נגב'],
    topic: { icon: '🏠', label: 'שיקום ותקומה', color: 'bg-emerald-100', textColor: 'text-emerald-700', gradient: 'from-emerald-500 to-emerald-600' },
  },
];

const DEFAULT_TOPIC: BillTopic = {
  icon: '📜', label: 'חקיקה', color: 'bg-gray-100', textColor: 'text-gray-600', gradient: 'from-gray-400 to-gray-500',
};

/** Detect the topic of a bill from its title */
export function detectBillTopic(titleHe: string): BillTopic {
  const lower = titleHe;
  for (const rule of TOPIC_RULES) {
    if (rule.keywords.some(kw => lower.includes(kw))) {
      return rule.topic;
    }
  }
  return DEFAULT_TOPIC;
}

// ==================== HEADLINE GENERATION ====================

/** Remove year suffix like ,התשפ"ה-2025 */
function stripYear(s: string): string {
  return s.replace(/,?\s*התש[א-ת][״"׳'][א-ת][-–—]\d{4}$/g, '').trim();
}

/**
 * Transform a Knesset legal title into a catchy, human-readable headline.
 *
 * This handles many patterns:
 * - "הצעת חוק הביטוח הלאומי (תיקון - חישוב תגמולי מילואים בתקופת חירום)" → "חישוב תגמולי מילואים בתקופת חירום"
 * - "פרק ב' ייעול הליכי התכנון והבנייה..." → "ייעול הליכי התכנון והבנייה"
 * - "הצעת חוק סיוע לצעירים חסרי עורף משפחתי" → "סיוע לצעירים חסרי עורף משפחתי"
 */
function humanizeTitle(titleHe: string): string {
  let t = stripYear(titleHe).trim();

  // Pattern 1: "פרק X' ... סעיף/סעיפים ..." — extract the chapter subject
  // e.g. "פרק ב' ייעול הליכי התכנון והבנייה (חוק...) סעיף 2(16)..."
  const chapterMatch = t.match(/^פרק\s+[א-ת]['׳]?\s+(.+?)(?:\s*\(חוק|\s*סעיף)/);
  if (chapterMatch) {
    return chapterMatch[1].trim();
  }

  // Pattern 1b: "פרק X ... (מס מיוחד על רווחי בנקים) מתוך..."
  const chapterParenMatch = t.match(/^פרק\s+[א-ת]['׳]?\s*\((.+?)\)\s*מתוך/);
  if (chapterParenMatch) {
    return chapterParenMatch[1].trim();
  }

  // Pattern 1c: "פרק X' SUBJECT  סעיפים ..." (double space before sections)
  const chapterSectionsMatch = t.match(/^פרק\s+[א-ת]['׳]?\s+(.+?)\s{2,}סעיפ/);
  if (chapterSectionsMatch) {
    return chapterSectionsMatch[1].trim();
  }

  // Pattern 2: "(תיקון – DESCRIPTION)" or "(תיקון - DESCRIPTION)" — extract DESCRIPTION
  const dashAmendMatch = t.match(/\(תיקון\s*[-–—]\s*(.+?)\)/);
  if (dashAmendMatch) {
    return dashAmendMatch[1].trim();
  }

  // Pattern 3: "(תיקוני חקיקה)" or "(תיקון מס' N)" — simplify
  // "הצעת חוק הביטוח הלאומי (תיקון מס' 9)" → "שינויים בביטוח הלאומי"
  const simpleAmendMatch = t.match(/^הצעת חוק\s+(.+?)\s*\(תיקון/);
  if (simpleAmendMatch) {
    let subject = simpleAmendMatch[1].trim();
    // Remove "ל" prefix if exists: "לתיקון פקודת X" → "תיקון פקודת X"
    return `שינויים ב${subject}`;
  }

  // Pattern 4: "הצעת חוק SUBJECT" — just remove the prefix
  if (t.startsWith('הצעת חוק ')) {
    let subject = t.replace(/^הצעת חוק\s+/, '');
    // Remove parenthetical suffixes like (הוראת שעה)
    subject = subject.replace(/\s*\([^)]*\)\s*/g, ' ').trim();
    return subject;
  }

  // Fallback: just return as-is but strip parenthetical refs
  t = t.replace(/\s*\([^)]*\)\s*/g, ' ').replace(/\s+/g, ' ').trim();
  return t || titleHe;
}

/**
 * Generate a human-friendly explanation as subtitle.
 * Describes what the bill actually does or changes.
 */
function generateSubtitle(titleHe: string, headline: string): string {
  const t = titleHe;

  // If it's a chapter from the economic plan
  if (t.includes('התוכנית הכלכלית') || t.includes('ההתייעלות הכלכלית')) {
    return 'חלק מהתוכנית הכלכלית של הממשלה — חקיקה שמשפיעה על התקציב והכלכלה';
  }

  // If it has a dash amendment, use the main law name
  const mainLaw = t.match(/^הצעת חוק\s+(.+?)\s*\(תיקון/);
  if (mainLaw) {
    const lawName = mainLaw[1].trim();
    return `הצעה לשנות את חוק ${lawName} — ${headline}`;
  }

  // "לתיקון פקודת X"
  const ordinanceMatch = t.match(/לתיקון\s+פקודת\s+(.+?)(?:\s*\(|$)/);
  if (ordinanceMatch) {
    return `הצעה לשנות את פקודת ${ordinanceMatch[1].trim()}`;
  }

  // If proposer name context from tags
  if (t.includes('סיוע') || t.includes('תמיכה') || t.includes('שיקום')) {
    return `הצעת חוק חברתית שנועדה לסייע ולתמוך באוכלוסיות שזקוקות לכך`;
  }

  if (t.includes('איסור')) {
    return `הצעה לאסור פעולה מסוימת בחוק — לחצו לקרוא על מה מדובר`;
  }

  if (t.includes('הקמת') || t.includes('הקמה')) {
    return `הצעה להקים גוף או מוסד חדש — לחצו לפרטים`;
  }

  // Generic subtitle based on stage-type
  if (t.includes('תיקון')) {
    return `הצעה לשנות חוק קיים כדי לשפר את המצב הנוכחי`;
  }

  return `הצעת חוק שעשויה להשפיע על חיי היומיום שלכם`;
}

// ==================== PUBLIC API ====================

/**
 * Generate an attractive headline for a bill card.
 * Priority: AI summary first sentence > smart title parsing
 */
export function extractBillHeadline(titleHe: string, summaryHe: string | null): string {
  // If we have a real AI summary, use its first sentence
  if (summaryHe && summaryHe.trim().length > 20) {
    const clean = summaryHe
      .replace(/^##?\s*.+/gm, '')
      .replace(/[-*]/g, '')
      .replace(/\*\*/g, '')
      .replace(/\n+/g, ' ')
      .trim();

    const sentenceMatch = clean.match(/^(.+?[.!?])\s/);
    if (sentenceMatch && sentenceMatch[1].length > 15 && sentenceMatch[1].length < 120) {
      return sentenceMatch[1];
    }
    if (clean.length > 10 && clean.length < 120) {
      return clean;
    }
    if (clean.length >= 120) {
      const cut = clean.substring(0, 100);
      const lastSpace = cut.lastIndexOf(' ');
      return (lastSpace > 40 ? cut.substring(0, lastSpace) : cut) + '...';
    }
  }

  return humanizeTitle(titleHe);
}

/**
 * Generate an explanatory subtitle for a bill card.
 */
export function extractBillSubtitle(titleHe: string, summaryHe: string | null): string {
  const headline = extractBillHeadline(titleHe, summaryHe);

  if (summaryHe && summaryHe.trim().length > 20) {
    const clean = summaryHe
      .replace(/^##?\s*.+/gm, '')
      .replace(/[-*]/g, '')
      .replace(/\*\*/g, '')
      .replace(/\n+/g, ' ')
      .trim();

    // Remove the first sentence (used as headline) and return the rest
    const sentenceMatch = clean.match(/^.+?[.!?]\s+(.*)/s);
    if (sentenceMatch && sentenceMatch[1].trim().length > 10) {
      const rest = sentenceMatch[1].trim();
      return rest.length > 200 ? rest.substring(0, 200) + '...' : rest;
    }
  }

  return generateSubtitle(titleHe, headline);
}
