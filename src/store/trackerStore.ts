import { create } from "zustand";
import { storage } from "../utils/storage";
import statsService from "../services/statsService";

interface TrackerState {
  sleepHours: number | null;
  journalEntry: string;
  journalStreak: number;
  stressLevel: number;
  mindfulHours: number;
  stutterScore: number | null;
  setSleep: (hours: number) => Promise<void>;
  setJournal: (entry: string) => Promise<void>;
  setStress: (level: number) => Promise<void>;
  setMindfulHours: (hours: number) => Promise<void>;
  loadAll: () => Promise<void>;
  getJournalByDate: (dateStr: string) => Promise<string | null>;
}

const getToday = () => new Date().toISOString().split("T")[0];

export const useTrackerStore = create<TrackerState>((set) => ({
  sleepHours: null,
  journalEntry: "",
  journalStreak: 0,
  stressLevel: 0,
  mindfulHours: 0,
  stutterScore: null,

  setSleep: async (hours: number) => {
    const today = getToday();
    set({ sleepHours: hours });
    await storage.setItem(`sleep_${today}`, hours);
    try {
      await statsService.patchDaily({ date: today, sleep_hours: hours });
    } catch (e) {
      console.warn("Failed to sync sleep:", e);
    }
  },

  setJournal: async (entry: string) => {
    const today = getToday();
    set({ journalEntry: entry });
    await storage.setItem(`journal_${today}`, entry);
    try {
      await statsService.patchDaily({ date: today, journal_entry: entry });
    } catch (e) {
      console.warn("Failed to sync journal:", e);
    }
  },

  setStress: async (level: number) => {
    const today = getToday();
    set({ stressLevel: level });
    await storage.setItem(`stress_${today}`, level);
    try {
      await statsService.patchDaily({ date: today, stress_level: level });
    } catch (e) {
      console.warn("Failed to sync stress:", e);
    }
  },

  setMindfulHours: async (hours: number) => {
    const today = getToday();
    set({ mindfulHours: hours });
    await storage.setItem(`mindful_${today}`, hours);
    try {
      await statsService.patchDaily({ date: today, mindful_hours: hours });
    } catch (e) {
      console.warn("Failed to sync mindful hours:", e);
    }
  },

  loadAll: async () => {
    const today = getToday();

    try {
      const data = await statsService.getStats();
      const t = data.today;
      set({
        sleepHours: t?.sleep_hours ?? null,
        journalEntry: t?.journal_entry ?? "",
        stressLevel: t?.stress_level ?? 0,
        mindfulHours: t?.mindful_hours ?? 0,
        journalStreak: data.journal_streak ?? 0,
        stutterScore: t?.stutter_score ?? null,
      });
      return;
    } catch (e) {
      // console.warn("Backend unavailable, loading from local:", e);
    }

    // fallback to local storage
    const sleep = await storage.getItem(`sleep_${today}`);
    const journal = await storage.getItem(`journal_${today}`);
    const stress = await storage.getItem(`stress_${today}`);
    const mindful = await storage.getItem(`mindful_${today}`);

    set({
      sleepHours: sleep !== null ? Number(sleep) : null,
      journalEntry: (journal as string) || "",
      stressLevel: stress ? Number(stress) : 0,
      mindfulHours: mindful ? Number(mindful) : 0,
    });
  },

  getJournalByDate: async (dateStr: string) => {
    try {
      const stat = await statsService.getDailyByDate(dateStr);
      if (stat?.journal_entry) return stat.journal_entry;
    } catch (e) {
      // console.warn("Backend unavailable for journal lookup:", e);
    }
    // fallback
    const entry = await storage.getItem(`journal_${dateStr}`);
    return (entry as string) || null;
  },
}));
