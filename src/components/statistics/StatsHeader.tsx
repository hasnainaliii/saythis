import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, FONTS, fontSizes, radii, spacingX, spacingY } from "../../theme/Theme";

interface StatsHeaderProps {
  title: string;
  subtitle: string;
  timeframeLabel: string;
}

export const StatsHeader: React.FC<StatsHeaderProps> = ({
  title,
  subtitle,
  timeframeLabel,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <View style={styles.pill}>
          <Ionicons name="calendar-outline" size={16} color={colors.textDark} />
          <Text style={styles.pillText}>{timeframeLabel}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacingX.md,
    paddingTop: spacingY.sm,
    paddingBottom: spacingY.md,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacingX.md,
  },
  titleBlock: {
    flex: 1,
  },
  title: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.xl,
    color: colors.textDark,
  },
  subtitle: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.textMuted,
    marginTop: spacingY.xxs,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX.xs,
    backgroundColor: colors.libraryCard,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.libraryBorder,
    paddingHorizontal: spacingX.sm,
    paddingVertical: spacingY.xxs,
  },
  pillText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.tiny,
    color: colors.textDark,
  },
});
