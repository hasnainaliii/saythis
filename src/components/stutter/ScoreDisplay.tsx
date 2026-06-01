import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, FONTS, fontSizes, spacingX, spacingY, radii } from '../../theme/Theme';
import { StutterResult } from '../../utils/stutterScore';

interface Props {
  result: StutterResult;
}

function getScoreColor(score: number) {
  if (score <= 5) return colors.success;
  if (score <= 15) return colors.warning;
  return colors.error;
}

function getScoreLabel(score: number) {
  if (score <= 5) return 'Minimal disfluency';
  if (score <= 15) return 'Moderate disfluency';
  if (score <= 30) return 'Notable disfluency';
  return 'Significant disfluency';
}

export function ScoreDisplay({ result }: Props) {
  const scoreColor = getScoreColor(result.score);

  return (
    <View style={styles.container}>
      <View style={styles.scoreCard}>
        <Text style={[styles.scoreValue, { color: scoreColor }]}>{result.score}%</Text>
        <Text style={styles.scoreTitle}>Stutter Score</Text>
        <Text style={[styles.scoreLabel, { color: scoreColor }]}>{getScoreLabel(result.score)}</Text>
      </View>

      <View style={styles.breakdown}>
        <View style={styles.row}>
          <BreakdownCell label="Repetitions found" value={result.repetitions} hint='e.g. "I I", "the the"' />
          <View style={styles.vDivider} />
          <BreakdownCell label="Stuttered words" value={result.stutters} hint='e.g. "b-but", "th-that"' />
        </View>
        <View style={styles.hDivider} />
        <View style={styles.row}>
          <BreakdownCell label="Fillers found" value={result.fillers} hint="um, uh, ah, er" />
          <View style={styles.vDivider} />
          <BreakdownCell label="Total words" value={result.totalWords} hint="words spoken" />
        </View>
      </View>
    </View>
  );
}

function BreakdownCell({ label, value, hint }: { label: string; value: number; hint: string }) {
  return (
    <View style={styles.cell}>
      <Text style={styles.cellLabel}>{label}</Text>
      <Text style={styles.cellValue}>{value}</Text>
      <Text style={styles.cellHint}>{hint}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', alignItems: 'center' },
  scoreCard: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: spacingX.lg,
    width: '100%',
    borderWidth: 1,
    borderColor: colors.libraryBorder,
    marginBottom: spacingY.md,
  },
  scoreValue: { fontFamily: FONTS.primaryBlack, fontSize: fontSizes.xxl },
  scoreTitle: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.textDark,
    marginTop: 2,
  },
  scoreLabel: { fontFamily: FONTS.primary, fontSize: fontSizes.small, marginTop: 2 },
  breakdown: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: spacingX.md,
    width: '100%',
    borderWidth: 1,
    borderColor: colors.libraryBorder,
  },
  row: { flexDirection: 'row' },
  cell: { flex: 1, alignItems: 'center', paddingVertical: spacingY.sm },
  cellLabel: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.tiny,
    color: colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  cellValue: { fontFamily: FONTS.primaryBlack, fontSize: fontSizes.xl, color: colors.textDark },
  cellHint: { fontFamily: FONTS.primary, fontSize: 10, color: colors.textMuted, marginTop: 2 },
  vDivider: { width: 1, backgroundColor: colors.libraryBorder },
  hDivider: { height: 1, backgroundColor: colors.libraryBorder, marginHorizontal: spacingX.md },
});
