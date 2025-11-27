import { authApi } from './api';
import { LoginRequest, SignupRequest, AuthUser, ApiResponse } from '../types';

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthUser> {
    try {
      console.log('Attempting login with credentials:', { email: credentials.email });
      const response = await authApi.post<ApiResponse<AuthUser>>('/api/auth/login', credentials);
      
      console.log('Login response:', response.data);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Login failed');
      }
      
      const userData = response.data.data!;
      
      console.log('User data received:', { ...userData, token: '***' });
      console.log('User role:', userData.role);
      
      // Only allow employer users
      if (userData.role !== 'employer') {
        console.error('Role mismatch: expected "employer", got', userData.role);
        throw new Error('Access denied. Employer account required.');
      }
      
      // Store auth data
      localStorage.setItem('employer_token', userData.token);
      localStorage.setItem('employer_user', JSON.stringify(userData));
      
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
        throw new Error('Access denied. Employer account required.');
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
      // Add employer role to signup data
      const signupPayload = {
        fullName: signupData.fullName,
        email: signupData.email,
        password: signupData.password,
        role: 'EMPLOYER'
      };

      console.log('Sending signup request with payload:', signupPayload);

      const response = await authApi.post<ApiResponse<AuthUser>>('/api/auth/register', signupPayload);
      
      console.log('Signup response:', response.data);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Registration failed');
      }
      
      // DO NOT store token for unverified users
      // User must verify account and login manually
      // This prevents auto-login to dashboard before verification
      
      return response.data;
    } catch (error: any) {
      console.error('Signup error:', error);
      console.error('Error response:', error.response);
      
      // Handle specific error cases
      if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
        throw new Error('Cannot connect to auth service. Please ensure the auth service is running on http://localhost:8081');
      } else if (error.response?.status === 400) {
        throw new Error(error.response.data.message || 'Invalid registration data.');
      } else if (error.response?.status === 403) {
        throw new Error('Registration forbidden. Please check your data or try again later.');
      } else if (error.response?.status === 409) {
        throw new Error('An account with this email already exists.');
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(error.message || 'Registration failed. Please try again.');
      }
    }
  },

  async logout(): Promise<void> {
    try {
      await authApi.post('/api/auth/logout');
    } catch (error) {
      // Continue with logout even if API call fails
    } finally {
      localStorage.removeItem('employer_token');
      localStorage.removeItem('employer_user');
    }
  },

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const response = await authApi.get<ApiResponse<AuthUser>>('/api/auth/me');
      
      if (!response.data.success) {
        throw new Error('Failed to get user info');
      }
      
      const userData = response.data.data!;
      
      if (userData.role !== 'employer') {
        throw new Error('Access denied. Employer account required.');
      }
      
      return userData;
    } catch (error) {
      localStorage.removeItem('employer_token');
      localStorage.removeItem('employer_user');
      return null;
    }
  },

  getStoredUser(): AuthUser | null {
    try {
      const storedUser = localStorage.getItem('employer_user');
      if (!storedUser) return null;
      
      const userData = JSON.parse(storedUser);
      if (userData.role !== 'employer') {
        localStorage.removeItem('employer_token');
        localStorage.removeItem('employer_user');
        return null;
      }
      
      return userData;
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    const token = localStorage.getItem('employer_token');
    const user = this.getStoredUser();
    return !!(token && user && user.role === 'employer');
  },
};
