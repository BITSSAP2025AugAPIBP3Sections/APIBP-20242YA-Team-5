import axios, { AxiosResponse } from 'axios';

// Verification service runs on port 3004
const VERIFICATION_API_BASE_URL = process.env.REACT_APP_VERIFICATION_API_BASE_URL || 'http://localhost:3004';

// Verification Types
export interface VerificationRequest {
  certificateNumber: string;
}

export interface VerificationResult {
  valid: boolean;
  certificate?: {
    certificateId: string;
    certificateNumber: string;
    studentName: string;
    studentEmail?: string;
    courseName: string;
    specialization?: string;
    grade: string;
    cgpa?: number;
    issueDate: string;
    completionDate: string;
    status: string;
    revocationReason?: string;
  };
  university?: {
    id: string;
    name: string;
    verified: boolean;
  };
  verificationMethod: string;
  timestamp: string | number[]; // Can be ISO string or array [year, month, day, hour, minute, second, nano]
  reason: string;
}

export interface VerificationResponse {
  success: boolean;
  data: VerificationResult;
  message: string;
}

export interface BulkVerificationRequest {
  certificates: VerificationRequest[];
}

export interface BulkVerificationResponse {
  success: boolean;
  data: {
    totalRequested: number;
    validCertificates: number;
    invalidCertificates: number;
    results: Array<{
      certificateNumber: string;
      valid: boolean;
      reason: string;
      studentName?: string;
      courseName?: string;
      issueDate?: string;
    }>;
  };
  message: string;
}

// Create verification API instance
const verificationApi = axios.create({
  baseURL: `${VERIFICATION_API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 seconds timeout for verification
});

// Handle errors
verificationApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Verification API Error:', error);
    
    // Handle network errors
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      error.message = 'Unable to connect to verification service. Please ensure the verification service is running on http://localhost:3004';
    } else if (error.code === 'ECONNABORTED') {
      error.message = 'Verification request timeout. Please try again.';
    } else if (error.response?.status === 404) {
      error.message = 'Certificate not found or verification endpoint unavailable';
    } else if (error.response?.status === 500) {
      console.error('Verification Service Error:', error.response.data);
      error.message = `Verification failed: ${error.response.data?.message || 'Internal server error'}`;
    }
    return Promise.reject(error);
  }
);

export class VerificationService {
  /**
   * Verify a certificate by certificate number (POST method)
   */
  static async verifyCertificate(certificateNumber: string): Promise<VerificationResult> {
    try {
      console.log('Verifying certificate:', certificateNumber);
      const response: AxiosResponse<VerificationResponse> = await verificationApi.post('/verify', {
        certificateNumber
      });
      console.log('Verification result:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('Error verifying certificate:', error);
      throw error;
    }
  }

  /**
   * Quick verify by certificate number (GET method)
   */
  static async quickVerify(certificateNumber: string): Promise<VerificationResult> {
    try {
      console.log('Quick verifying certificate:', certificateNumber);
      const response: AxiosResponse<VerificationResponse> = await verificationApi.get(`/verify/${certificateNumber}`);
      console.log('Quick verification result:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('Error in quick verification:', error);
      throw error;
    }
  }

  /**
   * Bulk verify multiple certificates
   */
  static async bulkVerify(certificateNumbers: string[]): Promise<BulkVerificationResponse['data']> {
    try {
      console.log('Bulk verifying certificates:', certificateNumbers);
      const request: BulkVerificationRequest = {
        certificates: certificateNumbers.map(num => ({ certificateNumber: num }))
      };
      const response: AxiosResponse<BulkVerificationResponse> = await verificationApi.post('/verify/bulk', request);
      console.log('Bulk verification result:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('Error in bulk verification:', error);
      throw error;
    }
  }

  /**
   * Check verification service health
   */
  static async checkHealth(): Promise<boolean> {
    try {
      const response = await verificationApi.get('/health');
      return response.status === 200;
    } catch (error) {
      console.error('Verification service health check failed:', error);
      return false;
    }
  }
}
