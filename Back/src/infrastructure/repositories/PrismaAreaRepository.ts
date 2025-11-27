import { injectable } from 'tsyringe';
import { PrismaClient as PClient } from '@prisma/client';
import { Area } from '../../domain/entities/Area';
import { IAreaRepository } from '../../domain/repositories/IAreaRepository';
import { PrismaClient } from '../db/PrismaClient';

@injectable()
export class PrismaAreaRepository implements IAreaRepository {
  private prisma: PClient;

  constructor() {
    this.prisma = PrismaClient.getInstance();
  }

  async save(area: Area): Promise<Area> {
    const data = await this.prisma.area.create({
      data: {
        id: area.id,
        name: area.name,
        description: area.description,
        isActive: area.isActive,
        createdAt: area.createdAt,
        updatedAt: area.updatedAt,
      },
    });

    return this.toDomain(data);
  }

  async findById(id: string): Promise<Area | null> {
    const data = await this.prisma.area.findUnique({ where: { id } });
    return data ? this.toDomain(data) : null;
  }

  async findAll(): Promise<Area[]> {
    const data = await this.prisma.area.findMany({
      orderBy: { name: 'asc' },
    });
    return data.map((d) => this.toDomain(d));
  }

  async findActiveAreas(): Promise<Area[]> {
    const data = await this.prisma.area.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
    return data.map((d) => this.toDomain(d));
  }

  async update(area: Area): Promise<Area> {
    const data = await this.prisma.area.update({
      where: { id: area.id },
      data: {
        name: area.name,
        description: area.description,
        isActive: area.isActive,
        updatedAt: area.updatedAt,
      },
    });

    return this.toDomain(data);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.area.delete({ where: { id } });
  }

  private toDomain(data: {
    id: string;
    name: string;
    description: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): Area {
    return Area.reconstitute({
      id: data.id,
      name: data.name,
      description: data.description || undefined,
      isActive: data.isActive,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }
}
