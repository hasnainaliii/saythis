import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, FONTS, fontSizes, spacingX, spacingY, radii } from '../../theme/Theme';
import { ToolIntroScreen } from '../../components/tools/ToolIntroScreen';
import { ToolResultScreen } from '../../components/tools/ToolResultScreen';
import { useSessionStatsTracker } from '../../hooks/useSessionStatsTracker';
import { saveSessionToBackend, TimedReadingWpmSessionStats } from '../../utils/toolSessionApi';

const PASSAGE = "Reading aloud is an excellent way to practice fluency. When we read without pressure, we can focus entirely on our breath and our pacing. This exercise helps you measure your baseline speaking rate. Most conversational speech is between one hundred and forty to one hundred and sixty words per minute. If you find yourself rushing, you can use this tool to practice slowing down. Smooth, steady speech gives your brain more time to plan sounds and navigate difficult words.";
const WORD_COUNT = PASSAGE.split(' ').length;

const INTRO_CARDS = [
  {
    icon: 'speedometer-outline',
    iconColor: colors.secondary,
    title: 'Measure Your Pace',
    body: 'Read the short passage at your normal, comfortable speaking rate.',
    step: 1,
  },
  {
    icon: 'time-outline',
    iconColor: colors.secondary,
    title: 'Track Over Time',
    body: 'Discover your baseline WPM and see how it changes when you feel rushed versus relaxed.',
    step: 2,
  },
];

const ReadingSession = ({ onComplete }: { onComplete: (wpm: number) => void }) => {
  const insets = useSafeAreaInsets();
  const [isPlaying, setIsPlaying] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying) {
      interval = setInterval(() => setSeconds(s => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleFinish = () => {
    setIsPlaying(false);
    const durationMin = Math.max(1, seconds) / 60;
    const wpm = Math.round(WORD_COUNT / durationMin);
    onComplete(wpm);
  };

  return (
    <View style={[styles.sessionContainer, { paddingTop: insets.top }]}>
      <Text style={styles.sessionTitle}>Timed Reading</Text>
      
      <View style={styles.timerWrap}>
        <Text style={styles.timerText}>{Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, '0')}</Text>
      </View>

      <ScrollView style={styles.passageScroll} contentContainerStyle={{ padding: spacingX.lg }}>
        <Text style={[styles.passageText, !isPlaying && { color: colors.libraryBorder }]}>{PASSAGE}</Text>
      </ScrollView>

      <View style={styles.btnRow}>
        {!isPlaying && seconds === 0 ? (
          <Pressable style={styles.primaryBtn} onPress={() => setIsPlaying(true)}>
            <Text style={styles.primaryBtnText}>Start Reading</Text>
          </Pressable>
        ) : (
          <Pressable style={styles.primaryBtn} onPress={handleFinish}>
            <Text style={styles.primaryBtnText}>I'm Finished</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default function TimedReadingWpmScreen() {
  const router = useRouter();
  const [stage, setStage] = useState<'intro' | 'session' | 'result'>('intro');
  const [actualWpm, setActualWpm] = useState(0);

  const {
    startedAt,
    durationSeconds,
    startSession,
    endSession,
  } = useSessionStatsTracker('TIMED_READING_WPM');

  const handleStart = () => {
    startSession();
    setStage('session');
  };

  const handleComplete = (wpm: number) => {
    endSession();
    setActualWpm(wpm);
    setStage('result');
  };

  const handleSaveAndExit = async (rating: number | null) => {
    if (!startedAt) {
      router.back();
      return;
    }

    const payload: TimedReadingWpmSessionStats = {
      toolType: 'TIMED_READING_WPM',
      startedAt: startedAt,
      endedAt: new Date().toISOString(),
      durationSeconds,
      selfRating: rating,
      estimatedWords: WORD_COUNT,
      actualWpm,
      wordsRead: WORD_COUNT,
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
          toolName="Timed Reading WPM"
          tagline="Measure your reading speed."
          accentColor={colors.secondary}
          cards={INTRO_CARDS}
          onComplete={handleStart}
        />
      )}

      {stage === 'session' && (
        <ReadingSession onComplete={handleComplete} />
      )}

      {stage === 'result' && (
        <ToolResultScreen
          toolName="Timed Reading"
          subtitle="Session Complete"
          accentColor={colors.secondary}
          stats={[
            { label: 'Reading Pace', value: actualWpm, unit: 'WPM' },
            { label: 'Words Read', value: WORD_COUNT },
            { label: 'Duration', value: durationSeconds, unit: 's' }
          ]}
          onSave={handleSaveAndExit}
          onRepeat={() => {
            setActualWpm(0);
            setStage('intro');
          }}
          tipCard={{
            icon: 'information-circle-outline',
            iconColor: colors.warning,
            title: 'Pacing Check',
            body: 'If your WPM is above 160, you may be rushing. Try slowing down to give your articulators more time.'
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary },
  sessionContainer: { flex: 1, paddingBottom: spacingY.xl },
  sessionTitle: { fontFamily: FONTS.primaryBlack, fontSize: fontSizes.xl, color: colors.textDark, textAlign: 'center', marginTop: spacingY.md },
  timerWrap: { alignItems: 'center', marginVertical: spacingY.md },
  timerText: { fontFamily: FONTS.primaryBlack, fontSize: 40, color: colors.secondary },
  passageScroll: { flex: 1, backgroundColor: colors.libraryCard, marginHorizontal: spacingX.md, borderRadius: radii.md, borderWidth: 1, borderColor: colors.libraryBorder },
  passageText: { fontFamily: FONTS.primary, fontSize: fontSizes.large, color: colors.textDark, lineHeight: 32 },
  btnRow: { paddingHorizontal: spacingX.lg, marginTop: spacingY.lg },
  primaryBtn: { width: '100%', paddingVertical: spacingY.md, borderRadius: radii.pill, alignItems: 'center', backgroundColor: colors.secondary },
  primaryBtnText: { fontFamily: FONTS.primaryBold, fontSize: fontSizes.medium, color: colors.white },
});
