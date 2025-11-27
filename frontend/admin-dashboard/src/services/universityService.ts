import axios from 'axios';

const UNIVERSITY_API_URL = 'http://localhost:3002/api/universities';

export interface University {
  universityId: string;
  universityName: string;
  email: string;
  address?: string;
  phone?: string;
  verified: boolean;
  publicKey: string;
  createdAt: string;
  updatedAt?: string;
}

export const universityService = {
  // Get all universities
  getAllUniversities: async (verified?: boolean): Promise<University[]> => {
    try {
      const params = verified !== undefined ? { verified } : {};
      const response = await axios.get(UNIVERSITY_API_URL, { params });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch universities');
    }
  },

  // Get university by ID
  getUniversityById: async (id: string): Promise<University> => {
    try {
      const response = await axios.get(`${UNIVERSITY_API_URL}/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch university');
    }
  },

  // Verify university
  verifyUniversity: async (id: string): Promise<any> => {
    try {
      const response = await axios.post(`${UNIVERSITY_API_URL}/${id}/verify`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to verify university');
    }
  },

  // Update university
  updateUniversity: async (id: string, data: Partial<University>): Promise<University> => {
    try {
      const response = await axios.put(`${UNIVERSITY_API_URL}/${id}`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update university');
    }
  },

  // Delete university
  deleteUniversity: async (id: string): Promise<void> => {
    try {
      await axios.delete(`${UNIVERSITY_API_URL}/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete university');
    }
  },
};
