import { create } from "zustand";

interface AuthState {
  accessToken: string | null;
  isAuthReady: boolean;

  setAccessToken: (token: string) => void;
  clearAccessToken: () => void;
  setAuthReady: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  accessToken: null,
  isAuthReady: false,

  setAccessToken: (token) => set({ accessToken: token }),
  clearAccessToken: () => set({ accessToken: null, isAuthReady: false }),
  setAuthReady: () => set({ isAuthReady: true }),
}));
