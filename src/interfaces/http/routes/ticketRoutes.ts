import { Router } from 'express';
import { TicketController } from '../controllers/TicketController';
import { authMiddleware } from '../middlewares/AuthMiddleware';
import { validationMiddleware } from '../middlewares/ValidationMiddleware';
import { CreateTicketDTO, UpdateTicketDTO } from '../../../application/dtos';

const router = Router();

router.post(
  '/',
  authMiddleware,
  validationMiddleware(CreateTicketDTO),
  TicketController.create
);

router.get('/', authMiddleware, TicketController.list);

router.get('/:id', authMiddleware, TicketController.getById);

router.patch('/:id/assign', authMiddleware, TicketController.assign);

router.patch(
  '/:id/status',
  authMiddleware,
  validationMiddleware(UpdateTicketDTO),
  TicketController.updateStatus
);

export default router;
