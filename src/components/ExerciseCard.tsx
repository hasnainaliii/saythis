import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from "react-native-reanimated";
import { colors, FONTS, fontSizes, spacingX, spacingY, radii } from "../theme/Theme";

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
  index?: number;
  isComplete?: boolean;
}

const CATEGORY_CONFIG: Record<
  ExerciseCardProps["category"],
  { label: string; color: string; icon: keyof typeof Ionicons.glyphMap; bg: string }
> = {
  education: {
    label: "Education",
    color: colors.categoryEducation,
    icon: "book-outline",
    bg: colors.categoryEducation + "15",
  },
  self_awareness: {
    label: "Self Awareness",
    color: colors.categorySelfAwareness,
    icon: "eye-outline",
    bg: colors.categorySelfAwareness + "15",
  },
  cognitive_behavioral: {
    label: "CBT",
    color: colors.categoryCBT,
    icon: "bulb-outline",
    bg: colors.categoryCBT + "15",
  },
  self_advocacy: {
    label: "Self Advocacy",
    color: colors.categorySelfAdvocacy,
    icon: "megaphone-outline",
    bg: colors.categorySelfAdvocacy + "15",
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
  index = 0,
  isComplete = false,
}) => {
  const cat = CATEGORY_CONFIG[category];
  const diff = DIFFICULTY_CONFIG[difficulty];

  const translateY = useSharedValue(16);
  const opacity = useSharedValue(0);
  const cardScale = useSharedValue(1);
  const dotScale = useSharedValue(1);

  useEffect(() => {
    translateY.value = withDelay(
      index * 80,
      withTiming(0, { duration: 350, easing: Easing.out(Easing.quad) }),
    );
    opacity.value = withDelay(
      index * 80,
      withTiming(1, { duration: 350 }),
    );
  }, [index, translateY, opacity]);

  useEffect(() => {
    if (isComplete) {
      dotScale.value = withRepeat(
        withSequence(
          withTiming(1.15, { duration: 800 }),
          withTiming(1.0, { duration: 800 }),
        ),
        -1,
        true,
      );
    }
  }, [isComplete, dotScale]);

  const entryStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: cardScale.value }],
    opacity: opacity.value,
  }));

  const dotPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: dotScale.value }],
  }));

  const handlePressIn = () => {
    cardScale.value = withTiming(0.98, { duration: 120 });
  };

  const handlePressOut = () => {
    cardScale.value = withTiming(1.0, { duration: 150 });
  };

  return (
    <Animated.View style={entryStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.container}
      >
        <View style={[styles.accentStrip, { backgroundColor: cat.color }]} />

        <View style={styles.headerRow}>
          <View style={[styles.categoryBadge, { backgroundColor: cat.bg }]}>
            <Ionicons name={cat.icon} size={13} color={cat.color} />
            <Text style={[styles.categoryText, { color: cat.color }]}>
              {cat.label}
            </Text>
          </View>

          {isComplete ? (
            <Animated.View style={[styles.completeDot, dotPulseStyle]} />
          ) : (
            <View style={[styles.difficultyDot, { backgroundColor: diff.color }]} />
          )}
        </View>

        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        <Text style={styles.description} numberOfLines={2}>{description}</Text>

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
          <Pressable
            onPress={onPress}
            style={[styles.startButton, { backgroundColor: colors.secondary }]}
          >
            <Ionicons name="arrow-forward" size={16} color={colors.white} />
          </Pressable>
        </View>

        <View style={styles.watermark}>
          <Ionicons name={cat.icon} size={60} color={cat.color + "06"} />
        </View>
      </Pressable>
    </Animated.View>
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
  accentStrip: {
    position: "absolute",
    left: 0,
    top: 12,
    bottom: 12,
    width: 4,
    borderRadius: radii.sm,
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
    borderRadius: radii.sm,
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
  completeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.success,
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
