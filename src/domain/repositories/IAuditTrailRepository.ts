import { AuditTrail } from '../entities/AuditTrail';

export interface IAuditTrailRepository {
  save(auditTrail: AuditTrail): Promise<AuditTrail>;
  findByTicketId(ticketId: string): Promise<AuditTrail[]>;
  findByActorId(actorId: string): Promise<AuditTrail[]>;
  findById(id: string): Promise<AuditTrail | null>;
}
