import { create } from "zustand";
import { storage } from "../utils/storage";

interface TrackerState {
  sleepHours: number | null;
  journalEntry: string;
  journalStreak: number;
  stressLevel: number;
  mindfulHours: number;
  setSleep: (hours: number) => Promise<void>;
  setJournal: (entry: string) => Promise<void>;
  setStress: (level: number) => Promise<void>;
  setMindfulHours: (hours: number) => Promise<void>;
  loadAll: () => Promise<void>;
  getJournalByDate: (dateStr: string) => Promise<string | null>;
}

export const useTrackerStore = create<TrackerState>((set, get) => ({
  sleepHours: null,
  journalEntry: "",
  journalStreak: 0,
  stressLevel: 0,
  mindfulHours: 0,

  setSleep: async (hours: number) => {
    const today = new Date().toISOString().split("T")[0];
    await storage.setItem(`sleep_${today}`, hours);
    set({ sleepHours: hours });
  },

  setJournal: async (entry: string) => {
    const todayStr = new Date().toISOString().split("T")[0];
    const today = new Date(todayStr);
    
    await storage.setItem(`journal_${todayStr}`, entry);
    
    const lastDateStr = await storage.getItem("journal_last_date");
    let currentStreak = Number(await storage.getItem("journal_streak") || 0);

    if (lastDateStr) {
      const lastDate = new Date(lastDateStr as string);
      const diffTime = Math.abs(today.getTime() - lastDate.getTime());
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)); 

      if (diffDays === 1) {
        currentStreak += 1;
      } else if (diffDays > 1) {
        currentStreak = 1;
      }
    } else {
      currentStreak = 1;
    }

    await storage.setItem("journal_last_date", todayStr);
    await storage.setItem("journal_streak", currentStreak);

    set({ journalEntry: entry, journalStreak: currentStreak });
  },

  setStress: async (level: number) => {
    const today = new Date().toISOString().split("T")[0];
    await storage.setItem(`stress_${today}`, level);
    set({ stressLevel: level });
  },

  setMindfulHours: async (hours: number) => {
    const today = new Date().toISOString().split("T")[0];
    await storage.setItem(`mindful_${today}`, hours);
    set({ mindfulHours: hours });
  },

  loadAll: async () => {
    const todayStr = new Date().toISOString().split("T")[0];
    const today = new Date(todayStr);

    const sleep = await storage.getItem(`sleep_${todayStr}`);
    const journal = await storage.getItem(`journal_${todayStr}`);
    const stress = await storage.getItem(`stress_${todayStr}`);
    const mindful = await storage.getItem(`mindful_${todayStr}`);

    // Streak logic check
    const lastDateStr = await storage.getItem("journal_last_date");
    let currentStreak = Number(await storage.getItem("journal_streak") || 0);

    if (lastDateStr) {
      const lastDate = new Date(lastDateStr as string);
      const diffTime = Math.abs(today.getTime() - lastDate.getTime());
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
      
      // If it's been more than 1 day since last journal, streak is broken
      if (diffDays > 1) {
        currentStreak = 0;
        await storage.setItem("journal_streak", 0);
      }
    }

    set({
      sleepHours: sleep !== null ? Number(sleep) : null,
      journalEntry: (journal as string) || "",
      stressLevel: stress ? Number(stress) : 0,
      mindfulHours: mindful ? Number(mindful) : 0,
      journalStreak: currentStreak,
    });
  },

  getJournalByDate: async (dateStr: string) => {
    const entry = await storage.getItem(`journal_${dateStr}`);
    return (entry as string) || null;
  },
}));
