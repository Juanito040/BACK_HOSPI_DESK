import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import { UploadAttachmentUseCase } from '../../../application/use-cases/UploadAttachmentUseCase';
import { DeleteAttachmentUseCase } from '../../../application/use-cases/DeleteAttachmentUseCase';
import { IFileStorage } from '../../../application/ports/IFileStorage';
import { AuthRequest } from '../middlewares/AuthMiddleware';

@injectable()
export class AttachmentController {
  constructor(
    @inject(UploadAttachmentUseCase)
    private uploadAttachmentUseCase: UploadAttachmentUseCase,
    @inject(DeleteAttachmentUseCase)
    private deleteAttachmentUseCase: DeleteAttachmentUseCase,
    @inject('IFileStorage')
    private fileStorage: IFileStorage
  ) {}

  async upload(req: Request, res: Response): Promise<void> {
    try {
      const authReq = req as AuthRequest;
      const userId = authReq.user?.userId || '';
      const { ticketId } = req.params;

      if (!req.file) {
        res.status(400).json({
          success: false,
          message: 'No file uploaded',
        });
        return;
      }

      const attachment = await this.uploadAttachmentUseCase.execute({
        ticketId,
        userId,
        file: req.file,
      });

      res.status(201).json({
        success: true,
        data: attachment.toJSON(),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to upload attachment',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const authReq = req as AuthRequest;
      const userId = authReq.user?.userId || '';
      const { attachmentId } = req.params;

      await this.deleteAttachmentUseCase.execute(attachmentId, userId);

      res.status(200).json({
        success: true,
        message: 'Attachment deleted successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete attachment',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async download(req: Request, res: Response): Promise<void> {
    try {
      const { filePath } = req.query;

      if (!filePath || typeof filePath !== 'string') {
        res.status(400).json({
          success: false,
          message: 'File path is required',
        });
        return;
      }

      const fullPath = this.fileStorage.getPath(filePath);
      res.download(fullPath);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to download attachment',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
