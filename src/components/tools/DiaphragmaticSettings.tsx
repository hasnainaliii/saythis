import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, Rect, Line, G } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { colors, FONTS, fontSizes, spacingX, spacingY, radii } from '../../theme/Theme';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const ACCENT = colors.secondary;

interface DiaphragmaticSettingsProps {
  onBegin: (inhale: number, exhale: number, cycles: number) => void;
}

const Stepper = ({ value, min, max, onChange, unit }: {
  value: number; min: number; max: number;
  onChange: (v: number) => void; unit: string;
}) => (
  <View style={styles.stepper}>
    <Pressable
      style={[styles.stepBtn, value <= min && { opacity: 0.3 }]}
      onPress={() => { if (value > min) { onChange(value - 1); Haptics.selectionAsync(); } }}
      disabled={value <= min}
    >
      <Ionicons name="remove" size={18} color={colors.textDark} />
    </Pressable>
    <Text style={styles.stepValue}>{value}{unit}</Text>
    <Pressable
      style={[styles.stepBtn, value >= max && { opacity: 0.3 }]}
      onPress={() => { if (value < max) { onChange(value + 1); Haptics.selectionAsync(); } }}
      disabled={value >= max}
    >
      <Ionicons name="add" size={18} color={colors.textDark} />
    </Pressable>
  </View>
);

export const DiaphragmaticSettings: React.FC<DiaphragmaticSettingsProps> = ({ onBegin }) => {
  const [inhale, setInhale] = useState(4);
  const [exhale, setExhale] = useState(6);
  const [cycles, setCycles] = useState(10);

  const totalSec = (inhale + 1 + exhale + 1) * cycles;
  const estimateMin = Math.ceil(totalSec / 30) / 2;

  const handleExhaleChange = (v: number) => {
    if (v > inhale) setExhale(v);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>Position yourself</Text>

      {/* SVG posture illustration */}
      <View style={styles.positionCard}>
        <Svg width={wp('40%')} height={wp('40%')} viewBox="0 0 200 200" style={styles.svg}>
          <G transform="translate(100, 20)">
            <Circle cx={0} cy={20} r={16} fill="none" stroke={colors.libraryBorder} strokeWidth={2} />
            <Rect x={-4} y={36} width={8} height={10} fill={colors.libraryBorder} rx={2} />
            <Rect x={-24} y={46} width={48} height={60} fill="none" stroke={colors.libraryBorder} strokeWidth={2} rx={8} />
            <Line x1={-24} y1={52} x2={-40} y2={80} stroke={colors.libraryBorder} strokeWidth={2} />
            <Line x1={24} y1={52} x2={40} y2={80} stroke={colors.libraryBorder} strokeWidth={2} />
            <Line x1={-12} y1={106} x2={-18} y2={150} stroke={colors.libraryBorder} strokeWidth={2} />
            <Line x1={12} y1={106} x2={18} y2={150} stroke={colors.libraryBorder} strokeWidth={2} />
            <Rect x={-30} y={46} width={4} height={70} fill="none" stroke={colors.libraryBorder} strokeWidth={1} rx={2} />
          </G>
          <Line x1={60} y1={86} x2={90} y2={76} stroke={ACCENT} strokeWidth={1.5} />
          <Circle cx={58} cy={87} r={3} fill={ACCENT} />
        </Svg>
        <Text style={styles.arrowLabel}>Belly expands here</Text>
      </View>

      <View style={styles.checkList}>
        {['Sit upright, feet flat', 'Hands on belly and chest', 'Shoulders relaxed down'].map(t => (
          <View key={t} style={styles.checkRow}>
            <Ionicons name="checkmark-circle" size={16} color={colors.success} />
            <Text style={styles.checkText}>{t}</Text>
          </View>
        ))}
      </View>

      <Text style={[styles.sectionTitle, { marginTop: spacingY.lg }]}>Adjust timing</Text>

      {/* Inhale stepper */}
      <View style={styles.timingRow}>
        <View>
          <Text style={styles.timingLabel}>Inhale</Text>
          <Text style={styles.timingSub}>Belly rises</Text>
        </View>
        <Stepper value={inhale} min={3} max={6} onChange={setInhale} unit="s" />
      </View>

      {/* Exhale stepper */}
      <View style={styles.timingRow}>
        <View>
          <Text style={styles.timingLabel}>Exhale</Text>
          <Text style={styles.timingSub}>Must be longer than inhale</Text>
        </View>
        <Stepper value={exhale} min={inhale + 2} max={10} onChange={handleExhaleChange} unit="s" />
      </View>
      {exhale <= inhale && (
        <Text style={styles.warning}>⚠ Exhale should be longer</Text>
      )}

      {/* Cycles stepper */}
      <View style={styles.timingRow}>
        <View>
          <Text style={styles.timingLabel}>Repetitions</Text>
          <Text style={styles.timingSub}>Belly breaths this session</Text>
        </View>
        <Stepper value={cycles} min={5} max={20} onChange={setCycles} unit="" />
      </View>

      <View style={styles.divider} />
      <Text style={styles.estimate}>Estimated session: ~{estimateMin} minutes</Text>

      <Pressable style={styles.beginBtn} onPress={() => onBegin(inhale, exhale, cycles)}>
        <Text style={styles.beginText}>Begin Breathing</Text>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: spacingX.md, paddingBottom: spacingY.xxl },
  title: { fontFamily: FONTS.primaryBold, fontSize: fontSizes.large, color: colors.textDark, marginBottom: spacingY.sm },
  positionCard: {
    backgroundColor: colors.libraryCard, borderRadius: radii.lg,
    padding: spacingX.md, alignItems: 'center', borderWidth: 1, borderColor: colors.libraryBorder,
  },
  svg: { alignSelf: 'center' },
  arrowLabel: { fontFamily: FONTS.primary, fontSize: fontSizes.tiny, color: ACCENT, marginTop: spacingY.xs },
  checkList: { marginTop: spacingY.md },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: spacingX.xs, marginBottom: spacingY.xxs },
  checkText: { fontFamily: FONTS.primary, fontSize: fontSizes.small, color: colors.textDark },
  sectionTitle: { fontFamily: FONTS.primaryBold, fontSize: fontSizes.medium, color: colors.textDark },
  timingRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginTop: spacingY.md,
  },
  timingLabel: { fontFamily: FONTS.primaryBold, fontSize: fontSizes.small, color: colors.textDark },
  timingSub: { fontFamily: FONTS.primary, fontSize: fontSizes.tiny, color: colors.textMuted },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: spacingX.sm },
  stepBtn: {
    width: 36, height: 36, borderRadius: radii.pill,
    backgroundColor: colors.librarySurface, borderWidth: 1, borderColor: colors.libraryBorder,
    justifyContent: 'center', alignItems: 'center',
  },
  stepValue: {
    fontFamily: FONTS.primaryBold, fontSize: fontSizes.medium,
    color: colors.textDark, minWidth: wp('10%'), textAlign: 'center',
  },
  warning: { fontFamily: FONTS.primary, fontSize: fontSizes.tiny, color: colors.warning, marginTop: 4 },
  divider: { height: 1, backgroundColor: colors.libraryBorder, marginVertical: spacingY.md },
  estimate: { fontFamily: FONTS.primary, fontSize: fontSizes.small, color: colors.textMuted, textAlign: 'center' },
  beginBtn: {
    backgroundColor: ACCENT, borderRadius: radii.pill,
    paddingVertical: spacingY.sm, alignItems: 'center', marginTop: spacingY.xl,
  },
  beginText: { color: colors.white, fontFamily: FONTS.primaryBold, fontSize: fontSizes.medium },
});
