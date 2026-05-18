import React from "react";
import { View } from "react-native";
import { colors } from "../../theme/Theme";
import { StatsHeroCard } from "./StatsHeroCard";
import { StatsWeeklyActivityCard, WeeklyActivityDatum } from "./StatsWeeklyActivityCard";
import { StatsMetricRow } from "./StatsMetricRow";
import { RecentSessionsCard } from "./RecentSessionsCard";
import { StreakCard } from "./StreakCard";

interface OverviewTabProps {
  stats: any;
  recentSessions: any[];
  weeklyChartData: WeeklyActivityDatum[];
  weeklyTotal: number;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ stats, recentSessions, weeklyChartData, weeklyTotal }) => {
  const c = stats?.combined || {};
  const daf = stats?.daf || {};
  const faf = stats?.faf || {};
  const breathing = stats?.breathing || {};
  const drills = stats?.drills || {};

  const lastSession = c.lastSessionAt ? new Date(c.lastSessionAt).toLocaleDateString() : "No sessions";

  return (
    <View>
      <StatsHeroCard
        totalMinutes={c.totalToolMinutes || 0}
        totalSessions={c.totalSessions || (daf.totalSessions || 0) + (faf.totalSessions || 0)}
        currentStreak={c.currentStreak || 0}
        bestStreak={c.bestStreak || 0}
        activeDays={c.activeDays || 0}
        lastSessionLabel={lastSession}
      />
      <StatsMetricRow items={[
        { label: "DAF", value: daf.totalSessions || 0, caption: `${daf.totalMinutes || 0} min`, color: colors.secondary },
        { label: "FAF", value: faf.totalSessions || 0, caption: `${faf.totalMinutes || 0} min`, color: colors.categorySelfAwareness },
        { label: "Breathing", value: breathing.totalSessions || 0, caption: `${breathing.totalMinutes || 0} min`, color: colors.categoryCBT },
      ]} />
      <StatsMetricRow items={[
        { label: "Drills", value: drills.totalSessions || 0, caption: `${drills.totalMinutes || 0} min`, color: colors.categoryEducation },
        { label: "Avg Rating", value: daf.avgRating ? daf.avgRating.toFixed(1) : "—", unit: "/5", color: colors.star },
        { label: "Active Days", value: c.activeDays || 0, color: colors.textDark },
      ]} />
      <StatsWeeklyActivityCard data={weeklyChartData} totalMinutes={weeklyTotal} />
      <RecentSessionsCard sessions={recentSessions} />
    </View>
  );
};
