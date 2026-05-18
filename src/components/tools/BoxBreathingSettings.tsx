import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Switch } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, FONTS, fontSizes, spacingX, spacingY, radii } from '../../theme/Theme';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const ACCENT = colors.secondary;
const PRESETS = [3, 4, 5, 6, 8];
const CYCLE_OPTIONS = [
  { label: 'Quick', cycles: 3, sub: '≈1 minute' },
  { label: 'Standard', cycles: 5, sub: '≈2 minutes' },
  { label: 'Extended', cycles: 10, sub: '≈4 minutes' },
];

interface BoxBreathingSettingsProps {
  onBegin: (secondsPerSide: number, cycles: number, audioCues: boolean) => void;
}

export const BoxBreathingSettings: React.FC<BoxBreathingSettingsProps> = ({ onBegin }) => {
  const [seconds, setSeconds] = useState(4);
  const [cycles, setCycles] = useState(5);
  const [audioCues, setAudioCues] = useState(true);
  const [showCustom, setShowCustom] = useState(false);
  const [customVal, setCustomVal] = useState('');

  const handleCustom = (val: string) => {
    setCustomVal(val);
    const n = parseInt(val);
    if (n >= 3 && n <= 12) setSeconds(n);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configure</Text>
      <Text style={styles.subtitle}>Adjust timing to your comfort level</Text>

      <Text style={styles.sectionLabel}>Seconds per side</Text>
      <Text style={styles.sectionSub}>All four phases use this same duration</Text>

      <View style={styles.chipsRow}>
        {PRESETS.map(p => {
          const sel = seconds === p && !showCustom;
          return (
            <Pressable
              key={p}
              style={[styles.chip, sel && styles.chipActive]}
              onPress={() => { setSeconds(p); setShowCustom(false); Haptics.selectionAsync(); }}
            >
              <Text style={[styles.chipText, sel && styles.chipTextActive]}>{p}s</Text>
            </Pressable>
          );
        })}
      </View>

      {!showCustom ? (
        <Pressable onPress={() => setShowCustom(true)}>
          <Text style={styles.customToggle}>Custom...</Text>
        </Pressable>
      ) : (
        <TextInput
          style={styles.customInput}
          keyboardType="number-pad"
          placeholder="3–12 seconds"
          value={customVal}
          onChangeText={handleCustom}
          maxLength={2}
        />
      )}

      <Text style={[styles.sectionLabel, { marginTop: spacingY.lg }]}>Session length</Text>
      <View style={styles.cycleRow}>
        {CYCLE_OPTIONS.map(opt => {
          const sel = cycles === opt.cycles;
          return (
            <Pressable
              key={opt.cycles}
              style={[styles.cycleCard, sel && styles.cycleCardActive]}
              onPress={() => { setCycles(opt.cycles); Haptics.selectionAsync(); }}
            >
              <Text style={[styles.cycleLabel, sel && { color: ACCENT }]}>{opt.label}</Text>
              <Text style={styles.cycleValue}>{opt.cycles} cycles</Text>
              <Text style={styles.cycleSub}>{opt.sub}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.audioRow}>
        <View>
          <Text style={styles.audioLabel}>Gentle audio cues</Text>
          {audioCues && (
            <Text style={styles.audioSub}>A soft chime plays at each phase change</Text>
          )}
        </View>
        <Switch
          value={audioCues}
          onValueChange={setAudioCues}
          thumbColor={audioCues ? ACCENT : colors.libraryBorder}
          trackColor={{ false: colors.libraryBorder, true: ACCENT + '66' }}
        />
      </View>

      <Pressable
        style={styles.beginBtn}
        onPress={() => onBegin(seconds, cycles, audioCues)}
      >
        <Text style={styles.beginText}>Begin Session</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacingX.md },
  title: { fontFamily: FONTS.primaryBold, fontSize: fontSizes.large, color: colors.textDark },
  subtitle: { fontFamily: FONTS.primary, fontSize: fontSizes.small, color: colors.textMuted, marginBottom: spacingY.lg },
  sectionLabel: { fontFamily: FONTS.primaryBold, fontSize: fontSizes.medium, color: colors.textDark },
  sectionSub: { fontFamily: FONTS.primary, fontSize: fontSizes.tiny, color: colors.textMuted, marginBottom: spacingY.sm },
  chipsRow: { flexDirection: 'row', gap: spacingX.xs, marginBottom: spacingY.xs },
  chip: {
    borderWidth: 1, borderColor: colors.libraryBorder, borderRadius: radii.pill,
    paddingHorizontal: spacingX.sm, paddingVertical: spacingY.xxs,
  },
  chipActive: { borderColor: ACCENT, backgroundColor: ACCENT + '22' },
  chipText: { fontFamily: FONTS.primary, fontSize: fontSizes.small, color: colors.textMuted },
  chipTextActive: { color: ACCENT, fontFamily: FONTS.primaryBold },
  customToggle: { fontFamily: FONTS.primary, fontSize: fontSizes.tiny, color: colors.textMuted, marginBottom: spacingY.sm },
  customInput: {
    backgroundColor: colors.librarySurface, borderRadius: radii.md,
    paddingHorizontal: spacingX.sm, paddingVertical: spacingY.xs,
    fontFamily: FONTS.primary, fontSize: fontSizes.small, color: colors.textDark,
    marginBottom: spacingY.sm,
  },
  cycleRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacingY.sm },
  cycleCard: {
    width: wp('28%'), height: hp('9%'), borderRadius: radii.lg,
    borderWidth: 1, borderColor: colors.libraryBorder,
    backgroundColor: colors.libraryCard, alignItems: 'center', justifyContent: 'center',
    padding: spacingX.xs,
  },
  cycleCardActive: { borderColor: ACCENT, backgroundColor: ACCENT + '22' },
  cycleLabel: { fontFamily: FONTS.primaryBold, fontSize: fontSizes.small, color: colors.textDark },
  cycleValue: { fontFamily: FONTS.primaryBold, fontSize: fontSizes.medium, color: colors.textDark },
  cycleSub: { fontFamily: FONTS.primary, fontSize: fontSizes.tiny, color: colors.textMuted },
  audioRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginTop: spacingY.lg, marginBottom: spacingY.sm,
  },
  audioLabel: { fontFamily: FONTS.primaryBold, fontSize: fontSizes.small, color: colors.textDark },
  audioSub: { fontFamily: FONTS.primary, fontSize: fontSizes.tiny, color: colors.textMuted, marginTop: 2 },
  beginBtn: {
    backgroundColor: ACCENT, borderRadius: radii.pill,
    paddingVertical: spacingY.sm, alignItems: 'center', marginTop: spacingY.xl,
  },
  beginText: { color: colors.white, fontFamily: FONTS.primaryBold, fontSize: fontSizes.medium },
});
