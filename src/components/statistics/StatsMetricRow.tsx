import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, FONTS, fontSizes, radii, spacingX, spacingY } from "../../theme/Theme";

interface MetricItem {
  label: string;
  value: string | number;
  unit?: string;
  caption?: string;
  color?: string;
}

interface StatsMetricRowProps {
  items: MetricItem[];
}

export const StatsMetricRow: React.FC<StatsMetricRowProps> = ({ items }) => {
  return (
    <View style={styles.row}>
      {items.map((item) => (
        <View key={item.label} style={styles.card}>
          <Text style={styles.label}>{item.label}</Text>
          <Text style={[styles.value, { color: item.color ?? colors.textDark }]}>
            {item.value}
            {item.unit ? <Text style={styles.unit}> {item.unit}</Text> : null}
          </Text>
          {item.caption ? (
            <Text style={styles.caption}>{item.caption}</Text>
          ) : null}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: spacingX.md,
    paddingHorizontal: spacingX.md,
    marginBottom: spacingY.lg,
  },
  card: {
    flex: 1,
    backgroundColor: colors.libraryCard,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.libraryBorder,
    paddingHorizontal: spacingX.md,
    paddingVertical: spacingY.sm,
  },
  label: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.tiny,
    color: colors.textMuted,
    marginBottom: spacingY.xxs,
  },
  value: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.xl,
  },
  unit: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.tiny,
    color: colors.textMuted,
  },
  caption: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.tiny,
    color: colors.textMuted,
    marginTop: spacingY.xxs,
  },
});
