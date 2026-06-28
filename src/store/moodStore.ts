import { create } from "zustand";
import { storage } from "../utils/storage";
import statsService from "../services/statsService";

interface MoodState {
  currentMood: string;
  setMood: (mood: string) => Promise<void>;
  loadMood: () => Promise<void>;
}

export const useMoodStore = create<MoodState>((set) => ({
  currentMood: "Neutral",

  setMood: async (mood: string) => {
    const today = new Date().toISOString().split("T")[0];
    set({ currentMood: mood });
    try {
      await storage.setItem(`mood_${today}`, mood);
      await statsService.patchDaily({ date: today, mood });
    } catch (error) {
      console.warn("Failed to sync mood:", error);
    }
  },

  loadMood: async () => {
    const today = new Date().toISOString().split("T")[0];
    try {
      const data = await statsService.getStats();
      if (data.today?.mood) {
        set({ currentMood: data.today.mood });
        return;
      }
    } catch (e) {
      // console.warn("Backend unavailable for historic mood lookup:", e);
    }
    // fallback
    try {
      const saved = await storage.getItem(`mood_${today}`);
      if (saved) set({ currentMood: saved as string });
    } catch (error) {
      console.error("Failed to load mood:", error);
    }
  },
}));
