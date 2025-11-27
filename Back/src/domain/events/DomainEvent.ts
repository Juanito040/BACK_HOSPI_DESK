export interface DomainEvent {
  occurredOn: Date;
  eventName: string;
  aggregateId: string;
  eventData: unknown;
}

export abstract class BaseDomainEvent implements DomainEvent {
  public readonly occurredOn: Date;
  public readonly eventName: string;

  constructor(
    public readonly aggregateId: string,
    public readonly eventData: unknown
  ) {
    this.occurredOn = new Date();
    this.eventName = this.constructor.name;
  }
}
