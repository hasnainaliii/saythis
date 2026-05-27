import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HomeHero } from "../../../../components/home/HomeHero";
import { MetricsSection } from "../../../../components/home/MetricsSection";
import { MindfulTracker } from "../../../../components/home/MindfulTracker";
import { useAuthStore } from "../../../../store/authStore";
import { useMoodStore } from "../../../../store/moodStore";
import { colors } from "../../../../theme/Theme";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
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
        />

        <MetricsSection score={80} scoreStatus="Healthy" mood={currentMood} />

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
