import 'reflect-metadata';
import { createApp } from './app';
import { config } from './config/environment';
import { logger } from './config/logger';
import { PrismaClient } from './infrastructure/db/PrismaClient';
import { configureContainer } from './config/container';
import { setupEventHandlers } from './infrastructure/events/setupEventHandlers';

async function bootstrap() {
  try {
    // Configure dependency injection
    configureContainer();
    logger.info('Dependency injection configured');

    // Setup event handlers
    setupEventHandlers();
    logger.info('Event handlers configured');

    // Connect to database
    await PrismaClient.connect();

    // Create Express app
    const app = createApp();

    // Start server
    const server = app.listen(config.server.port, () => {
      logger.info(`Server running on port ${config.server.port}`);
      logger.info(`Environment: ${config.server.env}`);
      logger.info(`API Prefix: ${config.server.apiPrefix}`);
    });

    // Graceful shutdown
    const shutdown = async () => {
      logger.info('Shutting down gracefully...');

      server.close(async () => {
        await PrismaClient.disconnect();
        logger.info('Server closed');
        process.exit(0);
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        logger.error('Forced shutdown');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();
