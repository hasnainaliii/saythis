import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { colors, FONTS, fontSizes, spacingY, radii } from '../../../theme/Theme';

const DIAMETER = wp('55%');
const INHALE_MS = 4000;
const HOLD_MS = 2000;
const EXHALE_MS = 6000;
const CYCLE_MS = INHALE_MS + HOLD_MS + EXHALE_MS;
const TARGET_CYCLES = 5;

type Phase = 'idle' | 'inhale' | 'hold' | 'exhale' | 'done';

const BreathingCircle: React.FC = () => {
  const [phase, setPhase] = useState<Phase>('idle');
  const [count, setCount] = useState(0);
  const [cycles, setCycles] = useState(0);
  const [running, setRunning] = useState(false);

  const scale = useSharedValue(0.75);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phaseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
  }, []);

  const startCount = useCallback((seconds: number) => {
    setCount(1);
    let c = 1;
    timerRef.current = setInterval(() => {
      c++;
      if (c <= seconds) setCount(c);
    }, 1000);
  }, []);

  const runCycle = useCallback((cycleNum: number) => {
    if (cycleNum >= TARGET_CYCLES) {
      setPhase('done');
      setRunning(false);
      scale.value = withSpring(1.05, { damping: 8 }, () => {
        scale.value = withSpring(0.75, { damping: 12 });
      });
      return;
    }

    // Inhale
    setPhase('inhale');
    clearTimers();
    startCount(4);
    scale.value = withTiming(1.0, { duration: INHALE_MS, easing: Easing.inOut(Easing.ease) });

    phaseTimerRef.current = setTimeout(() => {
      // Hold
      setPhase('hold');
      clearTimers();
      startCount(2);
      scale.value = withTiming(1.02, { duration: HOLD_MS / 2 }, () => {
        scale.value = withTiming(1.0, { duration: HOLD_MS / 2 });
      });

      phaseTimerRef.current = setTimeout(() => {
        // Exhale
        setPhase('exhale');
        clearTimers();
        startCount(6);
        scale.value = withTiming(0.75, { duration: EXHALE_MS, easing: Easing.inOut(Easing.ease) });

        phaseTimerRef.current = setTimeout(() => {
          clearTimers();
          const next = cycleNum + 1;
          setCycles(next);
          runOnJS(runCycle)(next);
        }, EXHALE_MS);
      }, HOLD_MS);
    }, INHALE_MS);
  }, [clearTimers, startCount, scale]);

  const handlePress = useCallback(() => {
    if (phase === 'done') {
      setCycles(0);
      setPhase('idle');
      return;
    }
    if (running) {
      // pause
      clearTimers();
      setRunning(false);
      setPhase('idle');
      scale.value = withTiming(0.75, { duration: 300 });
    } else {
      setRunning(true);
      runCycle(cycles);
    }
  }, [running, phase, cycles, clearTimers, runCycle, scale]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const phaseLabel = phase === 'inhale' ? 'Breathe In'
    : phase === 'hold' ? 'Hold'
    : phase === 'exhale' ? 'Breathe Out'
    : phase === 'done' ? '✓ Done'
    : 'Ready';

  const phaseColor = phase === 'inhale' ? colors.categoryEducation
    : phase === 'hold' ? colors.textMuted
    : phase === 'exhale' ? colors.categorySelfAdvocacy
    : phase === 'done' ? colors.success
    : colors.textMuted;

  const btnLabel = phase === 'done' ? 'Reset'
    : running ? 'Pause' : cycles > 0 ? 'Resume' : 'Begin Breathing';

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.circle, circleStyle]}>
        <Text style={[styles.phaseText, { color: phaseColor }]}>{phaseLabel}</Text>
        {running && phase !== 'idle' && (
          <Text style={styles.countText}>{count}...</Text>
        )}
      </Animated.View>

      <Pressable style={styles.btn} onPress={handlePress}>
        <Text style={styles.btnText}>{btnLabel}</Text>
      </Pressable>

      <Text style={styles.cycleLabel}>Cycles completed: {cycles}</Text>
      <View style={styles.dotRow}>
        {Array.from({ length: TARGET_CYCLES }).map((_, i) => (
          <CycleDot key={i} filled={i < cycles} />
        ))}
      </View>
    </View>
  );
};

const CycleDot: React.FC<{ filled: boolean }> = ({ filled }) => {
  const s = useSharedValue(filled ? 1 : 0);

  useEffect(() => {
    s.value = withSpring(filled ? 1 : 0, { damping: 12 });
  }, [filled]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: s.value === 0 ? 1 : s.value }],
    backgroundColor: filled ? colors.success : 'transparent',
    borderColor: filled ? colors.success : colors.border,
  }));

  return <Animated.View style={[styles.dot, style]} />;
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: spacingY.md },
  circle: {
    width: DIAMETER,
    height: DIAMETER,
    borderRadius: DIAMETER / 2,
    borderWidth: 3,
    borderColor: colors.categoryEducation,
    backgroundColor: 'rgba(74,144,217,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  phaseText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.large,
  },
  countText: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.medium,
    color: colors.textMuted,
    marginTop: 4,
  },
  btn: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: radii.xl,
    marginTop: spacingY.md,
  },
  btnText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.white,
  },
  cycleLabel: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.textMuted,
    marginTop: spacingY.sm,
  },
  dotRow: { flexDirection: 'row', gap: 8, marginTop: spacingY.xs },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
  },
});

export default BreathingCircle;
