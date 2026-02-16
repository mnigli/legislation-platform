import { Router, Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { authenticateToken, optionalAuth } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { z } from 'zod';

const router = Router();

const createSuggestionSchema = z.object({
  content: z.string().min(10, 'ההצעה חייבת להכיל לפחות 10 תווים'),
});

// GET /bills/:billId/suggestions
router.get('/:billId/suggestions', optionalAuth, async (req: Request, res: Response) => {
  try {
    const billId = req.params.billId as string;
    const sort = (req.query.sort as string) || 'newest';

    const orderBy = sort === 'top' ? { upvotes: 'desc' as const } : { createdAt: 'desc' as const };

    const suggestions = await prisma.suggestion.findMany({
      where: { billId },
      orderBy,
      include: {
        user: { select: { id: true, name: true, avatarUrl: true, role: true } },
        votes: req.user ? { where: { userId: req.user.id }, select: { voteType: true } } : false,
      },
    });

    const data = suggestions.map((s) => {
      const { votes, ...rest } = s as any;
      return {
        ...rest,
        userVote: votes?.[0]?.voteType || null,
      };
    });

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'שגיאה' } });
  }
});

// POST /bills/:billId/suggestions
router.post('/:billId/suggestions', authenticateToken, validate(createSuggestionSchema), async (req: Request, res: Response) => {
  try {
    const billId = req.params.billId as string;
    const userId = req.user!.id;

    const bill = await prisma.bill.findUnique({ where: { id: billId } });
    if (!bill) {
      res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'הצעת חוק לא נמצאה' } });
      return;
    }

    const suggestion = await prisma.suggestion.create({
      data: {
        billId,
        userId,
        content: req.body.content,
        stageWhenSubmitted: bill.currentStage,
      },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true, role: true } },
      },
    });

    // Award points
    await prisma.user.update({
      where: { id: userId },
      data: { points: { increment: 5 } },
    });

    res.status(201).json({ success: true, data: suggestion });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'שגיאה' } });
  }
});

// POST /suggestions/:id/vote
router.post('/:id/vote', authenticateToken, async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const userId = req.user!.id;
    const voteType = req.body.voteType;

    if (!['UPVOTE', 'DOWNVOTE'].includes(voteType)) {
      res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'סוג הצבעה לא תקין' } });
      return;
    }

    const existing = await prisma.suggestionVote.findUnique({
      where: { suggestionId_userId: { suggestionId: id, userId } },
    });

    if (existing) {
      if (existing.voteType === voteType) {
        // Remove vote
        await prisma.$transaction([
          prisma.suggestionVote.delete({ where: { id: existing.id } }),
          prisma.suggestion.update({
            where: { id },
            data: voteType === 'UPVOTE' ? { upvotes: { decrement: 1 } } : { downvotes: { decrement: 1 } },
          }),
        ]);
        res.json({ success: true, data: { vote: null } });
        return;
      }
      // Change vote
      await prisma.$transaction([
        prisma.suggestionVote.update({ where: { id: existing.id }, data: { voteType } }),
        prisma.suggestion.update({
          where: { id },
          data: voteType === 'UPVOTE'
            ? { upvotes: { increment: 1 }, downvotes: { decrement: 1 } }
            : { upvotes: { decrement: 1 }, downvotes: { increment: 1 } },
        }),
      ]);
    } else {
      await prisma.$transaction([
        prisma.suggestionVote.create({ data: { suggestionId: id, userId, voteType } }),
        prisma.suggestion.update({
          where: { id },
          data: voteType === 'UPVOTE' ? { upvotes: { increment: 1 } } : { downvotes: { increment: 1 } },
        }),
      ]);
    }

    res.json({ success: true, data: { vote: voteType } });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'שגיאה' } });
  }
});

export default router;
