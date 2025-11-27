import axios from 'axios';
import { VerificationResponse, BulkVerificationRequest, BulkVerificationResponse } from '../types';

const VERIFICATION_API_URL = 'http://localhost:3004'; // Verification service port

export const VerificationService = {
  async verifyCertificate(certificateNumber: string): Promise<VerificationResponse> {
    try {
      console.log('Verifying certificate:', certificateNumber);
      const response = await axios.get(
        `${VERIFICATION_API_URL}/api/verify/${certificateNumber}`
      );
      
      console.log('Full verification response:', JSON.stringify(response.data, null, 2));
      
      // Backend returns { success, data: VerificationResult, message }
      // VerificationResult has { valid, certificate, university, ... }
      const backendData = response.data;
      
      if (backendData.success && backendData.data) {
        const result = backendData.data;
        console.log('Verification result:', {
          valid: result.valid,
          hasReason: !!result.reason,
          reason: result.reason,
          hasCertificate: !!result.certificate,
          certificateStatus: result.certificate?.status
        });
        
        // Normalize certificate data if present
        let certificate = result.certificate;
        if (certificate) {
          // Normalize status to uppercase for consistency
          certificate = {
            ...certificate,
            status: (certificate.status?.toUpperCase() || 'ACTIVE') as 'ACTIVE' | 'REVOKED'
          };
        }
        
        return {
          valid: result.valid === true,
          certificate: certificate,
          message: result.valid ? backendData.message : (result.reason || backendData.message),
        };
      }
      
      console.log('Backend response missing data:', backendData);
      return {
        valid: false,
        message: backendData.message || 'Verification failed',
      };
    } catch (error: any) {
      console.error('Verification error:', error);
      console.error('Error response:', error.response?.data);
      if (error.response?.status === 404) {
        return {
          valid: false,
          message: 'Certificate not found',
        };
      }
      throw new Error(error.response?.data?.message || 'Failed to verify certificate');
    }
  },

  async bulkVerifyCertificates(certificateNumbers: string[]): Promise<BulkVerificationResponse> {
    try {
      const payload: BulkVerificationRequest = { certificateNumbers };
      const response = await axios.post<BulkVerificationResponse>(
        `${VERIFICATION_API_URL}/api/verify/bulk`,
        payload
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to verify certificates');
    }
  },

  getVerificationUrl(certificateNumber: string): string {
    return `${VERIFICATION_API_URL}/api/verify/${certificateNumber}`;
  },
};

