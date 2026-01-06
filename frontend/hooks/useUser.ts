import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  id: string;
  firstName: string;
  lastName: string;
}

export interface UserState  {
  userData: User | null;
  setUser: (userData: User) => void;
  clearUser: () => void;
}

export const useUser = create<UserState>()(
  persist(
    (set) => ({
      userData: null,

      setUser: (userData) => set({ userData }),
      clearUser: () => set({ userData: null }),
    }),
    {
      name: 'user-storage',
    }
  )
)