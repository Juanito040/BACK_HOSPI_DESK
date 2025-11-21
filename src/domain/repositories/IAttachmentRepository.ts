import { Attachment } from '../entities/Attachment';

export interface IAttachmentRepository {
  save(attachment: Attachment): Promise<Attachment>;
  findById(id: string): Promise<Attachment | null>;
  findByTicketId(ticketId: string): Promise<Attachment[]>;
  delete(id: string): Promise<void>;
}
