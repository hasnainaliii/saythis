import React from "react";
import { View } from "react-native";
import { colors } from "../../theme/Theme";
import { StatsMetricRow } from "./StatsMetricRow";
import { ToolDetailCard } from "./ToolDetailCard";
import { ToolBreakdownGrid } from "./ToolBreakdownGrid";
import { StreakCard } from "./StreakCard";

interface BiofeedbackTabProps { stats: any; }

export const BiofeedbackTab: React.FC<BiofeedbackTabProps> = ({ stats }) => {
  const b = stats?.biofeedback || {};

  return (
    <View>
      <StatsMetricRow items={[
        { label: "Sessions", value: b.totalSessions || 0, color: colors.secondary },
        { label: "Minutes", value: b.totalMinutes || 0 },
        { label: "Rating", value: b.avgRating ? b.avgRating.toFixed(1) : "—", unit: "/5", color: colors.star },
      ]} />
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

  return (
    <View>
      <StatsMetricRow items={[
        { label: "Sessions", value: s.totalSessions || 0, color: colors.warning },
        { label: "Minutes", value: s.totalMinutes || 0 },
        { label: "Rating", value: s.avgRating ? s.avgRating.toFixed(1) : "—", unit: "/5", color: colors.star },
      ]} />
      <ToolBreakdownGrid items={[
        { icon: "cafe-outline", label: "Coffee orders", value: s.coffeeSessions || 0, color: colors.warning },
        { icon: "call-outline", label: "Phone calls", value: s.callSessions || 0, color: colors.categorySelfAwareness },
      ]} />
      <ToolDetailCard
        icon="trophy-outline"
        accentColor={colors.warning}
        title="Performance"
        highlight={{ label: "Avg success rate", value: `${s.avgCompletionScore || 0}%` }}
        rows={[
          { label: "Coffee orders", value: s.coffeeSessions || 0 },
          { label: "Phone calls", value: s.callSessions || 0 },
        ]}
      />
      <StreakCard
        currentStreak={s.currentStreak || 0}
        bestStreak={s.currentStreak || 0}
        message="Real-world simulations transfer clinic fluency to daily life."
      />
    </View>
  );
};
