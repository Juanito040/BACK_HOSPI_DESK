import { Router } from 'express';
import { container } from 'tsyringe';
import { AttachmentController } from '../controllers/AttachmentController';
import { authMiddleware } from '../middlewares/AuthMiddleware';
import { uploadSingle } from '../middlewares/UploadMiddleware';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// POST /api/attachments/upload/:ticketId - Upload attachment to ticket
router.post('/upload/:ticketId', uploadSingle, (req, res) => {
  const controller = container.resolve(AttachmentController);
  controller.upload(req, res);
});

// DELETE /api/attachments/:attachmentId - Delete attachment
router.delete('/:attachmentId', (req, res) => {
  const controller = container.resolve(AttachmentController);
  controller.delete(req, res);
});

// GET /api/attachments/download - Download attachment
router.get('/download', (req, res) => {
  const controller = container.resolve(AttachmentController);
  controller.download(req, res);
});

export default router;
