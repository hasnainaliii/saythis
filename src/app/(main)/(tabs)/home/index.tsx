import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HomeHero } from "../../../../components/home/HomeHero";
import { MetricsSection } from "../../../../components/home/MetricsSection";
import { MindfulTracker } from "../../../../components/home/MindfulTracker";
import { useAuthStore } from "../../../../store/authStore";
import { useMoodStore } from "../../../../store/moodStore";
import { colors } from "../../../../theme/Theme";

export default function HomeScreen() {
  const user = useAuthStore((state) => state.user);
  const { currentMood, loadMood } = useMoodStore();

  React.useEffect(() => {
    loadMood();
  }, []);

  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Extract first name for greeting
  const firstName = user?.full_name?.split(" ")[0] || "User";

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
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
        />

        <MetricsSection score={80} scoreStatus="Healthy" mood={currentMood} />

        <MindfulTracker />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  scroll: {
    backgroundColor: colors.primary,
    paddingBottom: 120,
  },
});
