import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../theme/Theme';
import { ToolIntroScreen } from '../../components/tools/ToolIntroScreen';
import { ToolResultScreen } from '../../components/tools/ToolResultScreen';
import { GentleOnsetSession } from '../../components/tools/GentleOnsetSession';
import { useSessionStatsTracker } from '../../hooks/useSessionStatsTracker';
import { saveSessionToBackend, GentleOnsetSessionStats } from '../../utils/toolSessionApi';

const INTRO_CARDS = [
  {
    icon: 'mic-outline',
    iconColor: colors.secondary,
    title: 'Zero Pressure',
    body: 'This drill trains you to start words smoothly. Air flows first, voice follows.',
    highlight: 'The hardest moment is the first sound.',
    step: 1,
  },
  {
    icon: 'pulse-outline',
    iconColor: colors.secondary,
    title: 'Visual Feedback',
    body: 'Focus on a gentle start. The waveform will show you if you pushed too hard or stayed relaxed.',
    step: 2,
  },
];

export default function GentleOnsetScreen() {
  const router = useRouter();
  const [stage, setStage] = useState<'intro' | 'session' | 'result'>('intro');
  const [sessionResults, setSessionResults] = useState<{ softCount: number; hardCount: number; attempts: number } | null>(null);

  const {
    startedAt,
    durationSeconds,
    startSession,
    endSession,
  } = useSessionStatsTracker('GENTLE_ONSET');

  const handleBegin = () => {
    startSession();
    setStage('session');
  };

  const handleSessionComplete = (results: { softCount: number; hardCount: number; attempts: number }) => {
    endSession();
    setSessionResults(results);
    setStage('result');
  };

  const handleSaveAndExit = async (rating: number | null) => {
    if (!startedAt || !sessionResults) {
      router.back();
      return;
    }

    const { softCount, hardCount, attempts } = sessionResults;
    const successRate = attempts > 0 ? (softCount / attempts) * 100 : 0;

    const payload: GentleOnsetSessionStats = {
      toolType: 'GENTLE_ONSET',
      startedAt: startedAt,
      endedAt: new Date().toISOString(),
      durationSeconds: durationSeconds,
      selfRating: rating,
      estimatedWords: attempts,
      softOnsetCount: softCount,
      hardOnsetCount: hardCount,
      successRate: Math.round(successRate),
      wordsAttempted: attempts,
      averageScore: Math.round(successRate), // Mock score based on success rate
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
          toolName="Gentle Onset Practice"
          tagline="Ease into vowels and words."
          accentColor={colors.secondary}
          cards={INTRO_CARDS}
          onComplete={handleBegin}
        />
      )}

      {stage === 'session' && (
        <GentleOnsetSession onComplete={handleSessionComplete} />
      )}

      {stage === 'result' && sessionResults && (
        <ToolResultScreen
          toolName="Gentle Onset"
          subtitle="Session Complete"
          accentColor={colors.secondary}
          stats={[
            { label: 'Words Attempted', value: sessionResults.attempts },
            { label: 'Soft Onsets', value: sessionResults.softCount },
            { 
              label: 'Success Rate', 
              value: sessionResults.attempts > 0 ? Math.round((sessionResults.softCount / sessionResults.attempts) * 100) : 0, 
              unit: '%' 
            },
            { label: 'Duration', value: durationSeconds, unit: 's' },
          ]}
          onSave={handleSaveAndExit}
          onRepeat={() => {
            setSessionResults(null);
            setStage('intro');
          }}
          tipCard={{
            icon: 'bulb-outline',
            iconColor: colors.warning,
            title: 'Daily Practice',
            body: 'Great job! The more you practice gentle starts, the more natural they will feel in conversation.'
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary },
});
