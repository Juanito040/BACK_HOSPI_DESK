export abstract class DomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class TicketNotFoundException extends DomainException {
  constructor(ticketId: string) {
    super(`Ticket with ID ${ticketId} not found`);
  }
}

export class InvalidStatusTransitionException extends DomainException {
  constructor(from: string, to: string) {
    super(`Invalid status transition from ${from} to ${to}`);
  }
}

export class UnauthorizedOperationException extends DomainException {
  constructor(operation: string, userId: string) {
    super(`User ${userId} is not authorized to perform operation: ${operation}`);
  }
}

export class SLABreachException extends DomainException {
  constructor(ticketId: string, slaType: string) {
    super(`SLA breach detected for ticket ${ticketId}: ${slaType}`);
  }
}

export class InvalidWorkflowException extends DomainException {
  constructor(message: string) {
    super(`Workflow validation failed: ${message}`);
  }
}

export class UserNotFoundException extends DomainException {
  constructor(userId: string) {
    super(`User with ID ${userId} not found`);
  }
}

export class AreaNotFoundException extends DomainException {
  constructor(areaId: string) {
    super(`Area with ID ${areaId} not found`);
  }
}

export class AttachmentNotFoundException extends DomainException {
  constructor(attachmentId: string) {
    super(`Attachment with ID ${attachmentId} not found`);
  }
}

export class CommentNotFoundException extends DomainException {
  constructor(commentId: string) {
    super(`Comment with ID ${commentId} not found`);
  }
}

export class InvalidFileTypeException extends DomainException {
  constructor(fileType: string) {
    super(`Invalid file type: ${fileType}`);
  }
}

export class FileSizeLimitExceededException extends DomainException {
  constructor(size: number, limit: number) {
    super(`File size ${size} exceeds limit of ${limit}`);
  }
}
