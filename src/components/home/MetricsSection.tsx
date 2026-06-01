import { Link } from "expo-router";
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
      <View style={styles.cardsRow}>
        <Link href="/stutter-analysis" asChild>
          <TouchableOpacity activeOpacity={0.8} style={{ flex: 1 }}>
            <ScoreCard score={score} statusLabel={scoreStatus} />
          </TouchableOpacity>
        </Link>
        <View style={{ flex: 1 }}>
          <MoodCard mood={mood} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: spacingX.lg,
    marginTop: spacingY.xl,
  },
  cardsRow: {
    flexDirection: "row",
    gap: spacingX.md,
  },
});
