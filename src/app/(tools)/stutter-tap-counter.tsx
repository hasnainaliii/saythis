import React, { useState } from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, FONTS, fontSizes, spacingX, spacingY, radii } from '../../theme/Theme';
import { ToolIntroScreen } from '../../components/tools/ToolIntroScreen';
import { ToolResultScreen } from '../../components/tools/ToolResultScreen';
import { useSessionStatsTracker } from '../../hooks/useSessionStatsTracker';
import { saveSessionToBackend, StutterTapCounterSessionStats } from '../../utils/toolSessionApi';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSequence } from 'react-native-reanimated';

const INTRO_CARDS = [
  {
    icon: 'hand-left-outline',
    iconColor: colors.secondary,
    title: 'Track Your Moments',
    body: 'Tapping helps you capture stutter moments and build awareness over time.',
    step: 1,
  },
  {
    icon: 'analytics-outline',
    iconColor: colors.secondary,
    title: 'Build Awareness',
    body: 'Review the count after a session to note triggers and patterns.',
    step: 2,
  },
];

const TapSession = ({ onComplete }: { onComplete: (taps: number) => void }) => {
  const [taps, setTaps] = useState(0);
  const scale = useSharedValue(1);
  const insets = useSafeAreaInsets();

  const handleTap = () => {
    setTaps(t => t + 1);
    scale.value = withSequence(
      withTiming(1.1, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
  };

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={[styles.sessionContainer, { paddingTop: insets.top }]}>
      <Text style={styles.sessionTitle}>Stutter Tap Counter</Text>
      <Text style={styles.sessionSubtitle}>Read the passage aloud. Tap the circle every time you experience a stutter or block.</Text>
      
      <View style={styles.passageBox}>
        <Text style={styles.passageText}>
          Speech is a complex motor task. It requires coordination of breathing, voicing, and articulation. When we slow down, we give our brain more time to plan the next movement. This reduces tension and helps words flow more smoothly. Tracking our stutters helps separate the physical event from the emotional reaction.
        </Text>
      </View>
      
      <View style={styles.counterWrap}>
        <Animated.View style={animStyle}>
          <Pressable style={styles.tapCircle} onPress={handleTap}>
            <Text style={styles.tapNumber}>{taps}</Text>
            <Text style={styles.tapLabel}>Taps</Text>
          </Pressable>
        </Animated.View>
      </View>

      <Pressable style={styles.finishBtn} onPress={() => onComplete(taps)}>
        <Text style={styles.finishBtnText}>Finish Session</Text>
      </Pressable>
    </View>
  );
};

export default function StutterTapCounterScreen() {
  const router = useRouter();
  const [stage, setStage] = useState<'intro' | 'session' | 'result'>('intro');
  const [totalTaps, setTotalTaps] = useState(0);

  const {
    startedAt,
    durationSeconds,
    startSession,
    endSession,
  } = useSessionStatsTracker('STUTTER_TAP_COUNTER');

  const handleStart = () => {
    startSession();
    setStage('session');
  };

  const handleComplete = (taps: number) => {
    endSession();
    setTotalTaps(taps);
    setStage('result');
  };

  const handleSaveAndExit = async (rating: number | null) => {
    if (!startedAt) {
      router.back();
      return;
    }

    const payload: StutterTapCounterSessionStats = {
      toolType: 'STUTTER_TAP_COUNTER',
      startedAt: startedAt,
      endedAt: new Date().toISOString(),
      durationSeconds,
      selfRating: rating,
      estimatedWords: 0,
      totalTaps,
    };

    try {
      await saveSessionToBackend(payload);
    } catch (e) {
      console.log('Saved offline');
    }
    
    router.back();
  };

  return (
    <View style={styles.container}>
      {stage === 'intro' && (
        <ToolIntroScreen
          toolName="Stutter Tap Counter"
          tagline="Track moments with a quick tap."
          accentColor={colors.secondary}
          cards={INTRO_CARDS}
          onComplete={handleStart}
        />
      )}

      {stage === 'session' && (
        <TapSession onComplete={handleComplete} />
      )}

      {stage === 'result' && (
        <ToolResultScreen
          toolName="Stutter Tap Counter"
          subtitle="Session Complete"
          accentColor={colors.secondary}
          stats={[
            { label: 'Total Taps', value: totalTaps },
            { label: 'Duration', value: durationSeconds, unit: 's' },
            { label: 'Stutters/Min', value: durationSeconds > 0 ? Math.round((totalTaps / Math.max(1, durationSeconds)) * 60) : 0 }
          ]}
          onSave={handleSaveAndExit}
          onRepeat={() => {
            setTotalTaps(0);
            setStage('intro');
          }}
          tipCard={{
            icon: 'bar-chart-outline',
            iconColor: colors.warning,
            title: 'Build Awareness',
            body: 'Tracking stutters helps separate the physical event from the emotional reaction.'
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary },
  sessionContainer: { flex: 1, padding: spacingX.lg, alignItems: 'center' },
  sessionTitle: { fontFamily: FONTS.primaryBlack, fontSize: fontSizes.xl, color: colors.textDark, marginTop: spacingY.md },
  sessionSubtitle: { fontFamily: FONTS.primary, fontSize: fontSizes.medium, color: colors.textMuted, textAlign: 'center', marginTop: spacingY.sm, marginBottom: spacingY.md },
  passageBox: { backgroundColor: colors.libraryCard, padding: spacingX.lg, borderRadius: radii.md, borderWidth: 1, borderColor: colors.libraryBorder, width: '100%', marginBottom: spacingY.lg },
  passageText: { fontFamily: FONTS.primary, fontSize: fontSizes.medium, color: colors.textDark, lineHeight: 26 },
  counterWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  tapCircle: { width: 200, height: 200, borderRadius: 100, backgroundColor: colors.secondary, justifyContent: 'center', alignItems: 'center', elevation: 4, shadowColor: colors.secondary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  tapNumber: { fontFamily: FONTS.primaryBlack, fontSize: 64, color: colors.white },
  tapLabel: { fontFamily: FONTS.primaryBold, fontSize: fontSizes.large, color: colors.white, opacity: 0.8 },
  finishBtn: { width: '100%', paddingVertical: spacingY.md, borderRadius: radii.pill, alignItems: 'center', borderWidth: 2, borderColor: colors.libraryBorder, marginBottom: spacingY.xl },
  finishBtnText: { fontFamily: FONTS.primaryBold, fontSize: fontSizes.medium, color: colors.textDark },
});
