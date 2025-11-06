import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests from this IP, please try again later.',
      timestamp: new Date().toISOString()
    }
  }
});
app.use('/api', limiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    services: {
      auth: 'checking...',
      university: 'checking...',
      certificate: 'checking...',
      verification: 'checking...',
      notification: 'checking...'
    }
  });
});

// Service URLs (from environment variables)
const SERVICES = {
  auth: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
  university: process.env.UNIVERSITY_SERVICE_URL || 'http://localhost:3002',
  certificate: process.env.CERTIFICATE_SERVICE_URL || 'http://localhost:3003',
  verification: process.env.VERIFICATION_SERVICE_URL || 'http://localhost:3004'
};

// Proxy configuration for each service
const createProxy = (target: string, pathRewrite?: any) => 
  createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite,
    onError: (err, req, res) => {
      console.error(`Proxy error for ${target}:`, err.message);
      res.status(503).json({
        success: false,
        error: {
          code: 'SERVICE_UNAVAILABLE',
          message: 'Service temporarily unavailable',
          timestamp: new Date().toISOString()
        }
      });
    }
  });

// Route proxying to microservices
app.use('/api/auth', createProxy(SERVICES.auth, { '^/api/auth': '' }));
app.use('/api/universities', createProxy(SERVICES.university, { '^/api/universities': '' }));
app.use('/api/certificates', createProxy(SERVICES.certificate, { '^/api/certificates': '' }));
app.use('/api/verify', createProxy(SERVICES.verification, { '^/api/verify': '' }));

// Admin routes (you can add authentication middleware here later)
app.use('/api/admin', createProxy(SERVICES.auth, { '^/api/admin': '/admin' }));

// Catch-all for undefined routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'API endpoint not found',
      timestamp: new Date().toISOString()
    }
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Certificate Verification System API Gateway',
    version: '1.0.0',
    documentation: '/api/docs',
    health: '/api/health'
  });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global error:', err);
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
      timestamp: new Date().toISOString()
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
  console.log(`🔗 Service URLs:`);
  Object.entries(SERVICES).forEach(([name, url]) => {
    console.log(`   ${name}: ${url}`);
  });
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

export default app;