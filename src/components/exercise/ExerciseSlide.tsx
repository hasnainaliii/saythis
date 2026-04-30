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

const ICON_MAP: Record<string, { name: keyof typeof Ionicons.glyphMap; color: string }> = {
  outcomes: { name: "checkmark-circle", color: colors.success },
  safety: { name: "alert-circle", color: colors.warning },
};

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
  const iconConfig = ICON_MAP[slide.type];

  return (
    <View style={styles.slide}>
      <Text style={styles.slideTitle}>{slide.title}</Text>

      {slide.type === "instructions" && (
        <ScrollView style={styles.contentScroll}>
          {(slide.data as string[]).map((instruction, index) => (
            <View key={index} style={styles.instructionItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.itemText}>{instruction}</Text>
            </View>
          ))}
        </ScrollView>
      )}

      {slide.type === "content" && <ContentByCategory exercise={exercise} />}

      {iconConfig && (
        <ScrollView style={styles.contentScroll}>
          {(slide.data as string[]).map((text, index) => (
            <View key={index} style={styles.listItem}>
              <Ionicons name={iconConfig.name} size={20} color={iconConfig.color} />
              <Text style={styles.itemText}>{text}</Text>
            </View>
          ))}
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
  slideTitle: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.large,
    color: colors.black,
    marginBottom: spacingY.md,
  },
  contentScroll: {
    flex: 1,
  },
  instructionItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: spacingY.md,
    gap: spacingX.sm,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
  stepNumberText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    color: colors.white,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacingX.sm,
    marginBottom: spacingY.md,
  },
  itemText: {
    flex: 1,
    fontFamily: FONTS.primary,
    fontSize: fontSizes.medium,
    color: colors.black,
    lineHeight: 24,
  },
});

export default ExerciseSlide;
