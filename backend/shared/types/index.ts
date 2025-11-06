// Shared TypeScript interfaces and types
export interface User {
  userId: string;
  email: string;
  role: 'university' | 'student' | 'employer' | 'admin';
  universityId?: string;
  fullName: string;
  studentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface University {
  universityId: string;
  name: string;
  email: string;
  address?: string;
  phone?: string;
  publicKey: string;
  verified: boolean;
  verificationCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Certificate {
  certificateId: string;
  certificateNumber: string;
  studentId: string;
  universityId: string;
  studentName: string;
  courseName: string;
  specialization?: string;
  grade: string;
  cgpa?: number;
  issueDate: Date;
  completionDate?: Date;
  certificateHash: string;
  digitalSignature: string;
  timestampToken?: string;
  verificationCode: string;
  pdfPath?: string;
  status: 'active' | 'revoked' | 'suspended';
  revocationReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface VerificationLog {
  id: string;
  certificateId: string;
  verifierIp: string;
  verifierInfo?: string;
  verificationMethod: 'certificate id' | 'verification code';
  verificationResult: boolean;
  verifiedAt: Date;
}

export interface CertificateRevocation {
  id: string;
  certificateId: string;
  revokedBy: string;
  revocationReason: string;
  revokedAt: Date;
}

// API Request/Response Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  expiresIn: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  role: 'university' | 'student' | 'employer';
  universityId?: string;
  studentId?: string;
}

export interface CertificateIssueRequest {
  studentName: string;
  studentEmail: string;
  courseName: string;
  specialization?: string;
  grade: string;
  cgpa?: number;
  issueDate: Date;
  completionDate?: Date;
}

export interface VerificationRequest {
  certificateId?: string;
  verificationCode?: string;
}

export interface VerificationResponse {
  success: boolean;
  certificate?: Certificate;
  university?: University;
  message: string;
  verificationMethod: string;
  timestamp: Date;
}

// Service Response Types
export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Configuration Types
export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl?: boolean;
}

export interface JWTConfig {
  secret: string;
  expiresIn: string;
}

export interface SMTPConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  secure?: boolean;
}

// Error Types
export interface APIError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

export enum ErrorCodes {
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN', 
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  DUPLICATE_ENTRY = 'DUPLICATE_ENTRY',
  CERTIFICATE_REVOKED = 'CERTIFICATE_REVOKED',
  INVALID_SIGNATURE = 'INVALID_SIGNATURE',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED'
}

// GraphQL Types
export interface GraphQLContext {
  user?: User;
  university?: University;
  services: {
    auth: string;
    university: string;
    certificate: string;
    verification: string;
    file: string;
    notification: string;
  };
}