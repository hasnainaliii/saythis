import { MoreHorizontal } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MoodCard } from "./MoodCard";
import { ScoreCard } from "./ScoreCard";
import { colors, FONTS, fontSizes, spacingX, spacingY } from "../../theme/Theme";

interface Props {
  score: number;
  scoreStatus: string;
  mood: string;
}

export function MetricsSection({ score, scoreStatus, mood }: Props) {
  return (
    <View style={styles.section}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>Mental Health Metrics</Text>
        <TouchableOpacity activeOpacity={0.7}>
          <MoreHorizontal size={20} color={colors.textMuted} />
        </TouchableOpacity>
      </View>
      <View style={styles.cardsRow}>
        <ScoreCard score={score} statusLabel={scoreStatus} />
        <MoodCard mood={mood} />
      </View>
      {/* pagination dots */}
      <View style={styles.dots}>
        {[0, 1, 2, 3, 4].map((i) => (
          <View key={i} style={[styles.dot, i === 0 && styles.dotActive]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: spacingX.lg,
    marginTop: spacingY.md,
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
  cardsRow: {
    flexDirection: "row",
    gap: spacingX.md,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    marginTop: spacingY.md,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary10,
  },
  dotActive: {
    width: 18,
    borderRadius: 3,
    backgroundColor: colors.secondary,
  },
});
