import 'reflect-metadata';
import { container } from 'tsyringe';

// Repositories
import { ITicketRepository } from '../domain/repositories/ITicketRepository';
import { IUserRepository } from '../domain/repositories/IUserRepository';
import { ICommentRepository } from '../domain/repositories/ICommentRepository';
import { IAuditTrailRepository } from '../domain/repositories/IAuditTrailRepository';
import { IAttachmentRepository } from '../domain/repositories/IAttachmentRepository';
import { IAreaRepository } from '../domain/repositories/IAreaRepository';
import { ISLARepository } from '../domain/repositories/ISLARepository';
import { PrismaTicketRepository } from '../infrastructure/repositories/PrismaTicketRepository';
import { PrismaUserRepository } from '../infrastructure/repositories/PrismaUserRepository';
import { PrismaCommentRepository } from '../infrastructure/repositories/PrismaCommentRepository';
import { PrismaAuditTrailRepository } from '../infrastructure/repositories/PrismaAuditTrailRepository';
import { PrismaAttachmentRepository } from '../infrastructure/repositories/PrismaAttachmentRepository';
import { PrismaAreaRepository } from '../infrastructure/repositories/PrismaAreaRepository';
import { PrismaSLARepository } from '../infrastructure/repositories/PrismaSLARepository';

// Services
import { IEventBus } from '../domain/services/IEventBus';
import { InMemoryEventBus } from '../infrastructure/events/InMemoryEventBus';
import { IPasswordHasher } from '../application/ports/IPasswordHasher';
import { BcryptPasswordHasher } from '../infrastructure/security/BcryptPasswordHasher';
import { ITokenService } from '../application/ports/ITokenService';
import { JWTTokenService } from '../infrastructure/security/JWTTokenService';
import { IFileStorage } from '../application/ports/IFileStorage';
import { LocalFileStorage } from '../infrastructure/storage/LocalFileStorage';
import { INotificationService } from '../application/ports/INotificationService';
import { EmailNotificationService } from '../infrastructure/notifications/EmailNotificationService';

export function configureContainer(): void {
  // Register Repositories
  container.register<ITicketRepository>('ITicketRepository', {
    useClass: PrismaTicketRepository,
  });

  container.register<IUserRepository>('IUserRepository', {
    useClass: PrismaUserRepository,
  });

  container.register<ICommentRepository>('ICommentRepository', {
    useClass: PrismaCommentRepository,
  });

  container.register<IAuditTrailRepository>('IAuditTrailRepository', {
    useClass: PrismaAuditTrailRepository,
  });

  container.register<IAttachmentRepository>('IAttachmentRepository', {
    useClass: PrismaAttachmentRepository,
  });

  container.register<IAreaRepository>('IAreaRepository', {
    useClass: PrismaAreaRepository,
  });

  container.register<ISLARepository>('ISLARepository', {
    useClass: PrismaSLARepository,
  });

  // Register Services
  container.register<IEventBus>('IEventBus', {
    useClass: InMemoryEventBus,
  });

  container.register<IPasswordHasher>('IPasswordHasher', {
    useClass: BcryptPasswordHasher,
  });

  container.register<ITokenService>('ITokenService', {
    useClass: JWTTokenService,
  });

  container.register<IFileStorage>('IFileStorage', {
    useClass: LocalFileStorage,
  });

  container.register<INotificationService>('INotificationService', {
    useClass: EmailNotificationService,
  });
}
