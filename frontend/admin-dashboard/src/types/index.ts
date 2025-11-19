export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'UNIVERSITY' | 'STUDENT' | 'EMPLOYER' | 'ADMIN';
  isVerified: boolean;
  isActive?: boolean;
  phone?: string;
  universityId?: string;
  studentId?: string;
  employeeId?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt?: string;
  university?: {
    id: string;
    name: string;
  };
}

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

export interface Certificate {
  id: string;
  studentName: string;
  studentId: string;
  course: string;
  grade: string;
  degreeType: string;
  issueDate: string;
  graduationDate: string;
  university: {
    id: string;
    name: string;
  };
  isRevoked: boolean;
  verificationCode: string;
  digitalSignature: string;
  createdAt: string;
}

export interface DashboardStats {
  totalCertificates: number;
  totalUniversities: number;
  totalUsers: number;
  verificationsToday: number;
  recentVerifications: RecentVerification[];
  certificatesByMonth: MonthlyData[];
  usersByRole: UserRoleData[];
  systemHealth: SystemHealth;
}

export interface RecentVerification {
  id: string;
  certificateId: string;
  studentName: string;
  universityName: string;
  verifiedAt: string;
  verifierType: 'employer' | 'student';
}

export interface MonthlyData {
  month: string;
  certificates: number;
  verifications: number;
}

export interface UserRoleData {
  role: string;
  count: number;
  percentage: number;
}

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'down';
  services: {
    auth: 'healthy' | 'unhealthy';
    university: 'healthy' | 'unhealthy';
    certificate: 'healthy' | 'unhealthy';
    verification: 'healthy' | 'unhealthy';
    file: 'healthy' | 'unhealthy';
    notification: 'healthy' | 'unhealthy';
  };
  uptime: string;
  lastChecked: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: string;
  token: string;
}