import express, { Request } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';

dotenv.config();

// Extend Request interface for multer
interface MulterRequest extends Request {
  file?: {
    filename: string;
    originalname: string;
    mimetype: string;
    size: number;
    path: string;
  };
}

const app = express();
const PORT = process.env.PORT || 3003;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '15') * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX || '100'),
  message: { error: 'Too many requests from this IP, please try again later.' }
});
app.use(limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Multer setup for file uploads
const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Certificate interface following the updated swagger spec
interface Certificate {
  certificateId: string;
  certificateNumber: string;
  studentId: string;
  universityId: string;
  studentName: string;
  studentEmail: string;
  courseName: string;
  specialization?: string;
  grade: string;
  cgpa?: number;
  issueDate: string;
  completionDate?: string;
  certificateHash: string;
  digitalSignature: string;
  timestampToken?: string;
  verificationCode: string;
  pdfPath?: string;
  status: 'active' | 'revoked' | 'suspended';
  revocationReason?: string;
  createdAt: string;
  updatedAt: string;
}

// Mock certificate database
const certificates: Certificate[] = [
  {
    certificateId: '770e8400-e29b-41d4-a716-446655440000',
    certificateNumber: 'CERT2024001',
    studentId: 'STU2024001',
    universityId: '550e8400-e29b-41d4-a716-446655440000',
    studentName: 'John Doe',
    studentEmail: 'john.doe@student.edu',
    courseName: 'Bachelor of Computer Science',
    specialization: 'Artificial Intelligence',
    grade: 'A',
    cgpa: 8.5,
    issueDate: '2024-05-15',
    completionDate: '2024-05-10',
    certificateHash: 'hash123456789',
    digitalSignature: 'signature123456789',
    timestampToken: 'timestamp123456789',
    verificationCode: 'VERIFY123456',
    pdfPath: '/certificates/cert2024001.pdf',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Simple notification function (can be enhanced with nodemailer later)
async function sendNotification(type: string, recipient: string, data: any) {
  console.log(`📧 NOTIFICATION [${type}] to ${recipient}:`, data);
  
  // In production, implement actual email/SMS sending here
  // Example:
  // - Email via nodemailer/sendgrid
  // - SMS via twilio
  // - Push notifications
  
  return Promise.resolve({ sent: true, type, recipient });
}

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'certificate-service',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Get all certificates
app.get('/', (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as string;
    const universityId = req.query.universityId as string;
    
    let filteredCertificates = certificates;
    
    if (status) {
      filteredCertificates = filteredCertificates.filter(c => c.status === status);
    }
    
    if (universityId) {
      filteredCertificates = filteredCertificates.filter(c => c.universityId === universityId);
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCertificates = filteredCertificates.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: paginatedCertificates,
      pagination: {
        page,
        limit,
        total: filteredCertificates.length,
        totalPages: Math.ceil(filteredCertificates.length / limit)
      }
    });
  } catch (error) {
    console.error('Get certificates error:', error);
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

// Get certificate by ID
app.get('/:certificateId', (req, res) => {
  try {
    const { certificateId } = req.params;
    const certificate = certificates.find(c => c.certificateId === certificateId);

    if (!certificate) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Certificate not found',
          timestamp: new Date().toISOString()
        }
      });
    }

    res.json({
      success: true,
      data: certificate
    });
  } catch (error) {
    console.error('Get certificate error:', error);
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

// Issue new certificate
app.post('/', async (req, res) => {
  try {
    const {
      studentName,
      studentEmail,
      courseName,
      specialization,
      grade,
      cgpa,
      issueDate,
      completionDate,
      universityId,
      studentId
    } = req.body;

    // Validation
    if (!studentName || !studentEmail || !courseName || !grade || !universityId || !studentId) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Required fields: studentName, studentEmail, courseName, grade, universityId, studentId',
          timestamp: new Date().toISOString()
        }
      });
    }

    // Create new certificate
    const newCertificate: Certificate = {
      certificateId: uuidv4(),
      certificateNumber: `CERT${Date.now()}`,
      studentId,
      universityId,
      studentName,
      studentEmail,
      courseName,
      specialization,
      grade,
      cgpa,
      issueDate: issueDate || new Date().toISOString().split('T')[0],
      completionDate,
      certificateHash: `hash${Date.now()}`,
      digitalSignature: `signature${Date.now()}`,
      verificationCode: `VERIFY${Date.now()}`,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    certificates.push(newCertificate);

    // Send notification to student
    try {
      await sendNotification('CERTIFICATE_ISSUED', studentEmail, {
        studentName,
        courseName,
        certificateNumber: newCertificate.certificateNumber,
        grade,
        verificationCode: newCertificate.verificationCode
      });
    } catch (notificationError) {
      console.error('Notification failed:', notificationError);
      // Don't fail the certificate issuance if notification fails
    }

    res.status(201).json({
      success: true,
      data: newCertificate,
      message: 'Certificate issued successfully'
    });
  } catch (error) {
    console.error('Issue certificate error:', error);
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

// Update certificate
app.put('/:certificateId', async (req, res) => {
  try {
    const { certificateId } = req.params;
    const { certificateNumber, grade, cgpa, specialization } = req.body;

    if (!certificateNumber) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Certificate number is required',
          timestamp: new Date().toISOString()
        }
      });
    }

    const certificateIndex = certificates.findIndex(c => c.certificateId === certificateId);
    if (certificateIndex === -1) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Certificate not found',
          timestamp: new Date().toISOString()
        }
      });
    }

    // Update fields
    if (grade) certificates[certificateIndex].grade = grade;
    if (cgpa) certificates[certificateIndex].cgpa = cgpa;
    if (specialization) certificates[certificateIndex].specialization = specialization;
    certificates[certificateIndex].updatedAt = new Date().toISOString();

    res.json({
      success: true,
      data: certificates[certificateIndex],
      message: 'Certificate updated successfully'
    });
  } catch (error) {
    console.error('Update certificate error:', error);
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

// Revoke certificate
app.post('/:certificateId/revoke', async (req, res) => {
  try {
    const { certificateId } = req.params;
    const { certificateNumber, reason } = req.body;

    if (!certificateNumber || !reason) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Certificate number and reason are required',
          timestamp: new Date().toISOString()
        }
      });
    }

    const certificateIndex = certificates.findIndex(c => c.certificateId === certificateId);
    if (certificateIndex === -1) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Certificate not found',
          timestamp: new Date().toISOString()
        }
      });
    }

    certificates[certificateIndex].status = 'revoked';
    certificates[certificateIndex].revocationReason = reason;
    certificates[certificateIndex].updatedAt = new Date().toISOString();

    // Send notification to student about revocation
    try {
      await sendNotification('CERTIFICATE_REVOKED', certificates[certificateIndex].studentEmail, {
        studentName: certificates[certificateIndex].studentName,
        certificateNumber: certificates[certificateIndex].certificateNumber,
        courseName: certificates[certificateIndex].courseName,
        reason
      });
    } catch (notificationError) {
      console.error('Revocation notification failed:', notificationError);
      // Don't fail the revocation if notification fails
    }

    res.json({
      success: true,
      data: certificates[certificateIndex],
      message: 'Certificate revoked successfully'
    });
  } catch (error) {
    console.error('Revoke certificate error:', error);
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

// Download certificate PDF (moved from file service)
app.get('/:certificateId/pdf', (req, res) => {
  try {
    const { certificateId } = req.params;
    const certificate = certificates.find(c => c.certificateId === certificateId);

    if (!certificate) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Certificate not found',
          timestamp: new Date().toISOString()
        }
      });
    }

    // In production, this would return the actual PDF file
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="certificate-${certificate.certificateNumber}.pdf"`);
    res.send('Mock PDF content - In production, this would be the actual PDF file');
  } catch (error) {
    console.error('Download PDF error:', error);
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

// Generate certificate PDF (moved from file service)
app.post('/:certificateId/generate-pdf', (req, res) => {
  try {
    const { certificateId } = req.params;
    const certificate = certificates.find(c => c.certificateId === certificateId);

    if (!certificate) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Certificate not found',
          timestamp: new Date().toISOString()
        }
      });
    }

    // In production, this would generate the actual PDF
    const pdfPath = `/certificates/${certificate.certificateNumber}.pdf`;
    
    // Update certificate with PDF path
    const certificateIndex = certificates.findIndex(c => c.certificateId === certificateId);
    certificates[certificateIndex].pdfPath = pdfPath;
    certificates[certificateIndex].updatedAt = new Date().toISOString();

    res.json({
      success: true,
      data: {
        certificateId: certificate.certificateId,
        pdfPath,
        downloadUrl: `/api/certificates/${certificateId}/pdf`
      },
      message: 'PDF generated successfully'
    });
  } catch (error) {
    console.error('Generate PDF error:', error);
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

// File upload (moved from file service)
app.post('/upload', upload.single('file'), (req: MulterRequest, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'No file uploaded',
          timestamp: new Date().toISOString()
        }
      });
    }

    res.json({
      success: true,
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path,
        uploadedAt: new Date().toISOString()
      },
      message: 'File uploaded successfully'
    });
  } catch (error) {
    console.error('File upload error:', error);
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
  console.log(`📜 Certificate Service running on port ${PORT}`);
  console.log(`🔍 Health check: http://localhost:${PORT}/health`);
  console.log(`📊 Sample certificates loaded: ${certificates.length}`);
});

export default app;