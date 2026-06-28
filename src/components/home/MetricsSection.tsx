import { Link } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { AiFeedbackCard } from "./AiFeedbackCard";
import { ScoreCard } from "./ScoreCard";
import { spacingX, spacingY } from "../../theme/Theme";

interface Props {
  score: number;
  scoreStatus: string;
}

export function MetricsSection({ score, scoreStatus }: Props) {
  return (
    <View style={styles.section}>
      <View style={styles.cardsRow}>
        <Link href="/stutter-analysis" asChild>
          <TouchableOpacity activeOpacity={0.8} style={{ flex: 1 }}>
            <ScoreCard score={score} statusLabel={scoreStatus} />
          </TouchableOpacity>
        </Link>
        <Link href="/ai-feedback" asChild>
          <TouchableOpacity activeOpacity={0.8} style={{ flex: 1 }}>
            <AiFeedbackCard />
          </TouchableOpacity>
        </Link>
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
