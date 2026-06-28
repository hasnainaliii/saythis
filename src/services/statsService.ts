import api from "./api";

export interface DailyStatPayload {
  date: string;
  mood?: string | null;
  sleep_hours?: number | null;
  journal_entry?: string | null;
  stress_level?: number | null;
  mindful_hours?: number | null;
  stutter_score?: number | null;
  stutter_count?: number | null;
  repetition_count?: number | null;
  filler_count?: number | null;
  total_words?: number | null;
  stutter_transcript?: string | null;
}

export interface DailyStat {
  id: string;
  date: string;
  mood: string | null;
  sleep_hours: number | null;
  journal_entry: string | null;
  stress_level: number | null;
  mindful_hours: number | null;
  stutter_score: number | null;
  stutter_count: number | null;
  repetition_count: number | null;
  filler_count: number | null;
  total_words: number | null;
  stutter_transcript: string | null;
  created_at: string;
  updated_at: string;
}

export interface StatsResponse {
  daily_stats: DailyStat[];
  today: DailyStat | null;
  journal_streak: number;
  wellness_summary: {
    avg_sleep_hours: number;
    avg_stress_level: number;
    avg_mindful_hours: number;
    total_journal_entries: number;
    mood_distribution: Record<string, number>;
    days_tracked: number;
  };
  stutter_summary: {
    avg_score: number;
    best_score: number;
    worst_score: number;
    total_analyses: number;
    score_trend: { date: string; score: number }[];
    latest_score: number;
  };
  tool_stats: {
    combined: Record<string, any>;
    daf: Record<string, any>;
    faf: Record<string, any>;
    breathing: Record<string, any>;
    drills: Record<string, any>;
    biofeedback: Record<string, any>;
    simulation: Record<string, any>;
  };
  weekly_activity: { date: string; day: string; sessions: number }[];
  weekly_trend: { week_label: string; total_minutes: number }[];
  recent_sessions: any[];
}

export const statsService = {
  patchDaily: async (data: DailyStatPayload): Promise<DailyStat> => {
    const res = await api.patch<{ daily_stat: DailyStat }>("/stats/daily", data);
    return res.data.daily_stat;
  },

  getStats: async (from?: string, to?: string): Promise<StatsResponse> => {
    const params: Record<string, string> = {};
    if (from) params.from = from;
    if (to) params.to = to;
    try {
      const res = await api.get<StatsResponse>("/stats", { params });
      return res.data;
    } catch (err: any) {
      throw err;
    }
  },

  getDailyByDate: async (date: string): Promise<DailyStat | null> => {
    try {
      const res = await api.get<{ daily_stat: DailyStat | null }>(`/stats/daily/${date}`);
      return res.data.daily_stat;
    } catch (err: any) {
      if (err.response?.status === 404) return null;
      throw err;
    }
  },
};

export default statsService;
