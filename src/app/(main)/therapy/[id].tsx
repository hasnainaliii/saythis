import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../../components/Button";
import ExerciseCard from "../../../components/ExerciseCard";
import { CHAPTER_1_DATA, Exercise } from "../../../data/chapter1Data";
import {
  colors,
  FONTS,
  fontSizes,
  spacingX,
  spacingY,
} from "../../../theme/Theme";

export default function ChapterDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const chapter = id === "1" ? CHAPTER_1_DATA : null;

  const handleExercisePress = (exercise: Exercise) => {
    router.push({
      pathname: "/(main)/therapy/exercise",
      params: { exerciseData: JSON.stringify(exercise) },
    });
  };

  if (!chapter) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Button
            title="Back"
            onPress={() => router.back()}
            variant="outline"
            size="small"
            icon={
              <Ionicons name="arrow-back" size={16} color={colors.secondary} />
            }
            iconPosition="left"
          />
        </View>
        <View style={styles.emptyState}>
          <Ionicons
            name="lock-closed-outline"
            size={64}
            color={colors.black_text}
          />
          <Text style={styles.emptyTitle}>Chapter Locked</Text>
          <Text style={styles.emptySubtitle}>
            Complete the previous chapter to unlock this one.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Button
            title="Back"
            onPress={() => router.back()}
            variant="outline"
            size="small"
            icon={
              <Ionicons name="arrow-back" size={16} color={colors.secondary} />
            }
            iconPosition="left"
          />
        </View>

        <View style={styles.chapterInfo}>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>{chapter.level}</Text>
          </View>
          <Text style={styles.chapterTitle}>{chapter.title}</Text>
          <Text style={styles.chapterDescription}>{chapter.description}</Text>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons
                name="time-outline"
                size={16}
                color={colors.black_text}
              />
              <Text style={styles.metaText}>
                {chapter.duration_weeks} weeks
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons
                name="list-outline"
                size={16}
                color={colors.black_text}
              />
              <Text style={styles.metaText}>
                {chapter.exercises.length} exercises
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Learning Objectives</Text>
          <View style={styles.objectivesContainer}>
            {chapter.learning_objectives.map((objective, index) => (
              <View key={index} style={styles.objectiveItem}>
                <View style={styles.objectiveBullet}>
                  <Ionicons name="checkmark" size={12} color={colors.white} />
                </View>
                <Text style={styles.objectiveText}>{objective}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Exercises</Text>
          {chapter.exercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              id={exercise.id}
              title={exercise.title}
              category={exercise.category}
              duration_minutes={exercise.duration_minutes}
              difficulty={exercise.difficulty}
              description={exercise.description}
              onPress={() => handleExercisePress(exercise)}
            />
          ))}
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
    paddingBottom: spacingY.xxl,
  },
  header: {
    marginBottom: spacingY.md,
    alignItems: "flex-start",
  },
  chapterInfo: {
    marginBottom: spacingY.xl,
  },
  levelBadge: {
    backgroundColor: colors.secondary + "20",
    paddingHorizontal: spacingX.md,
    paddingVertical: spacingY.xs,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: spacingY.sm,
  },
  levelText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    color: colors.secondary,
  },
  chapterTitle: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.xxl,
    color: colors.black,
    marginBottom: spacingY.xs,
  },
  chapterDescription: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.medium,
    color: colors.black_text,
    lineHeight: 24,
    marginBottom: spacingY.md,
  },
  metaRow: {
    flexDirection: "row",
    gap: spacingX.lg,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.black_text,
  },
  section: {
    marginBottom: spacingY.lg,
  },
  sectionTitle: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.large,
    color: colors.black,
    marginBottom: spacingY.md,
  },
  objectivesContainer: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacingX.md,
  },
  objectiveItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: spacingY.sm,
    gap: spacingX.sm,
  },
  objectiveBullet: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.secondary,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  objectiveText: {
    flex: 1,
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.black,
    lineHeight: 22,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacingX.xl,
  },
  emptyTitle: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.xl,
    color: colors.black,
    marginTop: spacingY.md,
    marginBottom: spacingY.xs,
  },
  emptySubtitle: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.medium,
    color: colors.black_text,
    textAlign: "center",
  },
});
