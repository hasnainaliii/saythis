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

interface BreathingTabProps { stats: any; allSessions?: any[]; }

const computeSessionFrequencyTrend = (sessions: any[] = [], toolTypes: string[]) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const weekTrend = [];
  for (let w = 5; w >= 0; w--) {
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - (w * 7) - today.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    let count = 0;
    for (const s of sessions) {
      if (!toolTypes.includes(s.toolType)) continue;
      const sDate = new Date(s.startedAt);
      if (sDate >= weekStart && sDate <= weekEnd) {
        count++;
      }
    }
    weekTrend.push({ value: count, label: `W${6 - w}` });
  }
  return weekTrend;
};

const computeDrillScoreTrend = (sessions: any[] = []) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const weekTrend = [];
  for (let w = 5; w >= 0; w--) {
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - (w * 7) - today.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    let scoreSum = 0;
    let scoreCount = 0;
    for (const s of sessions) {
      if (s.toolType !== 'GENTLE_ONSET') continue;
      const sDate = new Date(s.startedAt);
      if (sDate >= weekStart && sDate <= weekEnd && s.averageScore !== undefined) {
        scoreSum += s.averageScore;
        scoreCount++;
      }
    }
    const avg = scoreCount > 0 ? scoreSum / scoreCount : 0;
    weekTrend.push({ value: parseFloat(avg.toFixed(1)), label: `W${6 - w}` });
  }
  return weekTrend;
};

export const BreathingTab: React.FC<BreathingTabProps> = ({ stats, allSessions = [] }) => {
  const b = stats?.breathing || {};
  const situations = b.situationBreakdown || {};

  const breathingPie = [
    { label: "Box", value: b.boxBreathingSessions || 0, color: colors.categoryCBT },
    { label: "Diaphragmatic", value: b.diaphragmaticSessions || 0, color: colors.secondary },
    { label: "Pre-Speech", value: b.preSpeechSessions || 0, color: colors.categorySelfAdvocacy },
  ].filter((s) => s.value > 0);

  const breathingTrend = computeSessionFrequencyTrend(allSessions, ['BOX_BREATHING', 'DIAPHRAGMATIC', 'PRE_SPEECH']);

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

interface DrillsTabProps { stats: any; allSessions?: any[]; }

export const DrillsTab: React.FC<DrillsTabProps> = ({ stats, allSessions = [] }) => {
  const d = stats?.drills || {};

  const scoreTrend = computeDrillScoreTrend(allSessions);

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
