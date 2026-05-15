import React, { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Exercise } from '../../../data/chapter1Data';
import { colors, FONTS, fontSizes, spacingX, spacingY, radii } from '../../../theme/Theme';
import { HoldToContinue } from '../HoldToContinue';

interface SelfAwarenessStepProps {
  exercise: Exercise;
  onContinue: () => void;
}

const TAB_LABELS = ['Core Behaviors', 'Physical Tension', 'Emotions'];

const SelfAwarenessStep: React.FC<SelfAwarenessStepProps> = ({ exercise, onContinue }) => {
  const content = exercise.content;
  const observations = content.what_to_observe as
    | Array<{ category: string; items: string[] }>
    | undefined;

  const [activeTab, setActiveTab] = useState(0);
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [isRecording, setIsRecording] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [recordTime, setRecordTime] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const micScale = useSharedValue(1);

  useEffect(() => {
    if (isRecording) {
      micScale.value = withRepeat(
        withSequence(
          withTiming(1.06, { duration: 700 }),
          withTiming(1.0, { duration: 700 }),
        ),
        -1, true,
      );
      intervalRef.current = setInterval(() => setRecordTime(p => p + 1), 1000);
    } else {
      micScale.value = withTiming(1, { duration: 200 });
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRecording, micScale]);

  const micStyle = useAnimatedStyle(() => ({
    transform: [{ scale: micScale.value }],
  }));

  const toggleFlag = (key: string) => {
    setFlagged(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleMicPress = () => {
    if (isRecording) {
      setIsRecording(false);
      setSessions(prev => prev + 1);
      setRecordTime(0);
    } else {
      setIsRecording(true);
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const currentItems = observations?.[activeTab]?.items || [];

  return (
    <View style={styles.page}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>What to Observe</Text>
          <View style={styles.tabRow}>
            {TAB_LABELS.map((label, i) => (
              <Pressable
                key={label}
                onPress={() => setActiveTab(i)}
                style={[styles.tab, i === activeTab && styles.tabActive]}
              >
                <Text style={[styles.tabText, i === activeTab && styles.tabTextActive]}>
                  {label}
                </Text>
              </Pressable>
            ))}
          </View>
          <View style={styles.chipsWrap}>
            {currentItems.map((item, i) => {
              const key = `${activeTab}-${i}`;
              const isFlagged = !!flagged[key];
              return (
                <Pressable
                  key={key}
                  onPress={() => toggleFlag(key)}
                  style={[styles.observeChip, isFlagged && styles.observeChipFlagged]}
                >
                  <Text style={styles.observeChipText}>{item}</Text>
                  {isFlagged && (
                    <Ionicons name="checkmark-circle" size={14} color={colors.secondary} />
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        {!!content.why_awareness && (
          <View style={styles.quoteCard}>
            <Text style={styles.quoteText}>{String(content.why_awareness)}</Text>
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Recording Practice</Text>
          <View style={styles.recorderArea}>
            <Animated.View style={micStyle}>
              <Pressable onPress={handleMicPress} style={styles.micButton}>
                <Ionicons name={isRecording ? 'stop' : 'mic'} size={28} color={colors.white} />
              </Pressable>
            </Animated.View>

            {isRecording && (
              <View style={styles.recordingInfo}>
                <View style={styles.redDot} />
                <Text style={styles.timerText}>{formatTime(recordTime)}</Text>
              </View>
            )}

            {!isRecording && sessions > 0 && (
              <View style={styles.doneBadge}>
                <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                <Text style={styles.doneText}>Recorded</Text>
              </View>
            )}
          </View>

          <Text style={styles.sessionCounter}>
            Session {Math.min(sessions + 1, 3)} of 3
          </Text>
          <View style={styles.sessionDots}>
            {[0, 1, 2].map(i => (
              <View key={i} style={[styles.sessionDot, i < sessions && styles.sessionDotDone]} />
            ))}
          </View>
        </View>

        <HoldToContinue onComplete={onContinue} accent={colors.categorySelfAwareness} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  page: { flex: 1 },
  container: { flex: 1 },
  scroll: { paddingTop: spacingY.xl, paddingHorizontal: spacingX.lg, paddingBottom: 100 },
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: spacingX.md,
    marginBottom: spacingY.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.textDark,
    marginBottom: spacingY.sm,
  },
  tabRow: { flexDirection: 'row', gap: 8, marginBottom: spacingY.sm },
  tab: {
    paddingHorizontal: spacingX.sm,
    paddingVertical: spacingY.xxs,
    borderRadius: radii.pill,
    backgroundColor: colors.primary10,
  },
  tabActive: { backgroundColor: colors.categorySelfAwareness },
  tabText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.tiny,
    color: colors.textMuted,
  },
  tabTextActive: { color: colors.white },
  chipsWrap: { gap: 8 },
  observeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: spacingX.sm,
    paddingVertical: spacingY.xs,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.primary10,
    backgroundColor: colors.primary_10,
  },
  observeChipFlagged: {
    backgroundColor: colors.secondary_10 + '33',
    borderColor: colors.secondary,
  },
  observeChipText: {
    flex: 1,
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.textDark,
  },
  quoteCard: {
    borderLeftWidth: 3,
    borderLeftColor: colors.categorySelfAwareness,
    backgroundColor: colors.white,
    borderRadius: radii.md,
    padding: spacingX.md,
    marginBottom: spacingY.md,
  },
  quoteText: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.medium,
    color: colors.textDark,
    fontStyle: 'italic',
    lineHeight: 24,
  },
  recorderArea: {
    alignItems: 'center',
    gap: spacingY.sm,
    paddingVertical: spacingY.md,
  },
  micButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingInfo: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  redDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
  },
  timerText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.textDark,
  },
  doneBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.successBg,
    paddingHorizontal: spacingX.sm,
    paddingVertical: spacingY.xxs,
    borderRadius: radii.pill,
  },
  doneText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    color: colors.success,
  },
  sessionCounter: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacingY.xs,
  },
  sessionDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: spacingY.xs,
  },
  sessionDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary10,
  },
  sessionDotDone: { backgroundColor: colors.success },
  bottomBar: {
    paddingHorizontal: spacingX.lg,
    paddingTop: spacingY.sm,
    paddingBottom: spacingY.lg,
  },
  continueBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.secondary,
    height: 48,
    borderRadius: radii.xl,
  },
  continueBtnText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.white,
  },
});

export default SelfAwarenessStep;
