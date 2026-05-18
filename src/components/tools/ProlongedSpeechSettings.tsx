import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, FONTS, fontSizes, spacingX, spacingY, radii } from '../../theme/Theme';

interface ProlongedSpeechSettingsProps {
  onBegin: (targetWpm: number) => void;
  onBack: () => void;
}

const MODES = [
  { label: 'Slow', wpm: 60, desc: 'Maximum stretch, high control' },
  { label: 'Medium', wpm: 90, desc: 'Moderate stretch, smooth flow' },
  { label: 'Normal', wpm: 120, desc: 'Near-natural speaking rate' },
];

export const ProlongedSpeechSettings: React.FC<ProlongedSpeechSettingsProps> = ({ onBegin, onBack }) => {
  const [selectedWpm, setSelectedWpm] = useState(60);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textDark} />
        </Pressable>
        <Text style={styles.title}>Target Speed</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>Select your target words per minute (WPM).</Text>
        
        <View style={styles.optionsList}>
          {MODES.map((mode) => {
            const isSelected = selectedWpm === mode.wpm;
            return (
              <Pressable
                key={mode.wpm}
                style={[styles.optionCard, isSelected && styles.optionCardSelected]}
                onPress={() => setSelectedWpm(mode.wpm)}
              >
                <View style={styles.optionHeader}>
                  <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                    {mode.label}
                  </Text>
                  <Text style={[styles.optionWpm, isSelected && styles.optionWpmSelected]}>
                    {mode.wpm} WPM
                  </Text>
                </View>
                <Text style={styles.optionDesc}>{mode.desc}</Text>
              </Pressable>
            );
          })}
        </View>

      </View>

      <View style={styles.footer}>
        <Pressable style={styles.startBtn} onPress={() => onBegin(selectedWpm)}>
          <Text style={styles.startBtnText}>Start Exercise</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacingX.md,
    paddingVertical: spacingY.md,
  },
  backBtn: {
    padding: spacingY.xs,
  },
  title: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.large,
    color: colors.textDark,
  },
  content: {
    flex: 1,
    padding: spacingX.lg,
  },
  subtitle: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.medium,
    color: colors.textMuted,
    marginBottom: spacingY.xl,
  },
  optionsList: {
    gap: spacingY.md,
  },
  optionCard: {
    backgroundColor: colors.libraryCard,
    borderRadius: radii.md,
    padding: spacingX.md,
    borderWidth: 2,
    borderColor: colors.libraryBorder,
  },
  optionCardSelected: {
    borderColor: colors.secondary,
    backgroundColor: colors.primary10,
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacingY.xs,
  },
  optionLabel: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.textDark,
  },
  optionLabelSelected: {
    color: colors.secondary,
  },
  optionWpm: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    color: colors.textMuted,
  },
  optionWpmSelected: {
    color: colors.secondary,
  },
  optionDesc: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.textMuted,
  },
  footer: {
    padding: spacingX.lg,
    paddingBottom: spacingY.xxl,
  },
  startBtn: {
    backgroundColor: colors.secondary,
    paddingVertical: spacingY.md,
    borderRadius: radii.pill,
    alignItems: 'center',
  },
  startBtnText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.white,
  },
});
