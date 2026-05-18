import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { colors, FONTS, fontSizes, spacingX, spacingY, radii } from '../../theme/Theme';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { BoxBreathingVisual } from './BoxBreathingVisual';
import { useBreathingPhaseTimer, BreathingPhase } from '../../hooks/useBreathingPhaseTimer';

const ACCENT = colors.secondary;

// ──── STEP 0: SETTLE ────────────────────────────
interface SettleStepProps { onComplete: () => void; }

const settlePhases: BreathingPhase[] = [
  { id: 'inhale', label: 'INHALE', durationMs: 4000, color: ACCENT },
  { id: 'hold_top', label: 'HOLD', durationMs: 4000, color: colors.warning },
  { id: 'exhale', label: 'EXHALE', durationMs: 4000, color: colors.secondary },
  { id: 'hold_bottom', label: 'HOLD', durationMs: 4000, color: colors.warning },
];

export const SettleStep: React.FC<SettleStepProps> = ({ onComplete }) => {
  const timer = useBreathingPhaseTimer({
    phases: settlePhases,
    totalCycles: 2,
    onComplete,
  });

  useEffect(() => { timer.start(); }, []);

  type BoxPhase = 'inhale' | 'hold_top' | 'exhale' | 'hold_bottom';

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepHeader}>Step 1 of 5 — Settle</Text>
      <Text style={styles.stepSub}>Two box breaths to calm your nervous system</Text>
      <BoxBreathingVisual
        currentPhase={(timer.currentPhase?.id || 'inhale') as BoxPhase}
        progress={timer.progress}
        secondsPerSide={4}
        accentColor={ACCENT}
      />
      <Text style={styles.hint}>Breathe in a square pattern. The visual guides your timing.</Text>
    </View>
  );
};

// ──── STEP 1: RELEASE ────────────────────────────
interface ReleaseStepProps { onComplete: () => void; }

const RELEASE_ACTIONS = [
  { icon: 'body-outline', title: 'Roll your shoulders', instruction: 'Roll them back slowly 3 times, then let them drop', duration: 7 },
  { icon: 'happy-outline', title: 'Drop your jaw', instruction: 'Open your mouth gently, let your jaw hang loose, waggle it side to side', duration: 7 },
  { icon: 'mic-outline', title: 'Relax your throat', instruction: 'Swallow once, then let your throat open. Don\'t grip.', duration: 6 },
];

export const ReleaseStep: React.FC<ReleaseStepProps> = ({ onComplete }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const totalDuration = 20;
  const [totalRemaining, setTotalRemaining] = useState(totalDuration);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setElapsed(prev => {
        const next = prev + 1;
        setTotalRemaining(totalDuration - next);

        let cumulative = 0;
        for (let i = 0; i < RELEASE_ACTIONS.length; i++) {
          cumulative += RELEASE_ACTIONS[i].duration;
          if (next < cumulative) { setActiveIdx(i); break; }
          if (i === RELEASE_ACTIONS.length - 1 && next >= cumulative) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            onComplete();
          }
        }
        return next;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  let cumulativeBefore = 0;
  for (let i = 0; i < activeIdx; i++) cumulativeBefore += RELEASE_ACTIONS[i].duration;
  const actionElapsed = elapsed - cumulativeBefore;
  const actionDuration = RELEASE_ACTIONS[activeIdx]?.duration || 1;
  const actionProgress = Math.min(1, actionElapsed / actionDuration);

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepHeader}>Step 2 of 5 — Release</Text>
      <Text style={styles.stepSub}>Release tension from your shoulders, jaw, and throat</Text>

      <View style={styles.countdownCircle}>
        <Text style={styles.countdownText}>{totalRemaining}s</Text>
      </View>

      {RELEASE_ACTIONS.map((action, i) => {
        const isActive = i === activeIdx;
        const isComplete = i < activeIdx;
        return (
          <View key={i} style={styles.releaseCard}>
            <View style={[
              styles.releaseIcon,
              isActive && { backgroundColor: ACCENT },
              isComplete && { backgroundColor: colors.success },
            ]}>
              <Ionicons
                name={isComplete ? 'checkmark-circle' : action.icon as any}
                size={20}
                color={isActive || isComplete ? colors.white : colors.textDisabled}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.releaseTitle}>{action.title}</Text>
              <Text style={styles.releaseInstruction}>{action.instruction}</Text>
              {isActive && (
                <View style={styles.releaseProgressBg}>
                  <View style={[styles.releaseProgressFill, { width: `${actionProgress * 100}%` }]} />
                </View>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
};

// ──── STEP 2: WARM UP ────────────────────────────
interface WarmUpStepProps { onComplete: () => void; }

export const WarmUpStep: React.FC<WarmUpStepProps> = ({ onComplete }) => {
  const [remaining, setRemaining] = useState(30);

  useEffect(() => {
    const iv = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) { clearInterval(iv); onComplete(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepHeader}>Step 3 of 5 — Warm Up</Text>
      <Text style={styles.stepSub}>Hum gently to wake up your vocal cords</Text>

      <View style={[styles.instructionBox, { borderLeftColor: ACCENT }]}>
        <Ionicons name="musical-note-outline" size={20} color={ACCENT} />
        <View style={{ flex: 1, marginLeft: spacingX.xs }}>
          <Text style={styles.instructionTitle}>Gentle humming</Text>
          <Text style={styles.instructionBody}>
            Close your lips and hum a steady, low note — like 'mmmm'. Feel the vibration in your lips and chest.
          </Text>
        </View>
      </View>

      <View style={styles.countdownCircle}>
        <Text style={styles.countdownText}>{remaining}s</Text>
      </View>

      <Text style={styles.hint}>You should feel vibration in your lips and chest</Text>
    </View>
  );
};

// ──── STEP 3: EASY ONSET ────────────────────────
interface EasyOnsetStepProps { onComplete: () => void; phrases: { text: string; hint: string }[]; }

export const EasyOnsetStep: React.FC<EasyOnsetStepProps> = ({ onComplete, phrases }) => {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const phrase = phrases[phraseIdx];

  const handlePhraseComplete = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if (phraseIdx < phrases.length - 1) {
      setPhraseIdx(phraseIdx + 1);
    } else {
      onComplete();
    }
  };

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepHeader}>Step 4 of 5 — Easy Onset</Text>
      <Text style={styles.stepSub}>Practise starting words with a soft, gentle touch</Text>

      <Animated.View key={phraseIdx} entering={FadeIn.duration(250)} style={styles.phraseCard}>
        <Text style={styles.phraseCounter}>Phrase {phraseIdx + 1} of {phrases.length}</Text>
        <Text style={styles.phraseText}>
          <Text style={{ color: ACCENT }}>{phrase.text[0]}</Text>
          {phrase.text.slice(1)}
        </Text>
        <Text style={styles.phraseHint}>{phrase.hint}</Text>

        <Pressable
          style={styles.sayBtn}
          onPress={handlePhraseComplete}
        >
          <Text style={styles.sayBtnText}>I said it ✓</Text>
        </Pressable>
      </Animated.View>

      <View style={styles.phraseDots}>
        {phrases.map((_, i) => (
          <View key={i} style={[styles.phraseDot, i === phraseIdx && { backgroundColor: ACCENT, width: 12, height: 12, borderRadius: 6 }]} />
        ))}
      </View>
    </View>
  );
};

// ──── STEP 4: AFFIRM ────────────────────────────
interface AffirmStepProps { onComplete: () => void; affirmation: string; }

export const AffirmStep: React.FC<AffirmStepProps> = ({ onComplete, affirmation }) => {
  const [showLaunch, setShowLaunch] = useState(false);

  const handleHoldComplete = () => {
    setShowLaunch(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(onComplete, 1200);
  };

  if (showLaunch) {
    return (
      <View style={styles.launchContainer}>
        <Animated.View entering={ZoomIn.duration(400)} style={styles.launchCircle}>
          <Ionicons name="rocket-outline" size={40} color={colors.white} />
        </Animated.View>
        <Text style={styles.launchText}>You're ready. Go.</Text>
      </View>
    );
  }

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepHeader}>Step 5 of 5 — Affirm</Text>
      <Text style={styles.stepSub}>Read this aloud. Mean every word.</Text>

      <View style={styles.affirmCard}>
        <Text style={styles.affirmLabel}>TODAY'S AFFIRMATION</Text>
        <Text style={styles.affirmText}>{affirmation}</Text>
        <Text style={styles.affirmInstruction}>
          Read this aloud, slowly, using easy onset on the first word
        </Text>
      </View>

      <Pressable style={styles.holdBtn} onPress={handleHoldComplete}>
        <Text style={styles.holdBtnText}>I'm ready ✓</Text>
        <Text style={styles.holdBtnSub}>Say it aloud first</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  stepContainer: { flex: 1, padding: spacingX.md },
  stepHeader: { fontFamily: FONTS.primaryBold, fontSize: fontSizes.medium, color: colors.textDark },
  stepSub: { fontFamily: FONTS.primary, fontSize: fontSizes.small, color: colors.textMuted, marginBottom: spacingY.md },
  hint: { fontFamily: FONTS.primary, fontSize: fontSizes.tiny, color: colors.textMuted, textAlign: 'center', marginTop: spacingY.sm },

  countdownCircle: {
    width: wp('18%'), height: wp('18%'), borderRadius: wp('9%'),
    borderWidth: 3, borderColor: ACCENT,
    alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginVertical: spacingY.md,
  },
  countdownText: { fontFamily: FONTS.primaryBold, fontSize: fontSizes.medium, color: colors.textDark },

  // Release
  releaseCard: {
    flexDirection: 'row', alignItems: 'center', gap: spacingX.sm,
    backgroundColor: colors.libraryCard, borderRadius: radii.lg,
    padding: spacingX.md, marginBottom: spacingY.sm,
    borderWidth: 1, borderColor: colors.libraryBorder,
  },
  releaseIcon: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.librarySurface,
    alignItems: 'center', justifyContent: 'center',
  },
  releaseTitle: { fontFamily: FONTS.primaryBold, fontSize: fontSizes.small, color: colors.textDark },
  releaseInstruction: { fontFamily: FONTS.primary, fontSize: fontSizes.tiny, color: colors.textMuted },
  releaseProgressBg: { height: hp('0.4%'), backgroundColor: colors.libraryBorder, borderRadius: radii.pill, marginTop: 4, overflow: 'hidden' },
  releaseProgressFill: { height: '100%', backgroundColor: ACCENT, borderRadius: radii.pill },

  // Warm up
  instructionBox: {
    flexDirection: 'row', backgroundColor: colors.libraryCard,
    borderRadius: radii.lg, padding: spacingX.md,
    borderLeftWidth: 3, borderWidth: 1, borderColor: colors.libraryBorder,
    marginBottom: spacingY.md,
  },
  instructionTitle: { fontFamily: FONTS.primaryBold, fontSize: fontSizes.small, color: colors.textDark },
  instructionBody: { fontFamily: FONTS.primary, fontSize: fontSizes.tiny, color: colors.textMuted, marginTop: 2 },

  // Easy onset
  phraseCard: {
    backgroundColor: colors.libraryCard, borderRadius: radii.xl,
    padding: spacingX.xl, alignItems: 'center',
    borderWidth: 2, borderColor: ACCENT + '44',
  },
  phraseCounter: { fontFamily: FONTS.primaryBold, fontSize: fontSizes.tiny, color: colors.textMuted, textTransform: 'uppercase', marginBottom: spacingY.sm },
  phraseText: { fontFamily: FONTS.primaryBlack, fontSize: fontSizes.xxl, color: colors.textDark, textAlign: 'center' },
  phraseHint: { fontFamily: FONTS.primary, fontSize: fontSizes.small, color: colors.textMuted, textAlign: 'center', fontStyle: 'italic', marginTop: spacingY.sm, marginBottom: spacingY.lg },
  sayBtn: { backgroundColor: ACCENT, borderRadius: radii.pill, paddingHorizontal: spacingX.xl, paddingVertical: spacingY.sm },
  sayBtnText: { fontFamily: FONTS.primaryBold, fontSize: fontSizes.medium, color: colors.white },
  phraseDots: { flexDirection: 'row', justifyContent: 'center', gap: spacingX.xs, marginTop: spacingY.md },
  phraseDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.libraryBorder },

  // Affirm
  affirmCard: {
    backgroundColor: colors.librarySurface, borderRadius: radii.xl,
    padding: spacingX.xl, borderLeftWidth: 4, borderLeftColor: ACCENT,
    marginBottom: spacingY.lg,
  },
  affirmLabel: { fontFamily: FONTS.primaryBold, fontSize: fontSizes.tiny, color: ACCENT, textTransform: 'uppercase', marginBottom: spacingY.sm },
  affirmText: { fontFamily: FONTS.primaryBold, fontSize: fontSizes.large, color: colors.textDark, textAlign: 'center', lineHeight: hp('3.8%') },
  affirmInstruction: { fontFamily: FONTS.primary, fontSize: fontSizes.small, color: colors.textMuted, textAlign: 'center', marginTop: spacingY.md },
  holdBtn: {
    backgroundColor: ACCENT, borderRadius: radii.xl, paddingVertical: spacingY.sm,
    alignItems: 'center',
  },
  holdBtnText: { fontFamily: FONTS.primaryBold, fontSize: fontSizes.medium, color: colors.white },
  holdBtnSub: { fontFamily: FONTS.primary, fontSize: fontSizes.tiny, color: colors.white + 'BB', marginTop: 2 },

  // Launch
  launchContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  launchCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: ACCENT, alignItems: 'center', justifyContent: 'center',
    marginBottom: spacingY.md,
  },
  launchText: { fontFamily: FONTS.primaryBlack, fontSize: fontSizes.large, color: colors.textDark },
});
