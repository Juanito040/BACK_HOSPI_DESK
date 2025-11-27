import { Router } from 'express';
import { container } from 'tsyringe';
import { SLAController } from '../controllers/SLAController';
import { authMiddleware } from '../middlewares/AuthMiddleware';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// GET /api/slas - List all SLAs (with optional areaId filter)
router.get('/', (req, res, next) => {
  const controller = container.resolve(SLAController);
  controller.list(req, res, next);
});

// GET /api/slas/:id - Get SLA by ID
router.get('/:id', (req, res, next) => {
  const controller = container.resolve(SLAController);
  controller.getById(req, res, next);
});

// POST /api/slas - Create new SLA
router.post('/', (req, res, next) => {
  const controller = container.resolve(SLAController);
  controller.create(req, res, next);
});

// PUT /api/slas/:id - Update SLA
router.put('/:id', (req, res, next) => {
  const controller = container.resolve(SLAController);
  controller.update(req, res, next);
});

// DELETE /api/slas/:id - Delete SLA
router.delete('/:id', (req, res, next) => {
  const controller = container.resolve(SLAController);
  controller.delete(req, res, next);
});

export default router;
