import HttpClient from '../utils/httpClient';
import { config } from '../config/index';
import logger from '../utils/logger';

const universityClient = new HttpClient(config.services.university);

export interface University {
  id: string;
  name: string;
  email: string;
  address?: string;
  phone?: string;
  publicKey: string;
  verified: boolean;
  verificationCode?: string;
  createdAt: string;
  updatedAt: string;
}

export class UniversityService {
  /**
   * Fetch university details by ID
   */
  static async getUniversityById(id: string): Promise<University | null> {
    try {
      const response = await universityClient.get<{ success: boolean; data: University }>(
        `/api/universities/${id}`
      );

      if (response.success && response.data) {
        return response.data;
      }

      return null;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      logger.error('Error fetching university:', error);
      throw new Error('Failed to fetch university');
    }
  }

  /**
   * Fetch university public key for signature verification
   */
  static async getPublicKey(universityId: string): Promise<string | null> {
    try {
      const response = await universityClient.get<{
        success: boolean;
        data: { publicKey: string; universityName: string }
      }>(`/api/universities/${universityId}/public-key`);

      if (response.success && response.data) {
        return response.data.publicKey;
      }

      return null;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      logger.error('Error fetching public key:', error);
      throw new Error('Failed to fetch public key');
    }
  }

  /**
   * Check if university is verified
   */
  static async isUniversityVerified(universityId: string): Promise<boolean> {
    try {
      const university = await this.getUniversityById(universityId);
      return university?.verified || false;
    } catch (error) {
      logger.error('Error checking university verification:', error);
      return false;
    }
  }
}
