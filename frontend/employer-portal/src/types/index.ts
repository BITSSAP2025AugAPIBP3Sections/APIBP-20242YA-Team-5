export interface Certificate {
  certificateNumber: string;
  studentName: string;
  courseName: string;
  universityName: string;
  issueDate: string;
  grade: string;
  status: 'ACTIVE' | 'REVOKED';
}

export interface AuthUser {
  uid: string;
  name: string;
  email: string;
  role: 'employer';
  token: string;
  companyName?: string;
  verified?: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  fullName: string;
  email: string;
  password: string;
  role?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export interface VerificationResult {
  isValid: boolean;
  certificate?: Certificate;
  message?: string;
}

export interface VerificationResponse {
  valid: boolean;
  certificate?: Certificate;
  message?: string;
}

export interface Certificate {
  certificateNumber: string;
  studentName: string;
  studentEmail: string;
  courseName: string;
  issueDate: string;
  expiryDate?: string;
  grade: string;
  status: 'ACTIVE' | 'REVOKED';
  universityName: string;
  universityEmail?: string;
  qrCode?: string;
  verificationUrl?: string;
}

export interface BulkVerificationRequest {
  certificateNumbers: string[];
}

export interface BulkVerificationResult {
  certificateNumber: string;
  isValid: boolean;
  certificate?: Certificate;
  message?: string;
}

export interface BulkVerificationResponse {
  results: BulkVerificationResult[];
  summary: {
    total: number;
    valid: number;
    invalid: number;
  };
}

