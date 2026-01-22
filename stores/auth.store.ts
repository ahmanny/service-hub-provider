import { ProviderProfile } from "@/types/user.types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type AuthState = {
  isAuthenticated: boolean;
  hasProfile: boolean;
  user: ProviderProfile | null;
  hydrated: boolean;
  userLocation: [number, number] | null;
  setLocation: (location: [number, number]) => void;

  login: (user: ProviderProfile, hasProfile: boolean) => void;
  logout: () => void;
};


export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      hasProfile: false,
      user: null,
      hydrated: false,
      userLocation: null,
      setLocation: (location) => set({ userLocation: location }),

      login: (user, hasProfile) =>
        set({
          isAuthenticated: true,
          user,
          hasProfile,
        }),

      logout: () =>
        set({
          isAuthenticated: false,
          user: null,
          hasProfile: false,
        }),
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => AsyncStorage),

      onRehydrateStorage: () => (state) => {
        if (state) {
          state.hydrated = true;
        }
      },
    }
  )
);


