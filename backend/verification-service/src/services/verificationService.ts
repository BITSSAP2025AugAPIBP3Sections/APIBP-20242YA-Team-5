import { CertificateService, Certificate } from './certificateService';
import { UniversityService, University } from './universityService';
import { VerificationLogModel, VerificationLogCreate } from '../models/VerificationLog';
import { verifyDigitalSignature, validateCertificateHash } from '../utils/crypto';
import logger from '../utils/logger';

export interface VerificationResult {
  valid: boolean;
  certificate?: Certificate;
  university?: University;
  verificationMethod: 'id' | 'code' | 'signature';
  timestamp: Date;
  reason?: string;
}

export interface BulkVerificationItem {
  certificateId?: string;
  verificationCode?: string;
}

export interface BulkVerificationResult {
  certificateId?: string;
  verificationCode?: string;
  valid: boolean;
  reason?: string;
  certificate?: Certificate;
}

export class VerificationService {
  /**
   * Verify certificate by ID
   */
  static async verifyById(
    certificateId: string,
    verifierIp?: string
  ): Promise<VerificationResult> {
    const startTime = Date.now();

    try {
      // Fetch certificate
      const certificate = await CertificateService.getCertificateById(certificateId);

      if (!certificate) {
        await this.logVerification({
          certificateId,
          verificationMethod: 'id',
          verifierIp,
          result: 'invalid',
          errorMessage: 'Certificate not found',
          responseTime: Date.now() - startTime,
        });

        return {
          valid: false,
          verificationMethod: 'id',
          timestamp: new Date(),
          reason: 'Certificate not found',
        };
      }

      // Check certificate status
      const statusCheck = CertificateService.isCertificateValid(certificate);
      if (!statusCheck.valid) {
        await this.logVerification({
          certificateId: certificate.id,
          verificationMethod: 'id',
          verifierIp,
          result: 'invalid',
          errorMessage: statusCheck.reason,
          responseTime: Date.now() - startTime,
        });

        return {
          valid: false,
          certificate,
          verificationMethod: 'id',
          timestamp: new Date(),
          reason: statusCheck.reason,
        };
      }

      // Fetch university details
      const university = await UniversityService.getUniversityById(certificate.universityId);

      if (!university) {
        await this.logVerification({
          certificateId: certificate.id,
          verificationMethod: 'id',
          verifierIp,
          result: 'error',
          errorMessage: 'University not found',
          responseTime: Date.now() - startTime,
        });

        return {
          valid: false,
          certificate,
          verificationMethod: 'id',
          timestamp: new Date(),
          reason: 'University not found',
        };
      }

      // Verify digital signature
      const signatureValid = verifyDigitalSignature(
        certificate.certificateHash,
        certificate.digitalSignature,
        university.publicKey
      );

      if (!signatureValid) {
        await this.logVerification({
          certificateId: certificate.id,
          verificationMethod: 'id',
          verifierIp,
          result: 'invalid',
          errorMessage: 'Digital signature verification failed',
          responseTime: Date.now() - startTime,
        });

        return {
          valid: false,
          certificate,
          university,
          verificationMethod: 'id',
          timestamp: new Date(),
          reason: 'Digital signature verification failed',
        };
      }

      // Log successful verification
      await this.logVerification({
        certificateId: certificate.id,
        verificationMethod: 'id',
        verifierIp,
        result: 'valid',
        responseTime: Date.now() - startTime,
      });

      return {
        valid: true,
        certificate,
        university,
        verificationMethod: 'id',
        timestamp: new Date(),
      };

    } catch (error) {
      logger.error('Verification by ID error:', error);

      await this.logVerification({
        certificateId,
        verificationMethod: 'id',
        verifierIp,
        result: 'error',
        errorMessage: 'Internal verification error',
        responseTime: Date.now() - startTime,
      });

      throw new Error('Verification failed due to internal error');
    }
  }

  /**
   * Verify certificate by verification code
   */
  static async verifyByCode(
    verificationCode: string,
    verifierIp?: string
  ): Promise<VerificationResult> {
    const startTime = Date.now();

    try {
      // Fetch certificate by code
      const certificate = await CertificateService.getCertificateByCode(verificationCode);

      if (!certificate) {
        await this.logVerification({
          certificateId: 'unknown',
          verificationMethod: 'code',
          verifierIp,
          result: 'invalid',
          errorMessage: 'Certificate not found',
          responseTime: Date.now() - startTime,
        });

        return {
          valid: false,
          verificationMethod: 'code',
          timestamp: new Date(),
          reason: 'Certificate not found with provided verification code',
        };
      }

      // Use verifyById for the rest of the verification
      return await this.verifyById(certificate.id, verifierIp);

    } catch (error) {
      logger.error('Verification by code error:', error);
      throw new Error('Verification failed due to internal error');
    }
  }

  /**
   * Verify digital signature directly
   */
  static async verifySignature(
    certificateHash: string,
    digitalSignature: string,
    universityId: string,
    verifierIp?: string
  ): Promise<{ valid: boolean; universityName?: string; reason?: string }> {
    const startTime = Date.now();

    try {
      // Fetch university public key
      const publicKey = await UniversityService.getPublicKey(universityId);

      if (!publicKey) {
        return {
          valid: false,
          reason: 'University public key not found',
        };
      }

      // Get university details
      const university = await UniversityService.getUniversityById(universityId);

      // Verify signature
      const signatureValid = verifyDigitalSignature(
        certificateHash,
        digitalSignature,
        publicKey
      );

      await this.logVerification({
        certificateId: 'signature-verification',
        verificationMethod: 'signature',
        verifierIp,
        result: signatureValid ? 'valid' : 'invalid',
        errorMessage: signatureValid ? undefined : 'Signature verification failed',
        responseTime: Date.now() - startTime,
      });
            return {
        valid: signatureValid,
        universityName: university?.name,
        reason: signatureValid ? undefined : 'Digital signature verification failed',
      };

    } catch (error) {
      logger.error('Signature verification error:', error);
      throw new Error('Signature verification failed due to internal error');
    }
  }

  /**
   * Bulk verification
   */
  static async verifyBulk(
    items: BulkVerificationItem[],
    verifierIp?: string
  ): Promise<BulkVerificationResult[]> {
    const results: BulkVerificationResult[] = [];

    for (const item of items) {
      try {
        let verificationResult: VerificationResult;

        if (item.certificateId) {
          verificationResult = await this.verifyById(item.certificateId, verifierIp);
          results.push({
            certificateId: item.certificateId,
            valid: verificationResult.valid,
            reason: verificationResult.reason,
            certificate: verificationResult.certificate,
          });
        } else if (item.verificationCode) {
          verificationResult = await this.verifyByCode(item.verificationCode, verifierIp);
          results.push({
            verificationCode: item.verificationCode,
            valid: verificationResult.valid,
            reason: verificationResult.reason,
            certificate: verificationResult.certificate,
          });
        } else {
          results.push({
            valid: false,
            reason: 'Either certificateId or verificationCode must be provided',
          });
        }
      } catch (error) {
        logger.error('Bulk verification item error:', error);
        results.push({
          certificateId: item.certificateId,
          verificationCode: item.verificationCode,
          valid: false,
          reason: 'Verification failed due to internal error',
        });
      }
    }

    return results;
  }

  /**
   * Log verification attempt
   */
  private static async logVerification(data: VerificationLogCreate): Promise<void> {
    try {
      await VerificationLogModel.create(data);
    } catch (error) {
      logger.error('Failed to log verification:', error);
      // Don't throw error, just log it
    }
  }

  /**
   * Get verification statistics
   */
  static async getStatistics(days: number = 30) {
    try {
      return await VerificationLogModel.getStatistics(days);
    } catch (error) {
      logger.error('Error fetching statistics:', error);
      throw new Error('Failed to fetch verification statistics');
    }
  }

  /**
   * Get verification history for a certificate
   */
  static async getVerificationHistory(certificateId: string, limit: number = 10) {
    try {
      return await VerificationLogModel.findByCertificateId(certificateId, limit);
    } catch (error) {
      logger.error('Error fetching verification history:', error);
      throw new Error('Failed to fetch verification history');
    }
  }
}
