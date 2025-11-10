import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3004;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
  credentials: true
}));

// Rate limiting with higher limits for verification endpoints
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '15') * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX || '1000'), // Higher limit for verification
  message: { error: 'Too many requests from this IP, please try again later.' }
});
app.use(limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Mock certificate and university data (in production, these would be database calls)
const mockCertificates = [
  {
    certificateId: '770e8400-e29b-41d4-a716-446655440000',
    certificateNumber: 'CERT2024001',
    studentId: 'STU2024001',
    universityId: '550e8400-e29b-41d4-a716-446655440000',
    studentName: 'John Doe',
    courseName: 'Bachelor of Computer Science',
    grade: 'A',
    issueDate: '2024-05-15',
    verificationCode: 'VERIFY123456',
    status: 'active',
    digitalSignature: 'signature123456789'
  }
];

const mockUniversities = [
  {
    universityId: '550e8400-e29b-41d4-a716-446655440000',
    name: 'BITS Pilani',
    email: 'admin@bits-pilani.ac.in',
    publicKey: 'mock-public-key-bits-pilani',
    verified: true
  }
];

// Verification log interface following updated swagger spec
interface VerificationLog {
  id: string;
  certificateId: string;
  verifierIp: string;
  verifierInfo?: string;
  verificationMethod: 'certificate id' | 'verification code';
  verificationResult: boolean;
  verifiedAt: Date;
}

const verificationLogs: VerificationLog[] = [];

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'verification-service',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Main verification endpoint (public)
app.post('/', async (req, res) => {
  try {
    const { certificateId, verificationCode } = req.body;
    const verifierIp = req.ip || req.connection.remoteAddress || 'unknown';

    // Validation
    if (!certificateId && !verificationCode) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Either certificateId or verificationCode is required',
          timestamp: new Date().toISOString()
        }
      });
    }

    let certificate;
    let verificationMethod: 'certificate id' | 'verification code';

    // Find certificate by ID or verification code
    if (certificateId) {
      certificate = mockCertificates.find(c => c.certificateId === certificateId);
      verificationMethod = 'certificate id';
    } else {
      certificate = mockCertificates.find(c => c.verificationCode === verificationCode);
      verificationMethod = 'verification code';
    }

    if (!certificate) {
      // Log failed verification
      const log: VerificationLog = {
        id: `log_${Date.now()}`,
        certificateId: certificateId || 'unknown',
        verifierIp,
        verificationMethod,
        verificationResult: false,
        verifiedAt: new Date()
      };
      verificationLogs.push(log);

      return res.status(404).json({
        success: false,
        message: 'Certificate not found',
        data: {
          certificateId: certificateId || null,
          verificationCode: verificationCode || null,
          success: false,
          message: 'Certificate not found'
        }
      });
    }

    // Check certificate status
    if (certificate.status === 'revoked') {
      // Log revoked certificate verification
      const log: VerificationLog = {
        id: `log_${Date.now()}`,
        certificateId: certificate.certificateId,
        verifierIp,
        verificationMethod,
        verificationResult: false,
        verifiedAt: new Date()
      };
      verificationLogs.push(log);

      return res.json({
        success: false,
        message: 'Certificate has been revoked',
        data: {
          certificateId: certificate.certificateId,
          verificationCode: certificate.verificationCode,
          success: false,
          message: 'Certificate has been revoked'
        }
      });
    }

    // Find associated university
    const university = mockUniversities.find(u => u.universityId === certificate.universityId);

    // Log successful verification
    const log: VerificationLog = {
      id: `log_${Date.now()}`,
      certificateId: certificate.certificateId,
      verifierIp,
      verificationMethod,
      verificationResult: true,
      verifiedAt: new Date()
    };
    verificationLogs.push(log);

    // Return successful verification response
    res.json({
      success: true,
      message: 'Certificate verified successfully',
      data: {
        certificate: {
          certificateId: certificate.certificateId,
          certificateNumber: certificate.certificateNumber,
          studentName: certificate.studentName,
          courseName: certificate.courseName,
          grade: certificate.grade,
          issueDate: certificate.issueDate,
          status: certificate.status
        },
        university: university ? {
          universityId: university.universityId,
          name: university.name,
          verified: university.verified
        } : null,
        verification: {
          verificationMethod,
          timestamp: new Date().toISOString(),
          success: true,
          message: 'Certificate is valid and authentic'
        }
      }
    });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred',
        timestamp: new Date().toISOString()
      }
    });
  }
});

// Bulk verification endpoint
app.post('/bulk', async (req, res) => {
  try {
    const { certificates } = req.body;
    const verifierIp = req.ip || req.connection.remoteAddress || 'unknown';

    if (!certificates || !Array.isArray(certificates) || certificates.length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Certificates array is required and must not be empty',
          timestamp: new Date().toISOString()
        }
      });
    }

    if (certificates.length > 100) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Maximum 100 certificates allowed per bulk verification',
          timestamp: new Date().toISOString()
        }
      });
    }

    const results = [];

    for (const cert of certificates) {
      const { certificateId, verificationCode } = cert;
      
      if (!certificateId && !verificationCode) {
        results.push({
          certificateId: certificateId || null,
          verificationCode: verificationCode || null,
          success: false,
          message: 'Either certificateId or verificationCode is required'
        });
        continue;
      }

      let certificate;
      let verificationMethod: 'certificate id' | 'verification code';

      if (certificateId) {
        certificate = mockCertificates.find(c => c.certificateId === certificateId);
        verificationMethod = 'certificate id';
      } else {
        certificate = mockCertificates.find(c => c.verificationCode === verificationCode);
        verificationMethod = 'verification code';
      }

      // Log verification attempt
      const log: VerificationLog = {
        id: `log_${Date.now()}_${Math.random()}`,
        certificateId: certificate?.certificateId || certificateId || 'unknown',
        verifierIp,
        verificationMethod,
        verificationResult: !!certificate && certificate.status === 'active',
        verifiedAt: new Date()
      };
      verificationLogs.push(log);

      if (!certificate) {
        results.push({
          certificateId: certificateId || null,
          verificationCode: verificationCode || null,
          success: false,
          message: 'Certificate not found'
        });
      } else if (certificate.status === 'revoked') {
        results.push({
          certificateId: certificate.certificateId,
          verificationCode: certificate.verificationCode,
          success: false,
          message: 'Certificate has been revoked'
        });
      } else {
        results.push({
          certificateId: certificate.certificateId,
          verificationCode: certificate.verificationCode,
          success: true,
          message: 'Certificate is valid and authentic'
        });
      }
    }

    res.json({
      success: true,
      data: {
        totalRequested: certificates.length,
        totalVerified: results.filter(r => r.success).length,
        totalFailed: results.filter(r => !r.success).length,
        results
      },
      message: `Bulk verification completed for ${certificates.length} certificates`
    });
  } catch (error) {
    console.error('Bulk verification error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred',
        timestamp: new Date().toISOString()
      }
    });
  }
});

// Get verification statistics (for admin/analytics)
app.get('/stats', (req, res) => {
  try {
    const totalVerifications = verificationLogs.length;
    const successfulVerifications = verificationLogs.filter(log => log.verificationResult).length;
    const failedVerifications = totalVerifications - successfulVerifications;
    
    const methodStats = verificationLogs.reduce((acc, log) => {
      acc[log.verificationMethod] = (acc[log.verificationMethod] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    res.json({
      success: true,
      data: {
        totalVerifications,
        successfulVerifications,
        failedVerifications,
        successRate: totalVerifications > 0 ? (successfulVerifications / totalVerifications * 100).toFixed(2) + '%' : '0%',
        verificationMethods: methodStats,
        lastVerification: verificationLogs.length > 0 ? verificationLogs[verificationLogs.length - 1].verifiedAt : null
      }
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred',
        timestamp: new Date().toISOString()
      }
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Verification Service running on port ${PORT}`);
  console.log(`🔍 Health check: http://localhost:${PORT}/health`);
  console.log(`📊 Sample certificates available for verification: ${mockCertificates.length}`);
});

export default app;