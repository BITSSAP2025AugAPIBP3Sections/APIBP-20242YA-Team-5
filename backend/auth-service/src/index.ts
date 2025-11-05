import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '15') * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX || '100'), // limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests from this IP, please try again later.' }
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Types for our mock data
interface User {
  id: string;
  email: string;
  password: string;
  role: 'admin' | 'university' | 'student';
  universityId?: string;
  profile: {
    firstName: string;
    lastName: string;
    phone?: string;
  };
  isActive: boolean;
  createdAt: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  role: 'admin' | 'university' | 'student';
  firstName: string;
  lastName: string;
  phone?: string;
  universityId?: string;
}

// Mock user database (in production, this would be a real database)
const users: User[] = [
  {
    id: '1',
    email: 'admin@system.com',
    password: bcrypt.hashSync('admin123', 10),
    role: 'admin',
    profile: {
      firstName: 'System',
      lastName: 'Administrator'
    },
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    email: 'university@bits.edu',
    password: bcrypt.hashSync('university123', 10),
    role: 'university',
    universityId: 'bits-pilani',
    profile: {
      firstName: 'BITS',
      lastName: 'Pilani'
    },
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    email: 'student@bits.edu',
    password: bcrypt.hashSync('student123', 10),
    role: 'student',
    universityId: 'bits-pilani',
    profile: {
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567890'
    },
    isActive: true,
    createdAt: new Date().toISOString()
  }
];

// JWT secret (in production, this should be in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key-change-this-in-production';

// Generate JWT tokens
function generateTokens(user: User) {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    universityId: user.universityId
  };

  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });

  return { accessToken, refreshToken };
}

// Verify JWT token middleware
function verifyToken(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = decoded;
    next();
  });
}

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'auth-service',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// User registration
app.post('/register', async (req, res) => {
  try {
    const { email, password, role, firstName, lastName, phone, universityId }: RegisterRequest = req.body;

    // Validation
    if (!email || !password || !role || !firstName || !lastName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!['admin', 'university', 'student'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser: User = {
      id: (users.length + 1).toString(),
      email,
      password: hashedPassword,
      role,
      universityId,
      profile: {
        firstName,
        lastName,
        phone
      },
      isActive: true,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(newUser);

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      message: 'User registered successfully',
      user: userWithoutPassword,
      tokens: {
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User login
app.post('/login', async (req, res) => {
  try {
    const { email, password }: LoginRequest = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ error: 'Account is deactivated' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Login successful',
      user: userWithoutPassword,
      tokens: {
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Refresh token
app.post('/refresh', (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }

    jwt.verify(refreshToken, JWT_REFRESH_SECRET, (err: any, decoded: any) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid refresh token' });
      }

      // Find user
      const user = users.find(u => u.id === decoded.id);
      if (!user || !user.isActive) {
        return res.status(403).json({ error: 'User not found or inactive' });
      }

      // Generate new access token
      const { accessToken } = generateTokens(user);

      res.json({
        accessToken
      });
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user profile
app.get('/profile', verifyToken, (req: any, res) => {
  try {
    const user = users.find(u => u.id === req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
app.put('/profile', verifyToken, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, phone } = req.body;

    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update profile
    if (firstName) users[userIndex].profile.firstName = firstName;
    if (lastName) users[userIndex].profile.lastName = lastName;
    if (phone !== undefined) users[userIndex].profile.phone = phone;

    const { password: _, ...userWithoutPassword } = users[userIndex];
    res.json({
      message: 'Profile updated successfully',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Logout (in a real app, you'd maintain a blacklist of tokens)
app.post('/logout', verifyToken, (req, res) => {
  res.json({ message: 'Logout successful' });
});

// Validate token endpoint (for other services to verify tokens)
app.post('/validate', (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token required' });
    }

    jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
      if (err) {
        return res.status(401).json({ 
          valid: false, 
          error: 'Invalid or expired token' 
        });
      }

      // Find user to ensure they still exist and are active
      const user = users.find(u => u.id === decoded.id);
      if (!user || !user.isActive) {
        return res.status(401).json({ 
          valid: false, 
          error: 'User not found or inactive' 
        });
      }

      res.json({
        valid: true,
        user: {
          id: decoded.id,
          email: decoded.email,
          role: decoded.role,
          universityId: decoded.universityId
        }
      });
    });
  } catch (error) {
    console.error('Token validation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin-only: Get all users
app.get('/admin/users', verifyToken, (req: any, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const usersWithoutPasswords = users.map(({ password, ...user }) => user);
    res.json({ users: usersWithoutPasswords });
  } catch (error) {
    console.error('Admin users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin-only: Deactivate/activate user
app.put('/admin/users/:userId/status', verifyToken, (req: any, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { userId } = req.params;
    const { isActive } = req.body;

    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    users[userIndex].isActive = isActive;

    const { password: _, ...userWithoutPassword } = users[userIndex];
    res.json({
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Admin user status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🔐 Auth Service running on port ${PORT}`);
  console.log(`📋 Available endpoints:`);
  console.log(`   POST /login - User login`);
  console.log(`   POST /register - User registration`);
  console.log(`   POST /refresh - Refresh access token`);
  console.log(`   GET  /profile - Get user profile`);
  console.log(`   PUT  /profile - Update user profile`);
  console.log(`   POST /logout - User logout`);
  console.log(`   POST /validate - Validate token (for services)`);
  console.log(`   GET  /admin/users - Get all users (admin only)`);
  console.log(`   PUT  /admin/users/:id/status - Update user status (admin only)`);
  console.log(`   GET  /health - Health check`);
  console.log(`🔑 Demo users:`);
  console.log(`   admin@system.com / admin123 (admin)`);
  console.log(`   university@bits.edu / university123 (university)`);
  console.log(`   student@bits.edu / student123 (student)`);
});