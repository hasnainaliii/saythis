import { useRouter } from "expo-router";
import { Play, Sparkles, Stethoscope, TrendingUp, BookOpen } from "lucide-react-native";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../../../components/Button";
import { colors, FONTS, fontSizes, spacingX, spacingY } from "../../../../theme/Theme";

const motivationalQuotes = [
  "Your voice matters. Speak with confidence.",
  "Every word is a step forward.",
  "Progress over perfection.",
  "Small steps lead to big changes.",
];

export default function HomeScreen() {
  const router = useRouter();
  const quoteIndex = 0;
  const dailyStreak = 5;
  const minutesPracticed = 12;
  const weeklyGoal = 30;

  const handleStartExercise = () => {
    router.push("/(main)/(tabs)/therapy");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.greetingSection}>
          <View style={styles.greetingRow}>
            <View style={styles.greetingTextContainer}>
              <Text style={styles.greetingText}>Hello,</Text>
              <Text style={styles.userName}>Let&apos;s practice today</Text>
            </View>
            <View style={styles.streakBadge}>
              <Sparkles size={16} color={colors.star} />
              <Text style={styles.streakText}>{dailyStreak} day streak</Text>
            </View>
          </View>
          <View style={styles.quoteCard}>
            <Text style={styles.quoteText}>{motivationalQuotes[quoteIndex]}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today&apos;s Practice</Text>
          <TouchableOpacity
            style={styles.exerciseCard}
            activeOpacity={0.9}
            onPress={handleStartExercise}
          >
            <View style={styles.exerciseCardImage}>
              <View style={styles.exerciseCardIcon}>
                <Play size={28} color={colors.white} />
              </View>
            </View>
            <View style={styles.exerciseCardContent}>
              <View style={styles.exerciseTag}>
                <Text style={styles.exerciseTagText}>BEGINNER</Text>
              </View>
              <Text style={styles.exerciseTitle}>Breathing Basics</Text>
              <Text style={styles.exerciseDesc}>
                Mastering the airflow for speech
              </Text>
              <View style={styles.exerciseMeta}>
                <Text style={styles.exerciseMetaText}>
                  {minutesPracticed}/{weeklyGoal} min this week
                </Text>
              </View>
              <Button
                title="Start Exercise"
                onPress={handleStartExercise}
                variant="primary"
                size="small"
                style={styles.startButton}
              />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <View style={styles.quickAccessRow}>
            <TouchableOpacity
              style={[styles.quickCard, styles.therapyCard]}
              activeOpacity={0.9}
              onPress={() => router.push("/(main)/(tabs)/therapy")}
            >
              <View style={styles.quickCardIconContainer}>
                <Stethoscope size={24} color={colors.categoryCBT} />
              </View>
              <Text style={styles.quickCardTitle}>Therapy</Text>
              <Text style={styles.quickCardDesc}>Continue your journey</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.quickCard, styles.libraryCard]}
              activeOpacity={0.9}
              onPress={() => router.push("/(main)/(tabs)/library")}
            >
              <View style={styles.quickCardIconContainer}>
                <BookOpen size={24} color={colors.categoryEducation} />
              </View>
              <Text style={styles.quickCardTitle}>Library</Text>
              <Text style={styles.quickCardDesc}>Explore new tools</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Progress</Text>
          <View style={styles.progressCard}>
            <View style={styles.progressRow}>
              <View style={styles.progressItem}>
                <View style={styles.progressIconContainer}>
                  <TrendingUp size={20} color={colors.secondary} />
                </View>
                <Text style={styles.progressValue}>{minutesPracticed}</Text>
                <Text style={styles.progressLabel}>Minutes</Text>
              </View>
              <View style={styles.progressDivider} />
              <View style={styles.progressItem}>
                <View style={styles.progressIconContainer}>
                  <Sparkles size={20} color={colors.star} />
                </View>
                <Text style={styles.progressValue}>{dailyStreak}</Text>
                <Text style={styles.progressLabel}>Day Streak</Text>
              </View>
              <View style={styles.progressDivider} />
              <View style={styles.progressItem}>
                <View style={styles.progressIconContainer}>
                  <BookOpen size={20} color={colors.categoryEducation} />
                </View>
                <Text style={styles.progressValue}>3</Text>
                <Text style={styles.progressLabel}>Tools Used</Text>
              </View>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBg}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${(minutesPracticed / weeklyGoal) * 100}%`,
                    },
                  ]}
                />
              </View>
              <Text style={styles.progressGoalText}>
                Weekly goal: {weeklyGoal} minutes
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  scrollContent: {
    paddingBottom: spacingY.xxl,
  },
  greetingSection: {
    paddingHorizontal: spacingX.lg,
    paddingTop: spacingY.lg,
  },
  greetingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacingY.md,
  },
  greetingTextContainer: {
    flex: 1,
  },
  greetingText: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.large,
    color: colors.textMuted,
  },
  userName: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.xxl,
    color: colors.textDark,
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    paddingHorizontal: spacingX.md,
    paddingVertical: spacingY.xs,
    borderRadius: 20,
    gap: 4,
  },
  streakText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    color: colors.textDark,
  },
  quoteCard: {
    backgroundColor: colors.secondary_20,
    borderRadius: 16,
    padding: spacingX.lg,
  },
  quoteText: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.medium,
    color: colors.textDark,
    fontStyle: "italic",
  },
  section: {
    marginTop: spacingY.xl,
    paddingHorizontal: spacingX.lg,
  },
  sectionTitle: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.large,
    color: colors.textDark,
    marginBottom: spacingY.md,
  },
  exerciseCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  exerciseCardImage: {
    height: 120,
    backgroundColor: colors.secondary_10,
    justifyContent: "center",
    alignItems: "center",
  },
  exerciseCardIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
  exerciseCardContent: {
    padding: spacingX.lg,
  },
  exerciseTag: {
    backgroundColor: colors.categoryCBT + "20",
    paddingHorizontal: spacingX.xs,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: spacingY.xs,
  },
  exerciseTagText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.tiny,
    color: colors.categoryCBT,
  },
  exerciseTitle: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.xl,
    color: colors.textDark,
    marginBottom: 4,
  },
  exerciseDesc: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.medium,
    color: colors.textMuted,
    marginBottom: spacingY.sm,
  },
  exerciseMeta: {
    marginBottom: spacingY.sm,
  },
  exerciseMetaText: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.textMuted,
  },
  startButton: {
    alignSelf: "flex-start",
  },
  quickAccessRow: {
    flexDirection: "row",
    gap: spacingX.md,
  },
  quickCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: spacingX.lg,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  therapyCard: {},
  libraryCard: {},
  quickCardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.primary_20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacingY.sm,
  },
  quickCardTitle: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.textDark,
    marginBottom: 4,
  },
  quickCardDesc: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.textMuted,
  },
  progressCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: spacingX.lg,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: spacingY.md,
  },
  progressItem: {
    flex: 1,
    alignItems: "center",
  },
  progressIconContainer: {
    marginBottom: spacingY.xs,
  },
  progressValue: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.xl,
    color: colors.textDark,
  },
  progressLabel: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.textMuted,
  },
  progressDivider: {
    width: 1,
    backgroundColor: colors.border,
    alignSelf: "stretch",
    marginHorizontal: spacingX.md,
  },
  progressBarContainer: {
    marginTop: spacingY.sm,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: colors.primary_20,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: colors.secondary,
    borderRadius: 4,
  },
  progressGoalText: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.textMuted,
    marginTop: spacingY.xs,
    textAlign: "center",
  },
  bottomSpacer: {
    height: spacingY.xxl,
  },
});
