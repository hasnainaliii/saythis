import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { colors, FONTS, fontSizes, spacingX, spacingY, radii } from '../../theme/Theme';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { DiaphragmaticVisual } from './DiaphragmaticVisual';

type DiaPhase = 'inhale' | 'hold' | 'exhale' | 'rest';

const INSTRUCTIONS: Record<DiaPhase, string> = {
  inhale: 'Breathe in slowly… belly first, then chest',
  hold: 'Pause gently…',
  exhale: 'Breathe out… slow and steady through your lips',
  rest: 'Rest…',
};

interface DiaphragmaticSessionProps {
  phase: DiaPhase;
  progress: number;
  cyclesCompleted: number;
  targetCycles: number;
  isPaused: boolean;
  accentColor: string;
  phaseDurationSec: number;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
}

export const DiaphragmaticSession: React.FC<DiaphragmaticSessionProps> = ({
  phase, progress, cyclesCompleted, targetCycles,
  isPaused, accentColor, phaseDurationSec,
  onPause, onResume, onStop,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Pressable onPress={isPaused ? onResume : onPause}>
          <Ionicons
            name={isPaused ? 'play-circle-outline' : 'pause-circle-outline'}
            size={26} color={colors.textMuted}
          />
        </Pressable>
        <Text style={styles.cycleText}>Breath {cyclesCompleted + 1} of {targetCycles}</Text>
        <Pressable onPress={onStop}>
          <Ionicons name="stop-circle-outline" size={26} color={colors.error} />
        </Pressable>
      </View>

      <DiaphragmaticVisual
        phase={phase}
        progress={progress}
        accentColor={accentColor}
        phaseDurationSec={phaseDurationSec}
      />

      <Animated.Text
        key={phase}
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(200)}
        style={styles.instruction}
      >
        {INSTRUCTIONS[phase]}
      </Animated.Text>

      {/* Progress label */}
      <Text style={styles.progressLabel}>{cyclesCompleted} of {targetCycles} breaths</Text>

      {/* Progress bar */}
      <View style={styles.progressBg}>
        <View
          style={[
            styles.progressFill,
            {
              backgroundColor: accentColor,
              width: `${Math.min(100, (cyclesCompleted / targetCycles) * 100)}%`,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary, paddingHorizontal: spacingX.md },
  topBar: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: spacingY.sm,
  },
  cycleText: { fontFamily: FONTS.primaryBold, fontSize: fontSizes.small, color: colors.textDark },
  instruction: {
    fontFamily: FONTS.primary, fontSize: fontSizes.small,
    color: colors.textMuted, textAlign: 'center', marginTop: spacingY.md,
  },
  progressLabel: {
    fontFamily: FONTS.primary, fontSize: fontSizes.tiny,
    color: colors.textMuted, textAlign: 'right', marginTop: spacingY.md,
  },
  progressBg: {
    width: '100%', height: hp('0.4%'), borderRadius: radii.pill,
    backgroundColor: colors.libraryBorder, marginTop: spacingY.xxs, overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: radii.pill },
});
