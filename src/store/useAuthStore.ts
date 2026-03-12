/**
 * Auth Store — Zustand
 *
 * Quản lý authentication state: user, token, login/logout.
 * Persist token vào AsyncStorage để giữ session khi app restart.
 */

import type { IUser } from '@/src/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// ─── State Interface ─────────────────────────────────────

interface IAuthState {
  user: IUser | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
}

// ─── Actions Interface ───────────────────────────────────

interface IAuthActions {
  /** Set auth data after successful login/register */
  setAuth: (user: IUser, token: string, refreshToken: string) => void;
  /** Update user profile data */
  updateUser: (data: Partial<IUser>) => void;
  /** Update access token (after refresh) */
  setToken: (token: string) => void;
  /** Clear all auth state */
  logout: () => void;
  /** Mark hydration complete (called by persist middleware) */
  setHydrated: (hydrated: boolean) => void;
}

// ─── Initial State ───────────────────────────────────────

const initialState: IAuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isHydrated: false,
};

// ─── Store ───────────────────────────────────────────────

export const useAuthStore = create<IAuthState & IAuthActions>()(
  persist(
    (set) => ({
      ...initialState,

      setAuth: (user, token, refreshToken) =>
        set({
          user,
          token,
          refreshToken,
          isAuthenticated: true,
        }),

      updateUser: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),

      setToken: (token) => set({ token }),

      logout: () =>
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
        }),

      setHydrated: (hydrated) => set({ isHydrated: hydrated }),
    }),
    {
      name: 'healthcare-auth',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist these fields (exclude isHydrated)
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);

// ─── Selectors (granular, prevents unnecessary re-renders) ───

export const selectUser = (state: IAuthState & IAuthActions) => state.user;
export const selectToken = (state: IAuthState & IAuthActions) => state.token;
export const selectIsAuthenticated = (state: IAuthState & IAuthActions) => state.isAuthenticated;
export const selectIsHydrated = (state: IAuthState & IAuthActions) => state.isHydrated;
