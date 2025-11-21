import { injectable } from 'tsyringe';
import { PrismaClient as PClient } from '@prisma/client';
import { Comment } from '../../domain/entities/Comment';
import { ICommentRepository } from '../../domain/repositories/ICommentRepository';
import { PrismaClient } from '../db/PrismaClient';

@injectable()
export class PrismaCommentRepository implements ICommentRepository {
  private prisma: PClient;

  constructor() {
    this.prisma = PrismaClient.getInstance();
  }

  async save(comment: Comment): Promise<Comment> {
    const data = await this.prisma.comment.create({
      data: {
        id: comment.id,
        ticketId: comment.ticketId,
        userId: comment.userId,
        content: comment.content,
        isInternal: comment.isInternal,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
      },
    });

    return this.toDomain(data);
  }

  async findById(id: string): Promise<Comment | null> {
    const data = await this.prisma.comment.findUnique({ where: { id } });
    return data ? this.toDomain(data) : null;
  }

  async findByTicketId(ticketId: string): Promise<Comment[]> {
    const data = await this.prisma.comment.findMany({
      where: { ticketId },
      orderBy: { createdAt: 'asc' },
    });
    return data.map((d) => this.toDomain(d));
  }

  async findPublicByTicketId(ticketId: string): Promise<Comment[]> {
    const data = await this.prisma.comment.findMany({
      where: { ticketId, isInternal: false },
      orderBy: { createdAt: 'asc' },
    });
    return data.map((d) => this.toDomain(d));
  }

  async update(comment: Comment): Promise<Comment> {
    const data = await this.prisma.comment.update({
      where: { id: comment.id },
      data: {
        content: comment.content,
        isInternal: comment.isInternal,
        updatedAt: comment.updatedAt,
      },
    });

    return this.toDomain(data);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.comment.delete({ where: { id } });
  }

  private toDomain(data: {
    id: string;
    ticketId: string;
    userId: string;
    content: string;
    isInternal: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): Comment {
    return Comment.reconstitute(data);
  }
}
