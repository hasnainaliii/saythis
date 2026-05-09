import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { Exercise } from "../../data/chapter1Data";
import { colors, FONTS, fontSizes, spacingX, spacingY } from "../../theme/Theme";
import CBTContent from "./CBTContent";
import EducationContent from "./EducationContent";
import SelfAdvocacyContent from "./SelfAdvocacyContent";
import SelfAwarenessContent from "./SelfAwarenessContent";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export interface Slide {
  id: string;
  title: string;
  type: "instructions" | "content" | "outcomes" | "safety";
  data: unknown;
}

interface ExerciseSlideProps {
  slide: Slide;
  exercise: Exercise;
}

const ContentByCategory: React.FC<{ exercise: Exercise }> = ({ exercise }) => {
  switch (exercise.category) {
    case "education":
      return <EducationContent content={exercise.content} />;
    case "self_awareness":
      return <SelfAwarenessContent content={exercise.content} />;
    case "cognitive_behavioral":
      return <CBTContent content={exercise.content} />;
    case "self_advocacy":
      return <SelfAdvocacyContent content={exercise.content} />;
    default:
      return <Text>Unknown category</Text>;
  }
};

const ExerciseSlide: React.FC<ExerciseSlideProps> = ({ slide, exercise }) => {
  return (
    <View style={styles.slide}>
      {slide.type === "instructions" && (
        <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>
          {(slide.data as string[]).map((instruction, index) => (
            <View key={index} style={styles.instructionCard}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepBadgeText}>{index + 1}</Text>
              </View>
              <View style={styles.instructionContent}>
                <Text style={styles.itemText}>{instruction}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {slide.type === "content" && <ContentByCategory exercise={exercise} />}

      {slide.type === "outcomes" && (
        <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>
          <View style={styles.listCard}>
            {(slide.data as string[]).map((text, index) => (
              <View
                key={index}
                style={[
                  styles.outcomeItem,
                  index === (slide.data as string[]).length - 1 && { borderBottomWidth: 0, marginBottom: 0, paddingBottom: 0 },
                ]}
              >
                <View style={styles.outcomeIcon}>
                  <Ionicons name="checkmark" size={14} color={colors.white} />
                </View>
                <Text style={styles.itemText}>{text}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      {slide.type === "safety" && (
        <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>
          <View style={styles.safetyBanner}>
            <Ionicons name="heart-outline" size={18} color={colors.warning} />
            <Text style={styles.safetyBannerText}>
              Your wellbeing comes first — take it at your pace
            </Text>
          </View>
          <View style={styles.listCard}>
            {(slide.data as string[]).map((text, index) => (
              <View
                key={index}
                style={[
                  styles.safetyItem,
                  index === (slide.data as string[]).length - 1 && { borderBottomWidth: 0, marginBottom: 0, paddingBottom: 0 },
                ]}
              >
                <View style={styles.safetyIcon}>
                  <Ionicons name="shield-checkmark" size={14} color={colors.warning} />
                </View>
                <Text style={styles.itemText}>{text}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  slide: {
    width: SCREEN_WIDTH,
    paddingHorizontal: spacingX.lg,
  },
  contentScroll: {
    flex: 1,
  },

  // Instructions
  instructionCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacingX.md,
    marginBottom: spacingY.sm,
    gap: spacingX.sm,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  stepBadge: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: colors.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
  stepBadgeText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    color: colors.white,
  },
  instructionContent: {
    flex: 1,
  },

  // Outcomes
  listCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: spacingX.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  outcomeItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacingX.sm,
    marginBottom: spacingY.sm,
    paddingBottom: spacingY.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary_10,
  },
  outcomeIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.success,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 1,
  },

  // Safety
  safetyBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.warning + "12",
    borderRadius: 14,
    padding: spacingX.md,
    marginBottom: spacingY.md,
  },
  safetyBannerText: {
    flex: 1,
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.warning,
    lineHeight: 20,
  },
  safetyItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacingX.sm,
    marginBottom: spacingY.sm,
    paddingBottom: spacingY.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary_10,
  },
  safetyIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.warning + "18",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 1,
  },

  itemText: {
    flex: 1,
    fontFamily: FONTS.primary,
    fontSize: fontSizes.medium,
    color: colors.textDark,
    lineHeight: 24,
  },
});

export default ExerciseSlide;
