import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackButton } from "../../../../components/BackButton";
import ExerciseCard from "../../../../components/ExerciseCard";
import { CHAPTER_1_DATA, Exercise } from "../../../../data/chapter1Data";
import { CHAPTER_2_DATA } from "../../../../data/chapter2Data";
import { CHAPTER_ACCENT, CHAPTER_ICON } from "../../../../data/chapterConfig";
import {
  colors,
  FONTS,
  fontSizes,
  spacingX,
  spacingY,
} from "../../../../theme/Theme";

export default function ChapterDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const CHAPTERS: Record<string, typeof CHAPTER_1_DATA> = {
    '1': CHAPTER_1_DATA,
    '2': CHAPTER_2_DATA,
  };
  const chapter = CHAPTERS[id ?? ''] ?? null;
  const accent = CHAPTER_ACCENT[id ?? "1"] ?? colors.secondary;
  const chapterIcon =
    CHAPTER_ICON[id ?? "1"] ??
    ("book-outline" as keyof typeof Ionicons.glyphMap);

  const handleExercisePress = (exercise: Exercise) => {
    router.push({
      pathname: "/(main)/(tabs)/therapy/exercise",
      params: { exerciseData: JSON.stringify(exercise) },
    });
  };

  // ─── Empty / locked state ────────────────────────────────────────────────────

  if (!chapter) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.emptyNav}>
          <BackButton />
        </View>
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Ionicons
              name="lock-closed"
              size={40}
              color={colors.textDisabled}
            />
          </View>
          <Text style={styles.emptyTitle}>Chapter Locked</Text>
          <Text style={styles.emptySubtitle}>
            Complete the previous chapter to unlock this one.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // ─── Main render ─────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Full-bleed hero banner ──────────────────────────────────────── */}
        <View style={[styles.heroBanner, { backgroundColor: accent }]}>
          {/* Back button floats at the top of the hero */}
          <View style={styles.heroNav}>
            <BackButton />
          </View>

          <View style={styles.heroBannerContent}>
            <View style={styles.heroBadgeRow}>
              <View style={styles.heroBadge}>
                <Text style={styles.heroBadgeText}>{chapter.level}</Text>
              </View>
              <View style={styles.heroTimeBadge}>
                <Ionicons name="time-outline" size={12} color={colors.white} />
                <Text style={styles.heroTimeText}>
                  {chapter.duration_weeks} weeks
                </Text>
              </View>
            </View>

            <Text style={styles.heroTitle}>{chapter.title}</Text>
            <Text style={styles.heroDescription}>{chapter.description}</Text>

            <View style={styles.heroMeta}>
              <View style={styles.heroMetaItem}>
                <Ionicons
                  name="list-outline"
                  size={14}
                  color="rgba(255,255,255,0.8)"
                />
                <Text style={styles.heroMetaText}>
                  {chapter.exercises.length} exercises
                </Text>
              </View>
            </View>
          </View>

          {/* Decorative icon */}
          <View style={styles.heroIconContainer}>
            <Ionicons
              name={chapterIcon}
              size={56}
              color="rgba(255,255,255,0.15)"
            />
          </View>

          <View style={styles.heroBlob1} />
          <View style={styles.heroBlob2} />
        </View>

        {/* ── Exercises ──────────────────────────────────────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View
              style={[styles.sectionIcon, { backgroundColor: accent + "15" }]}
            >
              <Ionicons name="fitness-outline" size={18} color={accent} />
            </View>
            <Text style={styles.sectionTitle}>Exercises</Text>
          </View>

          {chapter.exercises.map((exercise, idx) => (
            <ExerciseCard
              key={exercise.id}
              id={exercise.id}
              title={exercise.title}
              category={exercise.category}
              duration_minutes={exercise.duration_minutes}
              difficulty={exercise.difficulty}
              description={exercise.description}
              onPress={() => handleExercisePress(exercise)}
              index={idx}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  scrollContent: {
    paddingHorizontal: spacingX.lg,
    paddingBottom: spacingY.xxl,
    paddingTop: 0,
  },

  // ── Empty state ──────────────────────────────────────────────────────────────
  emptyNav: {
    paddingHorizontal: spacingX.sm,
    paddingVertical: spacingY.xs,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacingX.xl,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacingY.md,
  },
  emptyTitle: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.large,
    color: colors.textDark,
    marginBottom: spacingY.xs,
  },
  emptySubtitle: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.textMuted,
    textAlign: "center",
  },

  // ── Hero banner (full-bleed) ──────────────────────────────────────────────────
  heroBanner: {
    // Negate scrollContent's horizontal padding so the banner spans edge-to-edge
    marginHorizontal: -spacingX.lg,
    paddingHorizontal: spacingX.lg,
    paddingBottom: spacingY.xl,
    paddingTop: 0,
    marginBottom: spacingY.xl,
    overflow: "hidden",
    position: "relative",
  },
  heroNav: {
    // Small breathing room above the back button, generous below before content
    paddingTop: spacingY.xs,
    paddingBottom: spacingY.sm,
    zIndex: 1,
  },
  heroBannerContent: {
    zIndex: 1,
  },
  heroBadgeRow: {
    flexDirection: "row",
    gap: spacingX.sm,
    marginBottom: spacingY.sm,
  },
  heroBadge: {
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: spacingX.sm,
    paddingVertical: 4,
    borderRadius: 8,
  },
  heroBadgeText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.tiny,
    color: colors.white,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  heroTimeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: spacingX.sm,
    paddingVertical: 4,
    borderRadius: 8,
  },
  heroTimeText: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.tiny,
    color: colors.white,
  },
  heroTitle: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.xxl,
    color: colors.white,
    marginBottom: spacingY.xxs,
  },
  heroDescription: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.medium,
    color: "rgba(255,255,255,0.85)",
    lineHeight: 24,
    marginBottom: spacingY.md,
  },
  heroMeta: {
    flexDirection: "row",
    gap: spacingX.lg,
  },
  heroMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  heroMetaText: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: "rgba(255,255,255,0.85)",
  },
  heroIconContainer: {
    position: "absolute",
    right: spacingX.md,
    bottom: spacingY.md,
  },
  heroBlob1: {
    position: "absolute",
    top: -25,
    right: -25,
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  heroBlob2: {
    position: "absolute",
    bottom: -15,
    left: 40,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.06)",
  },

  // ── Sections ─────────────────────────────────────────────────────────────────
  section: {
    marginBottom: spacingY.lg,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX.sm,
    marginBottom: spacingY.md,
  },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.large,
    color: colors.textDark,
  },
});
