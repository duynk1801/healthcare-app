/**
 * Global TypeScript interfaces — Healthcare App
 *
 * Shared types used across multiple features.
 * Feature-specific types go in src/features/<feature>/types/.
 */

// ─── User & Auth ─────────────────────────────────────────

export interface IUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl: string | null;
  role: 'patient' | 'doctor' | 'admin';
  dateOfBirth: string | null;
  gender: 'male' | 'female' | 'other' | null;
  createdAt: string;
}

export interface ILoginCredentials {
  email: string;
  password: string;
}

export interface IRegisterPayload {
  name: string;
  email: string;
  password: string;
  phone: string;
}

export interface IAuthResponse {
  user: IUser;
  token: string;
  refreshToken: string;
}

// ─── API ─────────────────────────────────────────────────

export interface IApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

export interface IPaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
