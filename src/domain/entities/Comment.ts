export interface CommentProps {
  id: string;
  ticketId: string;
  userId: string;
  content: string;
  isInternal: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class Comment {
  private constructor(private props: CommentProps) {}

  static create(props: CommentProps): Comment {
    return new Comment(props);
  }

  static reconstitute(props: CommentProps): Comment {
    return new Comment(props);
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

  get userId(): string {
    return this.props.userId;
  }

  get content(): string {
    return this.props.content;
  }

  get isInternal(): boolean {
    return this.props.isInternal;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // Business methods
  updateContent(content: string): void {
    this.props.content = content;
    this.props.updatedAt = new Date();
  }

  makeInternal(): void {
    this.props.isInternal = true;
    this.props.updatedAt = new Date();
  }

  makePublic(): void {
    this.props.isInternal = false;
    this.props.updatedAt = new Date();
  }

  toJSON() {
    return {
      id: this.props.id,
      ticketId: this.props.ticketId,
      userId: this.props.userId,
      content: this.props.content,
      isInternal: this.props.isInternal,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }
}
