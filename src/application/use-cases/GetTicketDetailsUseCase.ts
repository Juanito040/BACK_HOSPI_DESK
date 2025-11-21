import { inject, injectable } from 'tsyringe';
import { Ticket } from '../../domain/entities/Ticket';
import { Comment } from '../../domain/entities/Comment';
import { Attachment } from '../../domain/entities/Attachment';
import { ITicketRepository } from '../../domain/repositories/ITicketRepository';
import { ICommentRepository } from '../../domain/repositories/ICommentRepository';
import { IAttachmentRepository } from '../../domain/repositories/IAttachmentRepository';
import { TicketNotFoundException } from '../../domain/exceptions/DomainException';

export interface TicketDetails {
  ticket: Ticket;
  comments: Comment[];
  attachments: Attachment[];
}

@injectable()
export class GetTicketDetailsUseCase {
  constructor(
    @inject('ITicketRepository') private ticketRepository: ITicketRepository,
    @inject('ICommentRepository') private commentRepository: ICommentRepository,
    @inject('IAttachmentRepository') private attachmentRepository: IAttachmentRepository
  ) {}

  async execute(ticketId: string): Promise<TicketDetails> {
    const ticket = await this.ticketRepository.findById(ticketId);
    if (!ticket) {
      throw new TicketNotFoundException(ticketId);
    }

    const comments = await this.commentRepository.findByTicketId(ticketId);
    const attachments = await this.attachmentRepository.findByTicketId(ticketId);

    return {
      ticket,
      comments,
      attachments,
    };
  }
}
