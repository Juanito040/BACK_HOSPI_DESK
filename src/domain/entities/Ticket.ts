import { Priority } from '../value-objects/Priority';
import { Status } from '../value-objects/Status';
import { DomainEvent } from '../events/DomainEvent';
import {
  TicketCreatedEvent,
  TicketAssignedEvent,
  TicketStatusChangedEvent,
  TicketResolvedEvent,
  TicketClosedEvent,
  TicketPriorityChangedEvent,
} from '../events/TicketEvents';
import { InvalidStatusTransitionException } from '../exceptions/DomainException';

export interface TicketProps {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  areaId: string;
  requesterId: string;
  assignedToId?: string;
  resolvedAt?: Date;
  closedAt?: Date;
  resolution?: string;
  responseTime?: Date;
  resolutionTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class Ticket {
  private domainEvents: DomainEvent[] = [];

  private constructor(private props: TicketProps) {}

  static create(
    props: Omit<TicketProps, 'id' | 'status' | 'createdAt' | 'updatedAt'>
  ): Ticket {
    const now = new Date();
    const ticket = new Ticket({
      ...props,
      id: '', // Will be set by repository
      status: Status.OPEN(),
      createdAt: now,
      updatedAt: now,
    });

    ticket.addDomainEvent(
      new TicketCreatedEvent(ticket.id, {
        title: ticket.title,
        description: ticket.description,
        priority: ticket.priority.getValue(),
        areaId: ticket.areaId,
        requesterId: ticket.requesterId,
      })
    );

    return ticket;
  }

  static reconstitute(props: TicketProps): Ticket {
    return new Ticket(props);
  }

  // Getters
  get id(): string {
    return this.props.id;
  }

  set id(id: string) {
    this.props.id = id;
  }

  get title(): string {
    return this.props.title;
  }

  get description(): string {
    return this.props.description;
  }

  get priority(): Priority {
    return this.props.priority;
  }

  get status(): Status {
    return this.props.status;
  }

  get areaId(): string {
    return this.props.areaId;
  }

  get requesterId(): string {
    return this.props.requesterId;
  }

  get assignedToId(): string | undefined {
    return this.props.assignedToId;
  }

  get resolvedAt(): Date | undefined {
    return this.props.resolvedAt;
  }

  get closedAt(): Date | undefined {
    return this.props.closedAt;
  }

  get resolution(): string | undefined {
    return this.props.resolution;
  }

  get responseTime(): Date | undefined {
    return this.props.responseTime;
  }

  get resolutionTime(): Date | undefined {
    return this.props.resolutionTime;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // Business methods
  assignTo(userId: string, assignedById: string): void {
    if (this.status.isClosed()) {
      throw new Error('Cannot assign a closed ticket');
    }

    this.props.assignedToId = userId;

    // Set response time if this is the first assignment
    if (!this.props.responseTime) {
      this.props.responseTime = new Date();
    }

    this.props.updatedAt = new Date();

    this.addDomainEvent(
      new TicketAssignedEvent(this.id, {
        assignedToId: userId,
        assignedById,
      })
    );
  }

  changeStatus(newStatus: Status, changedById: string): void {
    if (!this.status.canTransitionTo(newStatus)) {
      throw new InvalidStatusTransitionException(
        this.status.getValue(),
        newStatus.getValue()
      );
    }

    const oldStatus = this.status;
    this.props.status = newStatus;
    this.props.updatedAt = new Date();

    this.addDomainEvent(
      new TicketStatusChangedEvent(this.id, {
        oldStatus: oldStatus.getValue(),
        newStatus: newStatus.getValue(),
        changedById,
      })
    );
  }

  changePriority(newPriority: Priority, changedById: string): void {
    if (this.priority.equals(newPriority)) {
      return;
    }

    const oldPriority = this.priority;
    this.props.priority = newPriority;
    this.props.updatedAt = new Date();

    this.addDomainEvent(
      new TicketPriorityChangedEvent(this.id, {
        oldPriority: oldPriority.getValue(),
        newPriority: newPriority.getValue(),
        changedById,
      })
    );
  }

  resolve(resolution: string, resolvedById: string): void {
    if (this.status.isClosed()) {
      throw new Error('Cannot resolve a closed ticket');
    }

    this.props.resolution = resolution;
    this.props.resolvedAt = new Date();
    this.props.resolutionTime = new Date();
    this.props.status = Status.RESOLVED();
    this.props.updatedAt = new Date();

    this.addDomainEvent(
      new TicketResolvedEvent(this.id, {
        resolvedById,
        resolution,
        resolutionTime: this.props.resolvedAt,
      })
    );
  }

  close(closedById: string, closeReason?: string): void {
    if (this.status.isClosed()) {
      throw new Error('Ticket is already closed');
    }

    this.props.closedAt = new Date();
    this.props.status = Status.CLOSED();
    this.props.updatedAt = new Date();

    this.addDomainEvent(
      new TicketClosedEvent(this.id, {
        closedById,
        closeReason,
      })
    );
  }

  reopen(): void {
    if (!this.status.isClosed()) {
      throw new Error('Can only reopen closed tickets');
    }

    this.props.status = Status.OPEN();
    this.props.resolvedAt = undefined;
    this.props.closedAt = undefined;
    this.props.resolution = undefined;
    this.props.updatedAt = new Date();
  }

  updateTitle(title: string): void {
    if (this.status.isClosed()) {
      throw new Error('Cannot update a closed ticket');
    }
    this.props.title = title;
    this.props.updatedAt = new Date();
  }

  updateDescription(description: string): void {
    if (this.status.isClosed()) {
      throw new Error('Cannot update a closed ticket');
    }
    this.props.description = description;
    this.props.updatedAt = new Date();
  }

  isOverdue(slaMinutes: number): boolean {
    if (this.status.isClosed()) {
      return false;
    }

    const now = new Date();
    const elapsedMinutes = (now.getTime() - this.createdAt.getTime()) / (1000 * 60);
    return elapsedMinutes > slaMinutes;
  }

  // Domain events
  addDomainEvent(event: DomainEvent): void {
    this.domainEvents.push(event);
  }

  getDomainEvents(): DomainEvent[] {
    return [...this.domainEvents];
  }

  clearDomainEvents(): void {
    this.domainEvents = [];
  }

  toJSON() {
    return {
      id: this.props.id,
      title: this.props.title,
      description: this.props.description,
      priority: this.props.priority.getValue(),
      status: this.props.status.getValue(),
      areaId: this.props.areaId,
      requesterId: this.props.requesterId,
      assignedToId: this.props.assignedToId,
      resolvedAt: this.props.resolvedAt,
      closedAt: this.props.closedAt,
      resolution: this.props.resolution,
      responseTime: this.props.responseTime,
      resolutionTime: this.props.resolutionTime,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }
}
