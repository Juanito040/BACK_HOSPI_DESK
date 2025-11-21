import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import { GetAuditTrailUseCase } from '../../../application/use-cases/GetAuditTrailUseCase';

@injectable()
export class AuditTrailController {
  constructor(
    @inject(GetAuditTrailUseCase)
    private getAuditTrailUseCase: GetAuditTrailUseCase
  ) {}

  async getByTicketId(req: Request, res: Response): Promise<void> {
    try {
      const { ticketId } = req.params;

      const auditTrails = await this.getAuditTrailUseCase.getByTicketId(ticketId);

      res.status(200).json({
        success: true,
        data: auditTrails.map((audit) => audit.toJSON()),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get audit trail',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async getByActorId(req: Request, res: Response): Promise<void> {
    try {
      const { actorId } = req.params;

      const auditTrails = await this.getAuditTrailUseCase.getByActorId(actorId);

      res.status(200).json({
        success: true,
        data: auditTrails.map((audit) => audit.toJSON()),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get audit trail',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
