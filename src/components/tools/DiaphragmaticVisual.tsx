import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming,
  Easing, FadeIn,
} from 'react-native-reanimated';
import { colors, FONTS, fontSizes, spacingX, spacingY, radii } from '../../theme/Theme';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

type DiaPhase = 'inhale' | 'hold' | 'exhale' | 'rest';

interface DiaphragmaticVisualProps {
  phase: DiaPhase;
  progress: number;
  accentColor: string;
  phaseDurationSec: number;
}

const PHASE_COLORS: Record<DiaPhase, string> = {
  inhale: colors.secondary,
  hold: colors.warning,
  exhale: colors.secondary,
  rest: colors.textDisabled,
};

export const DiaphragmaticVisual: React.FC<DiaphragmaticVisualProps> = ({
  phase, progress, accentColor, phaseDurationSec,
}) => {
  const bellyScale = useSharedValue(1);
  const glowScale = useSharedValue(1);
  const arrowY = useSharedValue(0);

  const dur = phaseDurationSec * 1000;

  useEffect(() => {
    if (phase === 'inhale') {
      bellyScale.value = withTiming(1.18, { duration: dur, easing: Easing.inOut(Easing.ease) });
      glowScale.value = withTiming(1.22, { duration: dur, easing: Easing.inOut(Easing.ease) });
      arrowY.value = withTiming(-16, { duration: dur });
    } else if (phase === 'exhale') {
      bellyScale.value = withTiming(1.0, { duration: dur, easing: Easing.inOut(Easing.ease) });
      glowScale.value = withTiming(1.0, { duration: dur, easing: Easing.inOut(Easing.ease) });
      arrowY.value = withTiming(16, { duration: dur });
    } else if (phase === 'hold') {
      bellyScale.value = withTiming(1.18, { duration: 200 });
      arrowY.value = withTiming(-16, { duration: 200 });
    } else {
      bellyScale.value = withTiming(1.0, { duration: 200 });
      arrowY.value = withTiming(0, { duration: 200 });
    }
  }, [phase, dur]);

  const bellyStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bellyScale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glowScale.value }],
  }));

  const arrowStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: arrowY.value }],
  }));

  const remaining = ((1 - progress) * phaseDurationSec).toFixed(1);
  const isUp = phase === 'inhale' || phase === 'hold';

  return (
    <View style={styles.container}>
      {/* Chest indicator */}
      <Text style={styles.chestLabel}>CHEST</Text>
      <View style={styles.chestRow}>
        <View style={styles.chestOval} />
        <Text style={styles.chestHint}>✗ stay still</Text>
      </View>

      {/* Belly circle */}
      <View style={styles.bellyArea}>
        <Animated.View style={[styles.glow, { backgroundColor: accentColor + '08' }, glowStyle]} />
        <Animated.View style={[styles.belly, { borderColor: accentColor, backgroundColor: accentColor + '15' }, bellyStyle]}>
          <Animated.View key={phase} entering={FadeIn.duration(200)}>
            <Ionicons
              name={isUp ? 'arrow-up' : 'arrow-down'}
              size={28} color={accentColor}
            />
          </Animated.View>
          <Text style={[styles.phaseLabel, { color: PHASE_COLORS[phase] }]}>
            {phase.toUpperCase()}
          </Text>
          <Text style={styles.countdown}>({remaining}s)</Text>
        </Animated.View>
      </View>

      <Text style={styles.bellyLabel}>BELLY</Text>
      <Text style={styles.bellyHint}>↑ rises on inhale  ↓ falls on exhale</Text>

      {/* Side arrow */}
      <Animated.View style={[styles.sideArrow, arrowStyle]}>
        <Ionicons name={isUp ? 'arrow-up' : 'arrow-down'} size={20} color={accentColor} />
        <Text style={styles.sideArrowText}>breathe</Text>
      </Animated.View>

      {/* Hand reminder */}
      <View style={styles.handCard}>
        <Ionicons name="hand-right-outline" size={16} color={colors.textMuted} />
        <Text style={styles.handText}>One hand on belly — feel it rise and fall</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', height: hp('45%'), justifyContent: 'center' },
  chestLabel: {
    fontFamily: FONTS.primary, fontSize: fontSizes.tiny,
    color: colors.textDisabled, marginBottom: 4,
  },
  chestRow: { flexDirection: 'row', alignItems: 'center', gap: spacingX.xs, marginBottom: spacingY.md },
  chestOval: {
    width: wp('22%'), height: hp('3%'),
    backgroundColor: colors.librarySurface,
    borderWidth: 1, borderColor: colors.libraryBorder, borderRadius: radii.pill,
  },
  chestHint: { fontFamily: FONTS.primary, fontSize: fontSizes.tiny, color: colors.textDisabled },
  bellyArea: { alignItems: 'center', justifyContent: 'center' },
  glow: {
    position: 'absolute', width: wp('58%'), height: wp('58%'),
    borderRadius: wp('29%'),
  },
  belly: {
    width: wp('52%'), height: wp('52%'), borderRadius: wp('26%'),
    borderWidth: 3, alignItems: 'center', justifyContent: 'center',
  },
  phaseLabel: { fontFamily: FONTS.primaryBold, fontSize: fontSizes.medium, marginTop: 4 },
  countdown: { fontFamily: FONTS.primary, fontSize: fontSizes.small, color: colors.textMuted },
  bellyLabel: {
    fontFamily: FONTS.primaryBold, fontSize: fontSizes.tiny,
    color: colors.textMuted, marginTop: spacingY.xs,
  },
  bellyHint: {
    fontFamily: FONTS.primary, fontSize: fontSizes.tiny,
    color: colors.textDisabled,
  },
  sideArrow: {
    position: 'absolute', right: spacingX.md, alignItems: 'center',
  },
  sideArrowText: { fontFamily: FONTS.primary, fontSize: fontSizes.tiny, color: colors.textMuted },
  handCard: {
    flexDirection: 'row', alignItems: 'center', gap: spacingX.xs,
    backgroundColor: colors.librarySurface, borderRadius: radii.md,
    paddingHorizontal: spacingX.sm, paddingVertical: spacingY.xxs,
    marginTop: spacingY.sm,
  },
  handText: { fontFamily: FONTS.primary, fontSize: fontSizes.tiny, color: colors.textMuted },
});
