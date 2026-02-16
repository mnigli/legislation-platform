import { create } from 'zustand';
import { api } from '../services/api';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (credential: string) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem('token'),
  isLoading: true,

  login: async (credential: string) => {
    const result = await api.loginWithGoogle(credential);
    const { token, user } = result.data;
    localStorage.setItem('token', token);
    api.setToken(token);
    set({ token, user, isLoading: false });
  },

  logout: () => {
    localStorage.removeItem('token');
    api.setToken(null);
    set({ user: null, token: null });
  },

  loadUser: async () => {
    const token = get().token;
    if (!token) {
      set({ isLoading: false });
      return;
    }
    api.setToken(token);
    try {
      const result = await api.getMe();
      set({ user: result.data, isLoading: false });
    } catch {
      localStorage.removeItem('token');
      api.setToken(null);
      set({ user: null, token: null, isLoading: false });
    }
  },
}));
