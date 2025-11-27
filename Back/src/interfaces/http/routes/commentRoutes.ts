import { Router } from 'express';
import { CommentController } from '../controllers/CommentController';
import { authMiddleware } from '../middlewares/AuthMiddleware';
import { validationMiddleware } from '../middlewares/ValidationMiddleware';
import { CreateCommentDTO } from '../../../application/dtos';

const router = Router();

router.post(
  '/',
  authMiddleware,
  validationMiddleware(CreateCommentDTO),
  CommentController.create
);

export default router;
