import { create } from "zustand";
import { storage, StorageKeys } from "../utils/storage";

interface MoodState {
  currentMood: string;
  setMood: (mood: string) => Promise<void>;
  loadMood: () => Promise<void>;
}

export const useMoodStore = create<MoodState>((set) => ({
  currentMood: "Neutral", // Default

  setMood: async (mood: string) => {
    try {
      const today = new Date().toISOString().split("T")[0];
      await storage.setItem(`mood_${today}`, mood);
      set({ currentMood: mood });
    } catch (error) {
      console.error("Failed to save mood:", error);
    }
  },

  loadMood: async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const savedMood = await storage.getItem(`mood_${today}`);
      if (savedMood) {
        set({ currentMood: savedMood as string });
      }
    } catch (error) {
      console.error("Failed to load mood:", error);
    }
  },
}));
