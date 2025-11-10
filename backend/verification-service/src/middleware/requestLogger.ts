import { Request, Response, NextFunction } from 'express';
import logger from '@utils/logger';

/**
 * Request logging middleware
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();

  // Log request
  logger.info(`Incoming Request: ${req.method} ${req.url}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });

  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logger.info(`Response Sent: ${req.method} ${req.url} - ${res.statusCode}`, {
      duration: `${duration}ms`,
    });
  });

  next();
};
