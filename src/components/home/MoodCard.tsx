import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, FONTS, fontSizes, spacingX, spacingY, radii } from "../../theme/Theme";

interface Props {
  mood: string;
}

// mini bar chart data (7 bars for the week)
const BARS = [0.4, 0.6, 0.8, 0.5, 0.9, 0.3, 0.7];
const BAR_MAX = 70;

export function MoodCard({ mood }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.moodDot} />
        <Text style={styles.headerText}>Mood</Text>
      </View>
      <Text style={styles.moodValue}>{mood}</Text>
      <View style={styles.chartRow}>
        {BARS.map((h, i) => (
          <View key={i} style={styles.barCol}>
            <View
              style={[
                styles.bar,
                {
                  height: h * BAR_MAX,
                  backgroundColor:
                    i === 4 ? colors.white : colors.white + "55",
                },
              ]}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.metricOrange,
    borderRadius: radii.xl,
    padding: spacingX.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: spacingY.xs,
  },
  moodDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.white,
  },
  headerText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    color: colors.white,
  },
  moodValue: {
    fontFamily: FONTS.primaryBlack,
    fontSize: fontSizes.xl,
    color: colors.white,
    marginBottom: spacingY.sm,
  },
  chartRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: BAR_MAX,
    gap: 4,
  },
  barCol: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    height: BAR_MAX,
  },
  bar: {
    width: "70%",
    borderRadius: 4,
  },
});
