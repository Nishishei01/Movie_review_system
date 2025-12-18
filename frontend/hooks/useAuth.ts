import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  firstName: string;
  lastName: string;
}

export interface AuthData {
  userData: User | null;
  setUser: (userData: User) => void;
}

export const useAuth = create<AuthData>()(
  persist(
    (set) => ({
      userData: null,

      setUser: (userData) => set({ userData }),
    }),
    {
      name: 'auth-storage',
    }
  )
)