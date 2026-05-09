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
  { label: string; color: string; icon: keyof typeof Ionicons.glyphMap; bg: string }
> = {
  education: {
    label: "Education",
    color: "#4A90D9",
    icon: "book-outline",
    bg: "#EEF4FF",
  },
  self_awareness: {
    label: "Self Awareness",
    color: "#7B68EE",
    icon: "eye-outline",
    bg: "#F3F0FF",
  },
  cognitive_behavioral: {
    label: "CBT",
    color: "#50C878",
    icon: "bulb-outline",
    bg: "#EEFAF2",
  },
  self_advocacy: {
    label: "Self Advocacy",
    color: "#FF8C42",
    icon: "megaphone-outline",
    bg: "#FFF5EE",
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
  const cat = CATEGORY_CONFIG[category];
  const diff = DIFFICULTY_CONFIG[difficulty];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      {/* Left accent strip */}
      <View style={[styles.accentStrip, { backgroundColor: cat.color }]} />

      <View style={styles.headerRow}>
        <View style={[styles.categoryBadge, { backgroundColor: cat.bg }]}>
          <Ionicons name={cat.icon} size={13} color={cat.color} />
          <Text style={[styles.categoryText, { color: cat.color }]}>
            {cat.label}
          </Text>
        </View>
        <View style={[styles.difficultyDot, { backgroundColor: diff.color }]} />
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>
      <Text style={styles.description} numberOfLines={2}>
        {description}
      </Text>

      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <View style={styles.metaChip}>
            <Ionicons name="time-outline" size={12} color={colors.textMuted} />
            <Text style={styles.metaChipText}>{duration_minutes} min</Text>
          </View>
          <View style={[styles.metaChip, { backgroundColor: diff.color + "12" }]}>
            <Text style={[styles.metaChipText, { color: diff.color }]}>
              {diff.label}
            </Text>
          </View>
        </View>
        <View style={[styles.startButton, { backgroundColor: cat.color }]}>
          <Ionicons name="arrow-forward" size={16} color={colors.white} />
        </View>
      </View>

      {/* Decorative watermark */}
      <View style={styles.watermark}>
        <Ionicons name={cat.icon} size={60} color={cat.color + "06"} />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: spacingX.md,
    paddingLeft: spacingX.md + 6,
    marginBottom: spacingY.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    position: "relative",
    overflow: "hidden",
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.985 }],
  },
  accentStrip: {
    position: "absolute",
    left: 0,
    top: 12,
    bottom: 12,
    width: 3.5,
    borderRadius: 2,
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
    paddingVertical: 5,
    borderRadius: 10,
    gap: 5,
  },
  categoryText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.tiny,
  },
  difficultyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  title: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.large,
    color: colors.textDark,
    marginBottom: spacingY.xxs,
  },
  description: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.textMuted,
    marginBottom: spacingY.md,
    lineHeight: 20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerLeft: {
    flexDirection: "row",
    gap: 6,
  },
  metaChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.primary_10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  metaChipText: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.tiny,
    color: colors.textMuted,
  },
  startButton: {
    width: 34,
    height: 34,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  watermark: {
    position: "absolute",
    right: -8,
    bottom: -8,
  },
});

export default ExerciseCard;
