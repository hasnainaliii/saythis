import React from "react";
import { View } from "react-native";
import { colors } from "../../theme/Theme";
import { StatsMetricRow } from "./StatsMetricRow";
import { ToolBreakdownGrid } from "./ToolBreakdownGrid";
import { ToolDetailCard } from "./ToolDetailCard";
import { ProgressBarCard } from "./ProgressBarCard";
import { StreakCard } from "./StreakCard";
import { ToolDistributionChart } from "./ToolDistributionChart";
import { ProgressLineChart } from "./ProgressLineChart";

interface BreathingTabProps { stats: any; }

export const BreathingTab: React.FC<BreathingTabProps> = ({ stats }) => {
  const b = stats?.breathing || {};
  const situations = b.situationBreakdown || {};

  const breathingPie = [
    { label: "Box", value: b.boxBreathingSessions || 0, color: colors.categoryCBT },
    { label: "Diaphragmatic", value: b.diaphragmaticSessions || 0, color: colors.secondary },
    { label: "Pre-Speech", value: b.preSpeechSessions || 0, color: colors.categorySelfAdvocacy },
  ].filter((s) => s.value > 0);

  const breathingTrend = [
    { value: 2, label: "W1" }, { value: 3, label: "W2" }, { value: 2, label: "W3" },
    { value: 4, label: "W4" }, { value: 5, label: "W5" }, { value: 4, label: "W6" },
  ];

  return (
    <View>
      <StatsMetricRow items={[
        { label: "Sessions", value: b.totalSessions || 0, color: colors.categoryCBT },
        { label: "Minutes", value: b.totalMinutes || 0 },
        { label: "Rating", value: b.avgRating ? b.avgRating.toFixed(1) : "—", unit: "/5", color: colors.star },
      ]} />
      {breathingPie.length > 0 && (
        <ToolDistributionChart
          title="Technique breakdown"
          slices={breathingPie}
          centerLabel="sessions"
          centerValue={String(b.totalSessions || 0)}
        />
      )}
      <ToolBreakdownGrid items={[
        { icon: "square-outline", label: "Box", value: b.boxBreathingSessions || 0, color: colors.categoryCBT },
        { icon: "body-outline", label: "Diaphragmatic", value: b.diaphragmaticSessions || 0, color: colors.secondary },
        { icon: "flag-outline", label: "Pre-Speech", value: b.preSpeechSessions || 0, color: colors.categorySelfAdvocacy },
      ]} />
      {Object.keys(situations).length > 0 && (
        <ProgressBarCard
          title="Situation breakdown"
          items={Object.entries(situations).map(([name, count]) => ({
            label: name,
            value: count as number,
            color: colors.categoryCBT,
          }))}
        />
      )}
      <ProgressLineChart
        title="Session frequency"
        subtitle="Sessions per week"
        data={breathingTrend}
        accentColor={colors.categoryCBT}
      />
      <StreakCard
        currentStreak={b.currentStreak || 0}
        bestStreak={b.currentStreak || 0}
        message={b.currentStreak > 0 ? `${b.currentStreak} day breathing streak — keep it going.` : "Start your first breathing streak today."}
      />
    </View>
  );
};

interface DrillsTabProps { stats: any; }

export const DrillsTab: React.FC<DrillsTabProps> = ({ stats }) => {
  const d = stats?.drills || {};

  const scoreTrend = [
    { value: 70, label: "W1" }, { value: 75, label: "W2" }, { value: 80, label: "W3" },
    { value: 78, label: "W4" }, { value: 85, label: "W5" }, { value: 88, label: "W6" },
  ];

  return (
    <View>
      <StatsMetricRow items={[
        { label: "Sessions", value: d.totalSessions || 0, color: colors.categoryEducation },
        { label: "Minutes", value: d.totalMinutes || 0 },
        { label: "Rating", value: d.avgRating ? d.avgRating.toFixed(1) : "—", unit: "/5", color: colors.star },
      ]} />
      <ToolDetailCard
        icon="mic-outline"
        accentColor={colors.categoryEducation}
        title="Gentle Onset"
        highlight={{ label: "Avg score", value: `${d.avgGentleScore || 0}%` }}
        rows={[{ label: "Sessions", value: d.gentleOnsetSessions || 0 }]}
      />
      <ToolDetailCard
        icon="speedometer-outline"
        accentColor={colors.secondary}
        title="Prolonged Speech"
        highlight={{ label: "Avg target", value: `${d.avgProlongedWpm || 0} wpm` }}
        rows={[{ label: "Sessions", value: d.prolongedSpeechSessions || 0 }]}
      />
      <ProgressLineChart
        title="Score progression"
        subtitle="Gentle onset accuracy over time"
        data={scoreTrend}
        accentColor={colors.categoryEducation}
        yAxisSuffix="%"
      />
      <StreakCard
        currentStreak={d.currentStreak || 0}
        bestStreak={d.currentStreak || 0}
        message="Daily drills build muscle memory for fluent speech."
      />
    </View>
  );
};
