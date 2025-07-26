import { apiClient } from './api';
import type { LoginCredentials, SignupData, User } from '../types/auth';

export const authService = {
  login: async (credentials: LoginCredentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.delete('/auth/logout');
    return response.data;
  },

  signup: async (userData: SignupData) => {
    const response = await apiClient.post('/auth/signup', userData);
    return response.data;
  },

  validateToken: async (): Promise<User> => {
    const response = await apiClient.get('/auth/me');
    return response.data.user;
  }
};