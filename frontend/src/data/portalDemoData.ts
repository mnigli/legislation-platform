// ==================== ORGANIZATIONS PORTAL DEMO DATA ====================

export interface DemoActionBill {
  billIndex: number; // index into real bills array
  deadline: string;
  actionType: 'prepare_position' | 'committee_hearing' | 'vote';
  urgency: 'high' | 'medium' | 'low';
  committee: string;
}

export const DEMO_ORG_ACTION_BILLS: DemoActionBill[] = [
  { billIndex: 0, deadline: '2025-02-20', actionType: 'committee_hearing', urgency: 'high', committee: 'ועדת החינוך' },
  { billIndex: 1, deadline: '2025-02-22', actionType: 'prepare_position', urgency: 'high', committee: 'ועדת הכלכלה' },
  { billIndex: 2, deadline: '2025-02-25', actionType: 'vote', urgency: 'medium', committee: 'ועדת הפנים' },
  { billIndex: 3, deadline: '2025-03-01', actionType: 'prepare_position', urgency: 'low', committee: 'ועדת העבודה' },
  { billIndex: 4, deadline: '2025-03-05', actionType: 'committee_hearing', urgency: 'low', committee: 'ועדת הבריאות' },
];

export interface DemoTopicFolder {
  name: string;
  icon: string;
  trackedBillCount: number;
  risks: number;
  opportunities: number;
  lastActivity: string;
  searchCategory: string;
}

export const DEMO_ORG_TOPIC_FOLDERS: DemoTopicFolder[] = [
  { name: 'בריאות הנפש', icon: '🧠', trackedBillCount: 8, risks: 2, opportunities: 5, lastActivity: 'לפני שעתיים', searchCategory: 'בריאות' },
  { name: 'דיור ציבורי', icon: '🏘️', trackedBillCount: 12, risks: 4, opportunities: 3, lastActivity: 'לפני יום', searchCategory: 'דיור' },
  { name: 'זכויות עובדים', icon: '👷', trackedBillCount: 6, risks: 1, opportunities: 4, lastActivity: 'לפני 3 ימים', searchCategory: 'רווחה' },
  { name: 'רגולציה טכנולוגית', icon: '🤖', trackedBillCount: 4, risks: 3, opportunities: 2, lastActivity: 'לפני שבוע', searchCategory: 'טכנולוגיה' },
];

export interface DemoCollaboration {
  orgName: string;
  orgIcon: string;
  billIndex: number;
  stance: 'for' | 'against' | 'mixed';
  coalitionOpen: boolean;
  members: number;
}

export const DEMO_ORG_COLLABORATIONS: DemoCollaboration[] = [
  { orgName: 'אדם טבע ודין', orgIcon: '🌿', billIndex: 0, stance: 'for', coalitionOpen: true, members: 5 },
  { orgName: 'האגודה לזכויות האזרח', orgIcon: '⚖️', billIndex: 1, stance: 'against', coalitionOpen: true, members: 8 },
  { orgName: 'ידיד – מרכזי זכויות', orgIcon: '🤝', billIndex: 2, stance: 'for', coalitionOpen: false, members: 3 },
  { orgName: 'הקליניקה לזכויות בריאות', orgIcon: '🏥', billIndex: 3, stance: 'mixed', coalitionOpen: true, members: 4 },
  { orgName: 'במקום – מתכננים למען זכויות', orgIcon: '🏗️', billIndex: 4, stance: 'for', coalitionOpen: true, members: 6 },
];

export const DEMO_ORG_POSITION = {
  stance: 'against' as const,
  problematicClauses: [
    { clauseNum: '3(א)', issue: 'אין התייחסות מספקת לאוכלוסיות מיוחדות' },
    { clauseNum: '5(ב)', issue: 'לוח הזמנים ליישום קצר מדי – 30 ימים במקום 90' },
    { clauseNum: '7', issue: 'אין מנגנון ערעור או בקרה עצמאית' },
  ],
  proposedAmendment: 'מוצע להאריך את תקופת היישום ל-90 ימים ולהוסיף ועדת מעקב עצמאית שתכלול נציגי ציבור.',
  reasoning: 'מחקר של מכון ברוקדייל (2024) מצא כי תקופות יישום קצרות מובילות לפגיעה בלתי מידתית באוכלוסיות חלשות. בנוסף, OECD ממליצה על מנגנוני בקרה עצמאיים בחקיקה מסוג זה.',
  sources: ['מכון ברוקדייל, 2024', 'OECD Guidelines on Regulatory Impact', 'ניסיון מקומי – חוק ביטוח בריאות ממלכתי'],
  deadline: '2025-02-20',
};

export const DEMO_ORG_COMMITTEE_MATERIALS = {
  documents: [
    { name: 'עמדת ארגון – טיוטה סופית.pdf', size: '245 KB', type: 'position' },
    { name: 'סיכום מחקר השוואתי.pdf', size: '1.2 MB', type: 'research' },
    { name: 'מצגת לדיון בוועדה.pptx', size: '3.8 MB', type: 'presentation' },
  ],
  talkingPoints: [
    'החוק במתכונתו הנוכחית פוגע באוכלוסיות חלשות ללא מנגנון מגן',
    'ניתן להשיג את מטרת החוק עם תיקון קל – הארכת תקופת היישום',
    'ניסיון בינלאומי מראה שמנגנון בקרה מפחית תלונות ב-40%',
    'ארגונים נוספים שותפים לעמדה זו (רשימה מצורפת)',
  ],
  questions: [
    { target: 'יו"ר הוועדה', question: 'האם נשקלה האפשרות להאריך את תקופת היישום?' },
    { target: 'נציג המשרד', question: 'מהי ההערכה לעלות היישום בפריפריה?' },
    { target: 'חכ" המציע', question: 'האם תתמכו בהוספת סעיף מעקב שנתי?' },
  ],
};

export const DEMO_ORG_ACTIVITY_LOG = [
  { action: 'עמדה עודכנה', user: 'יעל כהן', time: 'לפני שעתיים', type: 'edit' },
  { action: 'שותף עם הצוות', user: 'דני לוי', time: 'לפני 5 שעות', type: 'share' },
  { action: 'תגובה: "לטיפול דחוף"', user: 'מיכל אברהם', time: 'אתמול', type: 'tag' },
  { action: 'דיון בוועדה נקבע', user: 'מערכת', time: 'לפני 3 ימים', type: 'alert' },
  { action: 'טיוטה ראשונה נוצרה', user: 'יעל כהן', time: 'לפני שבוע', type: 'create' },
];

// ==================== MEDIA PORTAL DEMO DATA ====================

export interface DemoHotBillMetric {
  billIndex: number;
  weeklyGrowthPct: number;
  shareCount: number;
  commentRate: number; // per day
}

export const DEMO_HOT_BILL_METRICS: DemoHotBillMetric[] = [
  { billIndex: 0, weeklyGrowthPct: 340, shareCount: 1250, commentRate: 45 },
  { billIndex: 1, weeklyGrowthPct: 180, shareCount: 890, commentRate: 32 },
  { billIndex: 2, weeklyGrowthPct: 120, shareCount: 560, commentRate: 28 },
  { billIndex: 3, weeklyGrowthPct: 85, shareCount: 340, commentRate: 18 },
  { billIndex: 4, weeklyGrowthPct: 60, shareCount: 210, commentRate: 12 },
];

export interface DemoControversialBill {
  billIndex: number;
  forPct: number;
  againstPct: number;
  amendmentCount: number;
  extremeComments: number;
}

export const DEMO_CONTROVERSIAL_BILLS: DemoControversialBill[] = [
  { billIndex: 0, forPct: 52, againstPct: 48, amendmentCount: 23, extremeComments: 15 },
  { billIndex: 1, forPct: 38, againstPct: 62, amendmentCount: 41, extremeComments: 28 },
  { billIndex: 2, forPct: 45, againstPct: 55, amendmentCount: 18, extremeComments: 9 },
];

export interface DemoWeeklyChange {
  billIndex: number;
  changes: { clauseNum: string; before: string; after: string; changeType: 'added' | 'removed' | 'modified' }[];
  officialQuote: string;
  quoteSource: string;
}

export const DEMO_WEEKLY_CHANGES: DemoWeeklyChange[] = [
  {
    billIndex: 0,
    changes: [
      { clauseNum: '3(א)', before: 'תקופת היישום: 30 ימים', after: 'תקופת היישום: 60 ימים', changeType: 'modified' },
      { clauseNum: '5(ב)', before: '', after: 'תוקם ועדת מעקב בת 5 חברים', changeType: 'added' },
    ],
    officialQuote: 'ההצעה תוקנה בהתאם לדרישות הוועדה',
    quoteSource: 'יו"ר ועדת החינוך',
  },
  {
    billIndex: 1,
    changes: [
      { clauseNum: '2', before: 'תקציב: 50 מיליון ₪', after: 'תקציב: 75 מיליון ₪', changeType: 'modified' },
      { clauseNum: '8', before: 'פטור למפעלים קטנים', after: '', changeType: 'removed' },
    ],
    officialQuote: 'התקציב הוגדל לאחר דיון מעמיק',
    quoteSource: 'חכ" יוזם',
  },
];

export interface DemoConnectionNode {
  mkName: string;
  party: string;
  committees: string[];
  billCount: number;
  ministries: string[];
}

export const DEMO_CONNECTION_MAP: DemoConnectionNode[] = [
  { mkName: 'חכ" ישראל כהן', party: 'הליכוד', committees: ['ועדת הכלכלה', 'ועדת הכספים'], billCount: 12, ministries: ['משרד האוצר'] },
  { mkName: 'חכ" מיכל לוי', party: 'יש עתיד', committees: ['ועדת החינוך', 'ועדת המדע'], billCount: 8, ministries: ['משרד החינוך'] },
  { mkName: 'חכ" אמיר פרץ', party: 'העבודה', committees: ['ועדת הפנים', 'ועדת העבודה'], billCount: 15, ministries: ['משרד הרווחה', 'משרד הפנים'] },
  { mkName: 'חכ" שרה דוד', party: 'ישראל ביתנו', committees: ['ועדת הבריאות'], billCount: 6, ministries: ['משרד הבריאות'] },
  { mkName: 'חכ" יוסי אברהם', party: 'הציונות הדתית', committees: ['ועדת חוקה', 'ועדת הפנים'], billCount: 9, ministries: ['משרד המשפטים'] },
  { mkName: 'חכ" נעמה רון', party: 'מרצ', committees: ['ועדת הסביבה', 'ועדת הכלכלה'], billCount: 7, ministries: ['המשרד להגנת הסביבה'] },
];

export const DEMO_BILL_METRICS_OVER_TIME = [
  { week: 'שבוע 1', stars: 12, comments: 5, views: 340 },
  { week: 'שבוע 2', stars: 28, comments: 18, views: 890 },
  { week: 'שבוע 3', stars: 45, comments: 32, views: 2100 },
  { week: 'שבוע 4', stars: 89, comments: 67, views: 4500 },
  { week: 'שבוע 5', stars: 134, comments: 95, views: 7800 },
  { week: 'שבוע 6', stars: 156, comments: 110, views: 9200 },
];

export const DEMO_VERSION_HISTORY = [
  { version: 'v3', date: '2025-02-15', summary: 'תיקון סעיפי תקציב והוספת ועדת מעקב', changesCount: 4 },
  { version: 'v2', date: '2025-01-28', summary: 'הארכת תקופת יישום מ-30 ל-60 ימים', changesCount: 2 },
  { version: 'v1', date: '2025-01-10', summary: 'הגשה ראשונה לכנסת', changesCount: 0 },
];

export const DEMO_SIMILAR_LAWS = [
  { name: 'חוק ביטוח בריאות ממלכתי (תיקון 67)', year: 2019, similarity: 78 },
  { name: 'חוק הפיקוח על שירותים פיננסיים', year: 2021, similarity: 65 },
  { name: 'חוק זכויות החולה (תיקון 12)', year: 2022, similarity: 54 },
];

export const DEMO_KEY_CONCEPTS = [
  { term: 'קריאה ראשונה', definition: 'הצבעה ראשונית של מליאת הכנסת על עקרונות ההצעה' },
  { term: 'ועדת משנה', definition: 'גוף מצומצם הבוחן סעיפים ספציפיים לפני חזרה לוועדה' },
  { term: 'הסתייגות', definition: 'בקשת חכ" לשנות סעיף ספציפי לפני ההצבעה' },
];

// ==================== MK PORTAL DEMO DATA ====================

export interface DemoMkBill {
  billIndex: number;
  nextStep: string;
  nextStepDate: string;
  followers: number;
  feedbackCount: number;
}

export const DEMO_MK_BILLS: DemoMkBill[] = [
  { billIndex: 0, nextStep: 'דיון בוועדת החינוך', nextStepDate: '2025-02-20', followers: 342, feedbackCount: 89 },
  { billIndex: 1, nextStep: 'הצבעה בקריאה ראשונה', nextStepDate: '2025-02-25', followers: 567, feedbackCount: 156 },
  { billIndex: 2, nextStep: 'חזרה לוועדה אחרי קריאה', nextStepDate: '2025-03-01', followers: 234, feedbackCount: 45 },
  { billIndex: 3, nextStep: 'הנחה על שולחן הכנסת', nextStepDate: '2025-03-10', followers: 128, feedbackCount: 23 },
];

export interface DemoFeedbackByClause {
  clauseNum: string;
  totalComments: number;
  sentiment: number; // -100 to 100
  topThemes: string[];
}

export const DEMO_MK_FEEDBACK_SUMMARY: DemoFeedbackByClause[] = [
  { clauseNum: 'סעיף 1', totalComments: 45, sentiment: 72, topThemes: ['תמיכה ברפורמה', 'דרישה להרחבה'] },
  { clauseNum: 'סעיף 3(א)', totalComments: 89, sentiment: -35, topThemes: ['חשש מפגיעה', 'בקשת הגנות', 'דרישה לנתונים'] },
  { clauseNum: 'סעיף 5', totalComments: 34, sentiment: 15, topThemes: ['הצעות תיקון', 'חוסר בהירות'] },
  { clauseNum: 'סעיף 7', totalComments: 56, sentiment: -60, topThemes: ['התנגדות', 'אי שוויון', 'חלופות'] },
];

export interface DemoTopComment {
  author: string;
  role: 'expert' | 'citizen' | 'org';
  isVerified: boolean;
  content: string;
  upvotes: number;
  qualityScore: number; // 0-100
  clause: string;
}

export const DEMO_MK_TOP_COMMENTS: DemoTopComment[] = [
  { author: 'ד"ר רונית שפירא', role: 'expert', isVerified: true, content: 'הסעיף אינו מתחשב במחקרים עדכניים שמצאו כי תקופת הסתגלות של 90 יום מפחיתה תלונות ב-40%.', upvotes: 234, qualityScore: 95, clause: 'סעיף 3(א)' },
  { author: 'עמותת ידיד', role: 'org', isVerified: true, content: 'אנו ממליצים להוסיף סעיף הגנה לאוכלוסיות מוחלשות, בדומה לחוק הביטוח הלאומי.', upvotes: 189, qualityScore: 92, clause: 'סעיף 5' },
  { author: 'יוסי כהן', role: 'citizen', isVerified: true, content: 'כבעל עסק קטן, סעיף 7 ישפיע דרמטית על העלויות שלי. מציע פטור לעסקים עד 10 עובדים.', upvotes: 156, qualityScore: 88, clause: 'סעיף 7' },
  { author: 'פרופ" אביגיל לוי', role: 'expert', isVerified: true, content: 'ניסיון בינלאומי (גרמניה, שוודיה) מראה שמנגנון בקרה עצמאי קריטי להצלחת רפורמות דומות.', upvotes: 145, qualityScore: 96, clause: 'כללי' },
  { author: 'דנה אברהמי', role: 'citizen', isVerified: false, content: 'ההצעה טובה עקרונית אבל חסר תקציב ייעודי. בלי תקציב זה יישאר על הנייר.', upvotes: 123, qualityScore: 78, clause: 'סעיף 1' },
  { author: 'לשכת עורכי הדין', role: 'org', isVerified: true, content: 'נדרש תיקון טכני: הגדרת "מוסד מוכר" בסעיף 2 רחבה מדי ועלולה ליצור חוסר ודאות.', upvotes: 112, qualityScore: 90, clause: 'סעיף 2' },
  { author: 'מיכאל ברק', role: 'citizen', isVerified: true, content: 'כמי שעבד 20 שנה בתחום – הסעיף הזה נחוץ מאוד. ראיתי את ההשלכות של היעדר רגולציה.', upvotes: 98, qualityScore: 82, clause: 'סעיף 1' },
  { author: 'ד"ר נועם גרשון', role: 'expert', isVerified: true, content: 'מומלץ להוסיף סעיף סקירה תקופתית (sunset clause) לאחר 5 שנים.', upvotes: 87, qualityScore: 93, clause: 'כללי' },
  { author: 'רחלי ספיר', role: 'citizen', isVerified: false, content: 'אני תומכת, אבל מבקשת שהמועדים יתחשבו בלוח השנה העברי ולא רק הלועזי.', upvotes: 67, qualityScore: 70, clause: 'סעיף 5' },
  { author: 'מרכז אדוה', role: 'org', isVerified: true, content: 'נתונים שפרסמנו מראים פער של 340% בנגישות לשירות בין מרכז לפריפריה. ההצעה לא מתייחסת לכך.', upvotes: 56, qualityScore: 91, clause: 'סעיף 3(א)' },
];

export const DEMO_MK_AUDIENCE_STATS = {
  followers: 2340,
  reads: 18500,
  amendments: 156,
  topicInterestMap: {
    'חינוך': 340,
    'בריאות': 280,
    'כלכלה': 250,
    'דיור': 220,
    'סביבה': 180,
    'ביטחון': 150,
    'רווחה': 120,
    'טכנולוגיה': 90,
  } as Record<string, number>,
};

export interface DemoMkInboxItem {
  id: string;
  senderName: string;
  senderType: 'expert' | 'citizen' | 'org';
  isVerified: boolean;
  qualityScore: number;
  summary: string;
  fullContent: string;
  clause: string;
  timestamp: string;
}

export const DEMO_MK_INBOX: DemoMkInboxItem[] = [
  { id: '1', senderName: 'ד"ר רונית שפירא', senderType: 'expert', isVerified: true, qualityScore: 95, summary: 'מומחית לרפואה ציבורית מציעה תיקון לסעיף 3', fullContent: 'כרופאה ציבורית עם 20 שנות ניסיון, אני מבקשת להציע תיקון מהותי לסעיף 3(א). המחקר העדכני ביותר מראה שתקופת הסתגלות של 90 יום (ולא 30) מפחיתה תלונות בכ-40%.', clause: 'סעיף 3(א)', timestamp: 'לפני שעתיים' },
  { id: '2', senderName: 'עמותת ידיד', senderType: 'org', isVerified: true, qualityScore: 92, summary: 'עמותה מבקשת הוספת סעיף הגנה', fullContent: 'כארגון המטפל ב-50,000 פניות בשנה, אנו עדים להשפעות הישירות של חקיקה מסוג זה. מצורף מסמך מפורט עם 3 המלצות לתיקון.', clause: 'סעיף 5', timestamp: 'לפני 5 שעות' },
  { id: '3', senderName: 'יוסי כהן', senderType: 'citizen', isVerified: true, qualityScore: 88, summary: 'בעל עסק קטן מעלה חשש מסעיף 7', fullContent: 'מפעיל חנות בפריפריה כבר 15 שנה. הסעיף הנוכחי ישפיע באופן דרמטי על עסקים כמו שלי. מציע פטור לעסקים קטנים.', clause: 'סעיף 7', timestamp: 'אתמול' },
  { id: '4', senderName: 'פרופ" אביגיל לוי', senderType: 'expert', isVerified: true, qualityScore: 96, summary: 'חוקרת מהאוניברסיטה מציעה מנגנון בקרה', fullContent: 'מחקר השוואתי שערכתי מצא ש-87% מהרפורמות הדומות שהצליחו כללו ועדת מעקב עצמאית. מצורף המחקר המלא.', clause: 'כללי', timestamp: 'לפני יומיים' },
  { id: '5', senderName: 'דנה אברהמי', senderType: 'citizen', isVerified: false, qualityScore: 65, summary: 'אזרחית שואלת על תקציב', fullContent: 'קראתי את ההצעה וזה נראה טוב, אבל איפה התקציב? בלי תקציב זה נשאר על הנייר.', clause: 'סעיף 1', timestamp: 'לפני 3 ימים' },
];

export interface DemoDecision {
  commentIndex: number;
  status: 'accepted' | 'rejected' | 'pending';
  reason: string;
}

export const DEMO_MK_DECISIONS: DemoDecision[] = [
  { commentIndex: 0, status: 'accepted', reason: 'תקופת ההסתגלות תוארך ל-90 ימים בהתאם למחקר' },
  { commentIndex: 1, status: 'accepted', reason: 'סעיף הגנה ייוסף בנוסח הבא' },
  { commentIndex: 2, status: 'pending', reason: '' },
  { commentIndex: 3, status: 'accepted', reason: 'ועדת מעקב תתווסף בגרסה הבאה' },
  { commentIndex: 4, status: 'rejected', reason: 'נושא התקציב מטופל בהצעת חוק תקציב נפרדת' },
  { commentIndex: 5, status: 'accepted', reason: 'הגדרה תצומצם בהתאם' },
];

export const SHARE_MODES = [
  { id: 'readonly', label: 'לקריאה בלבד', icon: '👁️', desc: 'הציבור יכול לקרוא את ההצעה ותקציר AI' },
  { id: 'vote', label: 'הצבעה + נימוק', icon: '🗳️', desc: 'הציבור יכול להצביע בעד/נגד ולנמק' },
  { id: 'amend', label: 'הצעת תיקון', icon: '✏️', desc: 'משתמשים מאומתים יכולים להציע תיקוני סעיפים' },
] as const;
