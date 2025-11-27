import { injectable, inject } from 'tsyringe';
import { IAttachmentRepository } from '../../domain/repositories/IAttachmentRepository';
import { IFileStorage } from '../ports/IFileStorage';

@injectable()
export class DeleteAttachmentUseCase {
  constructor(
    @inject('IAttachmentRepository')
    private attachmentRepository: IAttachmentRepository,
    @inject('IFileStorage')
    private fileStorage: IFileStorage
  ) {}

  async execute(attachmentId: string, userId: string): Promise<void> {
    const attachment = await this.attachmentRepository.findById(attachmentId);

    if (!attachment) {
      throw new Error('Attachment not found');
    }

    // Verify user owns the attachment or has appropriate permissions
    if (attachment.userId !== userId) {
      // In production, check if user is ADMIN or owns the ticket
      throw new Error('Not authorized to delete this attachment');
    }

    // Delete from storage
    await this.fileStorage.delete(attachment.filePath);

    // Delete from database
    await this.attachmentRepository.delete(attachmentId);
  }
}
