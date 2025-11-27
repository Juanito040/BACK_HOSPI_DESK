export interface AreaProps {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class Area {
  private constructor(private props: AreaProps) {}

  static create(props: AreaProps): Area {
    return new Area(props);
  }

  static reconstitute(props: AreaProps): Area {
    return new Area(props);
  }

  // Getters
  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string | undefined {
    return this.props.description;
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
  updateName(name: string): void {
    this.props.name = name;
    this.props.updatedAt = new Date();
  }

  updateDescription(description: string | undefined): void {
    this.props.description = description;
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
      name: this.props.name,
      description: this.props.description,
      isActive: this.props.isActive,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }
}
