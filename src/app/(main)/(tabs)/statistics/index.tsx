import React from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  BiofeedbackTab,
  SimulationTab,
} from "../../../../components/statistics/AdvancedToolTabs";
import {
  DAFTab,
  FAFTab,
} from "../../../../components/statistics/AudioToolTabs";
import { OverviewTab } from "../../../../components/statistics/OverviewTab";
import { StatsHeader } from "../../../../components/statistics/StatsHeader";
import { StatsTabBar } from "../../../../components/statistics/StatsTabBar";
import {
  BreathingTab,
  DrillsTab,
} from "../../../../components/statistics/TherapyToolTabs";
import { useStatsData } from "../../../../hooks/useStatsData";
import { colors } from "../../../../theme/Theme";

export default function StatisticsScreen() {
  const {
    activeTab,
    setActiveTab,
    stats,
    recentSessions,
    allSessions,
    loading,
    weeklyChartData,
    weeklyTotal,
    weeklyTrend,
  } = useStatsData();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatsHeader
        title="Your Progress"
        subtitle="Track your therapy journey"
        timeframeLabel="All time"
      />
      <StatsTabBar active={activeTab} onChange={setActiveTab} />

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={colors.secondary} />
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {activeTab === "Overview" && (
            <OverviewTab
              stats={stats}
              recentSessions={recentSessions}
              weeklyChartData={weeklyChartData}
              weeklyTotal={weeklyTotal}
              weeklyTrend={weeklyTrend}
            />
          )}
          {activeTab === "DAF" && (
            <DAFTab stats={stats} allSessions={allSessions} />
          )}
          {activeTab === "FAF" && (
            <FAFTab stats={stats} allSessions={allSessions} />
          )}
          {activeTab === "Breathing" && (
            <BreathingTab stats={stats} allSessions={allSessions} />
          )}
          {activeTab === "Drills" && (
            <DrillsTab stats={stats} allSessions={allSessions} />
          )}
          {activeTab === "Biofeedback" && (
            <BiofeedbackTab stats={stats} allSessions={allSessions} />
          )}
          {activeTab === "Simulation" && (
            <SimulationTab stats={stats} allSessions={allSessions} />
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 120 },
});
