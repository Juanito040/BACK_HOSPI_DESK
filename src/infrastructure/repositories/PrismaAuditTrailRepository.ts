import { PrismaClient as PClient } from '@prisma/client';
import { injectable } from 'tsyringe';
import { AuditTrail } from '../../domain/entities/AuditTrail';
import { IAuditTrailRepository } from '../../domain/repositories/IAuditTrailRepository';
import { PrismaClient } from '../db/PrismaClient';

@injectable()
export class PrismaAuditTrailRepository implements IAuditTrailRepository {
  private prisma: PClient;

  constructor() {
    this.prisma = PrismaClient.getInstance();
  }

  async save(auditTrail: AuditTrail): Promise<AuditTrail> {
    const data = {
      ticketId: auditTrail.ticketId,
      actorId: auditTrail.actorId,
      action: auditTrail.action,
      details: auditTrail.details || {},
      occurredAt: auditTrail.occurredAt,
    };

    const saved = await this.prisma.auditTrail.create({
      data,
    });

    return AuditTrail.reconstitute({
      id: saved.id,
      ticketId: saved.ticketId,
      actorId: saved.actorId,
      action: saved.action,
      details: saved.details as Record<string, any> | undefined,
      occurredAt: saved.occurredAt,
    });
  }

  async findByTicketId(ticketId: string): Promise<AuditTrail[]> {
    const records = await this.prisma.auditTrail.findMany({
      where: { ticketId },
      orderBy: { occurredAt: 'desc' },
    });

    return records.map((record) =>
      AuditTrail.reconstitute({
        id: record.id,
        ticketId: record.ticketId,
        actorId: record.actorId,
        action: record.action,
        details: record.details as Record<string, any> | undefined,
        occurredAt: record.occurredAt,
      })
    );
  }

  async findByActorId(actorId: string): Promise<AuditTrail[]> {
    const records = await this.prisma.auditTrail.findMany({
      where: { actorId },
      orderBy: { occurredAt: 'desc' },
    });

    return records.map((record) =>
      AuditTrail.reconstitute({
        id: record.id,
        ticketId: record.ticketId,
        actorId: record.actorId,
        action: record.action,
        details: record.details as Record<string, any> | undefined,
        occurredAt: record.occurredAt,
      })
    );
  }

  async findById(id: string): Promise<AuditTrail | null> {
    const record = await this.prisma.auditTrail.findUnique({
      where: { id },
    });

    if (!record) return null;

    return AuditTrail.reconstitute({
      id: record.id,
      ticketId: record.ticketId,
      actorId: record.actorId,
      action: record.action,
      details: record.details as Record<string, any> | undefined,
      occurredAt: record.occurredAt,
    });
  }
}
