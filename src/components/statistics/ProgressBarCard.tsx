import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, FONTS, fontSizes, radii, spacingX, spacingY } from "../../theme/Theme";

interface ProgressBarRowProps {
  label: string;
  value: number;
  maxValue: number;
  color: string;
  suffix?: string;
}

export const ProgressBarRow: React.FC<ProgressBarRowProps> = ({ label, value, maxValue, color, suffix = "" }) => {
  const pct = maxValue > 0 ? Math.min((value / maxValue) * 100, 100) : 0;

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: color }]} />
      </View>
      <Text style={[styles.value, { color }]}>{value}{suffix}</Text>
    </View>
  );
};

interface ProgressBarCardProps {
  title: string;
  items: { label: string; value: number; color?: string }[];
  suffix?: string;
}

export const ProgressBarCard: React.FC<ProgressBarCardProps> = ({ title, items, suffix }) => {
  const maxVal = Math.max(1, ...items.map((i) => i.value));

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {items.map((item) => (
        <ProgressBarRow
          key={item.label}
          label={item.label}
          value={item.value}
          maxValue={maxVal}
          color={item.color || colors.secondary}
          suffix={suffix}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.libraryCard,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.libraryBorder,
    padding: spacingX.md,
    marginHorizontal: spacingX.md,
    marginBottom: spacingY.md,
  },
  title: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.textDark,
    marginBottom: spacingY.sm,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacingY.xs,
  },
  label: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.textDark,
    width: 90,
  },
  barBg: {
    flex: 1,
    height: 10,
    backgroundColor: colors.libraryBorder,
    borderRadius: radii.pill,
    overflow: "hidden",
    marginHorizontal: spacingX.xs,
  },
  barFill: {
    height: "100%",
    borderRadius: radii.pill,
  },
  value: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.tiny,
    width: 36,
    textAlign: "right",
  },
});
