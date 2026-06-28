import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/src/theme/Theme';
import { ToolIntroScreen } from '@/src/components/tools/ToolIntroScreen';
import { ToolResultScreen } from '@/src/components/tools/ToolResultScreen';
import { ProlongedSpeechSession } from '@/src/components/tools/ProlongedSpeechSession';
import { ProlongedSpeechSettings } from '@/src/components/tools/ProlongedSpeechSettings';
import { useSessionStatsTracker } from '@/src/hooks/useSessionStatsTracker';
import { saveSessionToBackend, ProlongedSpeechSessionStats } from '@/src/utils/toolSessionApi';

const INTRO_CARDS = [
  {
    icon: 'time-outline',
    iconColor: colors.secondary,
    title: 'Stretch Sounds',
    body: 'Give your brain more time by stretching vowels. It breaks rushed speech patterns.',
    step: 1,
  },
  {
    icon: 'speedometer-outline',
    iconColor: colors.secondary,
    title: 'Match the Pace',
    body: 'Follow the pacing dot word-by-word. Tap each word as you say it. Do not speak faster than the dot.',
    highlight: 'Stay smooth and connected.',
    step: 2,
  },
];

export default function ProlongedSpeechScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [stage, setStage] = useState<'intro' | 'settings' | 'session' | 'result'>('intro');
  const [targetWpm, setTargetWpm] = useState(60);
  
  const [sessionResults, setSessionResults] = useState<{ 
    overSpeedCount: number; 
    completionPercentage: number; 
    estimatedWpm: number 
  } | null>(null);

  const {
    startedAt,
    durationSeconds,
    startSession,
    endSession,
  } = useSessionStatsTracker('PROLONGED_SPEECH');

  const handleStartSession = (wpm: number) => {
    setTargetWpm(wpm);
    startSession();
    setStage('session');
  };

  const handleSessionComplete = (results: { overSpeedCount: number; completionPercentage: number; estimatedWpm: number }) => {
    endSession();
    setSessionResults(results);
    setStage('result');
  };

  const handleSaveAndExit = async (rating: number | null) => {
    if (!startedAt || !sessionResults) {
      router.back();
      return;
    }

    const payload: ProlongedSpeechSessionStats = {
      toolType: 'PROLONGED_SPEECH',
      startedAt: startedAt,
      endedAt: new Date().toISOString(),
      durationSeconds: durationSeconds,
      selfRating: rating,
      estimatedWords: Math.round(sessionResults.estimatedWpm * (durationSeconds / 60)),
      targetWpm: targetWpm,
      estimatedWpm: sessionResults.estimatedWpm,
      completionPercentage: sessionResults.completionPercentage,
      overSpeedCount: sessionResults.overSpeedCount,
    };

    try {
      await saveSessionToBackend(payload);
    } catch (e) {
      console.log('Saved offline');
    }
    
    router.back();
  };

  return (
    <View style={[styles.container, stage === 'settings' ? { paddingTop: insets.top } : {}]}>
      {stage === 'intro' && (
        <ToolIntroScreen
          toolName="Prolonged Speech"
          tagline="Stretch sounds for control."
          accentColor={colors.secondary}
          cards={INTRO_CARDS}
          onComplete={() => setStage('settings')}
        />
      )}

      {stage === 'settings' && (
        <ProlongedSpeechSettings 
          onBack={() => setStage('intro')}
          onBegin={handleStartSession} 
        />
      )}

      {stage === 'session' && (
        <View style={[styles.sessionContainer, { paddingTop: insets.top }]}>
          <ProlongedSpeechSession 
            targetWpm={targetWpm} 
            onComplete={handleSessionComplete} 
            onCancel={() => { endSession(); router.back(); }}
          />
        </View>
      )}

      {stage === 'result' && sessionResults && (
        <ToolResultScreen
          toolName="Prolonged Speech"
          subtitle="Session Complete"
          accentColor={colors.secondary}
          stats={[
            { label: 'Target WPM', value: targetWpm },
            { label: 'Actual WPM', value: sessionResults.estimatedWpm },
            { label: 'Rushed Words', value: sessionResults.overSpeedCount },
            { label: 'Duration', value: durationSeconds, unit: 's' }
          ]}
          onSave={handleSaveAndExit}
          onRepeat={() => {
            setSessionResults(null);
            setStage('intro');
          }}
          tipCard={{
            icon: 'time-outline',
            iconColor: colors.warning,
            title: 'Control Technique',
            body: 'Stretching vowels is a core technique to regain control during a stuttering block.'
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary },
  sessionContainer: { flex: 1 },
});
