import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useAudioPlayer } from 'expo-audio';
import { Exercise } from '../../../data/chapter1Data';
import { colors, FONTS, fontSizes, spacingX, spacingY, radii } from '../../../theme/Theme';
import { HoldToContinue } from '../HoldToContinue';
import RecordingChip, { ChipState } from '../chapter2/RecordingChip';
import { useRecording } from '../../../hooks/useRecording';

interface Props {
  exercise: Exercise;
  onContinue: () => void;
}

const RateControlStep: React.FC<Props> = ({ exercise, onContinue }) => {
  const content = exercise.content as any;
  const [activePhase, setActivePhase] = useState(0);
  const phases = content.progressive_plan as any[];

  return (
    <View style={styles.page}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Section A — Why Pausing Helps */}
        <InfoCard text={content.why_pausing_helps} chips={content.where_to_pause} />

        {/* Section B — Pausing Patterns */}
        <Text style={styles.sectionTitle}>Pausing Patterns</Text>
        {content.pausing_patterns?.map((p: any, i: number) => (
          <PausingPatternCard key={i} pattern={p} />
        ))}

        {/* Section C — Phase tabs */}
        <View style={styles.tabRow}>
          {phases.map((_: any, i: number) => (
            <Pressable key={i} onPress={() => setActivePhase(i)}>
              <View style={[styles.tab, i === activePhase && styles.tabActive]}>
                <Text style={[styles.tabText, i === activePhase && styles.tabTextActive]}>
                  Phase {i + 1}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>

        {activePhase === 0 && <Phase1Card phase={phases[0]} />}
        {activePhase === 1 && <Phase2Card phase={phases[1]} />}
        {activePhase === 2 && <Phase3Card phase={phases[2]} />}

        {/* Section D — Integration */}
        <IntegrationFlow data={content.pausing_plus_breathing} />

        <HoldToContinue onComplete={onContinue} accent={colors.categorySelfAdvocacy} />
      </ScrollView>
    </View>
  );
};

// --- Sub-components ---

const InfoCard: React.FC<{ text: string; chips: string[] }> = ({ text, chips }) => (
  <View style={styles.infoCard}>
    <Text style={styles.quoteIcon}>❝</Text>
    <Text style={styles.infoText}>{text}</Text>
    <View style={styles.chipRow}>
      {chips.map((c: string, i: number) => (
        <View key={i} style={styles.infoChip}>
          <Text style={styles.infoChipText}>{c}</Text>
        </View>
      ))}
    </View>
  </View>
);

const PausingPatternCard: React.FC<{ pattern: any }> = ({ pattern }) => {
  const [playing, setPlaying] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(-1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // parse example by splitting on /
  const segments = pattern.example.split(/\s*\/\s*/);

  const playExample = () => {
    if (playing) return;
    setPlaying(true);
    let idx = 0;
    const advance = () => {
      if (idx >= segments.length) {
        setHighlightIdx(-1);
        setPlaying(false);
        return;
      }
      setHighlightIdx(idx);
      const words = segments[idx].replace('[pause]', '').trim().split(/\s+/).length;
      const duration = Math.max(words * 500, 600);
      idx++;
      timerRef.current = setTimeout(advance, duration);
    };
    advance();
  };

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  return (
    <View style={styles.patternCard}>
      <Text style={styles.patternName}>{pattern.name}</Text>
      <Text style={styles.patternDesc}>{pattern.description}</Text>
      <View style={styles.annotatedRow}>
        {segments.map((seg: string, i: number) => (
          <React.Fragment key={i}>
            <Text style={[
              styles.segmentText,
              highlightIdx === i && styles.segmentHighlight,
            ]}>
              {seg.replace('[pause]', '').trim()}
            </Text>
            {i < segments.length - 1 && (
              <View style={[styles.pausePip, highlightIdx === i && styles.pausePipActive]}>
                <Text style={styles.pausePipText}>⏸</Text>
              </View>
            )}
          </React.Fragment>
        ))}
      </View>
      <Pressable style={styles.hearBtn} onPress={playExample}>
        <Text style={styles.hearBtnText}>▶ Hear Example</Text>
      </Pressable>
    </View>
  );
};

const Phase1Card: React.FC<{ phase: any }> = ({ phase }) => {
  const [reading, setReading] = useState(false);
  const [wordIdx, setWordIdx] = useState(-1);
  const [breathe, setBreathe] = useState(false);
  const [done, setDone] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const segments = (phase.example as string).split(/\s*\/\s*/);
  const allWords = segments.flatMap((seg: string, si: number) => {
    const words = seg.trim().split(/\s+/).map(w => ({ text: w, pause: false }));
    if (si < segments.length - 1) words.push({ text: '/', pause: true });
    return words;
  });

  const startReading = () => {
    setReading(true);
    setDone(false);
    let idx = 0;
    const advance = () => {
      if (idx >= allWords.length) {
        setWordIdx(-1);
        setReading(false);
        setDone(true);
        return;
      }
      const word = allWords[idx];
      if (word.pause) {
        setBreathe(true);
        setWordIdx(-1);
        idx++;
        timerRef.current = setTimeout(() => {
          setBreathe(false);
          advance();
        }, 1500);
      } else {
        setWordIdx(idx);
        idx++;
        timerRef.current = setTimeout(advance, 600);
      }
    };
    advance();
  };

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  return (
    <View style={styles.phaseCard}>
      <Text style={styles.phaseName}>{phase.name}</Text>
      <View style={styles.readingCard}>
        <View style={styles.wordFlow}>
          {allWords.map((w, i) => {
            if (w.pause) return (
              <View key={i} style={styles.pausePip}>
                <Text style={styles.pausePipText}>⏸</Text>
              </View>
            );
            return (
              <Text key={i} style={[
                styles.readWord,
                wordIdx === i && styles.readWordActive,
              ]}>
                {w.text}{' '}
              </Text>
            );
          })}
        </View>
        {breathe && <Text style={styles.breathePrompt}>Breathe 🌬</Text>}
      </View>
      {!reading && !done && (
        <Pressable style={styles.practiceBtn} onPress={startReading}>
          <Text style={styles.practiceBtnText}>▶ Practice Reading</Text>
        </Pressable>
      )}
      {done && (
        <View style={styles.doneBadge}>
          <Ionicons name="checkmark-circle" size={18} color={colors.success} />
          <Text style={styles.doneText}>Reading Done</Text>
        </View>
      )}
      {phase.instructions?.map((inst: string, i: number) => (
        <Text key={i} style={styles.phaseInst}>• {inst}</Text>
      ))}
    </View>
  );
};

const Phase2Card: React.FC<{ phase: any }> = ({ phase }) => {
  const [progressIdx, setProgressIdx] = useState(0);
  const markers = phase.pause_progression as any[];
  const dotX = useSharedValue(0);

  const advance = () => {
    if (progressIdx < markers.length - 1) {
      const next = progressIdx + 1;
      setProgressIdx(next);
      dotX.value = withSpring(next * 100, { damping: 14 });
    }
  };

  const dotStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: dotX.value }],
  }));

  return (
    <View style={styles.phaseCard}>
      <Text style={styles.phaseName}>{phase.name}</Text>
      <View style={styles.sliderRow}>
        <View style={styles.sliderTrack} />
        <Animated.View style={[styles.sliderDot, dotStyle]} />
        {markers.map((m: any, i: number) => (
          <View key={i} style={[styles.sliderMarker, { left: i * 100 }]}>
            <Text style={styles.markerLabel}>{m.label}</Text>
            <Text style={styles.markerDur}>{m.duration}</Text>
          </View>
        ))}
      </View>
      <Pressable style={styles.markBtn} onPress={advance}>
        <Text style={styles.markBtnText}>Mark Progress</Text>
      </Pressable>
      {phase.instructions?.map((inst: string, i: number) => (
        <Text key={i} style={styles.phaseInst}>• {inst}</Text>
      ))}
    </View>
  );
};

const Phase3Card: React.FC<{ phase: any }> = ({ phase }) => {
  const topics = phase.conversation_topics as string[];
  const [chipStates, setChipStates] = useState<Record<string, ChipState>>({});
  const recording = useRecording();
  const [playUri, setPlayUri] = useState<string | null>(null);
  const player = useAudioPlayer(playUri);

  const doneCount = topics.filter((_, i) => chipStates[`topic_${i}`] === 'done').length;

  const handleTap = async (key: string) => {
    const cur = chipStates[key] ?? 'idle';
    if (cur === 'idle') {
      const ok = await recording.startRecording(key);
      if (ok) setChipStates(p => ({ ...p, [key]: 'recording' }));
    } else if (cur === 'recording') {
      const r = await recording.stopRecording();
      if (r) setChipStates(p => ({ ...p, [key]: 'recorded' }));
    }
  };

  return (
    <View style={styles.phaseCard}>
      <Text style={styles.phaseName}>{phase.name}</Text>
      <Text style={styles.counter}>Topics practiced: {doneCount} / {topics.length}</Text>
      {topics.map((t: string, i: number) => {
        const key = `topic_${i}`;
        return (
          <RecordingChip
            key={key}
            label={t}
            state={chipStates[key] ?? 'idle'}
            onTap={() => handleTap(key)}
            onPlay={() => {
              const uri = recording.getUri(key);
              if (uri) { setPlayUri(uri); player.play(); }
              setChipStates(p => ({ ...p, [key]: 'recorded' }));
            }}
            onGood={() => setChipStates(p => ({ ...p, [key]: 'done' }))}
            onRetry={() => {
              recording.clearRecording(key);
              setChipStates(p => ({ ...p, [key]: 'idle' }));
            }}
          />
        );
      })}
      {phase.instructions?.map((inst: string, i: number) => (
        <Text key={i} style={styles.phaseInst}>• {inst}</Text>
      ))}
    </View>
  );
};

const IntegrationFlow: React.FC<{ data: any }> = ({ data }) => {
  if (!data) return null;
  const steps = data.full_sequence as string[];

  return (
    <View style={styles.integrationCard}>
      <Text style={styles.sectionTitle}>Full Integration</Text>
      {steps.map((s: string, i: number) => (
        <IntegrationStep key={i} text={s} index={i} isLast={i === steps.length - 1} />
      ))}
      <View style={styles.integrationNote}>
        <Text style={styles.integrationNoteText}>{data.integration}</Text>
      </View>
    </View>
  );
};

const IntegrationStep: React.FC<{ text: string; index: number; isLast: boolean }> = ({ text, index, isLast }) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(10);

  useEffect(() => {
    opacity.value = withDelay(index * 100, withSpring(1));
    translateY.value = withDelay(index * 100, withSpring(0, { damping: 14 }));
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.timelineRow, style]}>
      <View style={styles.timelineLeft}>
        <View style={styles.timelineCircle}>
          <Text style={styles.timelineNum}>{index + 1}</Text>
        </View>
        {!isLast && <View style={styles.timelineLine} />}
      </View>
      <Text style={styles.timelineText}>{text}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  page: { flex: 1 },
  container: { flex: 1 },
  scroll: { paddingHorizontal: spacingX.lg, paddingBottom: 100 },
  sectionTitle: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.textDark,
    marginBottom: spacingY.xs,
  },
  infoCard: {
    backgroundColor: colors.primary10,
    borderRadius: radii.lg,
    padding: spacingX.md,
    marginBottom: spacingY.md,
  },
  quoteIcon: {
    fontSize: 24,
    color: colors.secondary,
    marginBottom: 4,
  },
  infoText: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.medium,
    color: colors.textDark,
    fontStyle: 'italic',
    lineHeight: 22,
    marginBottom: spacingY.xs,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  infoChip: {
    backgroundColor: colors.primary10,
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoChipText: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.textDark,
  },
  patternCard: {
    backgroundColor: colors.white,
    borderRadius: radii.md,
    padding: spacingX.md,
    marginBottom: spacingY.sm,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  patternName: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.textDark,
    marginBottom: 2,
  },
  patternDesc: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.textMuted,
    marginBottom: spacingY.xs,
  },
  annotatedRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 4,
    marginBottom: spacingY.xs,
  },
  segmentText: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.textDark,
  },
  segmentHighlight: {
    backgroundColor: colors.secondary_10,
    borderRadius: 4,
    overflow: 'hidden',
  },
  pausePip: {
    backgroundColor: colors.secondary_10,
    borderRadius: radii.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  pausePipActive: { backgroundColor: colors.secondary },
  pausePipText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.tiny,
    color: colors.secondary,
  },
  hearBtn: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
  },
  hearBtnText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    color: colors.secondary,
  },
  tabRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: spacingY.sm,
  },
  tab: {
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
  phaseCard: {
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
  phaseName: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.textDark,
    marginBottom: spacingY.xs,
  },
  counter: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    color: colors.categorySelfAdvocacy,
    marginBottom: spacingY.sm,
  },
  phaseInst: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.textMuted,
    lineHeight: 20,
    marginTop: 2,
  },
  readingCard: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: spacingX.sm,
    marginBottom: spacingY.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  wordFlow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  readWord: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.medium,
    color: colors.textDark,
  },
  readWordActive: {
    backgroundColor: colors.secondary_10,
    borderRadius: 4,
  },
  breathePrompt: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.large,
    color: colors.secondary,
    textAlign: 'center',
    marginTop: spacingY.sm,
  },
  practiceBtn: {
    backgroundColor: colors.secondary,
    borderRadius: radii.xl,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: spacingY.xs,
  },
  practiceBtnText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.white,
  },
  doneBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: spacingY.xs,
  },
  doneText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    color: colors.success,
  },
  sliderRow: {
    height: 60,
    marginBottom: spacingY.md,
    marginTop: spacingY.sm,
    position: 'relative',
  },
  sliderTrack: {
    position: 'absolute',
    top: 8,
    left: 12,
    right: 12,
    height: 3,
    backgroundColor: colors.border,
    borderRadius: 1.5,
  },
  sliderDot: {
    position: 'absolute',
    top: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.secondary,
  },
  sliderMarker: {
    position: 'absolute',
    top: 24,
    alignItems: 'center',
    width: 80,
  },
  markerLabel: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.tiny,
    color: colors.textDark,
  },
  markerDur: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.tiny,
    color: colors.textMuted,
  },
  markBtn: {
    alignSelf: 'center',
    backgroundColor: colors.secondary,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: radii.xl,
    marginBottom: spacingY.xs,
  },
  markBtnText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    color: colors.white,
  },
  integrationCard: {
    marginBottom: spacingY.md,
  },
  timelineRow: {
    flexDirection: 'row',
    marginBottom: 0,
  },
  timelineLeft: {
    alignItems: 'center',
    width: 32,
    marginRight: 10,
  },
  timelineCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineNum: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.tiny,
    color: colors.white,
  },
  timelineLine: {
    width: 1,
    flex: 1,
    backgroundColor: colors.border,
    minHeight: 16,
  },
  timelineText: {
    flex: 1,
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.textDark,
    lineHeight: 20,
    paddingBottom: spacingY.sm,
  },
  integrationNote: {
    backgroundColor: colors.secondary_10,
    borderRadius: radii.md,
    padding: spacingX.sm,
    marginTop: spacingY.xs,
  },
  integrationNoteText: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.secondary,
    lineHeight: 20,
  },
});

export default RateControlStep;
