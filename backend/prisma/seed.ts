import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create badges
  const badges = await Promise.all([
    prisma.badge.create({
      data: {
        nameHe: 'אזרח פעיל',
        descriptionHe: 'הגיב על 10 הצעות חוק',
        requirementType: 'comments',
        requirementCount: 10,
        rarity: 'common',
      },
    }),
    prisma.badge.create({
      data: {
        nameHe: 'מציע מוביל',
        descriptionHe: 'הגיש 5 הצעות לשיפור',
        requirementType: 'suggestions',
        requirementCount: 5,
        rarity: 'rare',
      },
    }),
    prisma.badge.create({
      data: {
        nameHe: 'כוכב עולה',
        descriptionHe: 'סימן 20 הצעות חוק בכוכב',
        requirementType: 'stars',
        requirementCount: 20,
        rarity: 'common',
      },
    }),
    prisma.badge.create({
      data: {
        nameHe: 'מומחה חקיקה',
        descriptionHe: 'הגיש 25 הצעות לשיפור שאושרו',
        requirementType: 'accepted_suggestions',
        requirementCount: 25,
        rarity: 'epic',
      },
    }),
    prisma.badge.create({
      data: {
        nameHe: 'קול העם',
        descriptionHe: 'הצעת השיפור שלך קיבלה 100 הצבעות חיוביות',
        requirementType: 'suggestion_upvotes',
        requirementCount: 100,
        rarity: 'legendary',
      },
    }),
  ]);

  // Create sample bills
  const bills = await Promise.all([
    prisma.bill.create({
      data: {
        knessetBillId: 'P/25/1001',
        titleHe: 'הצעת חוק חינוך חינם לגיל הרך (תיקון)',
        proposerName: 'ישראל ישראלי',
        proposerParty: 'מפלגה דוגמה',
        fullTextHe: `הצעת חוק חינוך חינם לגיל הרך (תיקון), התשפ"ה-2025

1. בחוק חינוך חינם, התשל"ח-1978, בסעיף 2, אחרי "מגיל שלוש" יבוא "מגיל שנתיים".

2. המדינה תממן מסגרות חינוך לילדים מגיל שנתיים ומעלה, בהתאם לתקנות שיקבע שר החינוך.

3. דברי הסבר:
החוק הקיים מבטיח חינוך חינם מגיל 3. הצעת חוק זו מרחיבה את הזכות לגיל 2, כדי להקל על משפחות צעירות ולאפשר לשני ההורים לעבוד. מחקרים מראים שחינוך מוקדם איכותי תורם להתפתחות הילד ולצמצום פערים חברתיים.

עלות משוערת: 3.2 מיליארד ש"ח בשנה.`,
        summaryHe: `## תקציר
הצעת החוק מבקשת להוריד את גיל החינוך החינם מ-3 ל-2, כך שהמדינה תממן מעונות יום לילדים מגיל שנתיים. המטרה היא להקל על משפחות צעירות ולאפשר לשני ההורים לעבוד.

## נקודות עיקריות
- הורדת גיל החינוך החינם מ-3 ל-2
- המדינה תממן מסגרות חינוך לגיל הרך
- עלות משוערת: 3.2 מיליארד ש"ח בשנה

## מי מושפע?
משפחות עם ילדים בגיל 2-3, הורים עובדים, וגני ילדים פרטיים.

## השלכות אפשריות
חיסכון של אלפי שקלים בחודש למשפחות צעירות, הגדלת ההשתתפות בשוק העבודה, ושיפור ההתפתחות של ילדים צעירים.`,
        summaryGeneratedAt: new Date(),
        currentStage: 'TABLED',
        status: 'ACTIVE',
        submissionDate: new Date('2025-01-15'),
        categories: JSON.parse('["חינוך", "רווחה"]'),
        tags: JSON.parse('["גיל הרך", "חינוך חינם", "משפחות"]'),
        knessetSession: 25,
        starCount: 142,
        viewCount: 3200,
        commentCount: 28,
      },
    }),
    prisma.bill.create({
      data: {
        knessetBillId: 'P/25/1002',
        titleHe: 'הצעת חוק הגנת הצרכן (שקיפות מחירים ברשת)',
        proposerName: 'דנה כהן',
        proposerParty: 'מפלגה דוגמה ב',
        fullTextHe: `הצעת חוק הגנת הצרכן (שקיפות מחירים ברשת), התשפ"ה-2025

1. עסק המציע מוצרים או שירותים באתר אינטרנט יציג את המחיר הסופי, כולל כל המיסים והעמלות, כבר בדף המוצר הראשון.

2. אין להוסיף תשלומים נוספים בשלב התשלום שלא הוצגו קודם לכן.

3. עסק שיפר הוראה זו צפוי לקנס של עד 200,000 ש"ח.

4. דברי הסבר:
צרכנים רבים נתקלים בתופעה שבה המחיר המוצג באתר אינטרנט שונה מהמחיר הסופי בקופה. תופעה זו, המכונה "drip pricing", פוגעת באמון הצרכנים ומקשה על השוואת מחירים.`,
        summaryHe: `## תקציר
הצעת החוק דורשת מעסקים באינטרנט להציג את המחיר הסופי כולל כל העמלות והמיסים כבר בדף המוצר, ולא להוסיף חיובים מפתיעים בשלב התשלום.

## נקודות עיקריות
- חובת הצגת מחיר סופי כולל בדף המוצר
- איסור על הוספת עמלות בשלב הקופה
- קנס של עד 200,000 ש"ח על הפרה

## מי מושפע?
כל הצרכנים הקונים באינטרנט, וחנויות אונליין בישראל.

## השלכות אפשריות
שקיפות רבה יותר בקניות אונליין, קלות בהשוואת מחירים, ואמון גבוה יותר בקניות ברשת.`,
        summaryGeneratedAt: new Date(),
        currentStage: 'COMMITTEE',
        status: 'ACTIVE',
        submissionDate: new Date('2025-02-01'),
        categories: JSON.parse('["צרכנות", "כלכלה", "טכנולוגיה"]'),
        tags: JSON.parse('["מסחר אלקטרוני", "שקיפות", "הגנת הצרכן"]'),
        knessetSession: 25,
        starCount: 89,
        viewCount: 1800,
        commentCount: 15,
      },
    }),
    prisma.bill.create({
      data: {
        knessetBillId: 'P/25/1003',
        titleHe: 'הצעת חוק איכות הסביבה (הפחתת פליטות)',
        proposerName: 'מיכל לוי',
        proposerParty: 'מפלגה ירוקה',
        fullTextHe: `הצעת חוק איכות הסביבה (הפחתת פליטות), התשפ"ה-2025

1. כל מפעל תעשייתי שפולט מעל 10,000 טון פחמן דו-חמצני בשנה יחויב להפחית את הפליטות שלו ב-30% עד שנת 2030.

2. תוקם קרן לאומית לסיוע למפעלים במעבר לטכנולוגיות ירוקות.

3. מפעל שלא יעמוד ביעדים ישלם היטל פחמן של 100 ש"ח לכל טון עודף.

4. דברי הסבר:
ישראל התחייבה בהסכם פריז להפחתת פליטות גזי חממה. החוק הנוכחי אינו מספק מנגנוני אכיפה מספיקים. הצעת חוק זו מציבה יעדים ברורים ומנגנוני תמריץ וענישה.`,
        summaryHe: `## תקציר
הצעת החוק מחייבת מפעלים גדולים להפחית פליטות פחמן ב-30% עד 2030, מקימה קרן סיוע למעבר לטכנולוגיות ירוקות, ומטילה קנסות על מי שלא עומד ביעדים.

## נקודות עיקריות
- חובת הפחתת פליטות ב-30% עד 2030 למפעלים גדולים
- הקמת קרן לאומית לסיוע במעבר ירוק
- היטל של 100 ש"ח לכל טון פחמן עודף

## מי מושפע?
מפעלים תעשייתיים גדולים, תעשיית האנרגיה, וכלל האזרחים שנהנים מאוויר נקי יותר.

## השלכות אפשריות
שיפור באיכות האוויר, עלייה בעלויות ייצור בטווח הקצר, יצירת מקומות עבודה בתעשייה הירוקה.`,
        summaryGeneratedAt: new Date(),
        currentStage: 'FIRST_READING',
        status: 'ACTIVE',
        submissionDate: new Date('2024-11-10'),
        firstReadingDate: new Date('2025-01-20'),
        categories: JSON.parse('["סביבה", "תעשייה", "כלכלה"]'),
        tags: JSON.parse('["שינוי אקלים", "פליטות", "אנרגיה ירוקה"]'),
        knessetSession: 25,
        starCount: 234,
        viewCount: 5100,
        commentCount: 42,
      },
    }),
    prisma.bill.create({
      data: {
        knessetBillId: 'P/25/1004',
        titleHe: 'הצעת חוק שירותי בריאות (רפואה מרחוק)',
        proposerName: 'אבי גולד',
        proposerParty: 'מפלגה דוגמה',
        fullTextHe: `הצעת חוק שירותי בריאות (רפואה מרחוק), התשפ"ה-2025

1. קופות החולים יחויבו לאפשר ביקור רופא באמצעות שיחת וידאו לכל מבוטח.

2. תרופות שנרשמו במרשם דיגיטלי יהיו זמינות למשלוח עד הבית.

3. הזכות לרפואה מרחוק תחול גם על שירותי בריאות הנפש.

4. דברי הסבר:
מגפת הקורונה הוכיחה שרפואה מרחוק יעילה ונגישה. החוק הנוכחי אינו מסדיר את הנושא באופן מלא.`,
        currentStage: 'PROPOSED',
        status: 'ACTIVE',
        submissionDate: new Date('2025-03-01'),
        categories: JSON.parse('["בריאות", "טכנולוגיה"]'),
        tags: JSON.parse('["רפואה מרחוק", "דיגיטל", "קופות חולים"]'),
        knessetSession: 25,
        starCount: 67,
        viewCount: 980,
        commentCount: 8,
      },
    }),
    prisma.bill.create({
      data: {
        knessetBillId: 'P/25/1005',
        titleHe: 'הצעת חוק דיור (הגבלת שכר דירה)',
        proposerName: 'רונית שמעון',
        proposerParty: 'מפלגה חברתית',
        fullTextHe: `הצעת חוק דיור (הגבלת שכר דירה), התשפ"ה-2025

1. שכר הדירה לא יעלה על 30% מהשכר החציוני באזור המגורים.

2. העלאת שכר דירה תוגבל ל-3% בשנה.

3. יוקם מאגר מחירים ארצי לשכירויות.

4. דברי הסבר:
מחירי השכירות בישראל עלו ב-40% בעשור האחרון. משפחות רבות מוציאות יותר ממחצית הכנסתן על שכר דירה.`,
        currentStage: 'TABLED',
        status: 'ACTIVE',
        submissionDate: new Date('2025-02-15'),
        categories: JSON.parse('["דיור", "רווחה", "כלכלה"]'),
        tags: JSON.parse('["שכר דירה", "דיור", "יוקר המחיה"]'),
        knessetSession: 25,
        starCount: 312,
        viewCount: 7800,
        commentCount: 95,
      },
    }),
  ]);

  console.log(`Created ${badges.length} badges`);
  console.log(`Created ${bills.length} sample bills`);
  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
