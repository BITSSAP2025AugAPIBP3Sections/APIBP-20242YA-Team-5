import axios, { AxiosResponse } from 'axios';
import { Certificate, CertificateIssueRequest, CertificateUpdateRequest, CertificateRevocationRequest, FileUploadResponse } from '../types';

// Create certificate service API instance
const CERTIFICATE_API_BASE_URL = process.env.REACT_APP_CERTIFICATE_API_BASE_URL || 'http://localhost:3003';

const certificateApi = axios.create({
  baseURL: `${CERTIFICATE_API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Add auth token to requests
certificateApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('university_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle auth errors
certificateApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Certificate API Error:', error);
    
    // Handle network errors
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      error.message = 'Unable to connect to certificate service. Please ensure the certificate service is running on http://localhost:3003';
    } else if (error.code === 'ECONNABORTED') {
      error.message = 'Request timeout. Please try again.';
    } else if (error.response?.status === 401) {
      localStorage.removeItem('university_token');
      localStorage.removeItem('university_user');
      window.location.href = '/login';
    } else if (error.response?.status === 500) {
      console.error('Server Error Details:', error.response.data);
      error.message = `Server Error: ${error.response.data?.message || error.response.data?.error || 'Internal server error occurred'}`;
    } else if (error.response?.status === 400) {
      console.error('Validation Error Details:', error.response.data);
      if (error.response.data?.errors) {
        const validationErrors = Object.entries(error.response.data.errors)
          .map(([field, message]) => `${field}: ${message}`)
          .join(', ');
        error.message = `Validation Error: ${validationErrors}`;
      } else {
        error.message = `Bad Request: ${error.response.data?.message || 'Invalid request data'}`;
      }
    }
    return Promise.reject(error);
  }
);

export class CertificateService {
  /**
   * Get all certificates for the university
   */
  static async getCertificates(status?: string): Promise<Certificate[]> {
    try {
      const url = status ? `/certificates?status=${status}` : '/certificates';
      const response: AxiosResponse<Certificate[]> = await certificateApi.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching certificates:', error);
      throw error;
    }
  }

  /**
   * Get a specific certificate by ID
   */
  static async getCertificateById(id: string): Promise<Certificate> {
    try {
      const response: AxiosResponse<Certificate> = await certificateApi.get(`/certificates/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching certificate:', error);
      throw error;
    }
  }

  /**
   * Issue a new certificate
   */
  static async issueCertificate(request: CertificateIssueRequest): Promise<Certificate> {
    try {
      console.log('Issuing certificate with request:', request);
      const response: AxiosResponse<Certificate> = await certificateApi.post('/certificates', request);
      console.log('Certificate issued successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error issuing certificate:', error);
      throw error;
    }
  }

  /**
   * Update an existing certificate
   */
  static async updateCertificate(id: string, request: CertificateUpdateRequest): Promise<Certificate> {
    try {
      const response: AxiosResponse<Certificate> = await certificateApi.put(`/certificates/${id}`, request);
      return response.data;
    } catch (error) {
      console.error('Error updating certificate:', error);
      throw error;
    }
  }

  /**
   * Revoke a certificate
   */
  static async revokeCertificate(request: CertificateRevocationRequest): Promise<string> {
    try {
      console.log('CertificateService.revokeCertificate called with:', request);
      const response: AxiosResponse<string> = await certificateApi.post('/certificates/revoke', request);
      console.log('Revoke response:', response);
      return response.data;
    } catch (error: any) {
      console.error('Error revoking certificate in service:', error);
      console.error('Error details:', error.response?.data);
      throw error;
    }
  }

  /**
   * Download certificate PDF
   */
  static async downloadCertificatePdf(certificateId: string): Promise<Blob> {
    try {
      const response = await certificateApi.get(`/certificates/${certificateId}/pdf`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Error downloading certificate PDF:', error);
      throw error;
    }
  }

  /**
   * Upload a file for certificate template or signature
   */
  static async uploadFile(file: File, type: string): Promise<FileUploadResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response: AxiosResponse<FileUploadResponse> = await certificateApi.post('/certificates/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  /**
   * Batch issue certificates
   */
  static async batchIssueCertificates(certificates: CertificateIssueRequest[]): Promise<any> {
    try {
      const response = await certificateApi.post('/certificates/batch-issue', {
        'static/certificates': certificates
      });
      return response.data;
    } catch (error) {
      console.error('Error batch issuing certificates:', error);
      throw error;
    }
  }

  /**
   * Get university dashboard statistics
   */
  static async getDashboardStats(): Promise<any> {
    try {
      // For now, we'll use the certificates endpoint to calculate stats
      // In the future, the backend could provide a dedicated dashboard endpoint
      const certificates = await this.getCertificates();
      
      const totalCertificatesIssued = certificates.length;
      const activeCertificates = certificates.filter(cert => cert.status === 'ACTIVE').length;
      const revokedCertificates = certificates.filter(cert => cert.status === 'REVOKED').length;
      
      // Get recent certificates (last 5)
      const recentCertificates = certificates
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

      return {
        totalCertificatesIssued,
        activeCertificates,
        revokedCertificates,
        recentCertificates,
        totalStudents: new Set(certificates.map(cert => cert.studentId)).size, // Unique students
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }
}

export default CertificateService;