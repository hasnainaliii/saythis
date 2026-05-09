import {
  Brain, Moon, BookOpen, Activity, SmilePlus, MoreHorizontal,
} from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { TrackerCard } from "./TrackerCard";
import { colors, FONTS, fontSizes, spacingX, spacingY } from "../../theme/Theme";

// squiggly line decoration
function SquiggleLine() {
  return (
    <Svg width={36} height={24} viewBox="0 0 36 24">
      <Path
        d="M2 16 C8 4, 14 20, 20 10 C26 0, 32 18, 34 8"
        stroke={colors.metricGreen}
        strokeWidth={2.5}
        fill="none"
        strokeLinecap="round"
      />
    </Svg>
  );
}

// circular score badge
function ScoreBadge({ value }: { value: number }) {
  return (
    <View style={styles.scoreBadge}>
      <Text style={styles.scoreText}>{value}</Text>
    </View>
  );
}

// dot grid decoration
function DotGrid() {
  return (
    <View style={styles.dotGrid}>
      {Array.from({ length: 20 }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.gridDot,
            i % 3 === 0 && { backgroundColor: colors.secondary },
            i % 5 === 0 && { backgroundColor: colors.metricOrange },
          ]}
        />
      ))}
    </View>
  );
}

// stress level bars
function StressBars() {
  const barColors = [colors.metricGreen, colors.star, colors.secondary, colors.metricOrange];
  return (
    <View style={styles.barsRow}>
      {barColors.map((c, i) => (
        <View key={i} style={[styles.stressBar, { backgroundColor: c }]} />
      ))}
    </View>
  );
}

// mood flow text
function MoodFlow() {
  return (
    <View style={styles.moodRow}>
      <Text style={[styles.moodTag, { backgroundColor: colors.secondary_20 }]}>Sad</Text>
      <Text style={styles.arrow}>→</Text>
      <Text style={[styles.moodTag, { backgroundColor: colors.metricGreenLight + "33" }]}>Happy</Text>
      <Text style={styles.arrow}>→</Text>
      <Text style={[styles.moodTag, { backgroundColor: colors.primary10 }]}>Neutral</Text>
    </View>
  );
}

export function MindfulTracker() {
  return (
    <View style={styles.section}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>Mindful Tracker</Text>
        <MoreHorizontal size={20} color={colors.textMuted} />
      </View>

      <TrackerCard
        icon={<Brain size={22} color={colors.metricGreen} />}
        title="Mindful Hours"
        subtitle="2.5h/8h Today"
        right={<SquiggleLine />}
      />
      <TrackerCard
        icon={<Moon size={22} color={colors.categorySelfAwareness} />}
        title="Sleep Quality"
        subtitle="Insomniac (~2h Avg)"
        right={<ScoreBadge value={20} />}
      />
      <TrackerCard
        icon={<BookOpen size={22} color={colors.metricOrange} />}
        title="Mindful Journal"
        subtitle="64 Day Streak"
        right={<DotGrid />}
      />
      <TrackerCard
        icon={<Activity size={22} color={colors.secondary} />}
        title="Stress Level"
        subtitle="Level 3 (Normal)"
        right={<StressBars />}
      />
      <TrackerCard
        icon={<SmilePlus size={22} color={colors.metricOrange} />}
        title="Mood Tracker"
        subtitle=""
        right={<MoodFlow />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: spacingX.lg,
    marginTop: spacingY.lg,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacingY.md,
  },
  title: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.large,
    color: colors.textDark,
  },
  // score badge
  scoreBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    borderWidth: 2.5,
    borderColor: colors.categorySelfAwareness + "44",
    justifyContent: "center",
    alignItems: "center",
  },
  scoreText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    color: colors.textDark,
  },
  // dot grid
  dotGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: 48,
    gap: 3,
  },
  gridDot: {
    width: 7,
    height: 7,
    borderRadius: 2,
    backgroundColor: colors.primary10,
  },
  // stress bars
  barsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  stressBar: {
    width: 16,
    height: 8,
    borderRadius: 4,
  },
  // mood flow
  moodRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  moodTag: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.tiny,
    color: colors.textDark,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: "hidden",
  },
  arrow: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.tiny,
    color: colors.textMuted,
  },
});
