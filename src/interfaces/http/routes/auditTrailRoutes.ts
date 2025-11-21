import { Router } from 'express';
import { container } from 'tsyringe';
import { AuditTrailController } from '../controllers/AuditTrailController';
import { authMiddleware } from '../middlewares/AuthMiddleware';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// GET /api/audit/ticket/:ticketId - Get audit trail for a ticket
router.get('/ticket/:ticketId', (req, res) => {
  const controller = container.resolve(AuditTrailController);
  controller.getByTicketId(req, res);
});

// GET /api/audit/actor/:actorId - Get audit trail for an actor
router.get('/actor/:actorId', (req, res) => {
  const controller = container.resolve(AuditTrailController);
  controller.getByActorId(req, res);
});

export default router;
