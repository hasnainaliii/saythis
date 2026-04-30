import AsyncStorage from "@react-native-async-storage/async-storage";

export const StorageKeys = {
  USER_TOKEN: "user.token",
  USER_REFRESH_TOKEN: "user.refresh_token",
  USER_PROFILE: "user.profile",
  HAS_COMPLETED_ONBOARDING: "app.onboarding_completed",
} as const;

export const storage = {
  setItem: async (key: string, value: string | boolean | number) => {
    try {
      const stringValue =
        typeof value === "string" ? value : JSON.stringify(value);
      await AsyncStorage.setItem(key, stringValue);
    } catch (e) {
      console.error("Failed to set item in storage", e);
    }
  },
  getItem: async (key: string) => {
    try {
      return await AsyncStorage.getItem(key);
    } catch (e) {
      console.error("Failed to get item from storage", e);
      return null;
    }
  },
  removeItem: async (key: string) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.error("Failed to remove item from storage", e);
    }
  },
  clear: async () => {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      console.error("Failed to clear storage", e);
    }
  },
};
