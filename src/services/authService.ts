/**
 * Auth Service — API calls for authentication
 *
 * Handles login, register, token refresh, and profile endpoints.
 * All responses are typed — NO `any`.
 */

import type { IAuthResponse, ILoginCredentials, IRegisterPayload, IUser } from '@/src/types';
import { apiClient } from './apiClient';

export const authService = {
  login: async (credentials: ILoginCredentials): Promise<IAuthResponse> => {
    const { data } = await apiClient.post<IAuthResponse>('/auth/login', credentials);
    return data;
  },

  register: async (payload: IRegisterPayload): Promise<IAuthResponse> => {
    const { data } = await apiClient.post<IAuthResponse>('/auth/register', payload);
    return data;
  },

  refreshToken: async (refreshToken: string): Promise<{ token: string }> => {
    const { data } = await apiClient.post<{ token: string }>('/auth/refresh', { refreshToken });
    return data;
  },

  getProfile: async (): Promise<IUser> => {
    const { data } = await apiClient.get<IUser>('/auth/profile');
    return data;
  },

  updateProfile: async (payload: Partial<IUser>): Promise<IUser> => {
    const { data } = await apiClient.patch<IUser>('/auth/profile', payload);
    return data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },
};
