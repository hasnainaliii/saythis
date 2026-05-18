import React, { useState } from 'react';
import { View, StyleSheet, Text, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, FONTS, fontSizes, spacingX, spacingY, radii } from '../../theme/Theme';
import { ToolIntroScreen } from '../../components/tools/ToolIntroScreen';
import { ToolResultScreen } from '../../components/tools/ToolResultScreen';
import { useSessionStatsTracker } from '../../hooks/useSessionStatsTracker';
import { saveSessionToBackend, VirtualCoffeeOrderSessionStats } from '../../utils/toolSessionApi';

const ORDER_SCRIPT = [
  { speaker: 'Barista', text: 'Hi there! What can I get for you today?' },
  { speaker: 'You', text: 'Hi, I would like a medium iced latte with oat milk, please.' },
  { speaker: 'Barista', text: 'Sure thing. Any flavor in that?' },
  { speaker: 'You', text: 'No, just the latte is fine.' },
  { speaker: 'Barista', text: 'Great. Can I get a name for the order?' },
  { speaker: 'You', text: '[Your Name], please.' },
  { speaker: 'Barista', text: 'Awesome, it will be right out at the end of the bar.' },
];

const INTRO_CARDS = [
  {
    icon: 'cafe-outline',
    iconColor: colors.secondary,
    title: 'Simulate Daily Tasks',
    body: 'Ordering coffee is a common trigger situation. Practice it here without the pressure.',
    step: 1,
  },
  {
    icon: 'volume-high-outline',
    iconColor: colors.secondary,
    title: 'Speak Aloud',
    body: 'Read your lines out loud. Focus on a gentle onset and smooth airflow.',
    step: 2,
  },
];

const SimulationSession = ({ onComplete }: { onComplete: () => void }) => {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.sessionContainer, { paddingTop: insets.top }]}>
      <Text style={styles.sessionTitle}>Coffee Shop</Text>
      
      <ScrollView style={styles.chatScroll} contentContainerStyle={{ padding: spacingX.lg }}>
        {ORDER_SCRIPT.map((line, i) => {
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
          <Text style={styles.primaryBtnText}>Finish Order</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default function VirtualCoffeeOrderScreen() {
  const router = useRouter();
  const [stage, setStage] = useState<'intro' | 'session' | 'result'>('intro');

  const {
    startedAt,
    durationSeconds,
    startSession,
    endSession,
  } = useSessionStatsTracker('VIRTUAL_COFFEE_ORDER');

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

    const payload: VirtualCoffeeOrderSessionStats = {
      toolType: 'VIRTUAL_COFFEE_ORDER',
      startedAt: startedAt,
      endedAt: new Date().toISOString(),
      durationSeconds,
      selfRating: rating,
      estimatedWords: 40,
      orderType: 'Iced Latte',
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
          toolName="Virtual Coffee Order"
          tagline="Practice a short scripted order."
          accentColor={colors.secondary}
          cards={INTRO_CARDS}
          onComplete={handleStart}
        />
      )}

      {stage === 'session' && (
        <SimulationSession onComplete={handleComplete} />
      )}

      {stage === 'result' && (
        <ToolResultScreen
          toolName="Coffee Order"
          subtitle="Simulation Complete"
          accentColor={colors.secondary}
          stats={[
            { label: 'Completed', value: 'Yes' },
            { label: 'Duration', value: durationSeconds, unit: 's' }
          ]}
          onSave={handleSaveAndExit}
          onRepeat={() => setStage('intro')}
          tipCard={{
            icon: 'checkmark-circle-outline',
            iconColor: colors.warning,
            title: 'Repetition is Key',
            body: 'Practicing these scripts builds muscle memory, making the real situation feel familiar and less anxiety-inducing.'
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
