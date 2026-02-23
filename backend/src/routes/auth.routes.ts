import { Router, Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { authenticateToken, generateToken } from '../middleware/auth';
import { config } from '../config';
import { z } from 'zod';
import { validate } from '../middleware/validation';

const router = Router();

const googleLoginSchema = z.object({
  credential: z.string(),
});

// POST /auth/google - Login with Google ID token
router.post('/google', validate(googleLoginSchema), async (req: Request, res: Response) => {
  try {
    const { credential } = req.body;

    // Verify Google token
    const { OAuth2Client } = await import('google-auth-library');
    const client = new OAuth2Client(config.google.clientId);
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: config.google.clientId,
    });
    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      res.status(400).json({ success: false, error: { code: 'INVALID_TOKEN', message: 'טוקן גוגל לא תקין' } });
      return;
    }

    // Find or create user
    let user = await prisma.user.findUnique({ where: { googleId: payload.sub } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: payload.email,
          googleId: payload.sub,
          name: payload.name || payload.email,
          avatarUrl: payload.picture,
        },
      });
    }

    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatarUrl: user.avatarUrl,
          role: user.role,
          isVerified: user.isVerified,
        },
      },
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ success: false, error: { code: 'AUTH_ERROR', message: 'שגיאה באימות' } });
  }
});

// GET /auth/me - Get current user
router.get('/me', authenticateToken, async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: {
        userBadges: { include: { badge: true } },
        _count: { select: { stars: true, suggestions: true, comments: true } },
      },
    });

    if (!user) {
      res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'משתמש לא נמצא' } });
      return;
    }

    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'שגיאה פנימית' } });
  }
});

// POST /auth/setup-admin - Create initial admin user (protected by SETUP_SECRET env var)
router.post('/setup-admin', async (req: Request, res: Response) => {
  try {
    const { secret, email, name } = req.body;
    const setupSecret = process.env.SETUP_SECRET;

    if (!setupSecret || secret !== setupSecret) {
      res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'סוד לא תקין' } });
      return;
    }

    if (!email || !name) {
      res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'נדרש email ו-name' } });
      return;
    }

    // Upsert: create or update to ADMIN
    const user = await prisma.user.upsert({
      where: { email },
      update: { role: 'ADMIN', isVerified: true },
      create: {
        email,
        name,
        googleId: `setup-${Date.now()}`,
        role: 'ADMIN',
        isVerified: true,
      },
    });

    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    res.json({
      success: true,
      data: {
        token,
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
      },
    });
  } catch (error) {
    console.error('Setup admin error:', error);
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'שגיאה' } });
  }
});

// POST /auth/verify-email - Send verification email
router.post('/verify-email', authenticateToken, async (req: Request, res: Response) => {
  try {
    // In production, send actual email with verification code
    await prisma.user.update({
      where: { id: req.user!.id },
      data: { isVerified: true },
    });

    res.json({ success: true, data: { message: 'המייל אומת בהצלחה' } });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'שגיאה באימות' } });
  }
});

export default router;
