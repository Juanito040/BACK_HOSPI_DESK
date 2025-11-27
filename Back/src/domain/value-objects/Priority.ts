export enum PriorityLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export class Priority {
  private readonly level: PriorityLevel;

  constructor(level: PriorityLevel) {
    if (!Object.values(PriorityLevel).includes(level)) {
      throw new Error(`Invalid priority level: ${level}`);
    }
    this.level = level;
  }

  static fromString(value: string): Priority {
    const upperValue = value.toUpperCase();
    if (!Object.values(PriorityLevel).includes(upperValue as PriorityLevel)) {
      throw new Error(`Invalid priority level: ${value}`);
    }
    return new Priority(upperValue as PriorityLevel);
  }

  static LOW(): Priority {
    return new Priority(PriorityLevel.LOW);
  }

  static MEDIUM(): Priority {
    return new Priority(PriorityLevel.MEDIUM);
  }

  static HIGH(): Priority {
    return new Priority(PriorityLevel.HIGH);
  }

  static CRITICAL(): Priority {
    return new Priority(PriorityLevel.CRITICAL);
  }

  getLevel(): PriorityLevel {
    return this.level;
  }

  getValue(): string {
    return this.level;
  }

  isCritical(): boolean {
    return this.level === PriorityLevel.CRITICAL;
  }

  isHighOrCritical(): boolean {
    return this.level === PriorityLevel.HIGH || this.level === PriorityLevel.CRITICAL;
  }

  equals(other: Priority): boolean {
    return this.level === other.level;
  }

  toString(): string {
    return this.level;
  }
}
