import api from './api';
import { LoginRequest, AuthUser, ApiResponse } from '../types';

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthUser> {
    try {
      const response = await api.post<ApiResponse<AuthUser>>('/auth/login', credentials);
      const userData = response.data.data;
      
      // Only allow admin users
      if (userData.role !== 'admin') {
        throw new Error('Access denied. Admin privileges required.');
      }
      
      // Store auth data
      localStorage.setItem('admin_token', userData.token);
      localStorage.setItem('admin_user', JSON.stringify(userData));
      
      return userData;
    } catch (error: any) {
      // Handle specific error cases
      if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
        throw new Error('Cannot connect to server. Please ensure the backend services are running on http://localhost:3000');
      } else if (error.response?.status === 401) {
        throw new Error('Invalid email or password.');
      } else if (error.response?.status === 403) {
        throw new Error('Access denied. Admin privileges required.');
      } else {
        throw new Error(error.message || 'Login failed. Please try again.');
      }
    }
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Continue with logout even if API call fails
    } finally {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
    }
  },

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const response = await api.get<ApiResponse<AuthUser>>('/auth/me');
      const userData = response.data.data;
      
      if (userData.role !== 'admin') {
        throw new Error('Access denied. Admin privileges required.');
      }
      
      return userData;
    } catch (error) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      return null;
    }
  },

  getStoredUser(): AuthUser | null {
    try {
      const storedUser = localStorage.getItem('admin_user');
      if (!storedUser) return null;
      
      const userData = JSON.parse(storedUser);
      if (userData.role !== 'admin') {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        return null;
      }
      
      return userData;
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    const token = localStorage.getItem('admin_token');
    const user = this.getStoredUser();
    return !!(token && user && user.role === 'admin');
  },
};