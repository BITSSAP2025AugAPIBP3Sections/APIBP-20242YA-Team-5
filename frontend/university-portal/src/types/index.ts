// University-related types
export interface University {
  id: string;
  name: string;
  email: string;
  address: string;
  phone: string;
  website: string;
  isVerified: boolean;
  publicKey: string;
  certificatesIssued: number;
  createdAt: string;
  updatedAt?: string;
}

// Student-related types
export interface Student {
  id: string;
  studentId: string;
  fullName: string;
  email: string;
  phone?: string;
  department: string;
  program: string;
  enrollmentYear: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

// Certificate-related types
export interface Certificate {
  id: string;
  certificateNumber: string;
  studentId: string;
  studentName: string;
  courseName: string;
  specialization?: string;
  grade: string;
  cgpa?: number;
  issueDate: string;
  completionDate: string;
  certificateHash: string;
  digitalSignature: string;
  verificationCode: string;
  pdfPath?: string;
  status: 'ACTIVE' | 'REVOKED' | 'PENDING' | 'EXPIRED';
  revocationReason?: string;
  universityId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CertificateIssueRequest {
  studentId: string;
  studentName: string;
  courseName: string;
  specialization?: string;
  grade: string;
  cgpa?: number;
  issueDate: string;
  completionDate: string;
}

export interface CertificateUpdateRequest {
  studentName?: string;
  courseName?: string;
  specialization?: string;
  grade?: string;
  cgpa?: number;
  issueDate?: string;
  completionDate?: string;
}

export interface CertificateRevocationRequest {
  certificateId: string;
  reason: string;
}

// Dashboard statistics
export interface UniversityDashboardStats {
  totalCertificatesIssued: number;
  totalStudents: number;
  activeCertificates: number;
  revokedCertificates: number;
  pendingCertificates: number;
  recentCertificates: Certificate[];
  monthlyIssuance: MonthlyData[];
  certificatesByGrade: GradeData[];
}

export interface MonthlyData {
  month: string;
  count: number;
}

export interface GradeData {
  grade: string;
  count: number;
  percentage: number;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: string;
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

// Authentication types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  fullName: string;
  universityId?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: string;
  universityId?: string;
  token: string;
}

// File upload types
export interface FileUploadResponse {
  fileName: string;
  filePath: string;
  fileSize: number;
  uploadTime: string;
}