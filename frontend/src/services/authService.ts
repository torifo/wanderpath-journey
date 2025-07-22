import { apiClient } from './api';
import type { LoginCredentials, SignupData, User } from '../types/auth';

export const authService = {
  login: async (credentials: LoginCredentials) => {
    const response = await apiClient.post('/api/v1/auth/login', credentials);
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.delete('/api/v1/auth/logout');
    return response.data;
  },

  signup: async (userData: SignupData) => {
    const response = await apiClient.post('/api/v1/auth/signup', userData);
    return response.data;
  },

  validateToken: async (): Promise<User> => {
    const response = await apiClient.get('/api/v1/auth/me');
    return response.data.user;
  }
};