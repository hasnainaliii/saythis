import React from "react";
import { View } from "react-native";
import { colors } from "../../theme/Theme";
import { StatsMetricRow } from "./StatsMetricRow";
import { ToolDetailCard } from "./ToolDetailCard";
import { ToolBreakdownGrid } from "./ToolBreakdownGrid";
import { StreakCard } from "./StreakCard";
import { ToolDistributionChart } from "./ToolDistributionChart";
import { ProgressLineChart } from "./ProgressLineChart";

interface BiofeedbackTabProps { stats: any; allSessions?: any[]; }
interface SimulationTabProps { stats: any; allSessions?: any[]; }

const computeStutterTrend = (sessions: any[] = []) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const weekTrend = [];
  for (let w = 5; w >= 0; w--) {
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - (w * 7) - today.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    let totalTaps = 0;
    let totalMinutes = 0;
    for (const s of sessions) {
      if (s.toolType !== 'STUTTER_TAP_COUNTER') continue;
      const sDate = new Date(s.startedAt);
      if (sDate >= weekStart && sDate <= weekEnd && s.totalTaps !== undefined) {
        totalTaps += s.totalTaps;
        totalMinutes += s.durationSeconds / 60;
      }
    }
    const rate = totalMinutes > 0 ? totalTaps / totalMinutes : 0;
    weekTrend.push({ value: parseFloat(rate.toFixed(1)), label: `W${6 - w}` });
  }
  return weekTrend;
};

const computeSuccessTrend = (sessions: any[] = []) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const weekTrend = [];
  for (let w = 5; w >= 0; w--) {
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - (w * 7) - today.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    let successCount = 0;
    let totalSims = 0;
    for (const s of sessions) {
      if (!['VIRTUAL_COFFEE_ORDER', 'PHONE_CALL_SIMULATOR'].includes(s.toolType)) continue;
      const sDate = new Date(s.startedAt);
      if (sDate >= weekStart && sDate <= weekEnd) {
        totalSims++;
        if (s.completed) successCount++;
      }
    }
    const rate = totalSims > 0 ? (successCount / totalSims) * 100 : 0;
    weekTrend.push({ value: parseFloat(rate.toFixed(1)), label: `W${6 - w}` });
  }
  return weekTrend;
};

export const BiofeedbackTab: React.FC<BiofeedbackTabProps> = ({ stats, allSessions = [] }) => {
  const b = stats?.biofeedback || {};

  const stutterTrend = computeStutterTrend(allSessions);

  const bioPie = [
    { label: "Stutter Tap", value: b.stutterTapSessions || 0, color: colors.secondary },
    { label: "Timed Reading", value: b.timedReadingSessions || 0, color: colors.categoryEducation },
  ].filter((s) => s.value > 0);

  return (
    <View>
      <StatsMetricRow items={[
        { label: "Sessions", value: b.totalSessions || 0, color: colors.secondary },
        { label: "Minutes", value: b.totalMinutes || 0 },
        { label: "Rating", value: b.avgRating ? b.avgRating.toFixed(1) : "—", unit: "/5", color: colors.star },
      ]} />
      {bioPie.length > 0 && (
        <ToolDistributionChart title="Tool breakdown" slices={bioPie} centerLabel="sessions" centerValue={String(b.totalSessions || 0)} />
      )}
      <ToolDetailCard
        icon="hand-left-outline"
        accentColor={colors.secondary}
        title="Stutter Tap Counter"
        highlight={{ label: "Avg stutters/min", value: b.avgStuttersPerMin || 0 }}
        rows={[{ label: "Sessions", value: b.stutterTapSessions || 0 }]}
      />
      <ToolDetailCard
        icon="book-outline"
        accentColor={colors.categoryEducation}
        title="Timed Reading"
        highlight={{ label: "Avg reading pace", value: `${b.avgReadingWpm || 0} wpm` }}
        rows={[{ label: "Sessions", value: b.timedReadingSessions || 0 }]}
      />
      <ProgressLineChart
        title="Stutter frequency trend"
        subtitle="Stutters per minute (lower is better)"
        data={stutterTrend}
        accentColor={colors.secondary}
        yAxisSuffix="/min"
      />
      <StreakCard
        currentStreak={b.currentStreak || 0}
        bestStreak={b.currentStreak || 0}
        message="Biofeedback helps you build awareness of physical patterns."
      />
    </View>
  );
};

export const SimulationTab: React.FC<SimulationTabProps> = ({ stats, allSessions = [] }) => {
  const s = stats?.simulation || {};

  const successTrend = computeSuccessTrend(allSessions);

  const simPie = [
    { label: "Coffee orders", value: s.coffeeSessions || 0, color: colors.warning },
    { label: "Phone calls", value: s.callSessions || 0, color: colors.categorySelfAwareness },
  ].filter((sl) => sl.value > 0);

  return (
    <View>
      <StatsMetricRow items={[
        { label: "Sessions", value: s.totalSessions || 0, color: colors.warning },
        { label: "Minutes", value: s.totalMinutes || 0 },
        { label: "Rating", value: s.avgRating ? s.avgRating.toFixed(1) : "—", unit: "/5", color: colors.star },
      ]} />
      {simPie.length > 0 && (
        <ToolDistributionChart title="Scenario breakdown" slices={simPie} centerLabel="sessions" centerValue={String(s.totalSessions || 0)} />
      )}
      <ToolBreakdownGrid items={[
        { icon: "cafe-outline", label: "Coffee orders", value: s.coffeeSessions || 0, color: colors.warning },
        { icon: "call-outline", label: "Phone calls", value: s.callSessions || 0, color: colors.categorySelfAwareness },
      ]} />
      <ProgressLineChart
        title="Success rate trend"
        subtitle="Completion score over time"
        data={successTrend}
        accentColor={colors.warning}
        yAxisSuffix="%"
      />
      <StreakCard
        currentStreak={s.currentStreak || 0}
        bestStreak={s.currentStreak || 0}
        message="Real-world simulations transfer clinic fluency to daily life."
      />
    </View>
  );
};
