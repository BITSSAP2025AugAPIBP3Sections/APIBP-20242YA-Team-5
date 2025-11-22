// Export all types
export * from './certificate';

// Authentication types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  fullName: string;
  universityUid?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: string;
  token: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: AuthUser;
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

// Error types
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

// You can add other type exports here as the project grows