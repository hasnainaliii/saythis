import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { useAudioPlayer } from 'expo-audio';
import { Exercise } from '../../../data/chapter1Data';
import { colors, FONTS, fontSizes, spacingX, spacingY, radii } from '../../../theme/Theme';
import { HoldToContinue } from '../HoldToContinue';
import RecordingChip, { ChipState } from '../chapter2/RecordingChip';
import { SingleOpenAccordion } from '../chapter2/Accordion';
import { useRecording } from '../../../hooks/useRecording';

interface Props {
  exercise: Exercise;
  onContinue: () => void;
}

const BreathSpeechStep: React.FC<Props> = ({ exercise, onContinue }) => {
  const content = exercise.content as any;
  const levels = content.progressive_levels as any[];
  const [activeLevel, setActiveLevel] = useState(0);
  const [chipStates, setChipStates] = useState<Record<string, ChipState>>({});
  const [completedLevels, setCompletedLevels] = useState<Record<number, boolean>>({});
  const [playUri, setPlayUri] = useState<string | null>(null);

  const recording = useRecording();
  const player = useAudioPlayer(playUri);

  const setChip = (key: string, state: ChipState) =>
    setChipStates(p => ({ ...p, [key]: state }));

  const handleChipTap = useCallback(async (key: string) => {
    const current = chipStates[key] ?? 'idle';
    if (current === 'idle' || current === 'done') {
      if (recording.permGranted === false) return;
      const ok = await recording.startRecording(key);
      if (ok) setChip(key, 'recording');
    } else if (current === 'recording') {
      const result = await recording.stopRecording();
      if (result) setChip(key, 'recorded');
    }
  }, [chipStates, recording]);

  const handlePlay = useCallback((key: string) => {
    const uri = recording.getUri(key);
    if (!uri) return;
    setPlayUri(uri);
    setChip(key, 'playing');
    setTimeout(() => {
      player.play();
      setTimeout(() => setChip(key, 'recorded'), 3000);
    }, 200);
  }, [recording, player]);

  const handleGood = (key: string) => {
    setChip(key, 'done');
    checkLevelCompletion();
  };

  const handleRetry = (key: string) => {
    recording.clearRecording(key);
    setChip(key, 'idle');
  };

  const checkLevelCompletion = () => {
    const level = levels[activeLevel];
    const words = getWordsForLevel(level);
    const allDone = words.every((w: string) => chipStates[`${activeLevel}_${w}`] === 'done');
    if (allDone) setCompletedLevels(p => ({ ...p, [activeLevel]: true }));
  };

  useEffect(() => { checkLevelCompletion(); }, [chipStates]);

  const getWordsForLevel = (level: any): string[] => {
    if (level.practice_words) return level.practice_words;
    if (level.practice_phrases) return level.practice_phrases;
    if (level.consonant_groups) {
      return Object.values(level.consonant_groups).flat() as string[];
    }
    return [];
  };

  const currentLevel = levels[activeLevel];
  const words = getWordsForLevel(currentLevel);
  const doneCount = words.filter((w: string) => chipStates[`${activeLevel}_${w}`] === 'done').length;

  return (
    <View style={styles.page}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Permission banner */}
        {recording.permGranted === false && <PermBanner />}

        {/* Concept cards */}
        <ConceptCards problem={content.the_problem} solution={content.the_solution} />

        {/* Basic pattern flow */}
        <PatternFlow steps={content.basic_pattern} activeStep={activeLevel} />

        {/* Level tabs */}
        <View style={styles.tabRow}>
          {levels.map((l: any, i: number) => (
            <Pressable key={i} onPress={() => setActiveLevel(i)}>
              <View style={[styles.tab, i === activeLevel && styles.tabActive]}>
                <Text style={[styles.tabText, i === activeLevel && styles.tabTextActive]}>
                  Level {l.level}
                </Text>
                {completedLevels[i] && <Text style={styles.tabCheck}> ✓</Text>}
              </View>
            </Pressable>
          ))}
        </View>

        {/* Level content */}
        <View style={styles.levelCard}>
          <Text style={styles.levelName}>{currentLevel.name}</Text>
          <Text style={styles.levelDays}>{currentLevel.days}</Text>
          <Text style={styles.counter}>Completed {doneCount} / {words.length}</Text>

          {currentLevel.instructions?.map((inst: string, i: number) => (
            <View key={i} style={styles.instRow}>
              <Text style={styles.instNum}>{i + 1}.</Text>
              <Text style={styles.instText}>{inst}</Text>
            </View>
          ))}

          {/* Word/phrase chips */}
          {currentLevel.consonant_groups ? (
            Object.entries(currentLevel.consonant_groups).map(([group, items]: [string, any]) => (
              <View key={group} style={styles.groupSection}>
                <Text style={styles.groupLabel}>{group}</Text>
                {items.map((w: string) => {
                  const key = `${activeLevel}_${w}`;
                  return (
                    <RecordingChip
                      key={key}
                      label={w}
                      state={chipStates[key] ?? 'idle'}
                      onTap={() => handleChipTap(key)}
                      onPlay={() => handlePlay(key)}
                      onGood={() => handleGood(key)}
                      onRetry={() => handleRetry(key)}
                    />
                  );
                })}
              </View>
            ))
          ) : (
            words.map((w: string) => {
              const key = `${activeLevel}_${w}`;
              return (
                <RecordingChip
                  key={key}
                  label={w}
                  state={chipStates[key] ?? 'idle'}
                  onTap={() => handleChipTap(key)}
                  onPlay={() => handlePlay(key)}
                  onGood={() => handleGood(key)}
                  onRetry={() => handleRetry(key)}
                />
              );
            })
          )}
        </View>

        {/* Common mistakes */}
        {content.common_mistakes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Common Mistakes</Text>
            <SingleOpenAccordion
              items={content.common_mistakes.map((m: any) => ({
                title: m.mistake,
                content: m.correction,
                titleColor: colors.error,
              }))}
            />
          </View>
        )}

        <HoldToContinue onComplete={onContinue} accent={colors.categoryCBT} />
      </ScrollView>
    </View>
  );
};

// --- Sub-components ---

const PermBanner: React.FC = () => (
  <Pressable style={styles.permBanner} onPress={() => Linking.openSettings()}>
    <Ionicons name="warning" size={16} color={colors.white} />
    <Text style={styles.permText}>Microphone access needed · Open Settings</Text>
  </Pressable>
);

const ConceptCards: React.FC<{ problem: string[]; solution: string }> = ({ problem, solution }) => {
  const leftY = useSharedValue(20);
  const rightY = useSharedValue(20);
  const leftOp = useSharedValue(0);
  const rightOp = useSharedValue(0);

  useEffect(() => {
    leftY.value = withSpring(0, { damping: 14 });
    leftOp.value = withTiming(1, { duration: 300 });
    rightY.value = withDelay(150, withSpring(0, { damping: 14 }));
    rightOp.value = withDelay(150, withTiming(1, { duration: 300 }));
  }, []);

  const leftStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: leftY.value }],
    opacity: leftOp.value,
  }));
  const rightStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: rightY.value }],
    opacity: rightOp.value,
  }));

  return (
    <View style={styles.conceptRow}>
      <Animated.View style={[styles.conceptCard, styles.problemCard, leftStyle]}>
        <Text style={styles.conceptLabel}>The Problem</Text>
        {problem.map((p: string, i: number) => (
          <View key={i} style={styles.conceptItem}>
            <Text style={styles.xIcon}>✗</Text>
            <Text style={styles.conceptText}>{p}</Text>
          </View>
        ))}
      </Animated.View>
      <Animated.View style={[styles.conceptCard, styles.solutionCard, rightStyle]}>
        <Text style={styles.conceptLabel}>The Solution</Text>
        <Text style={styles.conceptText}>{solution}</Text>
      </Animated.View>
    </View>
  );
};

const PatternFlow: React.FC<{ steps: any[]; activeStep: number }> = ({ steps, activeStep }) => (
  <View style={styles.patternRow}>
    {steps.map((s: any, i: number) => (
      <React.Fragment key={i}>
        <View style={[styles.patternDot, i <= activeStep && styles.patternDotActive]}>
          <Text style={[styles.patternNum, i <= activeStep && styles.patternNumActive]}>
            {s.step}
          </Text>
        </View>
        {i < steps.length - 1 && <View style={styles.patternLine} />}
      </React.Fragment>
    ))}
  </View>
);

const styles = StyleSheet.create({
  page: { flex: 1 },
  container: { flex: 1 },
  scroll: { paddingHorizontal: spacingX.lg, paddingBottom: 100 },
  section: { marginBottom: spacingY.md },
  sectionTitle: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.textDark,
    marginBottom: spacingY.xs,
  },
  permBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.warning,
    borderRadius: radii.md,
    padding: spacingX.sm,
    marginBottom: spacingY.sm,
  },
  permText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    color: colors.white,
  },
  conceptRow: { gap: 10, marginBottom: spacingY.md },
  conceptCard: {
    borderRadius: radii.md,
    padding: spacingX.sm,
  },
  problemCard: { borderLeftWidth: 3, borderLeftColor: colors.error, backgroundColor: colors.white },
  solutionCard: { borderLeftWidth: 3, borderLeftColor: colors.success, backgroundColor: colors.white },
  conceptLabel: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    color: colors.textDark,
    marginBottom: spacingY.xxs,
  },
  conceptItem: { flexDirection: 'row', gap: 6, marginBottom: 2 },
  xIcon: { color: colors.error, fontFamily: FONTS.primaryBold, fontSize: fontSizes.small },
  conceptText: {
    flex: 1,
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.textDark,
    lineHeight: 20,
  },
  patternRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacingY.md,
    gap: 0,
  },
  patternDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  patternDotActive: { backgroundColor: colors.secondary },
  patternNum: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    color: colors.textMuted,
  },
  patternNumActive: { color: colors.white },
  patternLine: {
    width: 20,
    height: 2,
    backgroundColor: colors.border,
  },
  tabRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: spacingY.sm,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radii.pill,
    backgroundColor: colors.primary10,
  },
  tabActive: { backgroundColor: colors.secondary },
  tabText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.tiny,
    color: colors.textMuted,
  },
  tabTextActive: { color: colors.white },
  tabCheck: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.tiny,
    color: colors.success,
  },
  levelCard: {
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
  levelName: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.textDark,
    marginBottom: 2,
  },
  levelDays: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.textMuted,
    marginBottom: spacingY.xs,
  },
  counter: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    color: colors.categoryCBT,
    marginBottom: spacingY.sm,
  },
  instRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 4,
  },
  instNum: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    color: colors.secondary,
  },
  instText: {
    flex: 1,
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.textMuted,
    lineHeight: 20,
  },
  groupSection: { marginTop: spacingY.sm },
  groupLabel: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    color: colors.categoryCBT,
    textTransform: 'capitalize',
    marginBottom: spacingY.xxs,
  },
});

export default BreathSpeechStep;
