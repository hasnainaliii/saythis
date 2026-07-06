import { create } from "zustand";
import type { User } from "../types/auth";
import { storage, StorageKeys } from "../utils/storage";
import { userService } from "../services/userService";
import { clearOfflineQueue } from "../utils/offlineQueue";

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
  updateUser: (user: User) => Promise<void>;
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
      await storage.removeItem(StorageKeys.APP_SESSIONS);
      await clearOfflineQueue();

      set({ user: null, isAuthenticated: false });
    } catch (error) {
      console.error("Failed to clear auth data:", error);
    }
  },

  /**
   * Update user data in both store and persistent storage
   * Used after profile edits, avatar uploads, etc.
   */
  updateUser: async (user: User) => {
    try {
      await storage.setItem(StorageKeys.USER_PROFILE, JSON.stringify(user));
      set({ user });
    } catch (error) {
      console.error("Failed to update user data:", error);
    }
  },

  hydrate: async () => {
    try {
      set({ isLoading: true });

      const profileStr = await storage.getItem(StorageKeys.USER_PROFILE);
      const token = await storage.getItem(StorageKeys.USER_TOKEN);
      const onboardingCompletedStr = await storage.getItem(
        StorageKeys.HAS_COMPLETED_ONBOARDING,
      );

      const onboardingCompleted = onboardingCompletedStr === "true";

      if (profileStr && token) {
        // We have cached data — use it immediately for fast startup
        const cachedUser = JSON.parse(profileStr) as User;
        set({
          user: cachedUser,
          isAuthenticated: true,
          hasCompletedOnboarding: onboardingCompleted,
        });

        // Then try to fetch fresh profile from backend in background
        try {
          const freshUser = await userService.getProfile();
          await storage.setItem(
            StorageKeys.USER_PROFILE,
            JSON.stringify(freshUser),
          );
          set({ user: freshUser });
        } catch {
          // If fetch fails (offline, token expired), keep cached data
          // The token refresh interceptor will handle expired tokens
        }
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
