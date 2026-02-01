import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ChapterCard from "../../../components/ChapterCard";
import {
  colors,
  FONTS,
  fontSizes,
  spacingX,
  spacingY,
} from "../../../theme/Theme";

// Mock Data matching the user's provided structure (plus UI fields)
const MOCK_CHAPTERS = [
  {
    id: 1,
    chapterNumber: 1,
    title: "Breathing Basics",
    description: "Mastering the airflow for speech.",
    level: "Beginner",
    duration_weeks: "2-3",
    progress: 60,
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
    router.push(`/(main)/therapy/${id}`);
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
    color: "#1A2B49",
    marginBottom: spacingY.xs,
  },
  subtitle: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.medium,
    color: "#5A6B89",
  },
  timelineContainer: {
    // Add any specific styling for the timeline container if needed
  },
  chapterWrapper: {
    position: "relative",
  },
  connectorContainer: {
    position: "absolute",
    left: spacingX.lg + 24, // approx center of left side if we wanted a line on the side, but design has it center vertical.
    // Wait, the design shows a dashed line connecting the cards vertically.
    // Let's position it relative to the cards.
    // Actually, standard list spacing layout:
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: spacingY.lg, // Use spacing to define gap height matched with margin
    bottom: 0,
    zIndex: -1,
  },
  // Redefining connector approach:
  // The ChapterCard has marginBottom: spacingY.lg.
  // I need the line to be IN that margin.
  // The simplest way is to have the line connect safely.
  // Design shows center vertical dashed line between cards?
  // Actually, looking at the image: The dashed line is on the LEFT side, seemingly connecting some markers?
  // No, in the image provided `uploaded_media_1769979845726.png`, there is a vertical dashed line
  // appearing below the first card, seemingly centered or slightly left aligned?
  // It looks like it connects the cards.

  // Let's implement a centered vertical dashed line between cards in the gap.
  dashedLine: {
    // Create a vertical dashed line
    width: 2,
    height: "100%", // height of the gap
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#D0D0D0",
    position: "absolute",
    left: 36, // Align with the icon/badge roughly
    top: -12, // Pull it up a bit to tuck under the card
    bottom: -12, // Push it down
    zIndex: -1,
    // React native doesn't support borderStyle dashed for single side well without `borderRadius`.
    // Using a View with borderLeftWidth.
  },
});
