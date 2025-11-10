import { Router } from 'express';
import { VerificationController } from '../controllers/verificationController';
import { validate } from '../validators/verificationValidator';
import {
  verifySchema,
  bulkVerifySchema,
  signatureVerifySchema,
  uuidParamSchema,
  codeParamSchema,
} from '@validators/verificationValidator';
import { verificationRateLimiter, bulkVerificationRateLimiter } from '@middleware/rateLimiter';

const router = Router();

/**
 * @route   POST /api/verify
 * @desc    Verify certificate by ID or verification code
 * @access  Public
 */
router.post(
  '/',
  verificationRateLimiter,
  validate(verifySchema, 'body'),
  VerificationController.verify
);

/**
 * @route   GET /api/verify/:certificateId
 * @desc    Quick verification by certificate ID
 * @access  Public
 */
router.get(
  '/:certificateId',
  verificationRateLimiter,
  validate(uuidParamSchema, 'params'),
  VerificationController.verifyById
);

/**
 * @route   GET /api/verify/code/:verificationCode
 * @desc    Quick verification by verification code
 * @access  Public
 */
router.get(
  '/code/:verificationCode',
  verificationRateLimiter,
  validate(codeParamSchema, 'params'),
  VerificationController.verifyByCode
);

/**
 * @route   POST /api/verify/bulk
 * @desc    Bulk certificate verification
 * @access  Public (rate limited)
 */
router.post(
  '/bulk',
  bulkVerificationRateLimiter,
  validate(bulkVerifySchema, 'body'),
  VerificationController.verifyBulk
);

/**
 * @route   POST /api/verify/signature
 * @desc    Verify digital signature directly
 * @access  Public
 */
router.post(
  '/signature',
  verificationRateLimiter,
  validate(signatureVerifySchema, 'body'),
  VerificationController.verifySignature
);

/**
 * @route   GET /api/verify/statistics
 * @desc    Get verification statistics
 * @access  Public (could be protected for admin)
 */
router.get('/statistics', VerificationController.getStatistics);

/**
 * @route   GET /api/verify/history/:certificateId
 * @desc    Get verification history for a certificate
 * @access  Public (could be protected)
 */
router.get(
  '/history/:certificateId',
  validate(uuidParamSchema, 'params'),
  VerificationController.getHistory
);

export default router;
