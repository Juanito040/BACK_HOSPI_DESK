import { Router } from 'express';
import ticketRoutes from './ticketRoutes';
import authRoutes from './authRoutes';
import commentRoutes from './commentRoutes';
import auditTrailRoutes from './auditTrailRoutes';
import attachmentRoutes from './attachmentRoutes';
import areaRoutes from './areaRoutes';
import slaRoutes from './slaRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/tickets', ticketRoutes);
router.use('/comments', commentRoutes);
router.use('/audit', auditTrailRoutes);
router.use('/attachments', attachmentRoutes);
router.use('/areas', areaRoutes);
router.use('/slas', slaRoutes);

router.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
