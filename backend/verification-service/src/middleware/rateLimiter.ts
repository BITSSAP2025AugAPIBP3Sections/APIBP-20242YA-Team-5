import rateLimit from 'express-rate-limit';
import { config } from '@config/index';

// Standard rate limiter for verification endpoints
export const verificationRateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs, // 15 minutes
  max: config.rateLimit.maxRequests, // 100 requests per window
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many verification requests. Please try again later.',
      timestamp: new Date().toISOString(),
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip successful requests in count (optional)
  skip: (req, res) => res.statusCode < 400,
});

// Strict rate limiter for bulk verification
export const bulkVerificationRateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs, // 15 minutes
  max: config.rateLimit.bulkMaxRequests, // 10 requests per window
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many bulk verification requests. Please try again later.',
      timestamp: new Date().toISOString(),
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});
