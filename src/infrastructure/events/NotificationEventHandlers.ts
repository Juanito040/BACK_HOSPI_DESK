import { injectable, inject } from 'tsyringe';
import {
  TicketCreatedEvent,
  TicketAssignedEvent,
  TicketStatusChangedEvent,
  SLABreachedEvent,
} from '../../domain/events/TicketEvents';
import { INotificationService } from '../../application/ports/INotificationService';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { ITicketRepository } from '../../domain/repositories/ITicketRepository';
import { logger } from '../../config/logger';

@injectable()
export class NotificationEventHandlers {
  constructor(
    @inject('INotificationService')
    private notificationService: INotificationService,
    @inject('IUserRepository')
    private userRepository: IUserRepository,
    @inject('ITicketRepository')
    private ticketRepository: ITicketRepository
  ) {}

  async handleTicketCreated(event: TicketCreatedEvent): Promise<void> {
    try {
      const data = event.eventData as any;
      const requester = await this.userRepository.findById(data.requesterId);

      if (requester) {
        await this.notificationService.notifyTicketCreated(
          event.aggregateId,
          requester.email.getValue()
        );
      }
    } catch (error) {
      logger.error('Failed to send ticket created notification:', error);
    }
  }

  async handleTicketAssigned(event: TicketAssignedEvent): Promise<void> {
    try {
      const data = event.eventData as any;
      const assignee = await this.userRepository.findById(data.assignedToId);

      if (assignee) {
        await this.notificationService.notifyTicketAssigned(
          event.aggregateId,
          assignee.email.getValue()
        );
      }
    } catch (error) {
      logger.error('Failed to send ticket assigned notification:', error);
    }
  }

  async handleTicketStatusChanged(event: TicketStatusChangedEvent): Promise<void> {
    try {
      const data = event.eventData as any;
      const ticket = await this.ticketRepository.findById(event.aggregateId);

      if (ticket) {
        const requester = await this.userRepository.findById(ticket.requesterId);

        if (requester) {
          await this.notificationService.notifyTicketStatusChanged(
            event.aggregateId,
            requester.email.getValue(),
            data.newStatus
          );
        }
      }
    } catch (error) {
      logger.error('Failed to send status changed notification:', error);
    }
  }

  async handleSLABreached(event: SLABreachedEvent): Promise<void> {
    try {
      const ticket = await this.ticketRepository.findById(event.aggregateId);

      if (ticket && ticket.assignedToId) {
        const assignee = await this.userRepository.findById(ticket.assignedToId);

        if (assignee) {
          await this.notificationService.notifySLABreach(
            event.aggregateId,
            assignee.email.getValue()
          );
        }
      }
    } catch (error) {
      logger.error('Failed to send SLA breach notification:', error);
    }
  }
}
