// Export all services
export { default as CertificateService } from './certificateService';
export { authService } from './authService';
export { default as authApi } from './api';
export { VerificationService } from './verificationService';
export type { VerificationResult, VerificationResponse, BulkVerificationResponse } from './verificationService';

// You can add other service exports here as the project grows