import { BaseDomainEvent } from './DomainEvent';

export class TicketCreatedEvent extends BaseDomainEvent {
  constructor(
    ticketId: string,
    data: {
      title: string;
      description: string;
      priority: string;
      areaId: string;
      requesterId: string;
    }
  ) {
    super(ticketId, data);
  }
}

export class TicketAssignedEvent extends BaseDomainEvent {
  constructor(
    ticketId: string,
    data: {
      assignedToId: string;
      assignedById: string;
    }
  ) {
    super(ticketId, data);
  }
}

export class TicketStatusChangedEvent extends BaseDomainEvent {
  constructor(
    ticketId: string,
    data: {
      oldStatus: string;
      newStatus: string;
      changedById: string;
    }
  ) {
    super(ticketId, data);
  }
}

export class TicketCommentAddedEvent extends BaseDomainEvent {
  constructor(
    ticketId: string,
    data: {
      commentId: string;
      userId: string;
      content: string;
      isInternal: boolean;
    }
  ) {
    super(ticketId, data);
  }
}

export class TicketAttachmentAddedEvent extends BaseDomainEvent {
  constructor(
    ticketId: string,
    data: {
      attachmentId: string;
      fileName: string;
      userId: string;
    }
  ) {
    super(ticketId, data);
  }
}

export class TicketResolvedEvent extends BaseDomainEvent {
  constructor(
    ticketId: string,
    data: {
      resolvedById: string;
      resolution: string;
      resolutionTime: Date;
    }
  ) {
    super(ticketId, data);
  }
}

export class TicketClosedEvent extends BaseDomainEvent {
  constructor(
    ticketId: string,
    data: {
      closedById: string;
      closeReason?: string;
    }
  ) {
    super(ticketId, data);
  }
}

export class SLABreachedEvent extends BaseDomainEvent {
  constructor(
    ticketId: string,
    data: {
      slaType: 'response' | 'resolution';
      expectedTime: Date;
      actualTime: Date;
      breachDuration: number;
    }
  ) {
    super(ticketId, data);
  }
}

export class TicketPriorityChangedEvent extends BaseDomainEvent {
  constructor(
    ticketId: string,
    data: {
      oldPriority: string;
      newPriority: string;
      changedById: string;
    }
  ) {
    super(ticketId, data);
  }
}
