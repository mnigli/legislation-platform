import { Router, Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { authenticateToken, optionalAuth } from '../middleware/auth';

const router = Router();

// GET /users/leaderboard
router.get('/leaderboard', async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { points: 'desc' },
      take: 20,
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        role: true,
        points: true,
        _count: { select: { suggestions: true, comments: true, stars: true } },
        userBadges: { include: { badge: true } },
      },
    });

    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'שגיאה' } });
  }
});

// GET /users/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id as string },
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        role: true,
        points: true,
        isCurrentMk: true,
        partyName: true,
        createdAt: true,
        _count: { select: { suggestions: true, comments: true, stars: true } },
        userBadges: { include: { badge: true } },
      },
    });

    if (!user) {
      res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'משתמש לא נמצא' } });
      return;
    }

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'שגיאה' } });
  }
});

// GET /users/:id/stars - User's starred bills
router.get('/:id/stars', async (req: Request, res: Response) => {
  try {
    const stars = await prisma.billStar.findMany({
      where: { userId: req.params.id as string },
      include: { bill: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: stars.map((s) => s.bill) });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'שגיאה' } });
  }
});

export default router;
