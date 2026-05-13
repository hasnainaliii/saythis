import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ChapterCard from "../../../../components/ChapterCard";
import {
  colors,
  FONTS,
  fontSizes,
  spacingX,
  spacingY,
} from "../../../../theme/Theme";

const MOCK_CHAPTERS = [
  {
    id: 1,
    chapterNumber: 1,
    title: "Breathing Basics",
    description: "Mastering the airflow for speech.",
    level: "Beginner",
    duration_weeks: "2-3",
    progress: 0,
    isLocked: false,
  },
  {
    id: 2,
    chapterNumber: 2,
    title: "Fluency Shaping",
    description: "Learn to ease into your words.",
    level: "Beginner",
    duration_weeks: "2-3",
    progress: 0,
    isLocked: true,
  },
  {
    id: 3,
    chapterNumber: 3,
    title: "Rhythm & Pace",
    description: "Finding your natural speaking connection.",
    level: "Intermediate",
    duration_weeks: "3-4",
    progress: 0,
    isLocked: true,
  },
  {
    id: 4,
    chapterNumber: 4,
    title: "Confidence Building",
    description: "Overcoming fear of speaking situations.",
    level: "Intermediate",
    duration_weeks: "2",
    progress: 0,
    isLocked: true,
  },
  {
    id: 5,
    chapterNumber: 5,
    title: "Advanced Techniques",
    description: "Mastering complex speech patterns.",
    level: "Advanced",
    duration_weeks: "4",
    progress: 0,
    isLocked: true,
  },
];

export default function TherapyScreen() {
  const router = useRouter();

  const handlePressChapter = async (id: number) => {
    const seen = await AsyncStorage.getItem(`chapter_${id}_objectives_seen`);
    if (seen) {
      router.push({
        pathname: "/(main)/(tabs)/therapy/[id]",
        params: { id },
      });
    } else {
      router.push({
        pathname: "/(main)/(tabs)/therapy/objectives" as any,
        params: { id },
      });
    }
  };

  const totalChapters = MOCK_CHAPTERS.length;
  const completedChapters = MOCK_CHAPTERS.filter(
    (c) => c.progress === 100,
  ).length;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleRow}>
          <View style={styles.titleBlock}>
            <Text style={styles.pageTitle}>Therapy</Text>
          </View>
        </View>
        <View style={styles.headerDivider} />

        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroLabel}>SPEECH THERAPY</Text>
          <Text style={styles.heroTitle}>Your Roadmap</Text>
          <Text style={styles.heroSubtitle}>
            Step-by-step to confident speech
          </Text>

          <View style={styles.heroBottomRow}>
            <Text style={styles.statText}>{totalChapters} chapters</Text>
            <View style={styles.progressPill}>
              <Text style={styles.progressPillText}>
                {completedChapters}/{totalChapters}
              </Text>
            </View>
          </View>

          {/* decorative blobs */}
          <View style={styles.heroBlob1} />
          <View style={styles.heroBlob2} />
        </View>

        {/* Currently active hint */}
        <View style={styles.activeHint}>
          <View style={styles.activeHintDot} />
          <Text style={styles.activeHintText}>
            Start with Chapter 01 — unlock more as you progress
          </Text>
        </View>

        {/* Chapter list */}
        <View style={styles.timelineContainer}>
          {MOCK_CHAPTERS.map((chapter, index) => {
            const isLast = index === MOCK_CHAPTERS.length - 1;
            return (
              <View key={chapter.id} style={styles.chapterWrapper}>
                <ChapterCard
                  id={chapter.id}
                  chapterNumber={chapter.chapterNumber}
                  title={chapter.title}
                  description={chapter.description}
                  progress={chapter.progress}
                  isLocked={chapter.isLocked}
                  onPress={() => handlePressChapter(chapter.id)}
                />
                {!isLast && (
                  <View style={styles.connectorLine}>
                    <View style={styles.connectorDot} />
                    <View style={styles.connectorDash} />
                    <View style={styles.connectorDot} />
                  </View>
                )}
              </View>
            );
          })}
        </View>
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
    padding: spacingX.lg,
    paddingTop: spacingY.md,
    paddingBottom: spacingY.xxl,
  },

  // Header
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacingX.md,
  },
  titleBlock: {
    marginBottom: spacingY.md,
    flex: 1,
  },
  pageTitle: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.xxl,
    color: colors.libraryText,
  },
  headerDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.libraryBorder,
    marginBottom: spacingY.lg,
  },

  // Hero
  hero: {
    backgroundColor: colors.secondary,
    marginHorizontal: -spacingX.lg, // Negate scrollContent padding to span full width
    paddingHorizontal: spacingX.lg,
    paddingVertical: spacingY.xl,
    marginBottom: spacingY.lg,
    overflow: "hidden",
    position: "relative",
  },
  heroLabel: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.tiny,
    color: colors.white,
    opacity: 0.85,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: spacingY.xs,
  },
  heroTitle: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.xxl,
    color: colors.white,
    marginBottom: spacingY.xxs,
  },
  heroSubtitle: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.medium,
    color: "rgba(255,255,255,0.8)",
    marginBottom: spacingY.xl,
  },
  heroBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    color: colors.white,
  },
  progressPill: {
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: spacingX.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  progressPillText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.tiny,
    color: colors.white,
  },
  heroBlob1: {
    position: "absolute",
    top: -30,
    right: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  heroBlob2: {
    position: "absolute",
    bottom: -20,
    left: -20,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255,255,255,0.06)",
  },

  // Active hint
  activeHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: spacingX.sm,
    marginBottom: spacingY.lg,
  },
  activeHintDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
  activeHintText: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.textMuted,
  },

  // Timeline
  timelineContainer: {},
  chapterWrapper: {
    position: "relative",
  },
  connectorLine: {
    alignItems: "center",
    justifyContent: "center",
    height: 24,
    marginBottom: spacingY.xs,
    gap: 3,
  },
  connectorDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
  },
  connectorDash: {
    width: 2,
    height: 10,
    backgroundColor: colors.border,
    borderRadius: 1,
  },
});
