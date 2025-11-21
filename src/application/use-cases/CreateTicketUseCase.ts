import { inject, injectable } from 'tsyringe';
import { Ticket } from '../../domain/entities/Ticket';
import { Priority } from '../../domain/value-objects/Priority';
import { ITicketRepository } from '../../domain/repositories/ITicketRepository';
import { IEventBus } from '../../domain/services/IEventBus';
import { CreateTicketDTO } from '../dtos/CreateTicketDTO';
import { v4 as uuidv4 } from 'uuid';

@injectable()
export class CreateTicketUseCase {
  constructor(
    @inject('ITicketRepository') private ticketRepository: ITicketRepository,
    @inject('IEventBus') private eventBus: IEventBus
  ) {}

  async execute(dto: CreateTicketDTO): Promise<Ticket> {
    const ticket = Ticket.create({
      title: dto.title,
      description: dto.description,
      priority: Priority.fromString(dto.priority),
      areaId: dto.areaId,
      requesterId: dto.requesterId,
      assignedToId: dto.assignedToId,
    });

    ticket.id = uuidv4();

    const savedTicket = await this.ticketRepository.save(ticket);

    // Publish domain events
    const events = savedTicket.getDomainEvents();
    await this.eventBus.publishAll(events);
    savedTicket.clearDomainEvents();

    return savedTicket;
  }
}
