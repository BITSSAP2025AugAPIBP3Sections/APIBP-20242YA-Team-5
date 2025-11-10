import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server
  port: parseInt(process.env.PORT || '3004'),
  env: process.env.NODE_ENV || 'development',
  serviceName: process.env.SERVICE_NAME || 'verification-service',

  // Database
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    name: process.env.DB_NAME || 'verification_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
  },

  // External Services
  services: {
    certificate: process.env.CERTIFICATE_SERVICE_URL || 'http://localhost:3003',
    university: process.env.UNIVERSITY_SERVICE_URL || 'http://localhost:3002',
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    bulkMaxRequests: parseInt(process.env.BULK_RATE_LIMIT_MAX_REQUESTS || '10'),
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    filePath: process.env.LOG_FILE_PATH || './logs',
  },

  // CORS
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
  },

  // Verification Settings
  verification: {
    maxBulk: parseInt(process.env.MAX_BULK_VERIFICATION || '100'),
    logRetentionDays: parseInt(process.env.VERIFICATION_LOG_RETENTION_DAYS || '90'),
  },

  // Redis (Optional)
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD || '',
    ttl: parseInt(process.env.CACHE_TTL || '3600'),
  },
};

export default config;
