import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { colors, FONTS, fontSizes, spacingX, spacingY, radii } from '../../../theme/Theme';

interface MuscleGroup {
  step: number;
  muscle_group: string;
  instruction: string;
  speech_critical?: boolean;
  note?: string;
}

interface Props {
  sequence: MuscleGroup[];
  onComplete: () => void;
}

const TENSE_SECONDS = 5;
const RELAX_SECONDS = 20;

const GuidedPMRSession: React.FC<Props> = ({ sequence, onComplete }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [phase, setPhase] = useState<'idle' | 'tense' | 'relax' | 'done'>('idle');
  const [countdown, setCountdown] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const progress = useSharedValue(0);
  const cardX = useSharedValue(0);
  const cardOpacity = useSharedValue(1);

  const total = sequence.length;
  const current = sequence[currentIdx];

  const clearTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const runPhase = useCallback((p: 'tense' | 'relax', seconds: number) => {
    setPhase(p);
    setCountdown(seconds);
    clearTimer();

    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearTimer();
          if (p === 'tense') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            runPhase('relax', RELAX_SECONDS);
          } else {
            advanceStep();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [clearTimer]);

  const advanceStep = useCallback(() => {
    if (currentIdx >= total - 1) {
      setPhase('done');
      clearTimer();
      return;
    }
    // slide animation
    cardOpacity.value = withTiming(0, { duration: 150 });
    cardX.value = withTiming(-30, { duration: 150 }, () => {
      setCurrentIdx(prev => prev + 1);
      cardX.value = 30;
      cardOpacity.value = withTiming(1, { duration: 200 });
      cardX.value = withSpring(0, { damping: 15 });
    });
    progress.value = withTiming((currentIdx + 1) / total, { duration: 300 });
  }, [currentIdx, total, clearTimer]);

  const startSession = () => {
    setCurrentIdx(0);
    progress.value = 0;
    runPhase('tense', TENSE_SECONDS);
  };

  const togglePause = () => {
    if (paused) {
      setPaused(false);
      runPhase(phase as 'tense' | 'relax', countdown);
    } else {
      setPaused(true);
      clearTimer();
    }
  };

  useEffect(() => () => clearTimer(), [clearTimer]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: cardX.value }],
    opacity: cardOpacity.value,
  }));

  const phaseColor = phase === 'tense' ? colors.warning : colors.success;

  if (phase === 'done') {
    return (
      <View style={styles.doneContainer}>
        <Text style={styles.doneTitle}>Session Complete 🎉</Text>
        <Text style={styles.doneSub}>You've relaxed all muscle groups</Text>
        <Pressable style={styles.doneBtn} onPress={onComplete}>
          <Text style={styles.doneBtnText}>Continue</Text>
        </Pressable>
      </View>
    );
  }

  if (phase === 'idle') {
    return (
      <View style={styles.startContainer}>
        <Text style={styles.header}>Guided Session</Text>
        <Pressable style={styles.startBtn} onPress={startSession}>
          <Text style={styles.startBtnText}>Start Full Session</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.sessionContainer}>
      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <Animated.View style={[styles.progressFill, progressStyle]} />
      </View>

      <Text style={styles.stepCounter}>Step {currentIdx + 1} of {total}</Text>

      <Animated.View style={[styles.sessionCard, cardStyle, { borderColor: phaseColor + '30' }]}>
        <Text style={styles.muscleName}>{current.muscle_group}</Text>
        {current.speech_critical && (
          <View style={styles.speechTag}>
            <Text style={styles.speechTagText}>🎙 Speech Critical</Text>
          </View>
        )}
        <Text style={styles.instruction}>{current.instruction}</Text>
        {current.note && phase === 'relax' && (
          <Text style={styles.noteText}>{current.note}</Text>
        )}

        {/* Phase indicator */}
        <View style={[styles.phaseCircle, { borderColor: phaseColor }]}>
          <Text style={[styles.phaseLabel, { color: phaseColor }]}>
            {phase === 'tense' ? 'Tense' : 'Relax'}
          </Text>
          <Text style={[styles.phaseCount, { color: phaseColor }]}>{countdown}</Text>
        </View>
      </Animated.View>

      <Pressable style={styles.pauseBtn} onPress={togglePause}>
        <Text style={styles.pauseBtnText}>{paused ? 'Resume' : 'Pause'}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  startContainer: { alignItems: 'center', paddingVertical: spacingY.md },
  header: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.large,
    color: colors.textDark,
    marginBottom: spacingY.sm,
  },
  startBtn: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: radii.xl,
    marginBottom: spacingY.xs,
  },
  startBtnText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.white,
  },
  sessionContainer: { flex: 1, paddingVertical: spacingY.sm },
  progressTrack: {
    height: hp('0.5%'),
    backgroundColor: colors.primary10,
    borderRadius: radii.pill,
    marginBottom: spacingY.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.secondary,
    borderRadius: radii.pill,
  },
  stepCounter: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacingY.sm,
  },
  sessionCard: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: spacingX.lg,
    borderWidth: 2,
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  muscleName: {
    fontFamily: FONTS.primaryBlack,
    fontSize: fontSizes.xl,
    color: colors.textDark,
    marginBottom: 4,
  },
  speechTag: {
    backgroundColor: colors.secondary_10,
    borderRadius: radii.md,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: spacingY.xs,
  },
  speechTagText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.tiny,
    color: colors.secondary,
  },
  instruction: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.medium,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacingY.sm,
  },
  noteText: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.textMuted,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: spacingY.sm,
  },
  phaseCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacingY.xs,
  },
  phaseLabel: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
  },
  phaseCount: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.xl,
  },
  pauseBtn: {
    alignSelf: 'center',
    marginTop: spacingY.md,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  pauseBtnText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    color: colors.secondary,
  },
  doneContainer: {
    alignItems: 'center',
    paddingVertical: spacingY.xl,
  },
  doneTitle: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.xxl,
    color: colors.success,
    marginBottom: spacingY.xs,
  },
  doneSub: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.medium,
    color: colors.textMuted,
    marginBottom: spacingY.lg,
  },
  doneBtn: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: radii.xl,
  },
  doneBtnText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.white,
  },
});

export default GuidedPMRSession;
