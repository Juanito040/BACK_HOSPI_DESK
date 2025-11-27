import { inject, injectable } from 'tsyringe';
import { Ticket } from '../../domain/entities/Ticket';
import { Comment } from '../../domain/entities/Comment';
import { ITicketRepository } from '../../domain/repositories/ITicketRepository';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { ICommentRepository } from '../../domain/repositories/ICommentRepository';
import { IEventBus } from '../../domain/services/IEventBus';
import { TicketNotFoundException, UserNotFoundException } from '../../domain/exceptions/DomainException';

@injectable()
export class AssignTicketUseCase {
  constructor(
    @inject('ITicketRepository') private ticketRepository: ITicketRepository,
    @inject('IUserRepository') private userRepository: IUserRepository,
    @inject('ICommentRepository') private commentRepository: ICommentRepository,
    @inject('IEventBus') private eventBus: IEventBus
  ) {}

  async execute(
    ticketId: string,
    assignToUserId: string,
    assignedById: string,
    comment?: string
  ): Promise<Ticket> {
    const ticket = await this.ticketRepository.findById(ticketId);
    if (!ticket) {
      throw new TicketNotFoundException(ticketId);
    }

    const assignee = await this.userRepository.findById(assignToUserId);
    if (!assignee) {
      throw new UserNotFoundException(assignToUserId);
    }

    if (!assignee.canResolveTickets()) {
      throw new Error('User cannot be assigned tickets');
    }

    const previousAssigneeId = ticket.assignedToId;

    ticket.assignTo(assignToUserId, assignedById);

    const updatedTicket = await this.ticketRepository.update(ticket);

    // Create automatic comment about the reassignment
    const assignedByUser = await this.userRepository.findById(assignedById);
    const isReassignment = previousAssigneeId !== undefined && previousAssigneeId !== assignToUserId;

    let commentContent: string;
    if (isReassignment) {
      commentContent = `Ticket reassigned from ${previousAssigneeId} to ${assignee.name} by ${assignedByUser?.name || 'System'}`;
    } else {
      commentContent = `Ticket assigned to ${assignee.name} by ${assignedByUser?.name || 'System'}`;
    }

    // Add user's custom comment if provided
    if (comment) {
      commentContent += `\n\nComment: ${comment}`;
    }

    const now = new Date();
    const autoComment = Comment.create({
      id: '', // Will be set by repository
      ticketId: ticket.id,
      userId: assignedById,
      content: commentContent,
      isInternal: true,
      createdAt: now,
      updatedAt: now,
    });

    await this.commentRepository.save(autoComment);

    // Publish domain events
    const events = updatedTicket.getDomainEvents();
    await this.eventBus.publishAll(events);
    updatedTicket.clearDomainEvents();

    return updatedTicket;
  }
}
