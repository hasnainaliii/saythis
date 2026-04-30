import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, FONTS, fontSizes, spacingX, spacingY } from "../theme/Theme";

interface ExerciseCardProps {
  id: string;
  title: string;
  category:
    | "education"
    | "self_awareness"
    | "cognitive_behavioral"
    | "self_advocacy";
  duration_minutes: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  description: string;
  onPress: () => void;
}

const CATEGORY_CONFIG: Record<
  ExerciseCardProps["category"],
  { label: string; color: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  education: { label: "Education", color: colors.categoryEducation, icon: "book-outline" },
  self_awareness: {
    label: "Self Awareness",
    color: colors.categorySelfAwareness,
    icon: "eye-outline",
  },
  cognitive_behavioral: {
    label: "CBT",
    color: colors.categoryCBT,
    icon: "bulb-outline",
  },
  self_advocacy: {
    label: "Self Advocacy",
    color: colors.categorySelfAdvocacy,
    icon: "megaphone-outline",
  },
};

const DIFFICULTY_CONFIG: Record<
  ExerciseCardProps["difficulty"],
  { label: string; color: string }
> = {
  beginner: { label: "Beginner", color: colors.success },
  intermediate: { label: "Intermediate", color: colors.warning },
  advanced: { label: "Advanced", color: colors.errorLight },
};

const ExerciseCard: React.FC<ExerciseCardProps> = ({
  title,
  category,
  duration_minutes,
  difficulty,
  description,
  onPress,
}) => {
  const categoryInfo = CATEGORY_CONFIG[category];
  const difficultyInfo = DIFFICULTY_CONFIG[difficulty];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <View style={styles.headerRow}>
        <View
          style={[
            styles.categoryBadge,
            { backgroundColor: categoryInfo.color + "20" },
          ]}
        >
          <Ionicons
            name={categoryInfo.icon}
            size={14}
            color={categoryInfo.color}
          />
          <Text style={[styles.categoryText, { color: categoryInfo.color }]}>
            {categoryInfo.label}
          </Text>
        </View>
        <View style={styles.durationContainer}>
          <Ionicons name="time-outline" size={14} color={colors.black_text} />
          <Text style={styles.durationText}>{duration_minutes} min</Text>
        </View>
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>
      <Text style={styles.description} numberOfLines={2}>
        {description}
      </Text>

      <View style={styles.footer}>
        <View
          style={[
            styles.difficultyBadge,
            { backgroundColor: difficultyInfo.color + "20" },
          ]}
        >
          <Text
            style={[styles.difficultyText, { color: difficultyInfo.color }]}
          >
            {difficultyInfo.label}
          </Text>
        </View>
        <View style={styles.startButton}>
          <Text style={styles.startText}>Start</Text>
          <Ionicons name="arrow-forward" size={16} color={colors.secondary} />
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacingX.md,
    marginBottom: spacingY.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacingY.sm,
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacingX.sm,
    paddingVertical: spacingY.xxs,
    borderRadius: 8,
    gap: 4,
  },
  categoryText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.tiny,
  },
  durationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  durationText: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.tiny,
    color: colors.black_text,
  },
  title: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.large,
    color: colors.black,
    marginBottom: spacingY.xs,
  },
  description: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.black_text,
    marginBottom: spacingY.md,
    lineHeight: 20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  difficultyBadge: {
    paddingHorizontal: spacingX.sm,
    paddingVertical: spacingY.xxs,
    borderRadius: 6,
  },
  difficultyText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.tiny,
  },
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  startText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    color: colors.secondary,
  },
});

export default ExerciseCard;
