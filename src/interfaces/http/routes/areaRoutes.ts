import { Router } from 'express';
import { container } from 'tsyringe';
import { AreaController } from '../controllers/AreaController';
import { authMiddleware } from '../middlewares/AuthMiddleware';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// GET /api/areas - List all areas (with optional activeOnly filter)
router.get('/', (req, res, next) => {
  const controller = container.resolve(AreaController);
  controller.list(req, res, next);
});

// GET /api/areas/:id - Get area by ID
router.get('/:id', (req, res, next) => {
  const controller = container.resolve(AreaController);
  controller.getById(req, res, next);
});

// POST /api/areas - Create new area
router.post('/', (req, res, next) => {
  const controller = container.resolve(AreaController);
  controller.create(req, res, next);
});

// PUT /api/areas/:id - Update area
router.put('/:id', (req, res, next) => {
  const controller = container.resolve(AreaController);
  controller.update(req, res, next);
});

// DELETE /api/areas/:id - Delete area
router.delete('/:id', (req, res, next) => {
  const controller = container.resolve(AreaController);
  controller.delete(req, res, next);
});

export default router;
