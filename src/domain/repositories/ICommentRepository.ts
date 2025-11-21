import { Comment } from '../entities/Comment';

export interface ICommentRepository {
  save(comment: Comment): Promise<Comment>;
  findById(id: string): Promise<Comment | null>;
  findByTicketId(ticketId: string): Promise<Comment[]>;
  findPublicByTicketId(ticketId: string): Promise<Comment[]>;
  update(comment: Comment): Promise<Comment>;
  delete(id: string): Promise<void>;
}
