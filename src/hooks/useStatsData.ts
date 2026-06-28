import { useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { getToolStats, getRecentSessions } from "../utils/toolSessionApi";

export type StatsTab = 'Overview' | 'Breathing' | 'Drills' | 'Biofeedback' | 'Simulation';
export const STATS_TABS: StatsTab[] = ['Overview', 'Breathing', 'Drills', 'Biofeedback', 'Simulation'];

const EMPTY_STATS = {
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

const DEFAULT_WEEKLY = [
  { label: 'M', value: 0 }, { label: 'T', value: 0 }, { label: 'W', value: 0 },
  { label: 'T', value: 0 }, { label: 'F', value: 0 }, { label: 'S', value: 0 }, { label: 'S', value: 0 },
];

const DEFAULT_TREND = [
  { value: 0, label: "W1" }, { value: 0, label: "W2" }, { value: 0, label: "W3" },
  { value: 0, label: "W4" }, { value: 0, label: "W5" }, { value: 0, label: "W6" },
];

export const useStatsData = () => {
  const [activeTab, setActiveTab] = useState<StatsTab>('Overview');
  const [stats, setStats] = useState<any>(EMPTY_STATS);
  const [recentSessions, setRecentSessions] = useState<any[]>([]);
  const [allSessions, setAllSessions] = useState<any[]>([]);
  const [weeklyChartData, setWeeklyChartData] = useState<any[]>(DEFAULT_WEEKLY);
  const [weeklyTotal, setWeeklyTotal] = useState(0);
  const [weeklyTrend, setWeeklyTrend] = useState<any[]>(DEFAULT_TREND);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Always read from local storage — this is where saveSessionToBackend stores every session
      const data = await getToolStats();
      setStats(data || EMPTY_STATS);

      const allRecent = await getRecentSessions('ALL', 100);
      const sessions = allRecent.sessions || [];
      setAllSessions(sessions);

      const merged = [...sessions]
        .sort((a: any, b: any) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
        .slice(0, 10);
      setRecentSessions(merged);

      // Build weekly activity chart (last 7 days)
      const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const chartData = [];
      let wTotal = 0;
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        let count = 0;
        for (const s of sessions) {
          const sDate = new Date(s.startedAt);
          if (sDate.getFullYear() === d.getFullYear() && sDate.getMonth() === d.getMonth() && sDate.getDate() === d.getDate()) {
            count++;
          }
        }
        chartData.push({ label: days[d.getDay()], value: count });
        wTotal += count;
      }
      setWeeklyChartData(chartData);
      setWeeklyTotal(wTotal);

      // Build 6-week trend
      const weekTrendData = [];
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
        weekTrendData.push({ value: Math.round(minutes), label: `W${6 - w}` });
      }
      setWeeklyTrend(weekTrendData);
    } catch {
      setStats(EMPTY_STATS);
      setRecentSessions([]);
      setAllSessions([]);
      setWeeklyChartData(DEFAULT_WEEKLY);
      setWeeklyTotal(0);
      setWeeklyTrend(DEFAULT_TREND);
    } finally {
      setLoading(false);
    }
  }, []);

  // Re-fetch every time the screen comes into focus (navigating back from a tool)
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  return { activeTab, setActiveTab, stats, recentSessions, allSessions, loading, weeklyChartData, weeklyTotal, weeklyTrend, fetchData };
};
