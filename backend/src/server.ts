import app from './app';
import { config } from './config';
import { prisma } from './utils/prisma';
import { scrapeKnessetBills } from './services/knesset/scraper';
import { generateBillStatements } from './services/ai/summarizer';

// ==================== Daily Cron Jobs ====================

const STAR_THRESHOLD = 50; // כוכבים שמעלים הצעה לזירת דיונים

async function dailyScrapeAndEnrich() {
  console.log('[CRON] Starting daily Knesset scrape...');
  try {
    const result = await scrapeKnessetBills({ knessetNum: 25, count: 50 });
    console.log(`[CRON] Scrape done: ${result.created} created, ${result.updated} updated`);

    // Auto-generate statements for bills without them, that have summaries
    const billsNeedingStatements = await prisma.bill.findMany({
      where: {
        summaryHe: { not: null },
        statements: { none: {} },
        status: 'ACTIVE',
      },
      take: 10,
    });

    for (const bill of billsNeedingStatements) {
      try {
        console.log(`[CRON] Generating statements for: ${bill.titleHe.slice(0, 50)}`);
        const generated = await generateBillStatements(bill.id);
        await prisma.bill.update({
          where: { id: bill.id },
          data: {
            citizenTitle: generated.citizenTitle,
            stakeholders: generated.stakeholders,
            controversyPoints: generated.controversyPoints,
          },
        });
        await prisma.billStatement.deleteMany({ where: { billId: bill.id } });
        await prisma.billStatement.createMany({
          data: generated.statements.map((content, i) => ({ billId: bill.id, content, order: i })),
        });
      } catch (err) {
        console.error(`[CRON] Statement generation failed for ${bill.id}:`, err);
      }
    }

    // Promote bills that crossed the star threshold to featured
    await prisma.bill.updateMany({
      where: { starCount: { gte: STAR_THRESHOLD }, isFeatured: false },
      data: { isFeatured: true },
    });

    console.log('[CRON] Daily job complete');
  } catch (err) {
    console.error('[CRON] Daily job failed:', err);
  }
}

function startCronJobs() {
  if (config.nodeEnv !== 'production') {
    console.log('[CRON] Skipping cron jobs in non-production environment');
    return;
  }

  // Run every day at 6:00 AM UTC
  const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
  const now = new Date();
  const next6am = new Date(now);
  next6am.setUTCHours(6, 0, 0, 0);
  if (next6am <= now) next6am.setUTCDate(next6am.getUTCDate() + 1);
  const msUntil6am = next6am.getTime() - now.getTime();

  setTimeout(() => {
    dailyScrapeAndEnrich();
    setInterval(dailyScrapeAndEnrich, TWENTY_FOUR_HOURS);
  }, msUntil6am);

  console.log(`[CRON] Daily job scheduled — next run in ${Math.round(msUntil6am / 3600000)}h`);
}

// ==================== Server Start ====================

async function main() {
  try {
    await prisma.$connect();
    console.log('Connected to database');

    app.listen(config.port, () => {
      console.log(`Server running on http://localhost:${config.port}`);
      console.log(`Environment: ${config.nodeEnv}`);
    });

    startCronJobs();
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

main();

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
