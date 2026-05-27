import React from "react";
import { View } from "react-native";
import { colors } from "../../theme/Theme";
import { StatsMetricRow } from "./StatsMetricRow";
import { StatsWeeklyActivityCard } from "./StatsWeeklyActivityCard";
import { ToolDetailCard } from "./ToolDetailCard";
import { StreakCard } from "./StreakCard";
import { ProgressLineChart } from "./ProgressLineChart";

interface DAFTabProps { stats: any; allSessions?: any[]; }
interface FAFTabProps { stats: any; allSessions?: any[]; }

const computeWeeklyActivity = (sessions: any[] = [], toolType: string) => {
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const chartData = [];
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dayLabel = days[d.getDay()];
    
    let count = 0;
    for (const s of sessions) {
      if (s.toolType !== toolType) continue;
      const sDate = new Date(s.startedAt);
      if (sDate.getFullYear() === d.getFullYear() && sDate.getMonth() === d.getMonth() && sDate.getDate() === d.getDate()) {
        count++;
      }
    }
    
    chartData.push({ label: dayLabel, value: count });
  }
  return chartData;
};

const computeRatingTrend = (sessions: any[] = [], toolType: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const weekTrend = [];
  for (let w = 5; w >= 0; w--) {
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - (w * 7) - today.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    let ratingSum = 0;
    let ratingCount = 0;
    for (const s of sessions) {
      if (s.toolType !== toolType) continue;
      const sDate = new Date(s.startedAt);
      if (sDate >= weekStart && sDate <= weekEnd && s.selfRating) {
        ratingSum += s.selfRating;
        ratingCount++;
      }
    }
    const avg = ratingCount > 0 ? ratingSum / ratingCount : 0;
    weekTrend.push({ value: parseFloat(avg.toFixed(1)), label: `W${6 - w}` });
  }
  return weekTrend;
};

export const DAFTab: React.FC<DAFTabProps> = ({ stats, allSessions = [] }) => {
  const s = stats?.daf || {};
  const weeklyData = computeWeeklyActivity(allSessions, 'DAF');
  const ratingTrend = computeRatingTrend(allSessions, 'DAF');
  return (
    <View>
      <StatsMetricRow items={[
        { label: "Sessions", value: s.totalSessions || 0, color: colors.secondary },
        { label: "Total Time", value: s.totalMinutes || 0, unit: "min" },
        { label: "Rating", value: s.avgRating ? s.avgRating.toFixed(1) : "—", unit: "/5", color: colors.star },
      ]} />
      <ToolDetailCard
        icon="headset-outline"
        accentColor={colors.secondary}
        title="Delay Settings"
        highlight={{ label: "Average delay", value: `${s.avgDelayMs || 0}ms` }}
        rows={[
          { label: "This week", value: `${s.sessionsThisWeek || 0} sessions` },
          { label: "Best streak", value: `${s.bestStreak || 0} days` },
        ]}
      />
      <StatsWeeklyActivityCard data={weeklyData} totalMinutes={s.totalMinutes || 0} accentColor={colors.secondary} />
      <ProgressLineChart
        title="Rating trend"
        subtitle="Average session rating over time"
        data={ratingTrend}
        accentColor={colors.secondary}
      />
      <StreakCard
        currentStreak={s.sessionsThisWeek || 0}
        bestStreak={s.bestStreak || 0}
        message="Consistent DAF practice builds natural fluency."
      />
    </View>
  );
};

export const FAFTab: React.FC<FAFTabProps> = ({ stats, allSessions = [] }) => {
  const s = stats?.faf || {};
  const weeklyData = computeWeeklyActivity(allSessions, 'FAF');
  const ratingTrend = computeRatingTrend(allSessions, 'FAF');
  const direction = s.preferredDirection === 'down' ? '↓' : '↑';
  return (
    <View>
      <StatsMetricRow items={[
        { label: "Sessions", value: s.totalSessions || 0, color: colors.categorySelfAwareness },
        { label: "Total Time", value: s.totalMinutes || 0, unit: "min" },
        { label: "Rating", value: s.avgRating ? s.avgRating.toFixed(1) : "—", unit: "/5", color: colors.star },
      ]} />
      <ToolDetailCard
        icon="musical-notes-outline"
        accentColor={colors.categorySelfAwareness}
        title="Pitch Shift"
        highlight={{ label: "Preferred shift", value: `${direction}${s.avgSemitones || 0} semitones` }}
        rows={[
          { label: "This week", value: `${s.sessionsThisWeek || 0} sessions` },
          { label: "Best streak", value: `${s.bestStreak || 0} days` },
        ]}
      />
      <StatsWeeklyActivityCard data={weeklyData} totalMinutes={s.totalMinutes || 0} accentColor={colors.categorySelfAwareness} />
      <ProgressLineChart
        title="Rating trend"
        subtitle="Average session rating over time"
        data={ratingTrend}
        accentColor={colors.categorySelfAwareness}
      />
      <StreakCard
        currentStreak={s.sessionsThisWeek || 0}
        bestStreak={s.bestStreak || 0}
        message="FAF helps you find your natural voice pitch."
      />
    </View>
  );
};
