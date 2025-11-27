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
      
      // Only allow student users
      if (userData.role !== 'student') {
        throw new Error('Access denied. Student account required.');
      }
      
      // Store auth data
      localStorage.setItem('student_token', userData.token);
      localStorage.setItem('student_user', JSON.stringify(userData));
      
      return userData;
    } catch (error: any) {
      // Handle specific error cases
      if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
        throw new Error('Cannot connect to auth service. Please ensure the auth service is running on http://localhost:8081');
      } else if (error.response?.status === 401) {
        throw new Error('Invalid email or password.');
      } else if (error.response?.status === 403) {
        // Check if it's a verification issue or access issue
        const message = error.response?.data?.message || '';
        if (message.toLowerCase().includes('not verified') || message.toLowerCase().includes('verification')) {
          throw new Error('Your account is pending verification by an administrator. Please wait for approval.');
        }
        throw new Error('Access denied. Student account required.');
      } else if (error.response?.data?.message) {
        // Check the backend message for verification status
        const backendMessage = error.response.data.message;
        if (backendMessage.toLowerCase().includes('not verified') || backendMessage.toLowerCase().includes('verification')) {
          throw new Error('Your account is pending verification by an administrator. Please wait for approval.');
        }
        throw new Error(backendMessage);
      } else {
        throw new Error(error.message || 'Login failed. Please try again.');
      }
    }
  },

  async signup(signupData: SignupRequest): Promise<ApiResponse<AuthUser>> {
    try {
      // Add student role to signup data
      const signupPayload = {
        ...signupData,
        role: 'STUDENT'
      };

      const response = await authApi.post<ApiResponse<AuthUser>>('/auth/register', signupPayload);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Registration failed');
      }
      
      // DO NOT store token for unverified users
      // User must verify account and login manually
      // This prevents auto-login to dashboard before verification
      
      return response.data;
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
      localStorage.removeItem('student_token');
      localStorage.removeItem('student_user');
    }
  },

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const response = await authApi.get<ApiResponse<AuthUser>>('/auth/me');
      
      if (!response.data.success) {
        throw new Error('Failed to get user info');
      }
      
      const userData = response.data.data!;
      
      if (userData.role !== 'student') {
        throw new Error('Access denied. Student account required.');
      }
      
      return userData;
    } catch (error) {
      localStorage.removeItem('student_token');
      localStorage.removeItem('student_user');
      return null;
    }
  },

  getStoredUser(): AuthUser | null {
    try {
      const storedUser = localStorage.getItem('student_user');
      if (!storedUser) return null;
      
      const userData = JSON.parse(storedUser);
      if (userData.role !== 'student') {
        localStorage.removeItem('student_token');
        localStorage.removeItem('student_user');
        return null;
      }
      
      return userData;
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    const token = localStorage.getItem('student_token');
    const user = this.getStoredUser();
    return !!(token && user && user.role === 'student');
  },
};