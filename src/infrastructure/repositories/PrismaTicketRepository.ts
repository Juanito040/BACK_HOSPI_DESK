import { injectable } from 'tsyringe';
import { PrismaClient as PClient, Priority as PrismaPriority, Status as PrismaStatus } from '@prisma/client';
import { Ticket } from '../../domain/entities/Ticket';
import { ITicketRepository, TicketFilters } from '../../domain/repositories/ITicketRepository';
import { Priority } from '../../domain/value-objects/Priority';
import { Status } from '../../domain/value-objects/Status';
import { PrismaClient } from '../db/PrismaClient';
import { PaginationParams, PaginatedResult, createPaginatedResult } from '../../domain/types/Pagination';

@injectable()
export class PrismaTicketRepository implements ITicketRepository {
  private prisma: PClient;

  constructor() {
    this.prisma = PrismaClient.getInstance();
  }

  async save(ticket: Ticket): Promise<Ticket> {
    const data = await this.prisma.ticket.create({
      data: {
        id: ticket.id,
        title: ticket.title,
        description: ticket.description,
        priority: ticket.priority.getValue() as PrismaPriority,
        status: ticket.status.getValue() as PrismaStatus,
        areaId: ticket.areaId,
        requesterId: ticket.requesterId,
        assignedToId: ticket.assignedToId,
        resolvedAt: ticket.resolvedAt,
        closedAt: ticket.closedAt,
        resolution: ticket.resolution,
        responseTime: ticket.responseTime,
        resolutionTime: ticket.resolutionTime,
        createdAt: ticket.createdAt,
        updatedAt: ticket.updatedAt,
      },
    });

    return this.toDomain(data);
  }

  async findById(id: string): Promise<Ticket | null> {
    const data = await this.prisma.ticket.findUnique({
      where: { id },
    });

    return data ? this.toDomain(data) : null;
  }

  async findAll(filters?: TicketFilters): Promise<Ticket[]> {
    const where = this.buildWhereClause(filters);

    const data = await this.prisma.ticket.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return data.map((d) => this.toDomain(d));
  }

  async findAllPaginated(
    filters?: TicketFilters,
    pagination?: PaginationParams
  ): Promise<PaginatedResult<Ticket>> {
    const where = this.buildWhereClause(filters);

    // Default pagination values
    const page = pagination?.page || 1;
    const pageSize = pagination?.pageSize || 10;
    const sortBy = pagination?.sortBy || 'createdAt';
    const sortOrder = pagination?.sortOrder || 'desc';

    // Get total count
    const totalItems = await this.prisma.ticket.count({ where });

    // Get paginated data
    const data = await this.prisma.ticket.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { [sortBy]: sortOrder },
    });

    const tickets = data.map((d) => this.toDomain(d));

    return createPaginatedResult(tickets, totalItems, {
      page,
      pageSize,
      sortBy,
      sortOrder,
    });
  }

  private buildWhereClause(filters?: TicketFilters): Record<string, any> {
    const where: Record<string, any> = {};

    if (filters) {
      if (filters.status) {
        where.status = filters.status.getValue() as PrismaStatus;
      }
      if (filters.priority) {
        where.priority = filters.priority.getValue() as PrismaPriority;
      }
      if (filters.areaId) {
        where.areaId = filters.areaId;
      }
      if (filters.requesterId) {
        where.requesterId = filters.requesterId;
      }
      if (filters.assignedToId) {
        where.assignedToId = filters.assignedToId;
      }
      if (filters.createdAfter || filters.createdBefore) {
        where.createdAt = {};
        if (filters.createdAfter) {
          where.createdAt.gte = filters.createdAfter;
        }
        if (filters.createdBefore) {
          where.createdAt.lte = filters.createdBefore;
        }
      }
      if (filters.searchText) {
        where.OR = [
          { title: { contains: filters.searchText, mode: 'insensitive' } },
          { description: { contains: filters.searchText, mode: 'insensitive' } },
        ];
      }
    }

    return where;
  }

  async findByRequester(requesterId: string): Promise<Ticket[]> {
    const data = await this.prisma.ticket.findMany({
      where: { requesterId },
      orderBy: { createdAt: 'desc' },
    });

    return data.map((d) => this.toDomain(d));
  }

  async findByAssignee(assigneeId: string): Promise<Ticket[]> {
    const data = await this.prisma.ticket.findMany({
      where: { assignedToId: assigneeId },
      orderBy: { createdAt: 'desc' },
    });

    return data.map((d) => this.toDomain(d));
  }

  async findByArea(areaId: string): Promise<Ticket[]> {
    const data = await this.prisma.ticket.findMany({
      where: { areaId },
      orderBy: { createdAt: 'desc' },
    });

    return data.map((d) => this.toDomain(d));
  }

  async findOverdueSLA(areaId?: string): Promise<Ticket[]> {
    // This is a simplified version - in production, you'd join with SLA table
    const where: Record<string, unknown> = {
      status: {
        notIn: ['RESOLVED', 'CLOSED'],
      },
    };

    if (areaId) {
      where.areaId = areaId;
    }

    const data = await this.prisma.ticket.findMany({
      where,
      orderBy: { createdAt: 'asc' },
    });

    return data.map((d) => this.toDomain(d));
  }

  async update(ticket: Ticket): Promise<Ticket> {
    const data = await this.prisma.ticket.update({
      where: { id: ticket.id },
      data: {
        title: ticket.title,
        description: ticket.description,
        priority: ticket.priority.getValue() as PrismaPriority,
        status: ticket.status.getValue() as PrismaStatus,
        assignedToId: ticket.assignedToId,
        resolvedAt: ticket.resolvedAt,
        closedAt: ticket.closedAt,
        resolution: ticket.resolution,
        responseTime: ticket.responseTime,
        resolutionTime: ticket.resolutionTime,
        updatedAt: ticket.updatedAt,
      },
    });

    return this.toDomain(data);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.ticket.delete({
      where: { id },
    });
  }

  private toDomain(data: {
    id: string;
    title: string;
    description: string;
    priority: string;
    status: string;
    areaId: string;
    requesterId: string;
    assignedToId: string | null;
    resolvedAt: Date | null;
    closedAt: Date | null;
    resolution: string | null;
    responseTime: Date | null;
    resolutionTime: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }): Ticket {
    return Ticket.reconstitute({
      id: data.id,
      title: data.title,
      description: data.description,
      priority: Priority.fromString(data.priority),
      status: Status.fromString(data.status),
      areaId: data.areaId,
      requesterId: data.requesterId,
      assignedToId: data.assignedToId || undefined,
      resolvedAt: data.resolvedAt || undefined,
      closedAt: data.closedAt || undefined,
      resolution: data.resolution || undefined,
      responseTime: data.responseTime || undefined,
      resolutionTime: data.resolutionTime || undefined,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }
}
