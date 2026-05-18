import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { colors, FONTS, fontSizes, spacingX, spacingY, radii } from '../../theme/Theme';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { BoxBreathingVisual } from './BoxBreathingVisual';

type BoxPhase = 'inhale' | 'hold_top' | 'exhale' | 'hold_bottom';

const INSTRUCTIONS: Record<BoxPhase, string> = {
  inhale: 'Breathe in through your nose',
  hold_top: 'Hold — stay relaxed',
  exhale: 'Breathe out through your lips',
  hold_bottom: 'Empty — stay still',
};

interface BoxBreathingSessionProps {
  currentPhase: BoxPhase;
  progress: number;
  secondsPerSide: number;
  cyclesCompleted: number;
  targetCycles: number;
  elapsedDisplay: string;
  isPaused: boolean;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
}

export const BoxBreathingSession: React.FC<BoxBreathingSessionProps> = ({
  currentPhase, progress, secondsPerSide,
  cyclesCompleted, targetCycles, elapsedDisplay,
  isPaused, onPause, onResume, onStop,
}) => {
  const ACCENT = colors.secondary;

  return (
    <View style={styles.container}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <Pressable onPress={isPaused ? onResume : onPause}>
          <Ionicons
            name={isPaused ? 'play-circle-outline' : 'pause-circle-outline'}
            size={26} color={colors.textMuted}
          />
        </Pressable>
        <Text style={styles.cycleText}>Cycle {cyclesCompleted + 1} of {targetCycles}</Text>
        <Pressable onPress={onStop}>
          <Ionicons name="stop-circle-outline" size={26} color={colors.error} />
        </Pressable>
      </View>

      {/* Elapsed timer */}
      <Text style={styles.elapsed}>{elapsedDisplay}</Text>

      {/* Box visual */}
      <BoxBreathingVisual
        currentPhase={currentPhase}
        progress={progress}
        secondsPerSide={secondsPerSide}
        accentColor={ACCENT}
      />

      {/* Phase instruction */}
      <Animated.Text
        key={currentPhase}
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(200)}
        style={styles.instruction}
      >
        {INSTRUCTIONS[currentPhase]}
      </Animated.Text>

      {/* Cycle progress dots */}
      <View style={styles.dotsRow}>
        {Array.from({ length: targetCycles }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i < cyclesCompleted && { backgroundColor: ACCENT },
              i === cyclesCompleted && { backgroundColor: ACCENT, width: 14, height: 14, borderRadius: 7 },
            ]}
          />
        ))}
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
  elapsed: {
    fontFamily: FONTS.primaryBlack, fontSize: fontSizes.xl,
    color: colors.textDark, textAlign: 'center', marginBottom: spacingY.sm,
  },
  instruction: {
    fontFamily: FONTS.primary, fontSize: fontSizes.small,
    color: colors.textMuted, textAlign: 'center', marginTop: spacingY.md,
  },
  dotsRow: {
    flexDirection: 'row', justifyContent: 'center',
    alignItems: 'center', gap: spacingX.xs, marginTop: spacingY.md,
  },
  dot: {
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: colors.libraryBorder,
  },
});
