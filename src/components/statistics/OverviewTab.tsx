import React from "react";
import { View } from "react-native";
import { colors } from "../../theme/Theme";
import { StatsHeroCard } from "./StatsHeroCard";
import { StatsWeeklyActivityCard, WeeklyActivityDatum } from "./StatsWeeklyActivityCard";
import { StatsMetricRow } from "./StatsMetricRow";
import { RecentSessionsCard } from "./RecentSessionsCard";
import { ToolDistributionChart } from "./ToolDistributionChart";
import { ProgressLineChart } from "./ProgressLineChart";

interface OverviewTabProps {
  stats: any;
  recentSessions: any[];
  weeklyChartData: WeeklyActivityDatum[];
  weeklyTotal: number;
  weeklyTrend?: any[];
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ stats, recentSessions, weeklyChartData, weeklyTotal, weeklyTrend = [] }) => {
  const c = stats?.combined || {};
  const breathing = stats?.breathing || {};
  const drills = stats?.drills || {};
  const bio = stats?.biofeedback || {};
  const sim = stats?.simulation || {};

  const lastSession = c.lastSessionAt ? new Date(c.lastSessionAt).toLocaleDateString() : "No sessions";
  const totalSessions = c.totalSessions || (breathing.totalSessions || 0) + (drills.totalSessions || 0) + (bio.totalSessions || 0) + (sim.totalSessions || 0);

  const pieSlices = [
    { label: "Breathing", value: breathing.totalSessions || 0, color: colors.categoryCBT },
    { label: "Drills", value: drills.totalSessions || 0, color: colors.categoryEducation },
    { label: "Biofeedback", value: bio.totalSessions || 0, color: colors.categorySelfAdvocacy },
    { label: "Simulation", value: sim.totalSessions || 0, color: colors.warning },
  ].filter((s) => s.value > 0);

  return (
    <View>
      <StatsHeroCard
        totalMinutes={c.totalToolMinutes || 0}
        totalSessions={totalSessions}
        currentStreak={c.currentStreak || 0}
        bestStreak={c.bestStreak || 0}
        activeDays={c.activeDays || 0}
        lastSessionLabel={lastSession}
      />
      <StatsMetricRow items={[
        { label: "Breathing", value: breathing.totalSessions || 0, caption: `${Math.round(breathing.totalMinutes || 0)} min`, color: colors.categoryCBT },
        { label: "Drills", value: drills.totalSessions || 0, caption: `${Math.round(drills.totalMinutes || 0)} min`, color: colors.categoryEducation },
        { label: "Biofeedback", value: bio.totalSessions || 0, caption: `${Math.round(bio.totalMinutes || 0)} min`, color: colors.categorySelfAdvocacy },
      ]} />
      <ToolDistributionChart
        title="Session distribution"
        slices={pieSlices.length > 0 ? pieSlices : [{ label: "No data", value: 1, color: colors.libraryBorder }]}
        centerLabel="sessions"
        centerValue={String(totalSessions)}
      />
      <StatsWeeklyActivityCard data={weeklyChartData} totalMinutes={weeklyTotal} />
      <ProgressLineChart
        title="Practice trend"
        subtitle="Minutes per week"
        data={weeklyTrend}
        yAxisSuffix=" min"
      />
      <RecentSessionsCard sessions={recentSessions} />
    </View>
  );
};
