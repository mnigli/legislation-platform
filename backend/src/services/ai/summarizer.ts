import OpenAI from 'openai';
import { config } from '../../config';
import { prisma } from '../../utils/prisma';

const openai = new OpenAI({ apiKey: config.openaiApiKey });

const SYSTEM_PROMPT = `אתה מומחה בחקיקה ישראלית ומתמחה בהנגשת מידע משפטי לציבור הרחב.
כתוב תמיד בעברית תקנית, בשפה פשוטה וברורה.
הימנע ממונחים משפטיים מורכבים ללא הסבר.
התמקד במה שהחוק משנה למעשה עבור האזרח הממוצע.`;

function buildUserPrompt(title: string, proposer: string | null, text: string): string {
  return `סכם את הצעת החוק הבאה:

כותרת: ${title}
מציע: ${proposer || 'לא ידוע'}
טקסט מלא:
${text}

פורמט התשובה (בדיוק כך):
## תקציר
[2-3 משפטים המסבירים את המטרה העיקרית]

## נקודות עיקריות
- [נקודה 1]
- [נקודה 2]
- [נקודה 3]

## מי מושפע?
[הסבר קצר]

## השלכות אפשריות
[השלכות על החיים היומיומיים]`;
}

function chunkText(text: string, maxChars: number = 8000): string[] {
  if (text.length <= maxChars) return [text];

  const chunks: string[] = [];
  const paragraphs = text.split(/\n\n+/);
  let current = '';

  for (const para of paragraphs) {
    if (current.length + para.length > maxChars) {
      if (current) chunks.push(current);
      current = para;
    } else {
      current += (current ? '\n\n' : '') + para;
    }
  }
  if (current) chunks.push(current);

  return chunks;
}

async function summarizeChunk(chunk: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'סכם את הקטע הבא מהצעת חוק ישראלית בעברית פשוטה. התמקד בנקודות העיקריות.' },
      { role: 'user', content: chunk },
    ],
    temperature: 0.3,
    max_tokens: 500,
  });
  return response.choices[0].message.content || '';
}

export async function generateBillSummary(billId: string): Promise<string> {
  const bill = await prisma.bill.findUnique({ where: { id: billId } });
  if (!bill) throw new Error('הצעת חוק לא נמצאה');

  const chunks = chunkText(bill.fullTextHe);
  let textForSummary: string;

  if (chunks.length === 1) {
    textForSummary = chunks[0];
  } else {
    // Map-Reduce: summarize each chunk, then combine
    const chunkSummaries = await Promise.all(chunks.map(summarizeChunk));
    textForSummary = chunkSummaries.join('\n\n');
  }

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: buildUserPrompt(bill.titleHe, bill.proposerName, textForSummary) },
    ],
    temperature: 0.3,
    max_tokens: 1000,
  });

  const summary = response.choices[0].message.content || '';

  await prisma.bill.update({
    where: { id: billId },
    data: {
      summaryHe: summary,
      summaryGeneratedAt: new Date(),
    },
  });

  return summary;
}
