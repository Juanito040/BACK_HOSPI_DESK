export enum TicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  PENDING = 'PENDING',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export class Status {
  private readonly status: TicketStatus;

  constructor(status: TicketStatus) {
    if (!Object.values(TicketStatus).includes(status)) {
      throw new Error(`Invalid status: ${status}`);
    }
    this.status = status;
  }

  static fromString(value: string): Status {
    const upperValue = value.toUpperCase();
    if (!Object.values(TicketStatus).includes(upperValue as TicketStatus)) {
      throw new Error(`Invalid status: ${value}`);
    }
    return new Status(upperValue as TicketStatus);
  }

  static OPEN(): Status {
    return new Status(TicketStatus.OPEN);
  }

  static IN_PROGRESS(): Status {
    return new Status(TicketStatus.IN_PROGRESS);
  }

  static PENDING(): Status {
    return new Status(TicketStatus.PENDING);
  }

  static RESOLVED(): Status {
    return new Status(TicketStatus.RESOLVED);
  }

  static CLOSED(): Status {
    return new Status(TicketStatus.CLOSED);
  }

  getStatus(): TicketStatus {
    return this.status;
  }

  getValue(): string {
    return this.status;
  }

  isOpen(): boolean {
    return this.status === TicketStatus.OPEN;
  }

  isClosed(): boolean {
    return this.status === TicketStatus.CLOSED || this.status === TicketStatus.RESOLVED;
  }

  canTransitionTo(newStatus: Status): boolean {
    const transitions: Record<TicketStatus, TicketStatus[]> = {
      [TicketStatus.OPEN]: [TicketStatus.IN_PROGRESS, TicketStatus.CLOSED],
      [TicketStatus.IN_PROGRESS]: [
        TicketStatus.PENDING,
        TicketStatus.RESOLVED,
        TicketStatus.CLOSED,
      ],
      [TicketStatus.PENDING]: [TicketStatus.IN_PROGRESS, TicketStatus.CLOSED],
      [TicketStatus.RESOLVED]: [TicketStatus.CLOSED, TicketStatus.OPEN],
      [TicketStatus.CLOSED]: [TicketStatus.OPEN],
    };

    return transitions[this.status]?.includes(newStatus.status) ?? false;
  }

  equals(other: Status): boolean {
    return this.status === other.status;
  }

  toString(): string {
    return this.status;
  }
}
