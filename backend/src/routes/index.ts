import { Router } from 'express';
import authRoutes from './auth.routes';
import billsRoutes from './bills.routes';
import suggestionsRoutes from './suggestions.routes';
import commentsRoutes from './comments.routes';
import usersRoutes from './users.routes';
import notificationsRoutes from './notifications.routes';
import knessetRoutes from './knesset.routes';
import dashboardRoutes from './dashboard.routes';
import polisRoutes from './polis.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/bills', billsRoutes);
router.use('/bills', suggestionsRoutes);     // /bills/:billId/suggestions
router.use('/comments', commentsRoutes);     // /comments/:id/vote
router.use('/bills', commentsRoutes);        // /bills/:billId/comments
router.use('/users', usersRoutes);
router.use('/notifications', notificationsRoutes);
router.use('/knesset', knessetRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/polis', polisRoutes);

export default router;
