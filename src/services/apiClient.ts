/**
 * API Client — Axios Instance
 *
 * Configured with:
 * - Base URL from environment
 * - Auth token injection (from Zustand store)
 * - Response error handling
 * - Request/Response logging (dev only)
 */

import { useAuthStore } from '@/src/store/useAuthStore';
import type { IApiError } from '@/src/types';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';

// ─── Config ──────────────────────────────────────────────

/** Base URL — switch between mock server and production */
const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3001';

const TIMEOUT_MS = 15_000;

// ─── Instance ────────────────────────────────────────────

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ─── Request Interceptor ─────────────────────────────────

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Inject auth token from Zustand store (outside React)
    const token = useAuthStore.getState().token;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (__DEV__) {
      console.log(`🌐 ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// ─── Response Interceptor ────────────────────────────────

apiClient.interceptors.response.use(
  (response) => {
    if (__DEV__) {
      console.log(`✅ ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error: AxiosError<IApiError>) => {
    if (__DEV__) {
      console.error(
        `❌ ${error.response?.status ?? 'NETWORK'} ${error.config?.url}`,
        error.response?.data?.message ?? error.message,
      );
    }

    // Handle 401 — token expired → logout
    if (error.response?.status === 401) {
      const { logout } = useAuthStore.getState();
      logout();
    }

    return Promise.reject(error);
  },
);
