import { injectable, inject } from 'tsyringe';
import { AuditTrail } from '../../domain/entities/AuditTrail';
import { IAuditTrailRepository } from '../../domain/repositories/IAuditTrailRepository';

@injectable()
export class GetAuditTrailUseCase {
  constructor(
    @inject('IAuditTrailRepository')
    private auditTrailRepository: IAuditTrailRepository
  ) {}

  async getByTicketId(ticketId: string): Promise<AuditTrail[]> {
    return await this.auditTrailRepository.findByTicketId(ticketId);
  }

  async getByActorId(actorId: string): Promise<AuditTrail[]> {
    return await this.auditTrailRepository.findByActorId(actorId);
  }
}
