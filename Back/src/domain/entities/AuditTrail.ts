export interface AuditTrailProps {
  id: string;
  ticketId: string;
  actorId: string;
  action: string;
  details?: Record<string, any>;
  occurredAt: Date;
}

export class AuditTrail {
  private constructor(private props: AuditTrailProps) {}

  static create(
    props: Omit<AuditTrailProps, 'id' | 'occurredAt'>
  ): AuditTrail {
    return new AuditTrail({
      ...props,
      id: '', // Will be set by repository
      occurredAt: new Date(),
    });
  }

  static reconstitute(props: AuditTrailProps): AuditTrail {
    return new AuditTrail(props);
  }

  // Getters
  get id(): string {
    return this.props.id;
  }

  set id(id: string) {
    this.props.id = id;
  }

  get ticketId(): string {
    return this.props.ticketId;
  }

  get actorId(): string {
    return this.props.actorId;
  }

  get action(): string {
    return this.props.action;
  }

  get details(): Record<string, any> | undefined {
    return this.props.details;
  }

  get occurredAt(): Date {
    return this.props.occurredAt;
  }

  toJSON() {
    return {
      id: this.props.id,
      ticketId: this.props.ticketId,
      actorId: this.props.actorId,
      action: this.props.action,
      details: this.props.details,
      occurredAt: this.props.occurredAt,
    };
  }
}
