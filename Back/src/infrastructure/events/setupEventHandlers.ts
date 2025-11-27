import { container } from 'tsyringe';
import { IEventBus } from '../../domain/services/IEventBus';
import { AuditEventHandlers } from './AuditEventHandlers';
import { NotificationEventHandlers } from './NotificationEventHandlers';

export function setupEventHandlers(): void {
  const eventBus = container.resolve<IEventBus>('IEventBus');
  const auditHandlers = container.resolve(AuditEventHandlers);
  const notificationHandlers = container.resolve(NotificationEventHandlers);

  // Register audit event handlers
  eventBus.subscribe('TicketCreated', (event) =>
    auditHandlers.handleTicketCreated(event as any)
  );

  eventBus.subscribe('TicketAssigned', (event) =>
    auditHandlers.handleTicketAssigned(event as any)
  );

  eventBus.subscribe('TicketStatusChanged', (event) =>
    auditHandlers.handleTicketStatusChanged(event as any)
  );

  eventBus.subscribe('TicketResolved', (event) =>
    auditHandlers.handleTicketResolved(event as any)
  );

  eventBus.subscribe('TicketClosed', (event) =>
    auditHandlers.handleTicketClosed(event as any)
  );

  eventBus.subscribe('TicketPriorityChanged', (event) =>
    auditHandlers.handleTicketPriorityChanged(event as any)
  );

  // Register notification event handlers
  eventBus.subscribe('TicketCreated', (event) =>
    notificationHandlers.handleTicketCreated(event as any)
  );

  eventBus.subscribe('TicketAssigned', (event) =>
    notificationHandlers.handleTicketAssigned(event as any)
  );

  eventBus.subscribe('TicketStatusChanged', (event) =>
    notificationHandlers.handleTicketStatusChanged(event as any)
  );

  eventBus.subscribe('SLABreached', (event) =>
    notificationHandlers.handleSLABreached(event as any)
  );
}
