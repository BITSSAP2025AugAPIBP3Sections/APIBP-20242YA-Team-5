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
  issueDate: string;
  completionDate: string;
  certificateHash: string;
  digitalSignature: string;
  verificationCode: string;
  pdfPath?: string;
  status: 'ACTIVE' | 'REVOKED';
  revocationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CertificateIssueRequest {
  studentId: string;
  universityId: string;
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

export interface FileUploadResponse {
  fileName: string;
  filePath: string;
  fileSize: number;
  uploadTime: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: string;
}