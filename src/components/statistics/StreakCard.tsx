import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, FONTS, fontSizes, radii, spacingX, spacingY } from "../../theme/Theme";

interface StreakCardProps {
  currentStreak: number;
  bestStreak: number;
  message?: string;
}

export const StreakCard: React.FC<StreakCardProps> = ({ currentStreak, bestStreak, message }) => {
  const fireCount = Math.min(currentStreak, 7);
  const fires = Array.from({ length: fireCount }, (_, i) => i);

  return (
    <View style={styles.card}>
      <View style={styles.fireRow}>
        {fires.length > 0 ? fires.map((i) => (
          <Ionicons key={i} name="flame" size={22} color={colors.warning} />
        )) : (
          <Ionicons name="flame-outline" size={22} color={colors.textMuted} />
        )}
      </View>
      <View style={styles.streakRow}>
        <View style={styles.streakCol}>
          <Text style={styles.streakValue}>{currentStreak}</Text>
          <Text style={styles.streakLabel}>Current streak</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.streakCol}>
          <Text style={styles.streakValue}>{bestStreak}</Text>
          <Text style={styles.streakLabel}>Best streak</Text>
        </View>
      </View>
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.libraryCard,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.libraryBorder,
    padding: spacingX.lg,
    marginHorizontal: spacingX.md,
    marginBottom: spacingY.lg,
    alignItems: "center",
  },
  fireRow: {
    flexDirection: "row",
    gap: 4,
    marginBottom: spacingY.sm,
  },
  streakRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX.lg,
  },
  streakCol: {
    alignItems: "center",
  },
  streakValue: {
    fontFamily: FONTS.primaryBlack,
    fontSize: fontSizes.xxl,
    color: colors.textDark,
  },
  streakLabel: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.tiny,
    color: colors.textMuted,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: colors.libraryBorder,
  },
  message: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.textMuted,
    marginTop: spacingY.sm,
    textAlign: "center",
  },
});
