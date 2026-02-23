/**
 * Utility functions for generating attractive, human-readable
 * bill headlines and subtitles from Knesset legal titles and AI summaries.
 */

/**
 * Clean the Knesset-style title into something human-readable.
 * Examples:
 *   "הצעת חוק העונשין (תיקון – איסור פרסום מידע מזהה של שוטרים), התשפ"ה-2025"
 *   → "איסור פרסום מידע מזהה של שוטרים"
 *
 *   "הצעת חוק ביטוח בריאות ממלכתי (תיקון מס' 90), התשפ"ה-2025"
 *   → "שינוי בביטוח בריאות ממלכתי"
 */
function cleanTitle(titleHe: string): string {
  let cleaned = titleHe;

  // Remove year suffix like התשפ"ה-2025 or התשפ"ו–2026
  cleaned = cleaned.replace(/,?\s*התש[א-ת][״"׳'][א-ת][-–—]\d{4}$/g, '').trim();

  // Try to extract content from parenthetical (תיקון – ...)
  const dashMatch = cleaned.match(/\(תיקון\s*[-–—]\s*(.+?)\)/);
  if (dashMatch) {
    return dashMatch[1].trim();
  }

  // If there's a parenthetical with just (תיקון מס' ...) or (תיקון), simplify
  const amendmentMatch = cleaned.match(/^הצעת חוק\s+(.+?)\s*\(תיקון(?:\s+מס['׳]\s*\d+)?\)/);
  if (amendmentMatch) {
    return `שינוי ב${amendmentMatch[1].trim()}`;
  }

  // Remove "הצעת חוק" prefix
  cleaned = cleaned.replace(/^הצעת חוק\s+/, '');

  // Remove remaining parenthetical content like (הוראת שעה) or (תיקון)
  cleaned = cleaned.replace(/\s*\([^)]*\)\s*/g, ' ').trim();

  return cleaned || titleHe;
}

/**
 * Extract the first meaningful sentence from an AI summary.
 */
function extractFirstSentence(summaryHe: string): string {
  // Clean markdown
  const clean = summaryHe
    .replace(/^##?\s*.+/gm, '')  // Remove headings
    .replace(/[-*]/g, '')         // Remove list markers
    .replace(/\*\*/g, '')         // Remove bold
    .replace(/\n+/g, ' ')        // Collapse newlines
    .trim();

  // Get first sentence (end at period, exclamation, or question mark)
  const sentenceMatch = clean.match(/^(.+?[.!?])\s/);
  if (sentenceMatch && sentenceMatch[1].length > 15 && sentenceMatch[1].length < 120) {
    return sentenceMatch[1];
  }

  // If no clear sentence break, take first ~80 chars at word boundary
  if (clean.length > 80) {
    const cut = clean.substring(0, 80);
    const lastSpace = cut.lastIndexOf(' ');
    return (lastSpace > 40 ? cut.substring(0, lastSpace) : cut) + '...';
  }

  return clean;
}

/**
 * Generate an attractive, catchy headline for a bill card.
 * Priority: first sentence of AI summary > cleaned title
 */
export function extractBillHeadline(titleHe: string, summaryHe: string | null): string {
  // If we have an AI summary, use its first sentence as headline
  if (summaryHe && summaryHe.trim().length > 20) {
    return extractFirstSentence(summaryHe);
  }

  // Fallback: clean the Knesset title into something readable
  return cleanTitle(titleHe);
}

/**
 * Generate an explanatory subtitle for a bill card.
 * This explains what the bill actually does, in plain language.
 */
export function extractBillSubtitle(titleHe: string, summaryHe: string | null): string {
  if (summaryHe && summaryHe.trim().length > 20) {
    // Clean the summary
    const clean = summaryHe
      .replace(/^##?\s*.+/gm, '')
      .replace(/[-*]/g, '')
      .replace(/\*\*/g, '')
      .replace(/\n+/g, ' ')
      .trim();

    // Remove the first sentence (which is used as headline)
    const sentenceMatch = clean.match(/^(.+?[.!?])\s+(.*)/s);
    if (sentenceMatch && sentenceMatch[2].length > 10) {
      const rest = sentenceMatch[2].trim();
      return rest.length > 200 ? rest.substring(0, 200) + '...' : rest;
    }

    // If only one sentence, use the cleaned Knesset title as context
    return cleanTitle(titleHe);
  }

  // No AI summary: generate a friendly explanation from the title
  const cleaned = cleanTitle(titleHe);
  if (titleHe.includes('תיקון')) {
    return `הצעה לשינוי חקיקה קיימת שעוסקת ב${cleaned.toLowerCase() === cleaned ? cleaned : cleaned}`;
  }
  return `הצעת חוק חדשה שמטרתה להסדיר את נושא ${cleaned}`;
}
