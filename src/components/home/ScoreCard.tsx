import { Heart, MoreHorizontal } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { colors, FONTS, fontSizes, spacingX, spacingY, radii } from "../../theme/Theme";

interface Props {
  score: number;
  maxScore?: number;
  statusLabel: string;
}

const SIZE = 100;
const STROKE = 10;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function ScoreCard({ score, maxScore = 100, statusLabel }: Props) {
  const progress = Math.min(score / maxScore, 1);
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Heart size={14} color={colors.white} fill={colors.white} />
        <Text style={styles.headerText}>Freud Score</Text>
      </View>
      <View style={styles.gaugeWrap}>
        <Svg width={SIZE} height={SIZE}>
          {/* bg circle */}
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke={colors.metricGreenLight + "55"}
            strokeWidth={STROKE}
            fill="none"
          />
          {/* progress arc */}
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke={colors.white}
            strokeWidth={STROKE}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${CIRCUMFERENCE}`}
            strokeDashoffset={strokeDashoffset}
            transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
          />
        </Svg>
        <View style={styles.scoreOverlay}>
          <Text style={styles.scoreValue}>{score}</Text>
        </View>
      </View>
      <Text style={styles.status}>{statusLabel}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.metricGreen,
    borderRadius: radii.xl,
    padding: spacingX.md,
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 5,
    marginBottom: spacingY.sm,
  },
  headerText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    color: colors.white,
  },
  gaugeWrap: {
    justifyContent: "center",
    alignItems: "center",
  },
  scoreOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  scoreValue: {
    fontFamily: FONTS.primaryBlack,
    fontSize: fontSizes.xxl,
    color: colors.white,
  },
  status: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.white,
    marginTop: spacingY.xs,
    opacity: 0.85,
  },
});
