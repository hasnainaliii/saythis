import { useState, useEffect, useCallback } from "react";
import { getToolStats, getRecentSessions } from "../utils/toolSessionApi";

export type StatsTab = 'Overview' | 'DAF' | 'FAF' | 'Breathing' | 'Drills' | 'Biofeedback' | 'Simulation';
export const STATS_TABS: StatsTab[] = ['Overview', 'DAF', 'FAF', 'Breathing', 'Drills', 'Biofeedback', 'Simulation'];

const EMPTY_STATS = {
  daf: { totalSessions: 0, totalMinutes: 0, avgRating: 0, avgDelayMs: 0, sessionsThisWeek: 0, bestStreak: 0 },
  faf: { totalSessions: 0, totalMinutes: 0, avgRating: 0, preferredDirection: 'down', avgSemitones: 0, sessionsThisWeek: 0, bestStreak: 0 },
  combined: { totalToolMinutes: 0, currentStreak: 0, bestStreak: 0, lastSessionAt: null, activeDays: 0, totalSessions: 0 },
  breathing: {
    totalSessions: 0, totalMinutes: 0, avgRating: 0,
    boxBreathingSessions: 0, diaphragmaticSessions: 0, preSpeechSessions: 0,
    situationBreakdown: {},
    currentStreak: 0,
  },
  drills: {
    totalSessions: 0, totalMinutes: 0, avgRating: 0,
    gentleOnsetSessions: 0, prolongedSpeechSessions: 0,
    avgGentleScore: 0, avgProlongedWpm: 0, currentStreak: 0,
  },
  biofeedback: {
    totalSessions: 0, totalMinutes: 0, avgRating: 0,
    stutterTapSessions: 0, timedReadingSessions: 0,
    avgStuttersPerMin: 0, avgReadingWpm: 0, currentStreak: 0,
  },
  simulation: {
    totalSessions: 0, totalMinutes: 0, avgRating: 0,
    coffeeSessions: 0, callSessions: 0,
    avgCompletionScore: 0, currentStreak: 0,
  },
};

export const useStatsData = () => {
  const [activeTab, setActiveTab] = useState<StatsTab>('Overview');
  const [stats, setStats] = useState<any>(EMPTY_STATS);
  const [recentSessions, setRecentSessions] = useState<any[]>([]);
  const [allSessions, setAllSessions] = useState<any[]>([]);
  const [weeklyChartData, setWeeklyChartData] = useState<any[]>([
    { label: 'M', value: 0 }, { label: 'T', value: 0 }, { label: 'W', value: 0 },
    { label: 'T', value: 0 }, { label: 'F', value: 0 }, { label: 'S', value: 0 }, { label: 'S', value: 0 },
  ]);
  const [weeklyTotal, setWeeklyTotal] = useState(0);
  const [weeklyTrend, setWeeklyTrend] = useState<any[]>([
    { value: 0, label: "W1" }, { value: 0, label: "W2" }, { value: 0, label: "W3" },
    { value: 0, label: "W4" }, { value: 0, label: "W5" }, { value: 0, label: "W6" },
  ]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getToolStats();
      setStats(data || EMPTY_STATS);

      const allRecent = await getRecentSessions('ALL', 100);
      const sessions = allRecent.sessions || [];
      setAllSessions(sessions);
      
      const merged = [...sessions]
        .sort((a: any, b: any) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
        .slice(0, 10);
      setRecentSessions(merged);

      // Calculate weekly chart data from past 7 days
      const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const chartData = [];
      let wTotal = 0;
      
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dayLabel = days[d.getDay()];
        
        let count = 0;
        for (const s of sessions) {
          const sDate = new Date(s.startedAt);
          if (sDate.getFullYear() === d.getFullYear() && sDate.getMonth() === d.getMonth() && sDate.getDate() === d.getDate()) {
            count++;
          }
        }
        
        chartData.push({ label: dayLabel, value: count });
        wTotal += count;
      }
      
      setWeeklyChartData(chartData);
      setWeeklyTotal(wTotal);

      // Calculate 6-week trend dynamically
      const weekTrend = [];
      for (let w = 5; w >= 0; w--) {
        const weekStart = new Date(today);
        weekStart.setDate(weekStart.getDate() - (w * 7) - today.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        
        let minutes = 0;
        for (const s of sessions) {
          const sDate = new Date(s.startedAt);
          if (sDate >= weekStart && sDate <= weekEnd) {
            minutes += (s.durationSeconds || 0) / 60;
          }
        }
        weekTrend.push({ value: Math.round(minutes), label: `W${6 - w}` });
      }
      setWeeklyTrend(weekTrend);
    } catch {
      setStats(EMPTY_STATS);
      setRecentSessions([]);
      setAllSessions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { activeTab, setActiveTab, stats, recentSessions, allSessions, loading, weeklyChartData, weeklyTotal, weeklyTrend, fetchData };
};
