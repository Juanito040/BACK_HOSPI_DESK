import { injectable } from 'tsyringe';
import { PrismaClient as PClient } from '@prisma/client';
import { Attachment } from '../../domain/entities/Attachment';
import { IAttachmentRepository } from '../../domain/repositories/IAttachmentRepository';
import { PrismaClient } from '../db/PrismaClient';

@injectable()
export class PrismaAttachmentRepository implements IAttachmentRepository {
  private prisma: PClient;

  constructor() {
    this.prisma = PrismaClient.getInstance();
  }

  async save(attachment: Attachment): Promise<Attachment> {
    const data = await this.prisma.attachment.create({
      data: {
        ticketId: attachment.ticketId,
        userId: attachment.userId,
        fileName: attachment.fileName,
        filePath: attachment.filePath,
        mimeType: attachment.mimeType,
        fileSize: attachment.fileSize,
        createdAt: attachment.createdAt,
      },
    });

    return this.toDomain(data);
  }

  async findById(id: string): Promise<Attachment | null> {
    const data = await this.prisma.attachment.findUnique({
      where: { id },
    });

    return data ? this.toDomain(data) : null;
  }

  async findByTicketId(ticketId: string): Promise<Attachment[]> {
    const data = await this.prisma.attachment.findMany({
      where: { ticketId },
      orderBy: { createdAt: 'desc' },
    });

    return data.map((d) => this.toDomain(d));
  }

  async delete(id: string): Promise<void> {
    await this.prisma.attachment.delete({
      where: { id },
    });
  }

  private toDomain(data: {
    id: string;
    ticketId: string;
    userId: string;
    fileName: string;
    filePath: string;
    mimeType: string;
    fileSize: number;
    createdAt: Date;
  }): Attachment {
    return Attachment.reconstitute({
      id: data.id,
      ticketId: data.ticketId,
      userId: data.userId,
      fileName: data.fileName,
      filePath: data.filePath,
      mimeType: data.mimeType,
      fileSize: data.fileSize,
      createdAt: data.createdAt,
    });
  }
}
