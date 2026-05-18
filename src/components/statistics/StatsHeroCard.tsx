import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, FONTS, fontSizes, radii, spacingX, spacingY } from "../../theme/Theme";

interface StatsHeroCardProps {
  totalMinutes: number;
  totalSessions: number;
  currentStreak: number;
  bestStreak: number;
  activeDays: number;
  lastSessionLabel: string;
}

export const StatsHeroCard: React.FC<StatsHeroCardProps> = ({
  totalMinutes,
  totalSessions,
  currentStreak,
  bestStreak,
  activeDays,
  lastSessionLabel,
}) => {
  const safeLast = lastSessionLabel || "No sessions yet";

  return (
    <View style={styles.card}>
      <View style={[styles.orb, styles.orbOne]} />
      <View style={[styles.orb, styles.orbTwo]} />
      <View style={styles.topRow}>
        <Text style={styles.kicker}>Total practice time</Text>
        <View style={styles.streakPill}>
          <Ionicons name="flame-outline" size={14} color={colors.warning} />
          <Text style={styles.streakText}>{currentStreak} day streak</Text>
        </View>
      </View>
      <Text style={styles.bigValue}>{totalMinutes} min</Text>
      <Text style={styles.caption}>
        {totalSessions} sessions, {activeDays} active days
      </Text>
      <View style={styles.divider} />
      <View style={styles.footerRow}>
        <View style={styles.footerItem}>
          <Text style={styles.footerLabel}>Best streak</Text>
          <Text style={styles.footerValue}>{bestStreak} days</Text>
        </View>
        <View style={styles.footerItem}>
          <Text style={styles.footerLabel}>Last session</Text>
          <Text style={styles.footerValue}>{safeLast}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.libraryCard,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.libraryBorder,
    paddingHorizontal: spacingX.lg,
    paddingVertical: spacingY.lg,
    marginHorizontal: spacingX.md,
    marginBottom: spacingY.lg,
    overflow: "hidden",
  },
  orb: {
    position: "absolute",
    borderRadius: 999,
  },
  orbOne: {
    width: 120,
    height: 120,
    top: -40,
    right: -20,
    backgroundColor: colors.secondary + "18",
  },
  orbTwo: {
    width: 160,
    height: 160,
    bottom: -80,
    left: -50,
    backgroundColor: colors.primary_20,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacingX.sm,
  },
  kicker: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    color: colors.textMuted,
  },
  streakPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX.xs,
    backgroundColor: colors.warning + "1A",
    borderRadius: radii.pill,
    paddingHorizontal: spacingX.sm,
    paddingVertical: spacingY.xxs,
  },
  streakText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.tiny,
    color: colors.textDark,
  },
  bigValue: {
    fontFamily: FONTS.primaryBlack,
    fontSize: fontSizes.xxl,
    color: colors.textDark,
    marginTop: spacingY.sm,
  },
  caption: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.textMuted,
    marginTop: spacingY.xxs,
  },
  divider: {
    height: 1,
    backgroundColor: colors.libraryBorder,
    marginVertical: spacingY.md,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacingX.md,
  },
  footerItem: {
    flex: 1,
  },
  footerLabel: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.tiny,
    color: colors.textMuted,
  },
  footerValue: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.textDark,
    marginTop: spacingY.xxs,
  },
});
