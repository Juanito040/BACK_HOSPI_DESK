import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const config = {
  server: {
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3000', 10),
    apiPrefix: '/api/v1',  // Hardcoded to avoid Git Bash path conversion issues
  },
  database: {
    url: process.env.DATABASE_URL || '',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret-change-this',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'default-refresh-secret-change-this',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },
  upload: {
    maxFileSizeMB: parseInt(process.env.MAX_FILE_SIZE_MB || '10', 10),
    uploadDir: process.env.UPLOAD_DIR || path.join(__dirname, '../../uploads'),
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    dir: process.env.LOG_DIR || path.join(__dirname, '../../logs'),
  },
  email: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER || '',
    password: process.env.SMTP_PASSWORD || '',
    from: process.env.SMTP_FROM || 'noreply@hospidesk.com',
  },
  glpi: {
    enabled: process.env.GLPI_ENABLED === 'true',
    apiUrl: process.env.GLPI_API_URL || '',
    appToken: process.env.GLPI_APP_TOKEN || '',
    userToken: process.env.GLPI_USER_TOKEN || '',
  },
};

export const isDevelopment = config.server.env === 'development';
export const isProduction = config.server.env === 'production';
export const isTest = config.server.env === 'test';
