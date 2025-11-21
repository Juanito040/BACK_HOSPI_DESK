import { Priority } from '../value-objects/Priority';

export interface SLAProps {
  id: string;
  areaId: string;
  priority: Priority;
  responseTimeMinutes: number;
  resolutionTimeMinutes: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class SLA {
  private constructor(private props: SLAProps) {}

  static create(props: SLAProps): SLA {
    return new SLA(props);
  }

  static reconstitute(props: SLAProps): SLA {
    return new SLA(props);
  }

  // Getters
  get id(): string {
    return this.props.id;
  }

  get areaId(): string {
    return this.props.areaId;
  }

  get priority(): Priority {
    return this.props.priority;
  }

  get responseTimeMinutes(): number {
    return this.props.responseTimeMinutes;
  }

  get resolutionTimeMinutes(): number {
    return this.props.resolutionTimeMinutes;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // Business methods
  calculateResponseDeadline(ticketCreatedAt: Date): Date {
    const deadline = new Date(ticketCreatedAt);
    deadline.setMinutes(deadline.getMinutes() + this.props.responseTimeMinutes);
    return deadline;
  }

  calculateResolutionDeadline(ticketCreatedAt: Date): Date {
    const deadline = new Date(ticketCreatedAt);
    deadline.setMinutes(deadline.getMinutes() + this.props.resolutionTimeMinutes);
    return deadline;
  }

  isResponseBreached(ticketCreatedAt: Date, responseTime?: Date): boolean {
    const deadline = this.calculateResponseDeadline(ticketCreatedAt);
    const checkTime = responseTime || new Date();
    return checkTime > deadline;
  }

  isResolutionBreached(ticketCreatedAt: Date, resolutionTime?: Date): boolean {
    const deadline = this.calculateResolutionDeadline(ticketCreatedAt);
    const checkTime = resolutionTime || new Date();
    return checkTime > deadline;
  }

  getResponseTimeInHours(): number {
    return this.props.responseTimeMinutes / 60;
  }

  getResolutionTimeInHours(): number {
    return this.props.resolutionTimeMinutes / 60;
  }

  updateResponseTime(minutes: number): void {
    if (minutes <= 0) {
      throw new Error('Response time must be greater than 0');
    }
    this.props.responseTimeMinutes = minutes;
    this.props.updatedAt = new Date();
  }

  updateResolutionTime(minutes: number): void {
    if (minutes <= 0) {
      throw new Error('Resolution time must be greater than 0');
    }
    if (minutes <= this.props.responseTimeMinutes) {
      throw new Error('Resolution time must be greater than response time');
    }
    this.props.resolutionTimeMinutes = minutes;
    this.props.updatedAt = new Date();
  }

  activate(): void {
    this.props.isActive = true;
    this.props.updatedAt = new Date();
  }

  deactivate(): void {
    this.props.isActive = false;
    this.props.updatedAt = new Date();
  }

  toJSON() {
    return {
      id: this.props.id,
      areaId: this.props.areaId,
      priority: this.props.priority.getValue(),
      responseTimeMinutes: this.props.responseTimeMinutes,
      resolutionTimeMinutes: this.props.resolutionTimeMinutes,
      isActive: this.props.isActive,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }
}
