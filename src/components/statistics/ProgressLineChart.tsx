import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { colors, dynamicSpacingY, FONTS, fontSizes, radii, spacingX, spacingY } from "../../theme/Theme";

export interface TrendPoint {
  value: number;
  label?: string;
}

interface ProgressLineChartProps {
  title: string;
  subtitle?: string;
  data: TrendPoint[];
  accentColor?: string;
  yAxisSuffix?: string;
}

export const ProgressLineChart: React.FC<ProgressLineChartProps> = ({
  title, subtitle, data, accentColor = colors.secondary, yAxisSuffix = "",
}) => {
  const dataMax = Math.max(0, ...data.map((d) => d.value));
  const maxValue = Math.max(4, Math.ceil((dataMax + 2) / 4) * 4);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      <LineChart
        data={data}
        height={dynamicSpacingY(16)}
        maxValue={maxValue}
        noOfSections={4}
        color={accentColor}
        thickness={2}
        dataPointsColor={accentColor}
        dataPointsRadius={4}
        startFillColor={accentColor}
        endFillColor={accentColor + "05"}
        startOpacity={0.2}
        endOpacity={0}
        areaChart
        curved
        yAxisThickness={0}
        xAxisThickness={0}
        hideRules
        xAxisLabelTextStyle={styles.axisText}
        yAxisTextStyle={styles.axisText}
        pointerConfig={{
          pointerStripColor: accentColor,
          pointerStripWidth: 1,
          pointerColor: accentColor,
          radius: 5,
          pointerLabelWidth: 60,
          pointerLabelHeight: 24,
          pointerLabelComponent: (items: any) => (
            <View style={[styles.tooltip, { backgroundColor: accentColor }]}>
              <Text style={styles.tooltipText}>{items[0].value}{yAxisSuffix}</Text>
            </View>
          ),
        }}
      />
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
    marginBottom: spacingY.xxs,
  },
  subtitle: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.textMuted,
    marginBottom: spacingY.sm,
  },
  axisText: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.tiny,
    color: colors.textMuted,
  },
  tooltip: {
    paddingHorizontal: spacingX.xs,
    paddingVertical: 3,
    borderRadius: radii.sm,
    alignItems: "center",
  },
  tooltipText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.tiny,
    color: colors.white,
  },
});
