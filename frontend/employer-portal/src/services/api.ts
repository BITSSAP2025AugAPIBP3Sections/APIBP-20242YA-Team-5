import axios from 'axios';

// Get token for requests
const getToken = () => localStorage.getItem('employer_token');

// Create axios instance for auth service
const authApi = axios.create({
  baseURL: 'http://localhost:8081', // Auth service port
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
authApi.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear auth data
      localStorage.removeItem('employer_token');
      localStorage.removeItem('employer_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export { authApi };
export default authApi;
