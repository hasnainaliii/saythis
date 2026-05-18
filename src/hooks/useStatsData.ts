import { useState, useEffect, useCallback } from "react";
import { getToolStats, getRecentSessions } from "../utils/toolSessionApi";

export type StatsTab = 'Overview' | 'DAF' | 'FAF' | 'Breathing' | 'Drills' | 'Biofeedback' | 'Simulation';
export const STATS_TABS: StatsTab[] = ['Overview', 'DAF', 'FAF', 'Breathing', 'Drills', 'Biofeedback', 'Simulation'];

const FALLBACK_STATS = {
  daf: { totalSessions: 12, totalMinutes: 45, avgRating: 4.2, avgDelayMs: 140, sessionsThisWeek: 3, bestStreak: 5 },
  faf: { totalSessions: 8, totalMinutes: 30, avgRating: 4.5, preferredDirection: 'down', avgSemitones: 2, sessionsThisWeek: 2, bestStreak: 3 },
  combined: { totalToolMinutes: 75, currentStreak: 4, bestStreak: 7, lastSessionAt: new Date().toISOString(), activeDays: 18, totalSessions: 47 },
  breathing: {
    totalSessions: 6, totalMinutes: 18, avgRating: 4.3,
    boxBreathingSessions: 3, diaphragmaticSessions: 2, preSpeechSessions: 1,
    situationBreakdown: { 'Phone call': 3, 'Meeting / work': 1 },
    currentStreak: 1,
  },
  drills: {
    totalSessions: 8, totalMinutes: 65, avgRating: 4.6,
    gentleOnsetSessions: 5, prolongedSpeechSessions: 3,
    avgGentleScore: 85, avgProlongedWpm: 92, currentStreak: 2,
  },
  biofeedback: {
    totalSessions: 5, totalMinutes: 30, avgRating: 4.2,
    stutterTapSessions: 3, timedReadingSessions: 2,
    avgStuttersPerMin: 12, avgReadingWpm: 105, currentStreak: 1,
  },
  simulation: {
    totalSessions: 4, totalMinutes: 40, avgRating: 4.8,
    coffeeSessions: 2, callSessions: 2,
    avgCompletionScore: 90, currentStreak: 1,
  },
};

const FALLBACK_SESSIONS = [
  { toolType: 'DAF', startedAt: new Date().toISOString(), durationSeconds: 300, selfRating: 4, settings: { delay_ms: 150 } },
  { toolType: 'FAF', startedAt: new Date(Date.now() - 86400000).toISOString(), durationSeconds: 420, selfRating: 5, settings: { pitch_direction: 'down', pitch_semitones: 3 } },
  { toolType: 'BOX_BREATHING', startedAt: new Date(Date.now() - 172800000).toISOString(), durationSeconds: 240, selfRating: 4, settings: {} },
  { toolType: 'GENTLE_ONSET', startedAt: new Date(Date.now() - 259200000).toISOString(), durationSeconds: 360, selfRating: 5, settings: {} },
];

export const useStatsData = () => {
  const [activeTab, setActiveTab] = useState<StatsTab>('Overview');
  const [stats, setStats] = useState<any>(null);
  const [recentSessions, setRecentSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getToolStats();
      setStats(data);

      const [daf, faf] = await Promise.all([
        getRecentSessions('DAF', 5),
        getRecentSessions('FAF', 5),
      ]);
      const merged = [...(daf.sessions || []), ...(faf.sessions || [])]
        .sort((a: any, b: any) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
        .slice(0, 10);
      setRecentSessions(merged);
    } catch {
      setStats(FALLBACK_STATS);
      setRecentSessions(FALLBACK_SESSIONS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // weekly chart data (dummy for now)
  const weeklyChartData = [
    { label: 'M', value: 3 }, { label: 'T', value: 5 }, { label: 'W', value: 2 },
    { label: 'T', value: 4 }, { label: 'F', value: 6 }, { label: 'S', value: 1 }, { label: 'S', value: 3 },
  ];

  const weeklyTotal = weeklyChartData.reduce((sum, d) => sum + d.value, 0);

  return { activeTab, setActiveTab, stats, recentSessions, loading, weeklyChartData, weeklyTotal, fetchData };
};
