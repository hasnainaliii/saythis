import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HomeHero } from "../../../../components/home/HomeHero";
import { HomeTipsCard } from "../../../../components/home/HomeTipsCard";
import { MetricsSection } from "../../../../components/home/MetricsSection";
import { MindfulTracker } from "../../../../components/home/MindfulTracker";
import { useAuthStore } from "../../../../store/authStore";
import { useMoodStore } from "../../../../store/moodStore";
import { useTrackerStore } from "../../../../store/trackerStore";
import { colors } from "../../../../theme/Theme";

const getScoreStatus = (score: number | null): string => {
  if (score === null) return "No data";
  if (score <= 5) return "Healthy";
  if (score <= 15) return "Moderate";
  if (score <= 30) return "Notable";
  return "Significant";
};

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const user = useAuthStore((state) => state.user);
  const { currentMood, loadMood } = useMoodStore();
  const { stutterScore, loadAll } = useTrackerStore();

  React.useEffect(() => {
    loadMood();
    loadAll();
  }, []);

  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const firstName = user?.full_name?.split(" ")[0] || "User";
  const displayScore = stutterScore ?? 0;

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <HomeHero
          userName={firstName}
          dateString={dateStr}
          level="Pro"
          fluencyPercent={80}
          mood={currentMood}
          topInset={insets.top}
          avatarUrl={user?.avatar_url}
          email={user?.email}
        />

        <MetricsSection
          score={displayScore}
          scoreStatus={getScoreStatus(stutterScore)}
        />

        <HomeTipsCard />

        <MindfulTracker />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondary,
  },
  scroll: {
    backgroundColor: colors.primary,
    paddingBottom: 120,
  },
});
