import { injectable, inject } from 'tsyringe';
import { AuditTrail } from '../../domain/entities/AuditTrail';
import { IAuditTrailRepository } from '../../domain/repositories/IAuditTrailRepository';

export interface CreateAuditTrailInput {
  ticketId: string;
  actorId: string;
  action: string;
  details?: Record<string, any>;
}

@injectable()
export class CreateAuditTrailUseCase {
  constructor(
    @inject('IAuditTrailRepository')
    private auditTrailRepository: IAuditTrailRepository
  ) {}

  async execute(input: CreateAuditTrailInput): Promise<AuditTrail> {
    const auditTrail = AuditTrail.create({
      ticketId: input.ticketId,
      actorId: input.actorId,
      action: input.action,
      details: input.details,
    });

    return await this.auditTrailRepository.save(auditTrail);
  }
}
