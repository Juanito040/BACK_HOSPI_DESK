import { Router } from 'express';
import { container } from 'tsyringe';
import { UserController } from '../controllers/UserController';
import { authMiddleware } from '../middlewares/AuthMiddleware';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// GET /api/users - List all users (with optional filters: role, areaId, activeOnly)
router.get('/', (req, res, next) => {
  const controller = container.resolve(UserController);
  controller.list(req, res, next);
});

// GET /api/users/:id - Get user by ID
router.get('/:id', (req, res, next) => {
  const controller = container.resolve(UserController);
  controller.getById(req, res, next);
});

// POST /api/users - Create new user
router.post('/', (req, res, next) => {
  const controller = container.resolve(UserController);
  controller.create(req, res, next);
});

// PUT /api/users/:id - Update user
router.put('/:id', (req, res, next) => {
  const controller = container.resolve(UserController);
  controller.update(req, res, next);
});

// DELETE /api/users/:id - Delete user
router.delete('/:id', (req, res, next) => {
  const controller = container.resolve(UserController);
  controller.delete(req, res, next);
});

export default router;
