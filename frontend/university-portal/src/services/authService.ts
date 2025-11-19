import { authApi } from './api';
import { LoginRequest, SignupRequest, AuthUser, ApiResponse } from '../types';

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthUser> {
    try {
      const response = await authApi.post<ApiResponse<AuthUser>>('/auth/login', credentials);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Login failed');
      }
      
      const userData = response.data.data!;
      
      // Only allow university users
      if (userData.role !== 'university') {
        throw new Error('Access denied. University account required.');
      }
      
      // Store auth data
      localStorage.setItem('university_token', userData.token);
      localStorage.setItem('university_user', JSON.stringify(userData));
      
      return userData;
    } catch (error: any) {
      // Handle specific error cases
      if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
        throw new Error('Cannot connect to auth service. Please ensure the auth service is running on http://localhost:8081');
      } else if (error.response?.status === 401) {
        throw new Error('Invalid email or password.');
      } else if (error.response?.status === 403) {
        throw new Error('Access denied. University account required.');
      } else {
        throw new Error(error.message || 'Login failed. Please try again.');
      }
    }
  },

  async signup(signupData: SignupRequest): Promise<AuthUser> {
    try {
      // Add university role to signup data
      const signupPayload = {
        ...signupData,
        role: 'UNIVERSITY'
      };

      const response = await authApi.post<ApiResponse<AuthUser>>('/auth/register', signupPayload);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Registration failed');
      }
      
      const userData = response.data.data!;
      
      // Store auth data
      localStorage.setItem('university_token', userData.token);
      localStorage.setItem('university_user', JSON.stringify(userData));
      
      return userData;
    } catch (error: any) {
      // Handle specific error cases
      if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
        throw new Error('Cannot connect to auth service. Please ensure the auth service is running on http://localhost:8081');
      } else if (error.response?.status === 400) {
        throw new Error(error.response.data.message || 'Invalid registration data.');
      } else if (error.response?.status === 403) {
        throw new Error('Registration forbidden. Please check your data or try again later.');
      } else if (error.response?.status === 409) {
        throw new Error('An account with this email already exists.');
      } else {
        throw new Error(error.message || 'Registration failed. Please try again.');
      }
    }
  },

  async logout(): Promise<void> {
    try {
      await authApi.post('/auth/logout');
    } catch (error) {
      // Continue with logout even if API call fails
    } finally {
      localStorage.removeItem('university_token');
      localStorage.removeItem('university_user');
    }
  },

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const response = await authApi.get<ApiResponse<AuthUser>>('/auth/me');
      
      if (!response.data.success) {
        throw new Error('Failed to get user info');
      }
      
      const userData = response.data.data!;
      
      if (userData.role !== 'university') {
        throw new Error('Access denied. University account required.');
      }
      
      return userData;
    } catch (error) {
      localStorage.removeItem('university_token');
      localStorage.removeItem('university_user');
      return null;
    }
  },

  getStoredUser(): AuthUser | null {
    try {
      const storedUser = localStorage.getItem('university_user');
      if (!storedUser) return null;
      
      const userData = JSON.parse(storedUser);
      if (userData.role !== 'university') {
        localStorage.removeItem('university_token');
        localStorage.removeItem('university_user');
        return null;
      }
      
      return userData;
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    const token = localStorage.getItem('university_token');
    const user = this.getStoredUser();
    return !!(token && user && user.role === 'university');
  },
};