import React from "react";
import { View } from "react-native";
import { colors } from "../../theme/Theme";
import { StatsMetricRow } from "./StatsMetricRow";
import { ToolDetailCard } from "./ToolDetailCard";
import { ToolBreakdownGrid } from "./ToolBreakdownGrid";
import { StreakCard } from "./StreakCard";
import { ToolDistributionChart } from "./ToolDistributionChart";
import { ProgressLineChart } from "./ProgressLineChart";

interface BiofeedbackTabProps { stats: any; }

export const BiofeedbackTab: React.FC<BiofeedbackTabProps> = ({ stats }) => {
  const b = stats?.biofeedback || {};

  const stutterTrend = [
    { value: 18, label: "W1" }, { value: 15, label: "W2" }, { value: 14, label: "W3" },
    { value: 12, label: "W4" }, { value: 10, label: "W5" }, { value: 9, label: "W6" },
  ];

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

interface SimulationTabProps { stats: any; }

export const SimulationTab: React.FC<SimulationTabProps> = ({ stats }) => {
  const s = stats?.simulation || {};

  const successTrend = [
    { value: 70, label: "W1" }, { value: 78, label: "W2" }, { value: 82, label: "W3" },
    { value: 85, label: "W4" }, { value: 88, label: "W5" }, { value: 90, label: "W6" },
  ];

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
