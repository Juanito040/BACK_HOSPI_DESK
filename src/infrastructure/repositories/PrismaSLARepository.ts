import { injectable } from 'tsyringe';
import { PrismaClient as PClient, Priority as PrismaPriority } from '@prisma/client';
import { SLA } from '../../domain/entities/SLA';
import { Priority } from '../../domain/value-objects/Priority';
import { ISLARepository } from '../../domain/repositories/ISLARepository';
import { PrismaClient } from '../db/PrismaClient';

@injectable()
export class PrismaSLARepository implements ISLARepository {
  private prisma: PClient;

  constructor() {
    this.prisma = PrismaClient.getInstance();
  }

  async save(sla: SLA): Promise<SLA> {
    const data = await this.prisma.sLA.create({
      data: {
        id: sla.id,
        areaId: sla.areaId,
        priority: sla.priority.getValue() as PrismaPriority,
        responseTimeMinutes: sla.responseTimeMinutes,
        resolutionTimeMinutes: sla.resolutionTimeMinutes,
        isActive: sla.isActive,
        createdAt: sla.createdAt,
        updatedAt: sla.updatedAt,
      },
    });

    return this.toDomain(data);
  }

  async findById(id: string): Promise<SLA | null> {
    const data = await this.prisma.sLA.findUnique({ where: { id } });
    return data ? this.toDomain(data) : null;
  }

  async findByAreaAndPriority(areaId: string, priority: Priority): Promise<SLA | null> {
    const data = await this.prisma.sLA.findFirst({
      where: {
        areaId,
        priority: priority.getValue() as PrismaPriority,
        isActive: true,
      },
    });
    return data ? this.toDomain(data) : null;
  }

  async findByArea(areaId: string): Promise<SLA[]> {
    const data = await this.prisma.sLA.findMany({
      where: { areaId },
      orderBy: { priority: 'asc' },
    });
    return data.map((d) => this.toDomain(d));
  }

  async findAll(): Promise<SLA[]> {
    const data = await this.prisma.sLA.findMany({
      orderBy: [{ areaId: 'asc' }, { priority: 'asc' }],
    });
    return data.map((d) => this.toDomain(d));
  }

  async update(sla: SLA): Promise<SLA> {
    const data = await this.prisma.sLA.update({
      where: { id: sla.id },
      data: {
        responseTimeMinutes: sla.responseTimeMinutes,
        resolutionTimeMinutes: sla.resolutionTimeMinutes,
        isActive: sla.isActive,
        updatedAt: sla.updatedAt,
      },
    });

    return this.toDomain(data);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.sLA.delete({ where: { id } });
  }

  private toDomain(data: {
    id: string;
    areaId: string;
    priority: string;
    responseTimeMinutes: number;
    resolutionTimeMinutes: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): SLA {
    return SLA.reconstitute({
      id: data.id,
      areaId: data.areaId,
      priority: Priority.fromString(data.priority),
      responseTimeMinutes: data.responseTimeMinutes,
      resolutionTimeMinutes: data.resolutionTimeMinutes,
      isActive: data.isActive,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }
}
