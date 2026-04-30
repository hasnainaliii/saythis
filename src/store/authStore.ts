import { create } from "zustand";
import type { User } from "../types/auth";
import { storage, StorageKeys } from "../utils/storage";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  isLoading: boolean;
  isHydrated: boolean;

  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setOnboardingCompleted: () => Promise<void>;
  login: (
    user: User,
    accessToken: string,
    refreshToken: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  hasCompletedOnboarding: false,
  isLoading: true,
  isHydrated: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  setLoading: (isLoading) => set({ isLoading }),

  setOnboardingCompleted: async () => {
    await storage.setItem(StorageKeys.HAS_COMPLETED_ONBOARDING, true);
    set({ hasCompletedOnboarding: true });
  },

  login: async (user, accessToken, refreshToken) => {
    try {
      await storage.setItem(StorageKeys.USER_TOKEN, accessToken);
      await storage.setItem(StorageKeys.USER_REFRESH_TOKEN, refreshToken);
      await storage.setItem(StorageKeys.USER_PROFILE, JSON.stringify(user));

      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      console.error("Failed to store auth data:", error);
    }
  },

  logout: async () => {
    try {
      await storage.removeItem(StorageKeys.USER_TOKEN);
      await storage.removeItem(StorageKeys.USER_REFRESH_TOKEN);
      await storage.removeItem(StorageKeys.USER_PROFILE);

      set({ user: null, isAuthenticated: false });
    } catch (error) {
      console.error("Failed to clear auth data:", error);
    }
  },

  hydrate: async () => {
    try {
      set({ isLoading: true });

      const hasText = await storage.getItem(StorageKeys.USER_PROFILE);
      const token = await storage.getItem(StorageKeys.USER_TOKEN);
      const onboardingCompletedStr = await storage.getItem(
        StorageKeys.HAS_COMPLETED_ONBOARDING,
      );

      const onboardingCompleted = onboardingCompletedStr === "true";

      if (hasText && token) {
        const user = JSON.parse(hasText) as User;
        set({
          user,
          isAuthenticated: true,
          hasCompletedOnboarding: onboardingCompleted,
        });
      } else {
        set({
          user: null,
          isAuthenticated: false,
          hasCompletedOnboarding: onboardingCompleted,
        });
      }
    } catch (error) {
      console.error("Failed to hydrate auth state:", error);
    } finally {
      set({ isLoading: false, isHydrated: true });
    }
  },
}));
