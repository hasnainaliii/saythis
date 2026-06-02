import {
  Brain, Moon, BookOpen, Activity, SmilePlus,
} from "lucide-react-native";
import React from "react";
import { Link } from "expo-router";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Svg, { Path } from "react-native-svg";
import { TrackerCard } from "./TrackerCard";
import { colors, FONTS, fontSizes, spacingX, spacingY } from "../../theme/Theme";
import { useTrackerStore } from "../../store/trackerStore";

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
function StressBars({ level = 3 }: { level?: number }) {
  const barColors = [colors.metricGreen, colors.star, colors.secondary, colors.metricOrange, colors.error];
  return (
    <View style={styles.barsRow}>
      {barColors.slice(0, 4).map((c, i) => (
        <View key={i} style={[styles.stressBar, { backgroundColor: i < level ? c : colors.primary10 }]} />
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
  const { sleepHours, journalStreak, stressLevel, mindfulHours, loadAll } = useTrackerStore();

  React.useEffect(() => {
    loadAll();
  }, []);

  const sleepScore = sleepHours !== null ? Math.min(100, Math.round((sleepHours / 8) * 100)) : 0;
  const stressDesc = stressLevel > 0 ? ["Very Low", "Low", "Normal", "High", "Very High"][stressLevel - 1] : "Not set";

  return (
    <View style={styles.section}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>Mindful Tracker</Text>
      </View>

      <Link href="/mood-tracker" asChild>
        <TouchableOpacity activeOpacity={0.8}>
          <TrackerCard
            icon={<SmilePlus size={22} color={colors.metricOrange} />}
            title="Mood Tracker"
            subtitle=""
            right={<MoodFlow />}
          />
        </TouchableOpacity>
      </Link>

      <Link href="/sleep-tracker" asChild>
        <TouchableOpacity activeOpacity={0.8}>
          <TrackerCard
            icon={<Moon size={22} color={colors.headerDark} />}
            title="Sleep Quality"
            subtitle={sleepHours !== null ? `${sleepHours}h Avg` : "Not logged"}
            right={<ScoreBadge value={sleepScore} />}
          />
        </TouchableOpacity>
      </Link>

      <Link href="/journal" asChild>
        <TouchableOpacity activeOpacity={0.8}>
          <TrackerCard
            icon={<BookOpen size={22} color={colors.metricOrange} />}
            title="Mindful Journal"
            subtitle={journalStreak > 0 ? `${journalStreak} Day Streak` : "No streak yet"}
            right={<DotGrid />}
          />
        </TouchableOpacity>
      </Link>

      <Link href="/stress-level" asChild>
        <TouchableOpacity activeOpacity={0.8}>
          <TrackerCard
            icon={<Activity size={22} color={colors.secondary} />}
            title="Stress Level"
            subtitle={stressLevel > 0 ? `Level ${stressLevel} (${stressDesc})` : "Not logged"}
            right={<StressBars level={stressLevel} />}
          />
        </TouchableOpacity>
      </Link>

      <Link href="/mindful-hours" asChild>
        <TouchableOpacity activeOpacity={0.8}>
          <TrackerCard
            icon={<Brain size={22} color={colors.metricGreen} />}
            title="Mindful Hours"
            subtitle={mindfulHours > 0 ? `${mindfulHours}h/8h Today` : "Not logged"}
            right={<SquiggleLine />}
          />
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: spacingX.lg,
    marginTop: 0,
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
    borderColor: colors.headerDark + "44",
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
