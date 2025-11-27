import { injectable, inject } from 'tsyringe';
import { Attachment } from '../../domain/entities/Attachment';
import { IAttachmentRepository } from '../../domain/repositories/IAttachmentRepository';
import { ITicketRepository } from '../../domain/repositories/ITicketRepository';
import { IFileStorage } from '../ports/IFileStorage';
import { TicketNotFoundException } from '../../domain/exceptions/DomainException';

export interface UploadAttachmentInput {
  ticketId: string;
  userId: string;
  file: Express.Multer.File;
}

@injectable()
export class UploadAttachmentUseCase {
  constructor(
    @inject('IAttachmentRepository')
    private attachmentRepository: IAttachmentRepository,
    @inject('ITicketRepository')
    private ticketRepository: ITicketRepository,
    @inject('IFileStorage')
    private fileStorage: IFileStorage
  ) {}

  async execute(input: UploadAttachmentInput): Promise<Attachment> {
    // Verify ticket exists
    const ticket = await this.ticketRepository.findById(input.ticketId);
    if (!ticket) {
      throw new TicketNotFoundException(input.ticketId);
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (input.file.size > maxSize) {
      throw new Error('File size exceeds 10MB limit');
    }

    // Validate file type
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
      'text/csv',
    ];

    if (!allowedMimeTypes.includes(input.file.mimetype)) {
      throw new Error('File type not allowed');
    }

    // Save file
    const uploadedFile = await this.fileStorage.save(input.file, input.ticketId);

    // Create attachment entity
    const attachment = Attachment.create({
      id: '', // Will be set by repository
      ticketId: input.ticketId,
      userId: input.userId,
      fileName: uploadedFile.fileName,
      filePath: uploadedFile.filePath,
      mimeType: uploadedFile.mimeType,
      fileSize: uploadedFile.fileSize,
      createdAt: new Date(),
    });

    // Save to database
    return await this.attachmentRepository.save(attachment);
  }
}
