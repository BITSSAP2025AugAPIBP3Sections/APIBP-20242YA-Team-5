import { Request, Response } from 'express';
import pool from '@config/database';
import { config } from '@config/index';

/**
 * Health check controller
 */
export class HealthController {
  /**
   * GET /health - Basic health check
   */
  static async healthCheck(req: Request, res: Response) {
    try {
      // Check database connection
      await pool.query('SELECT 1');

      return res.status(200).json({
        status: 'healthy',
        service: config.serviceName,
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: config.env,
        database: 'connected',
      });
    } catch (error) {
      return res.status(503).json({
        status: 'unhealthy',
        service: config.serviceName,
        timestamp: new Date().toISOString(),
        error: 'Database connection failed',
      });
    }
  }

  /**
   * GET /health/ready - Readiness probe
   */
  static async readinessCheck(req: Request, res: Response) {
    try {
      // Check database
      await pool.query('SELECT 1');

      return res.status(200).json({
        ready: true,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      return res.status(503).json({
        ready: false,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * GET /health/live - Liveness probe
   */
  static liveCheck(req: Request, res: Response) {
    return res.status(200).json({
      alive: true,
      timestamp: new Date().toISOString(),
    });
  }
}
