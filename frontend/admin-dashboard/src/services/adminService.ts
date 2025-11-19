import api from './api';
import { 
  DashboardStats, 
  User, 
  University, 
  Certificate, 
  SystemHealth, 
  PaginatedResponse, 
  ApiResponse 
} from '../types';

export const adminService = {
  // Dashboard data
  async getDashboardStats(): Promise<DashboardStats> {
    // Mock data for development
    return {
      totalCertificates: 1247,
      totalUniversities: 23,
      totalUsers: 892,
      verificationsToday: 34,
      recentVerifications: [
        {
          id: '1',
          certificateId: 'CERT-2024-001',
          studentName: 'John Doe',
          universityName: 'Stanford University',
          verifiedAt: new Date().toISOString(),
          verifierType: 'employer'
        },
        {
          id: '2',
          certificateId: 'CERT-2024-002',
          studentName: 'Jane Smith',
          universityName: 'MIT',
          verifiedAt: new Date(Date.now() - 3600000).toISOString(),
          verifierType: 'student'
        }
      ],
      certificatesByMonth: [
        { month: 'Jan', certificates: 120, verifications: 89 },
        { month: 'Feb', certificates: 150, verifications: 112 },
        { month: 'Mar', certificates: 180, verifications: 156 },
        { month: 'Apr', certificates: 145, verifications: 134 },
        { month: 'May', certificates: 200, verifications: 178 },
        { month: 'Jun', certificates: 165, verifications: 145 }
      ],
      usersByRole: [
        { role: 'student', count: 650, percentage: 73 },
        { role: 'employer', count: 156, percentage: 17 },
        { role: 'university', count: 78, percentage: 9 },
        { role: 'admin', count: 8, percentage: 1 }
      ],
      systemHealth: {
        status: 'healthy',
        services: {
          auth: 'healthy',
          university: 'healthy',
          certificate: 'healthy',
          verification: 'healthy',
          file: 'healthy',
          notification: 'healthy'
        },
        uptime: '15 days, 4 hours',
        lastChecked: new Date().toISOString()
      }
    };
  },

  // User management
  async getUsers(page = 1, limit = 20): Promise<PaginatedResponse<User>> {
    // Mock user data for development
    const mockUsers: User[] = [
      {
        id: '1',
        email: 'admin@abc.com',
        fullName: 'Admin User',
        role: 'admin',
        isVerified: true,
        createdAt: '2024-01-15T08:30:00Z',
        updatedAt: '2024-11-18T10:15:00Z'
      },
      {
        id: '2',
        email: 'stanford@university.edu',
        fullName: 'Stanford University Admin',
        role: 'university',
        isVerified: true,
        createdAt: '2024-02-01T09:00:00Z',
        university: {
          id: 'uni1',
          name: 'Stanford University'
        }
      },
      {
        id: '3',
        email: 'john.doe@student.edu',
        fullName: 'John Doe',
        role: 'student',
        isVerified: true,
        createdAt: '2024-03-15T14:20:00Z'
      },
      {
        id: '4',
        email: 'hr@techcorp.com',
        fullName: 'Sarah Wilson',
        role: 'employer',
        isVerified: true,
        createdAt: '2024-04-10T11:45:00Z'
      },
      {
        id: '5',
        email: 'mit@university.edu',
        fullName: 'MIT Registration Office',
        role: 'university',
        isVerified: false,
        createdAt: '2024-05-20T16:30:00Z',
        university: {
          id: 'uni2',
          name: 'Massachusetts Institute of Technology'
        }
      },
      {
        id: '6',
        email: 'jane.smith@student.edu',
        fullName: 'Jane Smith',
        role: 'student',
        isVerified: true,
        createdAt: '2024-06-01T13:15:00Z'
      },
      {
        id: '7',
        email: 'recruiting@startupco.com',
        fullName: 'Mike Johnson',
        role: 'employer',
        isVerified: false,
        createdAt: '2024-07-12T09:30:00Z'
      },
      {
        id: '8',
        email: 'berkeley@university.edu',
        fullName: 'UC Berkeley Admin',
        role: 'university',
        isVerified: true,
        createdAt: '2024-08-05T12:00:00Z',
        university: {
          id: 'uni3',
          name: 'University of California, Berkeley'
        }
      }
    ];

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = mockUsers.slice(startIndex, endIndex);

    return {
      data: paginatedUsers,
      pagination: {
        page,
        limit,
        total: mockUsers.length,
        totalPages: Math.ceil(mockUsers.length / limit)
      }
    };
  },

  async getUserById(id: string): Promise<User> {
    // Mock implementation - find user by ID
    const users = await this.getUsers();
    const user = users.data.find(u => u.id === id);
    if (!user) throw new Error('User not found');
    return user;
  },

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    // Mock implementation - simulate update
    console.log('Updating user', id, 'with data', data);
    const user = await this.getUserById(id);
    return { ...user, ...data, updatedAt: new Date().toISOString() };
  },

  async deleteUser(id: string): Promise<void> {
    // Mock implementation - simulate deletion
    console.log('Deleting user', id);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
  },

  // University management
  async getUniversities(page = 1, limit = 20): Promise<PaginatedResponse<University>> {
    const response = await api.get<PaginatedResponse<University>>(`/universities?page=${page}&limit=${limit}`);
    return response.data;
  },

  async getUniversityById(id: string): Promise<University> {
    const response = await api.get<ApiResponse<University>>(`/universities/${id}`);
    return response.data.data;
  },

  async verifyUniversity(id: string): Promise<University> {
    const response = await api.post<ApiResponse<University>>(`/universities/${id}/verify`);
    return response.data.data;
  },

  async unverifyUniversity(id: string): Promise<University> {
    const response = await api.delete<ApiResponse<University>>(`/universities/${id}/verify`);
    return response.data.data;
  },

  async updateUniversity(id: string, data: Partial<University>): Promise<University> {
    const response = await api.put<ApiResponse<University>>(`/universities/${id}`, data);
    return response.data.data;
  },

  // Certificate management
  async getCertificates(page = 1, limit = 20, filters?: any): Promise<PaginatedResponse<Certificate>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });
    const response = await api.get<PaginatedResponse<Certificate>>(`/certificates?${params}`);
    return response.data;
  },

  async getCertificateById(id: string): Promise<Certificate> {
    const response = await api.get<ApiResponse<Certificate>>(`/certificates/${id}`);
    return response.data.data;
  },

  async revokeCertificate(id: string, reason: string): Promise<Certificate> {
    const response = await api.post<ApiResponse<Certificate>>(`/certificates/${id}/revoke`, { reason });
    return response.data.data;
  },

  // System health
  async getSystemHealth(): Promise<SystemHealth> {
    const response = await api.get<SystemHealth>('/health');
    return response.data;
  },

  async getMetrics(): Promise<string> {
    const response = await api.get<string>('/metrics');
    return response.data;
  },

  // Statistics and analytics
  async getVerificationStats(period: 'day' | 'week' | 'month' = 'month'): Promise<any> {
    const response = await api.get<ApiResponse<any>>(`/admin/stats/verifications?period=${period}`);
    return response.data.data;
  },

  async getCertificateStats(period: 'day' | 'week' | 'month' = 'month'): Promise<any> {
    const response = await api.get<ApiResponse<any>>(`/admin/stats/certificates?period=${period}`);
    return response.data.data;
  },

  async getUserStats(): Promise<any> {
    const response = await api.get<ApiResponse<any>>('/admin/stats/users');
    return response.data.data;
  },

  // Export data
  async exportUsers(format: 'csv' | 'xlsx' = 'csv'): Promise<Blob> {
    // Mock implementation - create a simple CSV
    const users = await this.getUsers(1, 1000); // Get all users
    const csvContent = [
      'ID,Name,Email,Role,Verified,Created',
      ...users.data.map(user => 
        `${user.id},${user.fullName},${user.email},${user.role},${user.isVerified},${user.createdAt}`
      )
    ].join('\n');
    
    return new Blob([csvContent], { type: 'text/csv' });
  },

  async exportCertificates(format: 'csv' | 'xlsx' = 'csv'): Promise<Blob> {
    // Mock implementation
    const csvContent = 'ID,Student,University,Course,Issue Date\nMock data for certificates export';
    return new Blob([csvContent], { type: 'text/csv' });
  },
};