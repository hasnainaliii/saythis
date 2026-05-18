import React from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, spacingX, spacingY } from "../../../../theme/Theme";
import { useStatsData } from "../../../../hooks/useStatsData";
import { StatsHeader } from "../../../../components/statistics/StatsHeader";
import { StatsTabBar } from "../../../../components/statistics/StatsTabBar";
import { OverviewTab } from "../../../../components/statistics/OverviewTab";
import { DAFTab, FAFTab } from "../../../../components/statistics/AudioToolTabs";
import { BreathingTab, DrillsTab } from "../../../../components/statistics/TherapyToolTabs";
import { BiofeedbackTab, SimulationTab } from "../../../../components/statistics/AdvancedToolTabs";

export default function StatisticsScreen() {
  const { activeTab, setActiveTab, stats, recentSessions, loading, weeklyChartData, weeklyTotal } = useStatsData();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatsHeader title="Your Progress" subtitle="Track your therapy journey" timeframeLabel="All time" />
      <StatsTabBar active={activeTab} onChange={setActiveTab} />

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={colors.secondary} />
        </View>
      ) : (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {activeTab === 'Overview' && (
            <OverviewTab stats={stats} recentSessions={recentSessions} weeklyChartData={weeklyChartData} weeklyTotal={weeklyTotal} />
          )}
          {activeTab === 'DAF' && <DAFTab stats={stats} />}
          {activeTab === 'FAF' && <FAFTab stats={stats} />}
          {activeTab === 'Breathing' && <BreathingTab stats={stats} />}
          {activeTab === 'Drills' && <DrillsTab stats={stats} />}
          {activeTab === 'Biofeedback' && <BiofeedbackTab stats={stats} />}
          {activeTab === 'Simulation' && <SimulationTab stats={stats} />}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: spacingY.xxl },
});
