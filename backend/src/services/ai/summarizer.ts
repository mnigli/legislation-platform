import OpenAI from 'openai';
import { config } from '../../config';
import { prisma } from '../../utils/prisma';

// Support both Groq and OpenAI - Groq uses OpenAI-compatible API
function createAIClient(): { client: OpenAI; model: string } {
  if (config.groqApiKey) {
    return {
      client: new OpenAI({
        apiKey: config.groqApiKey,
        baseURL: 'https://api.groq.com/openai/v1',
      }),
      model: 'llama-3.3-70b-versatile',
    };
  }
  if (config.openaiApiKey) {
    return {
      client: new OpenAI({ apiKey: config.openaiApiKey }),
      model: 'gpt-4o-mini',
    };
  }
  throw new Error('No AI API key configured (GROQ_API_KEY or OPENAI_API_KEY)');
}

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

async function summarizeChunk(client: OpenAI, model: string, chunk: string): Promise<string> {
  const response = await client.chat.completions.create({
    model,
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
  const { client, model } = createAIClient();

  const bill = await prisma.bill.findUnique({ where: { id: billId } });
  if (!bill) throw new Error('הצעת חוק לא נמצאה');

  const chunks = chunkText(bill.fullTextHe);
  let textForSummary: string;

  if (chunks.length === 1) {
    textForSummary = chunks[0];
  } else {
    // Map-Reduce: summarize each chunk, then combine
    const chunkSummaries = await Promise.all(
      chunks.map((chunk) => summarizeChunk(client, model, chunk))
    );
    textForSummary = chunkSummaries.join('\n\n');
  }

  const response = await client.chat.completions.create({
    model,
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
