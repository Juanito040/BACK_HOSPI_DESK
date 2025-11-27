import { Request, Response, NextFunction } from 'express';
import { DomainException } from '../../../domain/exceptions/DomainException';
import { logger } from '../../../config/logger';

export const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {
  logger.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  if (err instanceof DomainException) {
    return res.status(400).json({
      error: err.message,
      type: err.name,
    });
  }

  if (err.message === 'Invalid credentials' || err.message === 'Invalid token') {
    return res.status(401).json({ error: err.message });
  }

  if (err.message.includes('not found')) {
    return res.status(404).json({ error: err.message });
  }

  if (err.message.includes('already exists')) {
    return res.status(409).json({ error: err.message });
  }

  return res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
};
