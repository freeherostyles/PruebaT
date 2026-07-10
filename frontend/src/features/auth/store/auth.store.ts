import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser } from '../types/auth';

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isRestoring: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  setUser: (user: AuthUser) => void;
  setRestoring: (restoring: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isRestoring: true,
      login: (token, user) =>
        set({ token, user, isAuthenticated: true, isRestoring: false }),
      logout: () =>
        set({ token: null, user: null, isAuthenticated: false, isRestoring: false }),
      setUser: (user) => set({ user }),
      setRestoring: (restoring) => set({ isRestoring: restoring }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
    },
  ),
);
