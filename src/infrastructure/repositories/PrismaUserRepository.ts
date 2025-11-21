import { injectable } from 'tsyringe';
import { PrismaClient as PClient } from '@prisma/client';
import { User, UserRole } from '../../domain/entities/User';
import { Email } from '../../domain/value-objects/Email';
import { PhoneNumber } from '../../domain/value-objects/PhoneNumber';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { PrismaClient } from '../db/PrismaClient';

@injectable()
export class PrismaUserRepository implements IUserRepository {
  private prisma: PClient;

  constructor() {
    this.prisma = PrismaClient.getInstance();
  }

  async save(user: User): Promise<User> {
    const data = await this.prisma.user.create({
      data: {
        id: user.id,
        name: user.name,
        email: user.email.getValue(),
        phone: user.phone?.getValue(),
        role: user.role,
        areaId: user.areaId,
        passwordHash: user.passwordHash,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });

    return this.toDomain(data);
  }

  async findById(id: string): Promise<User | null> {
    const data = await this.prisma.user.findUnique({ where: { id } });
    return data ? this.toDomain(data) : null;
  }

  async findByEmail(email: Email): Promise<User | null> {
    const data = await this.prisma.user.findUnique({
      where: { email: email.getValue() },
    });
    return data ? this.toDomain(data) : null;
  }

  async findAll(): Promise<User[]> {
    const data = await this.prisma.user.findMany();
    return data.map((d) => this.toDomain(d));
  }

  async findByRole(role: UserRole): Promise<User[]> {
    const data = await this.prisma.user.findMany({ where: { role } });
    return data.map((d) => this.toDomain(d));
  }

  async findByArea(areaId: string): Promise<User[]> {
    const data = await this.prisma.user.findMany({ where: { areaId } });
    return data.map((d) => this.toDomain(d));
  }

  async findActiveUsers(): Promise<User[]> {
    const data = await this.prisma.user.findMany({ where: { isActive: true } });
    return data.map((d) => this.toDomain(d));
  }

  async update(user: User): Promise<User> {
    const data = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        name: user.name,
        email: user.email.getValue(),
        phone: user.phone?.getValue(),
        role: user.role,
        areaId: user.areaId,
        passwordHash: user.passwordHash,
        isActive: user.isActive,
        updatedAt: user.updatedAt,
      },
    });

    return this.toDomain(data);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  async updatePasswordResetToken(userId: string, token: string, expires: Date): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        passwordResetToken: token,
        passwordResetExpires: expires,
      },
    });
  }

  async findByResetToken(token: string): Promise<User | null> {
    const data = await this.prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpires: {
          gte: new Date(), // Token must not be expired
        },
      },
    });

    return data ? this.toDomain(data) : null;
  }

  async updatePassword(userId: string, passwordHash: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
  }

  async clearPasswordResetToken(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });
  }

  private toDomain(data: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    role: string;
    areaId: string | null;
    passwordHash: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    return User.reconstitute({
      id: data.id,
      name: data.name,
      email: new Email(data.email),
      phone: data.phone ? new PhoneNumber(data.phone) : undefined,
      role: data.role as UserRole,
      areaId: data.areaId || undefined,
      passwordHash: data.passwordHash,
      isActive: data.isActive,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }
}
