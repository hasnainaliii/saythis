import React from "react";
import { View } from "react-native";
import { colors } from "../../theme/Theme";
import { StatsMetricRow } from "./StatsMetricRow";
import { StatsWeeklyActivityCard } from "./StatsWeeklyActivityCard";
import { ToolDetailCard } from "./ToolDetailCard";
import { StreakCard } from "./StreakCard";
import { ProgressLineChart } from "./ProgressLineChart";

interface DAFTabProps { stats: any; }
interface FAFTabProps { stats: any; }

const WEEKLY_DAF = [
  { label: 'M', value: 2 }, { label: 'T', value: 3 }, { label: 'W', value: 1 },
  { label: 'T', value: 0 }, { label: 'F', value: 4 }, { label: 'S', value: 2 }, { label: 'S', value: 1 },
];

const WEEKLY_FAF = [
  { label: 'M', value: 1 }, { label: 'T', value: 0 }, { label: 'W', value: 2 },
  { label: 'T', value: 3 }, { label: 'F', value: 1 }, { label: 'S', value: 0 }, { label: 'S', value: 1 },
];

const DAF_RATING_TREND = [
  { value: 3.5, label: "W1" }, { value: 3.8, label: "W2" }, { value: 4.0, label: "W3" },
  { value: 3.9, label: "W4" }, { value: 4.2, label: "W5" }, { value: 4.4, label: "W6" },
];

const FAF_RATING_TREND = [
  { value: 3.0, label: "W1" }, { value: 3.5, label: "W2" }, { value: 4.0, label: "W3" },
  { value: 4.2, label: "W4" }, { value: 4.5, label: "W5" }, { value: 4.3, label: "W6" },
];

export const DAFTab: React.FC<DAFTabProps> = ({ stats }) => {
  const s = stats?.daf || {};
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
      <StatsWeeklyActivityCard data={WEEKLY_DAF} totalMinutes={s.totalMinutes || 0} accentColor={colors.secondary} />
      <ProgressLineChart
        title="Rating trend"
        subtitle="Average session rating over time"
        data={DAF_RATING_TREND}
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

export const FAFTab: React.FC<FAFTabProps> = ({ stats }) => {
  const s = stats?.faf || {};
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
      <StatsWeeklyActivityCard data={WEEKLY_FAF} totalMinutes={s.totalMinutes || 0} accentColor={colors.categorySelfAwareness} />
      <ProgressLineChart
        title="Rating trend"
        subtitle="Average session rating over time"
        data={FAF_RATING_TREND}
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
