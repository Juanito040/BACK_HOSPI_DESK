export interface AttachmentProps {
  id: string;
  ticketId: string;
  userId: string;
  fileName: string;
  filePath: string;
  mimeType: string;
  fileSize: number;
  createdAt: Date;
}

export class Attachment {
  private constructor(private props: AttachmentProps) {}

  static create(props: AttachmentProps): Attachment {
    return new Attachment(props);
  }

  static reconstitute(props: AttachmentProps): Attachment {
    return new Attachment(props);
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

  get fileName(): string {
    return this.props.fileName;
  }

  get filePath(): string {
    return this.props.filePath;
  }

  get mimeType(): string {
    return this.props.mimeType;
  }

  get fileSize(): number {
    return this.props.fileSize;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  // Business methods
  isImage(): boolean {
    return this.props.mimeType.startsWith('image/');
  }

  isPDF(): boolean {
    return this.props.mimeType === 'application/pdf';
  }

  isDocument(): boolean {
    const docTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];
    return docTypes.includes(this.props.mimeType);
  }

  getFileSizeInMB(): number {
    return this.props.fileSize / (1024 * 1024);
  }

  toJSON() {
    return {
      id: this.props.id,
      ticketId: this.props.ticketId,
      userId: this.props.userId,
      fileName: this.props.fileName,
      filePath: this.props.filePath,
      mimeType: this.props.mimeType,
      fileSize: this.props.fileSize,
      createdAt: this.props.createdAt,
    };
  }
}
