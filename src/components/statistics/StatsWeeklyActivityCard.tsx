import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import {
    colors,
    dynamicSpacingY,
    FONTS,
    fontSizes,
    radii,
    spacingX,
    spacingY,
} from "../../theme/Theme";

export interface WeeklyActivityDatum {
  label: string;
  value: number;
}

interface StatsWeeklyActivityCardProps {
  data: WeeklyActivityDatum[];
  totalMinutes: number;
  accentColor?: string;
}

export const StatsWeeklyActivityCard: React.FC<StatsWeeklyActivityCardProps> = ({
  data,
  totalMinutes,
  accentColor = colors.secondary,
}) => {
  const dataMax = Math.max(0, ...data.map((item) => item.value));
  const maxValue = Math.max(4, Math.ceil(dataMax / 4) * 4);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Weekly rhythm</Text>
          <Text style={styles.subtitle}>{totalMinutes} sessions this week</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>7 days</Text>
        </View>
      </View>
      <BarChart
        data={data.map((item) => ({ value: item.value, label: item.label }))}
        barWidth={spacingX.lg}
        spacing={spacingX.lg}
        barBorderRadius={radii.sm}
        height={dynamicSpacingY(16)}
        frontColor={accentColor}
        maxValue={maxValue}
        noOfSections={4}
        yAxisThickness={0}
        xAxisThickness={0}
        hideRules
        xAxisLabelTextStyle={styles.axisText}
        yAxisTextStyle={styles.axisText}
      />
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
    marginBottom: spacingY.lg,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacingY.sm,
  },
  title: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.large,
    color: colors.textDark,
  },
  subtitle: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.textMuted,
    marginTop: spacingY.xxs,
  },
  badge: {
    backgroundColor: colors.primary_20,
    borderRadius: radii.pill,
    paddingHorizontal: spacingX.sm,
    paddingVertical: spacingY.xxs,
  },
  badgeText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.tiny,
    color: colors.textMuted,
  },
  axisText: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.tiny,
    color: colors.textMuted,
  },
});
