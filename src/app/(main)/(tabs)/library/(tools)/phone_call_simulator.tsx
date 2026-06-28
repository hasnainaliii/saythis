import React, { useState } from 'react';
import { View, StyleSheet, Text, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, FONTS, fontSizes, spacingX, spacingY, radii } from '@/src/theme/Theme';
import { ToolIntroScreen } from '@/src/components/tools/ToolIntroScreen';
import { ToolResultScreen } from '@/src/components/tools/ToolResultScreen';
import { useSessionStatsTracker } from '@/src/hooks/useSessionStatsTracker';
import { saveSessionToBackend, PhoneCallSimulatorSessionStats } from '@/src/utils/toolSessionApi';

const CALL_SCRIPT = [
  { speaker: 'Receptionist', text: 'Dr. Smith’s office, how can I help you?' },
  { speaker: 'You', text: 'Hi, I need to schedule an appointment with Dr. Smith, please.' },
  { speaker: 'Receptionist', text: 'Okay. Have you been seen by him before?' },
  { speaker: 'You', text: 'Yes, I am an existing patient.' },
  { speaker: 'Receptionist', text: 'Great. Let me check the schedule. We have an opening next Tuesday at 2 PM. Does that work?' },
  { speaker: 'You', text: 'Yes, next Tuesday at 2 PM works perfectly for me.' },
  { speaker: 'Receptionist', text: 'Alright, you’re all set. We’ll see you then!' },
];

const INTRO_CARDS = [
  {
    icon: 'call-outline',
    iconColor: colors.secondary,
    title: 'Phone Call Anxiety',
    body: 'Phone calls lack visual cues, which can increase tension. Practicing scripts helps reduce that anxiety.',
    step: 1,
  },
  {
    icon: 'volume-high-outline',
    iconColor: colors.secondary,
    title: 'Take Your Time',
    body: 'Read the lines aloud. Remember that silences on the phone are okay. Do not rush to fill the void.',
    step: 2,
  },
];

const CallSession = ({ onComplete }: { onComplete: () => void }) => {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.sessionContainer, { paddingTop: insets.top }]}>
      <Text style={styles.sessionTitle}>Doctor's Office Call</Text>
      
      <ScrollView style={styles.chatScroll} contentContainerStyle={{ padding: spacingX.lg }}>
        {CALL_SCRIPT.map((line, i) => {
          const isYou = line.speaker === 'You';
          return (
            <View key={i} style={[styles.chatBubbleWrap, isYou ? styles.chatBubbleRight : styles.chatBubbleLeft]}>
              <Text style={styles.speakerLabel}>{line.speaker}</Text>
              <View style={[styles.chatBubble, isYou ? styles.bubbleYou : styles.bubbleThem]}>
                <Text style={[styles.chatText, isYou ? styles.textYou : styles.textThem]}>{line.text}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.btnRow}>
        <Pressable style={styles.primaryBtn} onPress={onComplete}>
          <Text style={styles.primaryBtnText}>End Call</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default function PhoneCallSimulatorScreen() {
  const router = useRouter();
  const [stage, setStage] = useState<'intro' | 'session' | 'result'>('intro');

  const {
    startedAt,
    durationSeconds,
    startSession,
    endSession,
  } = useSessionStatsTracker('PHONE_CALL_SIMULATOR');

  const handleStart = () => {
    startSession();
    setStage('session');
  };

  const handleComplete = () => {
    endSession();
    setStage('result');
  };

  const handleSaveAndExit = async (rating: number | null) => {
    if (!startedAt) {
      router.back();
      return;
    }

    const payload: PhoneCallSimulatorSessionStats = {
      toolType: 'PHONE_CALL_SIMULATOR',
      startedAt: startedAt,
      endedAt: new Date().toISOString(),
      durationSeconds,
      selfRating: rating,
      estimatedWords: 50,
      scenario: 'Doctor Appointment',
      completed: true,
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
          toolName="Phone Call Simulator"
          tagline="Rehearse calls without pressure."
          accentColor={colors.secondary}
          cards={INTRO_CARDS}
          onComplete={handleStart}
        />
      )}

      {stage === 'session' && (
        <CallSession onComplete={handleComplete} />
      )}

      {stage === 'result' && (
        <ToolResultScreen
          toolName="Phone Call Simulator"
          subtitle="Simulation Complete"
          accentColor={colors.secondary}
          stats={[
            { label: 'Completed', value: 'Yes' },
            { label: 'Duration', value: durationSeconds, unit: 's' }
          ]}
          onSave={handleSaveAndExit}
          onRepeat={() => setStage('intro')}
          tipCard={{
            icon: 'call-outline',
            iconColor: colors.warning,
            title: 'Own the Silence',
            body: 'A pause on the phone feels like forever to you, but normal to the listener. Let yourself pause.'
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary },
  sessionContainer: { flex: 1, paddingBottom: spacingY.xl },
  sessionTitle: { fontFamily: FONTS.primaryBlack, fontSize: fontSizes.xl, color: colors.textDark, textAlign: 'center', marginTop: spacingY.md, marginBottom: spacingY.sm },
  chatScroll: { flex: 1 },
  chatBubbleWrap: { marginBottom: spacingY.md, maxWidth: '80%' },
  chatBubbleRight: { alignSelf: 'flex-end' },
  chatBubbleLeft: { alignSelf: 'flex-start' },
  speakerLabel: { fontFamily: FONTS.primaryBold, fontSize: fontSizes.tiny, color: colors.textMuted, marginBottom: 4, paddingHorizontal: 8 },
  chatBubble: { paddingHorizontal: spacingX.md, paddingVertical: spacingY.sm, borderRadius: radii.md },
  bubbleYou: { backgroundColor: colors.secondary, borderBottomRightRadius: 4 },
  bubbleThem: { backgroundColor: colors.libraryCard, borderWidth: 1, borderColor: colors.libraryBorder, borderBottomLeftRadius: 4 },
  chatText: { fontFamily: FONTS.primary, fontSize: fontSizes.medium, lineHeight: 22 },
  textYou: { color: colors.white },
  textThem: { color: colors.textDark },
  btnRow: { paddingHorizontal: spacingX.lg, marginTop: spacingY.md },
  primaryBtn: { width: '100%', paddingVertical: spacingY.md, borderRadius: radii.pill, alignItems: 'center', backgroundColor: colors.secondary },
  primaryBtnText: { fontFamily: FONTS.primaryBold, fontSize: fontSizes.medium, color: colors.white },
});
