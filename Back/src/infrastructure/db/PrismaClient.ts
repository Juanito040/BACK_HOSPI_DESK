import { PrismaClient as PClient } from '@prisma/client';
import { logger } from '../../config/logger';

export class PrismaClient {
  private static instance: PClient;

  private constructor() {}

  static getInstance(): PClient {
    if (!PrismaClient.instance) {
      PrismaClient.instance = new PClient({
        log: [
          { level: 'query', emit: 'event' },
          { level: 'error', emit: 'event' },
          { level: 'warn', emit: 'event' },
        ],
      });

      // Log queries in development
      PrismaClient.instance.$on('query' as never, (e: unknown) => {
        const event = e as { query: string; duration: number };
        logger.debug(`Query: ${event.query} - Duration: ${event.duration}ms`);
      });

      PrismaClient.instance.$on('error' as never, (e: unknown) => {
        const event = e as { message: string };
        logger.error(`Prisma Error: ${event.message}`);
      });

      PrismaClient.instance.$on('warn' as never, (e: unknown) => {
        const event = e as { message: string };
        logger.warn(`Prisma Warning: ${event.message}`);
      });
    }

    return PrismaClient.instance;
  }

  static async connect(): Promise<void> {
    try {
      await PrismaClient.getInstance().$connect();
      logger.info('Database connected successfully');
    } catch (error) {
      logger.error('Failed to connect to database', error);
      throw error;
    }
  }

  static async disconnect(): Promise<void> {
    try {
      await PrismaClient.getInstance().$disconnect();
      logger.info('Database disconnected successfully');
    } catch (error) {
      logger.error('Failed to disconnect from database', error);
      throw error;
    }
  }
}
