import { injectable, inject } from 'tsyringe';
import {
  TicketCreatedEvent,
  TicketAssignedEvent,
  TicketStatusChangedEvent,
  TicketResolvedEvent,
  TicketClosedEvent,
  TicketPriorityChangedEvent,
} from '../../domain/events/TicketEvents';
import { CreateAuditTrailUseCase } from '../../application/use-cases/CreateAuditTrailUseCase';

@injectable()
export class AuditEventHandlers {
  constructor(
    @inject(CreateAuditTrailUseCase)
    private createAuditTrailUseCase: CreateAuditTrailUseCase
  ) {}

  async handleTicketCreated(event: TicketCreatedEvent): Promise<void> {
    const data = event.eventData as any;
    await this.createAuditTrailUseCase.execute({
      ticketId: event.aggregateId,
      actorId: data.requesterId,
      action: 'TICKET_CREATED',
      details: {
        title: data.title,
        priority: data.priority,
        areaId: data.areaId,
      },
    });
  }

  async handleTicketAssigned(event: TicketAssignedEvent): Promise<void> {
    const data = event.eventData as any;
    await this.createAuditTrailUseCase.execute({
      ticketId: event.aggregateId,
      actorId: data.assignedById,
      action: 'TICKET_ASSIGNED',
      details: {
        assignedToId: data.assignedToId,
      },
    });
  }

  async handleTicketStatusChanged(event: TicketStatusChangedEvent): Promise<void> {
    const data = event.eventData as any;
    await this.createAuditTrailUseCase.execute({
      ticketId: event.aggregateId,
      actorId: data.changedById,
      action: 'STATUS_CHANGED',
      details: {
        oldStatus: data.oldStatus,
        newStatus: data.newStatus,
      },
    });
  }

  async handleTicketResolved(event: TicketResolvedEvent): Promise<void> {
    const data = event.eventData as any;
    await this.createAuditTrailUseCase.execute({
      ticketId: event.aggregateId,
      actorId: data.resolvedById,
      action: 'TICKET_RESOLVED',
      details: {
        resolution: data.resolution,
        resolutionTime: data.resolutionTime,
      },
    });
  }

  async handleTicketClosed(event: TicketClosedEvent): Promise<void> {
    const data = event.eventData as any;
    await this.createAuditTrailUseCase.execute({
      ticketId: event.aggregateId,
      actorId: data.closedById,
      action: 'TICKET_CLOSED',
      details: {
        closeReason: data.closeReason,
      },
    });
  }

  async handleTicketPriorityChanged(event: TicketPriorityChangedEvent): Promise<void> {
    const data = event.eventData as any;
    await this.createAuditTrailUseCase.execute({
      ticketId: event.aggregateId,
      actorId: data.changedById,
      action: 'PRIORITY_CHANGED',
      details: {
        oldPriority: data.oldPriority,
        newPriority: data.newPriority,
      },
    });
  }
}
