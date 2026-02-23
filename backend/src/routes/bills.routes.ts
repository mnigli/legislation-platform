import { Router, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { prisma } from '../utils/prisma';
import { authenticateToken, optionalAuth, requireRole } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { generateBillSummary, generateBillStatements } from '../services/ai/summarizer';

const router = Router();

const summarizeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 summarizations per hour per IP
  message: { success: false, error: { code: 'RATE_LIMIT', message: 'יותר מדי בקשות סיכום, נסו שוב מאוחר יותר' } },
});

// GET /bills - List bills with filters
router.get('/', optionalAuth, async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);
    const skip = (page - 1) * limit;
    const sort = (req.query.sort as string) || 'newest';
    const category = req.query.category as string;
    const stage = req.query.stage as string;
    const status = req.query.status as string;
    const search = req.query.search as string;

    const where: any = {};

    if (category) {
      where.categories = { array_contains: [category] };
    }
    if (stage) {
      where.currentStage = stage;
    }
    if (status) {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { titleHe: { contains: search, mode: 'insensitive' } },
        { summaryHe: { contains: search, mode: 'insensitive' } },
        { proposerName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const orderBy: any =
      sort === 'stars' ? { starCount: 'desc' } :
      sort === 'views' ? { viewCount: 'desc' } :
      sort === 'comments' ? { commentCount: 'desc' } :
      sort === 'oldest' ? { createdAt: 'asc' } :
      { createdAt: 'desc' };

    const [bills, total] = await Promise.all([
      prisma.bill.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          stars: req.user ? { where: { userId: req.user.id }, select: { id: true } } : false,
        },
      }),
      prisma.bill.count({ where }),
    ]);

    const billsWithStarred = bills.map((bill) => {
      const { stars, ...rest } = bill as any;
      return {
        ...rest,
        isStarred: stars ? stars.length > 0 : false,
      };
    });

    res.json({
      success: true,
      data: billsWithStarred,
      meta: {
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      },
    });
  } catch (error) {
    console.error('List bills error:', error);
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'שגיאה בטעינת הצעות חוק' } });
  }
});

// GET /bills/trending - Trending bills
router.get('/trending', optionalAuth, async (_req: Request, res: Response) => {
  try {
    const bills = await prisma.bill.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { starCount: 'desc' },
      take: 10,
    });
    res.json({ success: true, data: bills });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'שגיאה' } });
  }
});

// GET /bills/latest - Latest bills (by creation date)
router.get('/latest', optionalAuth, async (_req: Request, res: Response) => {
  try {
    const bills = await prisma.bill.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
    res.json({ success: true, data: bills });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'שגיאה' } });
  }
});

// GET /bills/stats - Overall statistics
router.get('/stats', async (_req: Request, res: Response) => {
  try {
    const [totalBills, totalStars, totalComments] = await Promise.all([
      prisma.bill.count({ where: { status: 'ACTIVE' } }),
      prisma.bill.aggregate({ _sum: { starCount: true } }),
      prisma.bill.aggregate({ _sum: { commentCount: true } }),
    ]);

    res.json({
      success: true,
      data: {
        totalBills,
        totalStars: totalStars._sum.starCount || 0,
        totalComments: totalComments._sum.commentCount || 0,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'שגיאה' } });
  }
});

// GET /bills/:id - Get single bill
router.get('/:id', optionalAuth, async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const bill = await prisma.bill.findUnique({
      where: { id },
      include: {
        stars: req.user ? { where: { userId: req.user.id }, select: { id: true } } : false,
        _count: { select: { suggestions: true, comments: true, stars: true } },
      },
    });

    if (!bill) {
      res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'הצעת חוק לא נמצאה' } });
      return;
    }

    await prisma.bill.update({ where: { id }, data: { viewCount: { increment: 1 } } });

    const { stars, ...rest } = bill as any;
    res.json({
      success: true,
      data: { ...rest, isStarred: stars ? stars.length > 0 : false },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'שגיאה' } });
  }
});

// POST /bills/:id/star - Star a bill
router.post('/:id/star', authenticateToken, async (req: Request, res: Response) => {
  try {
    const billId = req.params.id as string;
    const userId = req.user!.id;

    const existing = await prisma.billStar.findUnique({
      where: { userId_billId: { userId, billId } },
    });

    if (existing) {
      res.status(409).json({ success: false, error: { code: 'ALREADY_STARRED', message: 'כבר סומן בכוכב' } });
      return;
    }

    await prisma.$transaction([
      prisma.billStar.create({ data: { userId, billId } }),
      prisma.bill.update({ where: { id: billId }, data: { starCount: { increment: 1 } } }),
      prisma.user.update({ where: { id: userId }, data: { points: { increment: 1 } } }),
    ]);

    res.json({ success: true, data: { starred: true } });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'שגיאה' } });
  }
});

// DELETE /bills/:id/star - Unstar a bill
router.delete('/:id/star', authenticateToken, async (req: Request, res: Response) => {
  try {
    const billId = req.params.id as string;
    const userId = req.user!.id;

    const existing = await prisma.billStar.findUnique({
      where: { userId_billId: { userId, billId } },
    });

    if (!existing) {
      res.status(404).json({ success: false, error: { code: 'NOT_STARRED', message: 'לא סומן בכוכב' } });
      return;
    }

    await prisma.$transaction([
      prisma.billStar.delete({ where: { userId_billId: { userId, billId } } }),
      prisma.bill.update({ where: { id: billId }, data: { starCount: { decrement: 1 } } }),
    ]);

    res.json({ success: true, data: { starred: false } });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'שגיאה' } });
  }
});

// GET /bills/search - Full-text search
router.get('/search', optionalAuth, async (req: Request, res: Response) => {
  try {
    const q = req.query.q as string;
    if (!q || q.length < 2) {
      res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'חיפוש חייב להיות לפחות 2 תווים' } });
      return;
    }

    const bills = await prisma.bill.findMany({
      where: {
        OR: [
          { titleHe: { contains: q, mode: 'insensitive' } },
          { summaryHe: { contains: q, mode: 'insensitive' } },
          { fullTextHe: { contains: q, mode: 'insensitive' } },
        ],
      },
      orderBy: { starCount: 'desc' },
      take: 20,
    });

    res.json({ success: true, data: bills });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'שגיאה בחיפוש' } });
  }
});

// POST /bills/:id/summarize - Generate AI summary for a bill
router.post('/:id/summarize', authenticateToken, summarizeLimiter, async (req: Request, res: Response) => {
  try {
    const billId = req.params.id as string;

    const bill = await prisma.bill.findUnique({ where: { id: billId } });
    if (!bill) {
      res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'הצעת חוק לא נמצאה' } });
      return;
    }

    console.log(`Generating AI summary for bill: ${bill.titleHe}`);
    const summary = await generateBillSummary(billId);

    res.json({
      success: true,
      data: {
        billId,
        summary,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error('Summarize error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SUMMARIZE_ERROR', message: 'שגיאה ביצירת תקציר' },
    });
  }
});

// ==================== vTaiwan Statements ====================

// GET /bills/:id/statements - Get discussion statements for a bill
router.get('/:id/statements', optionalAuth, async (req: Request, res: Response) => {
  try {
    const billId = req.params.id as string;

    const statements = await prisma.billStatement.findMany({
      where: { billId },
      orderBy: { order: 'asc' },
      include: req.user ? {
        votes: { where: { userId: req.user.id }, select: { value: true } },
      } : undefined,
    });

    const result = statements.map((s) => {
      const { votes, ...rest } = s as any;
      return {
        ...rest,
        userVote: votes && votes.length > 0 ? votes[0].value : null,
      };
    });

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Get statements error:', error);
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'שגיאה בטעינת שאלות דיון' } });
  }
});

// POST /bills/:id/statements/generate - AI generates statements (ADMIN only)
router.post('/:id/statements/generate', authenticateToken, requireRole('ADMIN'), async (req: Request, res: Response) => {
  try {
    const billId = req.params.id as string;

    const bill = await prisma.bill.findUnique({ where: { id: billId } });
    if (!bill) {
      res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'הצעת חוק לא נמצאה' } });
      return;
    }

    console.log(`Generating vTaiwan statements for: ${bill.titleHe}`);
    const generated = await generateBillStatements(billId);

    // Save citizen title + metadata to Bill
    await prisma.bill.update({
      where: { id: billId },
      data: {
        citizenTitle: generated.citizenTitle,
        stakeholders: generated.stakeholders,
        controversyPoints: generated.controversyPoints,
      },
    });

    // Delete existing statements and recreate
    await prisma.billStatement.deleteMany({ where: { billId } });
    const statementsData = generated.statements.map((content, i) => ({
      billId,
      content,
      order: i,
    }));
    await prisma.billStatement.createMany({ data: statementsData });

    const statements = await prisma.billStatement.findMany({
      where: { billId },
      orderBy: { order: 'asc' },
    });

    res.json({
      success: true,
      data: {
        citizenTitle: generated.citizenTitle,
        stakeholders: generated.stakeholders,
        controversyPoints: generated.controversyPoints,
        statements,
      },
    });
  } catch (error) {
    console.error('Generate statements error:', error);
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'שגיאה ביצירת שאלות דיון' } });
  }
});

// POST /statements/:statementId/vote - Vote on a statement
router.post('/statements/:statementId/vote', authenticateToken, async (req: Request, res: Response) => {
  try {
    const statementId = req.params.statementId as string;
    const userId = req.user!.id;
    const value = parseInt(req.body.value);

    if (![-1, 0, 1].includes(value)) {
      res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'ערך הצבעה לא חוקי (1, 0, -1)' } });
      return;
    }

    const statement = await prisma.billStatement.findUnique({ where: { id: statementId } });
    if (!statement) {
      res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'שאלת דיון לא נמצאה' } });
      return;
    }

    const existing = await prisma.statementVote.findUnique({
      where: { statementId_userId: { statementId, userId } },
    });

    await prisma.$transaction(async (tx) => {
      if (existing) {
        // Update existing vote — adjust counts
        const oldValue = existing.value;
        await tx.statementVote.update({
          where: { statementId_userId: { statementId, userId } },
          data: { value },
        });
        // Decrement old count, increment new count
        const decrements: any = {};
        const increments: any = {};
        if (oldValue === 1) decrements.agreeCount = { decrement: 1 };
        else if (oldValue === 0) decrements.neutralCount = { decrement: 1 };
        else if (oldValue === -1) decrements.disagreeCount = { decrement: 1 };
        if (value === 1) increments.agreeCount = { increment: 1 };
        else if (value === 0) increments.neutralCount = { increment: 1 };
        else if (value === -1) increments.disagreeCount = { increment: 1 };
        await tx.billStatement.update({
          where: { id: statementId },
          data: { ...decrements, ...increments },
        });
      } else {
        // New vote
        await tx.statementVote.create({ data: { statementId, userId, value } });
        const increment: any = {};
        if (value === 1) increment.agreeCount = { increment: 1 };
        else if (value === 0) increment.neutralCount = { increment: 1 };
        else if (value === -1) increment.disagreeCount = { increment: 1 };
        await tx.billStatement.update({ where: { id: statementId }, data: increment });
        // Award points for participation
        await tx.user.update({ where: { id: userId }, data: { points: { increment: 2 } } });
      }
    });

    const updated = await prisma.billStatement.findUnique({ where: { id: statementId } });
    res.json({ success: true, data: { ...updated, userVote: value } });
  } catch (error) {
    console.error('Statement vote error:', error);
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'שגיאה בהצבעה' } });
  }
});

export default router;
