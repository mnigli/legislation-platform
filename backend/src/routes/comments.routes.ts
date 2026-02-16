import { Router, Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { authenticateToken, optionalAuth } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { z } from 'zod';

const router = Router();

const createCommentSchema = z.object({
  content: z.string().min(2, 'תגובה חייבת להכיל לפחות 2 תווים'),
  parentId: z.string().uuid().optional(),
});

// GET /bills/:billId/comments
router.get('/:billId/comments', optionalAuth, async (req: Request, res: Response) => {
  try {
    const billId = req.params.billId as string;

    const comments = await prisma.comment.findMany({
      where: { billId, parentId: null, isDeleted: false },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true, role: true } },
        replies: {
          where: { isDeleted: false },
          orderBy: { createdAt: 'asc' },
          include: {
            user: { select: { id: true, name: true, avatarUrl: true, role: true } },
            votes: req.user ? { where: { userId: req.user.id }, select: { voteType: true } } : false,
          },
        },
        votes: req.user ? { where: { userId: req.user.id }, select: { voteType: true } } : false,
      },
    });

    const data = comments.map((c) => {
      const { votes, replies, ...rest } = c as any;
      return {
        ...rest,
        userVote: votes?.[0]?.voteType || null,
        replies: replies.map((r: any) => {
          const { votes: rv, ...rRest } = r;
          return { ...rRest, userVote: rv?.[0]?.voteType || null };
        }),
      };
    });

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'שגיאה' } });
  }
});

// POST /bills/:billId/comments
router.post('/:billId/comments', authenticateToken, validate(createCommentSchema), async (req: Request, res: Response) => {
  try {
    const billId = req.params.billId as string;
    const userId = req.user!.id;

    const comment = await prisma.comment.create({
      data: {
        billId,
        userId,
        content: req.body.content,
        parentId: req.body.parentId || null,
      },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true, role: true } },
      },
    });

    await prisma.$transaction([
      prisma.bill.update({ where: { id: billId }, data: { commentCount: { increment: 1 } } }),
      prisma.user.update({ where: { id: userId }, data: { points: { increment: 2 } } }),
    ]);

    res.status(201).json({ success: true, data: comment });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'שגיאה' } });
  }
});

// POST /comments/:id/vote
router.post('/:id/vote', authenticateToken, async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const userId = req.user!.id;
    const voteType = req.body.voteType;

    if (!['UPVOTE', 'DOWNVOTE'].includes(voteType)) {
      res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'סוג הצבעה לא תקין' } });
      return;
    }

    const existing = await prisma.commentVote.findUnique({
      where: { commentId_userId: { commentId: id, userId } },
    });

    if (existing) {
      if (existing.voteType === voteType) {
        await prisma.$transaction([
          prisma.commentVote.delete({ where: { id: existing.id } }),
          prisma.comment.update({
            where: { id },
            data: { upvotes: { decrement: voteType === 'UPVOTE' ? 1 : 0 } },
          }),
        ]);
        res.json({ success: true, data: { vote: null } });
        return;
      }
      await prisma.$transaction([
        prisma.commentVote.update({ where: { id: existing.id }, data: { voteType } }),
        prisma.comment.update({
          where: { id },
          data: { upvotes: voteType === 'UPVOTE' ? { increment: 2 } : { decrement: 2 } },
        }),
      ]);
    } else {
      await prisma.$transaction([
        prisma.commentVote.create({ data: { commentId: id, userId, voteType } }),
        prisma.comment.update({
          where: { id },
          data: { upvotes: voteType === 'UPVOTE' ? { increment: 1 } : { decrement: 1 } },
        }),
      ]);
    }

    res.json({ success: true, data: { vote: voteType } });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'שגיאה' } });
  }
});

// DELETE /comments/:id
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const comment = await prisma.comment.findUnique({ where: { id } });

    if (!comment) {
      res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'תגובה לא נמצאה' } });
      return;
    }

    if (comment.userId !== req.user!.id && req.user!.role !== 'ADMIN') {
      res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'אין הרשאה' } });
      return;
    }

    await prisma.comment.update({
      where: { id },
      data: { isDeleted: true, content: '[תגובה נמחקה]' },
    });

    res.json({ success: true, data: { deleted: true } });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'שגיאה' } });
  }
});

export default router;
