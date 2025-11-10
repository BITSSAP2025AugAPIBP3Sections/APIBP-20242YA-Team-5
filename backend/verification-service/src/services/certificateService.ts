import HttpClient from '../utils/httpClient';
import { config } from '../config/index';
import logger from '../utils/logger';

const certificateClient = new HttpClient(config.services.certificate);

export interface Certificate {
  id: string;
  certificateNumber: string;
  studentId: string;
  universityId: string;
  studentName: string;
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

export class CertificateService {
  /**
   * Fetch certificate by ID from Certificate Service
   */
  static async getCertificateById(id: string): Promise<Certificate | null> {
    try {
      const response = await certificateClient.get<{ success: boolean; data: Certificate }>(
        `/api/certificates/${id}`
      );

      if (response.success && response.data) {
        return response.data;
      }

      return null;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      logger.error('Error fetching certificate by ID:', error);
      throw new Error('Failed to fetch certificate');
    }
  }

  /**
   * Fetch certificate by verification code from Certificate Service
   */
  static async getCertificateByCode(code: string): Promise<Certificate | null> {
    try {
      const response = await certificateClient.get<{ success: boolean; data: Certificate }>(
        `/api/certificates/code/${code}`
      );

      if (response.success && response.data) {
        return response.data;
      }

      return null;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      logger.error('Error fetching certificate by code:', error);
      throw new Error('Failed to fetch certificate');
    }
  }

  /**
   * Check if certificate is valid (active status)
   */
  static isCertificateValid(certificate: Certificate): { valid: boolean; reason?: string } {
    if (certificate.status === 'revoked') {
      return {
        valid: false,
        reason: `Certificate has been revoked. Reason: ${certificate.revocationReason || 'Not specified'}`,
      };
    }

    if (certificate.status === 'suspended') {
      return {
        valid: false,
        reason: 'Certificate is currently suspended',
      };
    }

    if (certificate.status !== 'active') {
      return {
        valid: false,
        reason: 'Certificate is not in active status',
      };
    }

    return { valid: true };
  }
}
