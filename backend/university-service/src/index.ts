import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

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

// University interface following the updated swagger spec
interface University {
  universityId: string;
  name: string;
  email: string;
  address?: string;
  phone?: string;
  publicKey: string;
  verified: boolean;
  verificationCode?: string;
  createdAt: string;
  updatedAt: string;
}

// Mock university database
const universities: University[] = [
  {
    universityId: '550e8400-e29b-41d4-a716-446655440000',
    name: 'BITS Pilani',
    email: 'admin@bits-pilani.ac.in',
    address: 'Pilani, Rajasthan, India',
    phone: '+91-1596-242111',
    publicKey: 'mock-public-key-bits-pilani',
    verified: true,
    verificationCode: 'BITS2024',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    universityId: '660e8400-e29b-41d4-a716-446655440001',
    name: 'Sample University',
    email: 'admin@sample-university.edu',
    address: 'Sample City, Sample State',
    phone: '+1-555-0123',
    publicKey: 'mock-public-key-sample-university',
    verified: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'university-service',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Get all universities
app.get('/', (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const verified = req.query.verified === 'true' ? true : req.query.verified === 'false' ? false : undefined;
    
    let filteredUniversities = universities;
    if (verified !== undefined) {
      filteredUniversities = universities.filter(u => u.verified === verified);
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUniversities = filteredUniversities.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: paginatedUniversities,
      pagination: {
        page,
        limit,
        total: filteredUniversities.length,
        totalPages: Math.ceil(filteredUniversities.length / limit)
      }
    });
  } catch (error) {
    console.error('Get universities error:', error);
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

// Get university by ID
app.get('/:universityId', (req, res) => {
  try {
    const { universityId } = req.params;
    const university = universities.find(u => u.universityId === universityId);

    if (!university) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'University not found',
          timestamp: new Date().toISOString()
        }
      });
    }

    res.json({
      success: true,
      data: university
    });
  } catch (error) {
    console.error('Get university error:', error);
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

// Register new university
app.post('/', async (req, res) => {
  try {
    const { name, email, address, phone } = req.body;

    // Validation
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Name and email are required',
          timestamp: new Date().toISOString()
        }
      });
    }

    // Check if university already exists
    const existingUniversity = universities.find(u => u.email === email);
    if (existingUniversity) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'DUPLICATE_ENTRY',
          message: 'University with this email already exists',
          timestamp: new Date().toISOString()
        }
      });
    }

    // Create new university
    const newUniversity: University = {
      universityId: uuidv4(),
      name,
      email,
      address,
      phone,
      publicKey: `mock-public-key-${Date.now()}`, // In production, generate real keys
      verified: false,
      verificationCode: `VERIFY${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    universities.push(newUniversity);

    res.status(201).json({
      success: true,
      data: newUniversity,
      message: 'University registered successfully'
    });
  } catch (error) {
    console.error('Register university error:', error);
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

// Update university
app.put('/:universityId', async (req, res) => {
  try {
    const { universityId } = req.params;
    const { name, address, phone } = req.body;

    const universityIndex = universities.findIndex(u => u.universityId === universityId);
    if (universityIndex === -1) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'University not found',
          timestamp: new Date().toISOString()
        }
      });
    }

    // Update fields
    if (name) universities[universityIndex].name = name;
    if (address) universities[universityIndex].address = address;
    if (phone) universities[universityIndex].phone = phone;
    universities[universityIndex].updatedAt = new Date().toISOString();

    res.json({
      success: true,
      data: universities[universityIndex],
      message: 'University updated successfully'
    });
  } catch (error) {
    console.error('Update university error:', error);
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

// Delete university
app.delete('/:universityId', (req, res) => {
  try {
    const { universityId } = req.params;

    const universityIndex = universities.findIndex(u => u.universityId === universityId);
    if (universityIndex === -1) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'University not found',
          timestamp: new Date().toISOString()
        }
      });
    }

    universities.splice(universityIndex, 1);

    res.json({
      success: true,
      message: 'University deleted successfully'
    });
  } catch (error) {
    console.error('Delete university error:', error);
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

// Get university public key (public endpoint)
app.get('/:universityId/public-key', (req, res) => {
  try {
    const { universityId } = req.params;
    const university = universities.find(u => u.universityId === universityId);

    if (!university) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'University not found',
          timestamp: new Date().toISOString()
        }
      });
    }

    res.json({
      success: true,
      data: {
        universityId: university.universityId,
        name: university.name,
        publicKey: university.publicKey
      }
    });
  } catch (error) {
    console.error('Get public key error:', error);
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
  console.log(`🏫 University Service running on port ${PORT}`);
  console.log(`🔍 Health check: http://localhost:${PORT}/health`);
  console.log(`📊 Sample universities loaded: ${universities.length}`);
});

export default app;