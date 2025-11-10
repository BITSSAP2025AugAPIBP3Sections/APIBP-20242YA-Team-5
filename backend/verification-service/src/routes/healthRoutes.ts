import { Router } from 'express';
import { HealthController } from '@controllers/healthController';

const router = Router();

/**
 * @route   GET /health
 * @desc    Health check endpoint
 * @access  Public
 */
router.get('/', HealthController.healthCheck);

/**
 * @route   GET /health/ready
 * @desc    Readiness probe
 * @access  Public
 */
router.get('/ready', HealthController.readinessCheck);

/**
 * @route   GET /health/live
 * @desc    Liveness probe
 * @access  Public
 */
router.get('/live', HealthController.liveCheck);

export default router;
