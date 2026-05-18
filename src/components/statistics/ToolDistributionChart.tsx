import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { colors, FONTS, fontSizes, radii, spacingX, spacingY } from "../../theme/Theme";

export interface PieSlice {
  value: number;
  color: string;
  label: string;
}

interface ToolDistributionChartProps {
  title: string;
  slices: PieSlice[];
  centerLabel?: string;
  centerValue?: string;
}

export const ToolDistributionChart: React.FC<ToolDistributionChartProps> = ({
  title, slices, centerLabel, centerValue,
}) => {
  const total = slices.reduce((s, d) => s + d.value, 0);
  const pieData = slices.map((s) => ({
    value: s.value,
    color: s.color,
    text: `${s.value}`,
    textColor: colors.white,
    textSize: 10,
  }));

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.chartRow}>
        <PieChart
          data={pieData}
          donut
          radius={60}
          innerRadius={38}
          innerCircleColor={colors.libraryCard}
          centerLabelComponent={() => (
            <View style={styles.center}>
              <Text style={styles.centerValue}>{centerValue || total}</Text>
              <Text style={styles.centerLabel}>{centerLabel || "total"}</Text>
            </View>
          )}
        />
        <View style={styles.legend}>
          {slices.map((s) => (
            <View key={s.label} style={styles.legendRow}>
              <View style={[styles.dot, { backgroundColor: s.color }]} />
              <Text style={styles.legendLabel}>{s.label}</Text>
              <Text style={[styles.legendValue, { color: s.color }]}>{s.value}</Text>
            </View>
          ))}
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
    padding: spacingX.md,
    marginHorizontal: spacingX.md,
    marginBottom: spacingY.lg,
  },
  title: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.textDark,
    marginBottom: spacingY.sm,
  },
  chartRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX.lg,
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  centerValue: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.large,
    color: colors.textDark,
  },
  centerLabel: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.tiny,
    color: colors.textMuted,
  },
  legend: {
    flex: 1,
    gap: spacingY.xs,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX.xs,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendLabel: {
    flex: 1,
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.textDark,
  },
  legendValue: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
  },
});
