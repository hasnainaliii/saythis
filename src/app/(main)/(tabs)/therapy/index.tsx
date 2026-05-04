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

  const handlePressChapter = (id: number) => {
    router.push({
      pathname: "/(main)/(tabs)/therapy/[id]",
      params: { id },
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Your Roadmap</Text>
          <Text style={styles.subtitle}>Step-by-step to confident speech.</Text>
        </View>

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
                  <View style={styles.connectorContainer}>
                    <View style={styles.dashedLine} />
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
    paddingBottom: spacingY.xxl,
  },
  header: {
    marginBottom: spacingY.xl,
    marginTop: spacingY.md,
  },
  title: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.xxl,
    color: colors.textDark,
    marginBottom: spacingY.xs,
  },
  subtitle: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.medium,
    color: colors.textMuted,
  },
  timelineContainer: {},
  chapterWrapper: {
    position: "relative",
  },
  connectorContainer: {
    position: "absolute",
    left: spacingX.lg + 24,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: spacingY.lg,
    bottom: 0,
    zIndex: -1,
  },
  dashedLine: {
    width: 2,
    height: "100%",
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: colors.border,
    position: "absolute",
    left: 36,
    top: -12,
    bottom: -12,
    zIndex: -1,
  },
});
