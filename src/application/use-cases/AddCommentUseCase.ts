import { inject, injectable } from 'tsyringe';
import { Comment } from '../../domain/entities/Comment';
import { ICommentRepository } from '../../domain/repositories/ICommentRepository';
import { ITicketRepository } from '../../domain/repositories/ITicketRepository';
import { IEventBus } from '../../domain/services/IEventBus';
import { TicketCommentAddedEvent } from '../../domain/events/TicketEvents';
import { CreateCommentDTO } from '../dtos/CreateCommentDTO';
import { TicketNotFoundException } from '../../domain/exceptions/DomainException';
import { v4 as uuidv4 } from 'uuid';

@injectable()
export class AddCommentUseCase {
  constructor(
    @inject('ICommentRepository') private commentRepository: ICommentRepository,
    @inject('ITicketRepository') private ticketRepository: ITicketRepository,
    @inject('IEventBus') private eventBus: IEventBus
  ) {}

  async execute(dto: CreateCommentDTO): Promise<Comment> {
    const ticket = await this.ticketRepository.findById(dto.ticketId);
    if (!ticket) {
      throw new TicketNotFoundException(dto.ticketId);
    }

    const now = new Date();
    const comment = Comment.create({
      id: uuidv4(),
      ticketId: dto.ticketId,
      userId: dto.userId,
      content: dto.content,
      isInternal: dto.isInternal,
      createdAt: now,
      updatedAt: now,
    });

    const savedComment = await this.commentRepository.save(comment);

    // Publish event
    const event = new TicketCommentAddedEvent(dto.ticketId, {
      commentId: savedComment.id,
      userId: dto.userId,
      content: dto.content,
      isInternal: dto.isInternal,
    });
    await this.eventBus.publish(event);

    return savedComment;
  }
}
