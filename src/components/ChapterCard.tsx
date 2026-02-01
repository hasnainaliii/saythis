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

const ChapterCard: React.FC<ChapterCardProps> = ({
  chapterNumber,
  title,
  description,
  progress,
  isLocked,
  onPress,
}) => {
  const formattedNumber = chapterNumber.toString().padStart(2, "0");

  return (
    <Pressable
      onPress={onPress}
      disabled={isLocked}
      style={({ pressed }) => [
        styles.container,
        isLocked ? styles.lockedContainer : styles.activeContainer,
        pressed && !isLocked && styles.pressed,
      ]}
    >
      <View style={styles.headerRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Chapter {formattedNumber}</Text>
        </View>
        <View style={styles.iconContainer}>
          {isLocked ? (
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color={colors.black_text}
            />
          ) : (
            <Ionicons
              name="play-circle-outline"
              size={24}
              color={colors.secondary}
            />
          )}
        </View>
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
                    isActive ? styles.progressActive : styles.progressInactive,
                  ]}
                />
              );
            })}
          </View>
          <Text style={styles.progressText}>{progress}% Complete</Text>
        </View>
      )}

      {!isLocked && <View style={styles.decorativeCircle} />}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    padding: spacingX.lg,
    width: "100%",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,

    elevation: 2,
    marginBottom: spacingY.lg,
    position: "relative",
    overflow: "hidden",
  },
  activeContainer: {
    backgroundColor: colors.primary_20,
  },
  lockedContainer: {
    backgroundColor: colors.white,
    opacity: 0.8,
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
  badge: {
    backgroundColor: colors.white,
    paddingHorizontal: spacingX.md,
    paddingVertical: spacingY.xs,
    borderRadius: 12,
  },
  badgeText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    color: colors.black,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.xl,
    color: colors.black,
    marginBottom: spacingY.xs,
  },
  description: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.medium,
    color: colors.black_text,
    marginBottom: spacingY.md,
  },
  lockedText: {
    color: "#A0A0A0",
  },
  progressContainer: {
    marginTop: spacingY.sm,
  },
  progressBarRow: {
    flexDirection: "row",
    gap: 4,
    marginBottom: spacingY.xs,
    width: "50%",
  },
  progressSegment: {
    height: 6,
    flex: 1,
    borderRadius: 3,
  },
  progressActive: {
    backgroundColor: colors.secondary,
  },
  progressInactive: {
    backgroundColor: colors.primary20,
  },
  progressText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.tiny,
    color: colors.black_text,
  },
  decorativeCircle: {
    position: "absolute",
    bottom: -20,
    right: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
});

export default ChapterCard;
