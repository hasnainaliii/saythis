import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, FONTS, fontSizes, spacingX, spacingY } from "../theme/Theme";

interface ChapterCardProps {
  id: number;
  chapterNumber: number;
  title: string;
  description: string;
  progress: number;
  isLocked: boolean;
  onPress: () => void;
}

const CHAPTER_THEMES: Record<
  number,
  { accent: string; icon: keyof typeof Ionicons.glyphMap; bg: string }
> = {
  1: { accent: "#ff9b85", icon: "leaf-outline", bg: "#FFF5F2" },
  2: { accent: "#7B68EE", icon: "water-outline", bg: "#F3F0FF" },
  3: { accent: "#50C878", icon: "musical-notes-outline", bg: "#EEFAF2" },
  4: { accent: "#FFB347", icon: "shield-checkmark-outline", bg: "#FFF8EE" },
  5: { accent: "#4A90D9", icon: "rocket-outline", bg: "#EEF4FF" },
};

const DEFAULT_THEME = { accent: colors.secondary, icon: "book-outline" as const, bg: colors.primary_20 };

const ChapterCard: React.FC<ChapterCardProps> = ({
  chapterNumber,
  title,
  description,
  progress,
  isLocked,
  onPress,
}) => {
  const formattedNumber = chapterNumber.toString().padStart(2, "0");
  const theme = CHAPTER_THEMES[chapterNumber] || DEFAULT_THEME;

  return (
    <Pressable
      onPress={onPress}
      disabled={isLocked}
      style={({ pressed }) => [
        styles.container,
        { backgroundColor: isLocked ? colors.white : theme.bg },
        isLocked && styles.lockedContainer,
        pressed && !isLocked && styles.pressed,
      ]}
    >
      {!isLocked && (
        <View style={[styles.accentBar, { backgroundColor: theme.accent }]} />
      )}

      <View style={styles.headerRow}>
        <View style={styles.leftHeader}>
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: isLocked ? colors.primary10 : theme.accent + "20" },
            ]}
          >
            {isLocked ? (
              <Ionicons name="lock-closed" size={18} color={colors.textDisabled} />
            ) : (
              <Ionicons name={theme.icon} size={18} color={theme.accent} />
            )}
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Chapter {formattedNumber}</Text>
          </View>
        </View>
        {!isLocked && (
          <View style={[styles.playButton, { backgroundColor: theme.accent }]}>
            <Ionicons name="play" size={14} color={colors.white} />
          </View>
        )}
      </View>

      <Text style={[styles.title, isLocked && styles.lockedText]}>{title}</Text>
      <Text style={[styles.description, isLocked && styles.lockedText]}>
        {description}
      </Text>

      {!isLocked && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBarRow}>
            {[1, 2, 3, 4, 5].map((step) => {
              const stepProgress = step * 20;
              const isActive = progress >= stepProgress;
              return (
                <View
                  key={step}
                  style={[
                    styles.progressSegment,
                    { backgroundColor: isActive ? theme.accent : theme.accent + "25" },
                  ]}
                />
              );
            })}
          </View>
          <Text style={styles.progressText}>{progress}% Complete</Text>
        </View>
      )}

      {isLocked && (
        <View style={styles.lockedHint}>
          <Ionicons name="arrow-up-circle-outline" size={14} color={colors.textDisabled} />
          <Text style={styles.lockedHintText}>Complete previous chapter</Text>
        </View>
      )}

      {!isLocked && (
        <>
          <View
            style={[styles.decorativeCircle, { backgroundColor: theme.accent + "10" }]}
          />
          <View
            style={[styles.decorativeCircleSmall, { backgroundColor: theme.accent + "08" }]}
          />
        </>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: spacingX.lg,
    paddingLeft: spacingX.lg + 6,
    width: "100%",
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
    marginBottom: spacingY.lg,
    position: "relative",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border + "40",
  },
  lockedContainer: {
    opacity: 0.7,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  accentBar: {
    position: "absolute",
    left: 0,
    top: 16,
    bottom: 16,
    width: 4,
    borderRadius: 2,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacingY.sm,
  },
  leftHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX.sm,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    backgroundColor: colors.white,
    paddingHorizontal: spacingX.sm,
    paddingVertical: spacingY.xxs,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border + "40",
  },
  badgeText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.tiny,
    color: colors.textDark,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.xl,
    color: colors.textDark,
    marginBottom: spacingY.xxs,
  },
  description: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.medium,
    color: colors.textMuted,
    marginBottom: spacingY.md,
    lineHeight: 22,
  },
  lockedText: {
    color: colors.textDisabled,
  },
  progressContainer: {
    marginTop: spacingY.xs,
  },
  progressBarRow: {
    flexDirection: "row",
    gap: 4,
    marginBottom: spacingY.xs,
    width: "55%",
  },
  progressSegment: {
    height: 5,
    flex: 1,
    borderRadius: 3,
  },
  progressText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.tiny,
    color: colors.textMuted,
  },
  lockedHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  lockedHintText: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.tiny,
    color: colors.textDisabled,
  },
  decorativeCircle: {
    position: "absolute",
    bottom: -30,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  decorativeCircleSmall: {
    position: "absolute",
    top: -15,
    right: 40,
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});

export default ChapterCard;
