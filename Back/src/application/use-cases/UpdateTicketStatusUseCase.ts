import { inject, injectable } from 'tsyringe';
import { Ticket } from '../../domain/entities/Ticket';
import { Status } from '../../domain/value-objects/Status';
import { ITicketRepository } from '../../domain/repositories/ITicketRepository';
import { IEventBus } from '../../domain/services/IEventBus';
import { TicketNotFoundException } from '../../domain/exceptions/DomainException';

@injectable()
export class UpdateTicketStatusUseCase {
  constructor(
    @inject('ITicketRepository') private ticketRepository: ITicketRepository,
    @inject('IEventBus') private eventBus: IEventBus
  ) {}

  async execute(ticketId: string, newStatus: string, changedById: string): Promise<Ticket> {
    const ticket = await this.ticketRepository.findById(ticketId);
    if (!ticket) {
      throw new TicketNotFoundException(ticketId);
    }

    const status = Status.fromString(newStatus);
    ticket.changeStatus(status, changedById);

    const updatedTicket = await this.ticketRepository.update(ticket);

    // Publish domain events
    const events = updatedTicket.getDomainEvents();
    await this.eventBus.publishAll(events);
    updatedTicket.clearDomainEvents();

    return updatedTicket;
  }
}
